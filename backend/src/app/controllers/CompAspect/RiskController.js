import * as Yup from 'yup';
import Company from '../../models/Company';
import Risk from '../../models/CompAspect/Risk';
import RiskStorage from '../../models/CompAspect/RiskStorage';

class RiskController {
  async store(req, res) {
    const schema = Yup.object().shape({
      substance: Yup.string().required(),
      storages: Yup.array().of(
        Yup.object().shape({
          id: Yup.number(),
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

    const risk = await Risk.findByPk(req.body.id);

    const { storages } = req.body;

    if (!risk) {
      // Creates new Risk
      await Risk.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all Risk's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              risk_id: result.id,
            }));

            await RiskStorage.bulkCreate(newStorages);
          }
          return result;
        })
        .then(async (result) =>
          // Find Risk with all it's Storages
          Risk.findByPk(result.id, {
            order: [['substance', 'DESC']],
            attributes: ['id', 'substance'],
            include: [
              {
                model: RiskStorage,
                as: 'storages',
                order: [['identification', 'DESC']],
                attributes: [
                  'id',
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
      const riskStorages = await RiskStorage.findAll({
        where: { risk_id: risk.id },
      });
      // If Risk already exists, updates it
      await risk
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates/update all Risk's Storages
          if (storages.length > 0) {
            const newStorages = storages.map((storage) => ({
              ...storage,
              risk_id: result.id,
            }));
            await RiskStorage.bulkCreate(newStorages, {
              updateOnDuplicate: [
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
          // Delete Risk's Storages
          const deleteStorages = riskStorages.filter(
            (riskStorage) =>
              !storages.find((storage) => storage.id === riskStorage.id)
          );
          if (deleteStorages.length > 0)
            await RiskStorage.destroy({
              where: { id: deleteStorages.map((storage) => storage.id) },
            });
          return result;
        })
        .then(async (result) =>
          // Find Risk with all it's Storages
          Risk.findByPk(result.id, {
            order: [['substance', 'DESC']],
            attributes: ['id', 'substance'],
            include: [
              {
                model: RiskStorage,
                as: 'storages',
                order: [['identification', 'DESC']],
                attributes: [
                  'id',
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

    const risk = await Risk.findByPk(req.params.id);

    if (!risk)
      return res.status(400).json('Esse risco ambiental não está registrado.');

    if (risk.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar esse risco ambiental.');
    }

    await Risk.destroy();

    return res.json({ okay: true });
  }
}

export default new RiskController();
