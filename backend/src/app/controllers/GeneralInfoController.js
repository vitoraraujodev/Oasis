import Address from '../models/Address';
import Representative from '../models/Representative';
import History from '../models/History';
import OperatingInfo from '../models/OperatingInfo';
import Shift from '../models/Shift';

class AddressController {
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

export default new AddressController();
