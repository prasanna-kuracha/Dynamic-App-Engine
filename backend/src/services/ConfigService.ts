import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { AppConfigSchema, type AppConfig } from '../shared/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ConfigService {
  private configPath = path.join(__dirname, '../../../configs/todo.json');

  getConfig(): AppConfig {
    const rawData = fs.readFileSync(this.configPath, 'utf-8');
    const config = JSON.parse(rawData);
    return AppConfigSchema.parse(config);
  }
}
