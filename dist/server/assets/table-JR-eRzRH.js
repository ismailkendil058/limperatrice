import "react";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/routes/_components/table.tsx
function Th({ children, style }) {
	return /* @__PURE__ */ jsx("th", {
		className: "text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider",
		style: {
			color: "rgba(26,26,26,0.6)",
			...style
		},
		children
	});
}
function Td({ children, style }) {
	return /* @__PURE__ */ jsx("td", {
		className: "py-4 px-4",
		style,
		children
	});
}
function FieldLabel({ label, children }) {
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
export { Td as n, Th as r, FieldLabel as t };
