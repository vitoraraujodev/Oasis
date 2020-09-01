import Sequelize from 'sequelize';

import Company from '../app/models/Company';
import Administrator from '../app/models/Administrator';

import databaseConfig from '../config/database';

const models = [Company, Administrator]; // Todos os models a serem carregados

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
