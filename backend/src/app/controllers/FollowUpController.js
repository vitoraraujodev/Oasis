import ContactInfo from '../models/ContactInfo';
import ContactManager from '../models/ContactManager';
import TechnicalManager from '../models/TechnicalManager';

class FollowUpController {
  async index(req, res) {
    const contactInfo = await ContactInfo.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'phone_number', 'start_at', 'end_at'],
    });

    const contactManager = await ContactManager.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    const technicalManager = await TechnicalManager.findOne({
      where: { company_id: req.companyId },
      attributes: [
        'id',
        'name',
        'cpf',
        'email',
        'phone_number',
        'qualification',
        'licensure_code',
      ],
    });

    return res.json({ contactInfo, contactManager, technicalManager });
  }
}

export default new FollowUpController();
