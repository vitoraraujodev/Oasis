import * as Yup from 'yup';
import Company from '../../models/Company';
import Industrial from '../../models/EnvironAspect/Industrial';

class IndustrialController {
  async store(req, res) {
    const schema = Yup.object().shape({
      water_body: Yup.string().required(),
      license: Yup.string().required(),
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

    const industrial = await Industrial.findOne({
      where: { company_id: req.companyId },
    });

    if (industrial) {
      const { id, water_body, license } = await industrial.update(req.body);

      return res.json({
        id,
        water_body,
        license,
      });
    }

    const { id, water_body, license } = await Industrial.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      water_body,
      license,
    });
  }
}

export default new IndustrialController();
