import Sequelize, { Model } from 'sequelize';

class GeneralArea extends Model {
  static init(sequelize) {
    super.init(
      {
        area: Sequelize.FLOAT,
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

    this.belongsTo(models.File, {
      foreignKey: 'image_id',
      as: 'image',
    });
  }
}

export default GeneralArea;
