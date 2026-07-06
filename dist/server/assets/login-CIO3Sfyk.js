import { r as useStore } from "./store-C6Z2575g.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Delete } from "lucide-react";
//#region src/routes/login.tsx?tsr-split=component
function LoginPage() {
	const navigate = useNavigate();
	const allEmployees = useStore((s) => s.employees);
	const employees = useMemo(() => allEmployees.filter((e) => e.active), [allEmployees]);
	const loginEmployee = useStore((s) => s.loginEmployee);
	useEffect(() => {
		if (employees.length === 0) useStore.getState().loadEmployees();
	}, []);
	const [selectedId, setSelectedId] = useState(employees[0]?.id ?? "");
	const [pin, setPin] = useState("");
	const [shake, setShake] = useState(false);
	useEffect(() => {
		if (!selectedId && employees.length > 0) setSelectedId(employees[0].id);
	}, [employees, selectedId]);
	useEffect(() => {
		const triggerLogin = async () => {
			if (pin.length === 4) if (!await loginEmployee(selectedId, pin)) {
				setShake(true);
				setTimeout(() => {
					setShake(false);
					setPin("");
				}, 600);
			} else navigate({ to: "/stock" });
		};
		triggerLogin();
	}, [
		pin,
		selectedId,
		loginEmployee
	]);
	const press = (d) => setPin((p) => p.length < 4 ? p + d : p);
	const back = () => setPin((p) => p.slice(0, -1));
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex flex-col items-center justify-center bg-white px-4 py-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "w-full max-w-[400px] card-surface",
			style: { padding: "40px" },
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "text-center mb-8",
					children: [/* @__PURE__ */ jsx("div", {
						className: "brand-name",
						style: { fontSize: 28 },
						children: "L'impératrice"
					}), /* @__PURE__ */ jsx("div", {
						className: "mt-2 text-xs",
						style: { color: "rgba(26,26,26,0.55)" },
						children: "Espace employé"
					})]
				}),
				/* @__PURE__ */ jsx("label", {
					className: "block text-xs font-semibold uppercase tracking-wider mb-2",
					style: { color: "#BA93DF" },
					children: "Choisir un employé"
				}),
				/* @__PURE__ */ jsx("select", {
					value: selectedId,
					onChange: (e) => {
						setSelectedId(e.target.value);
						setPin("");
					},
					className: "input-field mb-6",
					children: employees.map((e) => /* @__PURE__ */ jsx("option", {
						value: e.id,
						children: e.name
					}, e.id))
				}),
				/* @__PURE__ */ jsx("div", {
					className: `flex justify-center gap-3 mb-6 ${shake ? "animate-shake" : ""}`,
					children: [
						0,
						1,
						2,
						3
					].map((i) => /* @__PURE__ */ jsx("span", {
						className: "inline-block rounded-full",
						style: {
							width: 14,
							height: 14,
							background: pin.length > i ? "#BA93DF" : "transparent",
							border: "1.5px solid #BA93DF"
						}
					}, i))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "grid grid-cols-3 gap-3",
					children: [
						"1",
						"2",
						"3",
						"4",
						"5",
						"6",
						"7",
						"8",
						"9",
						"",
						"0",
						"⌫"
					].map((k, i) => k === "" ? /* @__PURE__ */ jsx("div", {}, i) : /* @__PURE__ */ jsx("button", {
						onClick: () => k === "⌫" ? back() : press(k),
						className: "h-14 rounded-[10px] border text-xl font-normal transition-all hover:bg-[rgba(186, 147, 223,0.06)] active:bg-[#BA93DF] active:text-[#1A1A1A]",
						style: { borderColor: "#E5E5E5" },
						children: k === "⌫" ? /* @__PURE__ */ jsx(Delete, { className: "inline w-5 h-5" }) : k
					}, i))
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-4",
					children: /* @__PURE__ */ jsx("a", {
						href: "/admin",
						className: "text-xs",
						style: { color: "rgba(26,26,26,0.55)" },
						children: "Espace administration"
					})
				})
			]
		})
	});
}
//#endregion
export { LoginPage as component };
