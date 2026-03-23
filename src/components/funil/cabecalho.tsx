import {
  BarChart3,
  CircleDollarSign,
  Link2,
  MoonStar,
  Sparkles,
  SunMedium,
  Workflow,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResumoFunil } from "@/hooks/construtorFunil"
import { formatarMoeda, formatarNumeroCompacto, formatarPercentual } from "@/lib/funil"

interface CabecalhoVisaoGeralProps {
  resumo: ResumoFunil
  temaEscuroAtivo: boolean
  aoAlternarTema: () => void
  aoCarregarExemplo: () => void
}

export function CabecalhoVisaoGeral({
  resumo,
  temaEscuroAtivo,
  aoAlternarTema,
  aoCarregarExemplo,
}: CabecalhoVisaoGeralProps) {
  const cartoesResumo = [
    {
      icon: Workflow,
      label: "Etapas",
      value: resumo.etapas.toString(),
      hint: "blocos no fluxo",
    },
    {
      icon: Link2,
      label: "Conexoes",
      value: resumo.conexoes.toString(),
      hint: "caminhos ativos",
    },
    {
      icon: BarChart3,
      label: "Acessos",
      value: formatarNumeroCompacto(resumo.acessos),
      hint: "dados simulados",
    },
    {
      icon: CircleDollarSign,
      label: "Receita",
      value: formatarMoeda(resumo.receita),
      hint: `taxa media ${formatarPercentual(resumo.taxaConversao)}`,
    },
  ]

  return (
    <CardHeader className="gap-4 border-b border-orange-100/80 pb-5 dark:border-slate-800/80">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <Badge className="w-fit bg-slate-900 text-white dark:border-orange-300/20 dark:bg-orange-400/[0.15] dark:text-orange-50">
            Construtor de Funil
          </Badge>
          <div className="space-y-2">
            <CardTitle className="max-w-3xl text-3xl text-slate-950 md:text-4xl dark:text-slate-50">
              Monte campanhas visuais, conecte etapas e acompanhe o desempenho do
              funil em um unico lugar.
            </CardTitle>
            <CardDescription className="max-w-2xl text-base text-slate-600 dark:text-slate-300/80">
              Arraste no quadro, conecte pelos pontos laterais e edite os detalhes
              de cada bloco no painel da direita.
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[10.5rem] dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-800/80"
            onClick={aoAlternarTema}
          >
            {temaEscuroAtivo ? (
              <SunMedium className="h-4 w-4" />
            ) : (
              <MoonStar className="h-4 w-4" />
            )}
            {temaEscuroAtivo ? "Modo claro" : "Modo escuro"}
          </Button>
          <Button variant="outline" onClick={aoCarregarExemplo}>
            <Sparkles className="h-4 w-4" />
            Carregar exemplo
          </Button>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
        {cartoesResumo.map((cartao) => (
          <CartaoResumo key={cartao.label} {...cartao} />
        ))}
      </div>
    </CardHeader>
  )
}

interface CartaoResumoProps {
  icon: LucideIcon
  label: string
  value: string
  hint: string
}

function CartaoResumo({ icon: Icon, label, value, hint }: CartaoResumoProps) {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/75 p-4 shadow-sm dark:border-slate-800/80 dark:bg-slate-900/[0.72] dark:shadow-[0_18px_40px_rgba(2,8,23,0.35)]">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-orange-100 p-2 text-orange-600 dark:bg-orange-400/[0.15] dark:text-orange-200">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-50">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-300/75">{hint}</p>
    </div>
  )
}
