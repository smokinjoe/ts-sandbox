import { v4 as randomUUID } from "uuid";

export type BaseRecord = {
  id: string;
};

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

/**
 * Unused because I can't figure out how to abstract the keys
 */
export function isOfTypeT<T extends BaseRecord>(
  obj: any,
  keys: (keyof T)[]
): obj is T {
  return keys.every((key) => key in obj);
}

export function createDatabase<T extends BaseRecord>(keys: (keyof T)[]) {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    set(newValue: Omit<T, "id">): string {
      const id = randomUUID();

      const objectToInsert: T = {
        id,
        ...newValue,
      } as T;

      if (keys?.length > 0 && !isOfTypeT<T>(objectToInsert, keys)) {
        throw new Error(
          "Could not insert object into database due to type mismatch"
        );
      }

      this.db[id] = objectToInsert;
      return id;
    }

    get(id: string): T | undefined {
      return this.db[id];
    }

    getBy(key: keyof T, value: any): T | undefined {
      return Object.values(this.db).find((record) => record[key] === value);
    }
  }

  return InMemoryDatabase;
}
