import colors from 'colors';

class Logger {
	static log = (msg: string) => {
		console.log(
			'\n',
			colors.bgMagenta.grey.bold(' LOG '),
			colors.magenta('====>'),
			colors.bgBlack.underline(msg),
			'\n',
		);
	};

	static info = (msg: string) => {
		console.info(
			'\n',
			colors.bgGreen.black.bold(' INFO '),
			colors.magenta('====>'),
			colors.bgBlack.underline(msg),
			'\n',
		);
	};
	static warn = (msg: string) => {
		console.warn(
			'\n',
			colors.bgYellow.black.bold(' WARN '),
			colors.magenta('====>'),
			colors.bgBlack.underline(msg),
			'\n',
		);
	};
	static error = (msg: string) => {
		console.error(
			'\n',
			colors.bgRed.white.bold(' ERROR '),
			colors.magenta('====>'),
			colors.bgBlack.underline(msg),
			'\n',
		);
	};
}

export default Logger;
