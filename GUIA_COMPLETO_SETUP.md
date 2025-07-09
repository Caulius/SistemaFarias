# 📋 Guia Completo: Configuração e Deploy do Sistema de Roteiros Logísticos

## 🎯 Visão Geral
Este guia te levará desde o download do projeto até o deploy completo no Netlify, configuração do Firebase e publicação no GitHub.

---

## 📦 1. PREPARAÇÃO DO AMBIENTE

### 1.1 Softwares Necessários
Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior): https://nodejs.org/
- **Git**: https://git-scm.com/downloads
- **Git Bash** (incluído na instalação do Git no Windows)
- **Editor de código** (recomendado: VS Code): https://code.visualstudio.com/

### 1.2 Verificar Instalações
Abra o **Git Bash** e execute os comandos para verificar se tudo está instalado:

```bash
node --version
npm --version
git --version
```

---

## 📁 2. CONFIGURAÇÃO DO PROJETO LOCAL

### 2.1 Extrair o Projeto
1. Extraia o arquivo ZIP do projeto em uma pasta de sua escolha
2. Renomeie a pasta para `sistema-roteiros-logisticos`

### 2.2 Abrir o Projeto
1. Abra o **Git Bash**
2. Navegue até a pasta do projeto:
```bash
cd caminho/para/sistema-roteiros-logisticos
```

### 2.3 Instalar Dependências
Execute o comando para instalar todas as dependências:
```bash
npm install
```

### 2.4 Testar o Projeto Localmente
Execute o projeto para verificar se está funcionando:
```bash
npm run dev
```

O projeto deve abrir no navegador em `http://localhost:5173`

---

## 🔥 3. CONFIGURAÇÃO DO FIREBASE

### 3.1 Acessar o Console do Firebase
1. Acesse: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Clique em "Adicionar projeto" ou selecione o projeto existente `sistemafarias2025`

### 3.2 Configurar Firestore Database
1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de teste"**
4. Escolha a localização (recomendado: `southamerica-east1`)
5. Clique em **"Concluído"**

### 3.3 Configurar Regras do Firestore
1. Na aba **"Regras"** do Firestore, substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para todas as coleções
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

2. Clique em **"Publicar"**

### 3.4 Verificar Configuração do Firebase
O arquivo `src/config/firebase.ts` já está configurado com suas credenciais:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCdiVmwpkc95iN8WCTAlK92LafkkBcwQfs",
  authDomain: "sistemafarias2025.firebaseapp.com",
  projectId: "sistemafarias2025",
  // ... outras configurações
};
```

---

## 📱 4. CONFIGURAÇÃO DO GITHUB

### 4.1 Criar Conta no GitHub
1. Acesse: https://github.com/
2. Crie uma conta ou faça login

### 4.2 Criar Novo Repositório
1. Clique no botão **"New"** (verde) ou no **"+"** no canto superior direito
2. Clique em **"New repository"**
3. Configure o repositório:
   - **Repository name**: `sistema-roteiros-logisticos`
   - **Description**: `Sistema para automatizar o envio de roteiros logísticos via WhatsApp`
   - Marque como **"Public"** (para usar Netlify gratuito)
   - **NÃO** marque "Add a README file"
   - **NÃO** adicione .gitignore ou license
4. Clique em **"Create repository"**

### 4.3 Configurar Git Local
No **Git Bash**, dentro da pasta do projeto, execute:

```bash
# Configurar seu nome e email (substitua pelos seus dados)
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Primeiro commit: Sistema de Roteiros Logísticos"

# Adicionar o repositório remoto (substitua SEU_USUARIO pelo seu usuário do GitHub)
git remote add origin https://github.com/SEU_USUARIO/sistema-roteiros-logisticos.git

# Renomear branch para main
git branch -M main

# Fazer o push inicial
git push -u origin main
```

**⚠️ IMPORTANTE**: Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub!

### 4.4 Verificar Upload
1. Acesse seu repositório no GitHub
2. Verifique se todos os arquivos foram enviados corretamente

---

## 🌐 5. DEPLOY NO NETLIFY

### 5.1 Criar Conta no Netlify
1. Acesse: https://www.netlify.com/
2. Clique em **"Sign up"**
3. Escolha **"GitHub"** para fazer login
4. Autorize o Netlify a acessar sua conta GitHub

### 5.2 Conectar Repositório
1. No dashboard do Netlify, clique em **"Add new site"**
2. Selecione **"Import an existing project"**
3. Escolha **"Deploy with GitHub"**
4. Autorize o Netlify (se solicitado)
5. Selecione o repositório `sistema-roteiros-logisticos`

### 5.3 Configurar Build
1. **Branch to deploy**: `main`
2. **Build command**: `npm run build`
3. **Publish directory**: `dist`
4. Clique em **"Deploy site"**

### 5.4 Aguardar Deploy
1. O Netlify começará o processo de build
2. Aguarde alguns minutos até aparecer "Published"
3. Seu site estará disponível em uma URL como: `https://nome-aleatorio.netlify.app`

