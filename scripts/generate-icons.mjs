import {readFile,mkdir} from "node:fs/promises";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import sharp from "sharp";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const publicDir=resolve(root,"public");
await mkdir(resolve(publicDir,"brand"),{recursive:true});

// A única fonte de identidade é a logo oficial fornecida pelo cliente.
// O recorte dos ícones é do próprio arquivo, sem símbolos redesenhados.
const original=await readFile(resolve(publicDir,"brand/store-center-logo-oficial.webp"));
const cropped=await sharp(original)
  .extract({left:144,top:37,width:478,height:447})
  .resize(512,512,{fit:"contain",background:"#061735"})
  .png().toBuffer();
await sharp(cropped).webp({quality:91,effort:5}).toFile(resolve(publicDir,"brand/store-center-icon-oficial.webp"));

const BLUE="#061735";
async function icon(name,size,safeZone){
  const extent=Math.round(size*safeZone);
  const inside=await sharp(cropped).resize(extent,extent,{fit:"contain"}).png().toBuffer();
  await sharp({create:{width:size,height:size,channels:4,background:BLUE}})
    .composite([{input:inside,left:Math.floor((size-extent)/2),top:Math.floor((size-extent)/2)}])
    .png({compressionLevel:9}).toFile(resolve(publicDir,name));
  console.log("Icone da logo oficial:",name,size+"x"+size);
}
await icon("favicon-sc-v5.png",64,.98);
await icon("icon-sc-192-v5.png",192,.95);
await icon("icon-sc-512-v5.png",512,.95);
await icon("icon-sc-maskable-512-v5.png",512,.75);
await icon("apple-touch-icon-sc-v5.png",180,.94);

// Arte de compartilhamento: a imagem original da Store Center aparece integralmente.
const shareSvg=[
 '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">',
 '<defs><linearGradient id="b" x2="1" y2=".4"><stop stop-color="#061735"/><stop offset=".56" stop-color="#0a2858"/><stop offset="1" stop-color="#1258a6"/></linearGradient>',
 '<radialGradient id="g"><stop stop-color="#3d9be6" stop-opacity=".36"/><stop offset="1" stop-color="#3d9be6" stop-opacity="0"/></radialGradient></defs>',
 '<rect width="1200" height="630" fill="url(#b)"/>',
 '<circle cx="1015" cy="220" r="350" fill="url(#g)"/>',
 '<path d="M620 0 1030 630M700 0 1110 630M0 600 550 0" stroke="#9edaff" stroke-opacity=".11" stroke-width="2"/>',
 '<path d="M628 100h480" stroke="#7dbff9" stroke-opacity=".33" stroke-width="2"/>',
 '<text x="636" y="181" fill="#77cbff" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="3">STORE CENTER</text>',
 '<text x="634" y="271" fill="#ffffff" font-family="Arial,sans-serif" font-size="45" font-weight="700">Sua assistência,</text>',
 '<text x="634" y="326" fill="#ffffff" font-family="Arial,sans-serif" font-size="45" font-weight="700">mais organizada.</text>',
 '<text x="636" y="397" fill="#bddbf9" font-family="Arial,sans-serif" font-size="21">Ordens de serviço, clientes,</text>',
 '<text x="636" y="433" fill="#bddbf9" font-family="Arial,sans-serif" font-size="21">estoque e financeiro em um lugar.</text>',
 '<rect x="634" y="479" width="195" height="5" rx="2" fill="#31b7ff"/>',
 '</svg>'
].join("");
const fullLogo=await sharp(original).resize(520,520,{fit:"contain"}).png().toBuffer();
await sharp(Buffer.from(shareSvg))
  .composite([{input:fullLogo,left:44,top:53}])
  .flatten({background:"#061735"})
  .jpeg({quality:90,mozjpeg:true})
  .toFile(resolve(publicDir,"og-store-center-v5.jpg"));
console.log("Preview oficial WhatsApp: og-store-center-v5.jpg");

// As artes distintas de cada aba continuam funcionando.
await import("./generate-section-banners.mjs");
