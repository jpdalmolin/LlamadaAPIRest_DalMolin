import { BehaviorSubject, Observable, Subject, delay, map, mergeMap, of, take } from 'rxjs';
import { CreateUserData, UpdateUserData, User } from './models';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { NotifierService } from 'src/app/core/notifier/notifier.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _users$ = new BehaviorSubject<User[]>([]);
  private users$ = this._users$.asObservable();

  private _isLoading$ = new BehaviorSubject(false);
  public isLoading$ = this._isLoading$.asObservable();



  constructor(private notifier: NotifierService, private httpClient: HttpClient) {}

  loadUsers(): void {
  
    this._isLoading$.next(true);
    this.httpClient.get<User[]>('http://localhost:3000/users', {
      headers: new HttpHeaders({
        'token': '12345678910'
      }),
      
    }).subscribe({
      next: (response) => {
        // SI TODO SALE OK...
        this._users$.next(response);
      },
      error: () => {
      
        this.notifier.showError('Error al cargar los usuarios');
      },
      complete: () => {
        this._isLoading$.next(false);
        
      },
    })
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUserById(id: number) {
    return this.users$.pipe(
      take(1),
      map(( users ) =>  users.find((u) => u.id === id)),
    )
  }

  createUser(payload: CreateUserData): void {


    this.httpClient.post<User>('http://localhost:3000/users', payload)
      .pipe(
        mergeMap((userCreate) => this.users$.pipe(
          take(1),
          map(
            (arrayActual) => [...arrayActual, userCreate])
          )
        )
      )
      .subscribe({
        next: (arrayActualizado) => {
          this._users$.next(arrayActualizado);
        }
      })
  }


  updateUserById(id: number, usuarioActualizado: UpdateUserData): void {
    this.httpClient.put('http://localhost:3000/users/' + id, usuarioActualizado).subscribe({
      next: () => this.loadUsers(),
    })
  }

  deleteUserById(id: number): void {

    this.httpClient.delete('http://localhost:3000/users/' + id)
      .pipe(
        ).subscribe({
          next: (arrayActualizado) => this.loadUsers(),
        })



  }
}