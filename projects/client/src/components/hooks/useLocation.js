import { Country, State, City } from "country-state-city";

const formattedCountry = Country.getAllCountries().map((country) => ({
  value: country.isoCode,
  label: country.name,
  flag: country.flag,
  latitude: country.latitude,
  longitude: country.longitude,
}));

const useCountries = () => {
  const getAll = () => formattedCountry;
  const getByValue = (value) =>
    formattedCountry.find((country) => country.value === value);

  return { getAll, getByValue };
};

const useProvinces = (countryIsoCode) => {
  const getAll = () => {
    return State.getStatesOfCountry(countryIsoCode).map((state) => ({
      value: state.isoCode,
      label: state.name,
    }));
  };

  const getByValue = (value) => getAll().find((state) => state.value === value);

  return { getAll, getByValue };
};

const useCities = (countryIsoCode, stateCode) => {
  const getAll = () => {
    return City.getCitiesOfState(countryIsoCode, stateCode).map((city) => ({
      value: city.isoCode,
      label: city.name,
    }));
  };

  const getByValue = (value) => getAll().find((city) => city.value === value);

  return { getAll, getByValue };
};

export { useCountries, useProvinces, useCities };
