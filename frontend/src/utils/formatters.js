export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function calculateDiscount(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  const percentage = Math.round(((originalPrice - price) / originalPrice) * 100);
  return `${percentage}% OFF`;
}

export function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}
