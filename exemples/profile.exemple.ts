import chalk from 'chalk';
import { getProfile } from '../src';
import { authenticate } from './authentification.exemple';

async function main() {
	try {
		const { instanceId, user } = await authenticate();

		console.log(chalk.blue("\nRécupération du profil utilisateur..."));
		const profile = await getProfile(instanceId, user.token);

		console.log(chalk.bold.green(`\n✔ Profil récupéré avec succès !`));
		console.log(chalk.bold.cyan(`\n--- Détails du Profil ---`));
		console.log(`Prénom :       ${chalk.yellow(profile.firstname)}`);
		console.log(`Nom :          ${chalk.yellow(profile.lastname)}`);
		console.log(`E-mail :       ${chalk.yellow(profile.email)}`);
		console.log(`Identifiant :  ${chalk.yellow(profile.username)}`);
		console.log(`Nom Complet :  ${chalk.yellow(profile.cn)}`);
		console.log(`Ville :        ${chalk.yellow(profile.city || "Non spécifiée")}`);
		console.log(`Pays :         ${chalk.yellow(profile.country || "Non spécifié")}`);

	} catch (error) {
		console.error(chalk.red("\nErreur :"), error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

main();
