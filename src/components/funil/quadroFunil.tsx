import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  type Connection,
  type OnEdgesChange,
  type OnEdgesDelete,
  type OnNodesChange,
  type OnNodesDelete,
  type OnSelectionChangeFunc,
} from "@xyflow/react"
import { RefreshCcw, Trash2 } from "lucide-react"

import { EtapaFunil } from "@/components/etapaFunil"
import { Button } from "@/components/ui/button"
import type { ConexaoFunil, NoFunil } from "@/lib/funil"

const tiposNos = {
  etapaFunil: EtapaFunil,
}

interface QuadroFunilProps {
  nos: NoFunil[]
  conexoes: ConexaoFunil[]
  aoMudarNos: OnNodesChange<NoFunil>
  aoMudarConexoes: OnEdgesChange<ConexaoFunil>
  aoConectar: (conexao: Connection) => void
  aoClicarFora: () => void
  temaEscuroAtivo: boolean
  temSelecao: boolean
  aoLimparQuadro: () => void
  aoRemoverSelecao: () => void
  aoMudarSelecao: OnSelectionChangeFunc<NoFunil, ConexaoFunil>
  aoExcluirNos: OnNodesDelete<NoFunil>
  aoExcluirConexoes: OnEdgesDelete<ConexaoFunil>
}

export function QuadroFunil({
  nos,
  conexoes,
  aoMudarNos,
  aoMudarConexoes,
  aoConectar,
  aoClicarFora,
  temaEscuroAtivo,
  temSelecao,
  aoLimparQuadro,
  aoRemoverSelecao,
  aoMudarSelecao,
  aoExcluirNos,
  aoExcluirConexoes,
}: QuadroFunilProps) {
  return (
    <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[length:32px_32px] bg-grid dark:border-slate-800/80 dark:bg-slate-950/60 dark:[background-image:linear-gradient(to_right,rgba(71,85,105,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.18)_1px,transparent_1px)]">
      <ReactFlow<NoFunil, ConexaoFunil>
        nodes={nos}
        edges={conexoes}
        nodeTypes={tiposNos}
        onNodesChange={aoMudarNos}
        onEdgesChange={aoMudarConexoes}
        onConnect={aoConectar}
        onPaneClick={aoClicarFora}
        onSelectionChange={aoMudarSelecao}
        onNodesDelete={aoExcluirNos}
        onEdgesDelete={aoExcluirConexoes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        minZoom={0.4}
        defaultViewport={{ x: 0, y: 0, zoom: 0.72 }}
        deleteKeyCode={["Delete", "Backspace"]}
        proOptions={{ hideAttribution: true }}
        className="min-h-[720px] bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1.2}
          color={temaEscuroAtivo ? "#475569" : "#f4b16e"}
        />
        <MiniMap
          pannable
          zoomable
          nodeColor={(node) => String(node.data?.corDestaque ?? "#f97316")}
          className="!rounded-[1.25rem] !border !border-white/80 !bg-white/80 !shadow-ambient dark:!border-slate-700/80 dark:!bg-slate-900/85 dark:!shadow-[0_18px_40px_rgba(2,8,23,0.35)]"
        />
        <Controls className="!overflow-hidden !rounded-[1.25rem] !border !border-white/80 !bg-white/80 !shadow-ambient dark:!border-slate-700/80 dark:!bg-slate-900/85 dark:!shadow-[0_18px_40px_rgba(2,8,23,0.35)]" />

        <Panel position="top-right">
          <Button
            type="button"
            variant="outline"
            onClick={aoLimparQuadro}
            className="mr-2 shadow-ambient dark:border-slate-700/80 dark:bg-slate-900/85 dark:text-slate-100 dark:hover:bg-slate-800/80 dark:shadow-[0_18px_40px_rgba(2,8,23,0.35)]"
          >
            <RefreshCcw className="h-4 w-4" />
            Limpar quadro
          </Button>
          <Button
            type="button"
            size="icon"
            variant="destructive"
            onClick={aoRemoverSelecao}
            disabled={!temSelecao}
            aria-label="Remover seleção"
            title="Remover seleção"
            className="rounded-2xl shadow-ambient dark:shadow-[0_18px_40px_rgba(2,8,23,0.35)]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Panel>

        <Panel position="top-left">
          <div className="max-w-xs rounded-[1.25rem] border border-white/80 bg-white/85 p-4 shadow-ambient backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/80 dark:shadow-[0_18px_40px_rgba(2,8,23,0.35)]">
            <p className="font-display text-base font-semibold text-slate-900 dark:text-slate-50">
              Dica rápida
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300/75">
              Arraste os blocos para reorganizar o fluxo. Use os pontos laterais
              para conectar etapas e crie variações.
            </p>
          </div>
        </Panel>

        {nos.length === 0 ? (
          <Panel position="top-center">
            <div className="mt-8 rounded-[1.4rem] border border-dashed border-orange-200 bg-white/90 px-5 py-4 text-center shadow-sm dark:border-slate-700/80 dark:bg-slate-900/88">
              <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
                O quadro está vazio.
              </p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-300/75">
                Escolha uma etapa acima para começar seu funil.
              </p>
            </div>
          </Panel>
        ) : null}
      </ReactFlow>
    </div>
  )
}
