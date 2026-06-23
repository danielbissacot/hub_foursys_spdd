# Padrão Service Layer

Encapsule a lógica HTTP em serviços:

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private baseUrl = '/api/users';
  
  // ID do usuário atual para fetch reativo
  private currentUserId = signal<string | null>(null);
  
  // Resource reativo que atualiza quando currentUserId muda
  currentUser = httpResource<User>(() => {
    const id = this.currentUserId();
    return id ? `${this.baseUrl}/${id}` : undefined;
  });
  
  // Definir usuário atual para buscar
  selectUser(id: string) {
    this.currentUserId.set(id);
  }
  
  // Operações CRUD
  getAll() {
    return this.http.get<User[]>(this.baseUrl);
  }
  
  getById(id: string) {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  
  create(user: Omit<User, 'id'>) {
    return this.http.post<User>(this.baseUrl, user);
  }
  
  update(id: string, user: Partial<User>) {
    return this.http.patch<User>(`${this.baseUrl}/${id}`, user);
  }
  
  delete(id: string) {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
```
