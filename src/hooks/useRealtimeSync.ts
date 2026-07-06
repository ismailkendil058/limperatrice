// src/hooks/useRealtimeSync.ts
// Replaces the setInterval polling in _app.tsx with Supabase Realtime subscriptions.
// Each table change triggers only the minimal targeted reload instead of fetching all data.

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useStore } from "@/lib/store";

export function useRealtimeSync() {
  const reloadArticles      = useStore((s) => s.reloadArticles);
  const reloadClients       = useStore((s) => s.reloadClients);
  const reloadEmployees     = useStore((s) => s.reloadEmployees);
  const reloadLocations     = useStore((s) => s.reloadLocations);
  const reloadReservations  = useStore((s) => s.reloadReservations);
  const reloadSavedContracts = useStore((s) => s.reloadSavedContracts);
  const reloadNotes         = useStore((s) => s.reloadNotes);

  useEffect(() => {
    const channel = supabase
      .channel("limperatrice-db-changes")
      // ── Core tables ─────────────────────────────────────────────
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "articles" },
        () => { reloadArticles(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "clients" },
        () => { reloadClients(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "employees" },
        () => { reloadEmployees(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        () => { reloadNotes(); },
      )
      // ── Locations + child tables ─────────────────────────────────
      // A change in any of these three tables should refresh all locations
      // because getLocations() batch-fetches versements & junction rows.
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "locations" },
        () => { reloadLocations(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "location_articles" },
        () => { reloadLocations(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "versements" },
        () => { reloadLocations(); },
      )
      // ── Reservations + child tables ──────────────────────────────
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => { reloadReservations(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservation_articles" },
        () => { reloadReservations(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservation_versements" },
        () => { reloadReservations(); },
      )
      // ── Saved contracts + child tables ───────────────────────────
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "saved_contracts" },
        () => { reloadSavedContracts(); },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "saved_contract_articles" },
        () => { reloadSavedContracts(); },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("[RealtimeSync] Subscribed to all DB change events.");
        } else if (status === "CHANNEL_ERROR") {
          console.warn("[RealtimeSync] Channel error — changes may not be delivered.");
        } else if (status === "TIMED_OUT") {
          console.warn("[RealtimeSync] Subscription timed out.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
      console.log("[RealtimeSync] Unsubscribed and channel removed.");
    };
  // Reload functions are stable references from Zustand — safe to omit from deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
