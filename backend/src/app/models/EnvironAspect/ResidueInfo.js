import Sequelize, { Model } from 'sequelize';

class ResidueInfos extends Model {
  static init(sequelize) {
    super.init(
      {
        manifest: Sequelize.BOOLEAN,
        inventory: Sequelize.BOOLEAN,
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

export default ResidueInfos;
