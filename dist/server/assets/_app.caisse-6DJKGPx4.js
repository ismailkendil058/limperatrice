import { a as formatDate, i as formatDA, o as parseMachta, r as useStore, t as locReste } from "./store-C6Z2575g.js";
import { n as Td, r as Th } from "./table-JR-eRzRH.js";
import { useMemo, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/_app.caisse.tsx?tsr-split=component
var todayStr = () => {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
};
var thisMonthStr = () => {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
};
var firstDayOfThisMonthStr = () => {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-01`;
};
function CaissePage() {
	const locations = useStore((s) => s.locations);
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const [filterMode, setFilterMode] = useState("month");
	const [selectedDay, setSelectedDay] = useState(todayStr());
	const [selectedMonth, setSelectedMonth] = useState(thisMonthStr());
	const [startDate, setStartDate] = useState(firstDayOfThisMonthStr());
	const [endDate, setEndDate] = useState(todayStr());
	const { start, end } = useMemo(() => {
		try {
			if (filterMode === "day" && selectedDay) {
				const start = /* @__PURE__ */ new Date(selectedDay + "T00:00:00");
				const end = /* @__PURE__ */ new Date(selectedDay + "T23:59:59.999");
				if (!isNaN(start.getTime()) && !isNaN(end.getTime())) return {
					start,
					end
				};
			} else if (filterMode === "month" && selectedMonth) {
				const parts = selectedMonth.split("-").map(Number);
				if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
					const [year, month] = parts;
					return {
						start: new Date(year, month - 1, 1, 0, 0, 0, 0),
						end: new Date(year, month, 0, 23, 59, 59, 999)
					};
				}
			} else if (filterMode === "period" && startDate && endDate) {
				const start = /* @__PURE__ */ new Date(startDate + "T00:00:00");
				const end = /* @__PURE__ */ new Date(endDate + "T23:59:59.999");
				if (!isNaN(start.getTime()) && !isNaN(end.getTime())) return {
					start,
					end
				};
			}
		} catch (e) {
			console.error(e);
		}
		return {
			start: /* @__PURE__ */ new Date(0),
			end: new Date(9999, 11, 31)
		};
	}, [
		filterMode,
		selectedDay,
		selectedMonth,
		startDate,
		endDate
	]);
	const allVersements = useMemo(() => {
		return locations.flatMap((l) => (l.versements ?? []).map((v) => ({
			...v,
			location: l
		}))).filter((v) => {
			const d = new Date(v.date);
			return d >= start && d <= end;
		}).sort((a, b) => b.date.localeCompare(a.date));
	}, [
		locations,
		start,
		end
	]);
	const periodTotal = allVersements.reduce((s, v) => s + v.amount, 0);
	const restesPercevoir = locations.reduce((s, l) => s + locReste(l), 0);
	const periodLabel = useMemo(() => {
		if (filterMode === "day") return `le ${selectedDay}`;
		if (filterMode === "month") return `en ${selectedMonth}`;
		return `du ${startDate} au ${endDate}`;
	}, [
		filterMode,
		selectedDay,
		selectedMonth,
		startDate,
		endDate
	]);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "page-title",
				children: "Caisse"
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-col md:flex-row gap-4 items-start md:items-center justify-between pb-2 border-b",
				style: { borderColor: "#E5E5E5" },
				children: [/* @__PURE__ */ jsx("div", {
					className: "flex gap-2",
					children: [
						{
							id: "day",
							label: "Par Jour"
						},
						{
							id: "month",
							label: "Par Mois"
						},
						{
							id: "period",
							label: "Par Période"
						}
					].map((m) => {
						const active = filterMode === m.id;
						return /* @__PURE__ */ jsx("button", {
							onClick: () => setFilterMode(m.id),
							className: "pill cursor-pointer",
							style: {
								background: active ? "#BA93DF" : "transparent",
								color: active ? "#1A1A1A" : "rgba(26,26,26,0.6)",
								border: active ? "1px solid #BA93DF" : "1px solid #E5E5E5",
								padding: "6px 14px",
								fontSize: 13
							},
							children: m.label
						}, m.id);
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex gap-3 items-center w-full md:w-auto",
					children: [
						filterMode === "day" && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 w-full md:w-auto",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-[rgba(26,26,26,0.55)]",
								children: "Date :"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								className: "input-field max-w-[200px]",
								value: selectedDay,
								onChange: (e) => setSelectedDay(e.target.value),
								"aria-label": "Date"
							})]
						}),
						filterMode === "month" && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 w-full md:w-auto",
							children: [/* @__PURE__ */ jsx("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-[rgba(26,26,26,0.55)]",
								children: "Mois :"
							}), /* @__PURE__ */ jsx("input", {
								type: "month",
								className: "input-field max-w-[200px]",
								value: selectedMonth,
								onChange: (e) => setSelectedMonth(e.target.value),
								"aria-label": "Mois"
							})]
						}),
						filterMode === "period" && /* @__PURE__ */ jsxs("div", {
							className: "flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full md:w-auto",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold uppercase tracking-wider text-[rgba(26,26,26,0.55)]",
									children: "Du :"
								}), /* @__PURE__ */ jsx("input", {
									type: "date",
									className: "input-field max-w-[160px]",
									value: startDate,
									onChange: (e) => setStartDate(e.target.value),
									"aria-label": "Date de début"
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold uppercase tracking-wider text-[rgba(26,26,26,0.55)]",
									children: "Au :"
								}), /* @__PURE__ */ jsx("input", {
									type: "date",
									className: "input-field max-w-[160px]",
									value: endDate,
									onChange: (e) => setEndDate(e.target.value),
									"aria-label": "Date de fin"
								})]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
				children: [
					/* @__PURE__ */ jsx(Stat, {
						label: `Encaissé ${periodLabel}`,
						value: formatDA(periodTotal)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "Restes à percevoir",
						value: formatDA(restesPercevoir)
					}),
					/* @__PURE__ */ jsx(Stat, {
						label: "Nombre de versements",
						value: String(allVersements.length)
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "card-surface",
				style: { padding: 0 },
				children: [/* @__PURE__ */ jsxs("div", {
					className: "px-6 py-4 border-b flex items-center justify-between",
					style: { borderColor: "#E5E5E5" },
					children: [/* @__PURE__ */ jsx("div", {
						className: "section-label",
						children: "Versements sur la période"
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-sm",
						style: {
							color: "#BA93DF",
							fontWeight: 600
						},
						children: ["Total : ", formatDA(periodTotal)]
					})]
				}), allVersements.length === 0 ? /* @__PURE__ */ jsx("div", {
					className: "p-8 text-center text-sm",
					style: { color: "rgba(26,26,26,0.55)" },
					children: "Aucun versement sur cette période."
				}) : /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						style: {
							borderBottom: "2px solid #E5E5E5",
							background: "#FAFAFA"
						},
						children: [
							/* @__PURE__ */ jsx(Th, { children: "Date" }),
							/* @__PURE__ */ jsx(Th, { children: "Client" }),
							/* @__PURE__ */ jsx(Th, { children: "Article(s)" }),
							/* @__PURE__ */ jsx(Th, { children: "Type" }),
							/* @__PURE__ */ jsx(Th, { children: "Montant" })
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: allVersements.map((v) => {
						const client = clients.find((c) => c.id === v.location.clientId);
						const machta = parseMachta(v.location.notes);
						const arts = articles.filter((a) => (v.location.articleIds ?? []).includes(a.id)).map((a) => a.name).join(", ") || (machta.active ? "Service Machta" : "Aucun");
						return /* @__PURE__ */ jsxs("tr", {
							style: { borderBottom: "1px solid #E5E5E5" },
							children: [
								/* @__PURE__ */ jsx(Td, { children: formatDate(v.date) }),
								/* @__PURE__ */ jsx(Td, { children: client?.name }),
								/* @__PURE__ */ jsx(Td, { children: arts }),
								/* @__PURE__ */ jsx(Td, { children: v.type }),
								/* @__PURE__ */ jsx(Td, {
									style: {
										color: "#BA93DF",
										fontWeight: 500
									},
									children: formatDA(v.amount)
								})
							]
						}, v.id);
					}) })]
				})]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "card-surface",
		children: [/* @__PURE__ */ jsx("div", {
			style: {
				fontFamily: "Cormorant Garamond, serif",
				fontSize: 26,
				color: "#BA93DF"
			},
			children: value
		}), /* @__PURE__ */ jsx("div", {
			className: "text-xs uppercase tracking-wider mt-2",
			style: { color: "rgba(26,26,26,0.55)" },
			children: label
		})]
	});
}
//#endregion
export { CaissePage as component };
