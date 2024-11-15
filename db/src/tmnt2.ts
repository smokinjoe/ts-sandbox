import {
  InMemoryDatabase,
  NinjaTurtle,
  Villain,
} from "./InMemoryDatabaseWithTables";

// Initialize the database with an empty type (no tables initially)
let TMNTDb = new InMemoryDatabase<{}>();

// Create a table for Ninja Turtles
TMNTDb = TMNTDb.createTable<"NinjaTurtle", NinjaTurtle>("NinjaTurtle", [
  "id",
  "name",
  "color",
  "weapon",
]);

// Now the "NinjaTurtle" table expects records of type NinjaTurtle
const turtleId = TMNTDb.getTable<"NinjaTurtle">("NinjaTurtle")?.set({
  name: "Leonardo",
  color: "blue",
  weapon: "katana",
});

// Retrieving the record with type safety
console.log(TMNTDb.getTable("NinjaTurtle")?.get(turtleId!));
