import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { getPokemonList, getTypeList, getTypeDetail, idFromUrl, officialArtworkUrl } from "../api/pokeapi";
import type { NamedAPIResource } from "../types/pokemon";

export default function GalleryView() {
  const [all, setAll] = useState<NamedAPIResource[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [allowedIds, setAllowedIds] = useState<Set<number> | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const activeTypes = useMemo(() => searchParams.get("types")?.split(",") || [], [searchParams]);

  useEffect(() => {getPokemonList(200, 0).then((r) => setAll(r.results));
    getTypeList().then((r) => setTypes(r.results.map((t) => t.name)));}, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (activeTypes.length === 0) {
        setAllowedIds(null);
        return;
      }
      const lists = await Promise.all(activeTypes.map((t) => getTypeDetail(t)));
      const idSet = new Set<number>();
      lists.forEach((td) => td.pokemon.forEach((p) => idSet.add(idFromUrl(p.pokemon.url))));
      if (!cancelled) setAllowedIds(idSet);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [activeTypes]);

  const shown = useMemo(() => {
    const base = all.map((p) => ({ id: idFromUrl(p.url), name: p.name }));
    return allowedIds ? base.filter((x) => allowedIds.has(x.id)) : base;
  }, [all, allowedIds]);

  const toggleType = (t: string) => {
    const newActiveTypes = activeTypes.includes(t) ? activeTypes.filter((x) => x !== t) : [...activeTypes, t];
    const newParams = new URLSearchParams(searchParams);
    if (newActiveTypes.length > 0) {
      newParams.set("types", newActiveTypes.join(","));
    } else {
      newParams.delete("types");
    }
    setSearchParams(newParams);
  };

  return (
    <section className="gallery">
      <h1>Pokemon Gallery</h1>

      <fieldset className="filters">
        <legend>Filter by Type</legend>
        <div className="chips">
          {types.map((t) => (
            <label key={t} className={activeTypes.includes(t) ? "chip active" : "chip"}>
              <input type="checkbox" checked={activeTypes.includes(t)} onChange={() => toggleType(t)} />
              {t}
            </label>
          ))}
        </div>
      </fieldset>

      <ul className="grid">
        {shown.map((p) => (
          <li key={p.id} className="card"> 
            <Link to={`/pokemon/${p.id}`} state={{ list: shown.map((x) => x.id), from: location.pathname + location.search }}>
              <img alt={p.name} loading="lazy" src={officialArtworkUrl(p.id)} />
              <div className="meta">
                <span>#{p.id}</span>
                <strong>{p.name}</strong>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}