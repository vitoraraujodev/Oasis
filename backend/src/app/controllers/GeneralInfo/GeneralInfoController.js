import Address from '../../models/GeneralInfo/Address';
import Representative from '../../models/GeneralInfo/Representative';
import History from '../../models/GeneralInfo/History';
import Pending from '../../models/GeneralInfo/Pending';
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

    const representative = await Representative.findAll({
      where: { company_id: req.companyId },
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    const history = await History.findAll({
      where: { company_id: req.companyId },
      order: [['expiration_date', 'ASC']],
      attributes: [
        'id',
        'instrument',
        'number',
        'process',
        'expiration_date',
        'objective',
      ],
    });

    const pending = await Pending.findAll({
      where: { company_id: req.companyId },
      order: [['instrument', 'ASC']],
      attributes: ['id', 'instrument', 'process', 'objective'],
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
            ['week', 'ASC'],
            ['start_at', 'ASC'],
          ],
          attributes: ['id', 'start_at', 'end_at', 'week'],
        },
      ],
    });

    return res.json({
      address,
      representative,
      history,
      pending,
      operatingInfo,
    });
  }
}

export default new GeneralInfoController();
