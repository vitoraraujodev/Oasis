import * as Yup from 'yup';
import Company from '../models/Company';
import ContactManager from '../models/ContactManager';

class ContactManagerController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      cpf: Yup.string().required(),
      email: Yup.string().email().required(),
      phone_number: Yup.string().required(),
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

    const contactManager = await ContactManager.findOne({
      where: { company_id: req.companyId },
    });

    if (contactManager) {
      const {
        id,
        name,
        email,
        cpf,
        phone_number,
      } = await contactManager.update(req.body);

      return res.json({
        id,
        name,
        email,
        cpf,
        phone_number,
      });
    }

    const { id, name, email, cpf, phone_number } = await ContactManager.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      name,
      email,
      cpf,
      phone_number,
    });
  }
}

export default new ContactManagerController();
