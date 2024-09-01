// import {readFileSync} from "fs";
import Tuple, {makePoint} from "../tuple.ts";
import Group, {makeGroup} from "./group.ts";
import {makeTriangle} from "./triangle.ts";
import Shape from "./shape.ts";

export const parseObjectFile = (fileContent: string) => {
    let currentGroup: string = "defaultGroup";
    const parser: { [key: string]: any } = {};
    const vertices: Tuple[] = [];
    let ignored = 0;
    const lines = fileContent.split("\n");
    ;

    for (let line of lines) {
        if (line.startsWith("v")) {
            const v = line.split(" ");
            vertices.push(makePoint(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3])));
            continue;
        }
        if (line.startsWith("g")) {
            const g = line.split(" ");
            currentGroup = g[1];
        }
        if (line.startsWith("f")) {
            let group = parser[currentGroup];
            if (!group) {
                group = makeGroup();
            }
            const f = line.split(" ");
            if (f.length == 4) {
                group.push(makeTriangle(vertices[parseInt(f[1]) - 1], vertices[parseInt(f[2]) - 1], vertices[parseInt(f[3]) - 1]));
                parser[currentGroup] = group;
            } else {
                group.push(...fanTriangulation(vertices));
                parser[currentGroup] = group;
            }
        }
        ignored++;
    }
    parser.vertices = vertices;
    parser.ignored = ignored;
    return parser;
};

const fanTriangulation = (vertices: Tuple[]) => {
    const triangles: Shape[] = [];
    for (let i = 1; i < vertices.length - 1; ++i) {
        const tri = makeTriangle(vertices[0], vertices[i], vertices[i + 1]);
        triangles.push(tri);
    }
    return triangles;
};

export const objToGroup = (parser: { [key: string]: any }): Group => {
    const group = makeGroup();
    for (let key in parser) {
        if (key != "vertices" && key != "ignored") {
            group.push(parser[key]);
        }
    }
    return group;
};