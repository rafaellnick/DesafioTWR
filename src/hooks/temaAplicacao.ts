import { useEffect, useState } from "react"

export type TemaAplicacao = "claro" | "escuro"

const CHAVE_TEMA_APLICACAO = "desafio-twr:tema-aplicacao"

export function useTemaAplicacao() {
  const [tema, setTema] = useState<TemaAplicacao>(() => obterTemaInicial())

  useEffect(() => {
    aplicarTemaNoDocumento(tema)

    try {
      window.localStorage.setItem(CHAVE_TEMA_APLICACAO, tema)
    } catch {
      // Se o navegador bloquear persistencia, o app continua funcional.
    }
  }, [tema])

  return {
    tema,
    temaEscuroAtivo: tema === "escuro",
    alternarTema: () =>
      setTema((temaAtual) => (temaAtual === "escuro" ? "claro" : "escuro")),
  }
}

function obterTemaInicial(): TemaAplicacao {
  if (typeof window === "undefined") {
    return "claro"
  }

  try {
    const temaSalvo = window.localStorage.getItem(CHAVE_TEMA_APLICACAO)

    if (temaSalvo === "claro" || temaSalvo === "escuro") {
      return temaSalvo
    }
  } catch {
    // Ignora falhas de leitura e usa a preferencia do sistema.
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "escuro"
    : "claro"
}

function aplicarTemaNoDocumento(tema: TemaAplicacao) {
  if (typeof document === "undefined") {
    return
  }

  const elementoRaiz = document.documentElement
  const temaEscuroAtivo = tema === "escuro"

  elementoRaiz.classList.toggle("dark", temaEscuroAtivo)
  elementoRaiz.style.colorScheme = temaEscuroAtivo ? "dark" : "light"
}
