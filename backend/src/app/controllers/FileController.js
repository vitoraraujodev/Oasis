import fs from 'fs';
import { resolve } from 'path';

import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const company_id = req.companyId;

    const file = await File.create({
      name,
      path,
      company_id,
    });

    return res.json(file);
  }

  async delete(req, res) {
    const file = await File.findByPk(req.params.id);

    if (!file) {
      return res.status(400).json({ error: 'Imagem não existe.' });
    }

    if (file.company_id !== req.companyId) { // eslint-disable-line
      return res
        .status(401)
        .json({ error: 'Você não tem permissão para apagar essa imagem.' });
    }

    fs.unlink(
      resolve(__dirname, '..', '..', '..', 'tmp', 'uploads', file.path),
      (err) => {
        if (err) throw err;
      }
    );

    await file.destroy();

    return res.status(200).json({ okay: true });
  }
}

export default new FileController();
