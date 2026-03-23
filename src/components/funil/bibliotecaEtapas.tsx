import { Plus } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { BIBLIOTECA_ETAPAS, type TipoEtapa } from "@/lib/funil"

interface BibliotecaEtapasProps {
  aoAdicionarEtapa: (tipoEtapa: TipoEtapa) => void
}

export function BibliotecaEtapas({ aoAdicionarEtapa }: BibliotecaEtapasProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-xl font-semibold text-slate-900 dark:text-slate-50">
            Biblioteca de etapas
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-300/75">
            Adicione uma nova etapa. Se uma etapa estiver selecionada, a nova será
            posicionada e conectada logo em seguida.
          </p>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {BIBLIOTECA_ETAPAS.map((preset) => (
          <button
            key={preset.tipo}
            type="button"
            onClick={() => aoAdicionarEtapa(preset.tipo)}
            className="group rounded-[1.4rem] border border-white/70 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 dark:border-slate-800/80 dark:bg-slate-900/[0.72] dark:hover:bg-slate-900 dark:hover:shadow-[0_18px_44px_rgba(2,8,23,0.34)]"
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <Badge className="bg-slate-900 text-white dark:border-orange-300/20 dark:bg-orange-400/[0.15] dark:text-orange-50">
                {preset.rotulo}
              </Badge>
              <div
                className="h-3 w-3 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${preset.corDestaque}, ${preset.corDestaqueSuave})`,
                }}
              />
            </div>
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
              {preset.titulo}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300/75">
              {preset.descricao}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-orange-600">
              <Plus className="h-4 w-4 transition group-hover:translate-x-1" />
              Adicionar etapa
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
