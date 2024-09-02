// noinspection DuplicatedCode

import {test, expect} from "vitest";
import {objToGroup, parseObjectFile} from "../shapes/parser.ts";
import {compareTuples} from "./helpers.ts";
import {makePoint, makeVector} from "../tuple.ts";
import Triangle from "../shapes/triangle.ts";
import Group from "../shapes/group.ts";

import gibberish from "./src/test/data/gibberish.txt?raw";
import vertex from "./src/test/data/vertexRecords.txt?raw";
import triangleFaces from "./src/test/data/triangleFaces.txt?raw";
import objects from "./src/test/data/objects.txt?raw";
import vertexNormals from "./src/test/data/vertexNormals.txt?raw";
import facesWithNormals from "./src/test/data/facesWithNormals.txt?raw";
import teapot from "./src/test/data/teapot.txt?raw";

test("Ignoring unrecognized lines", () => {

    const parser = parseObjectFile(gibberish);
    expect(parser.ignored).toBe(5);
});

test("Vertex records", () => {
    const parser = parseObjectFile(vertex);
    expect(parser.ignored).toBe(0);
    compareTuples(parser.vertices[0], makePoint(-1, 1, 0));
    compareTuples(parser.vertices[1], makePoint(-1, 0.5, 0));
    compareTuples(parser.vertices[2], makePoint(1, 0, 0));
    compareTuples(parser.vertices[3], makePoint(1, 1, 0));
});

test("Parsing triangle faces", () => {
    const parser = parseObjectFile(triangleFaces);
    const g = parser.defaultGroup;
    const t1 = g.get(0) as Triangle;
    const t2 = g.get(1) as Triangle;
    compareTuples(t1?.p1, parser.vertices[0]);
    compareTuples(t1?.p2, parser.vertices[1]);
    compareTuples(t1?.p3, parser.vertices[2]);
    compareTuples(t2?.p1, parser.vertices[0]);
    compareTuples(t2?.p2, parser.vertices[2]);
    compareTuples(t2?.p3, parser.vertices[3]);
});

test("Trianglulating polygons", () => {
    const parser = parseObjectFile(objects);
    const g1 = parser.FirstGroup as Group;
    const g2 = parser.SecondGroup as Group;
    const t1 = g1.get(0) as Triangle;
    const t2 = g2.get(0) as Triangle;
    compareTuples(t1?.p1, parser.vertices[0]);
    compareTuples(t1?.p2, parser.vertices[1]);
    compareTuples(t1?.p3, parser.vertices[2]);
    compareTuples(t2?.p1, parser.vertices[0]);
    compareTuples(t2?.p2, parser.vertices[2]);
    compareTuples(t2?.p3, parser.vertices[3]);
});

test("Converting an OBJ file to a group", () => {
    const parser = parseObjectFile(objects);
    const g = objToGroup(parser);
    expect(g.get(0)).toEqual(parser.FirstGroup);
    expect(g.get(1)).toEqual(parser.SecondGroup);
});

test("Vertex normal records", () => {
    const parser = parseObjectFile(vertexNormals);
    compareTuples(parser.normals[0], makeVector(0, 0, 1));
    compareTuples(parser.normals[1], makeVector(0.707, 0, -0.707));
    compareTuples(parser.normals[2], makeVector(1, 2, 3));
});

test("Faces with normals", () => {
    const parser = parseObjectFile(facesWithNormals);
    const g = parser.defaultGroup;
    const t1 = g.get(0);
    const t2 = g.get(1);
    compareTuples(t1.p1, parser.vertices[0]);
    compareTuples(t1.p2, parser.vertices[1]);
    compareTuples(t1.p3, parser.vertices[2]);
    compareTuples(t1.n1, parser.normals[2]);
    compareTuples(t1.n2, parser.normals[0]);
    compareTuples(t1.n3, parser.normals[1]);
    expect(t2).toEqual(t1);
});


test("That my teapot is rendering", () => {
    const parser = parseObjectFile(teapot);
    const g = objToGroup(parser, true);
    expect(g.get(0));
});