import * as Yup from 'yup';
import Company from '../models/Company';

class CompanyController {
  async index(req, res) {
    if (!req.admin) {
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para isso.' });
    }

    const companies = await Company.findAll({
      attributes: ['id', 'name', 'email', 'typology', 'status', 'createdAt'],
    });

    return res.json(companies);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      typology: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      confirmPassword: Yup.string()
        .required()
        .oneOf(
          [Yup.ref('password'), null],
          'Confirme sua senha corretamente .'
        ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findOne({
      where: { email: req.body.email },
    });

    if (companyExists) {
      return res.status(400).json({ error: 'Esse e-mail já está em uso' });
    }

    const { id, name, email, typology, status } = await Company.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      typology,
      status,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      typology: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const mail = req.body.email;
    const { oldPassword } = req.body;

    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json({
        error: 'Empresa não registrada. Verifique os dados e tente novamente.',
      });
    }

    if (mail && mail !== company.email) {
      const companyExists = await Company.findOne({
        where: { email: mail },
      });

      if (companyExists) {
        return res.status(400).json({ error: 'E-mail já está em uso.' });
      }
    }

    if (oldPassword && !(await company.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha antiga incorreta.' });
    }

    const { id, name, email, typology, status } = await company.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      typology,
      status,
    });
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    if (!company.id === req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar essa empresa.');
    }

    await company.destroy();

    return res.json({ okay: true });
  }
}

export default new CompanyController();
