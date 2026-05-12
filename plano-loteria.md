PROMPT MASTER — SISTEMA COMPLETO DE LOTERIA E PROBABILIDADES
=============================================================

Você é um engenheiro de software sênior especializado em matemática combinatória e desenvolvimento de sistemas.
Sua tarefa é criar um sistema web completo, moderno e funcional para geração de jogos de loteria e estudo
de probabilidades, seguindo rigorosamente todas as especificações abaixo.

=============================================================
STACK TECNOLÓGICA OBRIGATÓRIA
=============================================================

- Frontend: HTML5 + CSS3 + JavaScript (Vanilla ES6+) — arquivo único index.html
- Sem dependências externas obrigatórias (exceto Chart.js via CDN para gráficos)
- Design: Dark theme moderno, responsivo, mobile-first
- Ícones: Unicode/Emoji nativos (sem bibliotecas externas)
- Sem backend necessário — toda lógica roda no navegador

=============================================================
ARQUITETURA DO SISTEMA — MÓDULOS OBRIGATÓRIOS
=============================================================

## MÓDULO 1 — MOTOR MATEMÁTICO (mathEngine.js embutido)

Implemente as seguintes funções matemáticas:

function fatorial(n):
  - Calcular n! com suporte a números grandes (use BigInt para n > 20)
  - Retornar 1 para n = 0

function combinacoes(n, k):
  - Fórmula: C(n,k) = n! / (k! * (n-k)!)
  - Usar BigInt para precisão
  - Validar que k <= n

function calcularProbabilidade(totalJogos, totalCombinacoes):
  - Retornar: totalJogos / Number(totalCombinacoes)
  - Formatar como "1 em X.XXX.XXX"

function gerarCombinacaoAleatoria(min, max, quantidade):
  - Usar crypto.getRandomValues() para aleatoriedade criptográfica
  - Garantir números únicos sem repetição
  - Ordenar resultado em ordem crescente

function calcularSoma(numeros[]):
  - Retornar soma de todos os números do array

function verificarPrimos(numeros[]):
  - Retornar subarray apenas com números primos
  - Usar Crivo de Eratóstenes para performance

function verificarFibonacci(numeros[]):
  - Retornar subarray com números da sequência de Fibonacci presentes
  - Fibonacci até 100: [1,1,2,3,5,8,13,21,34,55,89]

function verificarMoldura(numeros[], colunas, linhas):
  - Retornar números que estão nas bordas do grid do volante

=============================================================

## MÓDULO 2 — CONFIGURAÇÃO DAS MODALIDADES

Criar objeto LOTERIAS com as seguintes modalidades:

MEGA_SENA: {
  nome: "Mega-Sena",
  emoji: "🟢",
  minEscolha: 6,
  maxEscolha: 20,
  totalNumeros: 60,
  minAcerto: 4,
  premios: ["Quadra", "Quina", "Sena"],
  grid: { colunas: 10, linhas: 6 },
  corPrimaria: "#209869",
  totalCombinacoes: C(60,6) = 50.063.860
}

LOTOFACIL: {
  nome: "Lotofácil",
  emoji: "🟣",
  minEscolha: 15,
  maxEscolha: 20,
  totalNumeros: 25,
  minAcerto: 11,
  premios: ["11 pontos", "12 pontos", "13 pontos", "14 pontos", "15 pontos"],
  grid: { colunas: 5, linhas: 5 },
  corPrimaria: "#930089",
  totalCombinacoes: C(25,15) = 3.268.760
}

QUINA: {
  nome: "Quina",
  emoji: "🔵",
  minEscolha: 5,
  maxEscolha: 15,
  totalNumeros: 80,
  minAcerto: 2,
  premios: ["Duque", "Terno", "Quadra", "Quina"],
  grid: { colunas: 10, linhas: 8 },
  corPrimaria: "#260085",
  totalCombinacoes: C(80,5) = 24.040.016
}

