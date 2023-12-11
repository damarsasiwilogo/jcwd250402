import { useMemo } from "react";
import Select from "react-select";
import { useCountries } from "../hooks/useLocation";

const CountrySelect = ({ value, onChange, disabled }) => {
  const { getAll } = useCountries();
  const allCountries = useMemo(() => getAll(), [getAll]);

  return (
    <div>
      <Select
        required
        isDisabled={disabled}
        placeholder="Country"
        options={allCountries}
        value={value}
        selectedCountry={value.isoCode}
        onChange={(selectedCountry) => onChange(selectedCountry)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3 ">
            <div>{option.flag}</div>
            <div>
              {option.label}
              <span className="ml-1 text-neutral-500">{option.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
      />
    </div>
  );
};

export default CountrySelect;
