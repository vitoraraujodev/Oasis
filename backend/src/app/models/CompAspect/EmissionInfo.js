import Sequelize, { Model } from 'sequelize';

class EmissionInfo extends Model {
  static init(sequelize) {
    super.init(
      {
        promonAir: Sequelize.BOOLEAN,
        fleet: Sequelize.BOOLEAN,
        procon: Sequelize.BOOLEAN,
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

export default EmissionInfo;
