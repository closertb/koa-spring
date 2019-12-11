import { DataTypes } from 'sequelize'
import { Table, Column, Model } from 'sequelize-typescript';

@Table({ tableName: 'rule_param' })
export default class Rule extends Model<Rule> {
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
  is_delete!: number;

/*   @Column
  public get add_time(): number {
      console.log('format');
      return new Date(this.getDataValue('add_time')).getTime();
  } */
  @Column
  add_time!: Date;

  get addTime(): number {
    return new Date(this.getDataValue('add_time')).getTime();
  }
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