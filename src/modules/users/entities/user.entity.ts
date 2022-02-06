import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Exclude, instanceToPlain} from 'class-transformer';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'id' })
    id?: number;

    @Column()
    @ApiProperty({ description: '아이디' })
    loginId: string;

    @Column()
    @ApiProperty({ description: '이메일' })
    email: string;

    @Column()
    @ApiProperty({ description: '핸드폰 번호' })
    phone: string;

    @Column({ default: false })
    @ApiProperty({ description: '유저 탈퇴여부' })
    @Exclude()
    isWithdrawal: boolean;

    @Exclude()
    @Column()
    password?: string

    toJSON() {
      return instanceToPlain(this);
    }
}
