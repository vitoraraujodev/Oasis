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
      storage_form: Yup.string().required(),
      storage_location: Yup.string().required(),
      capacity: Yup.number().required(),
      capacity_unit: Yup.string().required(),
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
        storage_form,
        storage_location,
        capacity,
        capacity_unit,
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
        storage_form,
        storage_location,
        capacity,
        capacity_unit,
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
      storage_form,
      storage_location,
      capacity,
      capacity_unit,
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
      storage_form,
      storage_location,
      capacity,
      capacity_unit,
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
