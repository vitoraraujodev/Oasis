import Sequelize, { Model } from 'sequelize';

class Noise extends Model {
  static init(sequelize) {
    super.init(
      {
        source: Sequelize.STRING,
        protection: Sequelize.STRING,
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

export default Noise;
