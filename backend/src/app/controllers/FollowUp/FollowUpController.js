import ContactInfo from '../../models/FollowUp/ContactInfo';
import ContactManager from '../../models/FollowUp/ContactManager';
import TechnicalManager from '../../models/FollowUp/TechnicalManager';

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
