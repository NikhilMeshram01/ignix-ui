import { getPackageManager } from '../utils/getPackageManager';
import { logger } from '../utils/logger';
import { execa } from 'execa';

interface ServiceOptions {
  silent?: boolean;
  json?: boolean;
}

export class DependencyService {
  private silent: boolean;
  private json: boolean;

  constructor(options?: ServiceOptions) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;
  }

  public async install(packages: string[], isDev: boolean): Promise<void> {
    if (!packages || packages.length === 0) return;

    const packageManager = await getPackageManager();
    const args: string[] = [];

    if (packageManager === 'npm') {
      args.push('install');
      if (isDev) args.push('--save-dev');
    } else {
      args.push('add');
      if (isDev) args.push('-D');
    }

    args.push(...packages);

    try {
      if (!this.silent && !this.json) {
        logger.info(`Installing dependencies: ${packageManager} ${args.join(' ')}`);
      }

      await execa(packageManager, args, {
        stdio: this.silent || this.json ? 'pipe' : 'inherit',
        cwd: process.cwd(),
      });

      if (!this.silent && !this.json) {
        logger.success(`Installed: ${packages.join(', ')}`);
      }

      if (this.json) {
        console.log(JSON.stringify({ success: true, dependenciesInstalled: packages }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Dependency install failed';

      if (this.json) {
        console.log(JSON.stringify({ success: false, error: message }));
      } else {
        logger.error(message);
      }

      throw new Error(`Failed to install dependencies: ${packages.join(', ')}`);
    }
  }
}
