const getTotalValueInvoiceOrderItem = (
  value: number | string,
  taxRate: number | string | null
): number => {
  if (typeof value == "string") value = Number(value.replaceAll(",", ""));
  if (typeof taxRate == "string") taxRate = Number(taxRate);
  if (taxRate != null && taxRate != 0) return value + value * (taxRate / 100);
  else return value;
};

export default getTotalValueInvoiceOrderItem;
