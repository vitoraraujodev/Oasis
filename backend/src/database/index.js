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
