import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Settings,
  LogOut,
  Search,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import profileImage from "../../assets/image-profil.jpeg";

export default function Sidebar() {
  const location = useLocation();

  const navGroups = [
    {
      title: "Menu",
      items: [
        { name: "Tableau de bord", path: "/", icon: LayoutDashboard },
        { name: "Medicaments", path: "/medicaments", icon: Pill },
        { name: "Categories", path: "/categories", icon: LayoutGrid },
        { name: "Ventes", path: "/ventes", icon: ShoppingCart },
      ],
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Brand Section */}
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-bold text-xl">PharmaManager</span>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Internal search style only */}
      <div className="px-5 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={14} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher (⌘ K)"
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border-none rounded text-sm focus:outline-none transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow overflow-y-auto px-4">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-6">
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mb-2 block">
              {group.title}
            </span>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link to={item.path} key={item.path}>
                    <div
                      className={`flex items-center justify-between px-3 py-2.5 rounded-[6px] transition-all group ${
                        isActive
                          ? "bg-gray-100 text-black"
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon
                          size={18}
                          strokeWidth={isActive ? 2.5 : 2}
                          className={
                            isActive
                              ? "text-black"
                              : "text-gray-400 group-hover:text-gray-600"
                          }
                        />
                        <span className={`text-sm font-medium`}>
                          {item.name}
                        </span>
                      </div>
                      {item.name === "Medicaments" && (
                        <ChevronRight
                          size={14}
                          className={isActive ? "text-black" : "text-gray-300"}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User & Actions */}
      <div className="p-5 border-t border-[#f0f0f0]">
        <div className="flex items-center gap-3 p-2.5 mb-4 bg-gray-50 border border-gray-50 rounded">
          <img
            className="w-10 h-10 rounded-[6px] object-cover"
            src={profileImage}
            alt="user image"
          />
          <div className="flex-grow min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Mohamed boukab
            </p>
            <p className="text-[11px] text-gray-500 truncate">
              mohamedboukab2002@gmail.com
            </p>
          </div>
          <ChevronRight size={14} className="text-gray-300" />
        </div>

        <div className="flex flex-col gap-1">
          <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-[6px] transition-all">
            <Settings size={18} className="text-gray-400" />
            Paramètres
          </button>
          <button className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-all">
            <LogOut size={18} className="text-gray-400" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}
