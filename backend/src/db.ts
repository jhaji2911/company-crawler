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

export async function initORM(options?: Options): Promise<Services> {
  if (cache === null) {
    // allow overriding config options for testing
    const orm = await MikroORM.init({
      ...config,
      ...options,
    });

    const generator = orm.getSchemaGenerator();

    // check if the tables exist before creating the schema    
    await generator.createSchema({ wrap: false });
    // save to cache before returning
    cache = {
      orm,
      em: orm.em,
      client: orm.em.getRepository(Client),
    };
  }

  return cache;
}
