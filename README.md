# DesafioTWR

Projeto para o desafio técnico de estágio da The White Rabbit

## Visão Geral

O projeto tem as seguintes funções:

- criar etapas como anúncio, página de captura, formulário, pagamento e agradecimento
- conectar etapas visualmente com React Flow
- editar textos e métricas simuladas de cada etapa
- remover e duplicar etapas
- salvar o estado do funil no navegador
- alternar entre modo claro e modo escuro

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- React Flow
- shadcn/ui

## Como Rodar

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Para gerar a versão final:

```bash
npm run build
```

## Estrutura Principal

- `src/App.tsx`: composição principal da interface
- `src/hooks/construtorFunil.ts`: estado e regras do construtor de funil
- `src/lib/funil.ts`: tipos, presets e utilitários do domínio
- `src/lib/persistenciaFunil.ts`: leitura e escrita segura no `localStorage`
- `src/components/funil`: cabeçalho, biblioteca, quadro e inspetor
