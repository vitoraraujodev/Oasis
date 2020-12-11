import * as Yup from 'yup';
import Sanitary from '../../models/EnvironAspect/Sanitary';
import Employee from '../../models/SpecificInfo/Employee';

class SanitaryController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kitchen: Yup.boolean().required(),
      declaration: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const sanitary = await Sanitary.findOne({
      where: { company_id: req.companyId },
    });

    const employees = await Employee.findAll({
      where: { company_id: req.companyId },
    });

    if (employees.length === 0)
      return res.status(400).json({
        error: 'É necessário ter a parte de Funcionários preenchida.',
      });

    // Gets total number of employees from company
    const employeesNumber = employees
      .map((employee) => employee.amount)
      .reduce((total, amount) => total + amount);

    const { kitchen } = req.body;

    // The math of theoric flow is based on the number of employees and if there is industrial kitchen
    const theoric_flow =
      (kitchen ? employeesNumber * 95 : employeesNumber * 70) / 1000;

    if (sanitary) {
      const { id, declaration } = await sanitary.update({
        ...req.body,
        theoric_flow,
      });

      return res.json({
        id,
        kitchen,
        theoric_flow,
        declaration,
      });
    }

    const { id, declaration } = await Sanitary.create({
      ...req.body,
      theoric_flow,
      company_id: req.companyId,
    });

    return res.json({
      id,
      kitchen,
      theoric_flow,
      declaration,
    });
  }
}

export default new SanitaryController();
