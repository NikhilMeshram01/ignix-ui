import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import chalk from 'chalk';
import { logger } from '../utils/logger';
import { loadConfig } from '../utils/config';
import axios from 'axios';

export interface ThemePresetConfig {
  id: string;
  name: string;
  description: string;
  category?: string;
  theme: unknown;
}

interface Options {
  silent?: boolean;
  json?: boolean;
  cwd?: string;
}

export class ThemeService {
  private silent: boolean;
  private json: boolean;
  private cwd: string;
  private themes: Record<string, ThemePresetConfig> | null = null;

  constructor(options?: Options) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;
    this.cwd = options?.cwd ?? process.cwd();
  }

  private async fetchThemes(): Promise<Record<string, ThemePresetConfig>> {
    if (this.themes) return this.themes;

    const config = await loadConfig(this.cwd);

    const spinner = !this.silent && !this.json ? ora('Fetching themes...').start() : null;

    try {
      const response = await axios.get<Record<string, ThemePresetConfig>>(config.themeUrl);

      spinner && spinner.succeed('Themes fetched');
      this.themes = response.data;

      return this.themes;
    } catch (error) {
      spinner && spinner.fail('Failed to fetch themes');

      const message = error instanceof Error ? error.message : 'Could not fetch themes';

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }

      process.exit(1);
    }
  }

  public async getAvailableThemes(): Promise<ThemePresetConfig[]> {
    const themes = await this.fetchThemes();
    return Object.values(themes);
  }

  public async getThemeConfig(id: string): Promise<ThemePresetConfig | undefined> {
    const themes = await this.fetchThemes();
    return themes[id];
  }

  public async install(id: string): Promise<void> {
    const spinner = !this.silent && !this.json ? ora(`Installing theme: ${id}...`).start() : null;

    try {
      const config = await loadConfig(this.cwd);
      const themeConfig = await this.getThemeConfig(id);

      if (!themeConfig) throw new Error(`Theme '${id}' not found`);

      const destDir = path.resolve(this.cwd, config.themesDir);
      await fs.ensureDir(destDir);

      const destFile = path.join(destDir, `${id}.ts`);

      const variableName = id.replace(/-([a-z])/g, (_, l: string) => l.toUpperCase());

      const fileContent = `export const ${variableName}Theme = ${JSON.stringify(
        themeConfig.theme,
        null,
        2
      )};`;

      await fs.writeFile(destFile, fileContent);

      spinner && spinner.succeed(chalk.green(`Installed theme: ${chalk.cyan(id)}`));
    } catch (error) {
      spinner && spinner.fail(`Failed installing theme`);

      const message = error instanceof Error ? error.message : 'Theme install failed';

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }

      process.exit(1);
    }
  }
}
