import { Table, Column, Model } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';
// import sequelize from './db';

@Table({ tableName: 'mock_change_logs' })
export default class ChangeLog extends Model<ChangeLog> {
  @Column
  userId: string; // xp_id

  @Column
  update_type: string; // 私钥

  @Column
  update_id: number; // 公钥

  @Column
  field!: string; // 配置说明

  @Column
  before!: string; // 配置说明

  @Column
  after!: string; // 配置说明

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time'); // new Date(this.create_time).toLocaleString()
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time'); // new Date(this.create_time).toLocaleString()
  }
}