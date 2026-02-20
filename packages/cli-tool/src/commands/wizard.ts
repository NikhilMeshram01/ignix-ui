import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { logger } from '../utils/logger';

export const wizardCommand = new Command()
  .name('wizard')
  .description(
    chalk.hex('#FF6B35')('Launch interactive generators for themes, components, or setup.')
  )
  .argument('[target]', 'theme | component | setup')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (target, options) => {
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

    try {
      // ------------------------------------------------
      // No target provided
      // ------------------------------------------------
      if (!target) {
        if (json) {
          console.log(
            JSON.stringify({
              success: true,
              message: 'Wizard command available',
              targets: ['theme', 'component', 'setup'],
              cwd,
            })
          );
        } else {
          logger.warn('Wizards are coming soon!');
          logger.info('Available: theme, component, setup');
        }
        return;
      }

      // ------------------------------------------------
      // THEME WIZARD
      // ------------------------------------------------
      if (target === 'theme') {
        if (json) {
          console.log(
            JSON.stringify({
              success: false,
              error: 'Theme wizard not implemented yet',
              cwd,
            })
          );
          process.exit(1);
        }

        if (!silent) {
          logger.info(`Launching theme wizard in ${cwd}`);
        }

        logger.warn('Theme wizard coming soon');
        return;
      }

      // ------------------------------------------------
      // COMPONENT WIZARD
      // ------------------------------------------------
      if (target === 'component') {
        if (json) {
          console.log(
            JSON.stringify({
              success: false,
              error: 'Component wizard not implemented yet',
              cwd,
            })
          );
          process.exit(1);
        }

        if (!silent) {
          logger.info(`Launching component wizard in ${cwd}`);
        }

        logger.warn('Component wizard coming soon');
        return;
      }

      // ------------------------------------------------
      // SETUP WIZARD
      // ------------------------------------------------
      if (target === 'setup') {
        if (json) {
          console.log(
            JSON.stringify({
              success: false,
              error: 'Setup wizard not implemented yet',
              cwd,
            })
          );
          process.exit(1);
        }

        if (!silent) {
          logger.info(`Launching setup wizard in ${cwd}`);
        }

        logger.warn('Setup wizard coming soon');
        return;
      }

      exitWithError('Unknown wizard target');
    } catch (err) {
      exitWithError(err instanceof Error ? err.message : 'Wizard failed');
    }
  });
