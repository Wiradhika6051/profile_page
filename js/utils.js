export function capitalize(val) {
    return String(val)
            .split(/\s+/) // menangani space > 1
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
}

export function escapeHTML(text) {
  return text
    .replace(/[&<>"'/]/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;",
      "'": "&#39;", "/": "&#x2F;"
    }[c]))
}