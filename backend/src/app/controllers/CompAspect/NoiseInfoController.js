import * as Yup from 'yup';
import { parseISO, isAfter } from 'date-fns';
import NoiseInfo from '../../models/CompAspect/NoiseInfo';

class NoiseInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      report_date: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Por favor, verifique e tente novamente.',
      });
    }

    if (req.body.report_date === '') req.body.report_date = null;

    const { report_date } = req.body;

    // If date is in future, return
    if (report_date) {
      if (isAfter(parseISO(report_date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const noiseInfo = await NoiseInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (noiseInfo) {
      const { id } = await noiseInfo.update({
        ...req.body,
      });

      return res.json({
        id,
        report_date,
      });
    }

    const { id } = await NoiseInfo.create({
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
