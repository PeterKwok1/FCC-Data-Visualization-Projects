export async function fetchData(links) {
    let responses = await Promise.all(links.map(e => fetch(e)))
    let data = await Promise.all(responses.map(e => e.json()))
    return data
}