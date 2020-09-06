import * as Yup from 'yup';
import { parseISO, isAfter, getYear } from 'date-fns';
import Company from '../models/Company';
import OperatingInfo from '../models/OperatingInfo';
import Shift from '../models/Shift';

class OperatingInfoController {
  async store(req, res) { // eslint-disable-line
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      rural: Yup.boolean(),
      registration: Yup.boolean().when('rural', (rural, field) =>
        rural === true ? field.required() : field
      ),
      observation: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada.' });
    }

    const { body } = req;

    const { date } = body;
    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const year = getYear(parseISO(date));

    // Checks if year is after 1989, if so, rural is not needed
    if (year > 1989) {
      body.rural = false;
    }

    // If rural is false, registration must be false
    if (body.rural === false) body.registration = false;

    const { shifts } = req.body;
    // Checks if there are errors in shifts before creating everything
    if (shifts && shifts.length > 0) {
      let hourError = false;
      shifts.forEach((shift) => {
        if (shift.start_at >= shift.end_at) {
          hourError = true;
        }
      });

      if (hourError) {
        return res.status(400).json({
          error:
            'A hora de início do turno não pode vir depois da hora do fim.',
        });
      }
    }

    async function loadOperatingInfo(id) {
      const operatingInfo = await OperatingInfo.findByPk(id, {
        attributes: [
          'id',
          'date',
          'rural',
          'registration',
          'observation',
          'company_id',
        ],
        include: [
          {
            model: Shift,
            as: 'shifts',
            order: [
              ['week', 'DESC'],
              ['start_at', 'ASC'],
            ],
            attributes: [
              'id',
              'kind',
              'start_at',
              'end_at',
              'week',
              'operating_info_id',
            ],
          },
        ],
      });

      return operatingInfo;
    }

    const operatingInfoExists = await OperatingInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (!operatingInfoExists) {
      await OperatingInfo.create({
        ...body,
        company_id: req.companyId,
      })
        .then(async (operatingInfo) => {
          const newShifts = shifts.map((shift) => ({
            ...shift,
            operating_info_id: operatingInfo.id,
          }));
          await Shift.bulkCreate(newShifts);
          return operatingInfo;
        })
        .then((operatingInfo) => loadOperatingInfo(operatingInfo.id))
        .then((result) => res.json(result));
    }
  }
}

export default new OperatingInfoController();
