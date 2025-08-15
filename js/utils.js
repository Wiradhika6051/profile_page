export default function capitalize(val) {
    return String(val).split(" ").map((word)=>{return word.charAt(0).toUpperCase() + word.slice(1)}).join(" ");
}