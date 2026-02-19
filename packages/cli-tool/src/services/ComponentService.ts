import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';

interface ServiceOptions {
  silent?: boolean;
  json?: boolean;
}

export class ComponentService {
  private registryService = new RegistryService();
  private dependencyService: DependencyService;
  private config = loadConfig();
  private silent: boolean;
  private json: boolean;

  constructor(options?: ServiceOptions) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;

    this.dependencyService = new DependencyService({
      silent: this.silent,
      json: this.json,
    });
  }

  public async install(name: string): Promise<void> {
    const spinner =
      !this.silent && !this.json ? ora(`Installing component: ${name}...`).start() : null;

    try {
      const config = await this.config;
      const componentConfig = await this.registryService.getComponentConfig(name);

      if (!componentConfig) {
        throw new Error(`Component '${name}' not found.`);
      }

      if (componentConfig.dependencies?.length) {
        spinner && (spinner.text = `Installing dependencies...`);
        await this.dependencyService.install(componentConfig.dependencies, false);
      }

      if (componentConfig.componentDependencies?.length) {
        for (const dep of componentConfig.componentDependencies) {
          await this.install(dep);
        }
      }

      spinner && (spinner.text = `Downloading files...`);

      const baseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));

      const componentsDir = path.resolve(config.componentsDir);
      const componentDir = path.join(componentsDir, name.toLowerCase());

      await fs.ensureDir(componentDir);

      for (const fileKey in componentConfig.files) {
        const fileInfo = componentConfig.files[fileKey];
        const fileUrl = `${baseUrl}/${fileInfo.path}`;

        const { data: content } = await axios.get(fileUrl, {
          responseType: 'text',
        });

        const fileName = path.basename(fileInfo.path);
        const filePath = path.join(componentDir, fileName);

        await fs.writeFile(filePath, content);
      }

      if (spinner) {
        spinner.succeed(chalk.green(`Installed component: ${chalk.cyan(name)}`));
        logger.info(`Files written → ${chalk.yellow(componentDir)}`);
      }

      if (this.json) {
        console.log(JSON.stringify({ component: name, status: 'installed' }));
      }
    } catch (error) {
      spinner && spinner.fail(`Failed installing ${name}`);

      const message = error instanceof Error ? error.message : 'Install failed';

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }

      process.exit(1);
    }
  }
}
