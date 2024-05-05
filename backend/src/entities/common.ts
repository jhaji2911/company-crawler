/**
 * Base MikroORM entity for most other entities
 *
 */
import { PrimaryKey, Property } from '@mikro-orm/core';
const ulid = require("ulidx")

export class BaseEntity {
  @PrimaryKey()
  id: string = ulid();

  @Property({ nullable: true, onCreate: () => new Date() })
  createdAt!: Date;

  @Property({
    nullable: true,
    onCreate: () => new Date(),
    onUpdate: () => new Date()
  })
  updatedAt!: Date;
}
