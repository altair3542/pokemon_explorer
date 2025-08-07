import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Layout from './components/Layout'
import Card from './components/Card'

function extractID(url) {
  const parts = url.split('/').filter(Boolean)
  return parts[parts.length - 1]
}



export default function App() {

  const [pokemons, setPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const pageSize = 20
  const [totalCount, setTotalCount] = usueState(0)

  // hook de efecto usando axios. lo que hace la llamada a la api.

  useEffect(() => {
    setLoading(true)
    setError(null)

    const offset = (page - 1) * pageSize
    axios.get('https://pokeapi.co/api/v2/pokemon', {
      params: { limit: pageSize, offset }
    })
    .then(res => {
      setPokemons(res.data.results)
      setTotalCount(res.data.count)
      setLoading(false)
    })
    .catch(err => {
      setError(err.message)
      setLoading(false)
    })
  })

  return (
    // <div>
    //   <Layout>
    //     <p className='text-center py-8'>Aqui cargaremos la informacion o nuestro grid de los pokemon cuando los llamemos.</p>
    //   </Layout>
    // </div>
  )
}
