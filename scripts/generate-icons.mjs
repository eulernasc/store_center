import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const publicDir=resolve(root,"public");
const logo=await readFile(resolve(publicDir,"brand/store-center-mark.webp"));
await mkdir(publicDir,{recursive:true});

const BLUE="#081B3D";
async function icon(name,size,safeZone=0.84){
  const extent=Math.round(size*safeZone);
  const inside=await sharp(logo).resize(extent,extent,{fit:"contain",background:BLUE}).png().toBuffer();
  await sharp({create:{width:size,height:size,channels:4,background:BLUE}})
    .composite([{input:inside,left:Math.floor((size-extent)/2),top:Math.floor((size-extent)/2)}])
    .png({compressionLevel:9}).toFile(resolve(publicDir,name));
  console.log("SC Assistência PWA:",name,size+"x"+size);
}
await icon("favicon-sc-v3.png",64,0.97);
await icon("icon-sc-192-v3.png",192,0.92);
await icon("icon-sc-512-v3.png",512,0.92);
await icon("icon-sc-maskable-512-v3.png",512,0.72);
await icon("apple-touch-icon-sc-v3.png",180,0.91);
