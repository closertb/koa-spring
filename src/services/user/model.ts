import { MinLength, Length } from "class-validator";
import { Table, Column, Model } from 'sequelize-typescript';
import { toTimeStamp } from '../../config/common';

@Table({ tableName: 'users' })
export default class User extends Model<User> {
  @MinLength(3)
  @Column
  name: string;

  @MinLength(5)
  @Column
  get pwd(): string {
    return '******';
  }

  set pwd(value: string) {
    this.setDataValue('pwd', value);
  }

  // @Length(11)
  @Column
  phone: number;

  @Column
  get create_time(): number  {
    return toTimeStamp(this, 'create_time');
  }
  @Column
  get update_time(): number  {
    return toTimeStamp(this, 'update_time');
  }
}
