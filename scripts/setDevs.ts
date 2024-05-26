import 'dotenv/config';

import { DatabaseKeys, DenoKV } from '../src/lib/database';

const db = await DenoKV();
await db.set([DatabaseKeys.Devs], ['817214551740776479']);
