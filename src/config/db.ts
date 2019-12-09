import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'db_rule',
  username: 'jruser',
  password: 'jruser', 
  host: '10.6.1.52',
  dialect: 'mysql',
  dialectOptions: {
    port: 3360
  },
  define: {
    freezeTableName: true,
    timestamps: false
  },
  query: {
    raw: true
  }
  // models: [`${__dirname} + /model`]
});

export default sequelize;