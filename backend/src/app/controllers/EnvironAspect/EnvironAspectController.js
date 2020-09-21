import WaterSupply from '../../models/EnvironAspect/WaterSupply';
import WaterUse from '../../models/EnvironAspect/WaterUse';
import Industrial from '../../models/EnvironAspect/Industrial';
import Oily from '../../models/EnvironAspect/Oily';
import Sanitary from '../../models/EnvironAspect/Sanitary';
import Effluent from '../../models/EnvironAspect/Effluent';
import Residue from '../../models/EnvironAspect/Residue';
import ResidueInfo from '../../models/EnvironAspect/ResidueInfo';

class EnvironAspectController {
  async index(req, res) {
    const waterSupply = await WaterSupply.findAll({
      where: { company_id: req.companyId },
      order: [['source', 'ASC']],
      attributes: ['id', 'source', 'license'],
      include: [
        {
          model: WaterUse,
          as: 'uses',
          order: [['usage', 'ASC']],
          attributes: ['id', 'usage', 'flow'],
        },
      ],
    });

    const sanitaryEffluents = await Effluent.findAll({
      where: { company_id: req.companyId, kind: 'sanitary' },
      order: [
        ['kind', 'ASC'],
        ['source', 'ASC'],
      ],
      attributes: [
        'id',
        'kind',
        'source',
        'flow',
        'treatment',
        'quantity',
        'capacity',
      ],
    });

    const oilyEffluents = await Effluent.findAll({
      where: { company_id: req.companyId, kind: 'oily' },
      order: [
        ['kind', 'ASC'],
        ['source', 'ASC'],
      ],
      attributes: [
        'id',
        'kind',
        'source',
        'flow',
        'treatment',
        'quantity',
        'capacity',
      ],
    });

    const industrialEffluents = await Effluent.findAll({
      where: { company_id: req.companyId, kind: 'industrial' },
      order: [
        ['kind', 'ASC'],
        ['source', 'ASC'],
      ],
      attributes: [
        'id',
        'kind',
        'source',
        'flow',
        'treatment',
        'quantity',
        'capacity',
      ],
    });

    const sanitary = await Sanitary.findOne({
      where: { company_id: req.companyId },
      attributes: [
        'id',
        'water_body',
        'kitchen',
        'theoric_flow',
        'declaration',
      ],
    });

    const industrial = await Industrial.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'water_body', 'license'],
    });

    const oily = await Oily.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'water_body'],
    });

    const residues = await Residue.findAll({
      where: { company_id: req.companyId },
      order: [['identification', 'ASC']],
      attributes: [
        'identification',
        'physical_state',
        'constituent',
        'source',
        'treatment',
        'classification',
        'quantity',
        'quantity_unit',
        'reservior',
        'capacity',
        'capacity_unit',
        'removal_frequency',
        'transport',
        'packaging',
      ],
    });

    const residueInfo = await ResidueInfo.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'manifest', 'inventory'],
    });

    return res.json({
      waterSupply,
      sanitaryEffluents,
      industrialEffluents,
      oilyEffluents,
      sanitary,
      industrial,
      oily,
      residues,
      residueInfo,
    });
  }
}

export default new EnvironAspectController();
