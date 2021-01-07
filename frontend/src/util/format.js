export const { format: formatPrice } = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function Capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatDate(date) {
  if (date) {
    if (date.includes('-')) {
      return `${date.substr(8, 2)}/${date.substr(5, 2)}/${date.substr(0, 4)}`;
    }
    return `${date.substr(6)}-${date.substr(3, 2)}-${date.substr(0, 2)}`;
  }
}
