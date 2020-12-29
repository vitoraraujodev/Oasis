import * as Yup from 'yup';
import InstallEmployee from '../../models/SpecificInfo/InstallEmployee';

class InstallEmployeeController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kind: Yup.string().required(),
      amount: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados. Por favor, verifique e tente novamente.' });
    }

    if (req.body.amount <= 0) {
      return res
        .status(400)
        .json({ error: 'Número de funcionários inválido.' });
    }

    const employee = await InstallEmployee.findByPk(req.body.id);

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

    const { id, kind, amount } = await InstallEmployee.create({
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
    const employee = await InstallEmployee.findByPk(req.params.id);

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

export default new InstallEmployeeController();
