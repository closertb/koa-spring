import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'McGrady',
  username: 'root',
  password: '12345678', 
  host: '127.0.0.1',
  dialect: 'mysql',
  dialectOptions: {
    port: 3306
  },
  define: {
    freezeTableName: true,
    timestamps: false
  },
  logging: process.env.NODE_ENV === 'development' ? (sql, timing) => {
    console.log('sql log:', sql);
  } : false,
  query: {
    raw: false
  }
  // models: [`${__dirname} + /model`]
});

export default sequelize;