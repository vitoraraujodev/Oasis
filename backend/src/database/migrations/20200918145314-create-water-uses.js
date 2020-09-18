module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('water_uses', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      usage: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      flow: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      supply_id: {
        type: Sequelize.INTEGER,
        references: { model: 'water_supplies', key: 'id' },
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
    return queryInterface.dropTable('water_uses');
  },
};
