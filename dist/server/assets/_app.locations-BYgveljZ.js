import { a as formatDate, c as today, i as formatDA, n as locVerse, o as parseMachta, r as useStore, s as serializeMachta, t as locReste } from "./store-C6Z2575g.js";
import { n as Td, r as Th, t as FieldLabel } from "./table-JR-eRzRH.js";
import { i as Modal, n as Drawer, r as EmptyState, t as Badge } from "./ui-kit-DbwqiaUZ.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, CalendarDays, Check, Pencil, Plus, Printer, Save, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/_app.locations.tsx?tsr-split=component
/** Get the effective price for an article in a location (custom override or default) */
function getArticlePrice(location, articleId, defaultPrice) {
	return location.articlePrices?.[articleId] ?? defaultPrice;
}
var TABS = [
	"En cours",
	"Rendues",
	"En retard"
];
function LocationsPage() {
	const locations = useStore((s) => s.locations);
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const pendingNew = useStore((s) => s.pendingNewLocationClientId);
	const pendingOpen = useStore((s) => s.pendingOpenLocationId);
	const setPendingNew = useStore((s) => s.setPendingNewLocation);
	const setPendingOpen = useStore((s) => s.setPendingOpenLocation);
	const isAdmin = useStore((s) => s.auth.role === "admin");
	const [tab, setTab] = useState("En cours");
	const [clientSearch, setClientSearch] = useState("");
	const [newOpen, setNewOpen] = useState(false);
	const [openId, setOpenId] = useState(null);
	const [prefillClient, setPrefillClient] = useState(null);
	useEffect(() => {
		if (pendingNew) {
			setPrefillClient(pendingNew);
			setNewOpen(true);
			setPendingNew(null);
		}
	}, [pendingNew, setPendingNew]);
	useEffect(() => {
		if (pendingOpen) {
			setOpenId(pendingOpen);
			setPendingOpen(null);
		}
	}, [pendingOpen, setPendingOpen]);
	const filtered = locations.filter((l) => {
		if (tab === "Rendues") return l.status === "Rendue";
		const isOverdue = l.returnDate < today();
		if (tab === "En retard") return (l.status === "En retard" || isOverdue) && l.status !== "Rendue";
		if (tab === "En cours") return l.status === "En cours" && !isOverdue;
		return l.status === tab;
	});
	const openLoc = locations.find((l) => l.id === openId) ?? null;
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Locations"
				}), isAdmin && /* @__PURE__ */ jsxs("button", {
					onClick: () => setNewOpen(true),
					className: "btn-primary",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Nouvelle location"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "flex gap-1 border-b overflow-x-auto",
				style: { borderColor: "#E5E5E5" },
				children: TABS.map((t) => {
					const active = t === tab;
					return /* @__PURE__ */ jsx("button", {
						onClick: () => setTab(t),
						className: "px-4 py-2.5 text-sm whitespace-nowrap",
						style: {
							color: active ? "#BA93DF" : "rgba(26,26,26,0.6)",
							fontWeight: active ? 600 : 400,
							borderBottom: active ? "2px solid #BA93DF" : "2px solid transparent",
							marginBottom: "-1px"
						},
						children: t
					}, t);
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
					style: { color: "rgba(26,26,26,0.4)" }
				}), /* @__PURE__ */ jsx("input", {
					className: "input-field w-full pl-9",
					placeholder: "Rechercher par client ou article...",
					value: clientSearch,
					onChange: (e) => setClientSearch(e.target.value)
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				icon: /* @__PURE__ */ jsx(CalendarDays, { className: "w-12 h-12" }),
				title: `Aucune location ${tab.toLowerCase()}`
			}) : /* @__PURE__ */ jsxs("div", {
				className: "card-surface",
				style: {
					padding: 0,
					overflow: "hidden"
				},
				children: [/* @__PURE__ */ jsxs("table", {
					className: "hidden md:table w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						style: {
							borderBottom: "2px solid #E5E5E5",
							background: "#FAFAFA"
						},
						children: [
							/* @__PURE__ */ jsx(Th, { children: "Client" }),
							/* @__PURE__ */ jsx(Th, { children: "Article(s)" }),
							/* @__PURE__ */ jsx(Th, { children: "Retrait" }),
							/* @__PURE__ */ jsx(Th, { children: "Retour prévu" }),
							/* @__PURE__ */ jsx(Th, { children: "Total" }),
							/* @__PURE__ */ jsx(Th, { children: "Reste" }),
							/* @__PURE__ */ jsx(Th, { children: "Statut" })
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: filtered.map((l) => {
						const client = clients.find((c) => c.id === l.clientId);
						const machta = parseMachta(l.notes);
						const arts = articles.filter((a) => (l.articleIds ?? []).includes(a.id)).map((a) => a.name).join(", ") || (machta.active ? "Service Machta" : "Aucun");
						const reste = locReste(l);
						const displayStatus = l.returnDate < today() && l.status !== "Rendue" ? "En retard" : l.status;
						return /* @__PURE__ */ jsxs("tr", {
							onClick: () => setOpenId(l.id),
							className: "cursor-pointer hover:bg-[rgba(186, 147, 223,0.04)]",
							style: {
								borderBottom: "1px solid #E5E5E5",
								borderLeft: displayStatus === "En retard" ? "3px solid #C0392B" : "3px solid transparent"
							},
							children: [
								/* @__PURE__ */ jsx(Td, { children: client?.name }),
								/* @__PURE__ */ jsx(Td, { children: arts }),
								/* @__PURE__ */ jsx(Td, { children: formatDate(l.pickupDate) }),
								/* @__PURE__ */ jsx(Td, { children: formatDate(l.returnDate) }),
								/* @__PURE__ */ jsx(Td, { children: formatDA(l.total) }),
								/* @__PURE__ */ jsx(Td, {
									style: {
										color: reste > 0 ? "#BA93DF" : "rgba(26,26,26,0.45)",
										fontWeight: reste > 0 ? 500 : 400
									},
									children: formatDA(reste)
								}),
								/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Badge, { status: displayStatus }) })
							]
						}, l.id);
					}) })]
				}), /* @__PURE__ */ jsx("div", {
					className: "md:hidden divide-y",
					style: { borderColor: "#E5E5E5" },
					children: filtered.map((l) => {
						const client = clients.find((c) => c.id === l.clientId);
						const reste = locReste(l);
						const displayStatus = l.returnDate < today() && l.status !== "Rendue" ? "En retard" : l.status;
						return /* @__PURE__ */ jsxs("div", {
							onClick: () => setOpenId(l.id),
							className: "p-4 flex items-start justify-between gap-3",
							style: { borderLeft: displayStatus === "En retard" ? "3px solid #C0392B" : "3px solid transparent" },
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: client?.name
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "text-xs mt-0.5",
										style: { color: "rgba(26,26,26,0.55)" },
										children: [
											"Retour ",
											formatDate(l.returnDate),
											" · ",
											formatDA(l.total)
										]
									}),
									reste > 0 && /* @__PURE__ */ jsxs("div", {
										className: "text-sm mt-1",
										style: {
											color: "#BA93DF",
											fontWeight: 500
										},
										children: ["Reste : ", formatDA(reste)]
									})
								]
							}), /* @__PURE__ */ jsx(Badge, { status: displayStatus })]
						}, l.id);
					})
				})]
			}),
			newOpen && /* @__PURE__ */ jsx(NewLocationModal, {
				open: newOpen,
				onClose: () => setNewOpen(false)
			}),
			openLoc && /* @__PURE__ */ jsx(LocationDetail, {
				location: openLoc,
				onClose: () => setOpenId(null)
			})
		]
	});
}
function NewLocationModal({ open, onClose }) {
	const articles = useStore((s) => s.articles);
	const addClient = useStore((s) => s.addClient);
	const addLocation = useStore((s) => s.addLocation);
	const [clientForm, setClientForm] = useState({
		name: "",
		phone: "",
		address: ""
	});
	const [selArticles, setSelArticles] = useState([]);
	const [customPrices, setCustomPrices] = useState({});
	const [pickupDate, setPickupDate] = useState(today());
	const [returnDate, setReturnDate] = useState(today());
	const [occasion, setOccasion] = useState("Mariage");
	const [notes, setNotes] = useState("");
	const [initialPayment, setInitialPayment] = useState(0);
	const [articleSearch, setArticleSearch] = useState("");
	const [err, setErr] = useState("");
	const [machtaActive, setMachtaActive] = useState(false);
	const [machtaPrice, setMachtaPrice] = useState(0);
	const [caution, setCaution] = useState("");
	const total = articles.filter((a) => selArticles.includes(a.id)).reduce((s, a) => s + (customPrices[a.id] ?? a.price), 0) + (machtaActive ? machtaPrice : 0);
	const reste = Math.max(0, total - initialPayment);
	const submit = async () => {
		if (!clientForm.name.trim()) {
			setErr("Nom du client requis");
			return;
		}
		if (selArticles.length === 0 && !machtaActive) {
			setErr("Sélectionnez au moins un article ou le service Machta");
			return;
		}
		if (returnDate < pickupDate) {
			setErr("Date de retour avant la date de retrait");
			return;
		}
		if (initialPayment > total) {
			setErr("Le versement dépasse le total");
			return;
		}
		try {
			const client = await addClient({
				name: clientForm.name.trim(),
				phone: clientForm.phone.trim(),
				address: clientForm.address.trim(),
				mesures: ""
			});
			const articlePrices = selArticles.some((id) => customPrices[id] !== void 0) ? Object.fromEntries(selArticles.map((id) => [id, customPrices[id] ?? articles.find((a) => a.id === id).price])) : void 0;
			await addLocation({
				clientId: client.id,
				articleIds: selArticles,
				articlePrices,
				pickupDate,
				returnDate,
				occasion,
				total,
				caution: Number(caution) || 0,
				notes: serializeMachta(notes, machtaActive, machtaPrice),
				initialPayment
			});
			onClose();
		} catch (e) {
			setErr("Erreur lors de la création de la location");
		}
	};
	const availableArts = articles.filter((a) => a.status === "Disponible").filter((a) => !articleSearch.trim() || a.name.toLowerCase().includes(articleSearch.toLowerCase()));
	return /* @__PURE__ */ jsx(Modal, {
		open,
		onClose,
		title: "Nouvelle location",
		size: "lg",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-danger",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: submit,
			className: "btn-primary",
			children: "Créer la location"
		})] }),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(Section, {
					title: "1. Client",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Nom complet",
								children: /* @__PURE__ */ jsx("input", {
									className: "input-field",
									placeholder: "Nom complet",
									value: clientForm.name,
									onChange: (e) => setClientForm({
										...clientForm,
										name: e.target.value
									})
								})
							}),
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Téléphone",
								children: /* @__PURE__ */ jsx("input", {
									className: "input-field",
									placeholder: "Téléphone (Optionnel)",
									value: clientForm.phone,
									onChange: (e) => setClientForm({
										...clientForm,
										phone: e.target.value
									})
								})
							}),
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Adresse",
								children: /* @__PURE__ */ jsx("input", {
									className: "input-field",
									placeholder: "Adresse (Optionnel)",
									value: clientForm.address,
									onChange: (e) => setClientForm({
										...clientForm,
										address: e.target.value
									})
								})
							})
						]
					})
				}),
				/* @__PURE__ */ jsxs(Section, {
					title: "2.1. Tenues",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "relative mb-2",
						children: [/* @__PURE__ */ jsx(Search, {
							className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
							style: { color: "rgba(26,26,26,0.4)" }
						}), /* @__PURE__ */ jsx("input", {
							className: "input-field w-full pl-9",
							placeholder: "Rechercher une tenue...",
							value: articleSearch,
							onChange: (e) => setArticleSearch(e.target.value)
						})]
					}), /* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1",
						children: availableArts.filter((a) => a.category === "Tenues").map((a) => {
							const sel = selArticles.includes(a.id);
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => {
									if (sel) {
										setSelArticles(selArticles.filter((x) => x !== a.id));
										const next = { ...customPrices };
										delete next[a.id];
										setCustomPrices(next);
									} else setSelArticles([...selArticles, a.id]);
								},
								className: "text-left p-3 rounded-lg border transition-colors",
								style: {
									borderColor: sel ? "#BA93DF" : "#E5E5E5",
									background: sel ? "rgba(186, 147, 223,0.06)" : "white"
								},
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-medium truncate",
									children: a.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "#BA93DF" },
									children: formatDA(a.price)
								})]
							}, a.id);
						})
					})]
				}),
				/* @__PURE__ */ jsxs(Section, {
					title: "2.2. Accessoires",
					children: [/* @__PURE__ */ jsx("div", {
						className: "grid grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1",
						children: availableArts.filter((a) => a.category === "Accessoires" || a.category === "Autre").map((a) => {
							const sel = selArticles.includes(a.id);
							return /* @__PURE__ */ jsxs("button", {
								onClick: () => {
									if (sel) {
										setSelArticles(selArticles.filter((x) => x !== a.id));
										const next = { ...customPrices };
										delete next[a.id];
										setCustomPrices(next);
									} else setSelArticles([...selArticles, a.id]);
								},
								className: "text-left p-3 rounded-lg border transition-colors",
								style: {
									borderColor: sel ? "#BA93DF" : "#E5E5E5",
									background: sel ? "rgba(186, 147, 223,0.06)" : "white"
								},
								children: [/* @__PURE__ */ jsx("div", {
									className: "text-sm font-medium truncate",
									children: a.name
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "#BA93DF" },
									children: formatDA(a.price)
								})]
							}, a.id);
						})
					}), selArticles.length > 0 && /* @__PURE__ */ jsxs("div", {
						className: "mt-3 space-y-2",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-xs font-medium",
							style: { color: "rgba(26,26,26,0.6)" },
							children: "Prix par article (modifiable)"
						}), selArticles.map((aid) => {
							const a = articles.find((x) => x.id === aid);
							if (!a) return null;
							return /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ jsx("span", {
										className: "flex-1 truncate",
										children: a.name
									}),
									/* @__PURE__ */ jsx("input", {
										type: "number",
										className: "input-field w-28 text-right",
										value: customPrices[aid] ?? a.price,
										placeholder: a.price.toString(),
										onChange: (e) => setCustomPrices({
											...customPrices,
											[aid]: +e.target.value || a.price
										}),
										"aria-label": `Prix ${a.name}`
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs",
										style: { color: "rgba(26,26,26,0.45)" },
										children: "DA"
									})
								]
							}, aid);
						})]
					})]
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "Service Additionnel",
					children: /* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-4 p-3 rounded-lg border bg-white",
						style: { borderColor: machtaActive ? "#BA93DF" : "#E5E5E5" },
						children: [/* @__PURE__ */ jsxs("label", {
							className: "flex items-center gap-2.5 cursor-pointer font-medium text-sm flex-1",
							children: [/* @__PURE__ */ jsx("input", {
								type: "checkbox",
								checked: machtaActive,
								onChange: (e) => {
									setMachtaActive(e.target.checked);
									if (e.target.checked && machtaPrice === 0) setMachtaPrice(15e3);
								},
								className: "w-4 h-4 rounded text-[#BA93DF] focus:ring-[#BA93DF] border-gray-300",
								style: { accentColor: "#BA93DF" }
							}), /* @__PURE__ */ jsx("span", { children: "Service Machta" })]
						}), machtaActive && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-neutral-500",
									children: "Prix :"
								}),
								/* @__PURE__ */ jsx("input", {
									type: "number",
									className: "input-field w-28 text-right",
									value: machtaPrice || "",
									placeholder: "0",
									onChange: (e) => setMachtaPrice(Math.max(0, +e.target.value)),
									"aria-label": "Prix Machta"
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.45)" },
									children: "DA"
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "3. Détails",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Date de retrait",
								children: /* @__PURE__ */ jsx("input", {
									type: "date",
									className: "input-field",
									value: pickupDate,
									onChange: (e) => setPickupDate(e.target.value)
								})
							}),
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Date de retour",
								children: /* @__PURE__ */ jsx("input", {
									type: "date",
									className: "input-field",
									value: returnDate,
									onChange: (e) => setReturnDate(e.target.value)
								})
							}),
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Occasion",
								children: /* @__PURE__ */ jsxs("select", {
									className: "input-field",
									value: occasion,
									onChange: (e) => setOccasion(e.target.value),
									children: [
										/* @__PURE__ */ jsx("option", { children: "Mariage" }),
										/* @__PURE__ */ jsx("option", { children: "Fiançailles" }),
										/* @__PURE__ */ jsx("option", { children: "Cérémonie" }),
										/* @__PURE__ */ jsx("option", { children: "Anniversaire" }),
										/* @__PURE__ */ jsx("option", { children: "Autre" })
									]
								})
							}),
							/* @__PURE__ */ jsx(FieldLabel, {
								label: "Notes",
								children: /* @__PURE__ */ jsx("input", {
									className: "input-field",
									value: notes,
									onChange: (e) => setNotes(e.target.value)
								})
							})
						]
					})
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "4. Paiement",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: "Total calculé"
								}), /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Cormorant Garamond, serif",
										fontSize: 22,
										color: "#BA93DF"
									},
									children: formatDA(total)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-1 md:grid-cols-2 gap-3",
								children: [/* @__PURE__ */ jsx(FieldLabel, {
									label: "Versement initial",
									children: /* @__PURE__ */ jsx("input", {
										type: "number",
										className: "input-field",
										value: initialPayment || "",
										onChange: (e) => setInitialPayment(+e.target.value)
									})
								}), /* @__PURE__ */ jsx(FieldLabel, {
									label: "Caution",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ jsx("input", {
											type: "number",
											className: "input-field flex-1",
											placeholder: "Caution (Optionnel)",
											value: caution,
											min: 0,
											onChange: (e) => {
												setCaution(e.target.value === "" ? "" : Number(e.target.value));
											}
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs",
											style: { color: "rgba(26,26,26,0.45)" },
											children: "DA"
										})]
									})
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm pt-2 border-t",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: "Reste à payer"
								}), /* @__PURE__ */ jsx("span", {
									style: {
										color: "#BA93DF",
										fontWeight: 600
									},
									children: formatDA(reste)
								})]
							})
						]
					})
				}),
				err && /* @__PURE__ */ jsx("div", {
					className: "text-sm",
					style: { color: "#C0392B" },
					children: err
				})
			]
		})
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "section-label mb-3",
		children: title
	}), children] });
}
function LocationArticlesSection({ location, articles }) {
	const updateArticlePrices = useStore((s) => s.updateLocationArticlePrices);
	const isAdmin = useStore((s) => s.auth.role === "admin");
	const [editing, setEditing] = useState(false);
	const [draftPrices, setDraftPrices] = useState({});
	const startEdit = () => {
		const init = {};
		articles.forEach((a) => {
			init[a.id] = getArticlePrice(location, a.id, a.price);
		});
		setDraftPrices(init);
		setEditing(true);
	};
	const save = () => {
		updateArticlePrices(location.id, draftPrices);
		setEditing(false);
	};
	const cancel = () => setEditing(false);
	const machta = parseMachta(location.notes);
	return /* @__PURE__ */ jsxs(Section, {
		title: "Articles",
		children: [/* @__PURE__ */ jsxs("ul", {
			className: "space-y-2",
			children: [articles.map((a) => {
				const price = editing ? draftPrices[a.id] : getArticlePrice(location, a.id, a.price);
				const isCustom = (location.articlePrices?.[a.id] ?? void 0) !== void 0;
				return /* @__PURE__ */ jsxs("li", {
					className: "flex items-center justify-between text-sm py-2 border-b",
					style: { borderColor: "#E5E5E5" },
					children: [/* @__PURE__ */ jsxs("span", {
						className: "flex items-center gap-2",
						children: [a.name, isCustom && !editing && /* @__PURE__ */ jsx("span", {
							className: "text-xs px-1.5 py-0.5 rounded",
							style: {
								background: "rgba(186, 147, 223,0.1)",
								color: "#BA93DF"
							},
							children: "personnalisé"
						})]
					}), editing ? /* @__PURE__ */ jsx("input", {
						type: "number",
						className: "input-field w-28 text-right",
						value: draftPrices[a.id] ?? "",
						placeholder: a.price.toString(),
						onChange: (e) => setDraftPrices({
							...draftPrices,
							[a.id]: +e.target.value || a.price
						}),
						"aria-label": `Prix ${a.name}`
					}) : /* @__PURE__ */ jsx("span", {
						style: { color: "#BA93DF" },
						children: formatDA(price)
					})]
				}, a.id);
			}), machta.active && /* @__PURE__ */ jsxs("li", {
				className: "flex items-center justify-between text-sm py-2 border-b",
				style: { borderColor: "#E5E5E5" },
				children: [/* @__PURE__ */ jsx("span", {
					className: "flex items-center gap-2",
					children: "Service Machta"
				}), /* @__PURE__ */ jsx("span", {
					style: { color: "#BA93DF" },
					children: formatDA(machta.price)
				})]
			})]
		}), isAdmin && /* @__PURE__ */ jsx("div", {
			className: "flex items-center justify-end gap-2 mt-3",
			children: editing ? /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("button", {
				onClick: cancel,
				className: "btn-ghost flex items-center gap-1",
				style: {
					padding: "4px 12px",
					fontSize: 12
				},
				children: [/* @__PURE__ */ jsx(X, { className: "w-3.5 h-3.5" }), " Annuler"]
			}), /* @__PURE__ */ jsxs("button", {
				onClick: save,
				className: "btn-primary flex items-center gap-1",
				style: {
					padding: "4px 12px",
					fontSize: 12
				},
				children: [/* @__PURE__ */ jsx(Check, { className: "w-3.5 h-3.5" }), " Enregistrer"]
			})] }) : /* @__PURE__ */ jsxs("button", {
				onClick: startEdit,
				className: "btn-ghost flex items-center gap-1",
				style: {
					padding: "4px 12px",
					fontSize: 12
				},
				children: [/* @__PURE__ */ jsx(Pencil, { className: "w-3.5 h-3.5" }), " Modifier les prix"]
			})
		})]
	});
}
function EditLocationModal({ location, onClose }) {
	const updateLocation = useStore((s) => s.updateLocation);
	useStore((s) => s.articles);
	const [pickupDate, setPickupDate] = useState(location.pickupDate);
	const [returnDate, setReturnDate] = useState(location.returnDate);
	const [occasion, setOccasion] = useState(location.occasion);
	const [notes, setNotes] = useState(location.notes ?? "");
	const [total, setTotal] = useState(location.total);
	const [err, setErr] = useState("");
	const machta = parseMachta(location.notes);
	const submit = async () => {
		if (returnDate < pickupDate) {
			setErr("Date de retour avant la date de retrait");
			return;
		}
		if (total <= 0) {
			setErr("Le total doit être supérieur à 0");
			return;
		}
		await updateLocation(location.id, {
			pickupDate,
			returnDate,
			occasion,
			notes: serializeMachta(notes, machta.active, machta.price),
			total
		});
		toast.success("Location mise à jour");
		onClose();
	};
	return /* @__PURE__ */ jsx(Modal, {
		open: true,
		onClose,
		title: "Modifier la location",
		size: "lg",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-ghost",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: submit,
			className: "btn-primary",
			children: "Enregistrer"
		})] }),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ jsx(FieldLabel, {
							label: "Date de retrait",
							children: /* @__PURE__ */ jsx("input", {
								type: "date",
								className: "input-field",
								value: pickupDate,
								onChange: (e) => setPickupDate(e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(FieldLabel, {
							label: "Date de retour",
							children: /* @__PURE__ */ jsx("input", {
								type: "date",
								className: "input-field",
								value: returnDate,
								onChange: (e) => setReturnDate(e.target.value)
							})
						}),
						/* @__PURE__ */ jsx(FieldLabel, {
							label: "Occasion",
							children: /* @__PURE__ */ jsxs("select", {
								className: "input-field",
								value: occasion,
								onChange: (e) => setOccasion(e.target.value),
								children: [
									/* @__PURE__ */ jsx("option", { children: "Mariage" }),
									/* @__PURE__ */ jsx("option", { children: "Fiançailles" }),
									/* @__PURE__ */ jsx("option", { children: "Cérémonie" }),
									/* @__PURE__ */ jsx("option", { children: "Anniversaire" }),
									/* @__PURE__ */ jsx("option", { children: "Autre" })
								]
							})
						}),
						/* @__PURE__ */ jsx(FieldLabel, {
							label: "Total (DA)",
							children: /* @__PURE__ */ jsx("input", {
								type: "number",
								className: "input-field",
								value: total,
								onChange: (e) => setTotal(+e.target.value || 0)
							})
						})
					]
				}),
				/* @__PURE__ */ jsx(FieldLabel, {
					label: "Notes",
					children: /* @__PURE__ */ jsx("input", {
						className: "input-field",
						value: notes,
						onChange: (e) => setNotes(e.target.value)
					})
				}),
				err && /* @__PURE__ */ jsx("div", {
					className: "text-sm",
					style: { color: "#C0392B" },
					children: err
				})
			]
		})
	});
}
function LocationDetail({ location, onClose }) {
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const addVersement = useStore((s) => s.addVersement);
	const deleteVersement = useStore((s) => s.deleteVersement);
	const markReturned = useStore((s) => s.markReturned);
	const saveContract = useStore((s) => s.saveContract);
	const deleteLocation = useStore((s) => s.deleteLocation);
	useStore((s) => s.updateLocation);
	const isAdmin = useStore((s) => s.auth.role === "admin");
	const [payOpen, setPayOpen] = useState(false);
	const [payAmount, setPayAmount] = useState(0);
	const [payDate, setPayDate] = useState(today());
	const [confirmDelete, setConfirmDelete] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const client = clients.find((c) => c.id === location.clientId);
	const arts = articles.filter((a) => (location.articleIds ?? []).includes(a.id));
	const reste = locReste(location);
	const submitPay = () => {
		if (payAmount <= 0 || payAmount > reste) return;
		addVersement(location.id, {
			date: payDate,
			amount: payAmount,
			type: payAmount === reste ? "Solde" : "Versement"
		});
		setPayOpen(false);
		setPayAmount(0);
	};
	const handleDelete = async () => {
		await deleteLocation(location.id);
		toast.success("Location supprimée");
		onClose();
	};
	return /* @__PURE__ */ jsxs(Drawer, {
		open: true,
		onClose,
		title: `Location · ${client?.name ?? ""}`,
		footer: /* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-ghost",
			children: "Fermer"
		}),
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ jsx(Badge, { status: location.status }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								isAdmin && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
									onClick: () => setEditOpen(true),
									className: "cursor-pointer p-1.5 rounded-md hover:bg-[rgba(186, 147, 223,0.08)] transition-colors",
									style: { color: "#BA93DF" },
									title: "Modifier",
									children: /* @__PURE__ */ jsx(Pencil, { className: "w-4 h-4" })
								}), /* @__PURE__ */ jsx("button", {
									onClick: () => setConfirmDelete(true),
									className: "cursor-pointer p-1.5 rounded-md hover:bg-[rgba(192,57,43,0.08)] transition-colors",
									style: { color: "#C0392B" },
									title: "Supprimer",
									children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
								})] }),
								/* @__PURE__ */ jsx("button", {
									onClick: () => {
										saveContract(location.id);
										toast.success("Contrat sauvegardé avec succès !");
									},
									className: "cursor-pointer p-1.5 rounded-md hover:bg-[rgba(186, 147, 223,0.08)] transition-colors",
									style: { color: "#BA93DF" },
									title: "Sauvegarder contrat",
									children: /* @__PURE__ */ jsx(Save, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ jsx("button", {
									onClick: () => window.print(),
									className: "cursor-pointer p-1.5 rounded-md hover:bg-[rgba(186, 147, 223,0.08)] transition-colors",
									style: { color: "#BA93DF" },
									title: "Imprimer le contrat",
									children: /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" })
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(LocationArticlesSection, {
						location,
						articles: arts
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Dates & occasion",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Retrait"
								}), /* @__PURE__ */ jsx("div", { children: formatDate(location.pickupDate) })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Retour prévu"
								}), /* @__PURE__ */ jsx("div", { children: formatDate(location.returnDate) })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Occasion"
								}), /* @__PURE__ */ jsx("div", { children: location.occasion })] }),
								location.actualReturnDate && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Retour réel"
								}), /* @__PURE__ */ jsx("div", { children: formatDate(location.actualReturnDate) })] })
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-surface",
						style: { padding: 20 },
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "section-label mb-3",
								children: "Paiements"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm mb-3",
								children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Cormorant Garamond, serif",
										fontSize: 20
									},
									children: formatDA(location.total)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "space-y-1 mb-3",
								children: [(location.versements ?? []).length === 0 && /* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Aucun versement"
								}), (location.versements ?? []).map((v) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between text-sm py-1.5",
									children: [/* @__PURE__ */ jsxs("span", {
										style: { color: "rgba(26,26,26,0.7)" },
										children: [
											formatDate(v.date),
											" · ",
											v.type
										]
									}), /* @__PURE__ */ jsxs("span", {
										className: "flex items-center gap-2",
										children: [formatDA(v.amount), isAdmin && /* @__PURE__ */ jsx("button", {
											onClick: () => deleteVersement(location.id, v.id),
											"aria-label": "Supprimer",
											style: { color: "rgba(26,26,26,0.4)" },
											children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
										})]
									})]
								}, v.id))]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm pt-3 border-t",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsx("span", { children: "Reste à payer" }), /* @__PURE__ */ jsx("span", {
									style: {
										color: "#BA93DF",
										fontWeight: 600
									},
									children: formatDA(reste)
								})]
							}),
							/* @__PURE__ */ jsxs("button", {
								onClick: () => setPayOpen(true),
								className: "btn-primary w-full justify-center mt-4",
								disabled: reste === 0,
								children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Enregistrer un versement"]
							})
						]
					}),
					location.status !== "Rendue" && /* @__PURE__ */ jsx("button", {
						onClick: () => {
							const d = prompt("Date de retour ?", today());
							if (d) markReturned(location.id, d);
						},
						className: "btn-ghost w-full justify-center",
						children: "Marquer comme rendu"
					})
				]
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: payOpen,
				onClose: () => setPayOpen(false),
				title: "Nouveau versement",
				size: "sm",
				footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setPayOpen(false),
					className: "btn-danger",
					children: "Annuler"
				}), /* @__PURE__ */ jsx("button", {
					onClick: submitPay,
					className: "btn-primary",
					children: "Enregistrer"
				})] }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsx(FieldLabel, {
						label: `Montant (max ${formatDA(reste)})`,
						children: /* @__PURE__ */ jsx("input", {
							type: "number",
							className: "input-field",
							value: payAmount || "",
							onChange: (e) => setPayAmount(+e.target.value),
							max: reste
						})
					}), /* @__PURE__ */ jsx(FieldLabel, {
						label: "Date",
						children: /* @__PURE__ */ jsx("input", {
							type: "date",
							className: "input-field",
							value: payDate,
							onChange: (e) => setPayDate(e.target.value)
						})
					})]
				})
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: confirmDelete,
				onClose: () => setConfirmDelete(false),
				title: "Supprimer la location",
				size: "sm",
				footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setConfirmDelete(false),
					className: "btn-ghost",
					children: "Annuler"
				}), /* @__PURE__ */ jsx("button", {
					onClick: handleDelete,
					className: "btn-danger",
					children: "Supprimer"
				})] }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col items-center gap-3 py-2 text-center",
					children: [/* @__PURE__ */ jsx(AlertTriangle, {
						className: "w-10 h-10",
						style: { color: "#C0392B" }
					}), /* @__PURE__ */ jsx("p", {
						className: "text-sm",
						style: { color: "rgba(26,26,26,0.7)" },
						children: "Êtes-vous sûr de vouloir supprimer cette location ? Cette action est irréversible."
					})]
				})
			}),
			editOpen && /* @__PURE__ */ jsx(EditLocationModal, {
				location,
				onClose: () => setEditOpen(false)
			}),
			/* @__PURE__ */ jsx("div", {
				className: "print-area",
				style: { display: "none" },
				children: /* @__PURE__ */ jsx(PrintContract, { location })
			}),
			/* @__PURE__ */ jsx("style", { children: `@media print { .print-area { display: block !important; } }` })
		]
	});
}
function PrintContract({ location }) {
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const client = clients.find((c) => c.id === location.clientId);
	const arts = articles.filter((a) => (location.articleIds ?? []).includes(a.id));
	const verse = locVerse(location);
	const reste = locReste(location);
	const machta = parseMachta(location.notes);
	return /* @__PURE__ */ jsxs("div", {
		style: {
			fontFamily: "Montserrat, sans-serif",
			color: "#1A1A1A",
			fontSize: 13,
			lineHeight: 1.4,
			height: "100%",
			position: "relative",
			boxSizing: "border-box"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					textAlign: "center",
					paddingBottom: 12,
					borderBottom: "2px solid #BA93DF"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Cormorant Garamond, serif",
						fontStyle: "italic",
						fontSize: 26,
						color: "#BA93DF",
						letterSpacing: "0.15em"
					},
					children: "L'impératrice"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: 11,
						marginTop: 2,
						color: "rgba(26,26,26,0.6)"
					},
					children: "Contrat de location"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginTop: 12,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					gap: 8,
					flexWrap: "wrap",
					fontSize: 11,
					color: "#000000"
				},
				children: [
					/* @__PURE__ */ jsxs("span", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							gap: 3
						},
						children: [
							/* @__PURE__ */ jsxs("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: { flexShrink: 0 },
								children: [
									/* @__PURE__ */ jsx("rect", {
										x: "2",
										y: "2",
										width: "20",
										height: "20",
										rx: "5",
										ry: "5"
									}),
									/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
									/* @__PURE__ */ jsx("line", {
										x1: "17.5",
										y1: "6.5",
										x2: "17.51",
										y2: "6.5"
									})
								]
							}),
							/* @__PURE__ */ jsx("svg", {
								width: "12",
								height: "12",
								viewBox: "0 0 24 24",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2.2",
								strokeLinecap: "round",
								strokeLinejoin: "round",
								style: { flexShrink: 0 },
								children: /* @__PURE__ */ jsx("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })
							}),
							/* @__PURE__ */ jsx("strong", {
								style: { fontWeight: 600 },
								children: "location_limperatrice"
							})
						]
					}),
					/* @__PURE__ */ jsx("span", { children: "·" }),
					/* @__PURE__ */ jsx("span", { children: "Contact : 0793 39 88 37" })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 16 },
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Client :" }),
					" ",
					client?.name,
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx("strong", { children: "Téléphone :" }),
					" ",
					client?.phone,
					/* @__PURE__ */ jsx("br", {}),
					client?.address && /* @__PURE__ */ jsxs(Fragment, { children: [
						/* @__PURE__ */ jsx("strong", { children: "Adresse :" }),
						" ",
						client.address,
						/* @__PURE__ */ jsx("br", {})
					] })
				]
			}),
			/* @__PURE__ */ jsxs("table", {
				style: {
					width: "100%",
					marginTop: 16,
					borderCollapse: "collapse"
				},
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					style: { borderBottom: "1px solid #E5E5E5" },
					children: [/* @__PURE__ */ jsx("th", {
						style: {
							textAlign: "left",
							padding: "6px 8px"
						},
						children: "Article"
					}), /* @__PURE__ */ jsx("th", {
						style: {
							textAlign: "right",
							padding: "6px 8px"
						},
						children: "Prix"
					})]
				}) }), /* @__PURE__ */ jsxs("tbody", { children: [arts.map((a) => /* @__PURE__ */ jsxs("tr", {
					style: { borderBottom: "1px solid #E5E5E5" },
					children: [/* @__PURE__ */ jsx("td", {
						style: { padding: "6px 8px" },
						children: a.name
					}), /* @__PURE__ */ jsx("td", {
						style: {
							padding: "6px 8px",
							textAlign: "right"
						},
						children: formatDA(getArticlePrice(location, a.id, a.price))
					})]
				}, a.id)), machta.active && /* @__PURE__ */ jsxs("tr", {
					style: { borderBottom: "1px solid #E5E5E5" },
					children: [/* @__PURE__ */ jsx("td", {
						style: { padding: "6px 8px" },
						children: "Service Machta"
					}), /* @__PURE__ */ jsx("td", {
						style: {
							padding: "6px 8px",
							textAlign: "right"
						},
						children: formatDA(machta.price)
					})]
				})] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 16 },
				children: [/* @__PURE__ */ jsxs("div", { children: ["Retrait : ", formatDate(location.pickupDate)] }), /* @__PURE__ */ jsxs("div", { children: ["Retour prévu : ", formatDate(location.returnDate)] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginTop: 16,
					padding: 12,
					border: "1px solid #E5E5E5",
					borderRadius: 8,
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: ["Total : ", /* @__PURE__ */ jsx("strong", { children: formatDA(location.total) })] }),
					/* @__PURE__ */ jsxs("div", { children: ["Versé : ", formatDA(verse)] }),
					/* @__PURE__ */ jsxs("div", { children: ["Reste : ", /* @__PURE__ */ jsx("strong", {
						style: { color: "#BA93DF" },
						children: formatDA(reste)
					})] }),
					location.caution > 0 && /* @__PURE__ */ jsxs("div", { children: ["Caution : ", /* @__PURE__ */ jsx("strong", { children: formatDA(location.caution) })] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 32 },
				children: ["Signature client : _________________________   Date : ", formatDate(location.pickupDate)]
			}),
			/* @__PURE__ */ jsx("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					fontSize: 10,
					textAlign: "center",
					color: "#000000",
					lineHeight: 1.5
				},
				children: /* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 4
					},
					children: [/* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("span", { children: "Les articles doivent être récupérés avant 12h00." }),
							/* @__PURE__ */ jsx("span", {
								style: { color: "rgba(0,0,0,0.3)" },
								children: "|"
							}),
							/* @__PURE__ */ jsx("span", {
								dir: "rtl",
								children: "يجب استلام الملابس قبل الساعة 12:00."
							})
						]
					}), /* @__PURE__ */ jsxs("div", {
						style: {
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: 8,
							flexWrap: "wrap"
						},
						children: [
							/* @__PURE__ */ jsx("span", { children: "Les versements effectués ne sont pas remboursables. · Pièce d'identité obligatoire." }),
							/* @__PURE__ */ jsx("span", {
								style: { color: "rgba(0,0,0,0.3)" },
								children: "|"
							}),
							/* @__PURE__ */ jsx("span", {
								dir: "rtl",
								children: "المبالغ المدفوعة غير قابلة للاسترداد. · بطاقة الهوية إجبارية."
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { LocationsPage as component };
