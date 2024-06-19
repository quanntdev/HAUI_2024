const defaultCountrySelect = (dataCountry: any) => {
  if (dataCountry) {
    const defaultCountry = dataCountry.find((item: any) => item.name === "JP");
    return defaultCountry ? defaultCountry.id.toString() : null;
  }
};

export default defaultCountrySelect;
