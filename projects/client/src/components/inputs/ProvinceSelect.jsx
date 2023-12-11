import { useMemo } from "react";
import { useProvinces } from "../hooks/useLocation";
import Select from "react-select";

const ProvinceSelect = ({ value, onChange, countryIsoCode, disabled }) => {
  const { getAll } = useProvinces(countryIsoCode);

  const provinces = useMemo(() => {
    return getAll();
  }, [getAll]);

  return (
    <div>
      <Select
        isDisabled={!countryIsoCode || disabled}
        placeholder="State or Province"
        options={provinces}
        value={value}
        onChange={(selectedProvince) => onChange(selectedProvince)}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3 ">
            <div>{option.label}</div>
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

export default ProvinceSelect;
