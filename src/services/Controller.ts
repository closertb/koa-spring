import { Model } from 'sequelize-typescript';
import { AnyObject } from '../config/interface';
import Repository from "./Repository";

export default class Controller {
    constructor(public repository: Repository) {
      this.repository = repository;
    }

    async all(body: object) {
      const res = await this.repository.findAll(body);
      return res;
    }

    async findById(id: number) {
      const res = await this.repository.findOne(id);
      return res;
    }

    async one(body: AnyObject) {
      const { id = -1 } = body;
      if (typeof +id !== 'number' || id < 0) {
        return {
          status: 'error',
          code: 1001,
          message: 'id无效'
        };
      }
      const res = await this.repository.findOne(+id);
      return res;
    }

    async save(body: Model) {
      await this.repository.save(body);
      return { message: 'success' };
    }

    async update(body: AnyObject) {
      await this.repository.update(body);
      return { message: 'success' };
    }
}