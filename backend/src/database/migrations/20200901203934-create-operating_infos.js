module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('operating_infos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      rural: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      registration: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      observation: {
        type: Sequelize.STRING,
        allowNull: true,
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
    return queryInterface.dropTable('operating_infos');
  },
};
