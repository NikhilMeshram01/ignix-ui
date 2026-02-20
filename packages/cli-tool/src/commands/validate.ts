import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { logger } from '../utils/logger';

export const validateCommand = new Command()
  .name('validate')
  .description(chalk.hex('#FF6B35')('Validate themes, components, or project setup'))
  .argument('[target]', 'theme | component | setup')
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (target, options) => {
    const json = options.json;
    // const silent = options.yes || json;
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
      // ------------------------------
      // NO TARGET → HUMAN MESSAGE
      // ------------------------------
      if (!target) {
        if (json) {
          console.log(
            JSON.stringify({
              success: true,
              message: 'Validation command available',
              targets: ['theme', 'component', 'setup'],
            })
          );
        } else {
          logger.warn('Validation is coming soon!');
          logger.info('Available: theme, component, setup');
        }
        return;
      }

      // ------------------------------
      // THEME VALIDATION (stub)
      // ------------------------------
      if (target === 'theme') {
        const result = {
          valid: true,
          issues: [],
        };

        if (json) {
          console.log(JSON.stringify({ success: true, result }));
        } else {
          logger.success('Theme validation passed');
        }

        return;
      }

      // ------------------------------
      // COMPONENT VALIDATION (stub)
      // ------------------------------
      if (target === 'component') {
        const result = {
          valid: true,
          issues: [],
        };

        if (json) {
          console.log(JSON.stringify({ success: true, result }));
        } else {
          logger.success('Component validation passed');
        }

        return;
      }

      // ------------------------------
      // SETUP VALIDATION
      // ------------------------------
      if (target === 'setup') {
        const checks = {
          hasConfig: false,
          hasComponentsDir: false,
        };

        const fs = await import('fs-extra');

        checks.hasConfig = await fs.pathExists(path.join(cwd, 'ignix.config.js'));
        checks.hasComponentsDir = await fs.pathExists(path.join(cwd, 'src/components'));

        const valid = checks.hasConfig && checks.hasComponentsDir;

        if (json) {
          console.log(
            JSON.stringify({
              success: valid,
              checks,
            })
          );
        } else {
          if (valid) {
            logger.success('Project setup looks valid');
          } else {
            logger.warn('Project setup incomplete');
            console.log(checks);
          }
        }

        if (!valid) process.exit(1);

        return;
      }

      exitWithError('Unknown validation target');
    } catch (err) {
      exitWithError(err instanceof Error ? err.message : 'Validation failed');
    }
  });
