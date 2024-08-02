import * as mongoose from 'mongoose';
import { MONGODB_URI } from 'src/constants';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(process.env.MONGODB_URI || MONGODB_URI),
  },
];