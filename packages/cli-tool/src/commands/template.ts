import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import ora from 'ora';
import path from 'path';
import { logger } from '../utils/logger';
import { TemplateService } from '../services/TemplateService';
import { RegistryService } from '../services/RegistryService';

export const templateCommand = new Command()
  .name('template')
  .description(chalk.hex('#FF7F50')('Manage templates'))
  .argument('[action]', 'list | install')
  .argument('[templateId]')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (action, templateId, options) => {
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

    const registryService = new RegistryService({ json, cwd });
    const templateService = new TemplateService({ silent, json, cwd });

    try {
      // -----------------------------
      // HUMAN INTERACTIVE MODE
      // -----------------------------
      if (!action && !silent) {
        await showInteractiveMenu(registryService, templateService);
        return;
      }

      // -----------------------------
      // LIST MODE
      // -----------------------------
      if (action === 'list') {
        const templates = await registryService.getAvailableTemplates();

        if (json) {
          console.log(JSON.stringify({ success: true, templates }));
        } else {
          console.log(chalk.bold('\nAvailable Templates:\n'));
          templates.forEach((template) => {
            console.log(chalk.cyan(`  • ${template.name}`));
            console.log(chalk.gray(`    ${template.description}\n`));
          });
        }

        return;
      }

      // -----------------------------
      // INSTALL MODE
      // -----------------------------
      if (action === 'install') {
        if (!templateId) {
          exitWithError('No template specified');
        }

        await templateService.install(templateId);

        if (json) {
          console.log(JSON.stringify({ success: true, installed: templateId }));
        } else {
          console.log(`Installed template ${templateId}`);
        }

        return;
      }

      exitWithError('Invalid template command');
    } catch (err) {
      exitWithError(err instanceof Error ? err.message : 'Template command failed');
    }
  });

// ---------------------------------------------
// Interactive Menu (Human Only)
// ---------------------------------------------
async function showInteractiveMenu(
  registryService: RegistryService,
  templateService: TemplateService
): Promise<void> {
  const spinner = ora();

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const response = await prompts({
      type: 'select',
      name: 'action',
      message: 'What would you like to do with templates?',
      choices: [
        { title: 'List available templates', value: 'list' },
        { title: 'Install a template', value: 'install' },
        { title: 'Exit', value: 'exit' },
      ],
    });

    if (!response.action || response.action === 'exit') {
      logger.info('Exiting template manager.');
      break;
    }

    try {
      switch (response.action) {
        case 'list': {
          spinner.start('Fetching templates...');
          const templates = await registryService.getAvailableTemplates();
          spinner.stop();

          if (templates.length === 0) {
            logger.warn('No templates available.');
          } else {
            console.log(chalk.bold('\nAvailable Templates:\n'));
            templates.forEach((template) => {
              console.log(chalk.cyan(`  • ${template.name}`));
              console.log(chalk.gray(`    ${template.description}\n`));
            });
          }
          break;
        }

        case 'install': {
          spinner.start('Fetching templates...');
          const templates = await registryService.getAvailableTemplates();
          spinner.stop();

          const choices = templates.map((tpl) => ({
            title: tpl.name,
            value: tpl.id,
          }));

          const installResponse = await prompts({
            type: 'select',
            name: 'templateId',
            message: 'Select a template to install:',
            choices,
          });

          if (installResponse.templateId) {
            await templateService.install(installResponse.templateId);
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
