import * as Yup from 'yup';
import Company from '../../models/Company';
import EmissionInfo from '../../models/CompAspect/EmissionInfo';

class EmissionInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      promonAir: Yup.boolean().required(),
      fleet: Yup.boolean().required(),
      procon: Yup.boolean().required(),
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

    const emissionInfo = await EmissionInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (emissionInfo) {
      const { id, promonAir, fleet, procon } = await emissionInfo.update({
        ...req.body,
      });

      return res.json({
        id,
        promonAir,
        fleet,
        procon,
      });
    }

    const { id, promonAir, fleet, procon } = await EmissionInfo.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      promonAir,
      fleet,
      procon,
    });
  }
}

export default new EmissionInfoController();
