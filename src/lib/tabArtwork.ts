/** Artes vetoriais exclusivas por módulo, sem lettering rasterizado e sem arquivos remotos.
 * Visão geral/Bancada continuam usando as artes aprovadas (WebP). */
const art=[
 ['ordens de servico','os','<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3.5h6M9 9h6M9 13h6M9 17h3"/><path d="m14 17 2 2 4-4"/>'],
 ['orcamentos','budget','<path d="M6 2h9l4 4v16H6z"/><path d="M15 2v5h5M9 11h6M9 15h6M9 19h4"/><circle cx="18" cy="18" r="4"/>'],
 ['clientes','clients','<circle cx="9" cy="8" r="3.4"/><path d="M2 21v-2c0-3.2 3-5 7-5s7 1.8 7 5v2"/><circle cx="18.5" cy="8.5" r="2.5"/><path d="M17.7 14c3.1.3 4.3 2.5 4.3 5v2"/>'],
 ['catalogo de dispositivos','catalog','<rect x="3" y="4" width="7" height="14" rx="1.8"/><rect x="14" y="2" width="7" height="17" rx="2"/><path d="M5.6 15h1.8M16.6 16h1.8M4 21h16"/>'],
 ['venda de produtos','sales','<path d="M4 8h16l-1.4 13H5.4z"/><path d="M8 9V7a4 4 0 0 1 8 0v2"/><path d="M8.5 14h7"/>'],
 ['venda de aparelhos','device-sale','<rect x="5" y="2" width="12" height="20" rx="2.3"/><path d="M9 5h4M9 19h4"/><path d="m18 10 4 4-4 4"/>'],
 ['pecas e estoque','stock','<path d="m12 2 9 5-9 5-9-5zM3 7v10l9 5 9-5V7M12 12v10"/><path d="M7 9.2V14"/>'],
 ['fornecedores','suppliers','<rect x="2" y="6" width="12" height="12" rx="1"/><path d="M14 10h4l4 4v4h-8z"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/>'],
 ['servicos','services','<path d="M20 7.3a5.5 5.5 0 0 1-7.3 6.5l-7.6 7.6-2.6-2.6 7.6-7.6A5.5 5.5 0 0 1 16.7 4L14 7l3 3z"/>'],
 ['financeiro','finance','<rect x="3" y="5" width="18" height="15" rx="2.5"/><path d="M3 9h18M7 14h5M16 14h3"/><circle cx="16" cy="14" r="1"/>'],
 ['contas a receber','receivable','<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M12 2v12m-4-4 4 4 4-4M7 17h10"/>'],
 ['contas a pagar','payable','<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M12 14V2M8 6l4-4 4 4M7 17h10"/>'],
 ['caixa','cash','<rect x="2" y="8" width="20" height="13" rx="2"/><path d="M5 8V5h14v3M5 14h14M10 18h4"/><circle cx="12" cy="11" r="1"/>'],
 ['garantias','warranty','<path d="M12 2 4 5v6c0 5.5 3.4 9 8 11 4.6-2 8-5.5 8-11V5z"/><path d="m8 12 2.5 2.5 5.5-6"/>'],
 ['relatorios','reports','<rect x="3" y="2" width="18" height="20" rx="2"/><path d="M7 17v-5M12 17V8M17 17v-8M7 19h10"/>'],
 ['inteligencia','insights','<path d="m12 2 2.2 6.4L21 11l-6.8 2.6L12 20l-2.2-6.4L3 11l6.8-2.6z"/><path d="M19 17v5M16.5 19.5h5"/>'],
 ['impressoes','printing','<path d="M6 8V3h12v5M6 17H3V9h18v8h-3"/><rect x="6" y="14" width="12" height="8" rx="1"/><path d="M16 11h2M9 18h6"/>'],
 ['pesquisar','search','<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M7 10h6M10 7v6"/>'],
 ['equipe','team','<circle cx="9" cy="8" r="3"/><circle cx="18" cy="9" r="2.4"/><path d="M3 21v-2.5c0-3.3 3-5.5 6-5.5s6 2.2 6 5.5V21M16 14c3.5 0 5 2.2 5 5v2"/>'],
 ['historico','history','<path d="M3 11a9 9 0 1 1 3 7M3 6v5h5"/><path d="M12 6v6l4 3"/>'],
 ['configuracoes','settings','<path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8 19 19M19 5l-2.2 2.2M7.2 16.8 5 19"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="2"/>'],
 ['vitrine online','storefront','<path d="M3 10h18v11H3zM2 9l2-6h16l2 6M2 9c0 2 3 3 5 0 2 3 5 3 7 0 2 3 5 3 7 0"/><path d="M9 21v-7h6v7"/>'],
 ['aparelhos','devices','<rect x="4" y="2" width="16" height="20" rx="3"/><path d="M10 5h4M10 19h4"/><circle cx="12" cy="12" r="3"/>']
] as const;
const [blue1,blue2,cyan1,cyan2]=['#081B3D','#1853A0','#1F85F4','#88DAFF'];
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const entries=[...art].sort((a,b)=>b[0].length-a[0].length);
const cache=new Map<string,string>();
/** SVG 1600×430, renderizado pelo próprio navegador; identificador de cada aba gera uma arte única. */
export function tabArtwork(title:string):string{
 const key=normalize(title);
 const found=entries.find(([match])=>key.includes(match))||art[art.length-1];
 const id=found[1];
 const saved=cache.get(id);
 if(saved)return saved;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="430" viewBox="0 0 1600 430" role="img">
 <defs>
 <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${blue1}"/><stop offset=".6" stop-color="#0D2C59"/><stop offset="1" stop-color="${blue2}"/></linearGradient>
 <linearGradient id="hi" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${cyan2}"/><stop offset="1" stop-color="${cyan1}"/></linearGradient>
 <radialGradient id="gl"><stop stop-color="#54B9F7" stop-opacity=".28"/><stop offset="1" stop-color="#54B9F7" stop-opacity="0"/></radialGradient>
 <pattern id="grid" width="47" height="47" patternUnits="userSpaceOnUse"><path d="M47 0H0V47" fill="none" stroke="#A5CFFF" stroke-opacity=".045"/></pattern>
 </defs>
 <rect width="1600" height="430" rx="18" fill="url(#bg)"/>
 <rect width="1600" height="430" fill="url(#grid)"/>
 <circle cx="1210" cy="215" r="330" fill="url(#gl)"/>
 <path d="M895 0l160 430M1020 0l140 430M1490 0l110 255" fill="none" stroke="#7DC6FF" stroke-opacity=".12" stroke-width="2"/>
 <circle cx="1230" cy="215" r="176" fill="none" stroke="#A8DEFF" stroke-opacity=".18" stroke-width="2"/>
 <circle cx="1230" cy="215" r="140" fill="none" stroke="#8ACAFF" stroke-opacity=".26" stroke-width="2"/>
 <path d="M885 326h135l43-45h58M1370 110h80l33-33h91M1176 36V10" fill="none" stroke="url(#hi)" stroke-width="3" stroke-opacity=".32" stroke-linecap="round"/>
 <circle cx="1020" cy="326" r="5" fill="#72D6FF" opacity=".68"/>
 <circle cx="1450" cy="110" r="6" fill="#8DE5FF" opacity=".72"/>
 <rect x="1085" y="64" width="286" height="306" rx="48" fill="#071A3A" fill-opacity=".48" stroke="#9FD8FF" stroke-opacity=".2" stroke-width="3" transform="rotate(7 1228 217)"/>
 <rect x="1128" y="88" width="215" height="255" rx="36" fill="#0B2652" stroke="#8BCCFF" stroke-opacity=".48" stroke-width="2"/>
 <path d="M1182 106h108" stroke="#81C6FF" stroke-width="4" stroke-linecap="round" opacity=".3"/>
 <g transform="translate(1136 112) scale(8.3)" fill="none" stroke="url(#hi)" stroke-width="1.35" stroke-linejoin="round" stroke-linecap="round">
 ${found[2]}
 </g>
 <g fill="#82D8FF" opacity=".83"><circle cx="1034" cy="104" r="4"/><circle cx="1429" cy="311" r="5"/><circle cx="1510" cy="164" r="3"/></g>
 </svg>`;
 const result='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 cache.set(id,result);
 return result;
}