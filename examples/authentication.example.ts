import { input, password, select } from "@inquirer/prompts";
import chalk from "chalk";
import { INSTANCES, loginWithCredentials, type User } from "../src";

export async function authenticate(): Promise<{
	instanceId: string;
	user: User;
}> {
	console.log(chalk.bold.cyan("\n--- Wigor Authentication ---"));

	const choices = INSTANCES.map((instance) => ({
		name: instance.name,
		value: instance.id,
	}));

	const instanceId = await select({
		message: "Select your school:",
		choices: choices,
	});

	const username = await input({
		message: "Username (e.g., firstname.lastname):",
		required: true,
	});

	const pwd = await password({
		message: "Password:",
		mask: "*",
	});

	console.log(chalk.blue("\nConnecting..."));
	const user = await loginWithCredentials(instanceId, username, pwd);

	console.log(
		chalk.green(
			`\n✔ Authentication successful for ${user.firstname} ${user.lastname}!`,
		),
	);
	return { instanceId, user };
}

const isMain = process.argv[1]?.includes("authentication.example");

if (isMain) {
	authenticate()
		.then(({ user }) => {
			console.log(
				chalk.gray(`Session Token: ${user.token.substring(0, 60)}...`),
			);
		})
		.catch((err) => {
			console.error(chalk.red("\nError:"), err.message || err);
			process.exit(1);
		});
}
