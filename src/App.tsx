import { BibliotecaEtapas } from "@/components/funil/bibliotecaEtapas"
import { CabecalhoVisaoGeral } from "@/components/funil/cabecalho"
import { InspetorFunil } from "@/components/funil/inspetorFunil"
import { QuadroFunil } from "@/components/funil/quadroFunil"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useConstrutorFunil } from "@/hooks/construtorFunil"
import { useTemaAplicacao } from "@/hooks/temaAplicacao"

export default function App() {
  const funil = useConstrutorFunil()
  const tema = useTemaAplicacao()
  const temSelecaoAtiva = Boolean(funil.idNoSelecionado || funil.idConexaoSelecionada)

  return (
    <div className="relative min-h-screen overflow-hidden transition-colors">
      <DecoracaoFundo />

      <main className="relative mx-auto flex min-h-screen w-full max-w-[1560px] flex-col gap-6 px-4 py-6 md:px-8 lg:px-10">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_400px]">
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-[1.75rem] border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(107,54,19,0.12)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70 dark:shadow-[0_24px_80px_rgba(2,8,23,0.48)]">
              <CabecalhoVisaoGeral
                resumo={funil.resumo}
                temaEscuroAtivo={tema.temaEscuroAtivo}
                aoAlternarTema={tema.alternarTema}
                aoCarregarExemplo={funil.carregarExemplo}
              />

              <CardContent className="space-y-5 pt-6">
                <BibliotecaEtapas aoAdicionarEtapa={funil.adicionarEtapa} />
                <Separator className="bg-orange-100/90" />
                <QuadroFunil
                  nos={funil.nos}
                  conexoes={funil.conexoes}
                  aoMudarNos={funil.aoMudarNos}
                  aoMudarConexoes={funil.aoMudarConexoes}
                  aoConectar={funil.conectarEtapas}
                  aoClicarFora={funil.limparSelecao}
                  temaEscuroAtivo={tema.temaEscuroAtivo}
                  temSelecao={temSelecaoAtiva}
                  aoLimparQuadro={funil.limparQuadro}
                  aoRemoverSelecao={funil.removerSelecao}
                  aoMudarSelecao={funil.lidarMudancaSelecao}
                  aoExcluirNos={funil.lidarExclusaoNos}
                  aoExcluirConexoes={funil.lidarExclusaoConexoes}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <InspetorFunil
              nos={funil.nos}
              idNoSelecionado={funil.idNoSelecionado}
              noSelecionado={funil.noSelecionado}
              conexaoSelecionada={funil.conexaoSelecionada}
              resumo={funil.resumo}
              aoSelecionarNo={funil.selecionarNo}
              aoAtualizarNoSelecionado={funil.atualizarNoSelecionado}
              aoAlterarTipoEtapaSelecionada={funil.alterarTipoEtapaSelecionada}
              aoAtualizarMetricaEtapaSelecionada={funil.atualizarMetricaEtapaSelecionada}
              aoDuplicarEtapaSelecionada={funil.duplicarEtapaSelecionada}
              aoRemoverSelecao={funil.removerSelecao}
            />
          </div>
        </section>
      </main>
    </div>
  )
}

function DecoracaoFundo() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[-12rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-500/[0.18]" />
      <div className="absolute right-[-10rem] top-20 h-[24rem] w-[24rem] rounded-full bg-amber-200/40 blur-3xl dark:bg-cyan-400/[0.12]" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-cyan-200/20 blur-3xl dark:bg-indigo-500/[0.15]" />
    </div>
  )
}
