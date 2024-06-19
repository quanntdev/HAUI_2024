const formatCurrencyValue = function (value: any) {
  const newNumber = Number(value);
  if (!newNumber) {
    return value;
  }
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2
  }).format(newNumber);
};

export default formatCurrencyValue;
