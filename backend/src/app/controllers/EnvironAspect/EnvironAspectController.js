import WaterSupply from '../../models/EnvironAspect/WaterSupply';
import WaterUse from '../../models/EnvironAspect/WaterUse';
import Sanitary from '../../models/EnvironAspect/Sanitary';
import Effluent from '../../models/EnvironAspect/Effluent';
import Residue from '../../models/EnvironAspect/Residue';
import ResidueInfo from '../../models/EnvironAspect/ResidueInfo';

class EnvironAspectController {
  async index(req, res) {
    const waterSupplies = await WaterSupply.findAll({
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
        'water_body',
        'license',
        'water_body',
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
        'license',
        'water_body',
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
        'license',
        'water_body',
      ],
    });

    const sanitary = await Sanitary.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'kitchen', 'theoric_flow', 'declaration'],
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
        'capacity',
        'capacity_unit',
        'storage_form',
        'storage_location',
      ],
    });

    const residueInfo = await ResidueInfo.findOne({
      where: { company_id: req.companyId },
      attributes: ['id', 'manifest', 'inventory'],
    });

    return res.json({
      waterSupplies,
      sanitaryEffluents,
      industrialEffluents,
      oilyEffluents,
      sanitary,
      residues,
      residueInfo,
    });
  }
}

export default new EnvironAspectController();
