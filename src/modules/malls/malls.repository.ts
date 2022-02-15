import {EntityRepository, Repository} from 'typeorm';
import {Mall} from '@/modules/malls/entities/mall.entity';

@EntityRepository(Mall)
export class MallsRepository extends Repository<Mall> {

}
