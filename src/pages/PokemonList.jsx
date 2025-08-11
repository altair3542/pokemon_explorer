// src/pages/PokemonList.jsx
/**
 * Lista principal de Pokémon (mejorada):
 * - Consumo de PokeAPI con axios + paginación (limit/offset)
 * - Búsqueda con debounce (SearchBar) y filtrado local por página
 * - <Link> a /pokemon/:name para navegar al detalle
 * - Prefetch al pasar el mouse por una Card (cachea en sessionStorage)
 * - Sincroniza estado con la URL usando useSearchParams (?page, ?q)
 * - UX: skeletons de carga y botón de reintentar en errores
 */

import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams } from 'react-router-dom';

import Card from '../components/Card';
import SearchBar from '../components/SearchBar';

// Extrae el ID del Pokémon desde la URL del recurso
function extractId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

// Pequeño componente de skeleton para UX mientras carga
function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow p-4 animate-pulse">
      <div className="w-20 h-20 mx-auto mb-2 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded" />
    </div>
  );
}

export default function PokemonList() {
  // --- Estado de URL: page y q (query) ---
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = Math.max(parseInt(searchParams.get('page') || '1', 10), 1);
  const initialQuery = (searchParams.get('q') || '').toLowerCase();

  // --- Estado de datos / UI ---
  const [pokemons,   setPokemons]   = useState([]);     // datos crudos de la página
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(initialPage);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);

  // El término de búsqueda lo guardamos aquí (SearchBar hace debounce y nos lo entrega "limpio")
  const [query, setQuery] = useState(initialQuery);

  // --- Efecto: pedir página actual a la API ---
  useEffect(() => {
    setLoading(true);
    setError(null);

    const controller = new AbortController();
    const offset = (page - 1) * pageSize;

    axios.get('https://pokeapi.co/api/v2/pokemon', {
      params: { limit: pageSize, offset },
      signal: controller.signal,
    })
    .then(res => {
      setPokemons(res.data.results);
      setTotalCount(res.data.count);
      setLoading(false);
    })
    .catch(err => {
      if (err.name === 'CanceledError') return; // petición abortada
      setError(err.message);
      setLoading(false);
    });

    return () => controller.abort();
  }, [page]);

  // --- Sincroniza ?page y ?q en la URL cuando cambian ---
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(page));
    if (query) next.set('q', query);
    else next.delete('q');
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, query]);

  // --- Lista filtrada (local, por la página actual) ---
  const filtered = useMemo(() => {
    if (!query) return pokemons;
    const q = query.toLowerCase();
    return pokemons.filter(p => p.name.toLowerCase().includes(q));
  }, [pokemons, query]);

  const totalPages = Math.ceil(totalCount / pageSize);

  // --- Prefetch on hover: cachear detalle en sessionStorage ---
  const prefetchDetail = (nameOrId) => {
    const key = `pokemon:${nameOrId}`;
    if (sessionStorage.getItem(key)) return; // ya cacheado
    axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`)
      .then(res => sessionStorage.setItem(key, JSON.stringify(res.data)))
      .catch(() => {/* silencioso: prefetch es best-effort */});
  };

  // --- Handlers ---
  const handleSearch = (term) => {
    setQuery(term); // SearchBar ya hace debounce de 'term'
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    // forzamos recarga "virtual" reestableciendo la misma página
    setPage(p => p);
  };

  // --- Render: estados de carga / error ---
  if (loading) {
    return (
      <>
        <SearchBar onSearch={handleSearch} placeholder="Buscar Pokémon…" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-600 mb-4">Ocurrió un error: {error}</p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // --- Render principal ---
  return (
    <>
      {/* Barra de búsqueda */}
      <SearchBar onSearch={handleSearch} placeholder="Buscar Pokémon…" />

      {/* Info de resultados (por página) */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
        <span>
          Mostrando <strong>{filtered.length}</strong> de {pageSize} en esta página
        </span>
        <span>Total en API: <strong>{totalCount}</strong></span>
      </div>

      {/* Grid de Cards: cada Card navega al detalle y hace prefetch en hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(p => {
          const id = extractId(p.url);
          return (
            <Link
              key={p.name}
              to={`/pokemon/${p.name}`} // también puedes usar `${id}`
              aria-label={`Ver detalle de ${p.name}`}
              className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
              onMouseEnter={() => prefetchDetail(p.name)} // precalienta cache para el detalle
            >
              <Card
                name={p.name}
                image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
              />
            </Link>
          );
        })}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <span>Página {page} / {totalPages}</span>

        <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </>
  );
}
