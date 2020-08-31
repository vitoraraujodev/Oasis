module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'oasis',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
