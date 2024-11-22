import { getPokemonAbilities } from "./pokefetch";

const run = async () => {
  const pokemon = await getPokemonAbilities();

  console.log(pokemon);
};

run();
