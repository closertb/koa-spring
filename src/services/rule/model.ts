import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
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

/*   @ForeignKey(() => Request)
  @Column
  callback_template_id!: string; // 回调模板

  @BelongsTo(() => Request)
  set callback_template_name(val: Request | string)  {
    // 加入了类型断言，val有Null的状态
    if(val && (<Request>val).getDataValue) {
      this.setDataValue('callback_template_name', val && (<Request>val).getDataValue('callback_name'));
    } else {
      this.setDataValue('callback_template_name','');
    }
  } */

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time'); // new Date(this.create_time).toLocaleString()
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time'); // new Date(this.create_time).toLocaleString()
  }
}
