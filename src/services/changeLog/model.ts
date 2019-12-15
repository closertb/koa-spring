import { Table, Column, Model } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';
// import sequelize from './db';

@Table({ tableName: 'change_logs' })
export default class ChangeLog extends Model<ChangeLog> {
  @Column
  userId: string; // 用户Id

  @Column
  update_type: string; // 更新表

  @Column
  update_id: number; // 表Id

  @Column
  before!: string; // 字段更新前

  @Column
  after!: string; // 字段更新后

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time');
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time');
  }
}