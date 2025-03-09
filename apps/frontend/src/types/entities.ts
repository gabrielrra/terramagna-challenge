
export enum FarmProductType {
  SOY = 'soy',
  CORN = 'corn',
  COTTON = 'cotton',
  WHEAT = 'wheat',
  COFFEE = 'coffee',
  SUGARCANE = 'sugarcane'
}

export interface Farm {
  id: string;
  farmer: Farmer;
  name: string;
  areaHectares: number;
  latitude: number;
  longitude: number;
  product_type: FarmProductType;
  created_at: Date;
}

export interface Farmer {
  id: string;
  client?: Client;
  name: string;
  cpf: string;
  createdAt: Date;
  farms: Farm[];
}

export interface Client {
  id: string;
  name: string;
  username: string;
  password: string;
  password_salt: string;
  cnpj: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  farmers: Farmer[];
}
