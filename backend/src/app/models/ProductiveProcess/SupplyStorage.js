import Sequelize, { Model } from 'sequelize';

class SupplyStorage extends Model {
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
    this.belongsTo(models.Company, {
      foreignKey: 'supply_id',
      as: 'supply',
    });
  }
}

export default SupplyStorage;
