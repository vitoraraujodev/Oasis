import Sequelize, { Model } from 'sequelize';

class SpecificArea extends Model {
  static init(sequelize) {
    super.init(
      {
        kind: Sequelize.STRING,
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
    this.belongsToMany(models.Characteristic, {
      through: 'AreaCharacteristic',
      as: 'characteristics',
      foreignKey: 'area_id',
      otherKey: 'characteristic_id',
    });
  }
}

export default SpecificArea;
