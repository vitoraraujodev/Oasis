import * as Yup from 'yup';
import Company from '../models/Company';
import TechnicalManager from '../models/TechnicalManager';

class TechnicalManagerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      email: Yup.string().email().required(),
      phone_number: Yup.string().required(),
      qualification: Yup.string().required(),
      licensure_code: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada' });
    }

    const technicalManager = await TechnicalManager.findOne({
      where: { company_id: req.companyId },
    });

    if (technicalManager) {
      const {
        id,
        name,
        email,
        cpf,
        phone_number,
        qualification,
        licensure_code,
      } = await technicalManager.update(req.body);

      return res.json({
        id,
        name,
        email,
        cpf,
        phone_number,
        qualification,
        licensure_code,
      });
    }

    const {
      id,
      name,
      email,
      cpf,
      phone_number,
      qualification,
      licensure_code,
    } = await TechnicalManager.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      name,
      email,
      cpf,
      phone_number,
      qualification,
      licensure_code,
    });
  }
}

export default new TechnicalManagerController();
