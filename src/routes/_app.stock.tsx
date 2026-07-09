import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";
import { useStore, type Article, type Category, type ArticleStatus, type Reservation } from "@/lib/store";
import { formatDA, formatDate } from "@/lib/format";
import { Drawer, Badge, EmptyState, Modal } from "@/components/ui-kit";
import { Plus, MoreVertical, Package, Search, X } from "lucide-react";

function formatDateShort(d: string) {
  if (!d) return "";
  const date = new Date(d);
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export const Route = createFileRoute("/_app/stock")({
  component: StockPage,
});

const CATS: ("Tous" | Category)[] = ["Tous", "Tenues", "Accessoires"];
const STATUSES: ("Tous" | ArticleStatus)[] = ["Tous", "Disponible", "Loué", "En entretien"];

function StockPage() {
  const articles = useStore((s) => s.articles);
  const addArticle = useStore((s) => s.addArticle);
  const updateArticle = useStore((s) => s.updateArticle);
  const deleteArticle = useStore((s) => s.deleteArticle);
  const reservations = useStore((s) => s.reservations);
  const clients = useStore((s) => s.clients);

  const [cat, setCat] = useState<typeof CATS[number]>("Tous");
  const [stat, setStat] = useState<typeof STATUSES[number]>("Tous");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Article | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  // Note modal state
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [noteArticle, setNoteArticle] = useState<Article | null>(null);
  const [noteMessage, setNoteMessage] = useState("");
  const addNote = useStore((s) => s.addNote);

  const q = search.trim().toLowerCase();
  const filtered = articles.filter((a) => {
    if (!a) return false;
    if (cat !== "Tous" && a.category !== cat) return false;
    if (stat !== "Tous" && a.status !== stat) return false;
    if (q) {
      const haystack = `${a.name} ${a.category} ${a.size ?? ""} ${a.color ?? ""}`.toLowerCase();
      return haystack.includes(q);
    }
    return true;
  });

  const openCreate = () => { setEditing(null); setDrawerOpen(true); };
  const openEdit = (a: Article) => { setEditing(a); setDrawerOpen(true); setMenuFor(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="page-title">Stock</h1>
        <button onClick={openCreate} className="btn-primary"><Plus className="w-4 h-4" /> Ajouter un article</button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(26,26,26,0.4)" }} />
        <input
          className="input-field w-full"
          style={{ paddingLeft: 36, paddingRight: search ? 36 : undefined }}
          placeholder="Rechercher un article..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
            aria-label="Effacer"
          >
            <X className="w-4 h-4" style={{ color: "rgba(26,26,26,0.4)" }} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <PillRow items={CATS} value={cat} onChange={setCat as any} />
        <PillRow items={STATUSES} value={stat} onChange={setStat as any} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-12 h-12" />}
          title="Aucun article pour l'instant"
          cta="+ Ajouter un article"
          onCta={openCreate}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <div key={a.id} className="card-surface" style={{ padding: 16 }} onClick={() => {
                const resList = reservations.filter(r => (r.articleIds ?? []).includes(a.id));
                setSelectedReservation(resList.length > 0 ? resList[0] : null);
                (window as any).__allReservationsForArticle = resList;
                setInfoOpen(true);
              }}>
              <div
                className="rounded-lg mb-3 flex items-center justify-center text-white"
                style={{
                  aspectRatio: "4/3",
                  background: a.photo?.startsWith("http")
                    ? `url(${a.photo}) center/cover no-repeat`
                    : (a.photo ?? "#BA93DF"),
                  fontFamily: "Cormorant Garamond, serif",
                  fontStyle: "italic",
                  fontSize: 32,
                }}
              >
                {!a.photo?.startsWith("http") && a.name[0]}
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-[15px] truncate">{a.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(26,26,26,0.55)" }}>
                    {a.category}{a.size ? ` · ${a.size}` : ""}{a.color ? ` · ${a.color}` : ""}
                  </div>
                </div>
                <div className="relative">
                  <button onClick={(e) => { e.stopPropagation(); setMenuFor(menuFor === a.id ? null : a.id); }} className="p-1 -mr-1" aria-label="Menu">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {menuFor === a.id && (
                    <div className="absolute right-0 top-7 z-10 bg-white border rounded-lg shadow-lg w-44 py-1" style={{ borderColor: "#E5E5E5" }}>
                      <button onClick={(e) => { e.stopPropagation(); openEdit(a); }} className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]">Modifier</button>
                       <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuFor(null);
                          if (a.status === "En entretien") {
                            updateArticle(a.id, { status: "Disponible" });
                          } else {
                            setNoteArticle(a);
                            setNoteMessage("");
                            setNoteModalOpen(true);
                          }
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]"
                      >
                        {a.status === "En entretien" ? "Marquer disponible" : "Marquer indisponible"}
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); if (confirm("Supprimer cet article ?")) deleteArticle(a.id); setMenuFor(null); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(186, 147, 223,0.04)]"
                        style={{ color: "#C0392B" }}
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3" style={{ fontSize: 16, fontWeight: 500, color: "#BA93DF" }}>{formatDA(a.price)}</div>
              <div className="mt-3 flex justify-end"><Badge status={a.status} /></div>
            </div>
          ))}
        </div>
      )}

      <ArticleDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        article={editing}
        onSave={(data) => {
          if (editing) updateArticle(editing.id, data);
          else addArticle(data);
          setDrawerOpen(false);
        }}
      />
      {/* Note modal for "Marquer indisponible" */}
      <Modal
        open={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        title="Note d'indisponibilité"
        footer={
          <>
            <button onClick={() => setNoteModalOpen(false)} className="btn-danger">Annuler</button>
            <button
              className="btn-primary"
              onClick={async () => {
                if (!noteArticle) return;
                await updateArticle(noteArticle.id, { status: "En entretien" });
                const today = new Date().toISOString().slice(0, 10);
                await addNote({
                  articleId: noteArticle.id,
                  articleName: noteArticle.name,
                  message: noteMessage.trim(),
                  date: today,
                });
                setNoteModalOpen(false);
                setNoteArticle(null);
                setNoteMessage("");
              }}
            >
              Enregistrer
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="text-sm" style={{ color: "rgba(26,26,26,0.6)" }}>
            Article : <strong>{noteArticle?.name}</strong>
          </div>
          <label className="block">
            <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#BA93DF" }}>
              Note (optionnel)
            </span>
            <textarea
              className="input-field w-full"
              rows={3}
              placeholder="Raison de l'indisponibilité..."
              value={noteMessage}
              onChange={(e) => setNoteMessage(e.target.value)}
            />
          </label>
          <div className="text-xs" style={{ color: "rgba(26,26,26,0.4)" }}>
            Date : {formatDateShort(new Date().toISOString().slice(0, 10))}
          </div>
        </div>
      </Modal>

      <Modal open={infoOpen} onClose={() => setInfoOpen(false)} title={selectedReservation ? "Réservations" : "Disponibilité"}>
        {selectedReservation ? (() => {
          const allRes = (window as any).__allReservationsForArticle || [selectedReservation];
          return (
            <div className="space-y-4">
              {allRes.map((res: Reservation) => (
                <div key={res.id} className="p-3 rounded-lg border" style={{ borderColor: "#E5E5E5" }}>
                  <div><strong>Client:</strong> {clients.find(c => c.id === res.clientId)?.name ?? "Inconnu"}</div>
                  <div><strong>Période:</strong> {formatDate(res.pickupDate)} → {formatDate(res.returnDate)}</div>
                </div>
              ))}
            </div>
          );
        })() : (
          <div>Ce produit n'est pas réservé.</div>
        )}
      </Modal>
    </div>
  );
}

