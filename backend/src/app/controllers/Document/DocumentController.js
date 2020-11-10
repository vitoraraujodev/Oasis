import pdf from 'html-pdf';
import ejs from 'ejs';
import fs from 'fs';
import { resolve } from 'path';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

import Company from '../../models/Company';

import Address from '../../models/GeneralInfo/Address';
import OperatingInfo from '../../models/GeneralInfo/OperatingInfo';
import Shift from '../../models/GeneralInfo/Shift';
import Representative from '../../models/GeneralInfo/Representative';

import TechnicalManager from '../../models/FollowUp/TechnicalManager';
import ContactManager from '../../models/FollowUp/ContactManager';
import ContactInfo from '../../models/FollowUp/ContactInfo';

import Specific from '../../models/SpecificInfo/Specific';
import Employee from '../../models/SpecificInfo/Employee';
import GeneralArea from '../../models/SpecificInfo/GeneralArea';
import File from '../../models/SpecificInfo/File';
import SpecificArea from '../../models/SpecificInfo/SpecificArea';

class DocumentController {
  async index(req, res) {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res
        .status(400)
        .json({ error: 'Essa empresa não está registrada.' });
    }

    const actualDate = {
      date: new Date(),
      formattedDate: format(new Date(), "dd 'de' MMMM", { locale: pt }),
    };

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

    if (operatingInfo.shifts.length === 0) {
      return res.status(400).json({
        error:
          'Preencha os turnos das informações de funcionamento da sua empresa e tente novamente.',
      });
    }

    const formattedShifts = operatingInfo.shifts.map((shift) => {
      const seg = shift.week[0] === '1' ? 'seg, ' : '';
      const ter = shift.week[1] === '1' ? 'ter, ' : '';
      const qua = shift.week[2] === '1' ? 'qua, ' : '';
      const qui = shift.week[3] === '1' ? 'qui, ' : '';
      const sex = shift.week[4] === '1' ? 'sex, ' : '';
      const sab = shift.week[5] === '1' ? 'sab, ' : '';
      const dom = shift.week[6] === '1' ? 'dom, ' : '';
      const week = (seg + ter + qua + qui + sex + sab + dom).slice(0, -2);
      return { start_at: shift.start_at, end_at: shift.end_at, week };
    });

    const formattedOperatingInfo = {
      date: operatingInfo.date,
      observation: operatingInfo.observation,
      rural: operatingInfo.rural,
      registration: operatingInfo.registration,
      shifts: formattedShifts,
    };

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

    const contactInfo = await ContactInfo.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'phone_number', 'start_at', 'end_at'],
    });

    if (!contactInfo) {
      return res.status(400).json({
        error:
          'Preencha as informações de contato da sua empresa e tente novamente.',
      });
    }

    const employees = await Employee.findAll({
      where: { company_id: req.params.id },
      order: [['kind', 'ASC']],
      attributes: ['id', 'kind', 'amount'],
    });

    if (employees.length === 0) {
      return res.status(400).json({
        error: 'Preencha os funcionários da sua empresa e tente novamente.',
      });
    }

    const totalEmployees = employees
      .map((employee) => employee.amount)
      .reduce((total, amount) => total + amount);

    const generalArea = await GeneralArea.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'area'],
      include: [
        {
          model: File,
          as: 'image',
          attributes: ['id', 'path'],
        },
      ],
    });

    if (!generalArea || !generalArea.image) {
      return res.status(400).json({
        error:
          'Preencha as informações da área da sua empresa e tente novamente.',
      });
    }

    const specificAreas = await SpecificArea.findAll({
      where: { company_id: req.params.id },
      attributes: ['id', 'kind', 'area'],
    });

    if (specificAreas.length === 0) {
      return res.status(400).json({
        error:
          'Preencha as áreas específicas da sua empresa e tente novamente.',
      });
    }

    const totalArea = specificAreas
      .map((area) => area.area)
      .reduce((total, amount) => total + amount);

    const documentFile = fs.readFileSync(
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

    const document = ejs.render(documentFile, {
      company,
      actualDate,
      specific,
      address,
      operatingInfo: formattedOperatingInfo,
      representatives,
      technicalManager,
      contactManager,
      contactInfo,
      employees,
      totalEmployees,
      generalArea,
      specificAreas,
      totalArea,
    });

    pdf
      .create(document, {
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
