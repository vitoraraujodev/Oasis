module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('shifts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      start_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      end_at: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      week: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      operating_info_id: {
        type: Sequelize.INTEGER,
        references: { model: 'operating_infos', key: 'id' },
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
    return queryInterface.dropTable('shifts');
  },
};
