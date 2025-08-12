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

export default function PokemonDetail() {
  return (
    <div>

    </div>
  )
}
