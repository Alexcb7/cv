"use client";

const NAV_ITEMS = [
  { label: "HOME", href: "#home" },
  { label: "ABOUT", href: "#about" },
  { label: "TECHNOLOGIES", href: "#technologies" },
  { label: "WORKS", href: "#works" },
  { label: "CONTACT", href: "#contact" },
];

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <nav className="md:text-7xl mx-auto px-8 py-6 flex justify-center">
        <ul className="flex gap-15 text-white text-sm tracking-widest">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
