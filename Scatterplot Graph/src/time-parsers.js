export function hourParse(string) {
    return new Date(`2000-01-01T00:${string}`)
}

export function yearParse(string) {
    return new Date(`${string}-01-01T00:00`)
}