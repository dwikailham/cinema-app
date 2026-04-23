"use client";

interface GenreFilterProps {
  genres: string[];
  selected: string;
  onSelect: (genre: string) => void;
}

const GENRE_COLORS: Record<string, string> = {
  Action: "data-[active=true]:bg-orange-600 data-[active=true]:border-orange-600",
  Drama: "data-[active=true]:bg-purple-600 data-[active=true]:border-purple-600",
  "Sci-Fi": "data-[active=true]:bg-cyan-600 data-[active=true]:border-cyan-600",
  Comedy: "data-[active=true]:bg-yellow-600 data-[active=true]:border-yellow-600",
  Horror: "data-[active=true]:bg-red-700 data-[active=true]:border-red-700",
};

export function GenreFilter({ genres, selected, onSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        data-active={selected === ""}
        onClick={() => onSelect("")}
        className="px-4 py-1.5 rounded-full text-sm font-medium border border-[#3a3a52]
          bg-[#1e1e2e] text-[#a0a0b8] transition-all duration-200
          hover:border-[#e63946]/50 hover:text-[#f1f1f8]
          data-[active=true]:bg-[#e63946] data-[active=true]:border-[#e63946] data-[active=true]:text-white"
      >
        All
      </button>
      {genres.map((genre) => (
        <button
          key={genre}
          data-active={selected === genre}
          onClick={() => onSelect(genre)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border border-[#3a3a52]
            bg-[#1e1e2e] text-[#a0a0b8] transition-all duration-200
            hover:border-[#e63946]/50 hover:text-[#f1f1f8]
            data-[active=true]:text-white
            ${GENRE_COLORS[genre] ?? "data-[active=true]:bg-[#e63946] data-[active=true]:border-[#e63946]"}
          `}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
