import Sequelize from 'sequelize';

import Company from '../app/models/Company';
import Administrator from '../app/models/Administrator';

import Address from '../app/models/GeneralInfo/Address';
import Representative from '../app/models/GeneralInfo/Representative';
import OperatingInfo from '../app/models/GeneralInfo/OperatingInfo';
import History from '../app/models/GeneralInfo/History';
import Shift from '../app/models/GeneralInfo/Shift';

import ContactInfo from '../app/models/FollowUp/ContactInfo';
import ContactManager from '../app/models/FollowUp/ContactManager';
import TechnicalManager from '../app/models/FollowUp/TechnicalManager';

import Employee from '../app/models/SpecificInfo/Employee';
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

import databaseConfig from '../config/database';

// Todos os models a serem carregados
const models = [
  Company,
  Administrator,
  Address,
  Representative,
  OperatingInfo,
  History,
  Shift,
  ContactInfo,
  ContactManager,
  TechnicalManager,
  Employee,
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
