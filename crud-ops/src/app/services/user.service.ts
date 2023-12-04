// user.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(`${this.apiUrl}/users`)
      .pipe(catchError(this.handleError<User[]>('getUsers', [])));
  }

  getUser(_id: Number): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/${_id}`)
      .pipe(catchError(this.handleError<User>('getUser')));
  }

  addUser(user: User): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/users`, user)
      .pipe(catchError(this.handleError<User>('addUser')));
  }

  updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/${user._id}`, user)
      .pipe(catchError(this.handleError<User>('updateUser')));
  }

  deleteUser(_id: Number): Observable<User> {
    return this.http
      .delete<User>(`${this.apiUrl}/users/${_id}`)
      .pipe(catchError(this.handleError<User>('deleteUser')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
