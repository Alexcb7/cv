"use client";

const NAV_ITEMS = [
  { label: "HOME", id: "home" },
  { label: "ABOUT", id: "about" },
  { label: "TECHNOLOGIES", id: "technologies" },
  { label: "WORKS", id: "works" },
  { label: "CONTACT", id: "contact" },
];

export default function Header({
  onNavigate,
}: {
  onNavigate: (id: string) => void;
}) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      <nav className="mx-auto px-8 py-6 flex justify-center">
        <ul className="pointer-events-auto flex gap-10 text-white text-xs tracking-[0.25em]">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
