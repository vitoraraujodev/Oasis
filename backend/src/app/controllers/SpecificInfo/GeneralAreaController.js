import * as Yup from 'yup';
import fs from 'fs';
import { resolve } from 'path';
import GeneralArea from '../../models/SpecificInfo/GeneralArea';
import File from '../../models/SpecificInfo/File';

class GeneralAreaController {
  async store(req, res) {
    const schema = Yup.object().shape({
      area: Yup.number().required(),
      image_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação dos dados.' });
    }

    const { image_id } = req.body;

    if (!image_id) {
      return res.status(400).json({
        error: 'Por favor, envie uma imagem panorâmica da sua empresa.',
      });
    }

    const generalArea = await GeneralArea.findOne({
      where: { company_id: req.companyId },
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path'],
        },
      ],
    });

    if (generalArea) {
      if (generalArea.image && image_id !== generalArea.image.id) {
        const file = await File.findByPk(image_id);

        if (!file)
          return res.status(400).json('Imagem panorâmica não está registrada.');

        fs.unlink(
          resolve(
            __dirname,
            '..',
            '..',
            '..',
            '..',
            'tmp',
            'uploads',
            generalArea.image.path
          ),
          (err) => {
            if (err) throw err;
          }
        );

        await generalArea.image.destroy();
      }

      await generalArea.update({
        ...req.body,
      });
    } else {
      await GeneralArea.create({
        ...req.body,
        company_id: req.companyId,
      });
    }

    const { id, area, image } = await GeneralArea.findOne({
      where: { company_id: req.companyId },
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json({ id, area, image });
  }
}

export default new GeneralAreaController();
