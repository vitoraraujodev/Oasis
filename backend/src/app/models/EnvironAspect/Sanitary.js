import Sequelize, { Model } from 'sequelize';

class Sanitary extends Model {
  static init(sequelize) {
    super.init(
      {
        kitchen: Sequelize.BOOLEAN,
        declaration: Sequelize.BOOLEAN,
        theoric_flow: Sequelize.FLOAT,
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

export default Sanitary;
