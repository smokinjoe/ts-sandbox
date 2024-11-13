import { v4 as randomUUID } from "uuid";

export type BaseRecord = {
  id: string;
};

interface DBTable<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

export function isOfTypeT<T extends BaseRecord>(
  obj: any,
  keys: (keyof T)[]
): obj is T {
  return keys.every((key) => key in obj);
}

export function createTable<T extends BaseRecord>(keys: (keyof T)[]) {
  class InMemoryDBTable implements DBTable<T> {
    private table: Record<string, T> = {};

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

      this.table[id] = objectToInsert;
      return id;
    }

    get(id: string): T | undefined {
      return this.table[id];
    }

    getBy(key: keyof T, value: any): T | undefined {
      return Object.values(this.table).find((record) => record[key] === value);
    }
  }

  return new InMemoryDBTable();
}

export function createDatabase() {
  class InMemoryDatabase {
    private tables: Record<string, any> = {};

    createTable<T extends BaseRecord>(name: string, keys: (keyof T)[]) {
      this.tables[name] = createTable<T>(keys);
    }

    getTable(name: string) {
      return this.tables[name];
    }
  }

  return new InMemoryDatabase();
}
