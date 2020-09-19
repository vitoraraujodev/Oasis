import Address from '../../models/GeneralInfo/Address';
import Representative from '../../models/GeneralInfo/Representative';
import History from '../../models/GeneralInfo/History';
import OperatingInfo from '../../models/GeneralInfo/OperatingInfo';
import Shift from '../../models/GeneralInfo/Shift';

class GeneralInfoController {
  async index(req, res) {
    const address = await Address.findOne({
      where: { company_id: req.companyId },
      attributes: [
        'id',
        'cep',
        'city',
        'neighborhood',
        'municipality',
        'street',
        'number',
        'complement',
      ],
    });

    const representative = await Representative.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    const history = await History.findAll({
      where: { company_id: req.companyId },
      order: [['date', 'DESC']],
      attributes: ['id', 'instrument', 'number', 'process', 'date'],
    });

    const operatingInfo = await OperatingInfo.findOne({
      where: { company_id: req.companyId },
      attributes: [
        'id',
        'date',
        'rural',
        'registration',
        'observation',
        'company_id',
      ],
      include: [
        {
          model: Shift,
          as: 'shifts',
          order: [
            ['week', 'DESC'],
            ['start_at', 'ASC'],
          ],
          attributes: [
            'id',
            'kind',
            'start_at',
            'end_at',
            'week',
            'operating_info_id',
          ],
        },
      ],
    });

    return res.json({ address, representative, history, operatingInfo });
  }
}

export default new GeneralInfoController();
