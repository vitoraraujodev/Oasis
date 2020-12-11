import * as Yup from 'yup';
import { parseISO, isAfter } from 'date-fns';
import Company from '../../models/Company';
import Noise from '../../models/CompAspect/Noise';

class NoiseController {
  async store(req, res) {
    const schema = Yup.object().shape({
      source: Yup.string().required(),
      protection: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { report_date } = req.body;

    // If date is in future, return
    if (report_date) {
      if (isAfter(parseISO(report_date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const noise = await Noise.findByPk(req.body.id);

    if (noise) {
      const { id, source, protection } = await noise.update({
        ...req.body,
      });

      return res.json({
        id,
        source,
        protection,
      });
    }

    const { id, source, protection } = await Noise.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      source,
      protection,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const noise = await Noise.findByPk(req.params.id);

    if (!noise)
      return res.status(400).json('Esse ruído não estão registrados.');

    if (noise.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse ruído.');
    }

    await noise.destroy();

    return res.json({ okay: true });
  }
}

export default new NoiseController();
