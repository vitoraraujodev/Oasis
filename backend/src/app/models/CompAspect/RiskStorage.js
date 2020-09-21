import Sequelize, { Model } from 'sequelize';

class RiskStorage extends Model {
  static init(sequelize) {
    super.init(
      {
        identification: Sequelize.STRING,
        amount: Sequelize.INTEGER,
        capacity: Sequelize.FLOAT,
        unit: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Risk, {
      foreignKey: 'risk_id',
      as: 'risk',
    });
  }
}

export default RiskStorage;
