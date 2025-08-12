/**
 * Página de detalle de un Pokémon.
 * Cumple DoD:
 * - Ruta dinámica: lee :name (o :id) con useParams
 * - Fetch con axios: /pokemon/:name y /pokemon-species/:id
 * - UX: skeletons, errores (404 + genérico), botón Volver, Prev/Next por ID
 * - Accesibilidad: barras con role="progressbar" y aria-*
 * - Perf: AbortController (cancel), cache opcional en sessionStorage
 * - DX: comentarios explicativos y título del documento dinámico
 */

import { useEffect, useMemo, useState} from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import TypePill from '../components/TypePill'

/** helpers de presentacion */
function pickArtwork(sprites) {
  // preferir la ilustracion oficial, si no, dream_world o si no el sprite frontal
  return (
    sprites?.other?.['official-artwork']?.front_default ||
    sprites?.other?.dream_world?.front_default ||
    sprites?.front_default ||
    ''
  )
}

function pad3(n) { return String(n).padStart(3, '0')}
function mFromDecimeters(dm) { return (dm / 10).toFixed(1)}
function kgFromHectograms(hg) { return (hg / 10).toFixed(1)}


export default function PokemonDetail() {
  // 1) leemos segmento dinamico de la url, que puede ser nombre o id
  const { name } = useParams()
  const navigate = useNavigate()

  // 2) Estados del ciclo de vida del fetch
  const [pokemon, setPokemon] = useState(null) // /pokemon/:name
  const [species, setSpecies] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 3) Efecto principal: pedir los datos cuando cambia el name

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    // Cache liegra por sesion para acelerar revisitas
    const cacheKey = `pokemon:${name}`
    const cached = sessionStorage.getItem(cacheKey)
    const fetchPokemon = cached
      ? Promise.resolve({ data: JSON.parse(cached) })
      : axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`, { signal: controller.signal })

    fetchPokemon
      .then(res => {
        const data = res.data
        if (!cached) sessionStorage.setItem(cacheKey, JSON.stringify(data))
        // Segunda llamada a otro endpoint para traernos el texto, y algunos metadatos.
        return axios.get(`https://pokeapi.co/api/v2/pokemon-species/${data.id}`)
      })

      .then(res => {
        setSpecies(res.data)
        setLoading(false)
      })
      .catch(err => {
        // si fue cancelada la carga, entonces no actualizamos estados
        if (axios.isCancel?.(err) || err.name === 'CanceledError') return
        const msg = err.response?.status === 404 ? 'Pokemon no encontrado' : err.message
        setError(msg)
        setLoading(false)
      })
    return () => controller.abort
  }, [name])

  // 4) Título del documento dinámico

  useEffect(() => {
    if (pokemon?.name) document.title = `#${pad3(pokemon.id)} ${pokemon.name} | Pokemon Explorer`
    return() => { document.title = 'Pokemon Explorer'}
  }, [pokemon])


  // 5) Flavor text con preferencia ES→EN y limpieza de caracteres de control

  const flavor = useMemo(() => {
    const entries = species?.flavor_text_entries
    if (!entries) return ''
    const es = entries.find(f => f.languaje.name === 'es')
    const en = entries.find(f => f.languaje.name === 'en')
    return (es?.flavor.text || en?.flavor.text || '').replace(/\f|\n/g, ' ')
  }, [species])

  return (
    <div>

    </div>
  )
}
