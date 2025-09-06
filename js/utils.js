export default function capitalize(val) {
    return String(val)
            .split(/\s+/) // menangani space > 1
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");
}