import { useState, useEffect } from 'react'
import useDebounce from '../hooks/useDebounce'

export default function SearchBar({ onSearch, placeholder = 'Buscar un Pokemon'}) {

  const [input, setInput] = useState('')
  const debouncedInput = useDebounce(input, 300)

  useEffect(() => {
    onSearch(debouncedInput.trim().toLowerCase())
  }, [debouncedInput, onSearch])


  return (
    <div className='mb-4'>
      <input
        type='text'
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        className='w-full p-2 border rounded focus:outline-none focus:ring-indigo-500'
      />
    </div>
  )
}
