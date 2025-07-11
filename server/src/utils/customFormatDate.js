export function customFormatDate(date) {
  const formattedDate = new Date(date);
  const month = String(formattedDate.getMonth() + 1).padStart(2, "0");
  const day = String(formattedDate.getDate()).padStart(2, "0");
  const year = formattedDate.getFullYear();
  return `${month}${day}${year}`;
}
