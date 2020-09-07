import Sequelize from 'sequelize';

import Company from '../app/models/Company';
import Administrator from '../app/models/Administrator';
import Address from '../app/models/Address';
import Representative from '../app/models/Representative';
import OperatingInfo from '../app/models/OperatingInfo';
import History from '../app/models/History';
import Shift from '../app/models/Shift';
import ContactInfo from '../app/models/ContactInfo';

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
