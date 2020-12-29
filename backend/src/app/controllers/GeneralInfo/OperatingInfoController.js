import * as Yup from 'yup';
import { parseISO, isAfter, getYear } from 'date-fns';
import Company from '../../models/Company';
import OperatingInfo from '../../models/GeneralInfo/OperatingInfo';
import Shift from '../../models/GeneralInfo/Shift';

class OperatingInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date().required(),
      rural: Yup.boolean().required(),
      registration: Yup.boolean().when('rural', (rural, field) =>
        rural === true ? field.required() : field
      ),
      observation: Yup.string(),
      shifts: Yup.array().of(
        Yup.object().shape({
          id: Yup.number(),
          start_at: Yup.number().required(),
          end_at: Yup.number().required(),
          week: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Por favor, verifique e tente novamente.',
      });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada.' });
    }

    const { date } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const year = getYear(parseISO(date));

    // Checks if year is after 1989, if so, rural is not needed
    if (year > 1989) {
      req.body.rural = false;
    }

    // If rural is false, registration must be false
    if (req.body.rural === false) req.body.registration = false;

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

    const operatingInfo = await OperatingInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (!operatingInfo) {
      // Creates new Operating Info
      await OperatingInfo.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all Operating Info's Shifts
          if (shifts.length > 0) {
            const newShifts = shifts.map((shift) => ({
              ...shift,
              operating_info_id: result.id,
            }));
            await Shift.bulkCreate(newShifts);
          }
          return result;
        })
        .then(async (result) =>
          // Find Operating Info with all it's Shifts
          OperatingInfo.findByPk(result.id, {
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
                  'start_at',
                  'end_at',
                  'week',
                  'operating_info_id',
                ],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    } else {
      // If Operating Info already exists, updates it
      const operatingInfoShits = await Shift.findAll({
        where: { operating_info_id: operatingInfo.id },
      });

      await operatingInfo
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates/update all Operating Info's Shifts
          if (shifts.length > 0) {
            const newShifts = shifts.map((shift) => ({
              ...shift,
              operating_info_id: result.id,
            }));
            await Shift.bulkCreate(newShifts, {
              updateOnDuplicate: ['start_at', 'end_at', 'week'],
            });
          }
          return result;
        })
        .then(async (result) => {
          // Delete Operating Info's Shifts
          const deleteShifts = operatingInfoShits.filter(
            (opShift) => !shifts.find((shift) => shift.id === opShift.id)
          );
          if (deleteShifts.length > 0)
            await Shift.destroy({
              where: { id: deleteShifts.map((shift) => shift.id) },
            });
          return result;
        })
        .then(async (result) =>
          // Find Operating Info with all it's Shifts
          OperatingInfo.findByPk(result.id, {
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
                  'start_at',
                  'end_at',
                  'week',
                  'operating_info_id',
                ],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    }
  }
}

export default new OperatingInfoController();
