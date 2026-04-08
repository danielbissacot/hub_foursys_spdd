# 🍃 Sobre o Agente Spring Boot

O Agente Spring Boot é um especialista em backend que implementa features seguindo padrões de qualidade, clean coding e boas práticas de engenharia de software da empresa. Ele gera código completo com testes unitários, validações e documentação seguindo a Arquitetura Hexagonal.

Deve ser usado junto às **Instructions** de arquitetura do seu projeto (`@hexagonal-java.md`) e **Skills** de Spring Boot para um melhor resultado.

---

## 🚀 Como Usar

### 1. Formato de Input - User Story
Para usar o agente, forneça uma **user story** no seguinte formato markdown no chat da sua IDE:

```markdown
### User Story
**Como** [tipo de usuário]
**Quero** [objetivo/ação]
**Para** [benefício/valor]

### Critérios de Aceitação
- [ ] Critério 1
- [ ] Critério 2
- [ ] Critério 3

### Regras de Negócio
1. Regra específica do domínio
2. Validações necessárias
3. Comportamentos esperados

### Informações Técnicas (Opcional)
- Endpoint: POST /api/v1/recurso
- Autenticação: JWT Bearer Token
- Banco de Dados: PostgreSQL
- Integrações: API Externa XYZ
```

---

### 2. Exemplos Práticos

#### Exemplo 1: API de Cadastro de Cliente
```markdown
### User Story
**Como** um atendente bancário
**Quero** cadastrar um novo cliente no sistema
**Para** que ele possa acessar os serviços do banco

### Critérios de Aceitação
- [ ] Sistema deve validar CPF/CNPJ antes de cadastrar
- [ ] Email deve ser único no sistema
- [ ] Deve enviar email de boas-vindas após cadastro
- [ ] Endpoint deve retornar 201 Created com ID do cliente

### Regras de Negócio
1. CPF deve ser válido e não pode estar duplicado
2. Cliente menor de 18 anos requer responsável legal
3. Endereço deve ser validado via API dos Correios
```

#### Exemplo 2: Consulta de Saldo
```markdown
### User Story
**Como** um cliente do banco
**Quero** consultar o saldo da minha conta
**Para** verificar minha disponibilidade financeira

### Critérios de Aceitação
- [ ] Endpoint deve ser protegido por autenticação
- [ ] Deve retornar saldo disponível e saldo bloqueado
- [ ] Tempo de resposta deve ser < 500ms
- [ ] Deve registrar log da consulta para auditoria

### Regras de Negócio
1. Apenas o titular da conta pode consultar o saldo
2. Contas inativas não retornam saldo
3. Saldo deve ser formatado com 2 casas decimais
```

---

### 3. Detalhes Técnicos Opcionais
Você pode incluir informações técnicas específicas na seção **Informações Técnicas**:

- **Endpoint**: Especifique o método HTTP e caminho (ex: `POST /api/v1/clientes`)
- **Autenticação**: Tipo de autenticação necessária (JWT, Basic Auth, etc.)
- **Banco de Dados**: Tecnologia específica (PostgreSQL, MySQL, MongoDB)
- **Integrações**: APIs externas ou sistemas que precisam ser integrados
- **Performance**: Requisitos de tempo de resposta ou throughput
- **Segurança**: Requisitos específicos de segurança

---

## 💡 Dicas de Uso

- **Seja específico**: Quanto mais detalhes na user story, melhor o resultado.
- **Inclua regras de negócio**: Elas são cruciais para a implementação correta dos Domain Services.
- **Defina critérios claros**: Use critérios de aceitação mensuráveis e objetivos.
- **Adicione contexto técnico**: Quando souber requisitos específicos de infraestrutura, inclua-os.
- **Pense em edge cases**: Considere também cenários alternativos e de erro na descrição.

