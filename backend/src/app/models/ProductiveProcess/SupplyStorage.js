import Sequelize, { Model } from 'sequelize';

class SupplyStorage extends Model {
  static init(sequelize) {
    super.init(
      {
        location: Sequelize.STRING,
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
    this.belongsTo(models.Supply, {
      foreignKey: 'supply_id',
      as: 'supply',
    });
  }
}

export default SupplyStorage;
