module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contact_infos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      end_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.INTEGER,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('contact_infos');
  },
};
