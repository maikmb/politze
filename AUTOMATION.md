# Sistema de Automação - Politze

Este documento descreve o sistema de automação implementado no Politze para carregar e atualizar dados automaticamente.

## Visão Geral

O sistema de automação é composto por três processos principais:

1. **Carregamento de Dados de Políticos** - Importa informações do Portal da Transparência
2. **Carregamento de Notícias** - Busca notícias de feeds RSS e APIs
3. **Cálculo de Rankings** - Calcula e atualiza rankings baseados em métricas de transparência

## Scripts Disponíveis

### 1. Carregar Dados de Políticos
```bash
npm run load-politicians
```

**Arquivo**: `scripts/loadPoliticians.ts`

**Funcionalidade**:
- Importa dados de políticos do Portal da Transparência
- Atualiza informações de políticos existentes
- Cria novos registros para políticos novos
- Carrega dados de:
  - Informações pessoais (nome, CPF, partido, cargo)
  - Orçamento total e gasto
  - Número de propostas e aprovações
  - Taxa de presença

**Integração em Produção**:
```javascript
// Obter chave de API em: https://api.portaldatransparencia.gov.br/
const API_KEY = process.env.TRANSPARENCIA_API_KEY

// Exemplo de chamada à API
const response = await fetch(
  'https://api.portaldatransparencia.gov.br/api-de-dados/servidores',
  {
    headers: {
      'chave-api-dados': API_KEY
    }
  }
)
```

### 2. Carregar Notícias
```bash
npm run load-news
```

**Arquivo**: `scripts/loadNews.ts`

**Funcionalidade**:
- Carrega notícias de fontes RSS/APIs
- Associa notícias a políticos relevantes
- Evita duplicação de notícias
- Categoriza com tags

**Fontes Recomendadas**:
- G1 Política: `https://g1.globo.com/rss/g1/politica/`
- Folha Política: `https://www1.folha.uol.com.br/rss/poder.xml`
- Estadão Política: `https://politica.estadao.com.br/rss/index.xml`
- News API: `https://newsapi.org/` (requer chave de API)

**Exemplo de Integração RSS**:
```javascript
// Instalar: npm install rss-parser
import Parser from 'rss-parser'

const parser = new Parser()
const feed = await parser.parseURL('https://g1.globo.com/rss/g1/politica/')

for (const item of feed.items) {
  // Processar notícia
  await prisma.news.create({
    data: {
      title: item.title,
      content: item.content,
      sourceUrl: item.link,
      publishedAt: new Date(item.pubDate),
      // ...
    }
  })
}
```

### 3. Calcular Rankings
```bash
npm run calculate-rankings
```

**Arquivo**: `scripts/calculateRankings.ts`

**Funcionalidade**:
- Calcula pontuação para cada político baseado em:
  - Taxa de presença (30%)
  - Taxa de aprovação de propostas (40%)
  - Eficiência no uso do orçamento (30%)
- Atualiza posição no ranking
- Ordena políticos por pontuação

**Algoritmo de Ranking**:
```
score = (presenceRate * 0.3) + (approvalRate * 0.4) + (budgetEfficiency * 0.3)
```

### 4. Automação Completa
```bash
npm run automation
```

**Arquivo**: `scripts/runAutomation.ts`

**Funcionalidade**:
- Executa todos os scripts em sequência:
  1. Carrega dados de políticos
  2. Carrega notícias
  3. Calcula rankings

## API de Automação

### Endpoint de Trigger

**URL**: `POST /api/automation/trigger`

**Descrição**: Aciona a execução de todos os processos de automação em background.

**Uso**:
```bash
curl -X POST http://localhost:3000/api/automation/trigger
```

**Resposta**:
```json
{
  "message": "Automation started successfully",
  "status": "processing"
}
```

**Segurança**: Em produção, adicione autenticação para proteger este endpoint.

## Agendamento com Cron

### Linux/Mac

Edite o crontab:
```bash
crontab -e
```

Adicione uma linha para executar diariamente às 3h da manhã:
```
0 3 * * * cd /caminho/do/politze && npm run automation
```

### Windows

Use o Agendador de Tarefas do Windows ou crie um script PowerShell:
```powershell
# automation.ps1
cd C:\caminho\do\politze
npm run automation
```

