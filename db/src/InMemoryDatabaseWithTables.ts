import { v4 as randomUUID } from "uuid";

export type BaseRecord = {
  id: string;
};

interface DBTable<T extends BaseRecord> {
  set(newValue: Omit<T, "id">): string;
  get(id: string): T | undefined;
  getBy(key: keyof T, value: T[keyof T]): T | undefined;
  update(id: string, newValue: Partial<T>): T | undefined;
}

export function isOfTypeT<T extends BaseRecord>(
  obj: any,
  keys: (keyof T)[]
): obj is T {
  return keys.every((key) => key in obj);
}

export function createTable<T extends BaseRecord>(
  keys: (keyof T)[]
): DBTable<T> {
  class InMemoryDBTable implements DBTable<T> {
    private table: Record<string, T> = {};

    set(newValue: Omit<T, "id">): string {
      const id = randomUUID();
      const objectToInsert: T = { id, ...newValue } as T;

      if (keys.length > 0 && !isOfTypeT(objectToInsert, keys)) {
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

    getBy(key: keyof T, value: T[keyof T]): T | undefined {
      return Object.values(this.table).find((record) => record[key] === value);
    }

    update(id: string, newValue: Partial<T>): T | undefined {
      const record = this.table[id];

      if (!record) {
        return undefined;
      }

      const updatedRecord: T = { ...record, ...newValue };

      if (keys.length > 0 && !isOfTypeT(updatedRecord, keys)) {
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

export class InMemoryDatabase<Tables extends Record<string, BaseRecord>> {
  private tables: { [K in keyof Tables]?: DBTable<Tables[K]> } = {};

  createTable<Name extends string, T extends BaseRecord>(
    name: Name,
    keys: (keyof T)[]
  ): InMemoryDatabase<Tables & { [K in Name]: T }> {
    if (this.tables[name as keyof Tables]) {
      throw new Error(`Table ${name} already exists`);
    }

    const newTable = createTable<T>(keys);
    (this.tables as any)[name] = newTable;

    return this as unknown as InMemoryDatabase<Tables & { [K in Name]: T }>;
  }

  getTable<Name extends keyof Tables>(
    name: Name
  ): DBTable<Tables[Name]> | undefined {
    return this.tables[name];
  }
}

// Define specific types
export type NinjaTurtle = BaseRecord & {
  name: string;
  color: string;
  weapon: string;
};

export type Villain = BaseRecord & {
  name: string;
  weapon: string;
  iq: number;
};
