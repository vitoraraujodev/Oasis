import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init(
      {
        identification: Sequelize.STRING,
        physical_state: Sequelize.STRING,
        quantity: Sequelize.FLOAT,
        capacity: Sequelize.FLOAT,
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

    this.hasMany(models.ProductStorage, {
      foreignKey: 'product_id',
      as: 'storages',
    });
  }
}

export default Product;
