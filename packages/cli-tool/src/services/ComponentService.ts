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
  cwd?: string;
}

export class ComponentService {
  private registryService: RegistryService;
  private dependencyService: DependencyService;

  private silent: boolean;
  private json: boolean;
  private cwd: string;

  private configPromise: ReturnType<typeof loadConfig>;

  constructor(options?: ServiceOptions) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;
    this.cwd = options?.cwd ?? process.cwd();

    // Load config relative to cwd
    this.configPromise = loadConfig(this.cwd);

    this.registryService = new RegistryService({
      silent: this.silent,
      json: this.json,
      cwd: this.cwd,
    });

    this.dependencyService = new DependencyService({
      silent: this.silent,
      json: this.json,
      cwd: this.cwd,
    });
  }

  public async install(name: string): Promise<void> {
    const spinner =
      !this.silent && !this.json ? ora(`Installing component: ${name}...`).start() : null;

    try {
      const config = await this.configPromise;

      const componentConfig = await this.registryService.getComponentConfig(name);

      if (!componentConfig) {
        throw new Error(`Component '${name}' not found.`);
      }

      // ================================
      // Install NPM dependencies
      // ================================
      if (componentConfig.dependencies?.length) {
        spinner && (spinner.text = `Installing dependencies...`);

        await this.dependencyService.install(componentConfig.dependencies, false);
      }

      // ================================
      // Install component dependencies
      // ================================
      if (componentConfig.componentDependencies?.length) {
        for (const dep of componentConfig.componentDependencies) {
          await this.install(dep);
        }
      }

      spinner && (spinner.text = `Downloading files...`);

      const baseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));

      // Resolve components directory relative to cwd
      const componentsDir = path.resolve(this.cwd, config.componentsDir);
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
    } catch (error) {
      spinner && spinner.fail(`Failed installing ${name}`);

      const message = error instanceof Error ? error.message : 'Install failed';

      if (!this.json) {
        logger.error(message);
      }

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      }

      process.exit(1);
    }
  }
}
