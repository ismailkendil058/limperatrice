import { useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { X } from "lucide-react";
//#region src/components/ui-kit.tsx
function Drawer({ open, onClose, title, children, footer }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		if (open) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex",
		onClick: onClose,
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0",
			style: { background: "rgba(0,0,0,0.25)" }
		}), /* @__PURE__ */ jsxs("div", {
			className: "relative ml-auto h-full w-full max-w-[480px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-200 lg:rounded-l-2xl",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between px-6 py-5 border-b",
					style: { borderColor: "#E5E5E5" },
					children: [/* @__PURE__ */ jsx("h2", {
						className: "text-lg font-medium",
						style: {
							fontFamily: "Cormorant Garamond, serif",
							fontSize: 22
						},
						children: title
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						"aria-label": "Fermer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 overflow-y-auto p-6",
					children
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "px-6 py-4 border-t flex justify-end gap-3",
					style: { borderColor: "#E5E5E5" },
					children: footer
				})
			]
		})]
	});
}
function Modal({ open, onClose, title, children, footer, size = "md" }) {
	useEffect(() => {
		const onKey = (e) => e.key === "Escape" && onClose();
		if (open) document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open, onClose]);
	if (!open) return null;
	const widths = {
		sm: "max-w-[400px]",
		md: "max-w-[560px]",
		lg: "max-w-[720px]"
	}[size];
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center px-4",
		onClick: onClose,
		children: [/* @__PURE__ */ jsx("div", {
			className: "absolute inset-0",
			style: { background: "rgba(0,0,0,0.25)" }
		}), /* @__PURE__ */ jsxs("div", {
			className: `relative w-full ${widths} bg-white rounded-2xl shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 fade-in duration-200`,
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between px-6 py-5 border-b",
					style: { borderColor: "#E5E5E5" },
					children: [/* @__PURE__ */ jsx("h2", {
						style: {
							fontFamily: "Cormorant Garamond, serif",
							fontSize: 22,
							fontWeight: 500
						},
						children: title
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						"aria-label": "Fermer",
						children: /* @__PURE__ */ jsx(X, { className: "w-5 h-5" })
					})]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "flex-1 overflow-y-auto p-6",
					children
				}),
				footer && /* @__PURE__ */ jsx("div", {
					className: "px-6 py-4 border-t flex justify-end gap-3",
					style: { borderColor: "#E5E5E5" },
					children: footer
				})
			]
		})]
	});
}
function Badge({ status }) {
	const s = {
		"Disponible": {
			bg: "rgba(186, 147, 223,0.10)",
			color: "#BA93DF"
		},
		"Loué": {
			bg: "#E5E5E5",
			color: "rgba(26,26,26,0.7)"
		},
		"En entretien": {
			bg: "#FFF8EC",
			color: "#D4820A"
		},
		"En cours": {
			bg: "rgba(186, 147, 223,0.10)",
			color: "#BA93DF"
		},
		"À venir": {
			bg: "#FFF8EC",
			color: "#D4820A"
		},
		"Rendue": {
			bg: "#F0FAF4",
			color: "#27AE60"
		},
		"En retard": {
			bg: "#FEF0F0",
			color: "#C0392B"
		},
		"Soldé": {
			bg: "#F0FAF4",
			color: "#27AE60"
		},
		"En attente": {
			bg: "#FFF8EC",
			color: "#D4820A"
		}
	}[status] ?? {
		bg: "#E5E5E5",
		color: "#1A1A1A"
	};
	return /* @__PURE__ */ jsx("span", {
		className: "pill",
		style: {
			background: s.bg,
			color: s.color
		},
		children: status
	});
}
function EmptyState({ title, cta, onCta, icon }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "card-surface text-center",
		style: { padding: 64 },
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex justify-center mb-4",
				style: { color: "rgba(186, 147, 223,0.3)" },
				children: icon
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-sm mb-4",
				style: { color: "rgba(26,26,26,0.6)" },
				children: title
			}),
			cta && /* @__PURE__ */ jsx("button", {
				onClick: onCta,
				className: "btn-primary",
				children: cta
			})
		]
	});
}
//#endregion
export { Modal as i, Drawer as n, EmptyState as r, Badge as t };
