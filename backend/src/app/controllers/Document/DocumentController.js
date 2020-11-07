import pdf from 'html-pdf';
import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';

import Company from '../../models/Company';

import Address from '../../models/GeneralInfo/Address';
import OperatingInfo from '../../models/GeneralInfo/OperatingInfo';
import Shift from '../../models/GeneralInfo/Shift';
import Representative from '../../models/GeneralInfo/Representative';

import TechnicalManager from '../../models/FollowUp/TechnicalManager';
import ContactManager from '../../models/FollowUp/ContactManager';

import Specific from '../../models/SpecificInfo/Specific';

class DocumentController {
  async index(req, res) {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada.' });
    }

    const specific = await Specific.findOne({
      where: { company_id: req.params.id },
      attributes: ['cnpj', 'document_type'],
    });

    if (!specific) {
      return res.status(400).json({
        error:
          'Preencha as informações específicas da sua empresa e tente novamente.',
      });
    }

    const address = await Address.findOne({
      where: { company_id: req.params.id },
      attributes: [
        'id',
        'cep',
        'city',
        'neighborhood',
        'municipality',
        'street',
        'number',
        'complement',
      ],
    });

    if (!address) {
      return res.status(400).json({
        error: 'Preencha o endereço da sua empresa e tente novamente.',
      });
    }

    const operatingInfo = await OperatingInfo.findOne({
      where: { company_id: req.params.id },
      attributes: [
        'id',
        'date',
        'rural',
        'registration',
        'observation',
        'company_id',
      ],
      include: [
        {
          model: Shift,
          as: 'shifts',
          required: false,
          order: [
            ['week', 'ASC'],
            ['start_at', 'ASC'],
          ],
          attributes: ['id', 'start_at', 'end_at', 'week'],
        },
      ],
    });

    if (!operatingInfo) {
      return res.status(400).json({
        error:
          'Preencha as informações de funcionamento da sua empresa e tente novamente.',
      });
    }

    const representatives = await Representative.findAll({
      where: { company_id: req.params.id },
      order: [['name', 'ASC']],
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    if (!representatives) {
      return res.status(400).json({
        error:
          'Preencha as informações dos representantes da sua empresa e tente novamente.',
      });
    }

    const technicalManager = await TechnicalManager.findOne({
      where: { company_id: req.params.id },
      attributes: [
        'id',
        'name',
        'cpf',
        'email',
        'phone_number',
        'qualification',
        'licensure_code',
      ],
    });

    if (!technicalManager) {
      return res.status(400).json({
        error:
          'Preencha as informações do representante técnico da sua empresa e tente novamente.',
      });
    }

    const contactManager = await ContactManager.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    if (!contactManager) {
      return res.status(400).json({
        error:
          'Preencha as informações da pessoa de contato da sua empresa e tente novamente.',
      });
    }

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

    const date = new Date();
    const actualDate = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
    };

    const cover = ejs.render(coverFile, {
      company,
      actualDate,
      specific,
      address,
      operatingInfo,
      representatives,
      technicalManager,
      contactManager,
    });

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
