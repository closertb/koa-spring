import { MinLength, Length } from "class-validator";

export default class User {
  @MinLength(3)
  name: string;

  @MinLength(5)
  pwd: string;
}
