

import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './common.js';
import { IsEmail, IsPostalCode, MaxLength, MinLength } from 'class-validator';

@Entity({ tableName: 'clients' })
export class Client extends BaseEntity {
    @Property({ type: 'string' })
    @Index()
    @Unique()
    @MinLength(21)
    @MaxLength(21)
    CIN!: string;
  
    @Property({ nullable: true })
    companyName!: string;
  
    @Property({ nullable: true })
    @IsEmail()
    email!: string;

    @Property({nullable: true})
    @IsPostalCode('IN')
    pinCode!: string

    @Property({nullable: true})
    address!: string
  
    constructor(data: Omit<Client, keyof BaseEntity>) {
      super();
      Object.assign(this, data);
    }
}