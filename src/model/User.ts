import { MinLength, Length } from "class-validator";


// import sequelize from './db';
export default class User {
  // public id?: number;
  // public scene_code: string;
  // public param_code: string
  // public param_name: string
  // public param_type: string
  // public is_delete: number
  // public operator_add: string
  @Length(4, 10)
  name: string;

  @MinLength(5)
  pwd: string;
}
