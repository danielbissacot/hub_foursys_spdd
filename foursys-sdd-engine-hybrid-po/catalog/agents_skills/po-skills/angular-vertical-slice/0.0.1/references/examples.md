# Exemplos de Implementação — Angular Vertical Slice

> Exemplos baseados no domínio `consent` do repositório de referência `dupe-fed-opt`.

## Table of Contents

- [Estrutura do Domínio](#estrutura-do-domínio)
- [domain/models/dtos — DTOs da API](#domainmodelsdtos--dtos-da-api)
- [domain/models/mappers — Mapper DTO → Model](#domainmodelsmappers--mapper-dto--model)
- [data-access/state — State com Signals](#data-accessstate--state-com-signals)
- [data-access/api — Integração HTTP (privada)](#data-accessapi--integração-http-privada)
- [data-access/services — Service Orquestrador](#data-accessservices--service-orquestrador)
- [feat-\*/data-access — data-access na Feature](#feat-data-access--data-access-na-feature)
- [pages/ — Page Component (domínio)](#pages--page-component-domínio)
- [ui/ — Componente Presentacional (dumb)](#ui--componente-presentacional-dumb)
- [Guard registrado em pages/](#guard-registrado-em-pages)
- [Interceptors registrados no bootstrap](#interceptors-registrados-no-bootstrap)

---

## Estrutura do Domínio

```text
src/app/consent/                          # Domínio: consent
├── feat-opt-in/                          # Feature: opt-in
│   ├── data-access/                      # data-access da feature
│   │   ├── api/
│   │   │   └── optin.api.ts
│   │   └── services/
│   │       └── optin.service.ts
│   ├── dtos/
│   │   └── optin-documents.dto.ts
│   └── pages/
│       └── feat-view-solicitation-optin-data/
├── feat-opt-out/
│   └── data-access/
├── ui/
│   └── components/
│       ├── info-company.component.ts     # Dumb component
│       └── agenda-data/
├── data-access/                          # data-access do domínio
│   ├── api/
│   │   └── consent.api.ts
│   ├── services/
│   │   └── consent.service.ts
│   └── state/
│       ├── company.state.ts              # Signal-based state
│       └── optin-form.state.ts
├── domain/
│   └── models/
│       ├── dtos/
│       │   ├── client.dto.ts
│       │   └── opt.dto.ts
│       └── mappers/
│           └── consent.mapper.ts
└── pages/                                # Pages do domínio
    ├── consult-cnpj/
    │   └── consult-cnpj.page.ts
    ├── view-data-agenda/
    └── view-result-opt/
```

---

## domain/models/dtos — DTOs da API

DTOs representam o contrato com o backend. Ficam em `domain/models/dtos/` e são o **único tipo que `api/` pode importar**.

```typescript
// src/app/consent/domain/models/dtos/client.dto.ts
export interface ClientCnpjRequestDto {
  cpfCnpj: string;
}

export interface ClientCnpjResponseDto {
  email?: string;
  telefone?: string;
  cnpj?: string;
  nomeFantasia?: string;
  situacaoOpt: {
    cpfCnpjSacadorTitular: string;
    dtInicioAutorizacao?: string;
    dtFimAutorizacao?: string;
    dtAutorizacao?: string;
    cdSituacaoOptIn: OptinType;
    documentosAcessados?: DocumentsType[];
  } | null;
}

export type OptinType =
  | 'OPT_IN_ATIVO'
  | 'OPTIN_PENDENTE_AUTORIZACAO'
  | 'OPTIN_RECUSADO'
  | 'OPTIN_CANCELADO'
  | 'SEM_OPTIN';

export type DocumentsType = 'BOLETO' | 'DUPLICATA' | 'NOTA_FISCAL';
```

---

## domain/models/mappers — Mapper DTO → Model

Mappers convertem DTOs (contrato API) em domain models (contrato interno). Ficam em `domain/models/mappers/`. O `services/` os consome para transformar dados vindos da `api/`.

```typescript
// src/app/consent/domain/models/mappers/consent.mapper.ts
import { Client, OptinStatus } from '../../../../shared/domain/models/client.model';
import { ClientCnpjResponseDto, OptinType } from '../dtos/client.dto';

// ✅ Mapper puro (função, não classe) — sem dependências injetáveis
export function toClientModel(cnpj: string, dto: ClientCnpjResponseDto): Client {
  return {
    cnpj,
    company: dto.nomeFantasia || '',
    phone: dto.telefone || '',
    email: dto.email || '',
    optin: mapOptinStatus(dto.situacaoOpt?.cdSituacaoOptIn || 'SEM_OPTIN'),
    accessedDocuments: dto.situacaoOpt?.documentosAcessados || [],
  };
}

function mapOptinStatus(status: OptinType): OptinStatus {
  switch (status) {
    case 'OPT_IN_ATIVO':       return 'ATIVO';
    case 'OPTIN_PENDENTE_AUTORIZACAO': return 'PENDENTE';
    case 'OPTIN_RECUSADO':     return 'INATIVO';
    case 'OPTIN_CANCELADO':    return 'CANCELADO';
    case 'SEM_OPTIN': default: return 'SEM_OPTIN';
  }
}
```

---

## data-access/state — State com Signals

State usa `signal()` para gerenciamento de estado reativo. Expõe **readonly signals** publicamente e métodos `set` / `clear` para mutação controlada. Importa apenas de `models`.

```typescript
// src/app/consent/data-access/state/company.state.ts
import { Injectable, signal } from '@angular/core';
import { Opt } from '../../../shared/domain/models/opt.model';
import { Client } from '../../../shared/domain/models/client.model';

@Injectable({ providedIn: 'root' })
export class CompanyState {
  // ✅ Signal privado + readonly público = encapsulamento de estado
  private _company = signal<Client | null>(null);
  company = this._company.asReadonly();

  private _statusOpt = signal<Opt | null>(null);
  statusOpt = this._statusOpt.asReadonly();

  setCompany(value: Client) {
    this._company.set(value);
  }

  setStatusOpt(value: Opt) {
    this._statusOpt.set(value);
  }

  clear() {
    this._company.set(null);
    this._statusOpt.set(null);
  }
}
```

```typescript
// src/app/consent/data-access/state/optin-form.state.ts
import { Injectable, signal } from '@angular/core';

export interface OptinFormData {
  duplicatas: boolean;
  boletos: boolean;
  notasFiscais: boolean;
  periodo: 'indeterminado' | 'personalizado';
  dataInicio: Date | null;
  dataFim: Date | null;
  historico: boolean;
}

@Injectable({ providedIn: 'root' })
export class OptinFormState {
  private _formData = signal<OptinFormData | null>(null);
  formData = this._formData.asReadonly();

  setFormData(value: OptinFormData) {
    this._formData.set(value);
  }

  clear() {
    this._formData.set(null);
  }
}
```

---

## data-access/api — Integração HTTP (privada)

API service é **privada** — nunca importada fora de `data-access/`. Trabalha exclusivamente com DTOs.

```typescript
// src/app/consent/data-access/api/consent.api.ts
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientWrapper } from '../../../shared/utils/http-client-wrapper.service';
import { ClientCnpjRequestDto, ClientCnpjResponseDto } from '../../domain/models/dtos/client.dto';

// ❌ PROIBIDO: import { Client } from '../../domain/models/client.model'; → DATA_ACCESS_DTO_ONLY

@Injectable({ providedIn: 'root' })
export class ConsentApi {
  private readonly httpClient = inject(HttpClientWrapper);

  // ✅ Recebe DTO, retorna DTO — nenhum domain model aqui
  getClient(data: ClientCnpjRequestDto): Observable<ClientCnpjResponseDto> {
    return this.httpClient.post<ClientCnpjResponseDto>('/v1/company', data);
  }
}
```

---

## data-access/services — Service Orquestrador

Service é a **fachada** do data-access. Orquestra `api/` + `state/` + `mappers`. Acessível por `feat-*` e `pages/`.

```typescript
// src/app/consent/data-access/services/consent.service.ts
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { toClientModel } from '../../domain/models/mappers/consent.mapper'; // ✅ mapper
import { ConsentApi } from '../api/consent.api';                            // ✅ api
import { CompanyState } from '../state/company.state';                      // ✅ state

@Injectable({ providedIn: 'root' })
export class ConsentService {
  private consentApi = inject(ConsentApi);
  private companyState = inject(CompanyState);

  // ✅ Orquestra: chama api → transforma via mapper → persiste no state
  getClientByCNPJ(cnpj: string) {
    return this.consentApi.getClient({ cpfCnpj: cnpj }).pipe(
      map((dto) => toClientModel(cnpj, dto)),
      tap((model) => this.companyState.setCompany(model)),
    );
  }
}
```

---

## feat-*/data-access — data-access na Feature

Features podem ter seu **próprio data-access** com `api/` e `services/` quando a lógica é exclusiva da feature. O service da feature pode importar do `state/` do domínio pai.

```typescript
// src/app/consent/feat-opt-in/data-access/api/optin.api.ts
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OptRequestDto, OptResponseDto } from '../../../../shared/domain/models/dtos/opt.dto';
import { HttpClientWrapper } from '../../../../shared/utils/http-client-wrapper.service';

@Injectable({ providedIn: 'root' })
export class OptinApi {
  private readonly httpClient = inject(HttpClientWrapper);

  sendOptin(data: OptRequestDto): Observable<OptResponseDto> {
    return this.httpClient.post<OptResponseDto>('/v1/optin', data);
  }
}
```

```typescript
// src/app/consent/feat-opt-in/data-access/services/optin.service.ts
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { OptinApi } from '../api/optin.api';
import { toOptModel } from '../../../../shared/domain/models/opt.mapper';
import { Opt } from '../../../../shared/domain/models/opt.model';
import { CompanyState } from '../../../data-access/state/company.state'; // ✅ state do domínio pai

@Injectable({ providedIn: 'root' })
export class OptinService {
  private optinApi = inject(OptinApi);
  private companyState = inject(CompanyState);

  sendOptin(data: { cnpj: string; dataInicio: string; dataFim: string; documentos: any }): Observable<Opt> {
    return this.optinApi.sendOptin({ /* ... payload montado ... */ }).pipe(
      map((response) => toOptModel(response)),
      tap((opt) => this.companyState.setStatusOpt(opt)), // ✅ atualiza state do domínio
    );
  }
}
```

---

## pages/ — Page Component (domínio)

Pages ficam no nível do domínio e orquestram features, services e state. Podem importar de `data-access/services/`, `data-access/state/`, `ui/`, `feat-*`, `utils` e `models`.

```typescript
// src/app/consent/pages/consult-cnpj/consult-cnpj.page.ts
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { tap } from 'rxjs';

import { NavigationService } from '../../../shared/data-access/data-services/navigation.service';
import { LoadingService } from '../../../shared/data-access/state/loading.service';
import { LayoutComponent } from '../../../shared/ui/components/layout.component';
import { ConsentService } from '../../data-access/services/consent.service'; // ✅ service do domínio
import { CompanyState } from '../../data-access/state/company.state';         // ✅ state do domínio

@Component({
  selector: 'app-consult-client',
  templateUrl: './consult-cnpj.page.html',
  imports: [ReactiveFormsModule, LayoutComponent],
})
export class ConsultCnpjPage {
  private consentService = inject(ConsentService);
  protected companyState = inject(CompanyState);
  private navigationService = inject(NavigationService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  protected cnpjForm = this.fb.group({
    number: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.cnpjForm.invalid) return;

    this.consentService
      .getClientByCNPJ(this.cnpjForm.controls.number.value!)
      .pipe(
        tap(() => this.navigationService.navigateByJourney('dados-agenda')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
```

---

## ui/ — Componente Presentacional (dumb)

Componentes UI recebem dados via `input()` e emitem eventos via `output()`. **Nunca importam de `data-access/` ou `feat-*`**.

```typescript
// src/app/consent/ui/components/info-company.component.ts
import { Component, input } from '@angular/core';

// ❌ PROIBIDO: import { ConsentService } from '../../data-access/services/consent.service';
// ❌ PROIBIDO: import { CompanyState } from '../../data-access/state/company.state';

@Component({
  selector: 'mfe-info-company',
  template: `
    <div class="brad-card brad-card--default container">
      <h2>{{ company() }}</h2>
      <span><b>CNPJ</b> {{ cnpj() }}</span>
      <span><b>Telefone</b> {{ phone() }}</span>
      <span><b>E-mail</b> {{ email() || '-' }}</span>
    </div>
  `,
  standalone: true,
})
export class InfoCompanyComponent {
  // ✅ Dados via input() — sem lógica de acesso a dados
  cnpj = input<string | undefined>();
  company = input<string | undefined>();
  phone = input<string | undefined>();
  email = input<string | undefined>();
}
```

---

## Guard registrado em pages/

Guards domain-específicos ficam em `data-access/guards/` e são consumidos **apenas por `pages/`** via router.

```typescript
// src/app/consent/pages/consent.routes.ts
import { Routes } from '@angular/router';
import { consentAccessGuard } from '../data-access/guards/consent-access.guard';

export const CONSENT_ROUTES: Routes = [
  {
    path: '',
    canActivate: [consentAccessGuard], // ✅ guard consumido apenas em pages/
    children: [
      { path: 'consulta', loadComponent: () => import('./consult-cnpj/consult-cnpj.page').then(m => m.ConsultCnpjPage) },
      { path: 'dados-agenda', loadComponent: () => import('./view-data-agenda/view-data-agenda.page').then(m => m.ViewDataAgendaPage) },
    ],
  },
];
```

---

## Interceptors registrados no bootstrap

Interceptors ficam **sempre** em `shared/data-access/interceptors/` e são registrados via `provideHttpClient`. Nunca importados diretamente.

```typescript
// src/app/app.config.ts
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { authInterceptor } from './shared/data-access/interceptors/auth.interceptor';
import { errorInterceptor } from './shared/data-access/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
  ],
};
```
