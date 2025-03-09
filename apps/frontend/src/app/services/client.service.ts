import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { baseApiUrl } from './api.service';
import type { Client, Farmer } from '../../types/entities';

const CLIENT_DATA_KEY = 'clientData';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private _clientData: Client | null = null;

  get clientData(): Client {
    if (this._clientData) {
      return this._clientData;
    }
    const clientDataStr = localStorage.getItem(CLIENT_DATA_KEY);
    if (!clientDataStr) {
      throw new Error('Client data not found');
    }
    return JSON.parse(clientDataStr);
  }

  set clientData(value: Client | null) {
    this._clientData = value;
    if (!value) {
      localStorage.removeItem(CLIENT_DATA_KEY);
      return;
    }
    localStorage.setItem(CLIENT_DATA_KEY, JSON.stringify(value));
  }

  constructor(private http: HttpClient) { }

  async getClientInfo() {
    return await firstValueFrom(this.http.get<Client>(`${baseApiUrl}/client/me`, {}));
  }

  async getClientFarmers() {
    return await firstValueFrom(this.http.get<Farmer[]>(`${baseApiUrl}/client/farmers`, {}));
  }

  async getClientLeads() {
    return await firstValueFrom(this.http.get<Farmer[]>(`${baseApiUrl}/client/leads`, {}));
  }

  async getClientFarms() {
    const farmers = await this.getClientFarmers();
    return farmers.flatMap(farmer => farmer.farms);
  }

}
