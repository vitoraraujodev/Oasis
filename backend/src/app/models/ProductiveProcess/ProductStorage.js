import Sequelize, { Model } from 'sequelize';

class ProductStorage extends Model {
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
    this.belongsTo(models.Product, {
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default ProductStorage;
