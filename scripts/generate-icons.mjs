import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const publicDir=resolve(projectRoot,"public");
const vector=await readFile(resolve(publicDir,"favicon.svg"));
await mkdir(publicDir,{recursive:true});
for(const [name,size] of [["icon-192.png",192],["icon-512.png",512],["icon-maskable-512.png",512],["apple-touch-icon.png",180]]){
 await sharp(vector,{density:300}).resize(size,size).png({compressionLevel:9}).toFile(resolve(publicDir,name));
 console.log("PWA icon:",name,size+"x"+size);
}
