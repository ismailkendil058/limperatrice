import { r as useStore } from "./store-C6Z2575g.js";
import { i as Modal } from "./ui-kit-DbwqiaUZ.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Calendar, Search, Trash2, X } from "lucide-react";
//#region src/routes/_app.notes.tsx?tsr-split=component
function formatDateShort(d) {
	if (!d) return "";
	return new Date(d).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
}
function NotesPage() {
	const notes = useStore((s) => s.notes);
	const loadNotes = useStore((s) => s.loadNotes);
	const deleteNote = useStore((s) => s.deleteNote);
	const [search, setSearch] = useState("");
	const [dateFilter, setDateFilter] = useState("");
	const [confirmDelete, setConfirmDelete] = useState(null);
	useEffect(() => {
		loadNotes();
	}, [loadNotes]);
	const q = search.trim().toLowerCase();
	const filtered = notes.filter((n) => {
		if (q) {
			if (!`${n.articleName} ${n.message}`.toLowerCase().includes(q)) return false;
		}
		if (dateFilter && n.date !== dateFilter) return false;
		return true;
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: /* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Notes d'indisponibilité"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "relative flex-1 min-w-[200px]",
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
								placeholder: "Rechercher par article ou note...",
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
						className: "relative",
						children: [/* @__PURE__ */ jsx(Calendar, {
							className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
							style: { color: "rgba(26,26,26,0.4)" }
						}), /* @__PURE__ */ jsx("input", {
							type: "date",
							className: "input-field",
							style: { paddingLeft: 36 },
							value: dateFilter,
							onChange: (e) => setDateFilter(e.target.value),
							"aria-label": "Filtrer par date"
						})]
					}),
					dateFilter && /* @__PURE__ */ jsx("button", {
						onClick: () => setDateFilter(""),
						className: "text-xs",
						style: { color: "#BA93DF" },
						children: "Réinitialiser"
					})
				]
			}),
			filtered.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "card-surface text-center",
				style: { padding: 64 },
				children: /* @__PURE__ */ jsx("div", {
					className: "text-sm",
					style: { color: "rgba(26,26,26,0.6)" },
					children: notes.length === 0 ? "Aucune note d'indisponibilité pour le moment." : "Aucune note ne correspond à votre recherche."
				})
			}) : /* @__PURE__ */ jsx("div", {
				className: "space-y-3",
				children: filtered.map((note) => /* @__PURE__ */ jsx(NoteCard, {
					note,
					onDelete: () => setConfirmDelete(note.id)
				}, note.id))
			}),
			/* @__PURE__ */ jsx(Modal, {
				open: !!confirmDelete,
				onClose: () => setConfirmDelete(null),
				title: "Supprimer la note",
				size: "sm",
				footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
					onClick: () => setConfirmDelete(null),
					className: "btn-danger",
					children: "Annuler"
				}), /* @__PURE__ */ jsx("button", {
					className: "btn-primary",
					style: { background: "#C0392B" },
					onClick: async () => {
						if (confirmDelete) {
							await deleteNote(confirmDelete);
							setConfirmDelete(null);
						}
					},
					children: "Supprimer"
				})] }),
				children: /* @__PURE__ */ jsx("p", {
					className: "text-sm",
					style: { color: "rgba(26,26,26,0.6)" },
					children: "Êtes-vous sûr de vouloir supprimer cette note ?"
				})
			})
		]
	});
}
function NoteCard({ note, onDelete }) {
	return /* @__PURE__ */ jsx("div", {
		className: "card-surface",
		style: { padding: 16 },
		children: /* @__PURE__ */ jsxs("div", {
			className: "flex items-start justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex-1 min-w-0",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center gap-2 flex-wrap",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-medium text-[15px]",
							children: note.articleName
						}), /* @__PURE__ */ jsx("span", {
							className: "text-xs px-2 py-0.5 rounded-full",
							style: {
								background: "#FFF8EC",
								color: "#D4820A"
							},
							children: formatDateShort(note.date)
						})]
					}),
					note.message ? /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-sm",
						style: { color: "rgba(26,26,26,0.65)" },
						children: note.message
					}) : /* @__PURE__ */ jsx("p", {
						className: "mt-2 text-xs italic",
						style: { color: "rgba(26,26,26,0.35)" },
						children: "Aucune note détaillée"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-2 text-xs",
						style: { color: "rgba(26,26,26,0.35)" },
						children: ["Créée le ", formatDateShort(note.createdAt)]
					})
				]
			}), /* @__PURE__ */ jsx("button", {
				onClick: onDelete,
				className: "p-1.5 rounded-lg hover:bg-[rgba(192,57,43,0.06)] shrink-0",
				style: { color: "#C0392B" },
				"aria-label": "Supprimer",
				children: /* @__PURE__ */ jsx(Trash2, { className: "w-4 h-4" })
			})]
		})
	});
}
//#endregion
export { NotesPage as component };
