import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import { ThemeService } from '../services/ThemeService';
import { logger } from '../utils/logger';

export const themesCommand = new Command()
  .name('themes')
  .description(chalk.hex('#FF7F50')('Manage themes'))
  .argument('[action]', 'list | install | info')
  .argument('[themeId]')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (action, themeId, options) => {
    const json = options.json;
    const silent = options.yes || json;
    const cwd = path.resolve(options.cwd || process.cwd());

    const exitWithError = (message: string): never => {
      if (json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }
      process.exit(1);
    };

    const themeService = new ThemeService({ silent, json, cwd });

    try {
      // ------------------------------
      // INTERACTIVE MODE (Human only)
      // ------------------------------
      if (!action && !silent) {
        await showInteractiveMenu(themeService);
        return;
      }

      // ------------------------------
      // LIST
      // ------------------------------
      if (action === 'list') {
        const themes = await themeService.getAvailableThemes();

        if (json) {
          console.log(JSON.stringify({ success: true, themes }));
        } else {
          console.log(chalk.bold('\nAvailable Themes:\n'));
          themes.forEach((theme) => {
            console.log(chalk.cyan(`  • ${theme.name}`) + chalk.gray(` (${theme.id})`));
            console.log(chalk.gray(`    ${theme.description}\n`));
          });
        }

        return;
      }

      // ------------------------------
      // INSTALL
      // ------------------------------
      if (action === 'install') {
        if (!themeId) {
          exitWithError('No theme specified');
        }

        await themeService.install(themeId);

        if (json) {
          console.log(JSON.stringify({ success: true, installed: themeId }));
        } else {
          console.log(`Installed theme ${themeId}`);
        }

        return;
      }

      // ------------------------------
      // INFO
      // ------------------------------
      if (action === 'info') {
        if (!themeId) {
          exitWithError('No theme specified');
        }

        const theme = await themeService.getThemeConfig(themeId);

        if (!theme) {
          exitWithError('Theme not found');
          return;
        }

        if (json) {
          console.log(JSON.stringify({ success: true, theme }));
          return;
        }

        console.log(chalk.bold(`\n${theme.name}`));
        console.log(chalk.gray(`ID: ${theme.id}`));
        console.log(chalk.gray(`Description: ${theme.description}`));
        console.log(chalk.bold('\nTheme Configuration:\n'));
        console.log(JSON.stringify(theme.theme, null, 2));

        return;
      }

      exitWithError('Invalid themes command');
    } catch (err) {
      exitWithError(err instanceof Error ? err.message : 'Themes command failed');
    }
  });

// ---------------------------------------------
// Interactive Human Menu
// ---------------------------------------------
async function showInteractiveMenu(themeService: ThemeService): Promise<void> {
  const spinner = ora();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do with themes?',
      choices: [
        { title: 'List available themes', value: 'list' },
        { title: 'Install a theme preset', value: 'install' },
        { title: 'View theme info', value: 'info' },
        { title: 'Exit', value: 'exit' },
      ],
    });

    if (!response.action || response.action === 'exit') {
      logger.info('Exiting theme manager.');
      break;
    }

    try {
      switch (response.action) {
        case 'list': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          if (themes.length === 0) {
            logger.warn('No themes available.');
          } else {
            console.log(chalk.bold('\nAvailable Themes:\n'));
            themes.forEach((theme) => {
              console.log(chalk.cyan(`  • ${theme.name}`) + chalk.gray(` (${theme.id})`));
              console.log(chalk.gray(`    ${theme.description}\n`));
            });
          }
          break;
        }

        case 'install': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          const installResponse = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select a theme to install:',
            choices: themes.map((t) => ({
              title: t.name,
              value: t.id,
            })),
          });

          if (installResponse.themeId) {
            await themeService.install(installResponse.themeId);
          }
          break;
        }

        case 'info': {
          spinner.start('Fetching available themes...');
          const themes = await themeService.getAvailableThemes();
          spinner.stop();

          const infoResponse = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select a theme to view details:',
            choices: themes.map((t) => ({
              title: t.name,
              value: t.id,
            })),
          });

          if (infoResponse.themeId) {
            const theme = await themeService.getThemeConfig(infoResponse.themeId);
            if (theme) {
              console.log(chalk.bold(`\n${theme.name}`));
              console.log(chalk.gray(`ID: ${theme.id}`));
              console.log(chalk.gray(`Description: ${theme.description}`));
              console.log(chalk.bold('\nTheme Configuration:\n'));
              console.log(JSON.stringify(theme.theme, null, 2));
            }
          }
          break;
        }
      }
    } catch (error) {
      spinner.fail('An error occurred');
      if (error instanceof Error) logger.error(error.message);
    }

    console.log('');
  }
}
