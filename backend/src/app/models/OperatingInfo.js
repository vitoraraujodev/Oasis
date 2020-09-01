import Sequelize, { Model } from 'sequelize';

class OperatingInfo extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        observation: Sequelize.STRING,
        rural: Sequelize.BOOLEAN,
        registration: Sequelize.BOOLEAN,
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

export default OperatingInfo;
