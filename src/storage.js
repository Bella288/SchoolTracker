export function saveData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
export function loadData(key, defaultValue = null) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
}
