import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getPokemonList, idFromUrl, officialArtworkUrl } from "../api/pokeapi";
import type { NamedAPIResource } from "../types/pokemon";

type SortKey = "name" | "id";

export default function ListView() {
  const [raw, setRaw] = useState<NamedAPIResource[]>([]);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const location = useLocation(); //get cur location

  const query = searchParams.get("q") || "";
  const sortKey = (searchParams.get("sort") as SortKey) || "name";
  const sortDir = (searchParams.get("dir") === "-1" ? -1 : 1) as 1 | -1;

  useEffect(() => { getPokemonList(200, 0).then((r) => setRaw(r.results));}, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let data = raw.filter((p) => p.name.includes(q) || String(idFromUrl(p.url)) === q);
    data = [...data].sort((a, b) => {
      const aid = idFromUrl(a.url);
      const bid = idFromUrl(b.url);
      const cmp = sortKey === "name" ? a.name.localeCompare(b.name) : aid - bid;
      return cmp * sortDir;
    });
    return data;
  }, [raw, query, sortKey, sortDir]);

  const updateSearchParams = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  return (
    <section className="list">
      <div className="list-header">
        <h1>Pokemon</h1>
      </div>

      <div className="search-area">
        <input
          className="search-bar"
          placeholder="Search Pokemon..."
          value={query}
          onChange={(e) => updateSearchParams("q", e.target.value)}
        />
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortKey} onChange={(e) => updateSearchParams("sort", e.target.value)}>
            <option value="name">Name</option>
            <option value="id">ID</option>
          </select>
          <button onClick={() => updateSearchParams("dir", sortDir === 1 ? "-1" : "1")}>
            {sortDir === 1 ? "Ascending ↑" : "Descending ↓"}
          </button>
        </div>
      </div>

      <ul className="grid">
        {filtered.map((p) => {
          const id = idFromUrl(p.url);
          return (
            <li key={p.name} className="card">
              <button
                onClick={() => // pass current location 
                  navigate(`/pokemon/${id}`, {
                    state: { list: filtered.map((x) => idFromUrl(x.url)), from: location.pathname + location.search },
                  })
                }
              >
                <img alt={p.name} loading="lazy" src={officialArtworkUrl(id)} />
                <div className="meta">
                  <span>#{id}</span>
                  <strong>{p.name}</strong>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}