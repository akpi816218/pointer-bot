import { DatabaseKeys, DenoKV } from '../src/lib/database';

const db = await DenoKV();
await db.set([DatabaseKeys.Devs], ['']);
