
interface SearchDTO {
  barcode?: string;
  name?: string;
}

interface OpenFoodFactsRawDTO {
  product_name: string;
  brands: string;
  image_url: string;
  nutriments: {
    sugars_100g?: number;
    caffeine_100g?: number;
    energy_100g?: number;
  };
}

interface OpenFoodFactsDTO {
  name: string;
  brand: string;
  image: string;
  sugars?: number;
  caffeine?: number;
  calories?: number;
}