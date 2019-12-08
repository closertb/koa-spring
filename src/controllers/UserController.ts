import { JsonController, Get, Post, Body, UseAfter } from "routing-controllers";
import User from "../model/User";

@JsonController('/user')
export default class UserController {

    @Post("/login")
    async update(@Body({ validate: true }) user: User) {
      console.log(user)
      return { token: 'drgfsdfgfegfgfgevfdd', id: 12345, name: 'denzel' };
    }
}