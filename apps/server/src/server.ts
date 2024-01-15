import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import SocketIO from 'socket.io';

import authRouter from './routes/auth';

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

	app.use('/api/auth', authRouter);

	app.get('/api/health', (_, res) =>
		res.json({ ok: true, environment: process.env.NODE_ENV }),
	);

	return { app, io };
};

export default createServer;
