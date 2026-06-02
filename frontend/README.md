# 🌿 Nossa Floripa
Uma rede social comunitária para os moradores de Florianópolis — um espaço para se conectar, participar de eventos, ajudar o próximo e fortalecer a comunidade local.

## 🧩 O Problema
Florianópolis é uma cidade vibrante, mas falta uma plataforma digital focada na comunidade local — um lugar onde moradores possam se conectar entre si, divulgar eventos do bairro, pedir e oferecer ajuda, e reconhecer quem contribui com a cidade. Redes sociais genéricas não atendem essa necessidade de forma específica e engajada.
O Nossa Floripa nasceu para preencher esse espaço: uma rede social pensada para e pelos florianopolitanos.

## 👥 Integrantes da Equipe
*[Fernando_Zhang](), [Miguel_Lopes](https://github.com/lopinims1), [Henrique_Rosa](https://github.com/DinoHR-ML) , [Eduardo_Casanova](https://github.com/EduBartReal)*

## 🛠️ Tecnologias Utilizadas

Next.js 14 (App Router) — framework React para o frontend
TypeScript — tipagem estática
Tailwind CSS — estilização utilitária
Supabase — banco de dados PostgreSQL, autenticação e storage de arquivos
Lucide React — biblioteca de ícones
Vercel — deploy e hospedagem


## ✅ Funcionalidades Implementadas

Autenticação — cadastro e login de usuários via Supabase Auth
Feed de posts — publicação de textos e imagens pela comunidade
Curtidas — curtir posts e visualizar posts curtidos
Comentários — interação nos posts da comunidade
Sistema de seguidores — seguir e deixar de seguir outros perfis, com abas de "Seguindo" e "Seguidores"
Perfil de usuário — avatar, bio, contagem de posts, eventos e aplausos
Busca — pesquisa de usuários e posts
Eventos — listagem e participação em eventos locais
Loja FloriPoints — loja de itens cosméticos (molduras, emojis, badges) comprados com pontos ganhos na plataforma
Inventário — gerenciamento dos itens adquiridos pelo usuário
Temas visuais — paleta de cores personalizável (Floripa, Noturno, Oceano, Urbano)
Layout responsivo — interfaces adaptadas para desktop, tablet e mobile


## 🗄️ Estrutura do Banco de Dados
O banco de dados é gerenciado pelo Supabase (PostgreSQL). As principais tabelas são:
perfis
Dados públicos do usuário.
ColunaTipoDescriçãoiduuid (FK → auth.users)Identificador do usuárionometextNome de exibiçãousernametext@ do usuário (único)avatar_urltextURL da foto de perfilbiotextDescrição do perfilfloripointsintegerSaldo de pontos do usuário
posts
Publicações feitas pelos usuários.
ColunaTipoDescriçãoiduuidIdentificador do postusuario_iduuid (FK → perfis)Autor do postconteudotextTexto do postimagem_urltextURL da imagem (opcional)created_attimestampData de criação
curtidas
Registro de curtidas em posts.
ColunaTipoDescriçãousuario_iduuid (FK → perfis)Quem curtiupost_iduuid (FK → posts)Post curtido
seguidores
Relação de seguidor/seguido entre usuários.
ColunaTipoDescriçãoseguidor_iduuid (FK → perfis)Quem segueseguido_iduuid (FK → perfis)Quem é seguido
eventos
Eventos da comunidade.
ColunaTipoDescriçãoiduuidIdentificador do eventotitulotextNome do eventodescricaotextDescriçãoimagem_urltextBanner do eventocreated_attimestampData de criação
loja_itens
Itens disponíveis na loja.
ColunaTipoDescriçãoiduuidIdentificador do itemnometextNome do itemdescricaotextDescriçãotipoenummoldura, emoji ou badgeraridadeenumcomum, incomum, raro ou lendariopreco_pontosintegerCusto em FloriPointsimagem_urltextPreview do itemapenas_evento_marcabooleanSe é exclusivo de evento de marca
inventario
Itens adquiridos por cada usuário.
ColunaTipoDescriçãousuario_iduuid (FK → perfis)Dono do itemitem_iduuid (FK → loja_itens)Item adquirido

## 💰 Modelo de Monetização
O Nossa Floripa adota um modelo baseado em parcerias com marcas e eventos patrocinados:

Eventos de marcas parceiras — empresas locais patrocinam eventos na plataforma e distribuem itens cosméticos exclusivos (badges, molduras de perfil) como recompensas para participantes.
FloriPoints — moeda interna da plataforma. Os usuários ganham pontos participando de eventos e contribuindo com a comunidade (ex: publicar uma ajuda semanal vale 300 pts). Os pontos são usados para adquirir itens na loja.
Visibilidade para marcas — eventos patrocinados aparecem em destaque na aba de Eventos, gerando engajamento orgânico da comunidade local.

## 🚀 Como Rodar o Projeto Localmente
<sup> Pré-requisitos </sup>

- Node.js 18+
- npm ou yarn
Conta no Supabase com projeto configurado

**1. Clone o repositório**
```
bashgit clone https://github.com/lopinims1/nossa_floripa.git
cd frontend
```
**2. Instale as dependências**
```
bash npm install
```
**3. Configure as variáveis de ambiente**

Crie um arquivo .env.local na raiz do projeto com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co/
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_2GCxYbmqo17efueaqEqPZg_RwWJg4Wo
```
**4. Rode o servidor de desenvolvimento**
```
bash npm run dev
Acesse http://localhost:3000 no navegador.
```

<sup>📄 Projeto desenvolvido para fins acadêmicos.</sup>