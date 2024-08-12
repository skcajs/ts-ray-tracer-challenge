import Tuple from './tuple.ts';
import {rotation, scaling, shearing, Transformation, translation} from "./transformations.ts";

export default class Matrix implements Transformation {
    readonly elements: number[][];

    constructor(data: number[][]) {
        if ([2, 3, 4].includes(data.length) && data.every(row => row.length === data.length)) {
            this.elements = data;
        } else {
            throw new Error("Data must be a 4x4, 3x3, or 2x2 matrix.");
        }
    }

    getElement(row: number, col: number): number {
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
            throw new Error("Invalid indices for matrix.");
        }
        return this.elements[row][col];
    }

    setElement(row: number, col: number, value: number): void {
        if (row < 0 || row >= 4 || col < 0 || col >= 4) {
            throw new Error("Invalid indices for matrix.");
        }
        this.elements[row][col] = value;
    }

    equals(m: Matrix): boolean {
        const tolerance: number = 1e-5;
        if (this.elements.length !== m.elements.length) return false;

        return this.elements.every((row, i) =>
            row.every((value, j) =>
                Math.abs(value - m.elements[i][j]) < tolerance
            )
        );
    }

    multiply(m: Matrix): Matrix {
        const size = this.elements.length;
        const result = Matrix.Identity(size);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                result.elements[i][j] = 0;
                for (let k = 0; k < size; k++) {
                    result.elements[i][j] += this.elements[i][k] * m.elements[k][j];
                }
            }
        }
        return result;
    }

    multiplyTuple(t: Tuple): Tuple {
        const result = [0, 0, 0, 0];
        const tupleArray = [t.x, t.y, t.z, t.w];

        for (let i = 0; i < 4; i++) {
            result[i] = 0;
            for (let j = 0; j < 4; j++) {
                result[i] += this.elements[i][j] * tupleArray[j];
            }
        }
        return new Tuple(result[0], result[1], result[2], result[3]);
    }

    transpose(): Matrix {
        const size = this.elements.length;
        const result = Matrix.Identity(size);
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                result.elements[j][i] = this.elements[i][j];
            }
        }
        return result;
    }

    determinant(): number {
        if (this.elements.length === 2)
            return this.elements[0][0] * this.elements[1][1] - this.elements[0][1] * this.elements[1][0];
        else {
            let det = 0;
            for (let col = 0; col < this.elements.length; col++) {
                det += this.getElement(0, col) * this.cofactor(0, col);
            }
            return det;
        }
    }

    subMatrix(row: number, col: number): Matrix {
        const size = this.elements.length;
        const result = Matrix.Identity(size - 1);
        let x = 0;
        for (let i = 0; i < size; i++) {
            if (i === row) continue;
            let y = 0;
            for (let j = 0; j < size; j++) {
                if (j === col) continue;
                result.elements[x][y] = this.elements[i][j];
                y++;
            }
            x++;
        }
        return result;
    }

    minor(row: number, col: number): number {
        return this.subMatrix(row, col).determinant();
    }

    cofactor(row: number, col: number): number {
        const minor = this.minor(row, col);
        if ((row + col) % 2 === 0) {
            return minor;
        }
        return -minor;
    }

    isInvertible(): boolean {
        return this.determinant() !== 0;
    }

    inverse(): Matrix {
        if (!this.isInvertible())
            throw new Error("Matrix is not invertible.");

        const size = this.elements.length;
        const result = Matrix.Identity(size);
        const det = this.determinant();
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                result.elements[col][row] = this.cofactor(row, col) / det;
            }
        }
        return result;
    }

    static Identity(size: number = 4): Matrix {
        return new Matrix(Array.from({length: size}, (_, i) =>
            Array.from({length: size}, (_, j) => (i === j ? 1.0 : 0.0))));
    }

    rotate(axis: number, angle: number): Matrix {
        return rotation(axis, angle).multiply(this);
    }

    scale(tx: number, ty: number, tz: number): Matrix {
        return scaling(tx, ty, tz).multiply(this);
    }

    shear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): Matrix {
        return shearing(xy, xz, yx, yz, zx, zy).multiply(this);
    }

    translate(tx: number, ty: number, tz: number): Matrix {
        return translation(tx, ty, tz).multiply(this);
    }

}