import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const id = req.headers.company;

  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não informado.' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    // Gets from token if user is admin or company
    req.admin = decoded.admin;

    if (decoded.admin) {
      // Uses the company id from header
      req.companyId = id;
    } else {
      // Uses the company id from token
      req.companyId = decoded.id;
    }

    return next();
  } catch (err) {
    return res.status(401).json({
      error:
        'Token de autenticação inválido. Por favor, tente acessar sua conta novamente.',
    });
  }
};
