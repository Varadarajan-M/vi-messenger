import connectDb from './db/connection';
import createServer from './server';
import initSocket from './socket';
import logger from './utils/logger';

const { server, io } = createServer();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	logger.info(`Server listening on PORT ${PORT}...`);

	logger.info(`Health Check Route - http://localhost:${PORT}/api/health`);

	connectDb();

	initSocket(io);
});
