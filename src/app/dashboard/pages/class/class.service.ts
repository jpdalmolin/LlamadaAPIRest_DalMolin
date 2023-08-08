import { BehaviorSubject, Observable, Subject, delay, map, of, take } from 'rxjs';
import { Clase, CreateClassData, UpdateClassData } from './models';

import { Injectable } from '@angular/core';
import { NotifierService } from 'src/app/core/notifier/notifier.service';

const CLASE_DB: Observable<Clase[]> = of([
  {
    id: 1,
    name: 'Marcos',
    description:'asd',
  },
  {
    id: 2,
    name: 'mate',
    description:'asd',
  },
]).pipe(delay(1000));

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private _clase$ = new BehaviorSubject<Clase[]>([]);
  private clase$ = this._clase$.asObservable();

  constructor(private notifier: NotifierService) {}

  loadClasses(): void {
    CLASE_DB.subscribe({
      next: (clasesFromDb) => this._clase$.next(clasesFromDb),
    });
  }

  getClasses(): Observable<Clase[]> {
    return this.clase$;
  }

  getClassById(id: number) {
    return this.clase$.pipe(
      take(1),
      map(( classes) =>  classes.find((u) => u.id === id)),
    )
  }

  createClass(clase: CreateClassData): void {
    // TAKE 1 = solo quiero recibir una emision
    this.clase$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._clase$.next([
          ...arrayActual,
          { ...clase, id: arrayActual.length + 1 },
        ]);
        this.notifier.showSuccess('Clase creada');
      },
    });
  }

  updateClassById(id: number, claseActualizada: UpdateClassData): void {
    this.clase$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._clase$.next(
          arrayActual.map((u) =>
            u.id === id ? { ...u, ...claseActualizada } : u
          )
        );
        this.notifier.showSuccess('Usuario Actualizado');
      },
    });
  }

  deleteClassById(id: number): void {
    this._clase$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._clase$.next(arrayActual.filter((u) => u.id !== id));
        this.notifier.showSuccess('Clase eliminada');
      },
    });
  }
}
