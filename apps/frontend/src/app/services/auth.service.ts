import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { baseApiUrl } from './api.service';
import { ClientService } from './client.service';
import { LoginResponseDto } from '../../types/auth.types';

const AUTH_TOKEN_KEY = 'accessToken';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private clientService: ClientService
  ) {
  }

  async login(username: string, password: string): Promise<boolean> {
    const res = await firstValueFrom(
      this.http.post<LoginResponseDto>(`${baseApiUrl}/auth/login`, { username, password })
    ).catch(() => null);

    if (!res) return false;
    this.clientService.clientData = res.client;
    this.setAuthToken(res.accessToken);

    this.router.navigate(['']);
    return true;
  }

  logout() {
    this.clearAuthToken();
    this.clientService.clientData = null;
    this.router.navigate(['login']);
  }

  setAuthToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  getAuthToken(): string {
    return localStorage.getItem(AUTH_TOKEN_KEY) || '';
  }

  private clearAuthToken() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }

}
