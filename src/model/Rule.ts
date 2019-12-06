import { DataTypes } from 'sequelize'
import { Table, Column, Model } from 'sequelize-typescript';

// import sequelize from './db';

@Table({ tableName: 'rule_param' })
export default class Rule extends Model<Rule> {
  // public id?: number;
  // public scene_code: string;
  // public param_code: string
  // public param_name: string
  // public param_type: string
  // public is_delete: number
  // public operator_add: string
  @Column
  scene_code: string;

  @Column
  param_code: string;

  @Column
  param_name: string;

  @Column
  param_type: string;

  @Column
  operator_add: string;

  @Column
  is_delete: number;
}

// Rule.init({
//   // attributes
//   scene_code: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   param_code: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   param_name: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   param_type: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   is_delete: {
//     type: DataTypes.NUMBER,
//     allowNull: false
//   },
//   operator_add: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//   id: {
//     type: DataTypes.NUMBER,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true
//     // allowNull defaults to true
//   }
// }, {
//   sequelize,
//   modelName: 'rule_param'
// });

//  Rule;