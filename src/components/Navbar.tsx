import type { PageKey } from "./Layout";
import { navItems } from "./Layout";

type NavbarProps = {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
};

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  return (
    <nav className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onNavigate(item.key)}
            className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition ${
              isActive
                ? "bg-blue-700 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50"
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
