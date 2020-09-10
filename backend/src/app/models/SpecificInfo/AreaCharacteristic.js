import { Model } from 'sequelize';

class AreaCharacteristic extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.SpecificArea, { foreignKey: 'area_id', as: 'area' });
    this.belongsTo(models.Characteristic, {
      foreignKey: 'characteristic_id',
      as: 'characteristic',
    });
  }
}

export default AreaCharacteristic;
