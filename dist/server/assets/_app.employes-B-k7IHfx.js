import { r as useStore } from "./store-C6Z2575g.js";
import { n as Td, r as Th, t as FieldLabel } from "./table-JR-eRzRH.js";
import { i as Modal } from "./ui-kit-DbwqiaUZ.js";
import { useRef, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Plus } from "lucide-react";
//#region src/routes/_app.employes.tsx?tsr-split=component
function EmployeesPage() {
	const employees = useStore((s) => s.employees);
	const addEmployee = useStore((s) => s.addEmployee);
	const updateEmployeePin = useStore((s) => s.updateEmployeePin);
	const toggleEmployee = useStore((s) => s.toggleEmployee);
	const [addOpen, setAddOpen] = useState(false);
	const [editingPinFor, setEditingPinFor] = useState(null);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: [/* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Employés"
				}), /* @__PURE__ */ jsxs("button", {
					onClick: () => setAddOpen(true),
					className: "btn-primary",
					children: [/* @__PURE__ */ jsx(Plus, { className: "w-4 h-4" }), " Ajouter un employé"]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "card-surface",
				style: { padding: 0 },
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
						style: {
							borderBottom: "2px solid #E5E5E5",
							background: "#FAFAFA"
						},
						children: [
							/* @__PURE__ */ jsx(Th, {
								style: { width: "40%" },
								children: "Nom"
							}),
							/* @__PURE__ */ jsx(Th, {
								style: { width: "20%" },
								children: "PIN"
							}),
							/* @__PURE__ */ jsx(Th, {
								style: { width: "20%" },
								children: "Statut"
							}),
							/* @__PURE__ */ jsx(Th, {
								style: {
									width: "20%",
									textAlign: "right"
								},
								children: "Actions"
							})
						]
					}) }), /* @__PURE__ */ jsx("tbody", { children: employees.map((e) => /* @__PURE__ */ jsxs("tr", {
						style: { borderBottom: "1px solid #E5E5E5" },
						children: [
							/* @__PURE__ */ jsx(Td, { children: e.name }),
							/* @__PURE__ */ jsx(Td, {
								style: { letterSpacing: "0.15em" },
								children: "••••"
							}),
							/* @__PURE__ */ jsx(Td, { children: /* @__PURE__ */ jsx("span", {
								className: "pill",
								style: {
									background: e.active ? "rgba(186, 147, 223,0.10)" : "#E5E5E5",
									color: e.active ? "#BA93DF" : "rgba(26,26,26,0.6)"
								},
								children: e.active ? "Actif" : "Désactivé"
							}) }),
							/* @__PURE__ */ jsx(Td, {
								style: { textAlign: "right" },
								children: /* @__PURE__ */ jsxs("div", {
									className: "flex gap-4 justify-end text-sm",
									children: [/* @__PURE__ */ jsx("button", {
										onClick: () => setEditingPinFor(e.id),
										className: "cursor-pointer font-medium hover:underline",
										style: { color: "#BA93DF" },
										children: "Modifier le PIN"
									}), /* @__PURE__ */ jsx("button", {
										onClick: () => toggleEmployee(e.id),
										className: "cursor-pointer hover:underline",
										style: { color: "rgba(26,26,26,0.6)" },
										children: e.active ? "Désactiver" : "Activer"
									})]
								})
							})
						]
					}, e.id)) })]
				})
			}),
			addOpen && /* @__PURE__ */ jsx(AddEmployeeModal, {
				onClose: () => setAddOpen(false),
				onSubmit: (n, p) => {
					addEmployee(n, p);
					setAddOpen(false);
				}
			}),
			editingPinFor && /* @__PURE__ */ jsx(EditPinModal, {
				onClose: () => setEditingPinFor(null),
				onSubmit: (p) => {
					updateEmployeePin(editingPinFor, p);
					setEditingPinFor(null);
				}
			})
		]
	});
}
function PinInput({ value, onChange }) {
	const refs = useRef([]);
	const digits = value.padEnd(4, " ").slice(0, 4).split("");
	return /* @__PURE__ */ jsx("div", {
		className: "flex gap-2 justify-center",
		children: digits.map((d, i) => /* @__PURE__ */ jsx("input", {
			ref: (el) => {
				refs.current[i] = el;
			},
			maxLength: 1,
			value: d.trim(),
			onChange: (e) => {
				const c = e.target.value.replace(/\D/g, "").slice(-1);
				const arr = value.padEnd(4, " ").split("");
				arr[i] = c || " ";
				onChange(arr.join("").trimEnd());
				if (c && i < 3) refs.current[i + 1]?.focus();
			},
			onKeyDown: (e) => {
				if (e.key === "Backspace" && !digits[i].trim() && i > 0) refs.current[i - 1]?.focus();
			},
			className: "text-center text-lg",
			style: {
				width: 48,
				height: 56,
				border: "1px solid #E5E5E5",
				borderRadius: 8,
				fontFamily: "Montserrat"
			},
			inputMode: "numeric"
		}, i))
	});
}
function AddEmployeeModal({ onClose, onSubmit }) {
	const [name, setName] = useState("");
	const [pin, setPin] = useState("");
	const valid = name.trim() && pin.length === 4;
	return /* @__PURE__ */ jsx(Modal, {
		open: true,
		onClose,
		title: "Nouvel employé",
		size: "sm",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-danger",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: () => valid && onSubmit(name.trim(), pin),
			className: "btn-primary",
			disabled: !valid,
			children: "Créer"
		})] }),
		children: /* @__PURE__ */ jsxs("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ jsx(FieldLabel, {
				label: "Nom complet",
				children: /* @__PURE__ */ jsx("input", {
					className: "input-field",
					value: name,
					onChange: (e) => setName(e.target.value)
				})
			}), /* @__PURE__ */ jsx(FieldLabel, {
				label: "PIN à 4 chiffres",
				children: /* @__PURE__ */ jsx(PinInput, {
					value: pin,
					onChange: setPin
				})
			})]
		})
	});
}
function EditPinModal({ onClose, onSubmit }) {
	const [pin, setPin] = useState("");
	return /* @__PURE__ */ jsx(Modal, {
		open: true,
		onClose,
		title: "Modifier le PIN",
		size: "sm",
		footer: /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("button", {
			onClick: onClose,
			className: "btn-danger",
			children: "Annuler"
		}), /* @__PURE__ */ jsx("button", {
			onClick: () => pin.length === 4 && onSubmit(pin),
			className: "btn-primary",
			disabled: pin.length !== 4,
			children: "Mettre à jour"
		})] }),
		children: /* @__PURE__ */ jsx(FieldLabel, {
			label: "Nouveau PIN à 4 chiffres",
			children: /* @__PURE__ */ jsx(PinInput, {
				value: pin,
				onChange: setPin
			})
		})
	});
}
//#endregion
export { EmployeesPage as component };
