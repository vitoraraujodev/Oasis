import * as Yup from 'yup';
import Company from '../../models/Company';
import ResidueInfo from '../../models/EnvironAspect/ResidueInfo';

class ResidueInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      manifest: Yup.boolean().required(),
      inventory: Yup.boolean().required(),
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

    const residueInfo = await ResidueInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (residueInfo) {
      const { id, manifest, inventory } = await residueInfo.update({
        ...req.body,
      });

      return res.json({
        id,
        manifest,
        inventory,
      });
    }

    const { id, manifest, inventory } = await ResidueInfo.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      manifest,
      inventory,
    });
  }
}

export default new ResidueInfoController();