LOTOMANIA: {
  nome: "Lotomania",
  emoji: "🟠",
  minEscolha: 50,
  maxEscolha: 50,
  totalNumeros: 100,
  minAcerto: 15,
  premios: ["15 a 19 pontos", "20 pontos", "0 pontos (especial)"],
  grid: { colunas: 10, linhas: 10 },
  corPrimaria: "#f78100",
  totalCombinacoes: C(100,50)
}

DUPLA_SENA: {
  nome: "Dupla-Sena",
  emoji: "🔴",
  minEscolha: 6,
  maxEscolha: 15,
  totalNumeros: 50,
  minAcerto: 3,
  premios: ["Terno 1º", "Quadra 1º", "Quina 1º", "Sena 1º", "Terno 2º", "Quadra 2º", "Quina 2º", "Sena 2º"],
  grid: { colunas: 10, linhas: 5 },
  corPrimaria: "#e8000b",
  totalCombinacoes: C(50,6) = 15.890.700
}

=============================================================

## MÓDULO 3 — GERADOR DE JOGOS COM FILTROS

Implementar função principal: gerarJogos(config)

config = {
  modalidade: string,
  quantidadeNumeros: number,      // quantos números o usuário escolhe
  quantidadeJogos: number,        // quantos jogos gerar (1 a 50)
  filtros: {
    intervaloSoma: { min: number, max: number },
    maxPares: number,              // máximo de números pares permitidos
    maxImpares: number,            // máximo de números ímpares permitidos
    maxPrimos: number,             // máximo de primos por jogo
    incluirFibonacci: boolean,     // pelo menos 1 Fibonacci
    maxSequenciais: number,        // max números em sequência (ex: 3,4,5)
    numerosFixos: number[],        // números que DEVEM aparecer
    numerosExcluidos: number[],    // números que NÃO podem aparecer
    repeticaoUltimoConcurso: { min: number, max: number }
  }
}

Lógica de geração:
1. Gerar combinação aleatória com crypto.getRandomValues()
2. Aplicar cada filtro em sequência
3. Se falhar em qualquer filtro, gerar nova combinação (max 10.000 tentativas)
4. Se não conseguir com os filtros, avisar usuário e sugerir flexibilizar
5. Garantir jogos únicos (sem duplicatas entre si)
6. Retornar array de jogos com metadados (soma, pares, ímpares, primos, fibonacci)

=============================================================

## MÓDULO 4 — INTERFACE DO USUÁRIO

### Layout Principal
Criar SPA (Single Page Application) com navegação por abas:

[🎲 Gerador] [📊 Probabilidades] [📈 Análise] [🛡️ Jogo Responsável]

### ABA 1 — GERADOR DE JOGOS

Layout dividido em 3 colunas (desktop) / stack (mobile):

COLUNA ESQUERDA — Configurações:
- Dropdown: Selecionar modalidade (com preview de cores)
- Slider: Quantidade de números (min/max da modalidade)
- Input: Quantidade de jogos (1-50)
- Exibir em tempo real: "Total de combinações: X" e "Probabilidade: 1 em X"

COLUNA CENTRO — Filtros Avançados (accordion expansível):
- [FILTRO SOMA] Range dual-slider: mínimo e máximo da soma
- [FILTRO PAR/ÍMPAR] Inputs: máx pares / máx ímpares
- [FILTRO PRIMOS] Checkbox + input máximo de primos
- [FILTRO FIBONACCI] Toggle: incluir pelo menos 1 número Fibonacci
- [FILTRO SEQUÊNCIAS] Input: máximo de números consecutivos
- [NÚMEROS FIXOS] Tags input: adicionar números fixos (chips)
- [NÚMEROS EXCLUÍDOS] Tags input: adicionar números excluídos (chips)
- Botão: "🔄 Limpar Filtros"

COLUNA DIREITA — Resultados:
- Botão principal: "🎲 GERAR JOGOS" (grande, animado)
- Cards de jogos gerados:
  - Mostrar números em bolinhas coloridas (cor da modalidade)
  - Badge: soma total
  - Badge: X pares / Y ímpares  
  - Badge: Z primos
  - Indicador Fibonacci (⭐ se tiver)
  - Botão copiar jogo
- Botão: "📋 Exportar Todos (TXT)"
- Botão: "🖨️ Imprimir"

