import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class Administrator extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    // Before saving, encrypts password and saves as password_hash
    this.addHook('beforeSave', async (admin) => {
      if (admin.password) {
        admin.password_hash = await bcrypt.hash(admin.password, 8);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Administrator;
