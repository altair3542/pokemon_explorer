// src/components/Header.jsx
export default function Header() {
  return (
    <header className="bg-indigo-600 text-white py-4 shadow">
      <div className="container mx-auto flex items-center justify-between px-4">
        <h1 className="text-2xl font-bold">Pokémon Explorer</h1>
        {/* más elementos: búsqueda, logo, etc., en el futuro */}
      </div>
    </header>
  );
}
