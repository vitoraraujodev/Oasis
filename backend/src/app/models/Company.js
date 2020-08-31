import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Company extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        typology: Sequelize.STRING,
        status: Sequelize.INTEGER,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Before saving, encrypts password and saves as password_hash
    this.addHook('beforeSave', async (company) => {
      if (company.password) {
        company.password_hash = await bcrypt.hash(company.password, 8);
      }
    });
    return this;
  }
}

export default Company;
