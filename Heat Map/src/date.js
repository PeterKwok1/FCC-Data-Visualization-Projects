// add month 0 padder

export function year(str) {
    return new Date(`${str}-01-01T00:00:00.000Z`)
}

export function month(str) {
    return new Date(`2000-${str}-01T00:00:00.000Z`)
}