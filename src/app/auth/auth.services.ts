import { BehaviorSubject, Observable, map, take } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { LoginPayload } from "./models";
import { NotifierService } from "../core/notifier/notifier.service";
import { Router } from "@angular/router";
import { User } from "../dashboard/pages/users/models";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authUser$ = new BehaviorSubject<User | null>(null);
  public authUser$ = this._authUser$.asObservable();

  constructor(
    private notifier: NotifierService,
    private router: Router,
    private httpClient: HttpClient,
  ) {}

  isAuthenticated(): Observable<boolean> {
    return this.authUser$.pipe(
      take(1),
      map((user) => !!user),
    );
  }

  login(payload: LoginPayload): void {
    this.httpClient.get<User[]>('http://localhost:3000/users', {
      params: {
        email: payload.email || '',
        password: payload.password || ''
      }
    }).subscribe({
      next: (response) => {
        if (response.length) {
          // LOGIN VALIDO
          this._authUser$.next(response[0]);
          this.router.navigate(['/dashboard']);
        } else {
          // LOGIN INVALIDO
          this.notifier.showError('Email o contrasena invalida');
          this._authUser$.next(null);
        }
      },
    })
  }
}