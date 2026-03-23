import type { Connection, Edge, Node, XYPosition } from "@xyflow/react"
import { MarkerType } from "@xyflow/react"

export type TipoEtapa =
  | "anuncio"
  | "pagina-captura"
  | "formulario"
  | "sequencia-email"
  | "pagamento"
  | "oferta-extra"
  | "obrigado"

export interface MetricasEtapa {
  acessos: number
  conversoes: number
  receita: number
}

export interface DadosNoFunil extends Record<string, unknown> {
  tipoEtapa: TipoEtapa
  titulo: string
  descricao: string
  canal: string
  rotulo: string
  corDestaque: string
  corDestaqueSuave: string
  metricas: MetricasEtapa
}

export type NoFunil = Node<DadosNoFunil, "etapaFunil">
export type ConexaoFunil = Edge

export interface EstadoFunil {
  nos: NoFunil[]
  conexoes: ConexaoFunil[]
}

export interface PresetEtapa {
  tipo: TipoEtapa
  titulo: string
  descricao: string
  canal: string
  rotulo: string
  corDestaque: string
  corDestaqueSuave: string
  metricas: MetricasEtapa
}

export const COR_CONEXAO = "#f97316"

export const BIBLIOTECA_ETAPAS: PresetEtapa[] = [
  {
    tipo: "anuncio",
    titulo: "Anúncio",
    descricao: "Ponto de entrada da campanha paga com promessa clara e CTA objetivo.",
    canal: "Meta Ads",
    rotulo: "Atração",
    corDestaque: "#ef4444",
    corDestaqueSuave: "#fb923c",
    metricas: { acessos: 18400, conversoes: 1260, receita: 0 },
  },
  {
    tipo: "pagina-captura",
    titulo: "Página de captura",
    descricao: "Página focada em capturar interesse e conduzir para a proxima etapa.",
    canal: "Pagina principal",
    rotulo: "Consideração",
    corDestaque: "#f59e0b",
    corDestaqueSuave: "#facc15",
    metricas: { acessos: 1260, conversoes: 340, receita: 0 },
  },
  {
    tipo: "formulario",
    titulo: "Formulário",
    descricao: "Coleta de lead, qualificador ou pedido de contato.",
    canal: "Captura de lead",
    rotulo: "Qualificação",
    corDestaque: "#10b981",
    corDestaqueSuave: "#2dd4bf",
    metricas: { acessos: 340, conversoes: 185, receita: 0 },
  },
  {
    tipo: "sequencia-email",
    titulo: "Sequencia de E-mail",
    descricao: "Nutrição automatizada para aquecer o lead antes da oferta.",
    canal: "CRM",
    rotulo: "Relacionamento",
    corDestaque: "#06b6d4",
    corDestaqueSuave: "#38bdf8",
    metricas: { acessos: 185, conversoes: 92, receita: 0 },
  },
  {
    tipo: "pagamento",
    titulo: "Pagamento",
    descricao: "Momento da oferta principal com foco em fechar a venda.",
    canal: "Oferta principal",
    rotulo: "Conversão",
    corDestaque: "#8b5cf6",
    corDestaqueSuave: "#a78bfa",
    metricas: { acessos: 185, conversoes: 38, receita: 18490 },
  },
  {
    tipo: "oferta-extra",
    titulo: "Oferta extra",
    descricao: "Oferta complementar apresentada apos a compra principal.",
    canal: "Oferta complementar",
    rotulo: "Monetização",
    corDestaque: "#ec4899",
    corDestaqueSuave: "#fb7185",
    metricas: { acessos: 38, conversoes: 11, receita: 4390 },
  },
  {
    tipo: "obrigado",
    titulo: "Obrigado",
    descricao: "Fechamento do fluxo com confirmação, proximo passo ou onboarding.",
    canal: "Pós-venda",
    rotulo: "Retenção",
    corDestaque: "#6366f1",
    corDestaqueSuave: "#22c55e",
    metricas: { acessos: 38, conversoes: 34, receita: 0 },
  },
]

export const MAPA_PRESETS_ETAPAS = Object.fromEntries(
  BIBLIOTECA_ETAPAS.map((preset) => [preset.tipo, preset]),
) as Record<TipoEtapa, PresetEtapa>

export function criarId(prefixo: "node" | "edge") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefixo}-${crypto.randomUUID()}`
  }

  return `${prefixo}-${Date.now()}-${Math.round(Math.random() * 1000)}`
}

export function calcularTaxaConversao(acessos: number, conversoes: number) {
  if (!acessos) {
    return 0
  }

  return Math.min(Math.max(conversoes / acessos, 0), 1)
}

export function formatarNumeroCompacto(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(valor)
}

export function formatarMoeda(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(valor)
}

export function formatarPercentual(valor: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(valor)
}

export function obterPosicaoSugerida(indice: number): XYPosition {
  return {
    x: 80 + (indice % 3) * 340,
    y: 140 + Math.floor(indice / 3) * 220,
  }
}

export function criarNoEtapa(
  tipoEtapa: TipoEtapa,
  indice: number,
  posicao = obterPosicaoSugerida(indice),
): NoFunil {
  const preset = MAPA_PRESETS_ETAPAS[tipoEtapa]

  return {
    id: criarId("node"),
    type: "etapaFunil",
    position: posicao,
    data: {
      tipoEtapa,
      titulo: preset.titulo,
      descricao: preset.descricao,
      canal: preset.canal,
      rotulo: preset.rotulo,
      corDestaque: preset.corDestaque,
      corDestaqueSuave: preset.corDestaqueSuave,
      metricas: { ...preset.metricas },
    },
  }
}

export function criarConexaoEtapa(
  origem: string,
  destino: string,
  conexao?: Connection,
): ConexaoFunil {
  return {
    id: criarId("edge"),
    source: origem,
    target: destino,
    sourceHandle: conexao?.sourceHandle,
    targetHandle: conexao?.targetHandle,
    type: "smoothstep",
    animated: true,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: COR_CONEXAO,
    },
    style: {
      stroke: COR_CONEXAO,
      strokeWidth: 2.25,
    },
  }
}

export function criarEstadoExemplo(): EstadoFunil {
  const anuncio = criarNoEtapa("anuncio", 0, { x: 20, y: 220 })
  const paginaCaptura = criarNoEtapa("pagina-captura", 1, { x: 360, y: 220 })
  const formulario = criarNoEtapa("formulario", 2, { x: 700, y: 220 })
  const pagamento = criarNoEtapa("pagamento", 3, { x: 1040, y: 210 })
  const ofertaExtra = criarNoEtapa("oferta-extra", 4, { x: 1380, y: 100 })
  const obrigado = criarNoEtapa("obrigado", 5, { x: 1380, y: 320 })

  return {
    nos: [anuncio, paginaCaptura, formulario, pagamento, ofertaExtra, obrigado],
    conexoes: [
      criarConexaoEtapa(anuncio.id, paginaCaptura.id),
      criarConexaoEtapa(paginaCaptura.id, formulario.id),
      criarConexaoEtapa(formulario.id, pagamento.id),
      criarConexaoEtapa(pagamento.id, ofertaExtra.id),
      criarConexaoEtapa(pagamento.id, obrigado.id),
      criarConexaoEtapa(ofertaExtra.id, obrigado.id),
    ],
  }
}
