const bcrypt = require('bcryptjs');

module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'administrators',
      [
        {
          email: 'admin@oasis.com',
          password_hash: bcrypt.hashSync('123456', 8),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
