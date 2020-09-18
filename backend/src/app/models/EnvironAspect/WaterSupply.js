import Sequelize, { Model } from 'sequelize';

class WaterSupply extends Model {
  static init(sequelize) {
    super.init(
      {
        source: Sequelize.STRING,
        license: Sequelize.STRING,
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

    this.hasMany(models.WaterUse, {
      foreignKey: 'supply_id',
      as: 'uses',
    });
  }
}

export default WaterSupply;
