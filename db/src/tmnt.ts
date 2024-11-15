import { BaseRecord } from "./InMemoryDatabase";
import { createDatabase } from "./InMemoryDatabase";
import { createDatabase as createDatabaseWithTables } from "./InMemoryDatabaseWithTables";

export type NinjaTurtle = {
  id: string;
  name: string;
  color: string;
  weapon: string;
};

export type Villain = {
  id: string;
  name: string;
  weapon: string;
  iq: number;
};

const NinjaTurtleDB = createDatabase<NinjaTurtle>([
  "id",
  "name",
  "color",
  "weapon",
]);

const leoId = NinjaTurtleDB.instance.set({
  name: "leo",
  color: "blue",
  weapon: "katana",
});

const mikeId = NinjaTurtleDB.instance.set({
  name: "mike",
  color: "orange",
  weapon: "nunchaku",
});

console.log(NinjaTurtleDB.instance.get(leoId));
console.log(NinjaTurtleDB.instance.getBy("name", "mike"));

/**
 * The following will fail because it doesn't match the NinjaTurtle type
 * But no error is being thrown (yet)
 */
// const fakeId = NinjaTurtleDB.instance.set({
//   name: "fake",
//   weapon: "fake",
// } as any);

const TMNTDb = createDatabaseWithTables();
TMNTDb.createTable<NinjaTurtle>("Turtles", ["id", "name", "color", "weapon"]);

TMNTDb.getTable("Turtles").set({
  name: "leo",
  color: "blue",
  weapon: "katana",
});

TMNTDb.getTable("Turtles").set({
  name: "mike",
  color: "orange",
  weapon: "nunchaku",
});

console.log(TMNTDb.getTable("Turtles"));

TMNTDb.createTable<Villain>("Villains", ["id", "name", "weapon", "iq"]);

const shredderId = TMNTDb.getTable("Villains").set({
  name: "Shredder",
  weapon: "katana",
  iq: 9000,
});

const bebopId = TMNTDb.getTable("Villains").set({
  name: "Bebop",
  weapon: "gun",
  iq: 100,
});

const rocksteadyId = TMNTDb.getTable("Villains").set({
  name: "Rocksteady",
  weapon: "gun",
  iq: 90,
});

console.log(TMNTDb.getTable("Villains"));

console.log(TMNTDb.getTable("Villains").get(shredderId));
TMNTDb.getTable("Villains").update(shredderId, { iq: 10000 });
console.log(TMNTDb.getTable("Villains").get(shredderId));
