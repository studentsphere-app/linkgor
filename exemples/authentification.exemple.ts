import { select, input, password } from '@inquirer/prompts';
import chalk from 'chalk';
import { INSTANCES, loginWithCredentials, User } from '../src';

export async function authenticate(): Promise<{ instanceId: string; user: User }> {
	console.log(chalk.bold.cyan("\n--- Authentification Wigor ---"));

	const choices = INSTANCES.map((instance) => ({
		name: instance.name,
		value: instance.id,
	}));

	const instanceId = await select({
		message: "Sélectionnez votre école :",
		choices: choices,
	});

	const username = await input({
		message: "Nom d'utilisateur (ex: prenom.nom) :",
		required: true,
	});

	const pwd = await password({
		message: "Mot de passe :",
		mask: "*",
	});

	console.log(chalk.blue("\nConnexion en cours..."));
	const user = await loginWithCredentials(instanceId, username, pwd);

	console.log(chalk.green(`\n✔ Authentification réussie pour ${user.firstname} ${user.lastname}!`));
	return { instanceId, user };
}

const isMain = process.argv[1]?.includes('authentification.exemple');

if (isMain) {
	authenticate()
		.then(({ user }) => {
			console.log(chalk.gray(`Session Token : ${user.token.substring(0, 60)}...`));
		})
		.catch((err) => {
			console.error(chalk.red("\nErreur :"), err.message || err);
			process.exit(1);
		});
}
