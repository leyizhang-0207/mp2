export type NamedAPIResource = { name: string; url: string };

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type PokemonTypeRef = { slot: number; type: { name: string; url: string } };
export type PokemonAbilityRef = { ability: { name: string; url: string } };
export type PokemonStat = { base_stat: number; stat: { name: string } };

export type PokemonSprites = {
  other?: {
    ["official-artwork"]?: { front_default: string | null };
  };
  front_default?: string | null;
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: PokemonTypeRef[];
  abilities: PokemonAbilityRef[];
  stats: PokemonStat[];
  sprites: PokemonSprites;
};

export type TypeListResponse = {
  count: number;
  results: NamedAPIResource[];
};

export type TypeDetail = {
  name: string;
  pokemon: { pokemon: NamedAPIResource }[];
};
