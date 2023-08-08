import { Component, Inject, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Clase } from './models';
import { ClassFormDialogComponent } from './components/class-form-dialog/class-form-dialog.component';
import { ClassService } from './class.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',

})
export class ClassComponent implements OnDestroy {
  public clase: Observable<Clase[]>;
  public destroyed = new Subject<boolean>();

  public loading = false;
  constructor(private matDialog: MatDialog, private classService: ClassService) {
    this.classService.loadClasses();
    this.clase = this.classService.getClasses();
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  onCreateClass(): void {
    this.matDialog
      // ABRO EL MODAL
      .open(ClassFormDialogComponent)
      // Y DESPUES DE QUE CIERRE
      .afterClosed()
      // HAGO ESTO...
      .subscribe({
        next: (v) => {
          if (v) {
            this.classService.createClass({
              name: v.name,
              description: v.description,
            });
          }
        },
      });
  }

  onDeleteClass(classToDelete: Clase): void {
    if (confirm(`¿Está seguro de eliminar a ${classToDelete.name}?`)) {
      this.classService.deleteClassById(classToDelete.id);
    }
  }

  onEditClass(classToEdit: Clase): void {
    this.matDialog
      // ABRO EL MODAL
      .open(ClassFormDialogComponent, {
        // LE ENVIO AL MODAL, EL USUARIO QUE QUIERO EDITAR
        data: classToEdit,
      })
      // Y DESPUES DE QUE CIERRE
      .afterClosed()
      // HAGO ESTO...
      .subscribe({
        next: (classUpdated) => {
          if (classUpdated) {
            this.classService.updateClassById(classToEdit.id, classUpdated);
          }
        },
      });
  }
}
