module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('supplies', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      identification: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      physical_state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transport: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      packaging: {
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
    return queryInterface.dropTable('supplies');
  },
};
