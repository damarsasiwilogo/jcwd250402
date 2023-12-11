import { useMemo } from "react";
import { useCities } from "../hooks/useLocation";
import Select from "react-select";

const CitySelect = ({
  value,
  onChange,
  countryIsoCode,
  provinceIsoCode,
  disabled,
}) => {
  const { getAll } = useCities(countryIsoCode, provinceIsoCode);

  const cities = useMemo(() => {
    return getAll();
  }, [getAll]);

  return (
    <div>
      <Select
        isDisabled={!provinceIsoCode || !countryIsoCode || disabled}
        placeholder="City"
        options={cities}
        value={value}
        onChange={(selectedCity) => onChange(selectedCity)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3 ">
            <div>{option.label}</div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-xl",
        }}
      />
    </div>
  );
};

export default CitySelect;
