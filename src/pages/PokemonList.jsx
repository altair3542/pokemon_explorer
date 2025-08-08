// src/pages/PokemonList.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Card   from '../components/Card';
import SearchBar from '../components/SearchBar';
import useDebounce from '../hooks/useDebounce';

function extractId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

export default function PokemonList() {
  const [pokemons,   setPokemons]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [page,       setPage]       = useState(1);
  const pageSize = 20;
  const [totalCount, setTotalCount] = useState(0);

  // Llamada paginada
  useEffect(() => {
    setLoading(true);
    setError(null);
    const offset = (page - 1) * pageSize;

    axios.get('https://pokeapi.co/api/v2/pokemon', {
      params: { limit: pageSize, offset }
    })
    .then(res => {
      setPokemons(res.data.results);
      setFiltered(res.data.results);          // inicialmente sin filtro
      setTotalCount(res.data.count);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [page]);

  // Búsqueda
  const handleSearch = term => {
    if (!term) {
      setFiltered(pokemons);
    } else {
      setFiltered(
        pokemons.filter(p => p.name.includes(term))
      );
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) return <Layout><p>Cargando...</p></Layout>;
  if (error)   return <Layout><p>Error: {error}</p></Layout>;

  return (
    <div>
            {/* SearchBar controla handleSearch */}
      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filtered.map(p => (
          <Card
            key={p.name}
            name={p.name}
            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractId(p.url)}.png`}
          />
        ))}
      </div>

      {/* Paginación */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => {
            setPage(prev => Math.max(prev - 1, 1));
          }}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>Página {page} / {totalPages}</span>
        <button
          onClick={() => {
            setPage(prev => Math.min(prev + 1, totalPages));
          }}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
