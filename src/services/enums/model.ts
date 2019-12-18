import { Table, Column, Model, Unique } from 'sequelize-typescript';

@Table({ tableName: 'rule_enums' })
export default class Enums extends Model<Enums> {
  @Unique
  @Column
  tag: string; // 用户Id

  @Column
  name: string; // 更新表
}