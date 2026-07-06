import { l as supabase, r as useStore } from "./store-C6Z2575g.js";
import { useCallback, useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BookMarked, CalendarDays, FileText, LayoutDashboard, LogOut, Menu, Package, StickyNote, UserCog, Wallet } from "lucide-react";
import { Toaster } from "sonner";
//#region src/hooks/useRealtimeSync.ts
function useRealtimeSync() {
	const reloadArticles = useStore((s) => s.reloadArticles);
	const reloadClients = useStore((s) => s.reloadClients);
	const reloadEmployees = useStore((s) => s.reloadEmployees);
	const reloadLocations = useStore((s) => s.reloadLocations);
	const reloadReservations = useStore((s) => s.reloadReservations);
	const reloadSavedContracts = useStore((s) => s.reloadSavedContracts);
	const reloadNotes = useStore((s) => s.reloadNotes);
	useEffect(() => {
		const channel = supabase.channel("limperatrice-db-changes").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "articles"
		}, () => {
			reloadArticles();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "clients"
		}, () => {
			reloadClients();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "employees"
		}, () => {
			reloadEmployees();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "notes"
		}, () => {
			reloadNotes();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "locations"
		}, () => {
			reloadLocations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "location_articles"
		}, () => {
			reloadLocations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "versements"
		}, () => {
			reloadLocations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "reservations"
		}, () => {
			reloadReservations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "reservation_articles"
		}, () => {
			reloadReservations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "reservation_versements"
		}, () => {
			reloadReservations();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "saved_contracts"
		}, () => {
			reloadSavedContracts();
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "saved_contract_articles"
		}, () => {
			reloadSavedContracts();
		}).subscribe((status) => {
			if (status === "SUBSCRIBED") console.log("[RealtimeSync] Subscribed to all DB change events.");
			else if (status === "CHANNEL_ERROR") console.warn("[RealtimeSync] Channel error — changes may not be delivered.");
			else if (status === "TIMED_OUT") console.warn("[RealtimeSync] Subscription timed out.");
		});
		return () => {
			supabase.removeChannel(channel);
			console.log("[RealtimeSync] Unsubscribed and channel removed.");
		};
	}, []);
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/_app.tsx?tsr-split=component
var NAV = [
	{
		to: "/dashboard",
		label: "Tableau de bord",
		icon: LayoutDashboard,
		admin: true
	},
	{
		to: "/stock",
		label: "Stock",
		icon: Package
	},
	{
		to: "/locations",
		label: "Locations",
		icon: CalendarDays
	},
	{
		to: "/reservation",
		label: "Réservations",
		icon: BookMarked
	},
	{
		to: "/contract",
		label: "Contrats",
		icon: FileText
	},
	{
		to: "/notes",
		label: "Notes",
		icon: StickyNote,
		admin: true
	},
	{
		to: "/caisse",
		label: "Caisse",
		icon: Wallet,
		admin: true
	},
	{
		to: "/employes",
		label: "Employés",
		icon: UserCog,
		admin: true
	}
];
function AppLayout() {
	const navigate = useNavigate();
	const auth = useStore((s) => s.auth);
	const logout = useStore((s) => s.logout);
	const path = useRouterState({ select: (s) => s.location.pathname });
	const [mobileOpen, setMobileOpen] = useState(false);
	useRealtimeSync();
	const openMobile = useCallback(() => setMobileOpen(true), []);
	const closeMobile = useCallback(() => setMobileOpen(false), []);
	useEffect(() => {
		if (!auth.role) navigate({ to: "/login" });
	}, [auth.role]);
	useEffect(() => {
		if (auth.role) useStore.getState().loadAllData();
	}, [auth.role]);
	if (!auth.role) return null;
	const items = NAV.filter((i) => !i.admin || auth.role === "admin");
	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "min-h-screen flex bg-[#FAF9F6]",
		children: [
			/* @__PURE__ */ jsx(Toaster$1, {
				position: "top-right",
				richColors: true
			}),
			/* @__PURE__ */ jsxs("aside", {
				className: "hidden lg:flex w-[260px] flex-col bg-white border-r border-[#F0EEEC] py-10 px-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "mb-10 px-3",
						children: [/* @__PURE__ */ jsx("div", {
							className: "brand-name font-light tracking-[0.18em] uppercase text-neutral-800",
							style: { fontSize: 22 },
							children: "L'impératrice"
						}), /* @__PURE__ */ jsx("div", {
							className: "text-[10px] uppercase tracking-[0.15em] text-neutral-400 mt-1.5",
							children: "Gestion de Luxe"
						})]
					}),
					/* @__PURE__ */ jsx("nav", {
						className: "flex-1 space-y-2",
						children: items.map((item) => {
							const active = path.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ jsxs(Link, {
								to: item.to,
								className: "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm transition-all duration-300 relative",
								style: {
									background: active ? "rgba(186, 147, 223, 0.07)" : "transparent",
									color: active ? "#8f67b5" : "#555555",
									fontWeight: active ? 500 : 400,
									letterSpacing: "0.03em"
								},
								children: [/* @__PURE__ */ jsx(Icon, { className: "w-4.5 h-4.5 stroke-[1.8]" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-auto pt-8 border-t border-[#F0EEEC] px-3",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-[0.12em] text-neutral-400",
								children: "Session"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "text-[14px] font-medium text-neutral-700 mt-1",
								children: auth.employeeName
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: handleLogout,
								className: "mt-4 text-[12px] uppercase tracking-[0.12em] font-semibold flex items-center gap-1.5 transition-colors hover:text-[#8f67b5]",
								style: {
									color: "#BA93DF",
									cursor: "pointer"
								},
								children: [/* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }), " Déconnexion"]
							})
						]
					})
				]
			}),
			mobileOpen && /* @__PURE__ */ jsxs("div", {
				className: "lg:hidden fixed inset-0 z-50",
				onClick: closeMobile,
				children: [/* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/30 backdrop-blur-sm" }), /* @__PURE__ */ jsxs("aside", {
					className: "absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col shadow-2xl py-10 px-6",
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "mb-10 px-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "brand-name font-light tracking-[0.18em] uppercase text-neutral-800",
								style: { fontSize: 20 },
								children: "L'impératrice"
							}), /* @__PURE__ */ jsx("div", {
								className: "text-[10px] uppercase tracking-[0.15em] text-neutral-400 mt-1.5",
								children: "Gestion de Luxe"
							})]
						}),
						/* @__PURE__ */ jsx("nav", {
							className: "flex-1 space-y-2 overflow-y-auto",
							children: items.map((item) => {
								const active = path.startsWith(item.to);
								const Icon = item.icon;
								return /* @__PURE__ */ jsxs(Link, {
									to: item.to,
									onClick: closeMobile,
									className: "flex items-center gap-4 px-4 py-3 rounded-xl text-[15px] transition-all duration-300 relative",
									style: {
										background: active ? "rgba(186, 147, 223, 0.07)" : "transparent",
										color: active ? "#8f67b5" : "#555555",
										fontWeight: active ? 500 : 400,
										letterSpacing: "0.03em"
									},
									children: [/* @__PURE__ */ jsx(Icon, { className: "w-5 h-5 stroke-[1.8]" }), item.label]
								}, item.to);
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-auto pt-8 border-t border-[#F0EEEC] px-3",
							children: [
								/* @__PURE__ */ jsx("div", {
									className: "text-[10px] uppercase tracking-[0.12em] text-neutral-400",
									children: "Session"
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-[15px] font-medium text-neutral-700 mt-1",
									children: auth.employeeName
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: handleLogout,
									className: "mt-4 text-[13px] uppercase tracking-[0.12em] font-semibold flex items-center gap-1.5",
									style: { color: "#BA93DF" },
									children: [/* @__PURE__ */ jsx(LogOut, { className: "w-4 h-4" }), " Déconnexion"]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("main", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ jsxs("header", {
					className: "lg:hidden flex items-center px-6 py-4 border-b bg-white mt-8",
					style: { borderColor: "#F0EEEC" },
					children: [
						/* @__PURE__ */ jsx("button", {
							onClick: openMobile,
							"aria-label": "Menu",
							className: "mr-4 p-1",
							style: { color: "#1A1A1A" },
							children: /* @__PURE__ */ jsx(Menu, { className: "w-6 h-6" })
						}),
						/* @__PURE__ */ jsx("div", {
							className: "brand-name flex-1 font-light tracking-[0.15em] uppercase text-neutral-800",
							style: { fontSize: 20 },
							children: "L'impératrice"
						}),
						/* @__PURE__ */ jsx("button", {
							onClick: handleLogout,
							"aria-label": "Déconnexion",
							className: "p-1",
							style: { color: "#BA93DF" },
							children: /* @__PURE__ */ jsx(LogOut, { className: "w-6 h-6" })
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "p-8 lg:p-12 max-w-[1400px] mx-auto pb-12",
					children: /* @__PURE__ */ jsx(Outlet, {})
				})]
			})
		]
	});
}
//#endregion
export { AppLayout as component };
