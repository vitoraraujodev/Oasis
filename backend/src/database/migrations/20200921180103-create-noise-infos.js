module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('noise_infos', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      report_date: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('noise_infos');
  },
};
