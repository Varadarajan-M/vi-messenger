import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv?.config();

export const createServer = () => {
	const app = express();

	const server = http.createServer(app);

	const io = new Server(server);

	app
		.disable('x-powered-by')
		.use(morgan('dev'))
		.use(express.urlencoded({ extended: true }))
		.use(express.json())
		.use(cors());

	app.get('/health', (req, res) =>
		res.json({ ok: true, environment: process.env.NODE_ENV }),
	);

	app.get('/message/:name', (req, res) =>
		res.json({ message: `hello ${req.params.name}` }),
	);

	return { app, io };
};
