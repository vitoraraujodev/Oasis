import * as Yup from 'yup';
import Company from '../../models/Company';
import Supply from '../../models/ProductiveProcess/Supply';
import SupplyStorage from '../../models/ProductiveProcess/SupplyStorage';

class SupplyController {
  async store(req, res) {
    const schema = Yup.object().shape({
      identification: Yup.string().required(),
      physical_state: Yup.string().required(),
      quantity: Yup.number().required(),
      unit: Yup.string().required(),
      transport: Yup.string().required(),
      packaging: Yup.string().required(),
      storages: Yup.array().of(
        Yup.object().shape({
          id: Yup.number(),
          location: Yup.string().required(),
          identification: Yup.string().required(),
          amount: Yup.number().min(1).required(),
          capacity: Yup.number().required(),
          unit: Yup.string().required(),
        })
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const companyExists = await Company.findByPk(req.companyId);

    if (!companyExists) {
      return res.status(400).json({
        error: 'Essa Empresa não está registrada.',
      });
    }

    const supply = await Supply.findByPk(req.body.id);

    const { storages } = req.body;

    if (!supply) {
      // Creates new Supply
      await Supply.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all Supply's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              supply_id: result.id,
            }));

            await SupplyStorage.bulkCreate(newStorages);
          }
          return result;
        })
        .then(async (result) =>
          // Find Supply with all it's Storages
          Supply.findByPk(result.id, {
            order: [['identification', 'ASC']],
            attributes: [
              'id',
              'identification',
              'physical_state',
              'quantity',
              'unit',
              'transport',
              'packaging',
            ],
            include: [
              {
                model: SupplyStorage,
                as: 'storages',
                order: [
                  ['location', 'ASC'],
                  ['identification', 'ASC'],
                ],
                attributes: [
                  'id',
                  'location',
                  'identification',
                  'amount',
                  'capacity',
                  'unit',
                ],
              },
            ],
          })
        )
        .then((result) => res.json(result));
    } else {
      const supplyStorages = await SupplyStorage.findAll({
        where: { supply_id: supply.id },
      });
      // If Supply already exists, updates it
      await supply
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates/update all Supply's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              supply_id: result.id,
            }));
            await SupplyStorage.bulkCreate(newStorages, {
              updateOnDuplicate: [
                'location',
                'identification',
                'amount',
                'capacity',
                'unit',
              ],
            });
          }
          return result;
        })
        .then(async (result) => {
          // Delete Supply's Storages
          const deleteStorages = supplyStorages.filter(
            (supplyStorage) =>
              !storages.find((storage) => storage.id === supplyStorage.id)
          );
          if (deleteStorages.length > 0)
            await SupplyStorage.destroy({
              where: { id: deleteStorages.map((storage) => storage.id) },
            });
          return result;
        })
        .then(async (result) =>
          // Find Supply with all it's Storages
          Supply.findByPk(result.id, {
            order: [['identification', 'ASC']],
            attributes: [
              'id',
              'identification',
              'physical_state',
              'quantity',
              'unit',
              'transport',
              'packaging',
            ],
            include: [
              {
                model: SupplyStorage,
                as: 'storages',
                order: [['identification', 'ASC']],
                attributes: [
                  'id',
                  'location',
                  'identification',
                  'amount',
                  'capacity',
                  'unit',
                ],
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

    const supply = await Supply.findByPk(req.params.id);

    if (!supply)
      return res.status(400).json('Esse insumo não está registrado.');

    if (supply.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse insumo.');
    }

    await supply.destroy();

    return res.json({ okay: true });
  }
}

export default new SupplyController();
