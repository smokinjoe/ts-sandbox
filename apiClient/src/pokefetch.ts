import { getApiClient } from "./apiClient";

export type PokemonAbility = {
  name: string;
  url: string;
};

export type InternalPokemonAbility = {
  name: string;
  url: string;
  id: string;
};

export type PokemonAbilityResponse = {
  count: number;
  next: null | string;
  previous: null | string;
  results: PokemonAbility[];
};

const abilityMapper = (ability: PokemonAbility): InternalPokemonAbility => {
  const id = ability.url.split("/").filter(Boolean).pop() ?? "NA";
  return {
    ...ability,
    id,
  };
};

export const getPokemonAbilities = async () => {
  const response = await getApiClient().get<PokemonAbilityResponse>("/ability");
  return response.data.results.map(abilityMapper);
};

export const getPokemonAbility = async (id: number) => {};
