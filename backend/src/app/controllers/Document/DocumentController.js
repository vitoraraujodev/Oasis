import pdf from 'html-pdf';
import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';

// import Company from '../../models/Company';

class DocumentController {
  async index(req, res) {
    const coverFile = fs.readFileSync(
      resolve(
        __dirname,
        '..',
        '..',
        'views',
        'document',
        'CadastroAmbiental.ejs'
      ),
      'utf-8'
    );

    const cover = ejs.render(coverFile);

    pdf
      .create(cover, {
        orientation: 'portrait',
        format: 'A4',
        border: {
          top: '40px',
          bottom: '40px',
          right: '32px',
          left: '32px',
        },

        header: {
          height: '56px',
          contents: {
            first: '<div style="background: #bbb; height: 56px;"></div>',
            default:
              '<div class="header"><b class="header-label">CADASTRO AMBIENTAL</b></div>',
          },
        },
      })
      .toBuffer((err, buffer) => {
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
