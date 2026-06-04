import { CoreLogger } from './logger';

export interface SdkConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  debug?: boolean;
}

export interface ApiResponse<T> {
  data: T | null;
  status: number;
  success: boolean;
  error?: string;
}

export class CoreSdkClient {
  private config: SdkConfig;
  private logger: CoreLogger;

  constructor(config: SdkConfig) {
    this.config = {
      timeout: 10000,
      headers: {},
      debug: false,
      ...config,
    };
    this.logger = new CoreLogger({
      prefix: '[CoreSdkClient]',
      logLevel: this.config.debug ? 'debug' : 'info',
    });
    this.logger.info(`Initialized with baseUrl: ${this.config.baseUrl}`);
  }

  public async get<T>(path: string): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    this.logger.debug(`GET request to: ${url}`);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data: data as T,
        status: response.status,
        success: true,
      };
    } catch (err: any) {
      this.logger.error(`GET request failed for path: ${path}. Error: ${err.message}`);
      return {
        data: null,
        status: 500,
        success: false,
        error: err.message || 'Unknown network error',
      };
    }
  }
}
