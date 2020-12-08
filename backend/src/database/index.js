import Sequelize from 'sequelize';

import Company from '../app/models/Company';
import Administrator from '../app/models/Administrator';

import DocumentType from '../app/models/Document/DocumentType';

import Address from '../app/models/GeneralInfo/Address';
import Representative from '../app/models/GeneralInfo/Representative';
import OperatingInfo from '../app/models/GeneralInfo/OperatingInfo';
import History from '../app/models/GeneralInfo/History';
import Pending from '../app/models/GeneralInfo/Pending';
import Shift from '../app/models/GeneralInfo/Shift';

import ContactInfo from '../app/models/FollowUp/ContactInfo';
import ContactManager from '../app/models/FollowUp/ContactManager';
import TechnicalManager from '../app/models/FollowUp/TechnicalManager';

import Employee from '../app/models/SpecificInfo/Employee';
import InstallEmployee from '../app/models/SpecificInfo/InstallEmployee';
import Specific from '../app/models/SpecificInfo/Specific';
import GeneralArea from '../app/models/SpecificInfo/GeneralArea';
import File from '../app/models/SpecificInfo/File';
import SpecificArea from '../app/models/SpecificInfo/SpecificArea';
import Characteristic from '../app/models/SpecificInfo/Characteristic';
import AreaCharacteristic from '../app/models/SpecificInfo/AreaCharacteristic';

import Supply from '../app/models/ProductiveProcess/Supply';
import SupplyStorage from '../app/models/ProductiveProcess/SupplyStorage';
import Product from '../app/models/ProductiveProcess/Product';
import ProductStorage from '../app/models/ProductiveProcess/ProductStorage';
import Equipment from '../app/models/ProductiveProcess/Equipment';

import ResidueInfo from '../app/models/EnvironAspect/ResidueInfo';
import Residue from '../app/models/EnvironAspect/Residue';
import WaterSupply from '../app/models/EnvironAspect/WaterSupply';
import WaterUse from '../app/models/EnvironAspect/WaterUse';
import Sanitary from '../app/models/EnvironAspect/Sanitary';
import Effluent from '../app/models/EnvironAspect/Effluent';

import EmissionInfo from '../app/models/CompAspect/EmissionInfo';
import Emission from '../app/models/CompAspect/Emission';
import Risk from '../app/models/CompAspect/Risk';
import RiskStorage from '../app/models/CompAspect/RiskStorage';
import NoiseInfo from '../app/models/CompAspect/NoiseInfo';
import Noise from '../app/models/CompAspect/Noise';

import databaseConfig from '../config/database';

// Todos os models a serem carregados
const models = [
  Company,
  Administrator,
  DocumentType,
  Address,
  Representative,
  OperatingInfo,
  History,
  Pending,
  Shift,
  ContactInfo,
  ContactManager,
  TechnicalManager,
  Employee,
  InstallEmployee,
  Specific,
  GeneralArea,
  File,
  SpecificArea,
  Characteristic,
  AreaCharacteristic,
  Supply,
  SupplyStorage,
  Product,
  ProductStorage,
  Equipment,
  ResidueInfo,
  Residue,
  WaterSupply,
  WaterUse,
  Sanitary,
  Effluent,
  EmissionInfo,
  Emission,
  Risk,
  RiskStorage,
  NoiseInfo,
  Noise,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
