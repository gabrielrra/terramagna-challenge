import { Component, AfterViewInit, EventEmitter } from '@angular/core';
import * as L from 'leaflet';
import { ClientService } from '../services/client.service';
import { Client, Farm, Farmer } from '../../types/entities';
import { FarmProductsMap } from '../../utils/constants';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  imports: [MatFormFieldModule, MatSelectModule, MatInputModule, FormsModule],
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {
  private map: L.Map | undefined = undefined;
  private mapAreas: L.Circle[] = [];
  private mapMarkers: L.Marker[] = [];
  private myMarker: L.Marker | null = null;
  private client: Client | null = null;

  private fixedMarkerIcon = L.icon({
    iconUrl: '/media/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    shadowSize: [41, 41],
    iconAnchor: [12, 41],
    shadowAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  mapTypeOptions = [
    { value: 'carteira', viewValue: 'Carteira' },
    { value: 'leads', viewValue: 'Leads' },
  ];

  productOptions = Object.entries(FarmProductsMap)
    .map(([key, value]) => ({ value: key, viewValue: value }));

  mapControls = {
    mapType: this.mapTypeOptions[0].value,
    minimumArea: 0,
    products: Object.keys(FarmProductsMap),
    minimumMin: 0,
    minimumMax: 0,
  };

  private initMap(): void {
    if (!this.client) {
      throw new Error('Client data not found');
    }
    this.map = L.map('map', {
      center: [this.client.latitude, this.client.longitude],
      zoom: 7
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);

    this.myMarker?.remove();
    this.myMarker = L.marker([this.client.latitude, this.client.longitude], { icon: this.fixedMarkerIcon, riseOnHover: true })
      .bindPopup(`
          <i>Você está aqui</i><br>
          <b>${this.client.name}</b>
        `)
      .addTo(this.map);
  }

  constructor(private clientService: ClientService) {
    this.client = clientService.clientData;
  }

  async ngAfterViewInit(): Promise<void> {
    this.initMap();
    this.client = this.clientService.clientData;
    this.client.farmers = await this.clientService.getClientFarmers();
    this.loadFarmersMarkers(this.client.farmers.flatMap(f => f.farms));
  };

  private generateFarmCircle(farm: Farm): L.Circle {
    const squareMeters = farm.areaHectares * 10000;
    const radius = Math.sqrt(squareMeters / Math.PI);
    return L.circle([farm.latitude, farm.longitude], { radius });

  }
  private generateFarmMarker(farm: Farm): L.Marker {
    return L.marker([farm.latitude, farm.longitude], { icon: this.fixedMarkerIcon, riseOnHover: true })
      .bindPopup(`
      <b>${farm.name}</b><br>
      Area: ${farm.areaHectares} hectares<br>
      Produto: ${FarmProductsMap[farm.product_type]}
    `);
  }

  private loadFarmersMarkers(farms: Farm[] = []): void {
    if (!this.map) return;

    this.mapAreas.forEach(marker => marker.remove());
    this.mapMarkers.forEach(marker => marker.remove());
    this.mapMarkers = [];
    this.mapAreas = [];

    for (const farm of farms) {
      if (farm.latitude && farm.longitude) {
        const marker = this.generateFarmMarker(farm);
        const areaCircle = this.generateFarmCircle(farm);

        areaCircle.addTo(this.map);
        marker.addTo(this.map!);
        this.mapAreas.push(areaCircle);
        this.mapMarkers.push(marker);
      }
    }
  }

  async onMapControlsChange() {

    let farmers: Farmer[] = [];

    if (this.mapControls.mapType === 'carteira') {
      farmers = this.client?.farmers || [];
    } else if (this.mapControls.mapType === 'leads') {
      farmers = await this.clientService.getClientLeads();
    }

    let farms = farmers.flatMap(f => f.farms);

    farms = farms.filter(farm => (
      farm.areaHectares >= this.mapControls.minimumArea
      && this.mapControls.products.includes(farm.product_type)
    ));
    console.log(this.mapControls);

    this.loadFarmersMarkers(farms);

    if (this.map && this.mapMarkers.length > 0) {
      const bounds = L.featureGroup(this.mapMarkers).getBounds();
      this.map.fitBounds(bounds);
    }
  }
}