### ABA 2 — CALCULADORA DE PROBABILIDADES

Criar calculadora interativa com:

SEÇÃO A — Comparativo de Modalidades:
- Tabela responsiva com todas as modalidades
- Colunas: Modalidade | Combinações | Prob. Jogo Simples | Prob. 10 jogos | Prob. 100 jogos
- Gráfico de barras (Chart.js) comparando probabilidades em escala logarítmica

SEÇÃO B — Calculadora Personalizada:
- Input: Total de números da loteria
- Input: Quantidade a escolher
- Input: Quantos jogos pretende fazer
- Output em tempo real:
  - Total de combinações possíveis
  - Probabilidade individual
  - Probabilidade acumulada (n jogos)
  - Equivalência visual (ex: "é como acertar 7 moedas em cara seguidas")
  - Estimativa de custo (input: valor por jogo)
  - Tempo médio para ganhar (estatisticamente) se jogar 1x por semana

SEÇÃO C — Simulador de Fechamentos:
- Explicar conceito de fechamento matemático
- Mostrar tabela: "Jogando X números, você cobre Y jogos simples"
- Calcular custo vs. ganho esperado para cada fechamento

### ABA 3 — ANÁLISE ESTATÍSTICA

Criar módulo de análise com dados simulados (já que não há API):

SEÇÃO — Simulador Monte Carlo:
- Input: Número de simulações (1.000 a 1.000.000)
- Botão: Executar simulação (async, com progress bar)
- Usar Web Workers se possível para não travar UI
- Output:
  - Gráfico de linha: distribuição de acertos por simulação
  - Histograma: frequência de cada número sorteado
  - Estatísticas: média de acertos, desvio padrão, percentis
  - "Em X simulações, acertou 6 números em Y oportunidades (Z%)"

SEÇÃO — Análise de Filtros:
- Mostrar impacto de cada filtro na quantidade de combinações
- Gráfico pizza: distribuição de pares vs ímpares vs primos nas combinações válidas
- Mostrar "eficiência" dos filtros aplicados

### ABA 4 — JOGO RESPONSÁVEL

Criar página educativa completa:

SEÇÃO — Aviso Legal Proeminente:
- Box destacado (cor âmbar/laranja) com ícone ⚠️
- Texto: "Loterias são jogos de azar. Nenhuma técnica matemática garante ganhos."
- Texto: "O vício em jogos (ludopatia) é reconhecido pela OMS como doença."
- Link: CVV (188) e SENAD

SEÇÃO — Calculadora de Orçamento:
- Input: Renda mensal familiar (R$)
- Slider: % máxima para entretenimento (recomendado: 2-5%)
- Output: Valor máximo recomendado por mês para apostas
- Output: Quantos jogos simples isso representa por modalidade
- Alerta visual se usuário tentar colocar % muito alta

SEÇÃO — Quiz de Autoavaliação:
- 5 perguntas sobre comportamento de jogo
- Score colorido (verde/amarelo/vermelho)
- Orientações baseadas no resultado

SEÇÃO — Desmistificando Mitos:
- Card: "Mito: Números 'atrasados' têm mais chance" → Realidade explicada
- Card: "Mito: Sequências como 1,2,3,4,5,6 nunca saem" → Realidade explicada  
- Card: "Mito: Sonhos e intuição influenciam" → Realidade explicada
- Card: "Mito: Filtros garantem prêmio" → Realidade explicada

=============================================================

## MÓDULO 5 — FEATURES ADICIONAIS DE UX

Implementar:

1. HISTÓRICO LOCAL:
   - Salvar jogos gerados no localStorage
   - Exibir últimos 10 sets gerados com data/hora
   - Botão limpar histórico

2. VOLANTE VISUAL INTERATIVO:
   - Renderizar grid numérico da modalidade selecionada
   - Destacar números gerados com animação
   - Usuário pode clicar para marcar/desmarcar (números fixos)
   - Animação de "revelação" dos números gerados

3. COMPARTILHAMENTO:
   - Gerar texto formatado para WhatsApp
   - Copiar para clipboard com feedback visual

