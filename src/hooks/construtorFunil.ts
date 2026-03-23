import {
  startTransition,
  useCallback,
  useMemo,
  useState,
} from "react"
import {
  addEdge,
  type Connection,
  type OnEdgesDelete,
  type OnSelectionChangeFunc,
  type OnNodesDelete,
  useEdgesState,
  useNodesState,
} from "@xyflow/react"

import {
  calcularTaxaConversao,
  criarConexaoEtapa,
  criarEstadoExemplo,
  criarNoEtapa,
  MAPA_PRESETS_ETAPAS,
  obterPosicaoSugerida,
  type ConexaoFunil,
  type DadosNoFunil,
  type NoFunil,
  type TipoEtapa,
} from "@/lib/funil"

export interface ResumoFunil {
  etapas: number
  conexoes: number
  acessos: number
  conversoes: number
  receita: number
  taxaConversao: number
}

export function useConstrutorFunil() {
  const estadoInicial = useMemo(() => criarEstadoExemplo(), [])

  const [nos, setNos, aoMudarNos] = useNodesState<NoFunil>(estadoInicial.nos)
  const [conexoes, setConexoes, aoMudarConexoes] = useEdgesState<ConexaoFunil>(
    estadoInicial.conexoes,
  )
  const [idNoSelecionado, setIdNoSelecionado] = useState<string | null>(
    estadoInicial.nos[0]?.id ?? null,
  )
  const [idConexaoSelecionada, setIdConexaoSelecionada] = useState<string | null>(null)

  const noSelecionado = useMemo(
    () => nos.find((node) => node.id === idNoSelecionado) ?? null,
    [idNoSelecionado, nos],
  )
  const conexaoSelecionada = useMemo(
    () => conexoes.find((edge) => edge.id === idConexaoSelecionada) ?? null,
    [conexoes, idConexaoSelecionada],
  )

  const resumo = useMemo(() => criarResumo(nos, conexoes), [conexoes, nos])

  const limparSelecao = useCallback(() => {
    setIdNoSelecionado(null)
    setIdConexaoSelecionada(null)
  }, [])

  const atualizarDadosNoSelecionado = useCallback(
    (updater: (data: DadosNoFunil) => DadosNoFunil) => {
      if (!idNoSelecionado) {
        return
      }

      setNos((nosAtuais) =>
        nosAtuais.map((node) =>
          node.id === idNoSelecionado
            ? {
                ...node,
                data: updater(node.data),
              }
            : node,
        ),
      )
    },
    [idNoSelecionado, setNos],
  )

  const atualizarNoSelecionado = useCallback(
    (patch: Partial<DadosNoFunil>) => {
      atualizarDadosNoSelecionado((data) => ({
        ...data,
        ...patch,
      }))
    },
    [atualizarDadosNoSelecionado],
  )

  const conectarEtapas = useCallback(
    (conexao: Connection) => {
      if (!conexao.source || !conexao.target) {
        return
      }

      setConexoes((conexoesAtuais) =>
        addEdge(
          criarConexaoEtapa(conexao.source, conexao.target, conexao),
          conexoesAtuais,
        ),
      )
      setIdConexaoSelecionada(null)
    },
    [setConexoes],
  )

  const adicionarEtapa = useCallback(
    (tipoEtapa: TipoEtapa) => {
      const noAncora = nos.find((node) => node.id === idNoSelecionado) ?? null
      const ramificacoesAncora = noAncora
        ? conexoes.filter((edge) => edge.source === noAncora.id).length
        : 0

      const posicao = noAncora
        ? {
            x: noAncora.position.x + 340,
            y:
              noAncora.position.y +
              (ramificacoesAncora === 0 ? 0 : ramificacoesAncora * 150 - 90),
          }
        : obterPosicaoSugerida(nos.length)

      const novoNo = criarNoEtapa(tipoEtapa, nos.length, posicao)

      startTransition(() => {
        setNos((nosAtuais) => [...nosAtuais, novoNo])

        if (noAncora) {
          setConexoes((conexoesAtuais) => [
            ...conexoesAtuais,
            criarConexaoEtapa(noAncora.id, novoNo.id),
          ])
        }
      })

      setIdNoSelecionado(novoNo.id)
      setIdConexaoSelecionada(null)
    },
    [conexoes, nos, idNoSelecionado, setConexoes, setNos],
  )

  const duplicarEtapaSelecionada = useCallback(() => {
    if (!noSelecionado) {
      return
    }

    const noDuplicado = criarNoEtapa(noSelecionado.data.tipoEtapa, nos.length, {
      x: noSelecionado.position.x + 40,
      y: noSelecionado.position.y + 40,
    })

    noDuplicado.data = {
      ...noSelecionado.data,
      metricas: { ...noSelecionado.data.metricas },
      titulo: `${noSelecionado.data.titulo} (copia)`,
    }

    setNos((nosAtuais) => [...nosAtuais, noDuplicado])
    setIdNoSelecionado(noDuplicado.id)
    setIdConexaoSelecionada(null)
  }, [nos.length, noSelecionado, setNos])

  const removerSelecao = useCallback(() => {
    if (idNoSelecionado) {
      setNos((nosAtuais) => nosAtuais.filter((node) => node.id !== idNoSelecionado))
      setConexoes((conexoesAtuais) =>
        conexoesAtuais.filter(
          (edge) => edge.source !== idNoSelecionado && edge.target !== idNoSelecionado,
        ),
      )
      limparSelecao()
      return
    }

    if (idConexaoSelecionada) {
      setConexoes((conexoesAtuais) =>
        conexoesAtuais.filter((edge) => edge.id !== idConexaoSelecionada),
      )
      setIdConexaoSelecionada(null)
    }
  }, [limparSelecao, idConexaoSelecionada, idNoSelecionado, setConexoes, setNos])

  const carregarExemplo = useCallback(() => {
    const exemplo = criarEstadoExemplo()

    startTransition(() => {
      setNos(exemplo.nos)
      setConexoes(exemplo.conexoes)
    })

    setIdNoSelecionado(exemplo.nos[0]?.id ?? null)
    setIdConexaoSelecionada(null)
  }, [setConexoes, setNos])

  const limparQuadro = useCallback(() => {
    startTransition(() => {
      setNos([])
      setConexoes([])
    })

    limparSelecao()
  }, [limparSelecao, setConexoes, setNos])

  const alterarTipoEtapaSelecionada = useCallback(
    (proximoTipo: string) => {
      if (!noSelecionado) {
        return
      }

      const proximoPreset = MAPA_PRESETS_ETAPAS[proximoTipo as TipoEtapa]
      const presetAnterior = MAPA_PRESETS_ETAPAS[noSelecionado.data.tipoEtapa]

      atualizarDadosNoSelecionado((data) => ({
        ...data,
        tipoEtapa: proximoPreset.tipo,
        corDestaque: proximoPreset.corDestaque,
        corDestaqueSuave: proximoPreset.corDestaqueSuave,
        rotulo: proximoPreset.rotulo,
        canal: data.canal === presetAnterior.canal ? proximoPreset.canal : data.canal,
        titulo: data.titulo === presetAnterior.titulo ? proximoPreset.titulo : data.titulo,
        descricao:
          data.descricao === presetAnterior.descricao
            ? proximoPreset.descricao
            : data.descricao,
      }))
    },
    [atualizarDadosNoSelecionado, noSelecionado],
  )

  const atualizarMetricaEtapaSelecionada = useCallback(
    (chave: keyof DadosNoFunil["metricas"], valorBruto: string) => {
      const valorConvertido = Number(valorBruto)
      const proximoValor = Number.isFinite(valorConvertido)
        ? Math.max(0, valorConvertido)
        : 0

      atualizarDadosNoSelecionado((data) => ({
        ...data,
        metricas: {
          ...data.metricas,
          [chave]: proximoValor,
        },
      }))
    },
    [atualizarDadosNoSelecionado],
  )

  const lidarMudancaSelecao: OnSelectionChangeFunc<NoFunil, ConexaoFunil> = useCallback(
    ({ nodes: proximosNosSelecionados, edges: proximasConexoesSelecionadas }) => {
      setIdNoSelecionado(proximosNosSelecionados[0]?.id ?? null)
      setIdConexaoSelecionada(proximasConexoesSelecionadas[0]?.id ?? null)
    },
    [],
  )

  const lidarExclusaoNos: OnNodesDelete<NoFunil> = useCallback(
    (nosExcluidos) => {
      if (nosExcluidos.some((node) => node.id === idNoSelecionado)) {
        setIdNoSelecionado(null)
      }
    },
    [idNoSelecionado],
  )

  const lidarExclusaoConexoes: OnEdgesDelete<ConexaoFunil> = useCallback(
    (conexoesExcluidas) => {
      if (conexoesExcluidas.some((edge) => edge.id === idConexaoSelecionada)) {
        setIdConexaoSelecionada(null)
      }
    },
    [idConexaoSelecionada],
  )

  const selecionarNo = useCallback((idNo: string) => {
    setIdNoSelecionado(idNo)
    setIdConexaoSelecionada(null)
  }, [])

  return {
    nos,
    conexoes,
    idNoSelecionado,
    idConexaoSelecionada,
    noSelecionado,
    conexaoSelecionada,
    resumo,
    aoMudarNos,
    aoMudarConexoes,
    adicionarEtapa,
    limparQuadro,
    limparSelecao,
    conectarEtapas,
    alterarTipoEtapaSelecionada,
    duplicarEtapaSelecionada,
    lidarExclusaoConexoes,
    lidarExclusaoNos,
    lidarMudancaSelecao,
    carregarExemplo,
    removerSelecao,
    selecionarNo,
    atualizarNoSelecionado,
    atualizarMetricaEtapaSelecionada,
  }
}

function criarResumo(nodes: NoFunil[], edges: ConexaoFunil[]): ResumoFunil {
  const totais = nodes.reduce(
    (acc, node) => {
      acc.acessos += node.data.metricas.acessos
      acc.conversoes += node.data.metricas.conversoes
      acc.receita += node.data.metricas.receita
      return acc
    },
    { acessos: 0, conversoes: 0, receita: 0 },
  )

  return {
    etapas: nodes.length,
    conexoes: edges.length,
    acessos: totais.acessos,
    conversoes: totais.conversoes,
    receita: totais.receita,
    taxaConversao: calcularTaxaConversao(totais.acessos, totais.conversoes),
  }
}
