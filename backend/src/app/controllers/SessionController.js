import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import Company from '../models/Company';
import Administrator from '../models/Administrator';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { email, password } = req.body;

    const company = await Company.findOne({ where: { email } });

    if (company) {
      if (!(await company.checkPassword(password))) {
        return res
          .status(401)
          .json({ error: 'Verifique se a senha ou o e-mail estão corretos.' });
      }

      const { id, name, typology, status } = company;

      return res.json({
        user: { id, typology, name, email, status },
        token: jwt.sign({ id, admin: false }, authConfig.secret, {
          expiresIn: authConfig.expiresIn,
        }),
      });
    }

    const admin = await Administrator.findOne({ where: { email } });

    if (!admin) {
      return res.status(401).json({ error: 'Essa conta não está registrada.' });
    }

    if (!(await admin.checkPassword(password))) {
      return res
        .status(401)
        .json({ error: 'Verifique se a senha ou o e-mail estão corretos.' });
    }

    const { id, name } = admin;

    return res.json({
      user: { id, name, email, admin: true },
      token: jwt.sign({ id, admin: true }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}
export default new SessionController();
