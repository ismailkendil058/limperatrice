import { createFileRoute, Outlet, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useStore } from "@/lib/store";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { Toaster } from "@/components/ui/sonner";
import {
  LayoutDashboard, Package, Users, CalendarDays, Wallet, UserCog, LogOut, FileText, BookMarked, Menu, StickyNote,
} from "lucide-react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const NAV = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, admin: true },
  { to: "/stock", label: "Stock", icon: Package },
  { to: "/locations", label: "Locations", icon: CalendarDays },
  { to: "/reservation", label: "Réservations", icon: BookMarked },
  { to: "/contract", label: "Contrats", icon: FileText },
  { to: "/notes", label: "Notes", icon: StickyNote, admin: true },
  { to: "/caisse", label: "Caisse", icon: Wallet, admin: true },
  { to: "/employes", label: "Employés", icon: UserCog, admin: true },
];

function AppLayout() {
  const navigate = useNavigate();
  const auth = useStore((s) => s.auth);
  const logout = useStore((s) => s.logout);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Subscribe to Supabase Realtime — data refreshes only when the DB actually changes
  useRealtimeSync();

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    if (!auth.role) navigate({ to: "/login" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.role]);

  // Initial data load on authentication
  useEffect(() => {
    if (auth.role) {
      useStore.getState().loadAllData();
    }
  }, [auth.role]);

  if (!auth.role) return null;

  const items = NAV.filter((i) => !i.admin || auth.role === "admin");

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F6]">
      <Toaster position="top-right" richColors />
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-[260px] flex-col bg-white border-r border-[#F0EEEC] py-10 px-6">
        <div className="mb-10 px-3">
          <div className="brand-name font-light tracking-[0.18em] uppercase text-neutral-800" style={{ fontSize: 22 }}>L'impératrice</div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mt-1.5">Gestion de Luxe</div>
        </div>
        <nav className="flex-1 space-y-2">
          {items.map((item) => {
            const active = path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-300 relative"
                style={{
                  background: active ? "rgba(186, 147, 223, 0.07)" : "transparent",
                  color: active ? "#8f67b5" : "#555555",
                  fontWeight: active ? 500 : 400,
                  letterSpacing: "0.03em",
                }}
              >
                <Icon className="w-4.5 h-4.5 stroke-[1.8]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pt-8 border-t border-[#F0EEEC] px-3">
          <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Session</div>
          <div className="text-[14px] font-medium text-neutral-700 mt-1">{auth.employeeName}</div>
          <button onClick={handleLogout} className="mt-4 text-[12px] uppercase tracking-[0.12em] font-semibold flex items-center gap-1.5 transition-colors hover:text-[#8f67b5]" style={{ color: "#BA93DF", cursor: "pointer" }}>
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile slide-out sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50" onClick={closeMobile}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-2xl py-10 px-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-10 px-3">
              <div className="brand-name font-light tracking-[0.18em] uppercase text-neutral-800" style={{ fontSize: 20 }}>L'impératrice</div>
              <div className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 mt-1.5">Gestion de Luxe</div>
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto">
              {items.map((item) => {
                const active = path.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={closeMobile}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] transition-all duration-300 relative"
                    style={{
                      background: active ? "rgba(186, 147, 223, 0.07)" : "transparent",
                      color: active ? "#8f67b5" : "#555555",
                      fontWeight: active ? 500 : 400,
                      letterSpacing: "0.03em",
                    }}
                  >
                    <Icon className="w-5 h-5 stroke-[1.8]" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto pt-8 border-t border-[#F0EEEC] px-3">
              <div className="text-[10px] uppercase tracking-[0.12em] text-neutral-400">Session</div>
              <div className="text-[15px] font-medium text-neutral-700 mt-1">{auth.employeeName}</div>
              <button onClick={handleLogout} className="mt-4 text-[13px] uppercase tracking-[0.12em] font-semibold flex items-center gap-1.5" style={{ color: "#BA93DF" }}>
                <LogOut className="w-4 h-4" /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center px-6 py-4 border-b bg-white mt-8" style={{ borderColor: "#F0EEEC" }}>
          <button onClick={openMobile} aria-label="Menu" className="mr-4 p-1" style={{ color: "#1A1A1A" }}>
            <Menu className="w-6 h-6" />
          </button>
          <div className="brand-name flex-1 font-light tracking-[0.15em] uppercase text-neutral-800" style={{ fontSize: 20 }}>L'impératrice</div>
          <button onClick={handleLogout} aria-label="Déconnexion" className="p-1" style={{ color: "#BA93DF" }}>
            <LogOut className="w-6 h-6" />
          </button>
        </header>
        <div className="p-8 lg:p-12 max-w-[1400px] mx-auto pb-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
