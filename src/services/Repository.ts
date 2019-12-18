import { ModelCtor } from 'sequelize-typescript';
import { AnyObject } from '../config/interface';
import { validBody, formatDetail, validWithPagination } from '../config/decorators';

export default class Repository {
  public model: ModelCtor;
  constructor(model: ModelCtor) {
    this.model = model;
  }

  @validWithPagination
  findAll(model: object = {}) {
    return this.model.findAll({
      where: {
          ...model
      }
    });
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
