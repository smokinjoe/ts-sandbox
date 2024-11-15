import { v4 as randomUUID } from "uuid";

export type BaseRecord = {
  id: string;
};

interface DBTable<T extends BaseRecord> {
  set(newValue: Omit<T, "id">): string;
  get(id: string): T | undefined;
  getBy(key: keyof T, value: any): T | undefined;
  update: (id: string, newValue: Partial<T>) => T | undefined;
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

    update(id: string, newValue: Partial<T>): T | undefined {
      const record = this.table[id];

      if (!record) {
        return undefined;
      }

      const updatedRecord: T = {
        ...record,
        ...newValue,
      };

      if (keys?.length > 0 && !isOfTypeT<T>(updatedRecord, keys)) {
        throw new Error(
          "Could not update object in database due to type mismatch"
        );
      }

      this.table[id] = updatedRecord;
      return updatedRecord;
    }
  }

  return new InMemoryDBTable();
}

export function createDatabase() {
  class InMemoryDatabase {
    private tables: Record<string, DBTable<any>> = {};

    createTable<T extends BaseRecord>(name: string, keys: (keyof T)[]) {
      this.tables[name] = createTable<T>(keys);
    }

    getTable(name: string) {
      return this.tables[name];
    }
  }

  return new InMemoryDatabase();
}
