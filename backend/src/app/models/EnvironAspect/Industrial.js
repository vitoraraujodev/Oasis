import Sequelize, { Model } from 'sequelize';

class Industrial extends Model {
  static init(sequelize) {
    super.init(
      {
        water_body: Sequelize.STRING,
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
  }
}

export default Industrial;
