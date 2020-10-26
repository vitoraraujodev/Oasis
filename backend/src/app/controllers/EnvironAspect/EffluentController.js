import * as Yup from 'yup';
import Company from '../../models/Company';
import Effluent from '../../models/EnvironAspect/Effluent';

class EffluentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kind: Yup.string().required(),
      source: Yup.string().required(),
      flow: Yup.string().required(),
      treatment: Yup.string().required(),
      quantity: Yup.string(),
      license: Yup.string(),
      water_body: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res.status(400).json({
        error: 'Essa Empresa não está registrada.',
      });
    }

    const { kind, water_body } = req.body;

    if (kind === 'sanitary' && !water_body) {
      return res.status(400).json({
        error: 'Informe o corpo receptor deste efluente.',
      });
    }

    const effluent = await Effluent.findByPk(req.body.id);

    if (effluent) {
      const {
        id,
        source,
        flow,
        treatment,
        quantity,
        license,
      } = await effluent.update({
        ...req.body,
      });

      return res.json({
        id,
        kind,
        source,
        flow,
        treatment,
        quantity,
        water_body,
        license,
      });
    }

    const {
      id,
      source,
      flow,
      treatment,
      quantity,
      license,
    } = await Effluent.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      kind,
      source,
      flow,
      treatment,
      quantity,
      water_body,
      license,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const effluent = await Effluent.findByPk(req.params.id);

    if (!effluent)
      return res.status(400).json('Esse efluente não estão registrados.');

    if (effluent.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse efluente.');
    }

    await effluent.destroy();

    return res.json({ okay: true });
  }
}

export default new EffluentController();
