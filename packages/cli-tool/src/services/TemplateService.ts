import axios from 'axios';
import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { RegistryService } from './RegistryService';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';
import { DependencyService } from './DependencyService';
import { ComponentService } from './ComponentService';

export class TemplateService {
  private registryService = new RegistryService();
  private dependencyService: DependencyService;
  private silent: boolean;
  private json: boolean;
  private config = loadConfig();

  constructor(options?: { silent?: boolean; json?: boolean }) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;

    this.dependencyService = new DependencyService({
      silent: this.silent,
      json: this.json,
    });
  }

  public async install(name: string): Promise<void> {
    const spinner =
      !this.silent && !this.json ? ora(`Installing template: ${name}...`).start() : null;

    try {
      const config = await this.config;
      const templateConfig = await this.registryService.getComponentConfig(name);

      if (!templateConfig) throw new Error(`Template '${name}' not found.`);

      if (templateConfig.dependencies?.length) {
        await this.dependencyService.install(templateConfig.dependencies, false);
      }

      if (templateConfig.componentDependencies?.length) {
        for (const dep of templateConfig.componentDependencies) {
          const compService = new ComponentService({
            silent: this.silent,
            json: this.json,
          });
          await compService.install(dep);
        }
      }

      const templateDir = path.resolve(config.templateDir, name);
      await fs.ensureDir(templateDir);

      const baseUrl = config.registryUrl.substring(0, config.registryUrl.lastIndexOf('/'));

      for (const key in templateConfig.files) {
        const fileInfo = templateConfig.files[key];
        const fileUrl = `${baseUrl}/${fileInfo.path}`;

        const { data } = await axios.get(fileUrl, { responseType: 'text' });

        const fileName = path.basename(fileInfo.path);
        await fs.writeFile(path.join(templateDir, fileName), data);
      }

      spinner && spinner.succeed(chalk.green(`Template installed: ${chalk.cyan(name)}`));

      if (this.json) {
        console.log(JSON.stringify({ template: name, status: 'installed' }));
      }
    } catch (error) {
      spinner && spinner.fail(`Failed installing template`);

      const message = error instanceof Error ? error.message : 'Template install failed';

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }

      process.exit(1);
    }
  }
}
