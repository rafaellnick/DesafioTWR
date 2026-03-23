import type { NodeProps } from "@xyflow/react"
import { Handle, Position } from "@xyflow/react"
import {
  BadgeCheck,
  CircleDollarSign,
  FileText,
  FormInput,
  LayoutTemplate,
  Mail,
  MousePointerClick,
  ShoppingCart,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  calcularTaxaConversao,
  formatarMoeda,
  formatarNumeroCompacto,
  formatarPercentual,
  type NoFunil,
  type TipoEtapa,
} from "@/lib/funil"
import { cn } from "@/lib/utils"

const mapaIcones: Record<TipoEtapa, typeof MousePointerClick> = {
  anuncio: MousePointerClick,
  "pagina-captura": LayoutTemplate,
  formulario: FormInput,
  "sequencia-email": Mail,
  pagamento: ShoppingCart,
  "oferta-extra": CircleDollarSign,
  obrigado: BadgeCheck,
}

export function EtapaFunil({ data, selected }: NodeProps<NoFunil>) {
  const Icone = mapaIcones[data.tipoEtapa] ?? FileText
  const taxaConversao = calcularTaxaConversao(
    data.metricas.acessos,
    data.metricas.conversoes,
  )

  return (
    <div
      className={cn(
        "w-[280px] rounded-[1.75rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_50px_rgba(120,53,15,0.18)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/90 dark:shadow-[0_20px_50px_rgba(2,8,23,0.48)]",
        selected &&
          "ring-2 ring-orange-300 ring-offset-2 ring-offset-transparent dark:ring-orange-400",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-3 !border-2 !border-white !bg-orange-400"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-orange-400"
      />

      <div
        className="rounded-[1.4rem] p-4 text-white"
        style={{
          background: `linear-gradient(135deg, ${data.corDestaque}, ${data.corDestaqueSuave})`,
        }}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="rounded-2xl bg-white/20 p-2 backdrop-blur">
            <Icone className="h-5 w-5" />
          </div>
          <Badge className="border-white/20 bg-white/15 text-white">{data.rotulo}</Badge>
        </div>
        <div className="space-y-1">
          <p className="font-display text-lg font-semibold leading-tight">{data.titulo}</p>
          <p className="text-sm text-white/80">{data.canal}</p>
        </div>
      </div>

      <div className="space-y-3 px-1 pt-4">
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300/80">
          {data.descricao}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <CartaoMetrica label="Acessos" value={formatarNumeroCompacto(data.metricas.acessos)} />
          <CartaoMetrica
            label="Conversoes"
            value={formatarNumeroCompacto(data.metricas.conversoes)}
          />
          <CartaoMetrica label="Taxa" value={formatarPercentual(taxaConversao)} />
          <CartaoMetrica label="Receita" value={formatarMoeda(data.metricas.receita)} />
        </div>
      </div>
    </div>
  )
}

function CartaoMetrica({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-orange-100 bg-orange-50/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/80">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-500 dark:text-orange-300">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  )
}
