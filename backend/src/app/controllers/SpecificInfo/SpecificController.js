import * as Yup from 'yup';
import Company from '../../models/Company';
import Specific from '../../models/SpecificInfo/Specific';

class SpecificController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string().required(),
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

    const specific = await Specific.findOne({
      where: { company_id: req.companyId },
    });

    if (specific) {
      const { id, cnpj } = await specific.update(req.body);

      return res.json({
        id,
        cnpj,
      });
    }

    const { id, cnpj } = await Specific.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      cnpj,
    });
  }
}

export default new SpecificController();