function PillRow<T extends string>({ items, value, onChange }: { items: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {items.map((it) => {
        const active = it === value;
        return (
          <button
            key={it}
            onClick={() => onChange(it)}
            className="pill whitespace-nowrap transition-colors"
            style={{
              background: active ? "#BA93DF" : "transparent",
              color: active ? "#1A1A1A" : "rgba(26,26,26,0.6)",
              border: active ? "1px solid #BA93DF" : "1px solid #E5E5E5",
              padding: "6px 14px",
              fontSize: 13,
            }}
          >
            {it}
          </button>
        );
      })}
    </div>
  );
}

function ArticleDrawer(props: {
  open: boolean; onClose: () => void; article: Article | null;
  onSave: (data: Omit<Article, "id">) => void;
}) {
  if (!props.open) return null;
  return <ArticleDrawerInner {...props} key={props.article?.id ?? "new"} />;
}

function ArticleDrawerInner({ open, onClose, article, onSave }: {
  open: boolean; onClose: () => void; article: Article | null;
  onSave: (data: Omit<Article, "id">) => void;
}) {
  const PURPLES = ["#BA93DF", "#9B5BA5", "#B884C0", "#D4B0D9", "#5E2A66"];
  const [form, setForm] = useState<any>(() => article ?? {
    name: "", category: "Tenues" as Category, size: "", color: "", price: "", caution: 0,
    status: "Disponible" as ArticleStatus, notes: "",
    photo: PURPLES[Math.floor(Math.random() * PURPLES.length)],
  });

  const [compressing, setCompressing] = useState(false);
  const [compressedImage, setCompressedImage] = useState<{ blob: Blob; fileName: string; sizeKb: number } | null>(null);
  const [compressionStatus, setCompressionStatus] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(article?.photo && article.photo.startsWith("http") ? article.photo : null);

  async function compressImage(file: File): Promise<{ blob: Blob; sizeKb: number }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_DIM = 1200;
          let width = img.width;
          let height = img.height;
          
          if (width > MAX_DIM || height > MAX_DIM) {
            if (width > height) {
              height = Math.round((height * MAX_DIM) / width);
              width = MAX_DIM;
            } else {
              width = Math.round((width * MAX_DIM) / height);
              height = MAX_DIM;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get 2d context"));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.8;
          const getBlob = (q: number): Promise<Blob> => {
            return new Promise((res) => {
              canvas.toBlob((blob) => res(blob!), "image/jpeg", q);
            });
          };
          
          (async () => {
            let blob = await getBlob(quality);
            
            // Adjust quality to target 100KB - 200KB range if it exceeds 200KB
            if (blob.size > 200 * 1024) {
              quality = 0.6;
              blob = await getBlob(quality);
            }
            if (blob.size > 200 * 1024) {
              quality = 0.4;
              blob = await getBlob(quality);
            }
            // If still larger than 200KB, scale down resolution
            if (blob.size > 200 * 1024) {
              const scale = 0.7;
              canvas.width = Math.round(width * scale);
              canvas.height = Math.round(height * scale);
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              blob = await getBlob(0.5);
            }
            
            resolve({
              blob,
              sizeKb: Math.round(blob.size / 1024),
            });
          })().catch(reject);
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={article ? "Modifier l'article" : "Nouvel article"}
      footer={
        <>
          <button onClick={onClose} className="btn-danger">Annuler</button>
          <button
            onClick={async () => {
              if (compressing) {
                alert("Veuillez patienter pendant l'optimisation de l'image.");
                return;
              }

              if (compressedImage) {
                const { blob, fileName } = compressedImage;
                const filePath = `article-${Date.now()}-${fileName.replace(/[^a-z0-9.]/gi, '_')}`;
                const { error: uploadError } = await supabase.storage
                  .from('product-images')
                  .upload(filePath, blob);
                if (uploadError) {
                  console.error('Image upload failed', uploadError);
                  alert('Échec du téléchargement de l\'image');
                  return;
                }
                const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
                form.photo = data.publicUrl;
              }
              const { __newImageFile, ...cleanForm } = form as any;
              // Convert numeric fields: empty string → 0, otherwise parse to number
              cleanForm.price = cleanForm.price === "" || cleanForm.price == null ? 0 : Number(cleanForm.price);
              cleanForm.caution = 0;
              onSave(cleanForm);
            }}
            disabled={compressing}
            className="btn-primary"
          >
            {compressing ? "Optimisation..." : "Enregistrer"}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Nom">
          <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Catégorie">
            <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
              <option>Tenues</option><option>Accessoires</option>
            </select>
          </Field>
          <Field label="Image">
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className="input-field w-full text-xs"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setCompressing(true);
                    setCompressionStatus("Optimisation de l'image...");
                    try {
                      const localPreview = URL.createObjectURL(file);
                      setPreviewUrl(localPreview);

                      const result = await compressImage(file);
                      setCompressedImage({
                        blob: result.blob,
                        fileName: file.name,
                        sizeKb: result.sizeKb,
                      });
                      setCompressionStatus(`Image prête : ${result.sizeKb} Ko`);
                    } catch (err) {
                      console.error("Compression failed", err);
                      setCompressionStatus("Erreur d'optimisation. Fichier d'origine utilisé.");
                      setCompressedImage({
                        blob: file,
                        fileName: file.name,
                        sizeKb: Math.round(file.size / 1024),
                      });
                    } finally {
                      setCompressing(false);
                    }
                  }
                }}
              />
              {previewUrl && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E5E5E5] bg-gray-50 flex items-center justify-center shadow-sm">
                  <img src={previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                  {compressing && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-medium text-center p-1 leading-tight">
                      Compression...
                    </div>
                  )}
                </div>
              )}
              {compressionStatus && (
                <div className={`text-xs ${compressionStatus.includes("Erreur") ? "text-red-500" : "text-emerald-600"} font-medium`}>
                  {compressionStatus}
                </div>
              )}
            </div>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Taille"><input className="input-field" value={form.size ?? ""} onChange={(e) => setForm({ ...form, size: e.target.value })} /></Field>
          <Field label="Couleur"><input className="input-field" value={form.color ?? ""} onChange={(e) => setForm({ ...form, color: e.target.value })} /></Field>
        </div>
        <div className="grid grid-cols-1 gap-3">
          <Field label="Prix location (DA)"><input type="number" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
        </div>
      </div>
    </Drawer>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "#BA93DF" }}>{label}</span>
      {children}
    </label>
  );
}
