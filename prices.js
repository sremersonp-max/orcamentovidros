// =============================================================================
// TABELA COMPLETA DE PREÇOS
// =============================================================================

const PRICE_TABLE = {
    "1": { 
        name: "Janela", 
        steps: ["model","thickness","color"],
        models: {
            "Janela 4 folhas": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 377.65, 
                        "Fumê": 454.87, 
                        "Verde": 454.87, 
                        "Bronze": 641.98, 
                        "Fantasia": 477.14 
                    } 
                } 
            },
            "Janela 2 folhas": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 351.80, 
                        "Fumê": 429.02, 
                        "Verde": 429.02, 
                        "Bronze": 616.13, 
                        "Fantasia": 451.30 
                    } 
                } 
            },
            "Janela 4 folhas + 1 fixo + 1 bascula": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 548.15, 
                        "Fumê": 653.45, 
                        "Verde": 653.45, 
                        "Bronze": 908.60, 
                        "Fantasia": 683.83 
                    } 
                } 
            },
            "Janela 4 folhas + 1 bascula": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 475.46, 
                        "Fumê": 563.21, 
                        "Verde": 563.21, 
                        "Bronze": 775.83, 
                        "Fantasia": 588.52 
                    } 
                } 
            },
            "Janela 4 folhas + 1 fixo + 2 bascula": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 695.18, 
                        "Fumê": 818.03, 
                        "Verde": 818.03, 
                        "Bronze": 1115.70, 
                        "Fantasia": 853.47 
                    } 
                } 
            },
            "Basculante": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 326.57, 
                        "Fumê": 403.79, 
                        "Verde": 403.79, 
                        "Bronze": 590.90, 
                        "Fantasia": 426.07 
                    } 
                } 
            },
            "Maxim-ar": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 311.78, 
                        "Fumê": 381.98, 
                        "Verde": 381.98, 
                        "Bronze": 552.08, 
                        "Fantasia": 402.23 
                    } 
                } 
            }
        }
    },
    "2": { 
        name: "Porta", 
        steps: ["model","thickness","color"],
        models: {
            "Porta 4 folhas": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 392.40, 
                        "Fumê": 469.62, 
                        "Verde": 469.62, 
                        "Bronze": 656.73, 
                        "Fantasia": 491.90 
                    }, 
                    "10mm": { 
                        "Incolor": 534.81, 
                        "Fumê": 551.30, 
                        "Verde": 551.30, 
                        "Bronze": 766.62, 
                        "Fantasia": 0.00 
                    } 
                } 
            },
            "Porta 2 folhas": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 396.79, 
                        "Fumê": 474.01, 
                        "Verde": 474.01, 
                        "Bronze": 661.12, 
                        "Fantasia": 496.28 
                    }, 
                    "10mm": { 
                        "Incolor": 474.01, 
                        "Fumê": 555.68, 
                        "Verde": 555.68, 
                        "Bronze": 771.01, 
                        "Fantasia": 0.00 
                    } 
                } 
            },
            "Porta sanfonada": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 980.96, 
                        "Fumê": 1051.16, 
                        "Verde": 1051.16, 
                        "Bronze": 1221.26, 
                        "Fantasia": 1071.41 
                    }, 
                    "10mm": { 
                        "Incolor": 1051.16, 
                        "Fumê": 1125.41, 
                        "Verde": 1125.41, 
                        "Bronze": 1321.16, 
                        "Fantasia": 0.00 
                    } 
                } 
            },
            "Porta de giro": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 410.61, 
                        "Fumê": 480.81, 
                        "Verde": 480.81, 
                        "Bronze": 650.91, 
                        "Fantasia": 501.06 
                    }, 
                    "10mm": { 
                        "Incolor": 480.81, 
                        "Fumê": 555.06, 
                        "Verde": 555.06, 
                        "Bronze": 750.81, 
                        "Fantasia": 0.00 
                    } 
                } 
            },
            "Porta correr atrás parede sem tubo": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 483.22, 
                        "Fumê": 560.62, 
                        "Verde": 560.62, 
                        "Bronze": 748.15, 
                        "Fantasia": 582.95 
                    }, 
                    "10mm": { 
                        "Incolor": 560.62, 
                        "Fumê": 642.48, 
                        "Verde": 642.48, 
                        "Bronze": 858.29, 
                        "Fantasia": 0.00 
                    } 
                } 
            },
            "Porta correr atrás parede com tubo": { 
                prices: { 
                    "8mm": { 
                        "Incolor": 633.80, 
                        "Fumê": 711.20, 
                        "Verde": 711.20, 
                        "Bronze": 898.73, 
                        "Fantasia": 733.52 
                    }, 
                    "10mm": { 
                        "Incolor": 711.20, 
                        "Fumê": 793.06, 
                        "Verde": 793.06, 
                        "Bronze": 1008.87, 
                        "Fantasia": 0.00 
                    } 
                } 
            }
        }
    },
    "5": { 
        name: "Espelho", 
        steps: ["option"],
        options: {
            "Com bisote 4mm": { type: "Com bisote", thickness: "4mm", price: 314.80 },
            "Sem bisote 4mm": { type: "Sem bisote", thickness: "4mm", price: 291.50 },
            "Com bisote 6mm": { type: "Com bisote", thickness: "6mm", price: 515.14 },
            "Sem bisote 6mm": { type: "Sem bisote", thickness: "6mm", price: 471.96 }
        }
    },
    "6": { 
        name: "Box Banheiro", 
        steps: ["material"],
        options: {
            "Vidro fumê/verde": { name: "Vidro fumê/verde", price: 437.00 },
            "Vidro incolor": { name: "Vidro incolor", price: 335.00 },
            "Plástico/acrílico": { name: "Plástico/acrílico", price: 250.00 }
        }
    },
    "7": { 
        name: "Painel/Vitrine", 
        steps: ["panel_type"],
        options: {
            "Vidro incolor 8mm": { thickness: "8mm", price: 300.00 },
            "Vidro incolor 10mm": { thickness: "10mm", price: 370.00 }
        }
    },
    "8": { 
        name: "Tela Mosquiteiro", 
        steps: [],
        price: 250.00
    }
};