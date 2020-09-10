import * as Yup from 'yup';
import Company from '../../models/Company';
import Specific from '../../models/SpecificInfo/Specific';

class SpecificController {
  async store(req, res) {
    const schema = Yup.object().shape({
      document_type: Yup.string().required(),
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
      const { id, document_type, cnpj } = await specific.update(req.body);

      return res.json({
        id,
        document_type,
        cnpj,
      });
    }

    const { id, document_type, cnpj } = await Specific.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      document_type,
      cnpj,
    });
  }
}

export default new SpecificController();
