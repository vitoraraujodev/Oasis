module.exports = {
  up: (QueryInterface) => {
    return QueryInterface.bulkInsert(
      'characteristics',
      [
        {
          title: 'Cobertura',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Piso impermeável',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Contenção',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          title: 'Sistema de controle',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
