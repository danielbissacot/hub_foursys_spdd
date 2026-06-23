# Spacing

Classes de espaçamento disponibilizadas para uso conforme os padrões do Liquid. .



# Uso do HTML
```
<span class="brad-m-md-t brad-p-md-l"> .brad-m-md-t .brad-p-md-l </span>
Copy
```



As classes são nomeadas usando o formato brad-{property}-{size}-{direction}.

## Onde a propriedade é uma das seguintes:

## m- para classes que definem margin;
## p- para classes que definem padding;

## Onde o tamanho é um dos seguintes:

# Padding

# -none para adicionar 0px;
-xxs para adicionar 2px;
-xs para adicionar 4px;
-sm para adicionar 8px;
-md para adicionar 12px;
-lg para adicionar 16px;
-xl para adicionar 20px;
## -xxl para adicionar 24px;

# Margin

# -none para adicionar 0px;
-xs para adicionar 8px;
-sm para adicionar 16px;
-md para adicionar 24px;
-lg para adicionar 32px;
## -xl para adicionar 40px;

## Onde os lados são um dos seguintes:

## t- para classes que definem margin-top ou padding-top;
b- para classes que definem margin-bottom ou padding-bottom;
l- para classes que definem margin-left ou padding-left;
r- para classes que definem margin-right ou padding-right;
x- para classes que definem tanto _-left e _-right;
y- para classes que definem tanto _-top e _-bottom;
para classes que definem um margin ou padding em todos os 4 lados do elemento não é necessario passar parâmetro de direção;
Exemplo
```
<section class="brad-m-lg-b">
  <div class="examples">
    <div class="brad-p-md brad-m-xs-b" style="display: flex;">
      <div
        class="brad-bg-color-extended-purple brad-text-color-neutral-0 brad-p-xs brad-m-xs"
      >
        Exemplo de espaçamento
      </div>
      <div
        class="brad-bg-color-extended-violet brad-text-color-neutral-0 brad-p-xs brad-m-xs"
      >
        Exemplo de espaçamento
      </div>
    </div>
  </div>
</section>
```

| Name | Description | Default | Control |
| --- | --- | --- | --- |
| spacingSize | Altera o tamanho de espaçamento string | - | Choose option... none -xxs -xs -sm -md -lg -xl -xxl |
| spacingDirection | Altera a direção dos espaçamentos string | - | Choose option... -t -b -l -r -x -y |