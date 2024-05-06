import {
  MikroORM,
  EntityManager,
  EntityRepository,
  Options,
} from "@mikro-orm/core";
import { Client } from "./entities/client";
import config from "./mikro-orm.config";

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  client: EntityRepository<Client>;
}

let cache: Services | null = null;

export async function initORM(): Promise<Services> {

  console.log('first block of INIT 🌒')
  if (cache !== null) {
    // If cache is not null, return the cached services
  return cache;
}

  console.log('Initializing ORM...');


  // Allow overriding config options for testing
  const orm = await MikroORM.init({
    ...config,
  });
  console.log('initialized ORM 🌓')
  const generator = orm.getSchemaGenerator();

  console.log('Generating schema 🌖')

  // Check if the tables exist before creating the schema    
  // using updateSchema instead of createSchema because we want to update the existing tables if they exist and not throw an error when trying to recreate them.
  await generator.updateSchema({ wrap: false });
  
  console.log('schema generated! 🌕')
  // Save to cache before returning
  cache = {
    orm,
    em: orm.em,
    client: orm.em.getRepository(Client),
  };

  console.log('Nice and Cool ✨')

  return cache;
}