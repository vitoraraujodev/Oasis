import * as Yup from 'yup';
import { parseISO, isAfter, getYear } from 'date-fns';
import Company from '../models/Company';
import OperatingInfo from '../models/OperatingInfo';

class OperatingInfoController {
  async store(req, res) {
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
        .json({ error: 'Essa empresa não está registrada' });
    }

    const operatingInfoExists = await OperatingInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (operatingInfoExists) {
      return res.status(400).json({
        error:
          'Essa empresa já possui informações de funcionamento registradas.',
      });
    }

    const { date, rural, registration, observation } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const year = getYear(parseISO(date));
    let ruralValue = rural;

    // Checks if year is after 1989, if so, rural is not needed
    if (year > 1989) {
      ruralValue = false;
    }

    // If rural is false, registration must be false
    const registrationValue = ruralValue === false ? false : registration;

    const { id } = await OperatingInfo.create({
      date,
      rural: ruralValue,
      registration: registrationValue,
      observation,
      company_id: req.companyId,
    });

    return res.json({
      id,
      date,
      rural,
      registrationValue,
      observation,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      date: Yup.date(),
      rural: Yup.boolean(),
      registration: Yup.boolean().when('rural', (rural, field) =>
        rural === true ? field.required() : field
      ),
      observation: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json({ error: 'Empresa não existe.' });
    }

    const operatingInfo = await OperatingInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (!operatingInfo) {
      return res
        .status(400)
        .json({ error: 'Informações de funcionamento não registrado.' });
    }

    const { date, rural, registration, observation } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const year = getYear(parseISO(date));
    let ruralValue = rural;

    // Checks if year is after 1989, if so, rural is not needed
    if (year > 1989) {
      ruralValue = false;
    }

    // If rural is false, registration must be false
    const registrationValue = ruralValue === false ? false : registration;

    const { id } = await operatingInfo.update({
      date,
      rural: ruralValue,
      registration: registrationValue,
      observation,
    });

    return res.json({
      id,
      date,
      rural: ruralValue,
      registration: registrationValue,
      observation,
    });
  }
}

export default new OperatingInfoController();
