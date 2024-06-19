const removeCommaCurrencyValue = (value: string) => {
  return Number(value?.replaceAll(",", ""));
};

export default removeCommaCurrencyValue;