Agende no Agendador de Tarefas.

### Docker/Kubernetes

Crie um CronJob no Kubernetes:
```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: politze-automation
spec:
  schedule: "0 3 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: automation
            image: politze:latest
            command: ["npm", "run", "automation"]
          restartPolicy: OnFailure
```

## Integração com Serviços Cloud

### Vercel Cron Jobs

Adicione ao `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/automation/trigger",
    "schedule": "0 3 * * *"
  }]
}
```

### AWS Lambda + EventBridge

1. Deploy scripts como Lambda functions
2. Configure EventBridge para executar periodicamente
3. Conecte ao banco RDS

### GitHub Actions

Crie `.github/workflows/automation.yml`:
```yaml
name: Daily Data Automation

on:
  schedule:
    - cron: '0 3 * * *'
  workflow_dispatch:

jobs:
  automation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run automation
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## Monitoramento e Logs

### Logs dos Scripts

Os scripts produzem logs detalhados:
```
🗞️  Starting news feed import...
✅ News import completed: 15 created, 3 skipped

👥 Starting politicians data import...
✅ Politicians import completed: 5 created, 10 updated

📊 Starting ranking calculation...
✅ Ranking calculation completed: 15 politicians updated
```

### Monitoramento em Produção

Recomendações:
- Use ferramentas como Sentry para capturar erros
- Configure alertas para falhas de execução
- Monitore tempo de execução dos scripts
- Acompanhe métricas de API (rate limits, erros)

## Desenvolvimento e Testes

### Testando Localmente

1. Certifique-se de que o banco está rodando:
```bash
docker-compose up -d
```

2. Execute scripts individuais:
```bash
npm run load-politicians
npm run load-news
npm run calculate-rankings
```

3. Verifique os dados no Prisma Studio:
```bash
npx prisma studio
```

### Dados Mock vs Produção

Os scripts incluem dados mock para desenvolvimento. Para produção:

1. Obtenha chaves de API necessárias
2. Substitua chamadas mock por chamadas reais às APIs
3. Configure variáveis de ambiente para as chaves
4. Teste com dados reais em ambiente de staging

## Variáveis de Ambiente

Adicione ao `.env`:
```bash
# Portal da Transparência
TRANSPARENCIA_API_KEY=sua-chave-aqui

# News API (opcional)
NEWS_API_KEY=sua-chave-aqui

# RSS Feed URLs (opcional)
NEWS_RSS_FEEDS=url1,url2,url3
```

## Limites e Considerações

### Rate Limits

- Portal da Transparência: Verificar documentação oficial
- News APIs: Geralmente 100-1000 requisições/dia na versão gratuita
- RSS Feeds: Sem limite, mas respeite intervalo entre requests

### Performance

- Execute em horários de baixo tráfego (madrugada)
- Use processamento em batch para grandes volumes
- Implemente cache quando possível
- Considere usar filas (Redis, RabbitMQ) para jobs pesados

### Backup

Sempre faça backup do banco antes de executar automações massivas:
```bash
# PostgreSQL backup
pg_dump -U politze politze > backup_$(date +%Y%m%d).sql
```

## Troubleshooting

### Script Falha Silenciosamente

Verifique logs:
```bash
npm run automation 2>&1 | tee automation.log
```

### Banco de Dados Travado

Pode haver muitas escritas simultâneas. Adicione delays entre operações:
```javascript
await new Promise(resolve => setTimeout(resolve, 100))
```

### Timeout em APIs Externas

Implemente retry logic:
```javascript
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url)
    } catch (error) {
      if (i === retries - 1) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
}
```

## Próximos Passos

1. ✅ Implementar scripts básicos
2. 🔲 Integrar com APIs reais do Portal da Transparência
3. 🔲 Adicionar mais fontes de notícias
4. 🔲 Implementar sistema de filas para jobs pesados
5. 🔲 Adicionar testes automatizados
6. 🔲 Criar dashboard de monitoramento
7. 🔲 Implementar notificações de erro (email/Slack)

## Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação do Portal da Transparência
- Verifique logs de execução

---

**Desenvolvido para promover transparência política no Brasil** 🇧🇷
