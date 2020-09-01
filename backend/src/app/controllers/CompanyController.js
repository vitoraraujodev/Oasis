import * as Yup from 'yup';
import Company from '../models/Company';

class CompanyController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      typology: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      confirm_password: Yup.string().oneOf(
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
      return res.status(400).json({ errer: 'Esse e-mail já está em uso' });
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
}

export default new CompanyController();
