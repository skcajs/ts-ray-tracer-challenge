import './style.css'
import Canvas from './canvas.ts'
import Examples from "./controller/examples.ts";


main();

function main() {
    const canvas = new Canvas(
        document.querySelector<HTMLCanvasElement>('#canvas')!,
        512, 512);

    const examples = Examples(canvas);

    examples.circle(100);
}



