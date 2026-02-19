import axios from 'axios';
import ora from 'ora';
import { loadConfig } from '../utils/config';
import { logger } from '../utils/logger';

interface ComponentFile {
  path: string;
  type: string;
}

export interface ComponentConfig {
  id?: string;
  name: string;
  description: string;
  dependencies?: string[];
  componentDependencies?: string[];
  files: Record<string, ComponentFile>;
}

interface ComponentRegistry {
  components: Record<string, ComponentConfig>;
}

interface ServiceOptions {
  silent?: boolean;
  json?: boolean;
}

export class RegistryService {
  private componentRegistry: ComponentRegistry | null = null;
  private silent: boolean;
  private json: boolean;

  constructor(options?: ServiceOptions) {
    this.silent = options?.silent ?? false;
    this.json = options?.json ?? false;
  }

  //------------------------------------------------------------
  // Fetch component registry
  //------------------------------------------------------------
  private async fetchRegistry(): Promise<ComponentRegistry> {
    if (this.componentRegistry) return this.componentRegistry;

    const config = await loadConfig();

    const spinner =
      !this.silent && !this.json ? ora('Fetching component registry...').start() : null;

    try {
      const response = await axios.get<ComponentRegistry>(config.registryUrl);

      spinner && spinner.succeed('Registry fetched');

      this.componentRegistry = response.data;
      return this.componentRegistry;
    } catch (error) {
      spinner && spinner.fail('Registry fetch failed');

      const message = error instanceof Error ? error.message : 'Could not fetch component registry';
      logger.error(message);
      // if (this.json) {
      //   console.log(JSON.stringify({ success: false, error: message }));
      // } else {
      //   logger.error(message);
      // }

      process.exit(1);
    }
  }

  //------------------------------------------------------------
  // GET component config
  //------------------------------------------------------------
  public async getComponentConfig(name: string): Promise<ComponentConfig | undefined> {
    const registry = await this.fetchRegistry();

    return Object.values(registry.components).find(
      (c) => c.name.toLowerCase() === name.toLowerCase()
    );
  }

  //------------------------------------------------------------
  // LIST components
  //------------------------------------------------------------
  public async getAvailableComponents(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components);
  }

  //------------------------------------------------------------
  // Templates (if using same registry structure)
  //------------------------------------------------------------
  public async getAvailableTemplates(): Promise<ComponentConfig[]> {
    const registry = await this.fetchRegistry();
    return Object.values(registry.components);
  }
}
