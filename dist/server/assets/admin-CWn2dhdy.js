import { r as useStore } from "./store-C6Z2575g.js";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, EyeOff, Loader2 } from "lucide-react";
//#region src/routes/admin.tsx?tsr-split=component
function AdminLogin() {
	const navigate = useNavigate();
	const loginAdmin = useStore((s) => s.loginAdmin);
	const role = useStore((s) => s.auth.role);
	const [pwd, setPwd] = useState("");
	const [show, setShow] = useState(false);
	const [err, setErr] = useState(false);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		if (role === "admin") navigate({ to: "/dashboard" });
		else if (role === "employee") navigate({ to: "/stock" });
	}, [role]);
	const submit = async (e) => {
		e.preventDefault();
		if (!pwd.trim()) return;
		setLoading(true);
		try {
			if (!await loginAdmin(pwd)) {
				setErr(true);
				setTimeout(() => setErr(false), 1500);
			}
		} catch {
			setErr(true);
			setTimeout(() => setErr(false), 1500);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ jsx("div", {
		className: "min-h-screen flex items-center justify-center bg-white px-4 py-12",
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
						children: "Administration"
					})]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: submit,
					children: [
						/* @__PURE__ */ jsx("label", {
							className: "block text-xs font-semibold uppercase tracking-wider mb-2",
							style: { color: "#BA93DF" },
							children: "Mot de passe"
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx("input", {
								type: show ? "text" : "password",
								value: pwd,
								onChange: (e) => setPwd(e.target.value),
								className: `input-field pr-12 ${err ? "animate-shake" : ""}`,
								style: err ? { borderColor: "#C0392B" } : void 0,
								placeholder: "••••••••",
								autoFocus: true,
								disabled: loading
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setShow(!show),
								className: "absolute right-3 top-1/2 -translate-y-1/2",
								style: { color: "#BA93DF" },
								"aria-label": show ? "Masquer" : "Afficher",
								children: show ? /* @__PURE__ */ jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Eye, { className: "w-4 h-4" })
							})]
						}),
						err && /* @__PURE__ */ jsx("p", {
							className: "text-xs mt-2",
							style: { color: "#C0392B" },
							children: "Mot de passe incorrect"
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							className: "btn-primary w-full justify-center mt-6",
							disabled: loading,
							children: loading ? /* @__PURE__ */ jsxs("span", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Loader2, { className: "w-4 h-4 animate-spin" }), "Vérification…"]
							}) : "Accéder"
						})
					]
				}),
				/* @__PURE__ */ jsx("div", {
					className: "text-center mt-4",
					children: /* @__PURE__ */ jsx("a", {
						href: "/login",
						className: "text-xs",
						style: { color: "rgba(26,26,26,0.55)" },
						children: "Espace employé"
					})
				})
			]
		})
	});
}
//#endregion
export { AdminLogin as component };
