import Sequelize, { Model } from 'sequelize';

class DocumentType extends Model {
  static init(sequelize) {
    super.init(
      {
        document_type: Sequelize.STRING,
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

export default DocumentType;
