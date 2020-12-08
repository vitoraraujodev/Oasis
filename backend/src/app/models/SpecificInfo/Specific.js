import Sequelize, { Model } from 'sequelize';

class Specific extends Model {
  static init(sequelize) {
    super.init(
      {
        cnpj: Sequelize.STRING,
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

export default Specific;
