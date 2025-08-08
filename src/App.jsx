import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<PokemonList/>} />
        <Route path="/pokemon/:name" element={<PokemonDetail/>} />
      </Routes>
    </Layout>
  )

}
