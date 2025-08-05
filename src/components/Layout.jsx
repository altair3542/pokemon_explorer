// src/components/Layout.jsx
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container mx-auto flex-1 p-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}

