export function formatDate(dateString) {
  const date = new Date(dateString);

  // Array hari dalam bahasa Indonesia
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Bulan dimulai dari 0
  const year = date.getFullYear();

  return `${dayName}, ${day}/${month}/${year}`;
}
