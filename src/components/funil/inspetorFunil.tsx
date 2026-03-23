import { Copy, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import type { ResumoFunil } from "@/hooks/construtorFunil"
import {
  calcularTaxaConversao,
  BIBLIOTECA_ETAPAS,
  type ConexaoFunil,
  type DadosNoFunil,
  type NoFunil,
  formatarMoeda,
  formatarNumeroCompacto,
  formatarPercentual,
} from "@/lib/funil"
import { cn } from "@/lib/utils"

interface InspetorFunilProps {
  nos: NoFunil[]
  idNoSelecionado: string | null
  noSelecionado: NoFunil | null
  conexaoSelecionada: ConexaoFunil | null
  resumo: ResumoFunil
  aoSelecionarNo: (idNo: string) => void
  aoAtualizarNoSelecionado: (patch: Partial<DadosNoFunil>) => void
  aoAlterarTipoEtapaSelecionada: (proximoTipo: string) => void
  aoAtualizarMetricaEtapaSelecionada: (
    chave: keyof DadosNoFunil["metricas"],
    valorBruto: string,
  ) => void
  aoDuplicarEtapaSelecionada: () => void
  aoRemoverSelecao: () => void
}

export function InspetorFunil({
  nos,
  idNoSelecionado,
  noSelecionado,
  conexaoSelecionada,
  resumo,
  aoSelecionarNo,
  aoAtualizarNoSelecionado,
  aoAlterarTipoEtapaSelecionada,
  aoAtualizarMetricaEtapaSelecionada,
  aoDuplicarEtapaSelecionada,
  aoRemoverSelecao,
}: InspetorFunilProps) {
  const rotuloOrigemConexao = conexaoSelecionada
    ? nos.find((node) => node.id === conexaoSelecionada.source)?.data.titulo ?? null
    : null
  const rotuloDestinoConexao = conexaoSelecionada
    ? nos.find((node) => node.id === conexaoSelecionada.target)?.data.titulo ?? null
    : null

  return (
    <Card className="sticky top-6 overflow-hidden border-white/70 bg-white/70 shadow-[0_24px_80px_rgba(107,54,19,0.14)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/[0.72] dark:shadow-[0_24px_80px_rgba(2,8,23,0.5)]">
      <FundoPainelInspetor />

      <CardHeader className="relative border-b border-orange-100/80 pb-5 dark:border-slate-800/80">
        <Badge className="w-fit dark:border-orange-300/20 dark:bg-orange-400/[0.15] dark:text-orange-50">
          Painel de edição
        </Badge>
        <CardTitle className="dark:text-slate-50">
          {noSelecionado
            ? noSelecionado.data.titulo
            : conexaoSelecionada
              ? "Conexão selecionada"
              : "Visão geral"}
        </CardTitle>
        <CardDescription className="dark:text-slate-300/80">
          {noSelecionado
            ? "Ajuste tipo, textos e dados simulados desta etapa."
            : conexaoSelecionada
              ? "Use este painel para remover ligações entre etapas."
              : "Selecione uma etapa ou conexão no canvas para editar."}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-6 pt-6">
        {noSelecionado ? (
          <EditorEtapaSelecionada
            noSelecionado={noSelecionado}
            aoAlterarTipoEtapaSelecionada={aoAlterarTipoEtapaSelecionada}
            aoAtualizarNoSelecionado={aoAtualizarNoSelecionado}
            aoAtualizarMetricaEtapaSelecionada={aoAtualizarMetricaEtapaSelecionada}
            aoDuplicarEtapaSelecionada={aoDuplicarEtapaSelecionada}
            aoRemoverSelecao={aoRemoverSelecao}
          />
        ) : conexaoSelecionada ? (
          <PainelConexaoSelecionada
            rotuloOrigem={rotuloOrigemConexao}
            rotuloDestino={rotuloDestinoConexao}
            aoRemoverSelecao={aoRemoverSelecao}
          />
        ) : (
          <EstadoVazioInspetor
            nos={nos}
            idNoSelecionado={idNoSelecionado}
            resumo={resumo}
            aoSelecionarNo={aoSelecionarNo}
          />
        )}
      </CardContent>
    </Card>
  )
}

function FundoPainelInspetor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,0.24),transparent_32%),radial-gradient(circle_at_left_center,rgba(249,115,22,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.88),rgba(255,247,237,0.82))] dark:bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_left_center,rgba(56,189,248,0.12),transparent_24%),linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.9))]" />
      <div className="absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(251,146,60,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(251,146,60,0.08)_1px,transparent_1px)] [background-size:28px_28px] dark:opacity-30 dark:[background-image:linear-gradient(rgba(71,85,105,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.28)_1px,transparent_1px)]" />
      <div className="absolute -right-14 top-8 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-400/[0.18]" />
      <div className="absolute -left-20 bottom-20 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl dark:bg-cyan-400/[0.14]" />
    </div>
  )
}

