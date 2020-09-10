import * as Yup from 'yup';
import { parseISO, isAfter } from 'date-fns';
import Company from '../../models/Company';
import History from '../../models/GeneralInfo/History';

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

    const history = await History.findByPk(req.body.id);

    if (history) {
      const { id, instrument, number, process } = await history.update({
        ...req.body,
      });

      return res.json({
        id,
        instrument,
        number,
        process,
        date,
      });
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

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const history = await History.findByPk(req.params.id);

    if (!history)
      return res.status(400).json('Esse Histórico não está registrado.');

    if (history.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse histórico.');
    }

    await history.destroy();

    return res.json({ okay: true });
  }
}

export default new HistoryController();
