# Design System Liquid Bradesco

Design System Liquid é um ecossistema de padrões de Design escaláveis e fluídos que atendem os produtos Bradesco.

O liquid é um sistema que disponibiliza as melhores práticas e diretrizes de design de interface, componentes e ferramentas para padronização e desenvolvimento de projetos escaláveis e responsivos. Para disponibilizar um projeto que atendesse toda a organização Bradesco, foi necessário colocar em pauta a necessidade de abranger múltiplas Stacks de desenvolvimento, além de considerar a evolução de tecnologia que acontece com frequência no mercado.

# Objetivos
Este material guiará profissionais de tecnologia para um melhor uso do Design System Liquid, tendo a base necessária para começar o seu projeto, com o repositório de componentes com guias e boas práticas de construção;
Centralizar o armazenamento e documentação de todos os componentes visuais;
Funcionalidades
Builds completas de componentes, utilitários e serviços
Minificação dos arquivos
Documentação em Storybook
Integrando o DSYS Liquid no seu projeto HTML
Tenha certeza de configurar suas páginas com padrões recentes de desenvolvimentos e design, ou seja, utilizando o HTML5 doctype e a meta tag viewport para proporcionar o funcionamento responsivo adequado.
É necessário incluir ou alterar (caso já exista) os arquivos abaixo no seu projeto para utilizar os estilos e scripts disponíveis no liquid: Comece incluindo CSS e JavaScript via CDN sem a necessidade de nenhuma etapa de compilação.

Ao iniciar um projeto com a lib corporativa consulte a equipe de arquitetura responsável para conferir qual ambiente seu projeto deve consumir.

## Ambiente recomendado para todos os projetos (Azure):
https://static.bradesco.com.br/dsysliquid/dist/storybook-2.2.1/?path=/docs/design-system-liquid-bradesco--docs
Ambiente institucional:
⚠️ DESCONTINUADO - Este ambiente não recebe mais atualizações. Migre para o ambiente Azure acima.
https://banco.bradesco/cdn/design-system/dist/storybook-1.33.5/index.html?path=/docs/release-log-changelog--docs
## Desenvolvimento Local

Para executar projetos localmente que consomem o Design System, é necessário desabilitar as configurações de segurança do browser para evitar problemas de CORS (Cross-Origin Resource Sharing).

Execute o seguinte comando no PowerShell para abrir o uma nova aba do Chrome com segurança desabilitada:

```
Start-Process "chrome.exe" "--disable-web-security --user-data-dir=""C:\Temp\ChromeProfile"""
```
Exemplo (HTML)
```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Design System Liquid demo</title>

  <!-- CDN: das folhas de estilos liquid -->
  <link
    href="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/reset.bundle.min.css"
    rel="stylesheet"
  />
  <link
    href="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/design-system.bundle.min.css"
    rel="stylesheet"
  />
  <!-- CDN: das folhas de estilos liquid -->

</head>

<body class="brad-theme-classic">
  <h1>Hello, world!</h1>

  <!-- CDN: dos serviços liquid -->
  <script
    src="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/design-system.bundle.min.js"
    integrity="sha256-YszFZGoTDa3UCBj8HMcXyotoajVcmQF6ITe5SvPvhGw=" crossorigin="anonymous"
  ></script>
  <!-- CDN: dos serviços liquid -->

</body>
</html>
```
## Integrando o DSYS Liquid no seu projeto Angular

Para fazer a integração do DSYS Liquid em seu projeto Angular basta repetir o que é feito em um projeto HTML, mostrado acima, porém no arquivo index.html que é gerado pelo próprio CLI do Angular.

# Exemplo (Angular)
```
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>DSYS (DEMO para Angular)</title>
  <base href="/" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/x-icon" href="favicon.ico" />

  <!-- CDN: das folhas de estilos liquid -->
  <link
    href="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/reset.bundle.min.css"
    rel="stylesheet"
  />
  <link
    href="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/design-system.bundle.min.css"
    rel="stylesheet"
  />
  <!-- CDN: das folhas de estilos liquid -->

</head>
<body class="brad-theme-classic">
  <app-root></app-root>

  <!-- CDN: dos serviços liquid -->
  <script
    src="https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/design-system.bundle.min.js"
    integrity="sha256-YszFZGoTDa3UCBj8HMcXyotoajVcmQF6ITe5SvPvhGw=" crossorigin="anonymous"
  ></script>
  <!-- CDN: dos serviços liquid -->

</body>
</html>
```

E para finalizar, quando for utilizar algum do serviço do DSYS, será necessário declarar o LiquidCorp (nosso ponto de contato) para dizer ao compilador do Angular/TS que ali existe um objeto (e só assim ele poderá ser referênciado no seu código), da sequinte maneira:

```
import { Component, OnInit } from "@angular/core";

// Lembre-se de declarar a variável global (nosso ponto de contato) antes da classe do componente, abaixo das importações:
declare let LiquidCorp: any; // <-- AQUI

@Component({
selector: "app-with-dsys",
templateUrl: "./with-dsys.component.html",
styleUrls: ["./with-dsys.component.scss"],
})
export class WithDsysComponent implements OnInit {
service: any;

constructor() {}

ngOnInit(): void {
const options = { targetSelector: "#targetSelector" };
this.service =
LiquidCorp.BradeNomeDoServico.getInstance(
options
); // <-- Substitua BradeNomeDoServico pelo nome do serviço que queira usar do DSYS
}
}
```
## Integrando o DSYS com seu projeto nativo

O arquivo disponibilizado a seguir é destinado ao consumo por projetos nativos, que devem converter os valores do JSON para a linguagem da sua stack.

Link do Json: https://static.bradesco.com.br/dsysliquid/dist/design-system-2.2.1/design-system.bundle.min.json
## Segmentação/Temas

Considerando a necessidade de trabalhar com variação de segmentos, disponibilizamos folhas referentes aos temas que alteram o visual do componente, de acordo com o guide do segmento. As classes de tema disponíveis são:


| Segmentos |
| --- |
| brad-theme-afluentes |
| brad-theme-classic |
| brad-theme-classic-old |
| brad-theme-corporate |
| brad-theme-corporate |
| brad-theme-exclusive |
| brad-theme-exclusive-old |
| brad-theme-empresas |
| brad-theme-expresso |
| brad-theme-next |
| brad-theme-prime |
| brad-theme-prime-old |
| brad-theme-private |
| brad-theme-private-old |
| brad-theme-agora |


E para alterar o tema, basta adicionar na tag body ou a tag de maior hierarquia do seu projeto a classe do segmento que queira, como a seguir:

```
<body class="brad-theme-classic"></body>
```
Para mais informações temos outros canais que complementam essa documentação
Para acesso a boas práticas e documentações para designers: https://zeroheight.com/33af959d2/v/39682/p/88bcfd-liquid-design-system
Projetos legado que utilizam o bootstrap, precisam acessar o bradescode para conferir as orientações para consumo.
Projetos legado que utilizam arquivo reset e identificam conflito com a lib podem considerar não incluir a chamada para o nosso.
É importante avaliar muito bem essa condição pois alguns componentes podem não se comportar adequadamente.
```
<div class="brad-theme-classic">
  <div class="brad-bg-color-primary">
      <br>
  </div>
</div>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| theme | Altera segmento dos estilos string |  | Choose option... brad-theme-classic brad-theme-corporate brad-theme-empresas brad-theme-exclusive brad-theme-prime brad-theme-private brad-theme-next brad-theme-expresso brad-theme-classic-old brad-theme-exclusive-old brad-theme-prime-old brad-theme-private-old brad-theme-agora brad-theme-afluentes |