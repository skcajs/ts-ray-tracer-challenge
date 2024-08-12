import './style.css'
import Canvas from './canvas.ts'
import spheres from "./scenes/spheres.ts";

main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        100, 50);

    spheres(canvas);
}

