import Sequelize, { Model } from 'sequelize';

class History extends Model {
  static init(sequelize) {
    super.init(
      {
        instrument: Sequelize.STRING,
        number: Sequelize.STRING,
        process: Sequelize.STRING,
        expiration_date: Sequelize.DATE,
        objective: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Company, {
      foreignKey: 'company_id',
      as: 'company',
    });
  }
}

export default History;
