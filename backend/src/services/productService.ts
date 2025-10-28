import axios from 'axios';
import { SearchDTO, OpenFoodFactsDTO, OpenFoodFactsRawDTO } from '@types/productType';

export class ProductService {
  async searchProduct(params: SearchDTO): Promise<OpenFoodFactsDTO | OpenFoodFactsDTO[]> {
    if (params.barcode) {
      const { data } = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${params.barcode}.json`);
      if (data.status === 1) {
        const product: OpenFoodFactsRawDTO = data.product;

        const formattedProduct: OpenFoodFactsDTO = {
          name: product.product_name,
          brand: product.brands,
          image: product.image_url,
          sugars: product.nutriments.sugars_100g,
          caffeine: product.nutriments.caffeine_100g,
          calories: product.nutriments.energy_100g,
        };

        return formattedProduct;
      } else {
        throw new Error('Produit non trouvé');
      }
    } else if (params.name) {
      const { data } = await axios.get(`https://world.openfoodfacts.org/cgi/search.pl`, {
        params: {
          search_terms: params.name,
          search_simple: 1,
          action: 'process',
          fields: 'product_name,brands,code,image_url,nutriments',
          json: 1
        },
      });

      const searchTerm = params.name.toLowerCase();

      const products: OpenFoodFactsDTO[] =  data.products
      .filter((product: OpenFoodFactsDTO) => product.product_name && product.product_name.toLowerCase().includes(searchTerm))
      .slice(0, 10)
      .map((product: OpenFoodFactsRawDTO) => ({
        name: product.product_name,
        brand: product.brands,
        image: product.image_url,
        sugars: product.nutriments?.sugars_100g,
        caffeine: product.nutriments?.caffeine_100g,
        calories: product.nutriments?.energy_100g,
      }));

      return products;
    } else {
      throw new Error('Aucun paramètre de recherche fourni');
    }
  }
}