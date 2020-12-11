import * as Yup from 'yup';
import Company from '../../models/Company';
import Employee from '../../models/SpecificInfo/Employee';

class EmployeeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kind: Yup.string().required(),
      amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const employee = await Employee.findByPk(req.body.id);

    if (employee) {
      const { id, kind, amount } = await employee.update({
        ...req.body,
      });

      return res.json({
        id,
        kind,
        amount,
      });
    }

    const { id, kind, amount } = await Employee.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      kind,
      amount,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const employee = await Employee.findByPk(req.params.id);

    if (!employee)
      return res.status(400).json('Esses Funcionários não estão registrados.');

    if (employee.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esses Funcionários.');
    }

    await employee.destroy();

    return res.json({ okay: true });
  }
}

export default new EmployeeController();
