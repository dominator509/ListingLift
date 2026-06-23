import { config } from 'dotenv';

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test', override: false });
}

config({ override: false });
