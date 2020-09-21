import Sequelize, { Model } from 'sequelize';

class Risk extends Model {
  static init(sequelize) {
    super.init(
      {
        substance: Sequelize.STRING,
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

    this.hasMany(models.RiskStorage, {
      foreignKey: 'risk_id',
      as: 'storages',
    });
  }
}

export default Risk;
