export interface ICache {
  keyGet(key: string): Promise<string|null>;
  keySet<T>(key: string, value: string): void;
  keySet<T>(key: string, value: string, options?: T): void;

  setAdd(key: string, values: string[]): Promise<number>;
  setGetAll(key: string): Promise<string[]>;
};