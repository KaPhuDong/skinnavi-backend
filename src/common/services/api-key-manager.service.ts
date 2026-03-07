import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyManagerService {
  private keys: string[];
  private currentIndex = 0;
  private readonly logger = new Logger(ApiKeyManagerService.name);

  constructor(private configService: ConfigService) {
    const keysString = this.configService.get<string>('GEMINI_API_KEYS') || '';
    const singleKey = this.configService.get<string>('GEMINI_API_KEY');

    this.keys = keysString
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k !== '');
    if (singleKey && !this.keys.includes(singleKey)) {
      this.keys.push(singleKey);
    }

    if (this.keys.length === 0) {
      throw new Error('No GEMINI_API_KEYS found in environment');
    }
  }

  getCurrentKey(): string {
    return this.keys[this.currentIndex];
  }

  getNextKey(): string {
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    this.logger.warn(`Switching to API Key at index ${this.currentIndex}`);
    return this.getCurrentKey();
  }

  get totalKeys(): number {
    return this.keys.length;
  }
}
