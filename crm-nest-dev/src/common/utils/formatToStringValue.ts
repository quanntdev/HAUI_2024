export function formatToStringValue(value: any) {
  return Number(value)?.toLocaleString(
    undefined,
    { minimumFractionDigits: 2 }
  )
}
