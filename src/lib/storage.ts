import fs from "fs/promises";
import path from "path";

export interface Storage {
  save(filePath: string, buffer: Buffer): Promise<string>;
  getUrl(filePath: string): string;
}

export class LocalStorage implements Storage {
  private baseDir: string;
  constructor(baseDir = path.join(process.cwd(), "uploads")) {
    this.baseDir = baseDir;
  }
  async save(filePath: string, buffer: Buffer): Promise<string> {
    const full = path.join(this.baseDir, filePath);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, buffer);
    return filePath;
  }
  getUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }
}

export const storage: Storage = new LocalStorage();
export default storage;
