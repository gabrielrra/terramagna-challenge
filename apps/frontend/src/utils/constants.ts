import { FarmProductType } from '../types/entities';

export const FarmProductsMap: Record<FarmProductType, string> = {
  coffee: 'Café',
  corn: 'Milho',
  cotton: 'Algodão',
  soy: 'Soja',
  sugarcane: 'Cana de Açúcar',
  wheat: 'Trigo',
} as const;
