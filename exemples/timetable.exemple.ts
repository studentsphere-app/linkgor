import { select } from '@inquirer/prompts';
import chalk from 'chalk';
import { getPlanning, Lesson } from '../src';
import { authenticate } from './authentification.exemple';

function printLessons(lessons: Lesson[]) {
	for (const lesson of lessons) {
		const start = new Date(lesson.Start);
		const end = new Date(lesson.End);
		const timeFrom = start.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
		const timeTo = end.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
		
		console.log(chalk.cyan('┌─ ') + chalk.bold.yellow(timeFrom) + chalk.cyan(' → ') + chalk.bold.yellow(timeTo));

		const subject = lesson.Matiere || lesson.Title || "Unknown";
		const subjectFormatted = chalk.bold.blue(subject);
		console.log(chalk.cyan('│  ') + subjectFormatted);

		const rooms = lesson.Salles || "Unknown";
		const teacher = lesson.NomProf || "Unknown";
		console.log(chalk.cyan('└─ ') + chalk.gray(`${rooms} - ${teacher}`) + '\n');
	}
}

async function main() {
	try {
		const { instanceId, user } = await authenticate();

		console.log(chalk.blue("\nFetching timetable..."));
		const lessons = await getPlanning(instanceId, user.token);

		if (lessons.length === 0) {
			console.log(chalk.yellow("\nNo lessons found in the timetable."));
			return;
		}

		console.log(chalk.green(`\n✔ ${lessons.length} lessons fetched!`));

		const lessonsByDay = new Map<string, { date: Date; lessons: Lesson[] }>();

		for (const lesson of lessons) {
			const start = new Date(lesson.Start);
			const key = start.toISOString().split('T')[0];
			if (!lessonsByDay.has(key)) {
				const date = new Date(start.getFullYear(), start.getMonth(), start.getDate());
				lessonsByDay.set(key, { date, lessons: [] });
			}
			lessonsByDay.get(key)!.lessons.push(lesson);
		}

		const sortedDays = Array.from(lessonsByDay.values()).sort(
			(a, b) => a.date.getTime() - b.date.getTime()
		);

		for (const day of sortedDays) {
			day.lessons.sort((a, b) => new Date(a.Start).getTime() - new Date(b.Start).getTime());
		}

		const selectedDay = await select({
			message: "Choose the day you want to view",
			choices: sortedDays.map((day) => ({
				name: day.date.toLocaleDateString("fr-FR", {
					weekday: 'long',
					day: 'numeric',
					month: 'long',
					year: 'numeric',
				}),
				value: day,
			})),
		});

		printLessons(selectedDay.lessons);

	} catch (error) {
		console.error(chalk.red("\nError:"), error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

main();
