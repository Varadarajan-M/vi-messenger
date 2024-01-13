import { range } from 'utils';
import { createServer } from './server';

const { app } = createServer();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(
		`\n\nServer listening on PORT ${PORT}...
		\nAPI health check on http://localhost:${PORT}/health`,
	);

	console.log('\nCalling range util fn. from local packages...');
	console.log('\nrange(0,10) =>', JSON.stringify(range(0, 10)));
});
