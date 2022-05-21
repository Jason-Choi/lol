import { arc, format, pie, schemeCategory10, Selection } from "d3"

export default class PieChart {
    selection: Selection<any, any, any, any>
    values: number[]
    valueLength: number
    width: number
    height: number
    margin: number
    color: readonly string[]

    constructor(
        selection: Selection<any, any, any, any>,
        values: number[],
        width: number,
        height: number,
        margin: number
    ) {
        this.selection = selection
        const numFalse = values.reduce((acc, cur) => acc + Number(cur === 0), 0)
        const numTrue = values.reduce((acc, cur) => acc + Number(cur === 1), 0)
        this.values = [numFalse, numTrue]
        this.valueLength = values.length
        this.width = width
        this.height = height
        this.margin = margin
        this.color = [schemeCategory10[1], schemeCategory10[2]]
        this.render()
    }

    render() {
        const pieCalc = pie()
        const arcCalc = arc()
            .innerRadius(0)
            .outerRadius((this.width - this.margin) * 0.65 * 0.5)
        const binded = this.selection
            .selectAll(".pie")
            .data(pieCalc(this.values))
            .join("g")
            .attr("class", "pie")
            .attr("transform", `translate(${this.width / 2}, ${this.width / 2 - this.margin})`)

        binded
            .append("path")
            .attr("d", arcCalc as any)
            .attr("fill", (d, i) => this.color[i])
            .attr("opacity", 0.5)

        binded
            .append("text")
            .attr("class", "label")
            .attr("transform", (d) => `translate(${arcCalc.centroid(d as any)})`)
            .attr("dy", ".35em")
            .attr("dx", "-1em")
            .attr("font-size", 24)
            .attr("fill", "white")
            .attr("font-weight", 600)
            .text((d) => {
                return `${format(".1f")((d.value / this.valueLength) * 100)}%`
            })
    }
}
