// pages/components/Header.jsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="py-5 px-6 bg-white/40 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center gap-3">
            <img src="/panchi-logo.png" alt="Panchi" className="w-12 h-12 object-contain" />
            <span className="font-bold text-lg">Panchi</span>
          </a>
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          <a className="text-sm text-gray-700">Explore</a>
          <a className="text-sm text-gray-700">Plans</a>
          <a className="text-sm text-gray-700">Community</a>
        </nav>
      </div>
    </header>
  );
}
