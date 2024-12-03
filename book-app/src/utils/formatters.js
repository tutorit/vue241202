
let muuttuja=3.14;

export function formatCurrency(value){
    const fiCurrency=new Intl.NumberFormat("fi-FI", {style: "currency", currency: "EUR" });
    return fiCurrency.format(value);
}

export function formatDate(dt){
    return dt.toLocaleDateString();
}

export const vFocus = {
    mounted: (el) => el.focus()
}
    