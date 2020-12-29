import * as Yup from 'yup';
import Specific from '../../models/SpecificInfo/Specific';

class SpecificController {
  async store(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Por favor, verifique e tente novamente.',
      });
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
