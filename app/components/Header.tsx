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
    <header className="w-full">
      <nav className="mx-auto px-10 py-6 flex justify-center">
        <ul className="flex gap-20 text-white text-ls tracking-[0.25em]">
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
