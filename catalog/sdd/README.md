# Catálogo Externo — Override de Playbooks SDD

Esta pasta é lida pelo `catalog-loader.ts` com **prioridade máxima** sobre o catálogo built-in do `.vsix`.

## Como funciona

```
catalog/
└── sdd/
    ├── generic/          ← Sobrescreve o built-in para TODAS as stacks
    │   └── foursys-tasks.md
    ├── spring_boot/      ← Sobrescreve apenas projetos Spring Boot
    │   └── foursys-constitution.md
    └── angular/          ← Sobrescreve apenas projetos Angular
        └── foursys-specify-tech.md
```

## Regra de ouro

Se você criar um arquivo aqui com o mesmo nome do built-in, ele vai substituir o built-in.
Se não existir, o built-in é usado normalmente — sem erros.

## Por que `catalog/playbook/sdd/` não é lido?

A pasta `catalog/playbook/sdd/` é **documentação e referência humana**.
O loader procura em `catalog/sdd/` — dois caminhos diferentes.

Para que uma customização FUNCIONE, o arquivo deve estar em:
`catalog/sdd/[generic|spring_boot|angular|...]/foursys-[fase].md`
