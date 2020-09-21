import * as Yup from 'yup';
import Company from '../../models/Company';
import NoiseInfo from '../../models/CompAspect/NoiseInfo';

class NoiseInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      report_date: Yup.date().required(),
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

    const noiseInfo = await NoiseInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (noiseInfo) {
      const { id, report_date } = await noiseInfo.update({
        ...req.body,
      });

      return res.json({
        id,
        report_date,
      });
    }

    const { id, report_date } = await NoiseInfo.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      report_date,
    });
  }
}

export default new NoiseInfoController();
