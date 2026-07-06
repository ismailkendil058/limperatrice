import { useEffect } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, redirect, useRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//#region src/styles.css?url
var styles_default = "/assets/styles-DjgxM-Sk.css";
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-white px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-7xl",
					style: {
						fontFamily: "Cormorant Garamond, serif",
						color: "#BA93DF"
					},
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-4 text-xl font-medium",
					children: "Page introuvable"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm",
					style: { color: "rgba(26,26,26,0.55)" },
					children: "Cette page n'existe pas ou a été déplacée."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/login",
						className: "btn-primary",
						children: "Retour à l'accueil"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-white px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold",
					children: "Une erreur est survenue"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm",
					style: { color: "rgba(26,26,26,0.55)" },
					children: "Veuillez réessayer."
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: /* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "btn-primary",
						children: "Réessayer"
					})
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "L'impératrice" },
			{
				name: "description",
				content: "Système de gestion de locations de tenues traditionnelles et bijoux."
			},
			{
				name: "theme-color",
				content: "#BA93DF"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				name: "apple-mobile-web-app-title",
				content: "L'impératrice"
			},
			{
				name: "msapplication-TileColor",
				content: "#BA93DF"
			},
			{
				name: "msapplication-tap-highlight",
				content: "no"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "application-name",
				content: "L'impératrice"
			}
		],
		links: [
			{
				rel: "manifest",
				href: "/manifest.json"
			},
			{
				rel: "icon",
				href: "/BR-01.png",
				type: "image/png",
				sizes: "96x96"
			},
			{
				rel: "icon",
				href: "/BR-01.png",
				type: "image/png",
				sizes: "128x128"
			},
			{
				rel: "icon",
				href: "/BR-01.png",
				type: "image/png",
				sizes: "192x192"
			},
			{
				rel: "icon",
				href: "/BR-01.png",
				type: "image/png",
				sizes: "512x512"
			},
			{
				rel: "shortcut icon",
				href: "/BR-01.png",
				type: "image/png"
			},
			{
				rel: "apple-touch-icon",
				href: "/BR-01.png",
				sizes: "180x180"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@400;500;600;700&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "fr",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", { children: [children, /* @__PURE__ */ jsx(Scripts, {})] })]
	});
}
function ServiceWorkerRegistration() {
	useEffect(() => {
		if ("serviceWorker" in navigator) window.addEventListener("load", () => {
			navigator.serviceWorker.register("/sw.js").then((registration) => {
				console.log("SW registered with scope:", registration.scope);
			}).catch((error) => {
				console.error("SW registration failed:", error);
			});
		});
	}, []);
	return null;
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ jsxs(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ jsx(ServiceWorkerRegistration, {}), /* @__PURE__ */ jsx(Outlet, {})]
	});
}
//#endregion
//#region src/routes/login.tsx
var $$splitComponentImporter$10 = () => import("./login-CIO3Sfyk.js");
var Route$11 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$9 = () => import("./admin-CWn2dhdy.js");
var Route$10 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/_app.tsx
var $$splitComponentImporter$8 = () => import("./_app-CEyCO_T4.js");
var Route$9 = createFileRoute("/_app")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/index.tsx
var Route$8 = createFileRoute("/")({ beforeLoad: () => {
	throw redirect({ to: "/login" });
} });
//#endregion
//#region src/routes/_app.stock.tsx
var $$splitComponentImporter$7 = () => import("./_app.stock-BcQTm03v.js");
var Route$7 = createFileRoute("/_app/stock")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/_app.reservation.tsx
var $$splitComponentImporter$6 = () => import("./_app.reservation-BkMuvJ8o.js");
var Route$6 = createFileRoute("/_app/reservation")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
/** Get effective article price (custom or default) */
//#endregion
//#region src/routes/_app.notes.tsx
var $$splitComponentImporter$5 = () => import("./_app.notes-DoT5puqa.js");
var Route$5 = createFileRoute("/_app/notes")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
//#endregion
//#region src/routes/_app.locations.tsx
var $$splitComponentImporter$4 = () => import("./_app.locations-BYgveljZ.js");
/** Get the effective price for an article in a location (custom override or default) */
var Route$4 = createFileRoute("/_app/locations")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
//#endregion
//#region src/routes/_app.employes.tsx
var $$splitComponentImporter$3 = () => import("./_app.employes-B-k7IHfx.js");
var Route$3 = createFileRoute("/_app/employes")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/_app.dashboard.tsx
var $$splitComponentImporter$2 = () => import("./_app.dashboard-C5fZ-u6v.js");
var Route$2 = createFileRoute("/_app/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/_app.contract.tsx
var $$splitComponentImporter$1 = () => import("./_app.contract-NJHUrngx.js");
var Route$1 = createFileRoute("/_app/contract")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/_app.caisse.tsx
var $$splitComponentImporter = () => import("./_app.caisse-6DJKGPx4.js");
var Route = createFileRoute("/_app/caisse")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var LoginRoute = Route$11.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$12
});
var AdminRoute = Route$10.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$12
});
var AppRoute = Route$9.update({
	id: "/_app",
	getParentRoute: () => Route$12
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var AppStockRoute = Route$7.update({
	id: "/stock",
	path: "/stock",
	getParentRoute: () => AppRoute
});
var AppReservationRoute = Route$6.update({
	id: "/reservation",
	path: "/reservation",
	getParentRoute: () => AppRoute
});
var AppNotesRoute = Route$5.update({
	id: "/notes",
	path: "/notes",
	getParentRoute: () => AppRoute
});
var AppLocationsRoute = Route$4.update({
	id: "/locations",
	path: "/locations",
	getParentRoute: () => AppRoute
});
var AppEmployesRoute = Route$3.update({
	id: "/employes",
	path: "/employes",
	getParentRoute: () => AppRoute
});
var AppDashboardRoute = Route$2.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AppRoute
});
var AppContractRoute = Route$1.update({
	id: "/contract",
	path: "/contract",
	getParentRoute: () => AppRoute
});
var AppRouteChildren = {
	AppCaisseRoute: Route.update({
		id: "/caisse",
		path: "/caisse",
		getParentRoute: () => AppRoute
	}),
	AppContractRoute,
	AppDashboardRoute,
	AppEmployesRoute,
	AppLocationsRoute,
	AppNotesRoute,
	AppReservationRoute,
	AppStockRoute
};
var rootRouteChildren = {
	IndexRoute,
	AppRoute: AppRoute._addFileChildren(AppRouteChildren),
	AdminRoute,
	LoginRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
