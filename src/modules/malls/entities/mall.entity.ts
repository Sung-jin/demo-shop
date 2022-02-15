import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {User} from '@/modules/users/entities/user.entity';

@Entity()
export class Mall {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'id' })
    id?: number;

    @Column()
    @ApiProperty({ description: '이름' })
    name: string;

    // @Column()
    // @ApiProperty({ description: '로고' })
    // logo: string;
    // logo url 저장 연동 추후 구현

    @Column({ nullable: false, type: 'bigint' })
    @ApiProperty({ description: '소유자' })
    @ManyToOne(type => User)
    @JoinColumn({ name: 'mall_user', referencedColumnName: 'id' })
    owner: User;
    // https://www.baeldung.com/database-auditing-jpa
    // TODO - spring Auditing 처럼 jwt 토큰을 기반으로 유저를 자동으로 넣을 수 있는 방법 찾기
    // 또는 req 에서 user 를 찾아 실제 user 객체를 db 조회 후 넣는 형태가 아닌 자동으로 넣을 수 있는 방법 찾기
}
