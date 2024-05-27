import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import morgan from 'morgan';
import path from 'path';
import SocketIO from 'socket.io';

import routes from './routes';

const createServer = () => {
	dotenv?.config();

	const app = express();

	const server = http.createServer(app);

	const io = new SocketIO.Server(server, {
		cors: {
			origin: 'http://localhost:3000',
			methods: ['GET', 'POST', 'PUT', 'DELETE'],
		},
	});

	app.disable('x-powered-by')
		.use(
			compression({
				threshold: 0,
			}),
		)
		.use(morgan('dev'))
		.use(express.urlencoded({ extended: true }))
		.use(express.json())
		.use(cors());

	app.use('/api', routes);

	const __dirname1 = path.resolve();

	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname1, '../web/dist')));
		app.get('/service-worker.js', (req, res) => {
			res.sendFile(path.resolve(__dirname, '../web/dist', 'service-worker.js'));
		});
		app.get('*', (req, res) =>
			res.sendFile(path.resolve(__dirname1, '../web/dist', 'index.html')),
		);
	} else {
		app.get('/api/health', (_, res) =>
			res.json({ ok: true, environment: process.env.NODE_ENV }),
		);
	}

	return { server, io };
};

export default createServer;
