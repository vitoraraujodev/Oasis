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

import Supply from '../../models/ProductiveProcess/Supply';
import SupplyStorage from '../../models/ProductiveProcess/SupplyStorage';
import Equipment from '../../models/ProductiveProcess/Equipment';
import Product from '../../models/ProductiveProcess/Product';
import ProductStorage from '../../models/ProductiveProcess/ProductStorage';

import WaterSupply from '../../models/EnvironAspect/WaterSupply';
import WaterUse from '../../models/EnvironAspect/WaterUse';
import Sanitary from '../../models/EnvironAspect/Sanitary';
import Effluent from '../../models/EnvironAspect/Effluent';
import Residue from '../../models/EnvironAspect/Residue';
import ResidueInfo from '../../models/EnvironAspect/ResidueInfo';

import Emission from '../../models/CompAspect/Emission';
import EmissionInfo from '../../models/CompAspect/EmissionInfo';
import Noise from '../../models/CompAspect/Noise';
import NoiseInfo from '../../models/CompAspect/NoiseInfo';
import Risk from '../../models/CompAspect/Risk';
import RiskStorage from '../../models/CompAspect/RiskStorage';

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
          'Por favor, preencha as informações específicas da sua empresa e tente novamente.',
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
        error:
          'Por favor, preencha o endereço da sua empresa e tente novamente.',
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
          'Por favor, preencha as informações de funcionamento da sua empresa e tente novamente.',
      });
    }

    if (operatingInfo.shifts.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os turnos das informações de funcionamento da sua empresa e tente novamente.',
      });
    }

    const formattedShifts = operatingInfo.shifts.map((shift) => {
      const dom = shift.week[0] === '1' ? 'dom, ' : '';
      const seg = shift.week[1] === '1' ? 'seg, ' : '';
      const ter = shift.week[2] === '1' ? 'ter, ' : '';
      const qua = shift.week[3] === '1' ? 'qua, ' : '';
      const qui = shift.week[4] === '1' ? 'qui, ' : '';
      const sex = shift.week[5] === '1' ? 'sex, ' : '';
      const sab = shift.week[6] === '1' ? 'sab, ' : '';
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
          'Por favor, preencha as informações dos representantes da sua empresa e tente novamente.',
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
          'Por favor, preencha as informações do representante técnico da sua empresa e tente novamente.',
      });
    }

    const contactManager = await ContactManager.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'name', 'cpf', 'email', 'phone_number'],
    });

    if (!contactManager) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações da pessoa de contato da sua empresa e tente novamente.',
      });
    }

    const contactInfo = await ContactInfo.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'phone_number', 'start_at', 'end_at'],
    });

    if (!contactInfo) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações de contato da sua empresa e tente novamente.',
      });
    }

    const employees = await Employee.findAll({
      where: { company_id: req.params.id },
      order: [['kind', 'ASC']],
      attributes: ['id', 'kind', 'amount'],
    });

    if (employees.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os funcionários da sua empresa e tente novamente.',
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
          'Por favor, preencha as informações da área da sua empresa e tente novamente.',
      });
    }

    const specificAreas = await SpecificArea.findAll({
      where: { company_id: req.params.id },
      attributes: ['id', 'kind', 'area'],
    });

    if (specificAreas.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha as áreas específicas da sua empresa e tente novamente.',
      });
    }

    const totalArea = specificAreas
      .map((area) => area.area)
      .reduce((total, amount) => total + amount);

    const supplies = await Supply.findAll({
      where: { company_id: req.params.id },
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
    });

    if (supplies.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os insumos da sua empresa e tente novamente.',
      });
    }

    const equipments = await Equipment.findAll({
      where: { company_id: req.params.id },
      order: [['identification', 'ASC']],
      attributes: [
        'id',
        'kind',
        'identification',
        'amount',
        'date',
        'capacity',
        'capacity_unit',
        'fuel',
        'consumption',
        'consumption_unit',
      ],
    });

    if (equipments.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os equipamentos da sua empresa e tente novamente.',
      });
    }

    const products = await Product.findAll({
      where: { company_id: req.params.id },
      order: [['identification', 'ASC']],
      attributes: [
        'id',
        'identification',
        'physical_state',
        'quantity',
        'capacity',
        'unit',
        'transport',
        'packaging',
      ],
      include: [
        {
          model: ProductStorage,
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
    });

    if (products.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os produtos da sua empresa e tente novamente.',
      });
    }

    const waterSupplies = await WaterSupply.findAll({
      where: { company_id: req.params.id },
      order: [['source', 'ASC']],
      attributes: ['id', 'source', 'license'],
      include: [
        {
          model: WaterUse,
          as: 'uses',
          required: true,
          order: [['usage', 'ASC']],
          attributes: ['id', 'usage', 'flow'],
        },
      ],
    });

    if (waterSupplies.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha as fontes de água da sua empresa e tente novamente.',
      });
    }

    const formattedWaterSupplies = waterSupplies.map((waterSupply) => {
      const totalFlow = waterSupply.uses
        .map((use) => use.flow)
        .reduce((total, value) => total + value);
      return {
        source: waterSupply.source,
        license: waterSupply.license,
        uses: waterSupply.uses,
        totalFlow,
      };
    });

    const totalFlow = formattedWaterSupplies
      .map((waterSupply) => waterSupply.totalFlow)
      .reduce((total, value) => total + value);

    const emissions = await Emission.findAll({
      where: { company_id: req.params.id },
      order: [
        ['source', 'ASC'],
        ['pollutant', 'ASC'],
      ],
      attributes: [
        'source',
        'pollutant',
        'unit',
        'concentration',
        'control_system',
      ],
    });

    if (emissions.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha as emissões atmosféricas da sua empresa e tente novamente.',
      });
    }

    const emissionInfo = await EmissionInfo.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'promonAir', 'fleet', 'procon'],
    });

    if (!emissionInfo) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações de emissões atmosféricas da sua empresa e tente novamente.',
      });
    }

    const effluents = await Effluent.findAll({
      where: { company_id: req.params.id },
      order: [['source', 'ASC']],
      attributes: [
        'id',
        'kind',
        'source',
        'flow',
        'treatment',
        'quantity',
        'water_body',
        'license',
        'water_body',
      ],
    });

    const sanitary = await Sanitary.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'kitchen', 'theoric_flow', 'declaration'],
    });

    if (!sanitary) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações do efluente sanitário da sua empresa e tente novamente.',
      });
    }

    const sanitaryEffluents = effluents.filter(
      (effluent) => effluent.kind === 'sanitary'
    );

    if (sanitaryEffluents.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os efluentes sanitários da sua empresa e tente novamente.',
      });
    }

    const sanitaryTotalFlow = sanitaryEffluents
      .map((effluent) => effluent.flow)
      .reduce((total, value) => total + value);

    const oilyEffluents = effluents.filter(
      (effluent) => effluent.kind === 'oily'
    );

    if (oilyEffluents.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os efluentes oleosos da sua empresa e tente novamente.',
      });
    }

    const oilyTotalFlow = oilyEffluents
      .map((effluent) => effluent.flow)
      .reduce((total, value) => total + value);

    const industrialEffluents = effluents.filter(
      (effluent) => effluent.kind === 'industrial'
    );

    if (industrialEffluents.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os efluentes industriais da sua empresa e tente novamente.',
      });
    }

    const industrialTotalFlow = industrialEffluents
      .map((effluent) => effluent.flow)
      .reduce((total, value) => total + value);

    const residues = await Residue.findAll({
      where: { company_id: req.params.id },
      order: [['identification', 'ASC']],
      attributes: [
        'identification',
        'physical_state',
        'constituent',
        'source',
        'treatment',
        'classification',
        'quantity',
        'quantity_unit',
        'capacity',
        'capacity_unit',
        'storage_form',
        'storage_location',
      ],
    });

    if (residues.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os resíduos da sua empresa e tente novamente.',
      });
    }

    const residueInfo = await ResidueInfo.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'manifest', 'inventory'],
    });

    if (!residueInfo) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações de resíduos da sua empresa e tente novamente.',
      });
    }

    const noises = await Noise.findAll({
      where: { company_id: req.params.id },
      order: [['source', 'ASC']],
      attributes: ['id', 'source', 'protection'],
    });

    if (noises.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os ruídos gerados da sua empresa e tente novamente.',
      });
    }

    const noiseInfo = await NoiseInfo.findOne({
      where: { company_id: req.params.id },
      attributes: ['id', 'report_date'],
    });

    if (!noiseInfo) {
      return res.status(400).json({
        error:
          'Por favor, preencha as informações de ruídos da sua empresa e tente novamente.',
      });
    }

    const risks = await Risk.findAll({
      order: [['substance', 'ASC']],
      attributes: ['id', 'substance', 'physical_state'],
      include: [
        {
          model: RiskStorage,
          as: 'storages',
          required: true,
          order: [['identification', 'ASC']],
          attributes: ['id', 'identification', 'amount', 'capacity', 'unit'],
        },
      ],
    });

    if (risks.length === 0) {
      return res.status(400).json({
        error:
          'Por favor, preencha os riscos ambientais da sua empresa e tente novamente.',
      });
    }

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
      supplies,
      productiveEquipments: equipments.filter(
        (equipment) => equipment.kind === 'productive'
      ),
      auxiliaryEquipments: equipments.filter(
        (equipment) => equipment.kind === 'auxiliary'
      ),
      controlEquipments: equipments.filter(
        (equipment) => equipment.kind === 'control'
      ),
      products,
      waterSupplies: formattedWaterSupplies,
      totalFlow,
      emissions,
      emissionInfo,
      sanitary,
      sanitaryEffluents,
      sanitaryTotalFlow,
      oilyEffluents,
      oilyTotalFlow,
      industrialEffluents,
      industrialTotalFlow,
      residuesClass1: residues.filter(
        (residue) => residue.classification === '1'
      ),
      residuesClass2: residues.filter(
        (residue) => residue.classification === '2'
      ),
      residueInfo,
      noises,
      noiseInfo,
      risks,
    });

    pdf
      .create(document, {
        orientation: 'portrait',
        format: 'A4',
        border: {
          top: '24px',
          bottom: '24px',
          right: '16px',
          left: '16px',
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
