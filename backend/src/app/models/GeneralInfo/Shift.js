import Sequelize, { Model } from 'sequelize';

class Shift extends Model {
  static init(sequelize) {
    super.init(
      {
        start_at: Sequelize.INTEGER,
        end_at: Sequelize.INTEGER,
        week: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.OperatingInfo, {
      foreignKey: 'operating_info_id',
      as: 'operating_info',
    });
  }
}

export default Shift;
