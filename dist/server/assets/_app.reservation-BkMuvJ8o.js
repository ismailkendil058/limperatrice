import { a as formatDate, c as today, i as formatDA, o as parseMachta, r as useStore, s as serializeMachta } from "./store-C6Z2575g.js";
import { n as Td, r as Th, t as FieldLabel } from "./table-JR-eRzRH.js";
import { i as Modal, n as Drawer, r as EmptyState, t as Badge } from "./ui-kit-DbwqiaUZ.js";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { BookMarked, CheckCircle, CreditCard, Plus, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/_app.reservation.tsx?tsr-split=component
/** Get effective article price (custom or default) */
function getResArticlePrice(res, articleId, defaultPrice) {
	return res.articlePrices?.[articleId] ?? defaultPrice;
}
function ReservationPage() {
	const reservations = useStore((s) => s.reservations);
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const [reservationSearch, setReservationSearch] = useState("");
	const [newOpen, setNewOpen] = useState(false);
	const [openRes, setOpenRes] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Réservations"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setNewOpen(true),
					className: "btn-primary",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Nouvelle réservation"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
					style: { color: "rgba(26,26,26,0.4)" }
				}), /* @__PURE__ */ jsx("input", {
					className: "input-field w-full pl-9",
					placeholder: "Rechercher par client ou article...",
					value: reservationSearch,
					onChange: (e) => setReservationSearch(e.target.value)
				})]
			}),
			(() => {
				const q = reservationSearch.trim().toLowerCase();
				const visible = q ? reservations.filter((r) => {
					const client = clients.find((c) => c.id === r.clientId);
					const machta = parseMachta(r.notes);
					const arts = articles.filter((a) => (r.articleIds ?? []).includes(a.id)).map((a) => a.name).join(", ");
					return `${client?.name ?? ""} ${arts} ${machta.active ? "Service Machta" : ""}`.toLowerCase().includes(q);
				}) : reservations;
				if (visible.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
					icon: /* @__PURE__ */ jsx(BookMarked, { className: "w-12 h-12" }),
					title: q ? "Aucun résultat" : "Aucune réservation en attente",
					cta: "+ Nouvelle réservation",
					onCta: () => setNewOpen(true)
				});
				return /* @__PURE__ */ jsxs("div", {
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
								/* @__PURE__ */ jsx(Th, { children: "Retrait prévu" }),
								/* @__PURE__ */ jsx(Th, { children: "Retour prévu" }),
								/* @__PURE__ */ jsx(Th, { children: "Total" }),
								/* @__PURE__ */ jsx(Th, { children: "Statut" })
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: visible.map((r) => {
							const client = clients.find((c) => c.id === r.clientId);
							const machta = parseMachta(r.notes);
							const arts = articles.filter((a) => (r.articleIds ?? []).includes(a.id)).map((a) => a.name).join(", ") || (machta.active ? "Service Machta" : "Aucun");
							return /* @__PURE__ */ jsxs("tr", {
								onClick: () => setOpenRes(r),
								className: "cursor-pointer hover:bg-[rgba(186, 147, 223,0.04)]",
								style: {
									borderBottom: "1px solid #E5E5E5",
									borderLeft: "3px solid #D4820A"
								},
								children: [
									/* @__PURE__ */ jsx(Td, { children: client?.name }),
									/* @__PURE__ */ jsx(Td, { children: arts }),
									/* @__PURE__ */ jsx(Td, { children: formatDate(r.pickupDate) }),
									/* @__PURE__ */ jsx(Td, { children: formatDate(r.returnDate) }),
									/* @__PURE__ */ jsx(Td, { children: formatDA(r.total) }),
									/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx(Badge, { status: "En attente" }) })
								]
							}, r.id);
						}) })]
					}), /* @__PURE__ */ jsx("div", {
						className: "md:hidden divide-y",
						style: { borderColor: "#E5E5E5" },
						children: visible.map((r) => {
							return /* @__PURE__ */ jsxs("div", {
								onClick: () => setOpenRes(r),
								className: "p-4 flex items-start justify-between gap-3",
								style: { borderLeft: "3px solid #D4820A" },
								children: [/* @__PURE__ */ jsxs("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: clients.find((c) => c.id === r.clientId)?.name
									}), /* @__PURE__ */ jsxs("div", {
										className: "text-xs mt-0.5",
										style: { color: "rgba(26,26,26,0.55)" },
										children: [
											"Retrait ",
											formatDate(r.pickupDate),
											" · ",
											formatDA(r.total)
										]
									})]
								}), /* @__PURE__ */ jsx(Badge, { status: "En attente" })]
							}, r.id);
						})
					})]
				});
			})(),
			newOpen && /* @__PURE__ */ jsx(NewReservationModal, {
				open: newOpen,
				onClose: () => setNewOpen(false)
			}),
			openRes && /* @__PURE__ */ jsx(ReservationDetail, {
				reservationId: openRes.id,
				onClose: () => setOpenRes(null)
			})
		]
	});
}
function NewReservationModal({ open, onClose }) {
	const articles = useStore((s) => s.articles);
	const addClient = useStore((s) => s.addClient);
	const addReservation = useStore((s) => s.addReservation);
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
	const [articleSearch, setArticleSearch] = useState("");
	const [err, setErr] = useState("");
	const [machtaActive, setMachtaActive] = useState(false);
	const [machtaPrice, setMachtaPrice] = useState(0);
	const [versement, setVersement] = useState("");
	const [caution, setCaution] = useState("");
	const total = articles.filter((a) => selArticles.includes(a.id)).reduce((s, a) => s + (customPrices[a.id] ?? a.price), 0) + (machtaActive ? machtaPrice : 0);
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
		if (!versement || Number(versement) <= 0) {
			setErr("Le versement doit être supérieur à 0 DA");
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
			await addReservation({
				clientId: client.id,
				articleIds: selArticles,
				articlePrices,
				pickupDate,
				returnDate,
				occasion,
				total,
				caution: Number(caution) || 0,
				versement: Number(versement),
				versements: [],
				notes: serializeMachta(notes, machtaActive, machtaPrice)
			});
			toast.success("Réservation créée !");
			onClose();
		} catch (e) {
			setErr("Erreur lors de la création de la réservation");
		}
	};
	const availableArts = articles.filter((a) => a.status === "Disponible").filter((a) => !articleSearch.trim() || a.name.toLowerCase().includes(articleSearch.toLowerCase()));
	return /* @__PURE__ */ jsx(Modal, {
		open,
		onClose,
		title: "Nouvelle réservation",
		size: "lg",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-danger",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: submit,
			className: "btn-primary",
			children: "Créer la réservation"
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
										})
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
					title: "4. Versement",
					children: /* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-3",
						children: [/* @__PURE__ */ jsx(FieldLabel, {
							label: "Versement",
							children: /* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx("input", {
									type: "number",
									className: "input-field flex-1",
									placeholder: "Versement minimum : 1 DA",
									value: versement,
									min: 1,
									onChange: (e) => {
										setVersement(e.target.value === "" ? "" : Number(e.target.value));
									}
								}), /* @__PURE__ */ jsx("span", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.45)" },
									children: "DA"
								})]
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
					})
				}),
				/* @__PURE__ */ jsx(Section, {
					title: "5. Récapitulatif",
					children: /* @__PURE__ */ jsxs("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ jsxs("div", {
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
						}), versement !== "" && Number(versement) > 0 && /* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ jsx("span", {
								style: { color: "rgba(26,26,26,0.6)" },
								children: "Reste à payer"
							}), /* @__PURE__ */ jsx("span", {
								style: {
									fontFamily: "Cormorant Garamond, serif",
									fontSize: 18,
									color: "#D4820A"
								},
								children: formatDA(total - Number(versement))
							})]
						})]
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
function ReservationDetail({ reservationId, onClose }) {
	const navigate = useNavigate();
	const reservation = useStore((s) => s.reservations.find((r) => r.id === reservationId));
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const deleteReservation = useStore((s) => s.deleteReservation);
	const validateReservation = useStore((s) => s.validateReservation);
	const addReservationVersement = useStore((s) => s.addReservationVersement);
	const deleteReservationVersement = useStore((s) => s.deleteReservationVersement);
	const isAdmin = useStore((s) => s.auth.role === "admin");
	const [versementOpen, setVersementOpen] = useState(false);
	const [newVersementAmount, setNewVersementAmount] = useState("");
	const [printRes, setPrintRes] = useState(null);
	if (!reservation) return null;
	const client = clients.find((c) => c.id === reservation.clientId);
	const arts = articles.filter((a) => (reservation.articleIds ?? []).includes(a.id));
	const machta = parseMachta(reservation.notes);
	const reservationVersements = reservation.versements ?? [];
	const totalAdditionalVersements = reservationVersements.reduce((sum, v) => sum + Number(v.amount ?? 0), 0);
	const totalVerse = Number(reservation.versement ?? 0) + totalAdditionalVersements;
	const reste = reservation.total - totalVerse;
	const doValidate = async () => {
		if (totalVerse < reservation.total) {
			toast.error(`Le total des versements (${formatDA(totalVerse)}) doit être égal au total (${formatDA(reservation.total)}) pour valider.`);
			return;
		}
		await validateReservation(reservation.id, reservation.total);
		toast.success("Réservation validée — location créée !");
		onClose();
		navigate({ to: "/locations" });
	};
	const doAddVersement = async () => {
		if (!newVersementAmount || Number(newVersementAmount) <= 0) {
			toast.error("Le versement doit être supérieur à 0 DA");
			return;
		}
		await addReservationVersement(reservation.id, {
			date: today(),
			amount: Number(newVersementAmount),
			type: "Versement"
		});
		toast.success("Versement ajouté !");
		setVersementOpen(false);
		setNewVersementAmount("");
	};
	return /* @__PURE__ */ jsxs(Drawer, {
		open: true,
		onClose,
		title: `Réservation · ${client?.name ?? ""}`,
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
						children: [/* @__PURE__ */ jsx(Badge, { status: "En attente" }), /* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ jsx("button", {
									onClick: () => window.print(),
									className: "cursor-pointer p-1.5 rounded-md hover:bg-[rgba(186, 147, 223,0.08)] transition-colors",
									style: { color: "#BA93DF" },
									title: "Imprimer le contrat",
									children: /* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" })
								}),
								/* @__PURE__ */ jsxs("button", {
									onClick: doValidate,
									className: "text-sm flex items-center gap-1.5 cursor-pointer",
									style: {
										color: "#27AE60",
										fontWeight: 500
									},
									children: [/* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4" }), " Valider → Location"]
								}),
								isAdmin && /* @__PURE__ */ jsxs("button", {
									onClick: () => {
										if (confirm("Supprimer cette réservation ?")) {
											deleteReservation(reservation.id);
											toast.success("Réservation supprimée.");
											onClose();
										}
									},
									className: "text-sm flex items-center gap-1.5 cursor-pointer",
									style: { color: "#C0392B" },
									children: [/* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" }), " Supprimer"]
								})
							]
						})]
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Articles",
						children: /* @__PURE__ */ jsxs("ul", {
							className: "space-y-2",
							children: [arts.map((a) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-center justify-between text-sm py-2 border-b",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsx("span", { children: a.name }), /* @__PURE__ */ jsx("span", {
									style: { color: "#BA93DF" },
									children: formatDA(getResArticlePrice(reservation, a.id, a.price))
								})]
							}, a.id)), machta.active && /* @__PURE__ */ jsxs("li", {
								className: "flex items-center justify-between text-sm py-2 border-b",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsx("span", { children: "Service Machta" }), /* @__PURE__ */ jsx("span", {
									style: { color: "#BA93DF" },
									children: formatDA(machta.price)
								})]
							})]
						})
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Dates & occasion",
						children: /* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-3 text-sm",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Retrait prévu"
								}), /* @__PURE__ */ jsx("div", { children: formatDate(reservation.pickupDate) })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Retour prévu"
								}), /* @__PURE__ */ jsx("div", { children: formatDate(reservation.returnDate) })] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.55)" },
									children: "Occasion"
								}), /* @__PURE__ */ jsx("div", { children: reservation.occasion })] })
							]
						})
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "card-surface",
						style: { padding: 20 },
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "section-label mb-3",
								children: "Récapitulatif"
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Cormorant Garamond, serif",
										fontSize: 20
									},
									children: formatDA(reservation.total)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: "Versement initial"
								}), /* @__PURE__ */ jsx("span", {
									style: { color: "#27AE60" },
									children: formatDA(reservation.versement)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm mt-1",
								children: [/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: "Total versements"
								}), /* @__PURE__ */ jsx("span", {
									style: { color: "#27AE60" },
									children: formatDA(totalAdditionalVersements)
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between text-sm mt-1 pt-2 border-t",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsx("span", {
									style: { fontWeight: 600 },
									children: "Reste à payer"
								}), /* @__PURE__ */ jsx("span", {
									style: {
										fontFamily: "Cormorant Garamond, serif",
										fontSize: 18,
										color: reste > 0 ? "#D4820A" : "#27AE60"
									},
									children: formatDA(reste)
								})]
							}),
							machta.cleanNotes && /* @__PURE__ */ jsxs("div", {
								className: "mt-3 text-sm pt-3 border-t",
								style: {
									borderColor: "#E5E5E5",
									color: "rgba(26,26,26,0.65)"
								},
								children: ["Notes : ", machta.cleanNotes]
							})
						]
					}),
					/* @__PURE__ */ jsxs(Section, {
						title: "Historique des versements",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between mb-3",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "text-sm",
								style: { color: "rgba(26,26,26,0.6)" },
								children: [
									reservationVersements.length,
									" versement(s) — ",
									formatDA(totalVerse),
									" versé(s)"
								]
							}), /* @__PURE__ */ jsxs("button", {
								onClick: () => setVersementOpen(true),
								className: "text-sm flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-lg",
								style: {
									color: "#BA93DF",
									border: "1px solid #BA93DF",
									fontWeight: 500
								},
								children: [/* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }), " Ajouter un versement"]
							})]
						}), reservationVersements.length === 0 ? /* @__PURE__ */ jsx("div", {
							className: "text-sm py-3",
							style: { color: "rgba(26,26,26,0.45)" },
							children: "Aucun versement enregistré"
						}) : /* @__PURE__ */ jsx("ul", {
							className: "space-y-2",
							children: reservationVersements.map((v) => /* @__PURE__ */ jsxs("li", {
								className: "flex items-center justify-between text-sm py-2 border-b",
								style: { borderColor: "#E5E5E5" },
								children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: formatDate(v.date)
								}), /* @__PURE__ */ jsx("span", {
									className: "ml-2 text-xs px-2 py-0.5 rounded",
									style: {
										background: "rgba(186, 147, 223,0.08)",
										color: "#BA93DF"
									},
									children: v.type
								})] }), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										style: {
											color: "#27AE60",
											fontWeight: 500
										},
										children: formatDA(v.amount)
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => {
											if (confirm("Supprimer ce versement ?")) {
												deleteReservationVersement(reservation.id, v.id);
												toast.success("Versement supprimé.");
											}
										},
										className: "cursor-pointer",
										style: { color: "#C0392B" },
										children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
									})]
								})]
							}, v.id))
						})]
					}),
					/* @__PURE__ */ jsx(Section, {
						title: "Client",
						children: /* @__PURE__ */ jsxs("div", {
							className: "text-sm space-y-1",
							children: [
								/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("strong", { children: client?.name }) }),
								/* @__PURE__ */ jsx("div", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: client?.phone
								}),
								client?.address && /* @__PURE__ */ jsx("div", {
									style: { color: "rgba(26,26,26,0.6)" },
									children: client.address
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: versementOpen,
				onClose: () => setVersementOpen(false),
				title: "Ajouter un versement",
				size: "sm",
				footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setVersementOpen(false),
					className: "btn-danger",
					children: "Annuler"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: doAddVersement,
					className: "btn-primary flex items-center gap-1.5",
					children: [/* @__PURE__ */ jsx(CreditCard, { className: "w-4 h-4" }), " Enregistrer"]
				})] }),
				children: /* @__PURE__ */ jsx("div", {
					className: "space-y-4 py-2",
					children: /* @__PURE__ */ jsx(FieldLabel, {
						label: "Montant (DA)",
						children: /* @__PURE__ */ jsx("input", {
							type: "number",
							className: "input-field",
							value: newVersementAmount || "",
							placeholder: "Montant",
							min: 1,
							onChange: (e) => setNewVersementAmount(e.target.value === "" ? "" : Number(e.target.value))
						})
					})
				})
			}),
			reservation && /* @__PURE__ */ jsx("div", {
				className: "print-area",
				style: { display: "none" },
				children: /* @__PURE__ */ jsx(PrintReservationContract, { reservation })
			}),
			/* @__PURE__ */ jsx("style", { children: `@media print { .print-area { display: block !important; } }` })
		]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
		className: "section-label mb-3",
		children: title
	}), children] });
}
function PrintReservationContract({ reservation }) {
	const clients = useStore((s) => s.clients);
	const articles = useStore((s) => s.articles);
	const client = clients.find((c) => c.id === reservation.clientId);
	const arts = articles.filter((a) => (reservation.articleIds ?? []).includes(a.id));
	const machta = parseMachta(reservation.notes);
	const totalAdditionalVersements = (reservation.versements ?? []).reduce((sum, v) => sum + Number(v.amount ?? 0), 0);
	const totalVerse = Number(reservation.versement ?? 0) + totalAdditionalVersements;
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
					children: "Contrat de réservation"
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
						children: formatDA(getResArticlePrice(reservation, a.id, a.price))
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
				children: [
					/* @__PURE__ */ jsxs("div", { children: ["Retrait : ", formatDate(reservation.pickupDate)] }),
					/* @__PURE__ */ jsxs("div", { children: ["Retour prévu : ", formatDate(reservation.returnDate)] }),
					/* @__PURE__ */ jsxs("div", { children: ["Occasion : ", reservation.occasion] })
				]
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
					/* @__PURE__ */ jsxs("div", { children: ["Total : ", /* @__PURE__ */ jsx("strong", { children: formatDA(reservation.total) })] }),
					/* @__PURE__ */ jsxs("div", { children: ["Versé : ", formatDA(totalVerse)] }),
					/* @__PURE__ */ jsxs("div", { children: ["Reste : ", /* @__PURE__ */ jsx("strong", {
						style: { color: "#BA93DF" },
						children: formatDA(reservation.total - totalVerse)
					})] }),
					reservation.caution > 0 && /* @__PURE__ */ jsxs("div", { children: ["Caution : ", /* @__PURE__ */ jsx("strong", { children: formatDA(reservation.caution) })] })
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 32 },
				children: ["Signature client : _________________________   Date : ", formatDate(reservation.pickupDate)]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					fontSize: 10,
					textAlign: "center",
					color: "rgba(26,26,26,0.55)",
					lineHeight: 1.5
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
						/* @__PURE__ */ jsx("span", { children: "Les versements effectués ne sont pas remboursables. · Pièce d'identité obligatoire." }),
						/* @__PURE__ */ jsx("span", {
							style: { color: "rgba(26,26,26,0.3)" },
							children: "|"
						}),
						/* @__PURE__ */ jsx("span", {
							dir: "rtl",
							children: "المبالغ المدفوعة غير قابلة للاسترداد. · بطاقة الهوية إجبارية."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: 8,
						borderTop: "1px solid #E5E5E5",
						paddingTop: 8,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8
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
						/* @__PURE__ */ jsx("span", {
							style: { color: "rgba(26,26,26,0.3)" },
							children: "·"
						}),
						/* @__PURE__ */ jsx("span", { children: "Contact : 0793 39 88 37" })
					]
				})]
			})
		]
	});
}
//#endregion
export { ReservationPage as component };
