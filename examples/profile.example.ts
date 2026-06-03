import chalk from "chalk";
import { getProfile } from "../src";
import { authenticate } from "./authentication.example";

async function main() {
	try {
		const { instanceId, user } = await authenticate();

		console.log(chalk.blue("\nFetching user profile..."));
		const profile = await getProfile(instanceId, user.token);

		console.log(chalk.bold.green(`\n✔ Profile successfully fetched!`));
		console.log(chalk.bold.cyan(`\n--- Profile Details ---`));
		console.log(`Firstname:    ${chalk.yellow(profile.firstname)}`);
		console.log(`Lastname:     ${chalk.yellow(profile.lastname)}`);
		console.log(`Email:        ${chalk.yellow(profile.email)}`);
		console.log(`Username:     ${chalk.yellow(profile.username)}`);
		console.log(`Full Name:    ${chalk.yellow(profile.cn)}`);
		console.log(
			`City:         ${chalk.yellow(profile.city || "Not specified")}`,
		);
		console.log(
			`Country:      ${chalk.yellow(profile.country || "Not specified")}`,
		);
	} catch (error) {
		console.error(
			chalk.red("\nError:"),
			error instanceof Error ? error.message : error,
		);
		process.exit(1);
	}
}

main();
