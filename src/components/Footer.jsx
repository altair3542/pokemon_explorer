// src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 py-4 mt-8">
      <div className="container mx-auto text-center text-sm">
        © {new Date().getFullYear()} SPA Pokémon Explorer
      </div>
    </footer>
  );
}
