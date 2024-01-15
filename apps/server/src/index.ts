import createServer from './server';
import logger from './utils/logger';
import connectDb from './db/connection';

const { app } = createServer();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	logger.info(`Server listening on PORT ${PORT}...`);

	logger.info(`Health Check Route - http://localhost:${PORT}/api/health`);

	connectDb();
});
