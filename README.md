# DevResumos

Aplicação de consulta rápida a resumos e exemplos de código, organizados por tecnologia, conteúdo e categoria. O projeto usa Angular com componentes standalone, TypeScript e CSS.

## Requisitos

- Node.js e npm instalados.
- Acesso à internet na primeira instalação das dependências.

## Executar localmente

1. Abra um terminal na pasta do projeto.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

O servidor usa a porta `3000`. Para encerrá-lo, pressione `Ctrl+C` no terminal.

Não é necessário configurar uma chave `GEMINI_API_KEY` para executar o projeto.

## Acessar o painel administrativo

1. Abra [http://localhost:3000/login](http://localhost:3000/login).
2. Use a conta administrativa de demonstração:

   - **E-mail:** `admin@devresumos.com.br`
   - **Senha de demonstração:** `password123`

3. Clique em **Entrar**. A conta abre o painel automaticamente. Também é possível acessar diretamente [http://localhost:3000/admin](http://localhost:3000/admin) depois de entrar.

O painel tem as seções **Usuários**, **Tecnologias**, **Categorias**, **Conteúdos** e **Exemplos de Código**. Use **Sair do Painel** para encerrar a sessão.

### Conta de usuário comum

O usuário de demonstração `jorvane@devresumos.com.br` também está disponível, com a senha de demonstração `password123`. Ele entra na área comum, não no painel administrativo.

### Observação sobre o login de demonstração

O login verifica o e-mail e a senha da conta. Contas criadas pelo cadastro usam a senha definida no formulário; a senha inicial de novos usuários criados pelo painel também é solicitada. Para compatibilidade com os dados de demonstração e usuários criados por versões anteriores, contas locais sem credencial registrada usam a senha legada `password123` no primeiro acesso válido. As credenciais são armazenadas no navegador como hashes PBKDF2 com salt, e não como senha em texto simples.

Este projeto ainda não tem um servidor de autenticação: contas, perfil e hashes ficam no armazenamento local do navegador e não são compartilhados entre navegadores ou dispositivos. A proteção de `/admin` também é apenas do lado do cliente e **não é adequada para proteger dados em produção**. Um sistema publicado precisa validar identidade e permissões no servidor.

## Verificações

Verificar tipos TypeScript e templates:

```bash
npm run lint
```

Gerar a compilação de produção na pasta `dist`:

```bash
npm run build
```

## Tecnologias

- Angular 19
- TypeScript
- RxJS
- Vite
- CSS
