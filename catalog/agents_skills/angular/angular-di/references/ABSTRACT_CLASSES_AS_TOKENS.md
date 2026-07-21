# Classes Abstratas como Tokens

Use classes abstratas para melhor segurança de tipos.

```typescript
// Definição de serviço abstrato
export abstract class Logger {
  abstract log(message: string): void;
  abstract error(message: string, error?: Error): void;
  abstract warn(message: string): void;
}

// Implementação console
@Injectable()
export class ConsoleLogger extends Logger {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
  
  error(message: string, error?: Error) {
    console.error(`[ERROR] ${message}`, error);
  }
  
  warn(message: string) {
    console.warn(`[WARN] ${message}`);
  }
}

// Implementação remota
@Injectable()
export class RemoteLogger extends Logger {
  private http = inject(HttpClient);
  
  log(message: string) {
    this.send('log', message);
  }
  
  error(message: string, error?: Error) {
    this.send('error', message, error);
  }
  
  warn(message: string) {
    this.send('warn', message);
  }
  
  private send(level: string, message: string, error?: Error) {
    this.http.post('/api/logs', { level, message, error: error?.message }).subscribe();
  }
}

// Providers baseado no ambiente
{
  provide: Logger,
  useClass: environment.production ? RemoteLogger : ConsoleLogger,
}

// Injetar usando classe abstrata
@Injectable({ providedIn: 'root' })
export class UserService {
  private logger = inject(Logger);
  
  createUser(user: User) {
    this.logger.log(`Creating user: ${user.email}`);
    // ...
  }
}
```

