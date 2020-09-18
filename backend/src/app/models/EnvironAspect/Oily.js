import Sequelize, { Model } from 'sequelize';

class Oily extends Model {
  static init(sequelize) {
    super.init(
      {
        water_body: Sequelize.STRING,
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
  }
}

export default Oily;
