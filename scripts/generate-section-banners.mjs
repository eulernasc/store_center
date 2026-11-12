import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Reutiliza a imagem de manutenção aprovada como fotografia base.
// Cada módulo recebe uma composição gráfica própria sobre ela.
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const dir=resolve(root,"public/brand/sections");
await mkdir(dir,{recursive:true});
const source=resolve(root,"public/brand/bancada-aprovada.webp");
const W=1600,H=390;
const sections=[
["ordens-servico","clipboard"],["orcamentos","receipt"],
["clientes","people"],["pecas-estoque","chip"],
["venda-produtos","bag"],["aparelhos","devices"],
["servicos","tools"],["financeiro","chart"],
["garantias","shield"],["vitrine","shop"],
["fornecedores","truck"],["receber","receive"],
["pagar","pay"],["caixa","wallet"],
["venda-aparelhos","deviceSale"],["relatorios","report"],
["inteligencia","brain"],["equipe","team"],
["catalogo","catalog"],["configuracoes","settings"],
["historico","clock"],["pesquisa","search"],["impressoes","printer"]
];
const symbols={
clipboard:'<rect x="-64" y="-96" width="128" height="188" rx="17"/><rect x="-27" y="-112" width="54" height="29" rx="7"/><path d="m-37-32 14 14 23-28M14-21h35M-37 24l14 14 23-28M14 35h35"/>',
receipt:'<path d="M-68-98H68V99l-20-12-20 12-20-12-20 12-20-12-20 12-16-12Z"/><path d="M-40-51h80M-40-17h80M-40 17h40M-40 51h65"/>',
people:'<circle cx="0" cy="-47" r="36"/><path d="M-83 92V67c0-47 37-73 83-73s83 26 83 73v25M-84-41c-50-2-54 59-17 67M84-41c50-2 54 59 17 67"/>',
chip:'<rect x="-72" y="-73" width="144" height="144" rx="17"/><rect x="-37" y="-38" width="74" height="74" rx="9"/><path d="M-107-44h35M-107 0h35M-107 44h35M72-44h35M72 0h35M72 44h35M-43-106v33M0-106v33M43-106v33M-43 72v34M0 72v34M43 72v34"/>',
bag:'<path d="M-78-43H78l-12 139H-66Z"/><path d="M-40-42v-24a40 40 0 0 1 80 0v24M-30 16h60M0-13v57"/>',
devices:'<rect x="-64" y="-105" width="106" height="207" rx="19"/><path d="M-42-79h61M-22 73h26"/><rect x="36" y="-65" width="82" height="127" rx="11"/><path d="M57 40h41"/>',
tools:'<path d="M-60-70c-43 3-51 49-34 77l35-29 29 28-28 35c32 24 69 2 70-28L91 93l26-26-79-79C41-45 10-73-16-65L-47-33l-29-27 30-37Z"/>',
chart:'<path d="M-97 90H94M-78 68v-55h30v55M-21 68V-31h30v99M36 68V-81h30V68"/><path d="m-80-47 48-20 40 16 58-61"/>',
shield:'<path d="M0-107 91-73v65c0 52-30 88-91 113C-62 80-91 44-91-8v-65Z"/><path d="m-44-7 31 32 60-68"/>',
shop:'<path d="M-99-35h198l-17-56H-82Z"/><path d="M-84-35v127H84V-35M-50 92V17H22v75M37 0h30v37H37Z"/><path d="M-99-35q18 46 40 0 26 46 49 0 25 46 49 0 24 46 60 0"/>',
truck:'<path d="M-112-65h143V54h-143Z"/><path d="M31-35h46l37 45v44H31Z"/><circle cx="-65" cy="58" r="23"/><circle cx="75" cy="58" r="23"/><path d="M77-35V9h37"/>',
receive:'<rect x="-80" y="-91" width="150" height="180" rx="13"/><path d="M-44-52h83M-44-20h52M-44 12h52"/><path d="M54-17v103m-38-38 38 38 38-38"/>',
pay:'<rect x="-80" y="-91" width="150" height="180" rx="13"/><path d="M-44-52h83M-44-20h52M-44 12h52"/><path d="M54 86V-17M16 21l38-38 38 38"/>',
wallet:'<rect x="-104" y="-74" width="206" height="159" rx="17"/><path d="M-104-49h167M24-18h92v65H24a30 30 0 0 1 0-65Z"/><circle cx="55" cy="16" r="7"/>',
deviceSale:'<rect x="-64" y="-104" width="119" height="210" rx="20"/><path d="M-36-76h61M-22 77h35"/><path d="m35-32 61 23-17 72-64-24M29 9h52"/>',
report:'<rect x="-99" y="-92" width="198" height="185" rx="12"/><path d="M-69 54V8h32v46M-19 54v-92h33v92M33 54v-65h32v65M-69 74h138"/>',
brain:'<path d="M-11-80c-35-45-96-4-78 44-39 33-16 91 27 92C-44 102-9 104-9 69v-149ZM11-80c35-45 96-4 78 44 39 33 16 91-27 92C44 102 9 104 9 69v-149Z"/><path d="M-56-21h32l25 33h48M-48 39h25L1 65M-18-62l17 19 17-19"/>',
team:'<circle cx="-50" cy="-39" r="27"/><circle cx="50" cy="-39" r="27"/><circle cx="0" cy="-66" r="30"/><path d="M-95 88V53c0-31 14-54 43-62M95 88V53c0-31-14-54-43-62M-50 89V48C-50 3-31-13 0-13S50 3 50 48v41"/>',
catalog:'<rect x="-88" y="-77" width="71" height="157" rx="13"/><rect x="0" y="-104" width="93" height="182" rx="16"/><path d="M-70 51h35M24 47h45M-93 101H96"/>',
settings:'<circle r="60"/><circle r="22"/><path d="M-19-104h38l8 31 30 16 29-13 20 32-23 23v30l23 23-20 32-29-13-30 16-8 31h-38l-8-31-30-16-29 13-20-32 23-23v-30l-23-23 20-32 29 13 30-16Z"/>',
clock:'<circle r="95"/><path d="M0-54v64l42 27M-95-19l-22-17 22-19M-114-40h-18"/>',
search:'<circle cx="-22" cy="-23" r="68"/><path d="m26 28 82 82"/><path d="M-65-18c0-27 18-46 46-46"/>',
printer:'<path d="M-68-88H68v61H-68Z"/><rect x="-105" y="-27" width="210" height="105" rx="16"/><path d="M-68 43H68v61H-68Z"/><circle cx="70" cy="-1" r="5"/>'
};
const colors=["#48d6ff","#72b9ff","#63e3f6","#6dc4ff","#4db9f5"];
const base=await sharp(source).resize(W,H,{fit:"cover",position:"centre"}).modulate({brightness:0.96,saturation:1.25}).toBuffer();
for(let i=0;i<sections.length;i++){
 const [slug,shape]=sections[i];
 const accent=colors[i%colors.length],x=1330-(i%3)*26,y=195+((i%4)-2)*8;
 const motif=symbols[shape];
 if(!motif)throw new Error("Missing motif for "+slug);
 const svg=[
 '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="390" viewBox="0 0 1600 390">',
 '<defs><linearGradient id="shade"><stop stop-color="#06142e" stop-opacity=".98"/><stop offset=".38" stop-color="#07182f" stop-opacity=".91"/><stop offset=".73" stop-color="#071a36" stop-opacity=".49"/><stop offset="1" stop-color="#072451" stop-opacity=".12"/></linearGradient>',
 '<radialGradient id="glow"><stop stop-color="'+accent+'" stop-opacity=".29"/><stop offset="1" stop-color="'+accent+'" stop-opacity="0"/></radialGradient></defs>',
 '<rect width="1600" height="390" fill="url(#shade)"/>',
 '<circle cx="'+x+'" cy="'+y+'" r="250" fill="url(#glow)"/>',
 '<path d="M'+(420+i%5*27)+' 0L'+(770+i%5*29)+' 390M720 390L1110 0" stroke="'+accent+'" stroke-opacity=".16" stroke-width="2"/>',
 '<path d="M1120 40h190l30 31h180M1080 346h190l50-50h210" stroke="'+accent+'" stroke-opacity=".24" stroke-width="3" fill="none"/>',
 '<g transform="translate('+x+' '+y+')">',
 '<circle r="134" fill="#0b2d59" fill-opacity=".75" stroke="'+accent+'" stroke-width="4"/>',
 '<circle r="118" fill="#12437f" fill-opacity=".27" stroke="#b2e7ff" stroke-opacity=".44" stroke-width="2"/>',
 '<g stroke="#e7faff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" transform="scale(.83)">'+motif+'</g></g>',
 '<circle cx="'+(x+178)+'" cy="'+(y-134)+'" r="7" fill="'+accent+'" fill-opacity=".85"/>',
 '<path d="M0 0H710Q560 190 690 390H0Z" fill="#06142e" opacity=".13"/>',
 '</svg>'
 ].join("");
 await sharp(base).composite([{input:Buffer.from(svg)}]).webp({quality:83,effort:4}).toFile(resolve(dir,slug+".webp"));
 console.log("Store Center banner:",slug);
}
