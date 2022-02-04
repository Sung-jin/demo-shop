import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    loginId: string;

    @Column()
    email: string;

    @Column()
    phone: string;
}
