
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isMain: boolean;
  displayOrder: number;
  alt?: string;
}
