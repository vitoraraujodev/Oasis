import * as Yup from 'yup';
import Company from '../../models/Company';
import SpecificArea from '../../models/SpecificInfo/SpecificArea';
import Characteristic from '../../models/SpecificInfo/Characteristic';
import AreaCharacteristic from '../../models/SpecificInfo/AreaCharacteristic';

class SpecificAreaController {
  async store(req, res) {
    const schema = Yup.object().shape({
      kind: Yup.string().required(),
      area: Yup.number().required(),
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

    const specificArea = await SpecificArea.findByPk(req.body.id);

    const { characteristics } = req.body;

    const defaultCharacteristics = await Characteristic.findAll();

    const invalid = characteristics
      ? characteristics.filter(
          (characteristic) =>
            !defaultCharacteristics.find(
              (defaultCharacteristic) =>
                defaultCharacteristic.id === characteristic
            )
        )
      : [];

    if (invalid.length >= 1) {
      return res
        .status(400)
        .json({ error: 'Essa característica não está registrada.' });
    }

    // If Area already exists, update it and it's characteristics
    if (specificArea) {
      const areaCharacteristics = await AreaCharacteristic.findAll({
        where: { area_id: specificArea.id },
        attributes: ['id', 'area_id', 'characteristic_id'],
      });

      await specificArea
        .update({
          ...req.body,
        })
        .then(async (result) => {
          // Creates all new Characteristics
          if (characteristics && characteristics.length > 0) {
            const newCharacteristics = characteristics.filter(
              (characteristic) =>
                !areaCharacteristics.find(
                  (areaCharacteristic) =>
                    areaCharacteristic.characteristic_id === characteristic
                )
            );
            if (newCharacteristics.length > 0) {
              await AreaCharacteristic.bulkCreate(
                newCharacteristics.map((characteristic) => ({
                  characteristic_id: characteristic,
                  area_id: specificArea.id,
                }))
              );
            }
          }
          return result;
        })
        .then(async (result) => {
          // Deletes not selected Characteristics
          if (characteristics && areaCharacteristics.length > 0) {
            const deleteCharacteristics = areaCharacteristics.filter(
              (areaCharacteristic) =>
                !characteristics.find(
                  (characteristic) =>
                    characteristic === areaCharacteristic.characteristic_id
                )
            );
            if (deleteCharacteristics.length > 0)
              await AreaCharacteristic.destroy({
                where: {
                  id: deleteCharacteristics.map(
                    (characteristic) => characteristic.id
                  ),
                },
              });
          }
          return result;
        })
        .then(async (result) =>
          SpecificArea.findByPk(result.id, {
            attributes: ['id', 'area', 'kind'],
            include: [
              {
                model: Characteristic,
                as: 'characteristics',
                attributes: ['id', 'title'],
                through: {
                  model: AreaCharacteristic,
                },
              },
            ],
          })
        )
        .then((result) => res.json(result));
    } else {
      // Creates new Area
      await SpecificArea.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          // Creates all new Characteristics
          if (characteristics && characteristics.length > 0) {
            const newCharacteristics = characteristics.map(
              (characteristic) => ({
                characteristic_id: characteristic,
                area_id: result.id,
              })
            );
            if (newCharacteristics.length > 0)
              await AreaCharacteristic.bulkCreate(newCharacteristics);
          }
          return result;
        })
        .then(async (result) =>
          SpecificArea.findByPk(result.id, {
            attributes: ['id', 'area', 'kind'],
            include: [
              {
                model: Characteristic,
                as: 'characteristics',
                attributes: ['id', 'title'],
                through: {
                  model: AreaCharacteristic,
                },
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

    const specificArea = await SpecificArea.findByPk(req.params.id);

    if (!specificArea)
      return res.status(400).json('Essa área não está registrada.');

    if (specificArea.company_id !== req.companyId) {
      return res
        .status(401)
        .json('Você não tem autorização para deletar essa área.');
    }

    await specificArea.destroy();

    return res.json({ okay: true });
  }
}

export default new SpecificAreaController();
