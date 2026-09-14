# LocalLead 🚆

Aplicativo web progressivo voltado à mobilidade ferroviária urbana, com foco em auxiliar passageiros da CPTM na consulta de status operacional, previsão estimada de chegada dos trens, clima, estação mais próxima e ocupação estimada dos vagões.

O projeto foi desenvolvido como MVP acadêmico, com foco inicial nas Linhas 11-Coral e 12-Safira.

---

## 🗂️ Arquitetura da LocallLead

A estrutura do projeto foi organizada separando o frontend, backend, dados GTFS, rotas, serviços e arquivos do PWA.

![Estrutura do projeto](./docs/images/diagrama_visual.png)

---

## 🔗 Acesse o projeto

- Aplicação publicada: [LocalLead na Vercel](https://locallead.vercel.app/)
- API publicada: [LocalLead API no Render](https://github.com/EnzoNukui/mvp_locallead)
- Repositório: [GitHub](https://locallead-api.onrender.com)

---

## 📌 Sobre o projeto

O **LocalLead** foi criado para melhorar a experiência de passageiros que utilizam o transporte ferroviário metropolitano. A proposta é reunir, em uma interface simples, responsiva e instalável como aplicativo, informações úteis para a tomada de decisão durante o deslocamento.

O aplicativo não utiliza GPS real dos trens. As previsões são estimadas com base em dados de programação, intervalos operacionais, sentido da linha e estação mais próxima do usuário.

Além disso, o sistema apresenta uma estimativa de ocupação dos vagões com base no horário, no nível geral de lotação da linha e no padrão esperado de distribuição dos passageiros dentro da composição.

---

## 🎯 Objetivo

O objetivo do projeto é oferecer uma solução acessível para consulta rápida de informações ferroviárias, ajudando o usuário a:

- identificar a estação mais próxima;
- consultar o status operacional da linha;
- visualizar previsões estimadas dos próximos trens;
- receber alertas relacionados ao clima;
- escolher vagões com menor lotação estimada;
- identificar melhores posições para desembarque em estações principais;
- utilizar a solução diretamente pelo celular como PWA.

---

## 📱 Funcionalidades

### Home

![Home do LocalLead](./docs/images/home_locallead.jpg)

- Listagem das linhas disponíveis.
- Indicação visual do status operacional.
- Exibição resumida de lotação e intervalo.
- Card de clima atual.
- Interface responsiva com navegação inferior em dispositivos móveis.

### Tela da linha

![Tela da linha](./docs/images/linha_locallead.jpg)

- Identificação da linha selecionada.
- Status operacional da linha.
- Clima atual e risco de atraso.
- Sentido atual da viagem.
- Alternância entre sentidos.
- Previsão estimada dos próximos trens.
- Mapa linear da linha.
- Destaque da estação mais próxima.
- Aba de ocupação dos vagões.

### Sistema de vagões

![Sistema de vagões](./docs/images/vagoes_locallead.jpg)

- Estimativa de ocupação por vagão.
- Cores para indicar baixa, moderada e alta ocupação.
- Recomendação de vagões conforme nível geral de lotação:
  - baixa lotação: vagões 3 e 6;
  - lotação moderada: vagões 2 e 7;
  - alta lotação: vagões 1 e 8.
- Indicação da frente do trem conforme o sentido.
- Sugestões de melhores acessos em estações principais.
- Filtro para exibir apenas próximas estações no sentido atual.

### PWA

- Aplicação instalável no celular.
- Manifest configurado.
- Service Worker configurado.
- Ícone e tema personalizados.
- Experiência próxima de aplicativo mobile.

---

## 🧠 Como funciona

O LocalLead combina diferentes fontes de dados, APIs externas e regras internas para gerar as informações exibidas ao usuário.

### Status operacional

O status da linha é consultado por meio de API externa, retornando informações como operação normal, velocidade reduzida, paralisações ou restrições operacionais.

### Estação mais próxima

A localização do usuário é obtida com a **Geolocation API** do navegador. A partir da latitude e longitude, o backend compara a posição do usuário com a lista de estações da linha selecionada e retorna a estação mais próxima.

### Previsão dos trens

A previsão dos próximos trens é estimada com base em:

- linha selecionada;
- sentido escolhido;
- estação mais próxima;
- horário atual;
- intervalos programados;
- dados GTFS disponíveis;
- tabelas manuais de fim de semana.

As previsões são estimativas e podem variar conforme a operação real.

### Ocupação dos vagões

A ocupação dos vagões é estimada a partir do nível geral de lotação da linha. O sistema considera que os vagões centrais tendem a concentrar mais passageiros, enquanto as extremidades podem ser alternativas melhores em horários de maior movimento.

---

## 🛠️ Tecnologias utilizadas

### Frontend

- HTML5
- CSS3
- JavaScript
- PWA
- Service Worker
- Manifest Web App
- Geolocation API
- Lucide Icons

### Backend

- Node.js
- Express.js
- CORS
- APIs REST
- Manipulação de dados GTFS
- Integração com APIs externas

### Deploy

- Vercel para o frontend
- Render para o backend

---

## 📁 Estrutura de pastas

```txt
mvp_locallead
├── back-end
│   ├── data
│   │   ├── gtfs
│   │   │   ├── stops.txt
│   │   │   ├── stop_times.txt
│   │   │   ├── trips.txt
│   │   │   └── frequencies.txt
│   │   └── tabelas
│   │       └── intervalos-fim-semana.js
│   │
│   └── src
│       ├── routes
│       │   ├── status.routes.js
│       │   ├── clima.routes.js
│       │   ├── estacao.routes.js
│       │   ├── previsao.routes.js
│       │   ├── mapa.routes.js
│       │   ├── lotacao.routes.js
│       │   └── vagoes.routes.js
│       │
│       ├── services
│       │   ├── gtfs.service.js
│       │   ├── clima.service.js
│       │   ├── estacao.service.js
│       │   ├── previsao.service.js
│       │   ├── mapa.service.js
│       │   ├── lotacao.service.js
│       │   └── vagoes.service.js
│       │
│       └── server.js
│
└── front-end
    ├── index.html
    ├── linha.html
    ├── manifest.json
    ├── service-worker.js
    │
    ├── css
    │   ├── global.css
    │   ├── menu.css
    │   ├── home.css
    │   ├── linha.css
    │   └── vagoes.css
    │
    ├── js
    │   ├── api.js
    │   ├── home.js
    │   ├── linha.js
    │   └── pwa.js
    │
    └── assets
        ├── images
        │   ├── logo_locallead.png
        │   ├── imagem_trem_luz.png
        │   ├── linha_11.jpg
        │   └── linha_12.jpg
        │
        └── icon
            └── favicon.ico
```

---

## 🚀 Como executar localmente

### Pré-requisitos

Antes de iniciar o projeto, é necessário ter instalado:

- Node.js
- npm
- Git
- Visual Studio Code ou outro editor
- Navegador moderno

### 1. Clonar o repositório

```bash
git clone COLE_AQUI_O_LINK_DO_REPOSITORIO
cd mvp_locallead
```

### 2. Executar o backend

Entre na pasta do backend:

```bash
cd back-end
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
node src/server.js
```

O backend será executado em:

```txt
http://localhost:3000
```

Para testar se o servidor está funcionando, acesse:

```txt
http://localhost:3000/
```

Resposta esperada:

```txt
Servidor da LocalLead funcionando!
```

### 3. Executar o frontend

Abra a pasta `front-end` no VS Code e execute o arquivo `index.html` com uma extensão como **Live Server**.

Exemplo:

```txt
front-end/index.html
```

O frontend deve ser aberto em uma URL semelhante a:

```txt
http://127.0.0.1:5500/front-end/index.html
```

### 4. Configurar a URL da API local

Durante o desenvolvimento local, o arquivo:

```txt
front-end/js/api.js
```

deve apontar para o backend local:

```js
const API_BASE_URL = "http://localhost:3000";
```

Para produção, esse valor deve ser alterado para a URL do backend hospedado no Render.

---

## 🔌 APIs utilizadas

O LocalLead utiliza APIs próprias no backend e integrações externas para compor as informações exibidas ao usuário.

### API própria do LocalLead

A API do projeto foi construída com **Node.js** e **Express.js**.

Ela centraliza as regras de negócio do sistema e fornece os dados para o frontend.

### Status das linhas

```http
GET /status
```

Retorna o status operacional das linhas disponíveis.

### Clima

```http
GET /clima?lat=-23.5505&lon=-46.6333
```

Retorna informações climáticas com base na latitude e longitude do usuário.

Dados retornados:

- temperatura;
- descrição do clima;
- ícone climático;
- chuva atual;
- probabilidade de chuva;
- risco de atraso;
- mensagem interpretada para o usuário.

### Estação mais próxima

```http
GET /estacao-proxima?linha=12&lat=-23.5505&lon=-46.6333
```

Retorna a estação mais próxima do usuário dentro da linha selecionada.

O cálculo é feito comparando a localização atual do usuário com as coordenadas das estações presentes nos dados do sistema.

### Próximos trens

```http
GET /proximos-trens?linha=12&estacao=Jardim%20Romano&destino=BRAS
```

Retorna uma estimativa dos próximos trens para determinada linha, estação e sentido.

### Mapa da linha

```http
GET /mapa-linha?linha=12&destino=BRAS
```

Retorna as estações da linha em ordem, considerando o sentido escolhido.

### Lotação

```http
GET /lotacao?linha=12
```

Retorna o nível estimado de lotação da linha com base no horário e no tipo do dia.

### Vagões

```http
GET /vagoes?linha=12&destino=BRAS
```

Retorna:

- ocupação estimada por vagão;
- vagões sugeridos conforme o nível de lotação;
- melhores acessos para estações principais;
- dados adaptados ao sentido da viagem.

### API externa de clima

O projeto utiliza uma API externa de clima para obter dados meteorológicos com base na localização do usuário.

Esses dados são interpretados pelo backend para gerar uma mensagem simples para o passageiro, como:

```txt
Clima normal, sem previsões para atrasos.
```

ou:

```txt
Chance de chuva. Acompanhe possíveis alterações.
```

A API de clima é utilizada para complementar a experiência do usuário e indicar possíveis impactos na operação ferroviária.

### Dados GTFS e tabelas internas

O sistema utiliza dados de programação ferroviária no formato GTFS para calcular previsões estimadas.

Arquivos utilizados:

```txt
stops.txt
stop_times.txt
trips.txt
frequencies.txt
```

Também foram criadas tabelas internas para complementar a operação, principalmente nos fins de semana:

```txt
intervalos-fim-semana.js
```

Essas tabelas ajudam a estimar intervalos quando os dados disponíveis não cobrem completamente o comportamento operacional esperado.

---

## 📋 Regras de negócio

### 1. Status operacional

O status da linha é exibido separadamente da previsão dos trens.

Isso significa que uma linha pode aparecer como:

```txt
Operação Normal
```

mas ainda assim não haver previsão de próximos trens para determinado horário.

O status indica a condição operacional geral da linha, enquanto a previsão depende da programação e dos intervalos calculados.

### 2. Estação mais próxima

A estação mais próxima é calculada com base na localização do usuário.

O sistema recebe:

```txt
latitude
longitude
linha selecionada
```

E retorna a estação mais próxima somente dentro daquela linha.

### 3. Previsão dos próximos trens

A previsão dos trens é estimada com base em:

- linha selecionada;
- estação atual;
- sentido da viagem;
- horário atual;
- intervalo médio da linha;
- dados GTFS;
- tabelas complementares de fim de semana.

O sistema não utiliza a localização real dos trens.

Por isso, os horários exibidos devem ser interpretados como estimativas.

### 4. Fuso horário

Como o backend está hospedado em servidor externo, o sistema força o uso do fuso horário de São Paulo:

```txt
America/Sao_Paulo
```

Isso evita diferenças entre o horário do servidor e o horário real do usuário.

### 5. Lotação da linha

A lotação geral da linha é definida com base no horário e no tipo de dia.

Exemplo de regras:

```txt
Dias úteis:
manhã e fim da tarde → maior lotação

Sábado:
manhã e fim da tarde → lotação moderada

Domingo:
fluxo reduzido
```

Antes do horário de operação, a lotação é marcada como indisponível.

### 6. Ocupação dos vagões

A ocupação dos vagões é estimada com base no nível geral de lotação da linha.

O sistema considera que os vagões centrais tendem a concentrar mais passageiros, enquanto os vagões das extremidades podem ser alternativas melhores em horários de maior movimento.

Os níveis utilizados são:

```txt
Baixa
Moderada
Alta
```

### 7. Recomendação de vagões

A recomendação dos vagões varia conforme o nível geral de lotação.

```txt
Baixa lotação     → vagões 3 e 6
Lotação moderada  → vagões 2 e 7
Alta lotação      → vagões 1 e 8
```

A proposta é evitar recomendar sempre o mesmo vagão e adaptar a sugestão ao cenário do momento.

### 8. Melhores acessos

O sistema exibe sugestões de melhores acessos apenas para estações principais.

Exemplos:

```txt
Linha 11-Coral:
Calmon Viana
Tatuapé
Brás
Luz

Linha 12-Safira:
Calmon Viana
Tatuapé
Brás
```

As sugestões são filtradas para mostrar apenas estações que ainda estão à frente do usuário no sentido atual.

### 9. Sentido da viagem

As recomendações de acesso consideram o sentido escolhido.

Isso é importante porque o melhor vagão para desembarque pode mudar dependendo do sentido da composição.

Exemplo:

```txt
Sentido BRÁS
→ determinados acessos podem estar mais próximos dos vagões centrais.

Sentido CALMON VIANA
→ a posição ideal pode mudar por causa da orientação do trem.
```

---

## 📲 Instalação como PWA

O LocalLead foi configurado como **Progressive Web App**, permitindo que o usuário instale o projeto no celular como se fosse um aplicativo.

O PWA utiliza:

- `manifest.json`;
- `service-worker.js`;
- ícone personalizado;
- cor de tema;
- modo de exibição standalone.

### Android

Para instalar no Android:

```txt
1. Abra o link do projeto no Google Chrome.
2. Toque no menu de três pontos.
3. Selecione "Adicionar à tela inicial" ou "Instalar app".
4. Confirme a instalação.
```

Depois disso, o LocalLead aparecerá na tela inicial do celular.

### iPhone

Para instalar no iPhone:

```txt
1. Abra o link do projeto no Safari.
2. Toque no botão de compartilhar.
3. Selecione "Adicionar à Tela de Início".
4. Confirme a instalação.
```

### Observação sobre cache

Como o projeto utiliza Service Worker, o navegador pode manter arquivos antigos em cache.

Durante o desenvolvimento, quando houver mudanças importantes em CSS, JavaScript ou imagens, é necessário alterar a versão do cache no arquivo:

```txt
service-worker.js
```

Exemplo:

```js
const CACHE_NAME = "locallead-cache-v8";
```

Isso força o navegador a baixar os arquivos mais recentes.

---

## 🌐 Deploy

### Backend

O backend foi publicado no Render.

Configurações utilizadas:

```txt
Root Directory: back-end
Build Command: npm install
Start Command: node src/server.js
```

O servidor utiliza:

```js
const PORT = process.env.PORT || 3000;
```

### Frontend

O frontend foi publicado na Vercel.

Configurações utilizadas:

```txt
Root Directory: front-end
Framework Preset: Other
Build Command: vazio
Output Directory: vazio
Install Command: vazio
```

---

## ⚠️ Limitações do MVP

Este projeto foi desenvolvido como um MVP acadêmico. Algumas funcionalidades utilizam estimativas e regras internas, não dados reais em tempo real.

Principais limitações:

- o sistema não possui acesso à localização real dos trens;
- a previsão de chegada é baseada em programação e intervalos estimados;
- a ocupação dos vagões é estimada, não medida por sensores;
- os melhores acessos foram definidos por regra interna;
- nem todas as estações possuem recomendação de desembarque;
- o sistema cobre inicialmente apenas as Linhas 11-Coral e 12-Safira;
- APIs externas podem apresentar instabilidade ou limite de requisições;
- o backend hospedado em plano gratuito pode demorar para responder na primeira requisição;
- o PWA depende das permissões do navegador para acessar a localização do usuário;
- a localização é capturada ao abrir a tela, não monitorada continuamente em tempo real.

---

## 👨‍💻 Autor

Desenvolvido por **Enzo Nukui**.

Projeto acadêmico desenvolvido como MVP de mobilidade ferroviária urbana.

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

O código pode ser utilizado, estudado e adaptado, desde que os devidos créditos ao autor sejam mantidos.
