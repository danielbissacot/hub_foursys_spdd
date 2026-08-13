---
name: Especificação Técnica Etapa 3 — Node.js / NestJS
description: Injeção da Etapa 3 do Specify para projetos Node.js 20+ com NestJS, DTOs, Prisma e Jest.
metadata:
  version: "1.0.0"
---

### 3. Derivação da História Técnica — Node.js 20+ / NestJS
- Mapeie os componentes técnicos impactados: Módulos NestJS, Controllers (@Get/@Post/@Put/@Delete), Services (@Injectable), Repositories (Prisma Client), DTOs (class-validator), Guards (@UseGuards), Interceptors, Pipes globais (ValidationPipe).
- Indique os Critérios de Aceite Técnicos: validações de DTO com class-validator (@IsString, @IsEmail, @IsUUID), documentação Swagger (@ApiProperty em todos os DTOs), cobertura de testes Jest >= 90%, tratamento de erros com HttpException e filtros globais.
- ⚠️ NÃO USE padrões Angular, Spring Boot/Java ou COBOL. Este é um projeto Node.js/NestJS.

Item 5 da saída: ⚙️ **Especificação Técnica Node.js:** Módulo NestJS afetado, árvore de dependências (Controller → Service → Repository), DTOs necessários, checklist técnico do desenvolvedor Node.js.
