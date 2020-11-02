import pdf from 'html-pdf';
import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';

// import Company from '../../models/Company';

class DocumentController {
  async index(req, res) {
    const coverFile = fs.readFileSync(
      resolve(__dirname, '..', '..', 'views', 'cover', 'cover.ejs'),
      'utf-8'
    );

    const cover = ejs.render(coverFile);

    pdf.create(cover).toBuffer((err, buffer) => {
      if (err) {
        return res.status(500).json({
          error:
            'Houve um erro na geração do documento. Por favor, tente novamente mais tarde.',
        });
      }

      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Cadastro-Ambiental.pdf'
      );

      res.send(Buffer.from(buffer, 'base64'));
    });
  }
}

export default new DocumentController();
