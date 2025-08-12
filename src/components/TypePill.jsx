// src/components/TypePill.jsx
/**
 * Badge de tipo con "bullet" de color a la izquierda.
 * - Mantiene colores por tipo (fondo + texto)
 * - Añade un punto (dot) circular coloreado para mejorar el escaneo visual
 * - Accesible: aria-label con “Tipo X”
 */

const colorByType = {
  normal:   { pill: 'bg-stone-300 text-stone-900',  dot: 'bg-stone-600'   },
  fire:     { pill: 'bg-orange-300 text-orange-900',dot: 'bg-orange-600'  },
  water:    { pill: 'bg-sky-300 text-sky-900',      dot: 'bg-sky-600'     },
  grass:    { pill: 'bg-green-300 text-green-900',  dot: 'bg-green-600'   },
  electric: { pill: 'bg-yellow-300 text-yellow-900',dot: 'bg-yellow-500'  },
  ice:      { pill: 'bg-cyan-200 text-cyan-900',    dot: 'bg-cyan-600'    },
  fighting: { pill: 'bg-red-300 text-red-900',      dot: 'bg-red-600'     },
  poison:   { pill: 'bg-purple-300 text-purple-900',dot: 'bg-purple-600'  },
  ground:   { pill: 'bg-amber-300 text-amber-900',  dot: 'bg-amber-700'   },
  flying:   { pill: 'bg-indigo-200 text-indigo-900',dot: 'bg-indigo-600'  },
  psychic:  { pill: 'bg-pink-300 text-pink-900',    dot: 'bg-pink-600'    },
  bug:      { pill: 'bg-lime-300 text-lime-900',    dot: 'bg-lime-600'    },
  rock:     { pill: 'bg-amber-400 text-amber-900',  dot: 'bg-amber-800'   },
  ghost:    { pill: 'bg-violet-300 text-violet-900',dot: 'bg-violet-700'  },
  dragon:   { pill: 'bg-indigo-400 text-white',     dot: 'bg-indigo-700'  },
  dark:     { pill: 'bg-stone-700 text-white',      dot: 'bg-stone-900'   },
  steel:    { pill: 'bg-zinc-300 text-zinc-900',    dot: 'bg-zinc-700'    },
  fairy:    { pill: 'bg-fuchsia-200 text-fuchsia-900', dot: 'bg-fuchsia-600' },
  _default: { pill: 'bg-gray-200 text-gray-900',    dot: 'bg-gray-600'    },
};

export default function TypePill({ type }) {
  const colors = colorByType[type] || colorByType._default;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded capitalize text-sm ${colors.pill}`}
      aria-label={`Tipo ${type}`}
    >
      {/* Bullet / dot de color */}
      <span
        className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
        aria-hidden="true"
      />
      {type}
    </span>
  );
}
