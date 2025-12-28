import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const CONFIG_FILE = join(process.cwd(), 'src', 'data', 'config.json');

export interface ParkConfig {
  maintenanceMode: boolean;
  parkStatus: 'open' | 'closed' | 'maintenance';
  globalMessage: string;
  alertLevel: 'none' | 'info' | 'warning' | 'error';
  nextOpening: string;
  announcementBanner?: {
    enabled: boolean;
    dismissible: boolean;
    dismissalFrequency: 'session' | 'daily';
    displayMode: 'always' | 'scheduled';
    contentType: 'image' | 'text';
    text?: string;
    imageUrl?: string;
    startAt?: string;
    endAt?: string;
    version?: string;
  };
  [key: string]: unknown;
}

export async function get_config(): Promise<ParkConfig> {
  try {
    const data = await readFile(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading config:', error);
    // Return default config if file doesn't exist or error
    return {
      maintenanceMode: false,
      parkStatus: 'open',
      globalMessage: '',
      alertLevel: 'none',
      nextOpening: '',
      announcementBanner: {
        enabled: false,
        dismissible: true,
        dismissalFrequency: 'session',
        displayMode: 'always',
        contentType: 'image',
        text: '',
        imageUrl: '',
        startAt: '',
        endAt: '',
        version: '1'
      }
    };
  }
}

export async function update_config(updatedConfig: Partial<ParkConfig>): Promise<ParkConfig> {
  try {
    const currentConfig = await get_config();
    // We ensure newConfig has all required fields from currentConfig, overriding with updatedConfig
    const newConfig: ParkConfig = { ...currentConfig, ...updatedConfig };
    await writeFile(CONFIG_FILE, JSON.stringify(newConfig, null, 2));
    return newConfig;
  } catch (error) {
    console.error('Error updating config:', error);
    throw new Error('Failed to update config');
  }
}