4. MODO ESCURO/CLARO:
   - Toggle no header
   - Persistir preferência no localStorage

5. ANIMAÇÕES:
   - Loading spinner durante geração
   - Animação de "bolinha caindo" ao revelar números
   - Transições suaves entre abas

=============================================================

## MÓDULO 6 — DESIGN SYSTEM

Definir variáveis CSS:

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --bg-card: #1a1a2e;
  --bg-card-hover: #16213e;
  --accent-primary: #7c3aed;
  --accent-secondary: #06b6d4;
  --accent-success: #10b981;
  --accent-warning: #f59e0b;
  --accent-danger: #ef4444;
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-muted: #475569;
  --border: #1e293b;
  --border-light: #334155;
  --shadow: 0 4px 6px -1px rgba(0,0,0,0.5);
  --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.7);
  --radius: 12px;
  --radius-sm: 8px;
  --radius-full: 9999px;
}

Componentes a implementar:
- .bolinha: círculo colorido para exibir número (40px, gradiente, sombra)
- .card: container com glass morphism sutil
- .btn-primary: botão com gradiente roxo/azul e hover animado
- .badge: tag pequena para metadados
- .slider-range: slider customizado com CSS
- .progress-bar: barra de progresso animada
- .tag-chip: chip removível para números fixos/excluídos
- .accordion: seção expansível com animação suave

=============================================================

## MÓDULO 7 — CÓDIGO ESTRUTURAL BASE

Estruturar o arquivo HTML assim:

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <!-- Meta tags, Chart.js CDN, CSS embutido -->
</head>
<body>
  <header><!-- Logo, título, toggle tema --></header>

  <div id="aviso-responsavel"><!-- Banner fixo topo --></div>

  <nav id="abas"><!-- 4 botões de aba --></nav>

  <main>
    <section id="tab-gerador">...</section>
    <section id="tab-probabilidades">...</section>
    <section id="tab-analise">...</section>
    <section id="tab-responsavel">...</section>
  </main>

  <footer><!-- Avisos legais --></footer>

  <script>
    // mathEngine
    // loteriasConfig
    // filtrosEngine
    // uiController
    // storageManager
    // eventListeners
    // init()
  </script>
</body>
</html>

=============================================================

REQUISITOS DE QUALIDADE — OBRIGATÓRIOS
=============================================================

1. Todo o sistema em UM ÚNICO arquivo HTML (index.html)
2. Zero dependências externas exceto Chart.js via CDN
3. Funcionar 100% offline após carregamento inicial
4. Responsivo: funcionar em telas de 320px a 4K
5. Acessibilidade: aria-labels em todos os controles interativos
6. Performance: geração de 50 jogos em menos de 500ms
7. Sem erros no console JavaScript
8. Comentários explicando cada função matemática
9. Validação de todos os inputs antes de processar
10. Mensagens de erro amigáveis em português  =============================================================
## MÓDULO 8 — INTEGRAÇÃO COM API DE RESULTADOS REAIS
=============================================================

API BASE: https://loteriascaixa-api.herokuapp.com/api

MAPEAMENTO DE NOMES (sistema → API):
const API_NOMES = {
  MEGA_SENA:   "megasena",
  LOTOFACIL:   "lotofacil",
  QUINA:       "quina",
  LOTOMANIA:   "lotomania",
  DUPLA_SENA:  "duplasena",
  TIMEMANIA:   "timemania",
  DIADESORTE:  "diadesorte",
  SUPERSETE:   "supersete"
}

-------------------------------------------------------------
FUNÇÃO: buscarUltimoConcurso(modalidade)
-------------------------------------------------------------
- Fazer fetch para: /api/{modalidade}/latest
- Tratar erros de rede com try/catch
- Exibir loading spinner durante requisição
- Cachear resultado no localStorage por 1 hora
  (chave: "cache_{modalidade}_latest", valor: {data, resultado})
- Retornar objeto com:
  {
    concurso: number,
    data: string,
    dezenas: string[],       // já ordenadas
    dezenasOrdemSorteio: string[],  // ordem do sorteio
    acumulou: boolean,
    valorEstimadoProximoConcurso: number,
    premiacoes: []
  }

