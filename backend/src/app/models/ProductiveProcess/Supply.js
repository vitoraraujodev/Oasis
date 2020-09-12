import Sequelize, { Model } from 'sequelize';

class Supply extends Model {
  static init(sequelize) {
    super.init(
      {
        identification: Sequelize.STRING,
        physical_state: Sequelize.STRING,
        quantity: Sequelize.FLOAT,
        unit: Sequelize.STRING,
        transport: Sequelize.STRING,
        packaging: Sequelize.STRING,
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

    this.hasMany(models.SupplyStorage, {
      foreignKey: 'supply_id',
      as: 'storages',
    });
  }
}

export default Supply;
