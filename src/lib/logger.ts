import chalk from "chalk";
import pino from "pino";
import pretty from "pino-pretty";

export const logger = pino(
	pretty({
		colorize: true,
		levelFirst: true,
		translateTime: "yyyy-mm-dd HH:MM:ss.l",
		ignore: "pid,hostname",
		messageFormat: "{msg} - logged at {time}",
	}),
);
export function summarizeObject(obj, depth = 7, prefix = "") {
	if (depth < 0) {
		console.log(`${chalk.gray(`${prefix}...`)}`);
		return;
	}

	if (typeof obj !== "object" || obj === null) {
		console.log(
			chalk.green(
				`${prefix}${obj?.toString().substring(0, 30)}${
					obj?.toString().length > 30 ? "..." : ""
				}`,
			),
		);
	} else if (Array.isArray(obj)) {
		console.log(chalk.yellow(`${prefix}[`));
		for (const item of obj.slice(0, 5)) {
			summarizeObject(item, depth - 1, `${prefix}  `);
		}
		if (obj.length > 5) console.log(chalk.gray(`${prefix}  ...`));
		console.log(chalk.yellow(`${prefix}]`));
	} else {
		console.log(chalk.blue(`${prefix}{`));
		for (const key of Object.keys(obj)) {
			console.log(chalk.cyan(`${prefix}  ${key}: `));
			summarizeObject(obj[key], depth - 1, `${prefix}    `);
		}
		console.log(chalk.blue(`${prefix}}`));
	}
}