-------------------------------------------------------------
FUNÇÃO: buscarHistorico(modalidade, limite = 20)
-------------------------------------------------------------
- Buscar /api/{modalidade} (todos os concursos)
- Limitar aos últimos N concursos para performance
- Cachear no localStorage por 6 horas
- Retornar array de concursos

-------------------------------------------------------------
NOVA SEÇÃO NA ABA "ANÁLISE" — DADOS REAIS
-------------------------------------------------------------

SUB-ABA: "📡 Dados Reais"

PAINEL: Último Concurso
- Card exibindo:
  • Número do concurso
  • Data do sorteio
  • Dezenas na ordem do sorteio (bolinhas animadas, uma por uma)
  • Dezenas em ordem crescente
  • Se acumulou: badge vermelho "ACUMULOU 🔥"
  • Estimativa do próximo prêmio formatada em R$
  • Tabela de premiações (faixas, ganhadores, valor por ganhador)
- Botão: "🔄 Atualizar"

PAINEL: Frequência Real (últimos 20 concursos)
- Buscar histórico dos últimos 20 concursos
- Calcular quantas vezes cada dezena apareceu
- Exibir mapa de calor (heatmap) no grid do volante:
  • Verde escuro = dezena "fria" (pouco sorteada)
  • Vermelho = dezena "quente" (muito sorteada)
  • Tooltip ao hover: "Dezena XX apareceu Y vezes nos últimos 20 concursos"
- Gráfico de barras horizontal com ranking de dezenas
- Ordenar por: [Mais frequentes] [Menos frequentes] [Numérica]

PAINEL: Análise de Repetições
- Comparar último concurso com os 5 anteriores
- Mostrar: "X dezenas do último concurso repetiram do penúltimo"
- Gráfico de linha: evolução das repetições ao longo dos concursos
- Estatística: média histórica de repetições por concurso

PAINEL: Verificador de Apostas
- Usuário cola ou digita suas dezenas
- Sistema compara com o último resultado real
- Exibe: quantos acertos, quais dezenas acertou (destacadas)
- Informa em qual faixa de premiação isso se enquadra

-------------------------------------------------------------
INTEGRAÇÃO COM FILTRO DE REPETIÇÃO (Módulo 3 atualizado)
-------------------------------------------------------------

No filtro "repeticaoUltimoConcurso" do gerador:
- Ao invés de dados simulados, buscar resultado REAL via API
- Exibir quais foram as dezenas do último concurso real
- Filtrar jogos gerados respeitando min/max de repetições
  com base nas dezenas reais sorteadas
- Mostrar aviso: "Filtro baseado no concurso #XXXX de DD/MM/AAAA"

-------------------------------------------------------------
TRATAMENTO DE ERROS E FALLBACK
-------------------------------------------------------------

Se a API estiver indisponível:
1. Verificar se há cache válido no localStorage → usar cache
2. Se não houver cache → exibir mensagem:
   "⚠️ API temporariamente indisponível. 
    Os filtros de repetição usarão dados simulados.
    Tente novamente mais tarde."
3. Modo offline: todas as outras funcionalidades continuam
   funcionando normalmente sem a API
4. Botão "Tentar novamente" visível

-------------------------------------------------------------
CORS E CONFIGURAÇÃO DE FETCH
-------------------------------------------------------------

Usar fetch com configuração:
fetch(url, {
  method: 'GET',
  headers: { 'Accept': 'application/json' },
  signal: AbortSignal.timeout(8000)  // timeout 8 segundos
})

Se houver erro de CORS, usar proxy público como fallback:
const PROXY = "https://api.allorigins.win/raw?url="
const urlComProxy = PROXY + encodeURIComponent(urlOriginal)

-------------------------------------------------------------
INDICADOR DE STATUS DA API
-------------------------------------------------------------

No header do sistema, adicionar badge:
- 🟢 "API Online" → quando última requisição funcionou
- 🔴 "API Offline" → quando há erro de conexão
- 🟡 "Dados em Cache" → quando usando cache local
- Timestamp: "Atualizado há X minutos"

=============================================================  crie esse sistema de loteria 