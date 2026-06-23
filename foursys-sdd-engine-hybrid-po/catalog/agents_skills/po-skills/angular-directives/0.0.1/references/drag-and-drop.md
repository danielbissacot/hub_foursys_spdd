# Drag and Drop

```typescript
@Directive({
  selector: '[appDraggable]',
  host: {
    'draggable': 'true',
    '[class.dragging]': 'isDragging()',
    '(dragstart)': 'onDragStart($event)',
    '(dragend)': 'onDragEnd($event)',
  },
})
export class DraggableDirective {
  data = input<any>(null, { alias: 'appDraggable' });
  effectAllowed = input<DataTransfer['effectAllowed']>('move');
  
  isDragging = signal(false);
  
  dragStart = output<DragEvent>();
  dragEnd = output<DragEvent>();
  
  onDragStart(event: DragEvent) {
    this.isDragging.set(true);
    
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = this.effectAllowed();
      event.dataTransfer.setData('application/json', JSON.stringify(this.data()));
    }
    
    this.dragStart.emit(event);
  }
  
  onDragEnd(event: DragEvent) {
    this.isDragging.set(false);
    this.dragEnd.emit(event);
  }
}

@Directive({
  selector: '[appDropZone]',
  host: {
    '[class.drag-over]': 'isDragOver()',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '(drop)': 'onDrop($event)',
  },
})
export class DropZoneDirective {
  isDragOver = signal(false);
  
  dropped = output<any>();
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }
  
  onDragLeave(event: DragEvent) {
    this.isDragOver.set(false);
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    
    const data = event.dataTransfer?.getData('application/json');
    if (data) {
      this.dropped.emit(JSON.parse(data));
    }
  }
}

// Uso:
// <div [appDraggable]="item">Arraste-me</div>
// <div appDropZone (dropped)="onItemDropped($event)">Solte aqui</div>
```
