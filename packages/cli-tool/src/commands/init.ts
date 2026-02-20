import { Command } from 'commander';
import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { DependencyService } from '../services/DependencyService';
import prompts from 'prompts';
import { ThemeService } from '../services/ThemeService';

const DEFAULT_CONFIG_PATH = 'ignix.config.js';

export const initCommand = new Command()
  .name('init')
  .description(chalk.bold(chalk.hex('#FF7A3D')('Initialize Ignix UI in your project.')))
  .option('-y, --yes', 'Skip prompts')
  .option('--json', 'Machine output')
  .option('--cwd <path>', 'Working directory', '.')
  .action(async (options) => {
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

    const spinner = !silent ? ora('Initializing Ignix UI...').start() : null;

    try {
      await validateEnvironment(cwd);
      await createProjectStructure(cwd);
      await createConfigFiles(cwd);
      await setupIgnixUIAlias(cwd);

      const configPath = path.resolve(cwd, DEFAULT_CONFIG_PATH);

      if (!(await fs.pathExists(configPath))) {
        exitWithError('ignix.config.js not found after init');
      }

      const config = await import(`file://${configPath}?t=${Date.now()}`).then(
        (m) => m.default || m
      );

      await fs.ensureDir(path.resolve(cwd, config.componentsDir));
      await fs.ensureDir(path.resolve(cwd, config.themesDir));

      if (!silent) logger.success('Created required directories.');

      // Optional theming (interactive only)
      if (!silent) {
        const themingResponse = await prompts({
          type: 'select',
          name: 'setupTheming',
          message: 'Set up theming system?',
          choices: [
            { title: 'Yes', value: true },
            { title: 'No', value: false },
          ],
        });

        if (themingResponse.setupTheming) {
          const themeService = new ThemeService({ cwd });
          const themes = await themeService.getAvailableThemes();

          const preset = await prompts({
            type: 'select',
            name: 'themeId',
            message: 'Select theme preset:',
            choices: [
              ...themes.map((t) => ({ title: t.name, value: t.id })),
              { title: 'Skip', value: null },
            ],
          });

          if (preset.themeId) {
            await themeService.install(preset.themeId);
          }
        }
      }

      const depService = new DependencyService({ silent, json, cwd });

      await depService.install(['@mindfiredigital/ignix-ui'], false);
      await depService.install(['tailwindcss', 'postcss', 'autoprefixer'], true);

      spinner && spinner.succeed('Ignix initialized');

      if (json) {
        console.log(JSON.stringify({ success: true, initialized: true }));
      }
    } catch (err) {
      spinner && spinner.fail('Initialization failed');
      exitWithError(err instanceof Error ? err.message : 'Init failed');
    }
  });

// ---------------- Helpers ----------------

async function validateEnvironment(cwd: string) {
  const hasPackageJson = await fs.pathExists(path.join(cwd, 'package.json'));
  if (!hasPackageJson) throw new Error('No package.json found');

  const hasNodeModules = await fs.pathExists(path.join(cwd, 'node_modules'));
  if (!hasNodeModules) throw new Error('Run npm install first');
}

async function createProjectStructure(cwd: string) {
  await fs.ensureDir(path.join(cwd, 'src/components/ui'));
  await fs.ensureDir(path.join(cwd, 'src/utils'));
}

async function createConfigFiles(cwd: string) {
  const configTemplate = path.resolve(__dirname, './templates/ignix.config.js');
  const dest = path.join(cwd, DEFAULT_CONFIG_PATH);

  if (!(await fs.pathExists(dest))) {
    await fs.copy(configTemplate, dest);
  }

  const llmsPath = path.join(cwd, 'llms.txt');
  if (!(await fs.pathExists(llmsPath))) {
    await fs.writeFile(
      llmsPath,
      `# Ignix UI\nReact component CLI with AI support.\nUse:\nnpx ignix add component button --yes --json`
    );
  }
}

async function setupIgnixUIAlias(cwd: string) {
  const templatesDir = path.resolve(__dirname, './templates');

  await fs.copy(path.join(templatesDir, 'tsconfig.app.json'), path.join(cwd, 'tsconfig.app.json'));

  await fs.copy(path.join(templatesDir, 'vite.config.ts'), path.join(cwd, 'vite.config.ts'));
}
