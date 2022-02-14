import {ObjectLiteral} from 'typeorm/common/ObjectLiteral';
import {FindConditions} from 'typeorm/find-options/FindConditions';

export default class<Entity extends ObjectLiteral & { id?: string|number }> {
  // Entity 의 타입에 id 를 별도로 추가했는데, id 타입을 주입 받는게 좋을지 등 고민해보자
  constructor(private entity: new () => Entity) {}
  protected mockDB: Entity[] = [];

  findOne(id?: string | number): Entity | undefined {
    return this.mockDB.find(obj => obj['id'] === id);
  }

  finOne(conditions?: FindConditions<Entity>): Entity | undefined {
    return this.mockDB.find(mock => {
      return Object.entries(conditions).every(([condition, value]) => {
        return mock.hasOwnProperty(condition) && mock[condition] === value;
      });
    });
  }

  create(): Entity {
    return new this.entity();
  }

  save(entity: Entity): Entity {
    const obj = this.mockDB.find(mock => mock['id'] === entity['id']);

    if (obj) {
      const savedIndex = this.mockDB.map(mock => mock['id']).indexOf(obj['id']);
      this.mockDB.splice(savedIndex, 1, obj);
    } else {
      if (entity['id']) fail('저장전에 id 가 존재함');

      entity['id'] = this.mockDB.length + 1;
      this.mockDB.push(entity);
    }

    return entity;
  }
}
