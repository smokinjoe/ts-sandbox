import { BaseRecord } from "./InMemoryDatabase";

interface Table<TData extends BaseRecord> {
  set(newValue: TData): void;
  get(id: string): TData | undefined;
}

interface DatabaseWithTables {
  tables: Record<string, Table<unknown>>;
  getTable(name: string): Table<unknown>;
  setTable(name: string, table: Table<unknown>): void;
  showTables(): string[];
  createTable<TData extends BaseRecord>(): Table<TData>;
}

function createTable<TData extends BaseRecord>(): Table<TData> {
        class DBTable implements Table<TData> {
            private dbTable: Record<string, TData> = {};

            set(newValue: TData): void {
            this.dbTable[newValue.id] = newValue;
            }

            get(id: string): TData | undefined {
            return this.dbTable[id];
            }
        }

    
      return new DBTable();
}


export function createDatabaseWithTables() {
  class InMemoryDatabaseWithTables implements DatabaseWithTables {
    tables: Record<string, Table<BaseRecord>> = {};

    static instance: InMemoryDatabaseWithTables =
      new InMemoryDatabaseWithTables();

    getTable(name: string): Table<BaseRecord> {
      return this.tables[name];
    }

    setTable(name: string, table: Table<BaseRecord>): void {
      this.tables[name] = table;
    }

    showTables(): string[] {
      return Object.keys(this.tables);
    }

    createTable<TData extends BaseRecord>(name: string): Table<TData> {
        const dbTable = createTable();

      this.tables[name] = dbTable;

      return dbTable;

  }

  return InMemoryDatabaseWithTables;
}
