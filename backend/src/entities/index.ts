
/**
 * Exports all the Mikro-ORM entities
 *
 *
 */

import { BaseEntity } from './common';
import { Client } from './client';



export { BaseEntity, Client};
// add more 
export const entities = [
  BaseEntity,
  Client,
];
