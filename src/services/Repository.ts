import { ModelCtor } from 'sequelize-typescript';
import { AnyObject, PageParams } from '../config/interface';
import { validBody, formatDetail, validWithPagination } from '../config/decorators';

export default class Repository {
  protected model: ModelCtor;
  constructor(model: ModelCtor) {
    this.model = model;
  }

  @validWithPagination
  async findAll(body: object = {}, pagination: object = {}) {
    const rows = await this.model.findAll({
      where: {
          ...body
      },
      ...pagination
    });
    const count = await this.model.count({
      where: {
        ...body
      }
    });
    return { rows, count }
  }


  @formatDetail
  findOne(id: number) {
    return this.model.findOne({
      where: {
        id
      }
    });
  }

  save(model: AnyObject) {
    return model.save();
  }

  @validBody
  update(model: AnyObject) {
    const { id, ...other } = model;    
    return this.model.update({
      ...other,
    }, {
      where: {
        id
      }
    });
  }
}
