import Sequelize, { Model } from 'sequelize';

class ProductStorage extends Model {
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
      foreignKey: 'product_id',
      as: 'product',
    });
  }
}

export default ProductStorage;
