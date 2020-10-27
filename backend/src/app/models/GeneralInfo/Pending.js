import Sequelize, { Model } from 'sequelize';

class Pending extends Model {
  static init(sequelize) {
    super.init(
      {
        instrument: Sequelize.STRING,
        process: Sequelize.STRING,
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

export default Pending;
