import { a as formatDate, i as formatDA, r as useStore } from "./store-C6Z2575g.js";
import { n as Td, r as Th } from "./table-JR-eRzRH.js";
import { i as Modal, r as EmptyState } from "./ui-kit-DbwqiaUZ.js";
import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Eye, FileText, Printer, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/_app.contract.tsx?tsr-split=component
function ContractPage() {
	const savedContracts = useStore((s) => s.savedContracts);
	const loadSavedContracts = useStore((s) => s.loadSavedContracts);
	const deleteSavedContract = useStore((s) => s.deleteSavedContract);
	const isAdmin = useStore((s) => s.auth.role === "admin");
	const [contractSearch, setContractSearch] = useState("");
	const [selectedContract, setSelectedContract] = useState(null);
	useEffect(() => {
		loadSavedContracts();
	}, []);
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "flex items-center justify-between flex-wrap gap-3",
				children: /* @__PURE__ */ jsx("h1", {
					className: "page-title",
					children: "Contrats Sauvegardés"
				})
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "relative",
				children: [/* @__PURE__ */ jsx(Search, {
					className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
					style: { color: "rgba(26,26,26,0.4)" }
				}), /* @__PURE__ */ jsx("input", {
					className: "input-field w-full pl-9",
					placeholder: "Rechercher par client, article ou date...",
					value: contractSearch,
					onChange: (e) => setContractSearch(e.target.value)
				})]
			}),
			(() => {
				const q = contractSearch.trim().toLowerCase();
				const filtered = q ? savedContracts.filter((c) => {
					return `${`${c.clientName} ${c.clientPhone}`.toLowerCase()} ${c.articles.map((a) => a.name).join(", ").toLowerCase()} ${formatDate(c.savedAt).toLowerCase()}`.includes(q);
				}) : savedContracts;
				if (filtered.length === 0) return /* @__PURE__ */ jsx(EmptyState, {
					icon: /* @__PURE__ */ jsx(FileText, { className: "w-12 h-12" }),
					title: q ? "Aucun résultat" : "Aucun contrat sauvegardé"
				});
				return /* @__PURE__ */ jsxs("div", {
					className: "card-surface",
					style: {
						padding: 0,
						overflow: "hidden"
					},
					children: [/* @__PURE__ */ jsxs("table", {
						className: "hidden md:table w-full text-sm",
						children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
							style: {
								borderBottom: "2px solid #E5E5E5",
								background: "#FAFAFA"
							},
							children: [
								/* @__PURE__ */ jsx(Th, { children: "Date Sauvegarde" }),
								/* @__PURE__ */ jsx(Th, { children: "Client" }),
								/* @__PURE__ */ jsx(Th, { children: "Articles" }),
								/* @__PURE__ */ jsx(Th, { children: "Total" }),
								/* @__PURE__ */ jsx(Th, { children: "Reste" }),
								/* @__PURE__ */ jsx(Th, {
									style: { textAlign: "right" },
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ jsx("tbody", { children: filtered.map((c) => /* @__PURE__ */ jsxs("tr", {
							style: { borderBottom: "1px solid #E5E5E5" },
							children: [
								/* @__PURE__ */ jsx(Td, { children: formatDate(c.savedAt) }),
								/* @__PURE__ */ jsxs(Td, { children: [/* @__PURE__ */ jsx("div", { children: c.clientName }), /* @__PURE__ */ jsx("div", {
									className: "text-xs",
									style: { color: "rgba(26,26,26,0.45)" },
									children: c.clientPhone
								})] }),
								/* @__PURE__ */ jsx(Td, { children: c.articles.map((a) => a.name).join(", ") }),
								/* @__PURE__ */ jsx(Td, { children: formatDA(c.total) }),
								/* @__PURE__ */ jsx(Td, {
									style: {
										color: c.reste > 0 ? "#BA93DF" : "rgba(26,26,26,0.45)",
										fontWeight: c.reste > 0 ? 500 : 400
									},
									children: formatDA(c.reste)
								}),
								/* @__PURE__ */ jsx(Td, {
									style: { textAlign: "right" },
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ jsxs("button", {
											onClick: () => setSelectedContract(c),
											className: "btn-ghost",
											style: {
												padding: "6px 12px",
												fontSize: 12
											},
											title: "Voir / Imprimer",
											children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), " Voir"]
										}), isAdmin && /* @__PURE__ */ jsx("button", {
											onClick: () => {
												if (confirm("Voulez-vous supprimer ce contrat sauvegardé ?")) {
													deleteSavedContract(c.id);
													toast.success("Contrat supprimé !");
												}
											},
											className: "btn-danger cursor-pointer",
											style: {
												padding: "6px 12px",
												fontSize: 12
											},
											title: "Supprimer",
											children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
										})]
									})
								})
							]
						}, c.id)) })]
					}), /* @__PURE__ */ jsx("div", {
						className: "md:hidden divide-y",
						style: { borderColor: "#E5E5E5" },
						children: filtered.map((c) => /* @__PURE__ */ jsxs("div", {
							className: "p-4 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-start",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("div", {
										className: "font-medium",
										children: c.clientName
									}), /* @__PURE__ */ jsx("div", {
										className: "text-xs",
										style: { color: "rgba(26,26,26,0.55)" },
										children: c.clientPhone
									})] }), /* @__PURE__ */ jsx("div", {
										className: "text-xs",
										style: { color: "rgba(26,26,26,0.45)" },
										children: formatDate(c.savedAt)
									})]
								}),
								/* @__PURE__ */ jsx("div", {
									className: "text-xs text-neutral-600 truncate",
									children: c.articles.map((a) => a.name).join(", ")
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-between items-center text-sm pt-1",
									children: [/* @__PURE__ */ jsxs("div", { children: ["Total: ", formatDA(c.total)] }), c.reste > 0 && /* @__PURE__ */ jsxs("div", {
										style: {
											color: "#BA93DF",
											fontWeight: 500
										},
										children: ["Reste: ", formatDA(c.reste)]
									})]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex justify-end gap-2 pt-2",
									children: [/* @__PURE__ */ jsxs("button", {
										onClick: () => setSelectedContract(c),
										className: "btn-ghost",
										style: {
											padding: "4px 8px",
											fontSize: 11
										},
										children: [/* @__PURE__ */ jsx(Eye, { className: "w-3.5 h-3.5" }), " Voir"]
									}), isAdmin && /* @__PURE__ */ jsx("button", {
										onClick: () => {
											if (confirm("Supprimer ce contrat ?")) {
												deleteSavedContract(c.id);
												toast.success("Contrat supprimé !");
											}
										},
										className: "btn-danger cursor-pointer",
										style: {
											padding: "4px 8px",
											fontSize: 11
										},
										children: /* @__PURE__ */ jsx(Trash2, { className: "w-3.5 h-3.5" })
									})]
								})
							]
						}, c.id))
					})]
				});
			})(),
			selectedContract && /* @__PURE__ */ jsx(Modal, {
				open: !!selectedContract,
				onClose: () => setSelectedContract(null),
				title: `Détail Contrat · ${selectedContract.clientName}`,
				size: "md",
				footer: /* @__PURE__ */ jsxs("div", {
					className: "flex justify-between w-full",
					children: [/* @__PURE__ */ jsxs("button", {
						onClick: () => window.print(),
						className: "btn-primary flex items-center gap-1.5",
						children: [/* @__PURE__ */ jsx(Printer, { className: "w-4 h-4" }), " Imprimer"]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setSelectedContract(null),
						className: "btn-danger",
						children: "Fermer"
					})]
				}),
				children: /* @__PURE__ */ jsx("div", {
					className: "py-2",
					children: /* @__PURE__ */ jsxs("div", {
						className: "border rounded-lg p-4 space-y-3 bg-[#FAFAFA]",
						style: { borderColor: "#E5E5E5" },
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-neutral-600",
									children: "Client :"
								}), /* @__PURE__ */ jsxs("span", { children: [
									selectedContract.clientName,
									" (",
									selectedContract.clientPhone,
									")"
								] })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-neutral-600",
									children: "Date Retrait :"
								}), /* @__PURE__ */ jsx("span", { children: formatDate(selectedContract.pickupDate) })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-neutral-600",
									children: "Date Retour :"
								}), /* @__PURE__ */ jsx("span", { children: formatDate(selectedContract.returnDate) })]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "border-t pt-2 mt-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-sm text-neutral-600",
									children: "Articles :"
								}), /* @__PURE__ */ jsx("ul", {
									className: "list-disc pl-5 text-sm mt-1 space-y-1",
									children: selectedContract.articles.map((a, idx) => /* @__PURE__ */ jsxs("li", { children: [
										a.name,
										" - ",
										/* @__PURE__ */ jsx("span", {
											style: { color: "#BA93DF" },
											children: formatDA(a.price)
										})
									] }, idx))
								})]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "border-t pt-2 mt-2 space-y-1 text-sm",
								children: [
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Total :" }), /* @__PURE__ */ jsx("strong", { children: formatDA(selectedContract.total) })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Versé :" }), /* @__PURE__ */ jsx("span", { children: formatDA(selectedContract.verse) })]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										style: { color: "#BA93DF" },
										children: [/* @__PURE__ */ jsx("span", { children: "Reste à payer :" }), /* @__PURE__ */ jsx("strong", { children: formatDA(selectedContract.reste) })]
									}),
									selectedContract.caution > 0 && /* @__PURE__ */ jsxs("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ jsx("span", { children: "Caution :" }), /* @__PURE__ */ jsx("strong", { children: formatDA(selectedContract.caution) })]
									})
								]
							})
						]
					})
				})
			}),
			selectedContract && /* @__PURE__ */ jsx("div", {
				className: "print-area",
				style: { display: "none" },
				children: /* @__PURE__ */ jsx(PrintSavedContract, { contract: selectedContract })
			}),
			/* @__PURE__ */ jsx("style", { children: `@media print { .print-area { display: block !important; } }` })
		]
	});
}
function PrintSavedContract({ contract }) {
	return /* @__PURE__ */ jsxs("div", {
		style: {
			fontFamily: "Montserrat, sans-serif",
			color: "#1A1A1A",
			fontSize: 13,
			lineHeight: 1.4,
			height: "100%",
			position: "relative",
			boxSizing: "border-box"
		},
		children: [
			/* @__PURE__ */ jsxs("div", {
				style: {
					textAlign: "center",
					paddingBottom: 12,
					borderBottom: "2px solid #BA93DF"
				},
				children: [/* @__PURE__ */ jsx("div", {
					style: {
						fontFamily: "Cormorant Garamond, serif",
						fontStyle: "italic",
						fontSize: 26,
						color: "#BA93DF",
						letterSpacing: "0.15em"
					},
					children: "L'impératrice"
				}), /* @__PURE__ */ jsx("div", {
					style: {
						fontSize: 11,
						marginTop: 2,
						color: "rgba(26,26,26,0.6)"
					},
					children: "Contrat de location"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 16 },
				children: [
					/* @__PURE__ */ jsx("strong", { children: "Client :" }),
					" ",
					contract.clientName,
					/* @__PURE__ */ jsx("br", {}),
					/* @__PURE__ */ jsx("strong", { children: "Téléphone :" }),
					" ",
					contract.clientPhone,
					/* @__PURE__ */ jsx("br", {})
				]
			}),
			/* @__PURE__ */ jsxs("table", {
				style: {
					width: "100%",
					marginTop: 16,
					borderCollapse: "collapse"
				},
				children: [/* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
					style: { borderBottom: "1px solid #E5E5E5" },
					children: [/* @__PURE__ */ jsx("th", {
						style: {
							textAlign: "left",
							padding: "6px 8px"
						},
						children: "Article"
					}), /* @__PURE__ */ jsx("th", {
						style: {
							textAlign: "right",
							padding: "6px 8px"
						},
						children: "Prix"
					})]
				}) }), /* @__PURE__ */ jsx("tbody", { children: contract.articles.map((a, idx) => /* @__PURE__ */ jsxs("tr", {
					style: { borderBottom: "1px solid #E5E5E5" },
					children: [/* @__PURE__ */ jsx("td", {
						style: { padding: "6px 8px" },
						children: a.name
					}), /* @__PURE__ */ jsx("td", {
						style: {
							padding: "6px 8px",
							textAlign: "right"
						},
						children: formatDA(a.price)
					})]
				}, idx)) })]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: { marginTop: 16 },
				children: [/* @__PURE__ */ jsxs("div", { children: ["Retrait : ", formatDate(contract.pickupDate)] }), /* @__PURE__ */ jsxs("div", { children: ["Retour prévu : ", formatDate(contract.returnDate)] })]
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					marginTop: 16,
					padding: 12,
					border: "1px solid #E5E5E5",
					borderRadius: 8,
					textAlign: "center"
				},
				children: [
					/* @__PURE__ */ jsxs("div", { children: ["Total : ", /* @__PURE__ */ jsx("strong", { children: formatDA(contract.total) })] }),
					/* @__PURE__ */ jsxs("div", { children: ["Versé : ", formatDA(contract.verse)] }),
					/* @__PURE__ */ jsxs("div", { children: ["Reste : ", /* @__PURE__ */ jsx("strong", {
						style: { color: "#BA93DF" },
						children: formatDA(contract.reste)
					})] }),
					contract.caution > 0 && /* @__PURE__ */ jsxs("div", { children: ["Caution : ", /* @__PURE__ */ jsx("strong", { children: formatDA(contract.caution) })] })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				style: { marginTop: 32 },
				children: "Signature client : _________________________   Date : ___/___/______"
			}),
			/* @__PURE__ */ jsxs("div", {
				style: {
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					fontSize: 10,
					textAlign: "center",
					color: "rgba(26,26,26,0.55)",
					lineHeight: 1.5
				},
				children: [/* @__PURE__ */ jsxs("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8,
						flexWrap: "wrap"
					},
					children: [
						/* @__PURE__ */ jsx("span", { children: "Les versements effectués ne sont pas remboursables. · Pièce d'identité obligatoire." }),
						/* @__PURE__ */ jsx("span", {
							style: { color: "rgba(26,26,26,0.3)" },
							children: "|"
						}),
						/* @__PURE__ */ jsx("span", {
							dir: "rtl",
							children: "المبالغ المدفوعة غير قابلة للاسترداد. · بطاقة الهوية إجبارية."
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					style: {
						marginTop: 8,
						borderTop: "1px solid #E5E5E5",
						paddingTop: 8,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 8
					},
					children: [
						/* @__PURE__ */ jsxs("span", {
							style: {
								display: "inline-flex",
								alignItems: "center",
								gap: 3
							},
							children: [
								/* @__PURE__ */ jsxs("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									style: { flexShrink: 0 },
									children: [
										/* @__PURE__ */ jsx("rect", {
											x: "2",
											y: "2",
											width: "20",
											height: "20",
											rx: "5",
											ry: "5"
										}),
										/* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
										/* @__PURE__ */ jsx("line", {
											x1: "17.5",
											y1: "6.5",
											x2: "17.51",
											y2: "6.5"
										})
									]
								}),
								/* @__PURE__ */ jsx("svg", {
									width: "12",
									height: "12",
									viewBox: "0 0 24 24",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "2.2",
									strokeLinecap: "round",
									strokeLinejoin: "round",
									style: { flexShrink: 0 },
									children: /* @__PURE__ */ jsx("path", { d: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" })
								}),
								/* @__PURE__ */ jsx("strong", {
									style: { fontWeight: 600 },
									children: "limperatrice_"
								})
							]
						}),
						/* @__PURE__ */ jsx("span", {
							style: { color: "rgba(26,26,26,0.3)" },
							children: "·"
						}),
						/* @__PURE__ */ jsx("span", { children: "Contact : 0774 22 39 50" })
					]
				})]
			})
		]
	});
}
//#endregion
export { ContractPage as component };
