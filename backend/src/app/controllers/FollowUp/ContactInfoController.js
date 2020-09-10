import * as Yup from 'yup';
import Company from '../../models/Company';
import ContactInfo from '../../models/FollowUp/ContactInfo';

class ContactInfoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      phone_number: Yup.string().required(),
      start_at: Yup.number().required(),
      end_at: Yup.number().required(),
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

    const contactInfo = await ContactInfo.findOne({
      where: { company_id: req.companyId },
    });

    if (contactInfo) {
      const { id, phone_number, start_at, end_at } = await contactInfo.update(
        req.body
      );

      return res.json({
        id,
        phone_number,
        start_at,
        end_at,
      });
    }

    const { id, phone_number, start_at, end_at } = await ContactInfo.create({
      ...req.body,
      company_id: req.companyId,
    });

    return res.json({
      id,
      phone_number,
      start_at,
      end_at,
    });
  }
}

export default new ContactInfoController();
