# Agenda Espermograma

Sistema web estatico para controlar agendamentos de Espermograma e Espermocultura diretamente no navegador.

## Tecnologias

- React com Vite
- TypeScript
- Tailwind CSS
- localStorage
- Netlify

## Como instalar

```bash
npm install
```

## Como rodar localmente

```bash
npm run dev
```

Abra o endereco mostrado no terminal.

## Como fazer build

```bash
npm run build
```

Os arquivos finais serao gerados em `dist/`.

## Como hospedar no Netlify

1. Envie o projeto para um repositorio Git.
2. No Netlify, crie um novo site a partir do repositorio.
3. Use `npm run build` como comando de build.
4. Use `dist` como pasta de publicacao.

O arquivo `netlify.toml` ja esta configurado para esse fluxo.

## Backup JSON

Na tela de Configuracoes, use:

- **Exportar backup** para baixar um arquivo JSON com os agendamentos e configuracoes.
- **Importar backup** para restaurar um arquivo exportado anteriormente.
- **Limpar dados** para apagar os dados locais, com confirmacao.

## Aviso sobre armazenamento

Os dados ficam salvos apenas no navegador usado, por meio do `localStorage`. Se outro computador, outro navegador ou uma limpeza de dados for usada, as informacoes nao aparecerao sem importar um backup JSON.
