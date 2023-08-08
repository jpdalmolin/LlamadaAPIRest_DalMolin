import { BehaviorSubject, Observable, Subject, delay, map, of, take } from 'rxjs';
import { Courses, CreateCoursesData, UpdateCoursesData } from './models';

import { Injectable } from '@angular/core';
import { NotifierService } from 'src/app/core/notifier/notifier.service';

const COURSES_DB: Observable<Courses[]> = of([
  {
    id: 1,
    name: 'A',
    description:'Curso A',
  },
  {
    id: 2,
    name: 'B',
    description:'Curso B',
  },
]).pipe(delay(1000));

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  private _courses$ = new BehaviorSubject<Courses[]>([]);
  private courses$ = this._courses$.asObservable();

  constructor(private notifier: NotifierService) {}

  loadCourses(): void {
    COURSES_DB.subscribe({
      next: (coursesFromDb) => this._courses$.next(coursesFromDb),
    });
  }

  getCourses(): Observable<Courses[]> {
    return this.courses$;
  }

  getCoursesById(id: number) {
    return this.courses$.pipe(
      take(1),
      map(( courses) =>  courses.find((u) => u.id === id)),
    )
  }

  createCourses(courses: CreateCoursesData): void {
    // TAKE 1 = solo quiero recibir una emision
    this.courses$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._courses$.next([
          ...arrayActual,
          { ...courses, id: arrayActual.length + 1 },
        ]);
        this.notifier.showSuccess('Curso creada');
      },
    });
  }

  updateCoursesById(id: number, coursesActualizado: UpdateCoursesData): void {
    this.courses$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._courses$.next(
          arrayActual.map((u) =>
            u.id === id ? { ...u, ...coursesActualizado } : u
          )
        );
        this.notifier.showSuccess('Usuario Actualizado');
      },
    });
  }

  deleteCoursesById(id: number): void {
    this._courses$.pipe(take(1)).subscribe({
      next: (arrayActual) => {
        this._courses$.next(arrayActual.filter((u) => u.id !== id));
        this.notifier.showSuccess('Curso eliminado');
      },
    });
  }
}
