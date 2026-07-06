import { i as formatDA, r as useStore, t as locReste } from "./store-C6Z2575g.js";
import { jsx, jsxs } from "react/jsx-runtime";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app.dashboard.tsx?tsr-split=component
function Dashboard() {
	const locations = useStore((s) => s.locations);
	const articles = useStore((s) => s.articles);
	const clients = useStore((s) => s.clients);
	const now = /* @__PURE__ */ new Date();
	new Date(now.getFullYear(), now.getMonth(), 1);
	const overdue = locations.filter((l) => l.status === "En retard");
	const months = [];
	for (let i = 5; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
		const count = locations.filter((l) => new Date(l.createdAt) >= d && new Date(l.createdAt) < next).length;
		months.push({
			label: d.toLocaleDateString("fr-FR", { month: "short" }),
			count
		});
	}
	const articleCounts = locations.reduce((acc, l) => {
		(l.articleIds ?? []).forEach((aid) => {
			acc[aid] = (acc[aid] || 0) + 1;
		});
		return acc;
	}, {});
	const topProducts = Object.entries(articleCounts).map(([id, count]) => {
		return {
			id,
			name: articles.find((a) => a.id === id)?.name ?? "Article inconnu",
			count
		};
	}).sort((a, b) => b.count - a.count).slice(0, 5);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Tableau de bord"
			}), /* @__PURE__ */ jsx("div", {
				className: "text-[13px] mt-1",
				style: { color: "rgba(26,26,26,0.55)" },
				children: (/* @__PURE__ */ new Date()).toLocaleDateString("fr-FR", {
					weekday: "long",
					day: "numeric",
					month: "long",
					year: "numeric"
				})
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid lg:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "card-surface",
					children: [/* @__PURE__ */ jsx("div", {
						className: "section-label mb-4",
						children: "Locations par mois"
					}), /* @__PURE__ */ jsx("div", {
						style: { height: 240 },
						children: /* @__PURE__ */ jsx(ResponsiveContainer, { children: /* @__PURE__ */ jsxs(BarChart, {
							data: months,
							children: [
								/* @__PURE__ */ jsx(XAxis, {
									dataKey: "label",
									stroke: "#E5E5E5",
									tick: {
										fill: "#1A1A1A",
										fontSize: 12
									}
								}),
								/* @__PURE__ */ jsx(YAxis, {
									stroke: "#E5E5E5",
									tick: {
										fill: "#1A1A1A",
										fontSize: 12
									}
								}),
								/* @__PURE__ */ jsx(Tooltip, { cursor: { fill: "rgba(186, 147, 223,0.06)" } }),
								/* @__PURE__ */ jsx(Bar, {
									dataKey: "count",
									fill: "#BA93DF",
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "card-surface flex flex-col justify-between",
					style: { minHeight: 300 },
					children: [/* @__PURE__ */ jsx("div", {
						className: "section-label mb-4",
						children: "Top 5 des articles les plus loués"
					}), /* @__PURE__ */ jsx("div", {
						className: "space-y-4 flex-1 flex flex-col justify-center",
						children: topProducts.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "text-sm text-center py-8",
							style: { color: "rgba(26,26,26,0.5)" },
							children: "Aucune location enregistrée"
						}) : topProducts.map((p, idx) => {
							const maxCount = topProducts[0]?.count || 1;
							const pct = Math.round(p.count / maxCount * 100);
							return /* @__PURE__ */ jsxs("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "font-medium",
										children: [
											idx + 1,
											". ",
											p.name
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "font-semibold",
										style: { color: "#BA93DF" },
										children: [p.count, " locations"]
									})]
								}), /* @__PURE__ */ jsx("div", {
									className: "w-full bg-[rgba(26,26,26,0.06)] rounded-full h-2",
									children: /* @__PURE__ */ jsx("div", {
										className: "h-2 rounded-full",
										style: {
											width: `${pct}%`,
											background: "#BA93DF"
										}
									})
								})]
							}, p.id);
						})
					})]
				})]
			}),
			overdue.length > 0 && /* @__PURE__ */ jsxs("div", {
				className: "card-surface",
				children: [/* @__PURE__ */ jsx("div", {
					className: "section-label mb-4",
					children: "Retours en retard"
				}), /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						style: { borderBottom: "2px solid #E5E5E5" },
						children: [
							/* @__PURE__ */ jsx("th", {
								className: "text-left py-2 px-2 font-semibold uppercase text-xs tracking-wider",
								children: "Client"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left py-2 px-2 font-semibold uppercase text-xs tracking-wider",
								children: "Articles"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left py-2 px-2 font-semibold uppercase text-xs tracking-wider",
								children: "Retard"
							}),
							/* @__PURE__ */ jsx("th", {
								className: "text-left py-2 px-2 font-semibold uppercase text-xs tracking-wider",
								children: "Reste dû"
							}),
							/* @__PURE__ */ jsx("th", {})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: overdue.map((l) => {
						const client = clients.find((c) => c.id === l.clientId);
						const arts = articles.filter((a) => (l.articleIds ?? []).includes(a.id)).map((a) => a.name).join(", ");
						const days = Math.floor((Date.now() - new Date(l.returnDate).getTime()) / 864e5);
						return /* @__PURE__ */ jsxs("tr", {
							style: { borderBottom: "1px solid #E5E5E5" },
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "py-3 px-2",
									children: client?.name
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 px-2",
									children: arts
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "py-3 px-2",
									children: [days, " j"]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 px-2",
									style: {
										color: "#BA93DF",
										fontWeight: 500
									},
									children: formatDA(locReste(l))
								}),
								/* @__PURE__ */ jsx("td", {
									className: "py-3 px-2",
									children: /* @__PURE__ */ jsx("a", {
										href: `tel:${client?.phone}`,
										style: { color: "#BA93DF" },
										children: "Contacter"
									})
								})
							]
						}, l.id);
					}) })]
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