### 5.5 Personalizar URL (Opcional)
1. No dashboard do site, clique em **"Site settings"**
2. Clique em **"Change site name"**
3. Digite um nome personalizado: `roteiros-logisticos-carlos`
4. Sua URL ficará: `https://roteiros-logisticos-carlos.netlify.app`

---

## 🔄 6. ATUALIZAÇÕES FUTURAS

### 6.1 Fazer Alterações no Código
1. Edite os arquivos necessários no seu editor
2. Teste localmente com `npm run dev`

### 6.2 Enviar Atualizações para o GitHub
No **Git Bash**, execute:

```bash
# Adicionar arquivos modificados
git add .

# Fazer commit com mensagem descritiva
git commit -m "Descrição da alteração realizada"

# Enviar para o GitHub
git push origin main
```

### 6.3 Deploy Automático
- O Netlify detectará automaticamente as mudanças no GitHub
- Fará o build e deploy automaticamente
- Em poucos minutos, as alterações estarão online

---

## 🧪 7. TESTANDO O SISTEMA

### 7.1 Funcionalidades para Testar
1. **Cadastro de Motoristas**: Adicione alguns motoristas
2. **Cadastro de Veículos**: Adicione alguns veículos
3. **Criar Programação**: Crie uma programação diária
4. **Adicionar Roteiros**: Adicione roteiros à programação
5. **Gerar Mensagem**: Verifique se a mensagem é gerada corretamente
6. **Envio WhatsApp**: Teste os botões de envio
7. **Relatórios**: Exporte relatórios Excel
8. **Modo Escuro**: Teste a alternância de tema

### 7.2 Verificar Persistência de Dados
1. Adicione alguns dados
2. Feche e reabra o navegador
3. Verifique se os dados permanecem (Firebase funcionando)

---

## 🚨 8. SOLUÇÃO DE PROBLEMAS

### 8.1 Erro no Firebase
**Problema**: Dados não salvam ou não carregam
**Solução**:
1. Verifique se as regras do Firestore estão corretas
2. Verifique se o projeto Firebase está ativo
3. Abra o Console do navegador (F12) para ver erros

### 8.2 Erro no Deploy Netlify
**Problema**: Build falha no Netlify
**Solução**:
1. Verifique se `npm run build` funciona localmente
2. Verifique se todas as dependências estão no `package.json`
3. Veja os logs de erro no dashboard do Netlify

### 8.3 Erro no Git Push
**Problema**: Erro ao fazer push para GitHub
**Solução**:
```bash
# Se der erro de autenticação, configure novamente
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"

# Se der conflito, force o push (cuidado!)
git push -f origin main
```

---

## ✅ 9. CHECKLIST FINAL

### 9.1 Verificações Obrigatórias
- [ ] Projeto roda localmente (`npm run dev`)
- [ ] Firebase configurado e funcionando
- [ ] Código enviado para GitHub
- [ ] Site deployado no Netlify
- [ ] URL personalizada configurada (opcional)
- [ ] Todas as funcionalidades testadas
- [ ] Dados persistem no Firebase

### 9.2 URLs Importantes
- **Repositório GitHub**: `https://github.com/SEU_USUARIO/sistema-roteiros-logisticos`
- **Site Online**: `https://seu-site.netlify.app`
- **Firebase Console**: `https://console.firebase.google.com/project/sistemafarias2025`

---

## 🎉 10. CONCLUSÃO

Parabéns! Seu sistema está agora:
- ✅ Funcionando localmente
- ✅ Conectado ao Firebase (banco de dados)
- ✅ Versionado no GitHub
- ✅ Deployado no Netlify (online)
- ✅ Pronto para uso em produção

### 10.1 Próximos Passos
1. Compartilhe a URL com sua equipe
2. Comece a usar o sistema no dia a dia
3. Faça melhorias conforme necessário
4. Use o fluxo de atualização para novas versões

### 10.2 Suporte
- Para dúvidas técnicas, consulte a documentação oficial:
  - Firebase: https://firebase.google.com/docs
  - Netlify: https://docs.netlify.com/
  - GitHub: https://docs.github.com/

---

**Desenvolvido por Carlos Freitas • © 2025**