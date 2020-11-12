import Sequelize, { Model } from 'sequelize';

class Equipment extends Model {
  static init(sequelize) {
    super.init(
      {
        kind: Sequelize.STRING,
        identification: Sequelize.STRING,
        amount: Sequelize.INTEGER,
        date: Sequelize.DATE,
        capacity: Sequelize.FLOAT,
        capacity_unit: Sequelize.STRING,
        fuel: Sequelize.STRING,
        consumption: Sequelize.FLOAT,
        consumption_unit: Sequelize.STRING,
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

export default Equipment;
