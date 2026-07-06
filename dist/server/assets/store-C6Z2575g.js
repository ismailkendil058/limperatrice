import { create } from "zustand";
import { createClient } from "@supabase/supabase-js";
var supabase = createClient("https://ksyypmkipkqrcjvvgkpz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzeXlwbWtpcGtxcmNqdnZna3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4ODEwOTEsImV4cCI6MjA5NzQ1NzA5MX0.pnvsU7LU77GJ_nJayqqOpE0GSo7iNUOQFa03N6QhxPM");
//#endregion
//#region src/lib/api.ts
/** Helper to handle errors – logs context then re-throws */
function handleError(error, context) {
	const msg = context ? `Supabase error [${context}]` : "Supabase error";
	console.error(msg, error?.message ?? error);
	if (error?.hint) console.error("Hint:", error.hint);
	if (error?.details) console.error("Details:", error.details);
	throw error;
}
var CAMEL_TO_SNAKE = {
	clientId: "client_id",
	pickupDate: "pickup_date",
	returnDate: "return_date",
	actualReturnDate: "actual_return_date",
	cautionReturned: "caution_returned",
	createdAt: "created_at",
	updatedAt: "updated_at",
	locationId: "location_id",
	clientName: "client_name",
	clientPhone: "client_phone",
	savedAt: "saved_at",
	articleId: "article_id",
	articleName: "article_name"
};
var SNAKE_TO_CAMEL = Object.fromEntries(Object.entries(CAMEL_TO_SNAKE).map(([c, s]) => [s, c]));
function remap(obj, map) {
	const out = {};
	for (const [k, v] of Object.entries(obj)) out[map[k] ?? k] = v;
	return out;
}
/** App (camelCase) → DB (snake_case) */
function toDB(obj) {
	return remap(obj, CAMEL_TO_SNAKE);
}
/** DB (snake_case) → App (camelCase) */
function fromDB(obj) {
	return remap(obj, SNAKE_TO_CAMEL);
}
/** Remove keys that don't correspond to DB columns */
function omit(obj, keys) {
	const out = {};
	for (const [k, v] of Object.entries(obj)) if (!keys.includes(k)) out[k] = v;
	return out;
}
/** Fields that live in junction / child tables – must be stripped before parent insert */
var LOCATION_EXTRA = [
	"articleIds",
	"articlePrices",
	"versements"
];
var ARTICLE_EXTRA = ["title"];
async function getArticles() {
	const { data, error } = await supabase.from("articles").select("*");
	if (error) handleError(error);
	return (data ?? []).map((r) => fromDB(r));
}
async function createArticle(article) {
	const payload = toDB(omit(article, ARTICLE_EXTRA));
	const { data, error } = await supabase.from("articles").insert(payload).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function updateArticle(id, updates) {
	const payload = toDB(omit(updates, ARTICLE_EXTRA));
	const { data, error } = await supabase.from("articles").update(payload).eq("id", id).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteArticle(id) {
	const { error } = await supabase.from("articles").delete().eq("id", id);
	if (error) handleError(error);
}
async function getClients() {
	const { data, error } = await supabase.from("clients").select("*");
	if (error) handleError(error);
	return (data ?? []).map((r) => fromDB(r));
}
async function createClient$1(client) {
	const payload = toDB({
		...client,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const { data, error } = await supabase.from("clients").insert(payload).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function updateClient(id, updates) {
	const payload = toDB(updates);
	const { data, error } = await supabase.from("clients").update(payload).eq("id", id).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteClient(id) {
	const { error } = await supabase.from("clients").delete().eq("id", id);
	if (error) handleError(error);
}
async function getEmployees() {
	const { data, error } = await supabase.from("employees").select("*");
	if (error) handleError(error);
	return (data ?? []).map((r) => fromDB(r));
}
async function createEmployee(emp) {
	const payload = toDB(emp);
	const { data, error } = await supabase.from("employees").insert(payload).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function updateEmployee(id, updates) {
	const payload = toDB(updates);
	const { data, error } = await supabase.from("employees").update(payload).eq("id", id).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteEmployee(id) {
	const { error } = await supabase.from("employees").delete().eq("id", id);
	if (error) handleError(error);
}
async function getLocations() {
	const { data, error } = await supabase.from("locations").select("*");
	if (error) handleError(error);
	const locations = (data ?? []).map((r) => fromDB(r));
	if (locations.length === 0) return locations;
	const locationIds = locations.map((l) => l.id);
	const { data: allJunctionRows, error: jErr } = await supabase.from("location_articles").select("location_id, article_id, custom_price").in("location_id", locationIds);
	if (jErr) handleError(jErr);
	const junctionByLoc = {};
	for (const row of allJunctionRows ?? []) {
		if (!junctionByLoc[row.location_id]) junctionByLoc[row.location_id] = [];
		junctionByLoc[row.location_id].push(row);
	}
	for (const loc of locations) {
		const rows = junctionByLoc[loc.id] ?? [];
		const articleIds = rows.map((r) => r.article_id);
		const articlePricesMap = {};
		for (const row of rows) if (row.custom_price != null) articlePricesMap[row.article_id] = Number(row.custom_price);
		loc.articleIds = articleIds;
		if (Object.keys(articlePricesMap).length > 0) loc.articlePrices = articlePricesMap;
	}
	return locations;
}
async function createLocation(loc) {
	const { articleIds, articlePrices, initialPayment, versements: _vers, ...rest } = loc;
	const base = toDB({
		...rest,
		status: "En cours",
		createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const { data: inserted, error } = await supabase.from("locations").insert(base).select().single();
	if (error) handleError(error);
	if (articleIds && articleIds.length) {
		const junction = articleIds.map((aid) => ({
			location_id: inserted.id,
			article_id: aid
		}));
		const { error: jErr } = await supabase.from("location_articles").insert(junction);
		if (jErr) handleError(jErr);
	}
	if (initialPayment && initialPayment > 0) await supabase.from("versements").insert({
		id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10),
		location_id: inserted.id,
		date: loc.pickupDate,
		amount: loc.initialPayment,
		type: "Versement"
	});
	const saved = fromDB(inserted);
	saved.articleIds = articleIds ?? [];
	if (articlePrices) saved.articlePrices = articlePrices;
	return saved;
}
async function updateLocation(id, updates) {
	const payload = toDB(omit(updates, LOCATION_EXTRA));
	const { data, error } = await supabase.from("locations").update(payload).eq("id", id).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteLocation(id) {
	const { error } = await supabase.from("locations").delete().eq("id", id);
	if (error) handleError(error);
}
async function addVersement(locId, verse) {
	const payload = {
		...verse,
		id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
	};
	const { data, error } = await supabase.from("versements").insert({
		...payload,
		location_id: locId
	}).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteVersement(locId, verseId) {
	const { error } = await supabase.from("versements").delete().eq("id", verseId).eq("location_id", locId);
	if (error) handleError(error);
}
async function addReservationVersement(resId, verse) {
	const payload = {
		...verse,
		id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
	};
	const { data, error } = await supabase.from("reservation_versements").insert({
		...payload,
		reservation_id: resId
	}).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteReservationVersement(resId, verseId) {
	const { error } = await supabase.from("reservation_versements").delete().eq("id", verseId).eq("reservation_id", resId);
	if (error) handleError(error);
}
async function getReservations() {
	const { data, error } = await supabase.from("reservations").select("*");
	if (error) handleError(error);
	const reservations = (data ?? []).map((r) => fromDB(r));
	if (reservations.length === 0) return reservations;
	const resIds = reservations.map((r) => r.id);
	const [articlesResult, versementsResult] = await Promise.all([supabase.from("reservation_articles").select("reservation_id, article_id, custom_price").in("reservation_id", resIds), supabase.from("reservation_versements").select("*").in("reservation_id", resIds).order("date", { ascending: false })]);
	if (articlesResult.error) handleError(articlesResult.error);
	if (versementsResult.error) handleError(versementsResult.error);
	const articlesByRes = {};
	for (const row of articlesResult.data ?? []) {
		if (!articlesByRes[row.reservation_id]) articlesByRes[row.reservation_id] = [];
		articlesByRes[row.reservation_id].push(row);
	}
	const versementsByRes = {};
	for (const row of versementsResult.data ?? []) {
		if (!versementsByRes[row.reservation_id]) versementsByRes[row.reservation_id] = [];
		versementsByRes[row.reservation_id].push(row);
	}
	for (const res of reservations) {
		const rows = articlesByRes[res.id] ?? [];
		const articleIds = rows.map((r) => r.article_id);
		const articlePricesMap = {};
		for (const row of rows) if (row.custom_price != null) articlePricesMap[row.article_id] = Number(row.custom_price);
		res.articleIds = articleIds;
		if (Object.keys(articlePricesMap).length > 0) res.articlePrices = articlePricesMap;
		res.versements = (versementsByRes[res.id] ?? []).map((v) => fromDB(v));
	}
	return reservations;
}
async function createReservation(res) {
	const { articleIds, articlePrices, versements: _vers, ...rest } = res;
	const payload = toDB({
		...rest,
		createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const { data, error } = await supabase.from("reservations").insert(payload).select().single();
	if (error) handleError(error);
	if (articleIds && articleIds.length) {
		const junction = articleIds.map((aid) => ({
			reservation_id: data.id,
			article_id: aid,
			custom_price: articlePrices?.[aid] ?? null
		}));
		const { error: jErr } = await supabase.from("reservation_articles").insert(junction);
		if (jErr) handleError(jErr);
	}
	const saved = fromDB(data);
	saved.articleIds = articleIds ?? [];
	if (articlePrices) saved.articlePrices = articlePrices;
	return saved;
}
async function deleteReservation(id) {
	await supabase.from("reservation_articles").delete().eq("reservation_id", id);
	await supabase.from("reservation_versements").delete().eq("reservation_id", id);
	const { error } = await supabase.from("reservations").delete().eq("id", id);
	if (error) handleError(error);
}
async function getSavedContracts() {
	const { data, error } = await supabase.from("saved_contracts").select("*");
	if (error) handleError(error);
	const contracts = (data ?? []).map((r) => fromDB(r));
	if (contracts.length === 0) return contracts;
	const contractIds = contracts.map((c) => c.id);
	const { data: allArticles, error: artsErr } = await supabase.from("saved_contract_articles").select("saved_contract_id, name, price").in("saved_contract_id", contractIds);
	if (artsErr) handleError(artsErr);
	const articlesByContract = {};
	for (const row of allArticles ?? []) {
		if (!articlesByContract[row.saved_contract_id]) articlesByContract[row.saved_contract_id] = [];
		articlesByContract[row.saved_contract_id].push({
			name: row.name,
			price: Number(row.price)
		});
	}
	for (const contract of contracts) contract.articles = articlesByContract[contract.id] ?? [];
	return contracts;
}
async function saveContract(contract) {
	const { articles, ...rest } = contract;
	const payload = toDB({
		...rest,
		savedAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
	});
	const { data, error } = await supabase.from("saved_contracts").insert(payload).select().single();
	if (error) handleError(error);
	if (articles && articles.length) {
		const articleRows = articles.map((a) => ({
			saved_contract_id: data.id,
			name: a.name,
			price: a.price
		}));
		const { error: aErr } = await supabase.from("saved_contract_articles").insert(articleRows);
		if (aErr) handleError(aErr);
	}
	const saved = fromDB(data);
	saved.articles = articles ?? [];
	return saved;
}
async function deleteSavedContract(id) {
	const { error } = await supabase.from("saved_contracts").delete().eq("id", id);
	if (error) handleError(error);
}
/** Fetch only employees (used on login page) */
async function loadEmployees() {
	return getEmployees();
}
/** Fetch all data in parallel (used on app start) */
async function loadAllData() {
	const [articles, clients, employees, locations, reservations, savedContracts] = await Promise.all([
		getArticles(),
		getClients(),
		getEmployees(),
		getLocations(),
		getReservations(),
		getSavedContracts()
	]);
	return {
		articles,
		clients,
		employees,
		locations,
		reservations,
		savedContracts
	};
}
/** Delete reservation and all related data (used after validation) */
async function deleteReservationFull(id) {
	await supabase.from("reservation_articles").delete().eq("reservation_id", id);
	await supabase.from("reservation_versements").delete().eq("reservation_id", id);
	const { error } = await supabase.from("reservations").delete().eq("id", id);
	if (error) handleError(error);
}
async function getNotes() {
	const { data, error } = await supabase.from("notes").select("*").order("created_at", { ascending: false });
	if (error) handleError(error);
	return (data ?? []).map((r) => fromDB(r));
}
async function createNote(note) {
	const payload = toDB({
		...note,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	});
	const { data, error } = await supabase.from("notes").insert(payload).select().single();
	if (error) handleError(error);
	return fromDB(data);
}
async function deleteNote(id) {
	const { error } = await supabase.from("notes").delete().eq("id", id);
	if (error) handleError(error);
}
var api_default = {
	getArticles,
	createArticle,
	updateArticle,
	deleteArticle,
	getClients,
	createClient: createClient$1,
	updateClient,
	deleteClient,
	getEmployees,
	createEmployee,
	updateEmployee,
	deleteEmployee,
	getLocations,
	createLocation,
	updateLocation,
	deleteLocation,
	addVersement,
	deleteVersement,
	addReservationVersement,
	deleteReservationVersement,
	getReservations,
	createReservation,
	deleteReservation,
	deleteReservationFull,
	getSavedContracts,
	saveContract,
	deleteSavedContract,
	loadAllData,
	loadEmployees,
	getNotes,
	createNote,
	deleteNote
};
//#endregion
//#region src/lib/format.ts
function formatDA(value) {
	return Math.round(value || 0).toLocaleString("fr-FR").replace(/\u202f/g, " ") + " DA";
}
function formatDate(iso) {
	if (!iso) return "—";
	return new Date(iso).toLocaleDateString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric"
	});
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function parseMachta(notes) {
	if (!notes) return {
		active: false,
		price: 0,
		cleanNotes: ""
	};
	const regex = /\[Service Machta:\s*(\d+)(?:\s*DA)?\]/;
	const match = notes.match(regex);
	if (match) return {
		active: true,
		price: parseInt(match[1], 10) || 0,
		cleanNotes: notes.replace(regex, "").trim()
	};
	return {
		active: false,
		price: 0,
		cleanNotes: notes.trim()
	};
}
function serializeMachta(cleanNotes, active, price) {
	const trimmed = (cleanNotes || "").trim();
	if (!active) return trimmed;
	const tag = `[Service Machta: ${price} DA]`;
	return trimmed ? `${trimmed}\n${tag}` : tag;
}
//#endregion
//#region src/lib/store.ts
/** Calculate remaining amount for a location */
var locReste = (loc) => {
	return Number(loc.total ?? 0) - (loc.versements ?? []).reduce((sum, v) => sum + Number(v.amount ?? 0), 0);
};
/** Calculate total versements amount for a location */
var locVerse = (loc) => {
	return (loc.versements ?? []).reduce((sum, v) => sum + Number(v.amount ?? 0), 0);
};
var useStore = create((set, get) => ({
	auth: {
		role: null,
		employeeName: null
	},
	articles: [],
	clients: [],
	locations: [],
	employees: [],
	reservations: [],
	savedContracts: [],
	notes: [],
	pendingNewLocationClientId: null,
	pendingOpenLocationId: null,
	setPendingNewLocation: (id) => set({ pendingNewLocationClientId: id }),
	setPendingOpenLocation: (id) => set({ pendingOpenLocationId: id }),
	loginEmployee: async (id, pin) => {
		const emp = get().employees.find((e) => e.id === id && e.active);
		if (emp && emp.pin === pin) {
			set({ auth: {
				role: "employee",
				employeeName: emp.name
			} });
			return true;
		}
		return false;
	},
	loginAdmin: async (password) => {
		const { data, error } = await supabase.from("admin").select("password").limit(1).single();
		if (error || !data) {
			console.error("Failed to fetch admin password", error);
			return false;
		}
		if (password === data.password) {
			set({ auth: {
				role: "admin",
				employeeName: "Administratrice"
			} });
			return true;
		}
		return false;
	},
	loginEmployeeDemo: () => {
		set({ auth: {
			role: "employee",
			employeeName: get().employees.filter((e) => e.active)[0]?.name ?? "Employé Démo"
		} });
	},
	loginAdminDemo: () => {
		set({ auth: {
			role: "admin",
			employeeName: "Administratrice"
		} });
	},
	logout: () => set({ auth: {
		role: null,
		employeeName: null
	} }),
	loadAllData: async () => {
		const data = await api_default.loadAllData();
		set({
			articles: data.articles,
			clients: data.clients,
			employees: data.employees,
			locations: data.locations,
			reservations: data.reservations,
			savedContracts: data.savedContracts
		});
	},
	loadEmployees: async () => {
		set({ employees: await api_default.loadEmployees() });
	},
	reloadArticles: async () => {
		set({ articles: await api_default.getArticles() });
	},
	reloadClients: async () => {
		set({ clients: await api_default.getClients() });
	},
	reloadEmployees: async () => {
		set({ employees: await api_default.getEmployees() });
	},
	reloadLocations: async () => {
		set({ locations: await api_default.getLocations() });
	},
	reloadReservations: async () => {
		set({ reservations: await api_default.getReservations() });
	},
	reloadSavedContracts: async () => {
		set({ savedContracts: await api_default.getSavedContracts() });
	},
	reloadNotes: async () => {
		set({ notes: await api_default.getNotes() });
	},
	addArticle: async (a) => {
		const article = await api_default.createArticle(a);
		set((s) => ({ articles: [...s.articles, article] }));
	},
	updateArticle: async (id, a) => {
		const updated = await api_default.updateArticle(id, a);
		set((s) => ({ articles: s.articles.map((x) => x.id === id ? updated : x) }));
	},
	deleteArticle: async (id) => {
		await api_default.deleteArticle(id);
		set((s) => ({ articles: s.articles.filter((x) => x.id !== id) }));
	},
	addClient: async (c) => {
		const client = await api_default.createClient(c);
		set((s) => ({ clients: [...s.clients, client] }));
		return client;
	},
	updateClient: async (id, c) => {
		const updated = await api_default.updateClient(id, c);
		set((s) => ({ clients: s.clients.map((x) => x.id === id ? updated : x) }));
	},
	deleteClient: async (id) => {
		await api_default.deleteClient(id);
		set((s) => ({ clients: s.clients.filter((x) => x.id !== id) }));
	},
	addLocation: async (l) => {
		const loc = await api_default.createLocation(l);
		for (const aid of l.articleIds ?? []) {
			const article = get().articles.find((a) => a.id === aid);
			if (article && article.status === "Disponible") {
				const updated = await api_default.updateArticle(aid, { status: "Loué" });
				set((s) => ({ articles: s.articles.map((a) => a.id === aid ? updated : a) }));
			}
		}
		set((s) => ({ locations: [...s.locations, loc] }));
	},
	updateLocation: async (id, updates) => {
		const updated = await api_default.updateLocation(id, updates);
		set((s) => ({ locations: s.locations.map((l) => l.id === id ? updated : l) }));
	},
	deleteLocation: async (id) => {
		const loc = get().locations.find((l) => l.id === id);
		if (loc && loc.status !== "Rendue") for (const aid of loc.articleIds ?? []) {
			const article = get().articles.find((a) => a.id === aid);
			if (article && article.status === "Loué") {
				const artUpdated = await api_default.updateArticle(aid, { status: "Disponible" });
				set((s) => ({ articles: s.articles.map((a) => a.id === aid ? artUpdated : a) }));
			}
		}
		const contracts = get().savedContracts.filter((c) => c.locationId === id);
		for (const c of contracts) await api_default.deleteSavedContract(c.id);
		await api_default.deleteLocation(id);
		set((s) => ({
			locations: s.locations.filter((l) => l.id !== id),
			savedContracts: s.savedContracts.filter((c) => c.locationId !== id)
		}));
	},
	addVersement: async (locId, v) => {
		const verse = await api_default.addVersement(locId, v);
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? {
			...l,
			versements: [...l.versements, verse]
		} : l) }));
	},
	deleteVersement: async (locId, verseId) => {
		await api_default.deleteVersement(locId, verseId);
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? {
			...l,
			versements: l.versements.filter((v) => v.id !== verseId)
		} : l) }));
	},
	markReturned: async (locId, returnDate) => {
		const loc = get().locations.find((l) => l.id === locId);
		if (!loc) return;
		const updated = {
			...loc,
			actualReturnDate: returnDate,
			status: "Rendue"
		};
		await api_default.updateLocation(locId, updated);
		for (const aid of loc.articleIds ?? []) {
			const article = get().articles.find((a) => a.id === aid);
			if (article && article.status === "Loué") {
				const artUpdated = await api_default.updateArticle(aid, { status: "Disponible" });
				set((s) => ({ articles: s.articles.map((a) => a.id === aid ? artUpdated : a) }));
			}
		}
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? updated : l) }));
	},
	markCautionReturned: async (locId) => {
		const loc = get().locations.find((l) => l.id === locId);
		if (!loc) return;
		const updated = {
			...loc,
			cautionReturned: true
		};
		await api_default.updateLocation(locId, updated);
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? updated : l) }));
	},
	updateLocationNotes: async (locId, notes) => {
		const loc = get().locations.find((l) => l.id === locId);
		if (!loc) return;
		const updated = {
			...loc,
			notes
		};
		await api_default.updateLocation(locId, updated);
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? updated : l) }));
	},
	updateLocationArticlePrices: async (locId, articlePrices) => {
		const loc = get().locations.find((l) => l.id === locId);
		if (!loc) return;
		const updated = {
			...loc,
			articlePrices
		};
		await api_default.updateLocation(locId, updated);
		set((s) => ({ locations: s.locations.map((l) => l.id === locId ? updated : l) }));
	},
	addEmployee: async (name, pin) => {
		const emp = await api_default.createEmployee({
			name,
			pin,
			active: true
		});
		set((s) => ({ employees: [...s.employees, emp] }));
	},
	updateEmployeePin: async (id, pin) => {
		const emp = await api_default.updateEmployee(id, { pin });
		set((s) => ({ employees: s.employees.map((e) => e.id === id ? emp : e) }));
	},
	toggleEmployee: async (id) => {
		const emp = get().employees.find((e) => e.id === id);
		if (!emp) return;
		const updated = await api_default.updateEmployee(id, { active: !emp.active });
		set((s) => ({ employees: s.employees.map((e) => e.id === id ? updated : e) }));
	},
	saveContract: async (locId) => {
		const loc = get().locations.find((l) => l.id === locId);
		if (!loc) return;
		const client = get().clients.find((c) => c.id === loc.clientId);
		const articles = get().articles.filter((a) => (loc.articleIds ?? []).includes(a.id));
		const verse = locVerse(loc);
		const reste = locReste(loc);
		const machta = parseMachta(loc.notes);
		const contractArticles = articles.map((a) => ({
			name: a.name,
			price: loc.articlePrices?.[a.id] ?? a.price
		}));
		if (machta.active) contractArticles.push({
			name: "Service Machta",
			price: machta.price
		});
		const payload = {
			locationId: loc.id,
			clientId: loc.clientId,
			clientName: client?.name ?? "Inconnu",
			clientPhone: client?.phone ?? "",
			pickupDate: loc.pickupDate,
			returnDate: loc.returnDate,
			total: loc.total,
			caution: loc.caution ?? 0,
			verse,
			reste,
			notes: machta.cleanNotes,
			articles: contractArticles
		};
		const saved = await api_default.saveContract(payload);
		set((s) => ({ savedContracts: [...s.savedContracts, saved] }));
	},
	deleteSavedContract: async (id) => {
		await api_default.deleteSavedContract(id);
		set((s) => ({ savedContracts: s.savedContracts.filter((c) => c.id !== id) }));
	},
	loadSavedContracts: async () => {
		set({ savedContracts: await api_default.getSavedContracts() });
	},
	loadNotes: async () => {
		set({ notes: await api_default.getNotes() });
	},
	addNote: async (n) => {
		const note = await api_default.createNote(n);
		set((s) => ({ notes: [note, ...s.notes] }));
	},
	deleteNote: async (id) => {
		await api_default.deleteNote(id);
		set((s) => ({ notes: s.notes.filter((n) => n.id !== id) }));
	},
	addReservation: async (r) => {
		const reservation = await api_default.createReservation(r);
		set((s) => ({ reservations: [...s.reservations, reservation] }));
	},
	deleteReservation: async (id) => {
		await api_default.deleteReservation(id);
		set((s) => ({ reservations: s.reservations.filter((r) => r.id !== id) }));
	},
	addReservationVersement: async (resId, v) => {
		const verse = await api_default.addReservationVersement(resId, v);
		set((s) => ({ reservations: s.reservations.map((r) => r.id === resId ? {
			...r,
			versements: [...r.versements ?? [], verse]
		} : r) }));
	},
	deleteReservationVersement: async (resId, verseId) => {
		await api_default.deleteReservationVersement(resId, verseId);
		set((s) => ({ reservations: s.reservations.map((r) => r.id === resId ? {
			...r,
			versements: (r.versements ?? []).filter((v) => v.id !== verseId)
		} : r) }));
	},
	validateReservation: async (id, initialPayment) => {
		const reservation = get().reservations.find((r) => r.id === id);
		if (!reservation) return;
		const payload = {
			clientId: reservation.clientId,
			articleIds: reservation.articleIds,
			articlePrices: reservation.articlePrices,
			pickupDate: reservation.pickupDate,
			returnDate: reservation.returnDate,
			occasion: reservation.occasion,
			total: reservation.total,
			caution: reservation.caution ?? 0,
			initialPayment,
			versements: [],
			notes: reservation.notes
		};
		const loc = await api_default.createLocation(payload);
		await api_default.deleteReservationFull(id);
		for (const aid of reservation.articleIds ?? []) {
			const article = get().articles.find((a) => a.id === aid);
			if (article && article.status === "Disponible") {
				const updated = await api_default.updateArticle(aid, { status: "Loué" });
				set((s) => ({ articles: s.articles.map((a) => a.id === aid ? updated : a) }));
			}
		}
		set((s) => ({
			locations: [...s.locations, loc],
			reservations: s.reservations.filter((r) => r.id !== id)
		}));
	}
}));
//#endregion
export { formatDate as a, today as c, formatDA as i, supabase as l, locVerse as n, parseMachta as o, useStore as r, serializeMachta as s, locReste as t };
