module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('noises', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      protection: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('noises');
  },
};
