import Sequelize, { Model } from 'sequelize';

class Emission extends Model {
  static init(sequelize) {
    super.init(
      {
        source: Sequelize.STRING,
        pollutant: Sequelize.STRING,
        unit: Sequelize.STRING,
        concentration: Sequelize.FLOAT,
        control_system: Sequelize.STRING,
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

export default Emission;
