import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Client, Farmer } from '../../types/entities';
import { AuthService } from '../services/auth.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatTableModule, MatSortModule, MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent {
  displayedColumns: string[] = ['name', 'cpf', 'createdAt'];
  dataSource = new MatTableDataSource<Farmer>([]);
  client: Client | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private clientService: ClientService) {
  }

  async ngOnInit() {
    const farmers = await this.clientService.getClientFarmers();
    if (farmers) {
      this.dataSource.data = farmers;
      this.dataSource.sort = this.sort;
    }
    this.client = this.clientService.clientData;
  }
}