interface EditorEtapaSelecionadaProps {
  noSelecionado: NoFunil
  aoAlterarTipoEtapaSelecionada: (proximoTipo: string) => void
  aoAtualizarNoSelecionado: (patch: Partial<DadosNoFunil>) => void
  aoAtualizarMetricaEtapaSelecionada: (
    chave: keyof DadosNoFunil["metricas"],
    valorBruto: string,
  ) => void
  aoDuplicarEtapaSelecionada: () => void
  aoRemoverSelecao: () => void
}

function EditorEtapaSelecionada({
  noSelecionado,
  aoAlterarTipoEtapaSelecionada,
  aoAtualizarNoSelecionado,
  aoAtualizarMetricaEtapaSelecionada,
  aoDuplicarEtapaSelecionada,
  aoRemoverSelecao,
}: EditorEtapaSelecionadaProps) {
  const taxaConversao = calcularTaxaConversao(
    noSelecionado.data.metricas.acessos,
    noSelecionado.data.metricas.conversoes,
  )

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="etapa-tipo">Tipo de etapa</Label>
          <Select
            value={noSelecionado.data.tipoEtapa}
            onValueChange={aoAlterarTipoEtapaSelecionada}
          >
            <SelectTrigger id="etapa-tipo">
              <SelectValue placeholder="Escolha o tipo" />
            </SelectTrigger>
            <SelectContent>
              {BIBLIOTECA_ETAPAS.map((preset) => (
                <SelectItem key={preset.tipo} value={preset.tipo}>
                  {preset.titulo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="etapa-canal">Canal/contexto</Label>
          <Input
            id="etapa-canal"
            value={noSelecionado.data.canal}
            onChange={(event) =>
              aoAtualizarNoSelecionado({
                canal: event.target.value,
              })
            }
            placeholder="Ex.: Meta Ads"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="etapa-titulo">Título da etapa</Label>
        <Input
          id="etapa-titulo"
          value={noSelecionado.data.titulo}
          onChange={(event) =>
            aoAtualizarNoSelecionado({
              titulo: event.target.value,
            })
          }
          placeholder="Nome visível no funil"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="etapa-descricao">Descricao</Label>
        <Textarea
          id="etapa-descricao"
          value={noSelecionado.data.descricao}
          onChange={(event) =>
            aoAtualizarNoSelecionado({
              descricao: event.target.value,
            })
          }
          placeholder="Explique o papel desta etapa."
        />
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
              Desempenho ilustrativo
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-300/75">
              Edite os valores para simular o resultado desta etapa.
            </p>
          </div>
          <Badge variant="outline">{formatarPercentual(taxaConversao)} de taxa</Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="etapa-acessos">Acessos</Label>
            <Input
              id="etapa-acessos"
              type="number"
              min={0}
              value={noSelecionado.data.metricas.acessos}
              onChange={(event) =>
                aoAtualizarMetricaEtapaSelecionada("acessos", event.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="etapa-conversoes">Conversoes</Label>
            <Input
              id="etapa-conversoes"
              type="number"
              min={0}
              value={noSelecionado.data.metricas.conversoes}
              onChange={(event) =>
                aoAtualizarMetricaEtapaSelecionada("conversoes", event.target.value)
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="etapa-receita">Receita estimada</Label>
          <Input
            id="etapa-receita"
            type="number"
            min={0}
            value={noSelecionado.data.metricas.receita}
            onChange={(event) =>
              aoAtualizarMetricaEtapaSelecionada("receita", event.target.value)
            }
          />
        </div>
      </div>

      <Separator />

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={aoDuplicarEtapaSelecionada}>
          <Copy className="h-4 w-4" />
          Duplicar etapa
        </Button>
        <Button variant="destructive" onClick={aoRemoverSelecao}>
          <Trash2 className="h-4 w-4" />
          Remover etapa
        </Button>
      </div>
    </>
  )
}

interface PainelConexaoSelecionadaProps {
  rotuloOrigem: string | null
  rotuloDestino: string | null
  aoRemoverSelecao: () => void
}

function PainelConexaoSelecionada({
  rotuloOrigem,
  rotuloDestino,
  aoRemoverSelecao,
}: PainelConexaoSelecionadaProps) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-orange-100 bg-orange-50/70 p-5 dark:border-slate-700/80 dark:bg-slate-900/[0.76]">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600">
          Caminho ativo
        </p>
        <p className="mt-3 font-display text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {rotuloOrigem ?? "Origem"} para {rotuloDestino ?? "Destino"}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300/75">
          Esta conexão representa a passagem do usuario entre duas etapas do funil.
        </p>
      </div>

      <Button variant="destructive" className="w-full" onClick={aoRemoverSelecao}>
        <Trash2 className="h-4 w-4" />
        Remover conexão
      </Button>
    </div>
  )
}

interface EstadoVazioInspetorProps {
  nos: NoFunil[]
  idNoSelecionado: string | null
  resumo: ResumoFunil
  aoSelecionarNo: (idNo: string) => void
}

function EstadoVazioInspetor({
  nos,
  idNoSelecionado,
  resumo,
  aoSelecionarNo,
}: EstadoVazioInspetorProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700/80 dark:bg-slate-900/[0.78]">
        <p className="font-display text-xl font-semibold text-slate-900 dark:text-slate-50">
          Como usar
        </p>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300/75">
          <p>1. Adicione etapas a partir da biblioteca para montar o funil.</p>
          <p>2. Arraste cada bloco para organizar o fluxo visual.</p>
          <p>3. Conecte os pontos laterais para representar a jornada.</p>
          <p>4. Clique em uma etapa para editar textos, contexto e dados.</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-display text-lg font-semibold text-slate-900 dark:text-slate-50">
          Etapas atuais
        </p>
        <div className="grid gap-3">
          {nos.length > 0 ? (
            nos.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => aoSelecionarNo(node.id)}
                className={cn(
                  "flex items-center justify-between rounded-[1.25rem] border border-white/80 bg-white/80 px-4 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/[0.72] dark:hover:bg-slate-900 dark:hover:shadow-[0_18px_34px_rgba(2,8,23,0.32)]",
                  idNoSelecionado === node.id &&
                    "border-orange-300 ring-2 ring-orange-200 dark:border-orange-400 dark:ring-orange-400/30",
                )}
              >
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-50">
                    {node.data.titulo}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-300/75">
                    {node.data.canal}
                  </p>
                </div>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${node.data.corDestaque}, ${node.data.corDestaqueSuave})`,
                  }}
                />
              </button>
            ))
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-300/75">
              Nenhuma etapa criada. Use a biblioteca ao lado do quadro para
              começar.
            </p>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid gap-4 sm:grid-cols-2">
        <BlocoInformacao
          label="Conversoes somadas"
          value={formatarNumeroCompacto(resumo.conversoes)}
        />
        <BlocoInformacao label="Receita total" value={formatarMoeda(resumo.receita)} />
      </div>
    </div>
  )
}

function BlocoInformacao({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/80 bg-white/80 p-4 shadow-sm dark:border-slate-700/80 dark:bg-slate-900/[0.72]">
      <p className="text-sm text-slate-500 dark:text-slate-300/75">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-slate-50">
        {value}
      </p>
    </div>
  )
}
