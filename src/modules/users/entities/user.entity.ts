import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Exclude, instanceToPlain} from 'class-transformer';
import {IsMobilePhone, IsNotEmpty} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'id' })
    id?: number;

    @Column()
    @ApiProperty({ description: '아이디' })
    @IsNotEmpty()
    loginId: string;

    @Column()
    @ApiProperty({ description: '이메일' })
    @IsNotEmpty()
    email: string;

    @Column()
    @ApiProperty({ description: '핸드폰 번호' })
    @IsMobilePhone()
    phone: string;

    @Exclude()
    @Column()
    password?: string

    toJSON() {
      return instanceToPlain(this);
    }
}
