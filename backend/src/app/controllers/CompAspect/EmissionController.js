import * as Yup from 'yup';
import Emission from '../../models/CompAspect/Emission';

class EmissionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      source: Yup.string().required(),
      pollutant: Yup.string().required(),
      unit: Yup.string().required(),
      concentration: Yup.number().required(),
      control_system: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error:
          'Falha na validação dos dados. Por favor, verifique e tente novamente.',
      });
    }

    const emission = await Emission.findByPk(req.body.id);

    if (emission) {
      const {
        id,
        source,
        pollutant,
        unit,
        concentration,
        control_system,
      } = await emission.update({
        ...req.body,
      });

      return res.json({
        id,
        source,
        pollutant,
        unit,
        concentration,
        control_system,
      });
    }

    const {
      id,
      source,
      pollutant,
      unit,
      concentration,
      control_system,
    } = await Emission.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      source,
      pollutant,
      unit,
      concentration,
      control_system,
    });
  }

  async delete(req, res) {
    const emission = await Emission.findByPk(req.params.id);

    if (!emission)
      return res
        .status(400)
        .json('Essa emissão atmosférica não estão registrados.');

    if (emission.company_id !== req.companyId) {
      return res
        .status(401)
        .json(
          'Você não tem autorização para deletar essa emissão atmosférica.'
        );
    }

    await emission.destroy();

    return res.json({ okay: true });
  }
}

export default new EmissionController();
