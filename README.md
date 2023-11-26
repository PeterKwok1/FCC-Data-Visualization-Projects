# D3 enter, update, exit 
    https://www.youtube.com/watch?v=HE5Pbq6seZo
    https://www.d3indepth.com/enterexit/
    https://www.youtube.com/watch?v=AYPTVwRaYiI 
## Example
```
    let dataBase = [1, 2, 3]
    let dataBase_2 = [4, 5, 6]
    let dataMore = [7, 8, 9, 10]
    let dataLess = [11, 12]

    function barJoin(data) {
        svg.selectAll("rect")
            .data(data)
            .join(
                (enter) => {
                    return enter.append("rect")
                },
                (update) => {
                    return update
                },
                (exit) => {
                    return exit
                }
            )
            .attr("fill", "black")
            .attr("stroke", "white")
            .attr("height", (d) => d * 25)
            .attr("width", 20)
            .attr("x", (d, i) => i * 20)
            .attr("y", (d) => 500 - d * 25)
            .attr("data-value", (d) => d)
    }

    barJoin(dataMore)
    barJoin(dataLess)
```





