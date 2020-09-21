import Sequelize, { Model } from 'sequelize';

class NoiseInfos extends Model {
  static init(sequelize) {
    super.init(
      {
        report_date: Sequelize.DATE,
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

export default NoiseInfos;
