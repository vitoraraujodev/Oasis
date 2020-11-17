module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('residues', {
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
      constituent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      source: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      treatment: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      classification: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      quantity_unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storage_form: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storage_location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      capacity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      capacity_unit: {
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
    return queryInterface.dropTable('residues');
  },
};
