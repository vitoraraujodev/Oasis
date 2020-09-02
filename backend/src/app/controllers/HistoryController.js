import * as Yup from 'yup';
import { parseISO, isAfter } from 'date-fns';
import Company from '../models/Company';
import History from '../models/History';

class HistoryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      instrument: Yup.string().required(),
      number: Yup.string().required(),
      process: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res.status(400).json({
        error: 'Essa Empresa não está registrada.',
      });
    }

    const { date } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const { id, instrument, number, process } = await History.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      instrument,
      number,
      process,
      date,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      instrument: Yup.string().required(),
      number: Yup.string().required(),
      process: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json({ error: 'Empresa não existe.' });
    }

    const { date } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const history = await History.findByPk(req.params.id);

    const { id, instrument, number, process } = await history.update(req.body);

    return res.json({
      id,
      instrument,
      number,
      process,
      date,
    });
  }
}

export default new HistoryController();
