import { a as formatDate, i as formatDA, l as supabase, r as useStore } from "./store-C6Z2575g.js";
import { i as Modal, n as Drawer, r as EmptyState, t as Badge } from "./ui-kit-DbwqiaUZ.js";
import { createElement, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { MoreVertical, Package, Plus, Search, X } from "lucide-react";
//#region src/routes/_app.stock.tsx?tsr-split=component
function formatDateShort(d) {
	if (!d) return "";
	return new Date(d).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
}
var CATS = [
	"Tous",
	"Tenues",
	"Accessoires"
];
var STATUSES = [
	"Tous",
	"Disponible",
	"Loué",
	"En entretien"
];
function StockPage() {
	const articles = useStore((s) => s.articles);
	const addArticle = useStore((s) => s.addArticle);
	const updateArticle = useStore((s) => s.updateArticle);
	const deleteArticle = useStore((s) => s.deleteArticle);
	const reservations = useStore((s) => s.reservations);
	const clients = useStore((s) => s.clients);
	const [cat, setCat] = useState("Tous");
	const [stat, setStat] = useState("Tous");
	const [search, setSearch] = useState("");
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [editing, setEditing] = useState(null);
	const [menuFor, setMenuFor] = useState(null);
	const [infoOpen, setInfoOpen] = useState(false);
	const [selectedReservation, setSelectedReservation] = useState(null);
	const [noteModalOpen, setNoteModalOpen] = useState(false);
	const [noteArticle, setNoteArticle] = useState(null);
	const [noteMessage, setNoteMessage] = useState("");
	const addNote = useStore((s) => s.addNote);
	const q = search.trim().toLowerCase();
	const filtered = articles.filter((a) => {
		if (!a) return false;
		if (cat !== "Tous" && a.category !== cat) return false;
		if (stat !== "Tous" && a.status !== stat) return false;
		if (q) return `${a.name} ${a.category} ${a.size ?? ""} ${a.color ?? ""}`.toLowerCase().includes(q);
		return true;
	});
	const openCreate = () => {
		setEditing(null);
		setDrawerOpen(true);
	};
	const openEdit = (a) => {
		setEditing(a);
		setDrawerOpen(true);
		setMenuFor(null);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Stock"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: openCreate,
					className: "btn-primary",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Ajouter un article"]
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ jsx(Search, {
						className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
						style: { color: "rgba(26,26,26,0.4)" }
					}),
					/* @__PURE__ */ jsx("input", {
						className: "input-field w-full",
						style: {
							paddingLeft: 36,
							paddingRight: search ? 36 : void 0
						},
						placeholder: "Rechercher un article...",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					}),
					search && /* @__PURE__ */ jsx("button", {
						onClick: () => setSearch(""),
						className: "absolute right-3 top-1/2 -translate-y-1/2 p-0.5",
						"aria-label": "Effacer",
						children: /* @__PURE__ */ jsx(X, {
							className: "w-4 h-4",
							style: { color: "rgba(26,26,26,0.4)" }
						})
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ jsx(PillRow, {
					items: CATS,
					value: cat,
					onChange: setCat
				}), /* @__PURE__ */ jsx(PillRow, {
					items: STATUSES,
					value: stat,
					onChange: setStat
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {
				icon: /* @__PURE__ */ jsx(Package, { className: "w-12 h-12" }),
				title: "Aucun article pour l'instant",
				cta: "+ Ajouter un article",
				onCta: openCreate
			}) : /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5",
				children: filtered.map((a) => /* @__PURE__ */ jsxs("div", {
					className: "card-surface",
					style: { padding: 16 },
					onClick: () => {
						setSelectedReservation(reservations.find((r) => (r.articleIds ?? []).includes(a.id)) || null);
						setInfoOpen(true);
					},
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "rounded-lg mb-3 flex items-center justify-center text-white",
							style: {
								aspectRatio: "4/3",
								background: a.photo?.startsWith("http") ? `url(${a.photo}) center/cover no-repeat` : a.photo ?? "#BA93DF",
								fontFamily: "Cormorant Garamond, serif",
								fontStyle: "italic",
								fontSize: 32
							},
							children: !a.photo?.startsWith("http") && a.name[0]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-medium text-[15px] truncate",
									children: a.name
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-xs mt-0.5",
									style: { color: "rgba(26,26,26,0.55)" },
									children: [
										a.category,
										a.size ? ` · ${a.size}` : "",
										a.color ? ` · ${a.color}` : ""
									]
								})]
							}), /* @__PURE__ */ jsxs("div", {
								className: "relative",
								children: [/* @__PURE__ */ jsx("button", {
									onClick: (e) => {
										e.stopPropagation();
										setMenuFor(menuFor === a.id ? null : a.id);
									},
									className: "p-1 -mr-1",
									"aria-label": "Menu",
									children: /* @__PURE__ */ jsx(MoreVertical, { className: "w-4 h-4" })
								}), menuFor === a.id && /* @__PURE__ */ jsxs("div", {
									className: "absolute right-0 top-7 z-10 bg-white border rounded-lg shadow-lg w-44 py-1",
									style: { borderColor: "#E5E5E5" },
									children: [
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.stopPropagation();
												openEdit(a);
											},
											className: "w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]",
											children: "Modifier"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.stopPropagation();
												setMenuFor(null);
												if (a.status === "En entretien") updateArticle(a.id, { status: "Disponible" });
												else {
													setNoteArticle(a);
													setNoteMessage("");
													setNoteModalOpen(true);
												}
											},
											className: "w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]",
											children: a.status === "En entretien" ? "Marquer disponible" : "Marquer indisponible"
										}),
										/* @__PURE__ */ jsx("button", {
											onClick: (e) => {
												e.stopPropagation();
												if (confirm("Supprimer cet article ?")) deleteArticle(a.id);
												setMenuFor(null);
											},
											className: "w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]",
											style: { color: "#C0392B" },
											children: "Supprimer"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3",
							style: {
								fontSize: 16,
								fontWeight: 500,
								color: "#BA93DF"
							},
							children: formatDA(a.price)
						}),
						/* @__PURE__ */ jsx("div", {
							className: "mt-3 flex justify-end",
							children: /* @__PURE__ */ jsx(Badge, { status: a.status })
						})
					]
				}, a.id))
			}),
			/* @__PURE__ */ jsx(ArticleDrawer, {
				open: drawerOpen,
				onClose: () => setDrawerOpen(false),
				article: editing,
				onSave: (data) => {
					if (editing) updateArticle(editing.id, data);
					else addArticle(data);
					setDrawerOpen(false);
				}
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: noteModalOpen,
				onClose: () => setNoteModalOpen(false),
				title: "Note d'indisponibilité",
				footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setNoteModalOpen(false),
					className: "btn-danger",
					children: "Annuler"
				}), /* @__PURE__ */ jsx("button", {
					className: "btn-primary",
					onClick: async () => {
						if (!noteArticle) return;
						await updateArticle(noteArticle.id, { status: "En entretien" });
						const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
						await addNote({
							articleId: noteArticle.id,
							articleName: noteArticle.name,
							message: noteMessage.trim(),
							date: today
						});
						setNoteModalOpen(false);
						setNoteArticle(null);
						setNoteMessage("");
					},
					children: "Enregistrer"
				})] }),
				children: /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "text-sm",
							style: { color: "rgba(26,26,26,0.6)" },
							children: ["Article : ", /* @__PURE__ */ jsx("strong", { children: noteArticle?.name })]
						}),
						/* @__PURE__ */ jsxs("label", {
							className: "block",
							children: [/* @__PURE__ */ jsx("span", {
								className: "block text-xs font-semibold uppercase tracking-wider mb-1.5",
								style: { color: "#BA93DF" },
								children: "Note (optionnel)"
							}), /* @__PURE__ */ jsx("textarea", {
								className: "input-field w-full",
								rows: 3,
								placeholder: "Raison de l'indisponibilité...",
								value: noteMessage,
								onChange: (e) => setNoteMessage(e.target.value)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "text-xs",
							style: { color: "rgba(26,26,26,0.4)" },
							children: ["Date : ", formatDateShort((/* @__PURE__ */ new Date()).toISOString().slice(0, 10))]
						})
					]
				})
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: infoOpen,
				onClose: () => setInfoOpen(false),
				title: selectedReservation ? "Réservation" : "Disponibilité",
				children: selectedReservation ? /* @__PURE__ */ jsxs("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("strong", { children: "Client:" }),
						" ",
						clients.find((c) => c.id === selectedReservation.clientId)?.name ?? "Inconnu"
					] }), /* @__PURE__ */ jsxs("div", { children: [
						/* @__PURE__ */ jsx("strong", { children: "Période:" }),
						" ",
						formatDate(selectedReservation.pickupDate),
						" → ",
						formatDate(selectedReservation.returnDate)
					] })]
				}) : /* @__PURE__ */ jsx("div", { children: "Ce produit n'est pas réservé." })
			})
		]
	});
}
function PillRow({ items, value, onChange }) {
	return /* @__PURE__ */ jsx("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: items.map((it) => {
			const active = it === value;
			return /* @__PURE__ */ jsx("button", {
				onClick: () => onChange(it),
				className: "pill whitespace-nowrap transition-colors",
				style: {
					background: active ? "#BA93DF" : "transparent",
					color: active ? "#1A1A1A" : "rgba(26,26,26,0.6)",
					border: active ? "1px solid #BA93DF" : "1px solid #E5E5E5",
					padding: "6px 14px",
					fontSize: 13
				},
				children: it
			}, it);
		})
	});
}
function ArticleDrawer(props) {
	if (!props.open) return null;
	return /* @__PURE__ */ createElement(ArticleDrawerInner, {
		...props,
		key: props.article?.id ?? "new"
	});
}
function ArticleDrawerInner({ open, onClose, article, onSave }) {
	const PURPLES = [
		"#BA93DF",
		"#9B5BA5",
		"#B884C0",
		"#D4B0D9",
		"#5E2A66"
	];
	const [form, setForm] = useState(() => article ?? {
		name: "",
		category: "Tenues",
		size: "",
		color: "",
		price: "",
		caution: 0,
		status: "Disponible",
		notes: "",
		photo: PURPLES[Math.floor(Math.random() * PURPLES.length)]
	});
	async function compressImage(file) {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = (event) => {
				const img = new Image();
				img.src = event.target?.result;
				img.onload = () => {
					const canvas = document.createElement("canvas");
					const MAX_WIDTH = 800;
					const scaleSize = MAX_WIDTH / img.width;
					canvas.width = MAX_WIDTH;
					canvas.height = img.height * scaleSize;
					canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob((blob) => resolve(blob), "image/jpeg", .7);
				};
			};
		});
	}
	return /* @__PURE__ */ jsx(Drawer, {
		open,
		onClose,
		title: article ? "Modifier l'article" : "Nouvel article",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-danger",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: async () => {
				if (form.__newImageFile) {
					const file = form.__newImageFile;
					const compressed = await compressImage(file);
					const filePath = `article-${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
					const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, compressed);
					if (uploadError) {
						console.error("Image upload failed", uploadError);
						alert("Failed to upload image");
						return;
					}
					const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
					form.photo = data.publicUrl;
				}
				const { __newImageFile, ...cleanForm } = form;
				cleanForm.price = cleanForm.price === "" || cleanForm.price == null ? 0 : Number(cleanForm.price);
				cleanForm.caution = 0;
				onSave(cleanForm);
			},
			className: "btn-primary",
			children: "Enregistrer"
		})] }),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ jsx(Field, {
					label: "Nom",
					children: /* @__PURE__ */ jsx("input", {
						className: "input-field",
						value: form.name,
						onChange: (e) => setForm({
							...form,
							name: e.target.value
						})
					})
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ jsx(Field, {
						label: "Catégorie",
						children: /* @__PURE__ */ jsxs("select", {
							className: "input-field",
							value: form.category,
							onChange: (e) => setForm({
								...form,
								category: e.target.value
							}),
							children: [/* @__PURE__ */ jsx("option", { children: "Tenues" }), /* @__PURE__ */ jsx("option", { children: "Accessoires" })]
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: "Image",
						children: /* @__PURE__ */ jsx("input", {
							type: "file",
							accept: "image/*",
							className: "input-field",
							onChange: (e) => {
								const file = e.target.files?.[0];
								if (file) setForm((prev) => ({
									...prev,
									__newImageFile: file
								}));
							}
						})
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ jsx(Field, {
						label: "Taille",
						children: /* @__PURE__ */ jsx("input", {
							className: "input-field",
							value: form.size ?? "",
							onChange: (e) => setForm({
								...form,
								size: e.target.value
							})
						})
					}), /* @__PURE__ */ jsx(Field, {
						label: "Couleur",
						children: /* @__PURE__ */ jsx("input", {
							className: "input-field",
							value: form.color ?? "",
							onChange: (e) => setForm({
								...form,
								color: e.target.value
							})
						})
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-1 gap-3",
					children: /* @__PURE__ */ jsx(Field, {
						label: "Prix location (DA)",
						children: /* @__PURE__ */ jsx("input", {
							type: "number",
							className: "input-field",
							value: form.price,
							onChange: (e) => setForm({
								...form,
								price: e.target.value
							})
						})
					})
				})
			]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "block",
		children: [/* @__PURE__ */ jsx("span", {
			className: "block text-xs font-semibold uppercase tracking-wider mb-1.5",
			style: { color: "#BA93DF" },
			children: label
		}), children]
	});
}
//#endregion
export { StockPage as component };
