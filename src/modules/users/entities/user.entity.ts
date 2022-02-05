import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";

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

    @ApiProperty({ description: '회원가입/패스워드 변경 시 ui 에서 전달 될 암호화된 패스워드' })
    savedPassword?: string
}
