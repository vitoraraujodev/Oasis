import Sequelize, { Model } from 'sequelize';

class Characteristic extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.SpecificArea, {
      through: 'AreaCharacteristic',
      as: 'area',
      foreignKey: 'characteristic_id',
      otherKey: 'area_id',
    });
  }
}

export default Characteristic;
