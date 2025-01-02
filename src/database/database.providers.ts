require('dotenv').config();

import { Pool } from 'pg';

export const databaseProviders = [
  {
    provide: 'POSTGRESQL_CONNECTION',
    useFactory: async () => {
      const pool = new Pool({
        user: String(process.env.DB_USER),
        password: String(process.env.DB_PASS),
        host: String(process.env.DB_HOST),
        database: String(process.env.DB_DATABASE),
        port: Number(process.env.DB_PORT)
      });

      return pool;
    },
  },
];