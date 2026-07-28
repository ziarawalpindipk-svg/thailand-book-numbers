function getCycleDate() {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  let cycleDate;
  if (day <= 15) {
    cycleDate = new Date(year, month, 15);
  } else {
    const lastDay = new Date(year, month + 1, 0).getDate();
    cycleDate = new Date(year, month, lastDay);
  }
  return cycleDate.toISOString().split("T")[0];
}

module.exports = getCycleDate;
