module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('area_characteristics', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      area_id: {
        type: Sequelize.INTEGER,
        references: { model: 'specific_areas', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      characteristic_id: {
        type: Sequelize.INTEGER,
        references: { model: 'characteristics', key: 'id' },
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
    return queryInterface.dropTable('area_characteristics');
  },
};
