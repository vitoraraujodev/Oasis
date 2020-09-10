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

    if (specificArea) {
      const { id, kind, area } = await specificArea.update({
        ...req.body,
      });
    } else {
      await SpecificArea.create({
        ...req.body,
        company_id: req.companyId,
      })
        .then(async (result) => {
          const { characteristics } = req.body;

          if (characteristics && characteristics.length > 0) {
            const newCharacteristics = characteristics.map(
              (characteristic) => ({
                characteristic_id: characteristic,
                area_id: result.id,
              })
            );

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
