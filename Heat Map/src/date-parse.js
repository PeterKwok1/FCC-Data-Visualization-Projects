export function yearParse(str) {
    return new Date(`${str}-01-01T00:00:00.000`)
}

export function monthParse(str) {
    return new Date(`2000-${padder(str)}-01T00:00:00.000`)
}

function padder(str, z) {
    z = z || 2
    return `0${str}`.slice(-z)
}