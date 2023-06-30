import citiesRepository from '../../src/domain/cities/repository/worldCitiesRespository'

describe('getAllCitiesRepository', () => {
    test('should return all cities', () => {
      const cities = citiesRepository.getAllCitiesRepository();
      expect(cities).toEqual(worldCitiesDataset);
    });
});

describe('searchCitiesByCountryName', () => {
    test('should return cities by country name', () => {
      const countryName = 'Andorra';
      const result = citiesRepository.searchCitiesByCountryName(countryName);
      const expected = [
        { country: 'Andorra', geonameid: 3040051, name: 'les Escaldes', subcountry: 'Escaldes-Engordany' },
        //{ country: 'Andorra', geonameid: 3041563, name: 'Andorra la Vella', subcountry: 'Andorra la Vella' }
      ];
      expect(result).toEqual(expected);
    });
});

describe('searchCityByCityNameAndCountry', () => {
    test('should return cities by city name and country', () => {
      const cityName = 'Andorra la Vella';
      const countryName = 'Andorra';
      const result = citiesRepository.searchCityByCityNameAndCountry(cityName, countryName);
      const expected = [{ country: 'Andorra', geonameid: 3041563, name: 'Andorra la Vella', subcountry: 'Andorra la Vella' }];
      expect(result).toEqual(expected);
    });
});

// Test para el caso de uso: devolver todos los países disponibles"
describe('GET /api/cities', () => {
    test('should return all countries', async () => {
      const response = await request(app.callback()).get('/api/cities');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(worldCitiesDataset);
    });
});

//Test para el caso de uso: country es un string de largo >= 3 y encuentra resultados
describe('GET /api/cities/by_country/:country', () => {
    test('should return cities by country name', async () => {
      const countryName = 'andorra';
      const response = await request(app.callback()).get(`/api/cities/by_country/${countryName}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { country: 'Andorra', geonameid: 3040051, name: 'les Escaldes', subcountry: 'Escaldes-Engordany' },
        //probando
        //{ country: 'Andorra', geonameid: 3041563, name: 'Andorra la Vella', subcountry: 'Andorra la Vella' }
      ]);
    });
});

//Test para el caso de uso: country es un string de largo >= 3 y no encuentra resultados
  describe('GET /api/cities/by_country/:country', () => {
    test('should return empty array with message when no cities found', async () => {
      const countryName = 'nonexistent';
      const response = await request(app.callback()).get(`/api/cities/by_country/${countryName}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'No se encontraron ciudades para el país ingresado' });
    });
});

//Test para el caso de uso: 'Solo se aceptan caracteres no numéricos'":
describe('GET /api/cities/by_country/:country', () => {
    test('should return error message for non-alphabetic country name', async () => {
      const countryName = '1234';
      const response = await request(app.callback()).get(`/api/cities/by_country/${countryName}`);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Solo se aceptan caracteres no numéricos' });
    });
});

//Test para el caso de uso: debe devolver un status 200 y en el body, un arreglo con los objetos que hayan resultado de la búsqueda":
describe('GET /api/city/:city/country/:country', () => {
    test('should return cities by city name and country', async () => {
      const cityName = 'andorra la vella';
      const countryName = 'andorra';
      const response = await request(app.callback()).get(`/api/city/${cityName}/country/${countryName}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { country: 'Andorra', geonameid: 3041563, name: 'Andorra la Vella', subcountry: 'Andorra la Vella' }
      ]);
    });
});

//Test para el caso de uso: "Dado: Una consulta al servicio - Cuando: realice una solicitud a /api/city/:city/country/:country, 'No se encontraron ciudades para el país ingresado'":
describe('GET /api/city/:city/country/:country', () => {
    test('should return empty array with message when no cities found', async () => {
      const cityName = 'nonexistent';
      const countryName = 'nonexistent';
      const response = await request(app.callback()).get(`/api/city/${cityName}/country/${countryName}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'No se encontraron ciudades para el país ingresado' });
    });
});

//Test para el caso de uso: Cuando: realice una solicitud a /api/city/:city/country/:country, 'Solo se aceptan caracteres no numéricos'
describe('GET /api/city/:city/country/:country', () => {
    test('should return error message for non-alphabetic city and country names', async () => {
      const cityName = '1234';
      const countryName = '1234';
      const response = await request(app.callback()).get(`/api/city/${cityName}/country/${countryName}`);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ message: 'Solo se aceptan caracteres no numéricos' });
    });
});

//Test para el caso de uso: debe devolver un status 400 y en el body, un objeto con el mensaje 'El país/ciudad ingresado debe tener al menos 3 caracteres
describe('GET endpoints with input length < 3', () => {
    test('should return error message for input length < 3', async () => {
      const response1 = await request(app.callback()).get('/api/cities/by_country/ab');
      const response2 = await request(app.callback()).get('/api/city/ab/country/abc');
      expect(response1.status).toBe(400);
      expect(response1.body).toEqual({ message: 'El país/ciudad ingresado debe tener al menos 3 caracteres' });
      expect(response2.status).toBe(400);
      expect(response2.body).toEqual({ message: 'El país/ciudad ingresado debe tener al menos 3 caracteres' });
    });
});