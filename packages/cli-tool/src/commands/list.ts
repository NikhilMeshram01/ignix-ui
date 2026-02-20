import { Command } from 'commander';
import path from 'path';
import chalk from 'chalk';
import { RegistryService } from '../services/RegistryService';
import { ThemeService } from '../services/ThemeService';
import { logger } from '../utils/logger';

export const listCommand = new Command()
  .name('list')
  .description(chalk.hex('#FF6B35')('List components or themes'))
  .argument('<namespace>')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (namespace, options) => {
    const json = options.json;
    const cwd = path.resolve(options.cwd || process.cwd());

    const registryService = new RegistryService({ json, cwd });
    const themeService = new ThemeService({ json, cwd });

    try {
      switch (namespace) {
        case 'component':
        case 'components': {
          const components = await registryService.getAvailableComponents();

          if (json) {
            console.log(JSON.stringify({ success: true, components }));
          } else {
            logger.info(chalk.bold('Available Components:'));
            components.forEach((c) => {
              console.log(`- ${chalk.cyan(c.name)}: ${c.description}`);
            });
          }
          break;
        }

        case 'theme':
        case 'themes': {
          const themes = await themeService.getAvailableThemes();

          if (json) {
            console.log(JSON.stringify({ success: true, themes }));
          } else {
            logger.info(chalk.bold('Available Themes:'));
            themes.forEach((t) => {
              console.log(`- ${chalk.cyan(t.name)} (${t.id}): ${t.description}`);
            });
          }
          break;
        }

        default:
          if (json) {
            console.log(JSON.stringify({ success: false, error: 'Unknown namespace' }));
          } else {
            logger.error(`Unknown namespace '${namespace}'`);
          }
          process.exit(1);
      }
    } catch (err) {
      if (json) {
        console.log(JSON.stringify({ success: false, error: 'List failed' }));
      } else {
        logger.error('List failed');
      }
      process.exit(1);
    }
  });
