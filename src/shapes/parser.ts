// import {readFileSync} from "fs";
// noinspection DuplicatedCode

import Tuple, {makePoint, makeVector} from "../tuple.ts";
import Group, {makeGroup} from "./group.ts";
import Triangle, {makeTriangle} from "./triangle.ts";
import Shape from "./shape.ts";
import {Bounds} from "../bounds.ts";
import {makeSmoothTriangle} from "./smoothTriangle.ts";

export const parseObjectFile = (fileContent: string) => {
    let currentGroup: string = "defaultGroup";
    const parser: { [key: string]: any } = {};
    const vertices: Tuple[] = [];
    const normals: Tuple[] = [];
    let ignored = 0;
    const lines = fileContent.split("\n");
    let useVn = false;

    for (let line of lines) {
        if (line.startsWith("v ")) {
            const v = line.split(" ");
            vertices.push(makePoint(parseFloat(v[1]), parseFloat(v[2]), parseFloat(v[3])));
            continue;
        }
        if (line.startsWith("vn ")) {
            const vn = line.split(" ");
            normals.push(makeVector(parseFloat(vn[1]), parseFloat(vn[2]), parseFloat(vn[3])));
            useVn = true;
        }
        if (line.startsWith("g ")) {
            currentGroup = line.split(" ")[1];
        }
        if (line.startsWith("f ")) {
            let group = parser[currentGroup];
            if (!group) {
                group = makeGroup();
            }
            const fv = line.split(" ").map(item => item.split("/")[0]);
            const fvn = line.split(" ").map(item => item.split("/")[2]);
            if (fv.length == 4) {
                if (useVn) {
                    group.push(makeSmoothTriangle(vertices[parseInt(fv[1]) - 1], vertices[parseInt(fv[2]) - 1], vertices[parseInt(fv[3]) - 1], normals[parseInt(fvn[1]) - 1], normals[parseInt(fvn[2]) - 1], normals[parseInt(fvn[3]) - 1]));
                } else {
                    group.push(makeTriangle(vertices[parseInt(fv[1]) - 1], vertices[parseInt(fv[2]) - 1], vertices[parseInt(fv[3]) - 1]));
                }

                parser[currentGroup] = group;
            } else {
                group.push(...fanTriangulation(vertices, normals, fv, fvn, useVn));
                parser[currentGroup] = group;
            }
        }
        ignored++;
    }
    parser.normals = normals;
    parser.vertices = vertices;
    parser.ignored = ignored;
    return parser;
};

const fanTriangulation = (vertices: Tuple[], normals: Tuple[], fv: string[], fvn: string[], useVn: boolean) => {
    const triangles: Shape[] = [];
    for (let i = 2; i < fv.length - 1; ++i) {
        let tri;
        if (useVn) {
            tri = makeSmoothTriangle(
                vertices[parseInt(fv[1]) - 1], vertices[parseInt(fv[i]) - 1],
                vertices[parseInt(fv[i + 1]) - 1], normals[parseInt(fvn[1]) - 1],
                normals[parseInt(fvn[i]) - 1], normals[parseInt(fvn[i + 1]) - 1]);
        } else {
            tri = makeTriangle(vertices[parseInt(fv[1]) - 1], vertices[parseInt(fv[i]) - 1], vertices[parseInt(fv[i + 1]) - 1]);
        }

        triangles.push(tri);
    }
    return triangles;
};

export const objToGroup = (parser: { [key: string]: any }, autoGroups: boolean = false): Group => {
    const group = makeGroup();

    if (autoGroups) {
        const defaultGroup = parser["defaultGroup"] as Group;
        group.push(splitTriangles(makeGroup(), defaultGroup));
    } else {
        for (let key in parser) {
            if (key != "vertices" && key != "normals" && key != "ignored") {
                group.push(parser[key]);
            }
        }
    }
    return group;
};

const centroid = (triangle: Triangle) => {
    const mx = (triangle.p1.x + triangle.p2.x + triangle.p3.x) / 3;
    const my = (triangle.p1.y + triangle.p2.y + triangle.p3.y) / 3;
    const mz = (triangle.p1.z + triangle.p2.z + triangle.p3.z) / 3;
    return makePoint(mx, my, mz);
};

const getMidpoint = (axis: number, bounds: Bounds) => {
    return (bounds.maximum.get(axis) - (bounds.maximum.get(axis) - bounds.minimum.get(axis)) / 2);
};

const getAxisOfLargestExtent = (bounds: Bounds) => {
    const triangle = [bounds.maximum.x - bounds.minimum.x, bounds.maximum.y - bounds.minimum.y, bounds.maximum.z - bounds.minimum.z];
    const largestTriangle = Math.max(...triangle);
    return triangle.indexOf(largestTriangle);
};

const findSplitIndex = (triangles: Triangle[], midPoint: number, axis: number): number => {
    let low = 0;
    let high = triangles.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const centroidPos = centroid(triangles[mid]).get(axis);

        if (centroidPos <= midPoint) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return low;
};

const splitTriangles = (group: Group, referenceGroup: Group): Group => {
    const bounds = referenceGroup.bounds;
    const triangles = referenceGroup.items() as Triangle[];

    if (triangles.length <= 18) {
        group.push(...triangles);
    } else {
        const axis = getAxisOfLargestExtent(bounds);
        const midPoint = getMidpoint(axis, bounds);

        triangles.sort((a, b) => {
            const centroidA = centroid(a);
            const centroidB = centroid(b);

            return centroidA.get(axis) - centroidB.get(axis);
        });

        const splitIndex = findSplitIndex(triangles, midPoint, axis);

        const groupA = splitTriangles(makeGroup(), makeGroup(...triangles.slice(0, splitIndex)));
        const groupB = splitTriangles(makeGroup(), makeGroup(...triangles.slice(splitIndex)));

        group.push(groupA, groupB);
    }
    return group;
};
