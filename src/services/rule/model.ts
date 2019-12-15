import { Table, Column, Model } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';

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

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time'); // new Date(this.create_time).toLocaleString()
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time'); // new Date(this.create_time).toLocaleString()
  }
}
