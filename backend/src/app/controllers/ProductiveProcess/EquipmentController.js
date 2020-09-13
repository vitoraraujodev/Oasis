import * as Yup from 'yup';
import { parseISO, isAfter } from 'date-fns';
import Company from '../../models/Company';
import Equipment from '../../models/ProductiveProcess/Equipment';

class EquipmentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kind: Yup.string().required(),
      identification: Yup.string().required(),
      amount: Yup.number().required(),
      date: Yup.date().required(),
      capacity: Yup.number().required(),
      capacity_unit: Yup.string().required(),
      fuel: Yup.string().required(),
      consumption: Yup.number().required(),
      parameter: Yup.string().required(),
      value: Yup.number().required(),
      value_unit: Yup.string().required(),
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

    const { date } = req.body;

    // If date is in future, return
    if (date) {
      if (isAfter(parseISO(date), new Date())) {
        return res.status(400).json({ error: 'Data inválida.' });
      }
    }

    const equipment = await Equipment.findByPk(req.body.id);

    if (equipment) {
      const {
        id,
        kind,
        identification,
        amount,
        capacity,
        capacity_unit,
        fuel,
        consumption,
        parameter,
        value,
        value_unit,
      } = await equipment.update({
        ...req.body,
      });

      return res.json({
        id,
        kind,
        identification,
        amount,
        date,
        capacity,
        capacity_unit,
        fuel,
        consumption,
        parameter,
        value,
        value_unit,
      });
    }

    const {
      id,
      kind,
      identification,
      amount,
      capacity,
      capacity_unit,
      fuel,
      consumption,
      parameter,
      value,
      value_unit,
    } = await Equipment.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      kind,
      identification,
      amount,
      date,
      capacity,
      capacity_unit,
      fuel,
      consumption,
      parameter,
      value,
      value_unit,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const equipment = await Equipment.findByPk(req.params.id);

    if (!equipment)
      return res.status(400).json('Esse equipamento não estão registrados.');

    if (equipment.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse equipamento.');
    }

    await equipment.destroy();

    return res.json({ okay: true });
  }
}

export default new EquipmentController();
