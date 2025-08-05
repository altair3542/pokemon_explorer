// src/components/Card.jsx
export default function Card({ name, image }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center transition hover:shadow-lg">
      <img
        src={image}
        alt={name}
        className="w-20 h-20 mb-2"
      />
      <h2 className="capitalize font-semibold text-lg">{name}</h2>
    </div>
  );
}
