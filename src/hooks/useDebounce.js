// usamos este archivo con una logica especifica para que cada vez que nosotros recarguemos la pagina no se ejecute una busqueda vacia. debounce significa quitar rebote.
import { useState, useEffect } from 'react'

export default function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)


  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return() => clearTimeout(handler)
  },[value, delay])

  return debounced
}

