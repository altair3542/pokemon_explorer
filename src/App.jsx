import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from './components/Layout'
import Card from './components/Card'

function extractId(url) {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}



export default function App() {

  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [totalCount, setTotalCount] = useState(0)

  // hook de efecto usando axios. lo que hace la llamada a la api.

  useEffect(() => {
    setLoading(true);
    setError(null);

    const offset = (page - 1) * pageSize;
    axios.get('https://pokeapi.co/api/v2/pokemon', {
      params: { limit: pageSize, offset }
    })
    .then(res => {
      setPokemons(res.data.results);
      setTotalCount(res.data.count);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [page]);

  const totalPages = Math.ceil(totalCount / pageSize)

  if (loading) return <Layout><p>Cargando...</p></Layout>
  if (error) return <Layout><p>Error: {error}</p></Layout>

  return(
    <Layout>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
        {pokemons.map(p => (
          <Card
            key={p.name}
            name={p.name}
            image={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${extractId(p.url)}.png`}
          />
        ))}
      </div>

      <div className='flex, justify-center items-center. gap-4 mt-6'>
        <button
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className='px-4 py-2 bg-gray-200, rounded disabled:opacity-50'
        >
          Anterior
        </button>
        <span>Página {page} / {totalPages}</span>
                <button
          onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className='px-4 py-2 bg-gray-200, rounded disabled:opacity-50'
        >
          Siguiente
        </button>
      </div>
    </Layout>
  )
}
