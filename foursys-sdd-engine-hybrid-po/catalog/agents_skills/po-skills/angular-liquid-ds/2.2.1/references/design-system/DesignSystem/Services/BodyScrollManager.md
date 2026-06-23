# BodyScrollManagerService

O BodyScrollManagerService é um serviço que permite controlar a rolagem do body da página, útil principalmente em casos como popovers, modais e overlays, onde é necessário ocultar ou restaurar a rolagem para manter o foco do usuário.

# Índice
## Introdução

O serviço atua diretamente sobre o document.body. Ele calcula dinamicamente as dimensões da scrollbar para ajustar os paddings laterais e evitar "saltos" visuais ao ocultar a rolagem.

# Uso do Serviço
```
import { BodyScrollManagerService } from './brad-body-scroll-manager.service.js';

const scrollService = new BodyScrollManagerService();

// Oculta a rolagem da página (por exemplo, ao abrir um modal)
scrollService.handleHidden();

// Restaura a rolagem da página após fechamento do modal
scrollService.handleAuto();
```
## Ocultar Rolagem

O método handleHidden() salva os paddings originais do body, aplica overflow: hidden e adiciona padding para compensar o espaço da scrollbar removida.

# Restaurar Rolagem

O método handleAuto() restaura o overflow e os paddings originais com um pequeno atraso (200ms), permitindo suavidade visual na reexibição da rolagem.

# Métodos

| Método | Descrição |
| --- | --- |
| handleHidden() | Oculta a rolagem do body e ajusta paddings com base nas dimensões da scrollbar |
| handleAuto() | Restaura a rolagem e paddings após um delay de 200ms |

## Tratamento de Scrollbar e Padding

O serviço calcula as dimensões da scrollbar ao comparar window.innerWidth com clientWidth do documentElement. Esse cálculo evita "pulos" no layout ao esconder a scrollbar, pois o espaço antes ocupado por ela é compensado com padding equivalente.