import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getPokemon, officialArtworkUrl } from "../api/pokeapi";
import type { PokemonDetail } from "../types/pokemon";

export default function DetailView() {
  const { idOrName = "" } = useParams();
  const [data, setData] = useState<PokemonDetail | null>(null);
  const navigate = useNavigate();
  const { state } = useLocation() as { state?: { list?: number[]; from?: string } };

  useEffect(() => {
    getPokemon(idOrName).then(setData);
  }, [idOrName]);

  const order = state?.list ?? null;
  const idx = useMemo(() => {
    if (!order || !data) return -1;
    return order.indexOf(data.id);}, [order, data]);
  const goPrev = () => {
    if (order && idx > 0) navigate(`/pokemon/${order[idx - 1]}`, { state: { list: order, from: state?.from } });
  };
  const goNext = () => {
    if (order && idx >= 0 && idx < order.length - 1)
      navigate(`/pokemon/${order[idx + 1]}`, { state: { list: order, from: state?.from } });
  };

  if (!data) return <p>Loading…</p>;

  return (
    <article className="detail">
      <Link to={state?.from ?? "/"} className="back-link">
        ← Back
      </Link>
      <div className="detail-card">
        <div className="detail-header">
          <img alt={data.name} src={officialArtworkUrl(data.id)} className="detail-image" />
          <div className="detail-info">
            <h1 className="detail-title">#{data.id} {data.name}</h1>
            <p className="detail-type">Types: {data.types.map((t) => t.type.name).join(", ")}</p>
            <p className="detail-physical">Height: {data.height} | Weight: {data.weight}</p>
          </div>
        </div>

        <section className="detail-sections">
          <div className="detail-section">
            <h2 className="section-title">Stats</h2>
            <ul className="stats-list">
              {data.stats.map((s) => (
                <li key={s.stat.name}><strong>{s.stat.name}</strong>: {s.base_stat}</li>
              ))}
            </ul>
          </div>

          <div className="detail-section">
            <h2 className="section-title">Abilities</h2>
            <ul className="abilities-list">
              {data.abilities.map((a) => <li key={a.ability.name}>{a.ability.name}</li>)}
            </ul>
          </div>
        </section>
      </div>

      <footer className="pager">
        <button onClick={goPrev} disabled={!order || idx <= 0} className="pager-button">← Previous</button>
        <button onClick={goNext} disabled={!order || idx < 0 || idx >= (order?.length ?? 1)-1} className="pager-button">Next →</button>
      </footer>
    </article>
  );
}