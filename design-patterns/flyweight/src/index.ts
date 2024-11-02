import fetch from "node-fetch";

type Pokemon = {
  name: string;
  url: string;
};

type PokemonSpecies = {
  base_experience: number;
  species: Pokemon;
  weight: number;
};

type PokemonList = {
  count: number;
  next: string;
  previous?: string;
  results: Pokemon[];
};

function makeURLFlyweights<ReturnType>(urls: Record<string, string>) {
  const cache: Record<string, ReturnType> = {};

  return new Proxy(cache, {
    get: (target, name: string) => {
      if (!target[name]) {
        target[name] = fetch(urls[name]).then((res) =>
          res.json()
        ) as ReturnType;
      }
      return target[name];
    },
  });
}

(async () => {
  const pokemon = (await (
    await fetch("https://pokeapi.co/api/v2/pokemon")
  ).json()) as PokemonList;

  const urls = pokemon.results.reduce(
    (acc, { name, url }) => ({
      ...acc,
      [name]: url,
    }),
    {}
  );

  const lookup = makeURLFlyweights<PokemonSpecies>(urls);
  const bulbasaur = await lookup.bulbasaur;
  console.log(bulbasaur.weight);
  const charmander = await lookup.charmander;
  console.log(charmander);
})();
