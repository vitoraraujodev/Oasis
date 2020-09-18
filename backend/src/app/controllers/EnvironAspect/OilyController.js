import * as Yup from 'yup';
import Company from '../../models/Company';
import Oily from '../../models/EnvironAspect/Oily';

class OilyController {
  async store(req, res) {
    const schema = Yup.object().shape({
      water_body: Yup.string().required(),
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

    const oily = await Oily.findOne({
      where: { company_id: req.companyId },
    });

    if (oily) {
      const { id, water_body } = await oily.update(req.body);

      return res.json({
        id,
        water_body,
      });
    }

    const { id, water_body } = await Oily.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      water_body,
    });
  }
}

export default new OilyController();
