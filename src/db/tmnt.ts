import { BaseRecord, createDatabase } from "./InMemoryDatabase";

export type NinjaTurtle = {
  id: string;
  name: string;
  color: string;
  weapon: string;
};

const NinjaTurtleDB = createDatabase<NinjaTurtle>();

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
const fakeId = NinjaTurtleDB.instance.set({
  name: "fake",
  weapon: "fake",
} as any);
