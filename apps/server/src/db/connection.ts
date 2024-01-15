import { connect, connection } from 'mongoose';

import logger from '../utils/logger';

const connectDb = () => {
	const DB_URL = process.env.DB_URL ?? '';
	connect(DB_URL)
		.then(() => logger.info(`Connected to ${DB_URL ?? ''} successfully...`))
		.catch((e) => logger.error(`Error in db connection :- "${e?.message}"`));
	connection.on('error', (e) => {
		logger.error(`Error in db connection :- "${e?.message}"`);
	});
	connection.on('disconnected', () => {
		logger.warn('Database disconnected...');
	});
};

export default connectDb;
