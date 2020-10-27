import * as Yup from 'yup';
import Company from '../../models/Company';
import Pending from '../../models/GeneralInfo/Pending';

class PendingController {
  async store(req, res) {
    const schema = Yup.object().shape({
      instrument: Yup.string().required(),
      process: Yup.string().required(),
      objective: Yup.string().required(),
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

    const pending = await Pending.findByPk(req.body.id);

    if (pending) {
      const { id, instrument, process, objective } = await Pending.update({
        ...req.body,
      });

      return res.json({
        id,
        instrument,
        process,
        objective,
      });
    }

    const { id, instrument, process, objective } = await Pending.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      instrument,
      process,
      objective,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const pending = await Pending.findByPk(req.params.id);

    if (!pending)
      return res
        .status(400)
        .json('Esse processo pendente não está registrado.');

    if (pending.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse processo pendente.');
    }

    await pending.destroy();

    return res.json({ okay: true });
  }
}

export default new PendingController();
