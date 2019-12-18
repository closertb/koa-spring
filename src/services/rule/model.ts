import { Table, Column, Model, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';
import Enums from '../enums/model';

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

  @ForeignKey(() => Enums)
  @Column
  related_enums: string; // 关联外键值

  @BelongsTo(() => Enums)
  set scene_name(val: Enums | string)  {
    // 加入了类型断言，val有Null的状态
    if(val && (<Enums>val).getDataValue) {
      this.setDataValue('scene_name', val && (<Enums>val).getDataValue('name'));
    } else {
      this.setDataValue('scene_name','');
    }
  }

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time'); // new Date(this.create_time).toLocaleString()
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time'); // new Date(this.create_time).toLocaleString()
  }
}
