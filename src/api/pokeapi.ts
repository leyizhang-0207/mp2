import axios from "axios";
import type {
  PokemonListResponse,
  PokemonDetail,
  TypeListResponse,
  TypeDetail,
} from "../types/pokemon";

const api = axios.create({ baseURL: "https://pokeapi.co/api/v2" });

const mem = new Map<string, unknown>();
function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  if (mem.has(key)) return Promise.resolve(mem.get(key) as T);
  return fetcher().then((data) => {
    mem.set(key, data);
    return data;
  });
}

export async function getPokemonList(limit = 200, offset = 0) {
  return cached<PokemonListResponse>(
    `/pokemon?limit=${limit}&offset=${offset}`,
    async () => (await api.get<PokemonListResponse>(`/pokemon`, { params: { limit, offset } })).data
  );
}

export async function getPokemon(nameOrId: string | number) {
  return cached<PokemonDetail>(`/pokemon/${nameOrId}`, async () => {
    const { data } = await api.get<PokemonDetail>(`/pokemon/${nameOrId}`);
    return data;
  });
}

export async function getTypeList() {
  return cached<TypeListResponse>(`/type`, async () => (await api.get<TypeListResponse>("/type")).data);
}

export async function getTypeDetail(typeName: string) {
  return cached<TypeDetail>(`/type/${typeName}`, async () => (await api.get<TypeDetail>(`/type/${typeName}`)).data);
}

export function idFromUrl(url: string) {
  const parts = url.split("/").filter(Boolean);
  return Number(parts[parts.length - 1]);
}

export function officialArtworkUrl(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
