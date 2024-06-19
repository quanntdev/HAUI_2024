export function convertStringToNumber(value: string) {
  const newValue = value.split(',').join('');
  return Number(newValue);
}
