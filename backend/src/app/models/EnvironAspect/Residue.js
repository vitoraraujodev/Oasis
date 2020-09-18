import Sequelize, { Model } from 'sequelize';

class Residue extends Model {
  static init(sequelize) {
    super.init(
      {
        identification: Sequelize.STRING,
        physical_state: Sequelize.STRING,
        constituent: Sequelize.STRING,
        source: Sequelize.STRING,
        treatment: Sequelize.STRING,
        classification: Sequelize.STRING,
        quantity: Sequelize.FLOAT,
        quantity_unit: Sequelize.STRING,
        reservior: Sequelize.STRING,
        capacity: Sequelize.FLOAT,
        capacity_unit: Sequelize.STRING,
        removal_frequency: Sequelize.INTEGER,
        transport: Sequelize.STRING,
        packaging: Sequelize.STRING,
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

export default Residue;
