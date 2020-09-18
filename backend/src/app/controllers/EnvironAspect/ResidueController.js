import * as Yup from 'yup';
import Company from '../../models/Company';
import Residue from '../../models/EnvironAspect/Residue';

class ResidueController {
  async store(req, res) {
    const schema = Yup.object().shape({
      identification: Yup.string().required(),
      physical_state: Yup.string().required(),
      constituent: Yup.string().required(),
      source: Yup.string().required(),
      treatment: Yup.string().required(),
      classification: Yup.string(),
      quantity: Yup.number().required(),
      quantity_unit: Yup.string().required(),
      reservior: Yup.string().required(),
      capacity: Yup.number().required(),
      capacity_unit: Yup.string().required(),
      removal_frequency: Yup.number().required(),
      transport: Yup.string().required(),
      packaging: Yup.string().required(),
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

    const residue = await Residue.findByPk(req.body.id);

    if (residue) {
      const {
        id,
        identification,
        physical_state,
        constituent,
        source,
        treatment,
        classification,
        quantity,
        quantity_unit,
        reservior,
        capacity,
        capacity_unit,
        removal_frequency,
        transport,
        packaging,
      } = await residue.update({
        ...req.body,
      });

      return res.json({
        id,
        identification,
        physical_state,
        constituent,
        source,
        treatment,
        classification,
        quantity,
        quantity_unit,
        reservior,
        capacity,
        capacity_unit,
        removal_frequency,
        transport,
        packaging,
      });
    }

    const {
      id,
      identification,
      physical_state,
      constituent,
      source,
      treatment,
      classification,
      quantity,
      quantity_unit,
      reservior,
      capacity,
      capacity_unit,
      removal_frequency,
      transport,
      packaging,
    } = await Residue.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      identification,
      physical_state,
      constituent,
      source,
      treatment,
      classification,
      quantity,
      quantity_unit,
      reservior,
      capacity,
      capacity_unit,
      removal_frequency,
      transport,
      packaging,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const residue = await Residue.findByPk(req.params.id);

    if (!residue)
      return res.status(400).json('Esse resíduo não estão registrados.');

    if (residue.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse resíduo.');
    }

    await residue.destroy();

    return res.json({ okay: true });
  }
}

export default new ResidueController();
