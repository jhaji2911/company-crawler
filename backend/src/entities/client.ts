

import { Entity, Index, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from './common.js';

@Entity({ tableName: 'clients' })
export class Client extends BaseEntity {
    @Property({ type: 'string' })
    @Index()
    @Unique()
    CIN!: string;
  
    @Property({ nullable: true })
    companyName!: string;
  
    @Property({ nullable: true })
    email!: string;

    @Property({nullable: true})
    pinCode!: string

    @Property({nullable: true})
    address!: string
  
    constructor(data: Omit<Client, keyof BaseEntity>) {
      super();
      Object.assign(this, data);
    }
}