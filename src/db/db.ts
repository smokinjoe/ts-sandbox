import { v4 as randomUUID } from "uuid";

export type NinjaTurtle = {
  id: string;
  name: string;
  color: string;
  weapon: string;
};

type BaseRecord = {
  id: string;
};

interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}

function isOfTypeT<T extends BaseRecord>(
  obj: any,
  keys: (keyof T)[]
): obj is T {
  return keys.every((key) => key in obj);
}

export function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    static instance: InMemoryDatabase = new InMemoryDatabase();

    set(newValue: Omit<T, "id">): string {
      const id = randomUUID();

      const objectToInsert: T = {
        id,
        ...newValue,
      } as T;

      if (
        isOfTypeT<NinjaTurtle>(objectToInsert, [
          "id",
          "name",
          "color",
          "weapon",
        ])
      ) {
        this.db[id] = objectToInsert;
        return id;
      }

      throw new Error("Invalid object type");
    }

    get(id: string): T | undefined {
      return this.db[id];
    }
  }

  return InMemoryDatabase;
}
