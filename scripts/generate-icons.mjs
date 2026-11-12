import { readFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const publicDir=resolve(root,"public");
const logo=await readFile(resolve(publicDir,"brand/store-center-emblem.svg"));
await mkdir(publicDir,{recursive:true});

const BLUE="#0A2148";
async function icon(name,size,safeZone=0.84){
  const extent=Math.round(size*safeZone);
  const inside=await sharp(logo).resize(extent,extent,{fit:"contain",background:BLUE}).png().toBuffer();
  await sharp({create:{width:size,height:size,channels:4,background:BLUE}})
    .composite([{input:inside,left:Math.floor((size-extent)/2),top:Math.floor((size-extent)/2)}])
    .png({compressionLevel:9}).toFile(resolve(publicDir,name));
  console.log("SC Assistência PWA:",name,size+"x"+size);
}
await icon("favicon-sc-v4.png",64,0.97);
await icon("icon-sc-192-v4.png",192,0.93);
await icon("icon-sc-512-v4.png",512,0.93);
await icon("icon-sc-maskable-512-v4.png",512,0.73);
await icon("apple-touch-icon-sc-v4.png",180,0.94);

const socialSvg=await readFile(resolve(root,"scripts/preview-social.svg"));
await sharp(socialSvg,{density:120}).resize(1200,630,{fit:"fill"}).flatten({background:"#06142e"}).jpeg({quality:89,mozjpeg:true}).toFile(resolve(publicDir,"og-store-center-v4.jpg"));
console.log("WhatsApp preview: og-store-center-v4.jpg (1200x630)");
