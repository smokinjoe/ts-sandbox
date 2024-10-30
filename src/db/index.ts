import { NinjaTurtle, createDatabase } from "./db";

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
console.log(NinjaTurtleDB.instance.get(mikeId));

/**
 * The following will fail because it doesn't match the NinjaTurtle type
 */
const fakeId = NinjaTurtleDB.instance.set({
  name: "fake",
  weapon: "fake",
} as any);
