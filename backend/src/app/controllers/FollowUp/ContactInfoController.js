import * as Yup from 'yup';
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
