import path from 'path';
import fs from 'fs-extra';
import { logger } from './logger';

const DEFAULT_CONFIG_FILENAME = 'ignix.config.js';

export interface IgnixConfig {
  registryUrl: string;
  themeUrl: string;
  componentsDir: string;
  themesDir: string;
  tokensDir: string;
  templateLayoutUrl: string;
  templateDir: string;
}

export async function loadConfig(cwd: string = process.cwd()): Promise<IgnixConfig> {
  const configPath = path.resolve(cwd, DEFAULT_CONFIG_FILENAME);

  if (!(await fs.pathExists(configPath))) {
    logger.error('Configuration file `ignix.config.js` not found.');
    logger.info("Please run 'npx ignix init' to create a configuration file.");
    process.exit(1);
  }

  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');

    // Try JSON first
    try {
      return JSON.parse(fileContent);
    } catch {
      // not JSON
    }

    const isESM = fileContent.includes('export default') || fileContent.includes('export const');

    if (isESM) {
      const fileUrl = `file://${configPath}?t=${Date.now()}`;
      const module = await import(fileUrl);
      return module.default || module;
    }

    const tempFile = path.join(path.dirname(configPath), `temp-config-${Date.now()}.cjs`);

    try {
      await fs.writeFile(
        tempFile,
        `module.exports = ${fileContent.trim().replace(/^module\.exports\s*=\s*|\s*;?\s*$/g, '')};`
      );

      const module = await import(`file://${tempFile}?t=${Date.now()}`);
      const config = module.default || module;

      await fs.remove(tempFile).catch((err) => {
        if (err) logger.warn(`Temp cleanup failed: ${err}`);
      });

      return config;
    } catch (e) {
      await fs.remove(tempFile).catch((err) => {
        if (err) logger.warn(`Temp cleanup failed: ${err}`);
      });
      throw e;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error(`Failed to load \`${DEFAULT_CONFIG_FILENAME}\`. Error: ${errorMessage}`);

    process.exit(1);
  }
}
