import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import SocketIO from 'socket.io';

import routes from './routes';

const createServer = () => {
	dotenv?.config();

	const app = express();

	const server = http.createServer(app);

	const io = new SocketIO.Server(server);

	app
		.disable('x-powered-by')
		.use(morgan('dev'))
		.use(express.urlencoded({ extended: true }))
		.use(express.json())
		.use(cors());

	app.use('/api', routes);

	app.get('/api/health', (_, res) =>
		res.json({ ok: true, environment: process.env.NODE_ENV }),
	);

	return { app, io };
};

export default createServer;
