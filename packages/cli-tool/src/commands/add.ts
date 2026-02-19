import { Command } from 'commander';
import prompts from 'prompts';
import { ComponentService } from '../services/ComponentService';
import { RegistryService } from '../services/RegistryService';
import { logger } from '../utils/logger';
import chalk from 'chalk';
import { ThemeService } from '../services/ThemeService';
import { TemplateService } from '../services/TemplateService';

export const addCommand = new Command()
  .name('add')
  .description(chalk.hex('#FF8C00')('Add components, themes, or templates'))
  .argument('<namespace>')
  .argument('[identifiers...]')
  .option('-y, --yes', 'Skip prompts')
  .option('-s, --silent', 'Silent mode')
  .option('--json', 'Machine output')
  .action(async (namespace: string, identifiers: string[] = [], options) => {
    const silent = options.yes || options.silent;
    const json = options.json;

    const registryService = new RegistryService({ silent, json });

    const exitWithError = (message: string): never => {
      if (json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }
      process.exit(1);
    };

    switch (namespace) {
      // =====================================================
      // COMPONENTS
      // =====================================================
      case 'component':
      case 'components': {
        const componentService = new ComponentService({ silent, json });
        const templateService = new TemplateService({ silent, json });

        if (!silent && !json) logger.info('Adding components...');

        const availableComponents = await registryService.getAvailableComponents();

        type Selected = { name: string; type: string };
        let selectedItems: Selected[] = [];

        // ---------------- INTERACTIVE ----------------
        if (identifiers.length === 0 && !options.yes) {
          const response = await prompts({
            type: 'select',
            name: 'component',
            message: chalk.green('Select component'),
            choices: availableComponents.map((c) => ({
              title: c.name,
              value: {
                name: (c.id || c.name).toLowerCase(),
                type: c.files.main.type,
              },
            })),
          });

          if (!response.component) return;
          selectedItems = [response.component];
        }

        // ---------------- DIRECT MODE ----------------
        else {
          if (identifiers.length === 0) {
            exitWithError('No component specified');
          }

          const normalized = identifiers.map((i) => i.toLowerCase());

          selectedItems = availableComponents
            .filter((c) => {
              const name = c.name.toLowerCase();
              const id = c.id?.toLowerCase();
              return normalized.includes(name) || normalized.includes(id ?? '');
            })
            .map((c) => ({
              name: (c.id || c.name).toLowerCase(),
              type: c.files.main.type,
            }));
        }

        if (selectedItems.length === 0) {
          exitWithError('No matching component found');
        }

        for (const item of selectedItems) {
          // Show minimal log in --yes mode
          if (!json) {
            console.log(`Installing ${item.name}`);
          }

          if (item.type === 'component') {
            await componentService.install(item.name);
          } else if (item.type === 'template') {
            await templateService.install(item.name);
          }
        }

        // FINAL JSON OUTPUT (ONLY HERE)
        if (json) {
          console.log(
            JSON.stringify({
              success: true,
              installed: selectedItems.map((i) => i.name),
            })
          );
        }

        break;
      }

      // =====================================================
      // THEMES
      // =====================================================
      case 'theme':
      case 'themes': {
        const themeService = new ThemeService({ silent, json });
        const availableThemes = await themeService.getAvailableThemes();

        if (identifiers.length === 0 && !options.yes) {
          const response = await prompts({
            type: 'multiselect',
            name: 'themes',
            message: 'Select themes',
            choices: availableThemes.map((t) => ({
              title: t.name,
              value: t.id,
            })),
          });

          identifiers = response.themes || [];
        }

        if (identifiers.length === 0) {
          exitWithError('No theme specified');
        }

        for (const id of identifiers) {
          if (!json) console.log(`Installing theme ${id}`);
          await themeService.install(id.toLowerCase());
        }

        if (json) {
          console.log(JSON.stringify({ success: true, installed: identifiers }));
        }

        break;
      }

      // =====================================================
      // TEMPLATES
      // =====================================================
      case 'template':
      case 'templates': {
        const templateService = new TemplateService({ silent, json });
        const availableTemplates = await registryService.getAvailableTemplates();

        if (identifiers.length === 0 && !options.yes) {
          const response = await prompts({
            type: 'select',
            name: 'template',
            message: 'Select template',
            choices: availableTemplates.map((t) => ({
              title: t.name,
              value: t.id,
            })),
          });

          identifiers = response.template ? [response.template] : [];
        }

        if (identifiers.length === 0) {
          exitWithError('No template specified');
        }

        for (const id of identifiers) {
          if (!json) console.log(`Installing template ${id}`);
          await templateService.install(id.toLowerCase());
        }

        if (json) {
          console.log(JSON.stringify({ success: true, installed: identifiers }));
        }

        break;
      }

      default:
        exitWithError(`Unknown namespace '${namespace}'`);
    }
  });
