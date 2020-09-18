import Sequelize, { Model } from 'sequelize';

class WaterUse extends Model {
  static init(sequelize) {
    super.init(
      {
        usage: Sequelize.STRING,
        flow: Sequelize.NUMBER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.WaterSupply, {
      foreignKey: 'supply_id',
      as: 'supply',
    });
  }
}

export default WaterUse;
