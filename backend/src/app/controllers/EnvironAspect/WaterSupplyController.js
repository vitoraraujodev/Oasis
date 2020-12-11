import * as Yup from 'yup';
import Company from '../../models/Company';
import WaterSupply from '../../models/EnvironAspect/WaterSupply';
import WaterUse from '../../models/EnvironAspect/WaterUse';

class WaterSupplyController {
  async store(req, res) {
    const schema = Yup.object().shape({
      source: Yup.string().required(),
      license: Yup.string(),
      uses: Yup.array().of(
        Yup.object().shape({
          id: Yup.number(),
          usage: Yup.string().required(),
          flow: Yup.number().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const supply = await WaterSupply.findByPk(req.body.id);

    const { uses } = req.body;

    if (uses.length === 0) {
      return res.status(400).json({
        error: 'Informe os usos da água dessa fonte.',
      });
    }

    if (!supply) {
      // Creates new Water Supply
      await WaterSupply.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all Water Supply's Uses
          if (uses.length > 0) {
            const newUses = uses.map((use) => ({
              ...use,
              supply_id: result.id,
            }));

            await WaterUse.bulkCreate(newUses);
          }
          return result;
        })
        .then(async (result) =>
          // Find Water Supply with all it's Uses
          WaterSupply.findByPk(result.id, {
            order: [['source', 'DESC']],
            attributes: ['id', 'source', 'license'],
            include: [
              {
                model: WaterUse,
                as: 'uses',
                order: [['usage', 'DESC']],
                attributes: ['id', 'usage', 'flow'],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    } else {
      const waterUses = await WaterUse.findAll({
        where: { supply_id: supply.id },
      });
      // If Water Supply already exists, updates it
      await supply
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates/update all Water Supply's uses
          if (uses.length > 0) {
            const newUses = uses.map((use) => ({
              ...use,
              supply_id: result.id,
            }));
            await WaterUse.bulkCreate(newUses, {
              updateOnDuplicate: ['usage', 'flow'],
            });
          }
          return result;
        })
        .then(async (result) => {
          // Delete Water Supply's Uses
          const deleteUses = waterUses.filter(
            (waterUse) => !uses.find((use) => use.id === waterUse.id)
          );
          if (deleteUses.length > 0)
            await WaterUse.destroy({
              where: { id: deleteUses.map((use) => use.id) },
            });
          return result;
        })
        .then(async (result) =>
          // Find Supply with all it's uses
          WaterSupply.findByPk(result.id, {
            order: [['source', 'DESC']],
            attributes: ['id', 'source', 'license'],
            include: [
              {
                model: WaterUse,
                as: 'uses',
                order: [['usage', 'DESC']],
                attributes: ['id', 'usage', 'flow'],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    }
  }

  async delete(req, res) {
    const company = await Company.findByPk(req.companyId);

    if (!company) {
      return res.status(400).json('Empresa não encontrada.');
    }

    const supply = await WaterSupply.findByPk(req.params.id);

    if (!supply)
      return res.status(400).json('Essa fonte de água não está registrado.');

    if (supply.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar essa fonta de água.');
    }

    await supply.destroy();

    return res.json({ okay: true });
  }
}

export default new WaterSupplyController();
