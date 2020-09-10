import Sequelize, { Model } from 'sequelize';

class ContactInfo extends Model {
  static init(sequelize) {
    super.init(
      {
        phone_number: Sequelize.STRING,
        start_at: Sequelize.INTEGER,
        end_at: Sequelize.INTEGER,
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

export default ContactInfo;
