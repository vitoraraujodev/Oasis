import Emission from '../../models/CompAspect/Emission';
import EmissionInfo from '../../models/CompAspect/EmissionInfo';
import Noise from '../../models/CompAspect/Noise';
import NoiseInfo from '../../models/CompAspect/NoiseInfo';
import Risk from '../../models/CompAspect/Risk';
import RiskStorage from '../../models/CompAspect/RiskStorage';

class CompAspectController {
  async index(req, res) {
    const emissions = await Emission.findAll({
      where: { company_id: req.companyId },
      order: [
        ['source', 'ASC'],
        ['pollutant', 'ASC'],
      ],
      attributes: [
        'id',
        'source',
        'pollutant',
        'unit',
        'concentration',
        'control_system',
      ],
    });

    const emissionInfo = await EmissionInfo.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'promonAir', 'fleet', 'procon'],
    });

    const risks = await Risk.findAll({
      order: [['substance', 'ASC']],
      attributes: ['id', 'substance', 'physical_state'],
      include: [
        {
          model: RiskStorage,
          as: 'storages',
          order: [['identification', 'ASC']],
          attributes: ['id', 'identification', 'amount', 'capacity', 'unit'],
        },
      ],
    });

    const noises = await Noise.findAll({
      where: { company_id: req.companyId },
      order: [['source', 'ASC']],
      attributes: ['id', 'source', 'protection'],
    });

    const noiseInfo = await NoiseInfo.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'report_date'],
    });

    return res.json({ emissions, emissionInfo, risks, noises, noiseInfo });
  }
}

export default new CompAspectController();
