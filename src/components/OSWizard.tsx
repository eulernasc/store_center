import React,{useEffect,useId,useRef,useState} from "react";
import {ArrowLeft,ArrowRight,Check,ChevronRight,Search,UserRound,UserRoundPlus,Smartphone,Tablet, Laptop,Monitor,Gamepad2,Watch,Box, X, ClipboardList, Wrench, CalendarDays, ShieldCheck, Info,AlertCircle,Plus,CheckCircle2} from "lucide-react";
import s from "./OSWizard.module.css";
export type WizardClient={id:number;name:string;phone:string;email:string;cpf?:string;address?:string;birthDate?:string;source?:string;documentType?:string};
export type WizardOrder={id:number;client:string;clientId?:number;phone:string;device:string;deviceType:string;brand?:string;color?:string;imei?:string;serial?:string;accessories?:string;physicalState?:string;issue?:string;diagnosis?:string;service:string;price:number;cost:number;status:string;date:string;paid:boolean;plannedPaymentMethod?:string;expectedDate?:string;warrantyDays?:number;notes?:string;technician?:string;history?:{when:string;message:string}[]};
const TYPES=[{name:"Celular",Icon:Smartphone},{name:"Tablet",Icon:Tablet},{name:"Notebook",Icon:Laptop},{name:"Computador",Icon:Monitor},{name:"Console",Icon:Gamepad2},{name:"Watch",Icon:Watch},{name:"Outro",Icon:Box}];
const stamp=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-")};
const reais=(x:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(x);
const simple=(x:string)=>x.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
type F={name:string;cpf:string;documentType:string;phone:string;email:string;address:string;birthDate:string;source:string;deviceType:string;brand:string;device:string;color:string;imei:string;serial:string;accessories:string;physicalState:string;issue:string;diagnosis:string;service:string;price:string;cost:string;expectedDate:string;warrantyDays:string;notes:string;technician:string;paymentMethod:string;};
const initial:F={name:"",cpf:"",documentType:"CPF",phone:"",email:"",address:"",birthDate:"",source:"Não informado",deviceType:"Celular",brand:"",device:"",color:"",imei:"",serial:"",accessories:"",physicalState:"",issue:"",diagnosis:"",service:"",price:"",cost:"",expectedDate:"",warrantyDays:"90",notes:"",technician:"",paymentMethod:"A definir"};
type CatalogModel={brand:string;model:string;type:string};

type CatalogChoice={label:string;detail?:string};
type CatalogFeedback={kind:"brand"|"model";text:string;success:boolean};
function CatalogSearch({
 label,value,placeholder,choices,addLabel,onInput,onPick,onAdd,feedback
}:{
 label:string;value:string;placeholder:string;choices:CatalogChoice[];addLabel:string;
 onInput:(v:string)=>void;onPick:(c:CatalogChoice)=>void;onAdd:()=>void;
 feedback?:CatalogFeedback|null;
}){
 const [open,setOpen]=useState(false),[active,setActive]=useState(0);
 const root=useRef<HTMLDivElement>(null),id=useId();
 const filtered=choices.filter(c=>simple(c.label+" "+(c.detail||"")).includes(simple(value)));
 useEffect(()=>{
  const close=(e:PointerEvent)=>{if(root.current&&!root.current.contains(e.target as Node))setOpen(false)};
  document.addEventListener("pointerdown",close);
  return ()=>document.removeEventListener("pointerdown",close);
 },[]);
 const choose=(item:CatalogChoice)=>{onPick(item);setOpen(false);setActive(0)};
 return <div className={s.field} ref={root}>
  <label htmlFor={id}>{label}</label>
  <div className={s.inlineField}>
   <div className={s.comboWrap}>
    <div className={s.comboControl}>
     <Search size={17} className={s.comboSearchIcon}/>
     <input id={id} value={value} role="combobox" aria-expanded={open} aria-controls={id+"-list"} aria-autocomplete="list" aria-activedescendant={open&&filtered.length?id+"-option-"+Math.min(active,filtered.length-1):undefined} placeholder={placeholder} autoComplete="off"
      onFocus={()=>{setOpen(true);setActive(0)}}
      onChange={e=>{onInput(e.target.value);setOpen(true);setActive(0)}}
      onKeyDown={e=>{if(e.key==="Escape"){e.preventDefault();setOpen(false)}else if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(v=>Math.min(v+1,filtered.length-1))}else if(e.key==="ArrowUp"){e.preventDefault();setActive(v=>Math.max(0,v-1))}else if(e.key==="Enter"&&open&&filtered.length){e.preventDefault();choose(filtered[Math.min(active,filtered.length-1)])}}}/>
     <button type="button" className={s.comboToggle} aria-label={"Mostrar opções de "+label.toLowerCase()} onClick={()=>setOpen(v=>!v)}><ChevronRight size={17} className={open?s.comboExpanded:""}/></button>
    </div>
    {open&&<div className={s.comboMenu} id={id+"-list"} role="listbox" aria-label={"Opções de "+label}>
     <div className={s.comboMenuTitle}>{filtered.length?"Selecione uma opção":"Nenhum resultado"}</div>
     {filtered.map((item,i)=><button type="button" key={item.label+"-"+item.detail} id={id+"-option-"+i} role="option" aria-selected={i===active} className={i===active?s.comboActive:""} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(item)}><span>{item.label}</span>{item.detail&&<small>{item.detail}</small>}{simple(item.label)===simple(value)&&<Check size={15}/>}</button>)}
     {!filtered.length&&<p className={s.comboEmpty}>Não encontrado. Use {addLabel} para cadastrar.</p>}
    </div>}
   </div>
   <button type="button" className={s.catalogAddButton} onClick={()=>{setOpen(false);onAdd()}}><Plus size={15}/>{addLabel}</button>
  </div>
  {feedback&&<div className={feedback.success?s.catalogSuccess:s.catalogInfo} role="status" aria-live="polite">{feedback.success?<CheckCircle2 size={17}/>:<Info size={17}/>}<span>{feedback.text}</span></div>}
 </div>;
}

export default function OSWizard({clients,services,brands,models,paymentMethods,onAddBrand,onAddModel,onClose,onSave}:{clients:WizardClient[];services:{name:string;price:number}[];brands:string[];models:CatalogModel[];paymentMethods:string[];onAddBrand:(brand:string)=>void;onAddModel:(item:CatalogModel)=>void;onClose:()=>void;onSave:(order:WizardOrder,newClient?:WizardClient)=>void}){
 const backdropRef=useRef<HTMLDivElement>(null),bodyRef=useRef<HTMLDivElement>(null);
 const [step,setStep]=useState(0),[mode,setMode]=useState<"search"|"new">("search"),[query,setQuery]=useState(""),[selected,setSelected]=useState<number|null>(null),[f,setF]=useState<F>(initial),[error,setError]=useState(""),[addressOpen,setAddressOpen]=useState(false),[catalogNote,setCatalogNote]=useState<CatalogFeedback|null>(null),[showModelBrand,setShowModelBrand]=useState(false),[chosenModelBrand,setChosenModelBrand]=useState(""),[modelBrandQuery,setModelBrandQuery]=useState(""),[modelBrandError,setModelBrandError]=useState("");
 useEffect(()=>{
  const viewport=window.visualViewport;
  const update=()=>{
   const root=backdropRef.current;if(!root)return;
   if(window.matchMedia("(max-width: 600px)").matches){
    root.style.height=Math.round(viewport?.height||window.innerHeight)+"px";
    root.style.top=Math.round(viewport?.offsetTop||0)+"px";
    root.style.bottom="auto";
   }else{root.style.height="";root.style.top="";root.style.bottom=""}
  };
  update();
  viewport?.addEventListener("resize",update);viewport?.addEventListener("scroll",update);
  window.addEventListener("resize",update);
  return ()=>{viewport?.removeEventListener("resize",update);viewport?.removeEventListener("scroll",update);window.removeEventListener("resize",update)};
 },[]);
 useEffect(()=>{if(error)bodyRef.current?.scrollTo({top:0,behavior:"smooth"})},[error]);
 const change=(field:keyof F,value:string)=>{setF(p=>({...p,[field]:value}));setError("")};
 const matches=clients.filter(c=>simple([c.name,c.phone,c.cpf||"",c.email||""].join(" ")).includes(simple(query))).slice(0,12);
 const pick=(c:WizardClient)=>{setSelected(c.id);setMode("search");setF(p=>({...p,name:c.name,cpf:c.cpf||"",documentType:c.documentType||"CPF",phone:c.phone,email:c.email,address:c.address||"",birthDate:c.birthDate||"",source:c.source||"Não informado"}));setError("")};
 const newClient=()=>{setMode("new");setSelected(null);setF(p=>({...p,name:"",cpf:"",phone:"",email:"",address:"",birthDate:"",source:"Não informado",documentType:"CPF"}));setError("")};
 const check=(current:number)=>{if(current===0){if(mode==="search"&&selected===null){setError("Selecione um cliente existente ou cadastre um novo.");return false}if(!f.name.trim()){setError("Informe o nome completo do cliente.");return false}if(mode==="new"&&clients.some(c=>simple(c.name)===simple(f.name)&&(f.phone&&c.phone===f.phone||f.cpf&&c.cpf===f.cpf))){setError("Este cliente parece já existir. Pesquise e selecione o cadastro para evitar duplicação.");return false}}if(current===1&&!f.device.trim()){setError("Informe o modelo do dispositivo.");return false}if(current===2&&!f.issue.trim()&&!f.service.trim()){setError("Informe o problema relatado ou o serviço solicitado.");return false}const price=Number(f.price||0),cost=Number(f.cost||0);if(current===2&&(!Number.isFinite(price)||price<0||!Number.isFinite(cost)||cost<0)){setError("Informe valores válidos para orçamento e custo.");return false}setError("");return true};
 const proceed=()=>{if(document.activeElement instanceof HTMLElement)document.activeElement.blur();if(step<3){if(check(step))setStep(v=>v+1);return}const id=Date.now();const newRecord=mode==="new"?{id:id+1,name:f.name.trim(),cpf:f.cpf.trim(),documentType:f.documentType,phone:f.phone.trim(),email:f.email.trim(),address:f.address.trim(),birthDate:f.birthDate,source:f.source}:undefined;
 const order:WizardOrder={id,client:f.name.trim(),clientId:selected||newRecord?.id,phone:f.phone.trim(),device:f.device.trim(),deviceType:f.deviceType,brand:f.brand.trim(),color:f.color.trim(),imei:f.imei.trim(),serial:f.serial.trim(),accessories:f.accessories.trim(),physicalState:f.physicalState.trim(),issue:f.issue.trim(),diagnosis:f.diagnosis.trim(),service:f.service.trim()||f.issue.trim(),price:Number(f.price||0),cost:Number(f.cost||0),status:"Em análise",date:stamp(),paid:false,plannedPaymentMethod:f.paymentMethod!=="A definir"?f.paymentMethod:undefined,expectedDate:f.expectedDate,warrantyDays:Number(f.warrantyDays||0),notes:f.notes.trim(),technician:f.technician.trim(),history:[{when:new Date().toLocaleString("pt-BR"),message:"OS aberta e vinculada ao cliente e aparelho"}]};onSave(order,newRecord)};
 const field=(label:string,key:keyof F,props?:{placeholder?:string;type?:string;required?:boolean;help?:string})=><label className={s.field} key={key}><span>{label}{props?.required&&<em>*</em>}</span><input type={props?.type||"text"} value={f[key]} onChange={e=>change(key,e.target.value)} placeholder={props?.placeholder||""} autoComplete="off"/>{props?.help&&<small>{props.help}</small>}</label>;
 const textArea=(label:string,key:keyof F,placeholder?:string)=><label className={s.field}><span>{label}</span><textarea rows={3} value={f[key]} onChange={e=>change(key,e.target.value)} placeholder={placeholder||""}/></label>;
 return <div ref={backdropRef} className={s.backdrop} onMouseDown={e=>{if(e.currentTarget===e.target)onClose()}}><section className={s.sheet} role="dialog" aria-modal="true" aria-label="Nova ordem de serviço"><header className={s.header}><button className={s.iconButton} onClick={step===0?onClose:()=>setStep(step-1)} aria-label={step===0?"Fechar":"Voltar"}>{step===0?<X size={21}/>:<ArrowLeft size={21}/>}</button><div><strong>Nova Ordem de Serviço</strong><span>Store Center • Cadastro integrado</span></div><div className={s.stepBadge}>{step+1} de 4</div></header>
 <div className={s.progress} aria-label={"Etapa "+(step+1)+" de 4"}>{["Cliente","Dispositivo","Atendimento","Revisão"].map((name,i)=><div key={name} className={i<=step?s.progressOn:""}><i/><span>{name}</span></div>)}</div>
 <div ref={bodyRef} className={s.body}>
 {error&&<div className={s.error} role="alert"><AlertCircle size={16}/>{error}</div>}
 {step===0&&<><div className={s.sectionIntro}><div className={s.sectionIcon}><UserRound size={22}/></div><h2>Quem é o cliente?</h2><p>Busque na base ou cadastre um novo sem sair da OS.</p></div><div className={s.modeSwitch}><button className={mode==="search"?s.activeMode:""} onClick={()=>setMode("search")}><Search size={16}/> Cliente existente</button><button className={mode==="new"?s.activeMode:""} onClick={newClient}><UserRoundPlus size={16}/> Novo cliente</button></div>
 {mode==="search"?<><div className={s.search}><Search size={18}/><input value={query} onChange={e=>{setQuery(e.target.value);setSelected(null)}} placeholder="Nome, CPF, telefone ou e-mail"/><button type="button" onClick={newClient} aria-label="Cadastrar cliente"><UserRoundPlus size={17}/></button></div><div className={s.clients}>{matches.map(c=><button className={selected===c.id?s.selectedClient:""} key={c.id} type="button" onClick={()=>pick(c)}><span className={s.avatar}>{c.name.slice(0,2).toUpperCase()}</span><span className={s.clientName}><strong>{c.name}</strong><small>{c.phone||c.email||"Sem contato"}</small></span>{selected===c.id?<Check size={19}/>:<ChevronRight size={17}/>}</button>)}{!matches.length&&<p className={s.emptySearch}>Nenhum cliente encontrado. Cadastre agora.</p>}</div></>:<><div className={s.info}><Info size={17}/> Ao salvar a OS, o novo cliente será criado automaticamente na aba Clientes.</div><div className={s.fields}>{field("Nome completo","name",{required:true,placeholder:"Ex.: João da Silva"})}<div className={s.field}><span>Tipo de documento</span><select value={f.documentType} onChange={e=>change("documentType",e.target.value)}><option>CPF</option><option>CNPJ</option><option>Outro</option></select></div>{field("Documento (opcional)","cpf",{placeholder:"Somente números ou formatado"})}{field("WhatsApp / telefone","phone",{type:"tel",placeholder:"(35) 99999-9999"})}{field("E-mail","email",{type:"email",placeholder:"cliente@exemplo.com"})}<label className={s.field}><span>Como conheceu a loja?</span><select value={f.source} onChange={e=>change("source",e.target.value)}>{["Não informado","Indicação","Instagram","Google","WhatsApp","Já era cliente","Outro"].map(x=><option key={x}>{x}</option>)}</select></label>{field("Data de nascimento (opcional)","birthDate",{type:"date"})}</div><button className={s.accordion} onClick={()=>setAddressOpen(v=>!v)}>Endereço principal (opcional) <ChevronRight size={17} style={{transform:addressOpen?"rotate(90deg)":undefined}}/></button>{addressOpen&&textArea("Endereço","address","Rua, número, bairro, cidade e CEP")}</>}
 </>}
 {step===1&&<><div className={s.sectionIntro}><div className={s.sectionIcon}><Smartphone size={22}/></div><h2>Aparelho principal</h2><p>Esses dados ficarão vinculados à OS e ao cliente.</p></div><h3 className={s.categoryTitle}>Tipo de dispositivo</h3><div className={s.types}>{TYPES.map(({name,Icon})=><button type="button" key={name} className={f.deviceType===name?s.typeActive:""} onClick={()=>change("deviceType",name)}><Icon size={21}/><span>{name}</span></button>)}</div><div className={s.fields}><CatalogSearch label="Marca" value={f.brand} placeholder="Pesquisar ou digitar marca" choices={brands.map(b=>({label:b}))} addLabel="+ Marca"
 feedback={catalogNote?.kind==="brand"?catalogNote:null}
 onInput={value=>{setF(old=>({...old,brand:value,device:old.brand===value?old.device:""}));setCatalogNote(null);setError("")}}
 onPick={choice=>{setF(old=>({...old,brand:choice.label,device:old.brand===choice.label?old.device:""}));setCatalogNote(null)}}
 onAdd={()=>{const brand=f.brand.trim();if(!brand){setError("Digite uma marca antes de cadastrar.");return}const existing=brands.find(b=>simple(b)===simple(brand));if(existing){setCatalogNote({kind:"brand",text:'A marca "'+existing+'" já está cadastrada e pronta para uso.',success:false});return}onAddBrand(brand);setCatalogNote({kind:"brand",text:'Marca "'+brand+'" cadastrada com sucesso! Já está disponível na lista.',success:true});setError("")}}/>
 <CatalogSearch label="Modelo do dispositivo *" value={f.device} placeholder="Pesquisar ou digitar modelo"
 choices={models.filter(m=>m.type===f.deviceType&&(!f.brand||simple(m.brand)===simple(f.brand))).map(m=>({label:m.model,detail:m.brand}))} addLabel="+ Modelo"
 feedback={catalogNote?.kind==="model"?catalogNote:null}
 onInput={value=>{setF(old=>({...old,device:value}));setCatalogNote(null);setError("")}}
 onPick={choice=>{setF(old=>({...old,device:choice.label,brand:choice.detail||old.brand}));setCatalogNote(null);setError("")}}
 onAdd={()=>{const model=f.device.trim();if(!model){setError("Digite o nome do modelo antes de clicar em + Modelo.");return}const match=brands.find(b=>simple(b)===simple(f.brand));setChosenModelBrand(match||"");setModelBrandQuery("");setModelBrandError("");setShowModelBrand(true);setCatalogNote(null);setError("")}}/>
 {field("Cor","color",{placeholder:"Ex.: Preto, azul metálico"})}{field("IMEI","imei",{placeholder:"Opcional"})}{field("Número de série","serial",{placeholder:"Opcional"})}{field("Acessórios recebidos","accessories",{placeholder:"Capa, carregador, chip..."})}</div>{textArea("Estado físico na entrada","physicalState","Riscos, trincas, marcas, peças ausentes...")}<div className={s.safety}><Info size={17}/> Para esta demonstração não solicite nem registre senhas reais de desbloqueio. O cadastro seguro desses dados exige proteção adicional.</div></>}
 {step===2&&<><div className={s.sectionIntro}><div className={s.sectionIcon}><Wrench size={22}/></div><h2>Atendimento e orçamento</h2><p>Registre o defeito e combine valores, prazo e garantia.</p></div>{textArea("Problema relatado pelo cliente","issue","Ex.: Não carrega, tela quebrada, desliga sozinho...")}<div className={s.fields}><label className={s.field}><span>Serviço solicitado</span><input list="oswiz-services" value={f.service} onChange={e=>{const found=services.find(z=>z.name===e.target.value);setF(t=>({...t,service:e.target.value,price:found?String(found.price):t.price}))}} placeholder="Selecione ou digite um serviço"/><datalist id="oswiz-services">{services.map(x=><option key={x.name} value={x.name}/>)}</datalist></label>{field("Valor previsto (R$)","price",{type:"number",placeholder:"0,00"})}{field("Custo estimado (R$)","cost",{type:"number",placeholder:"0,00"})}{field("Previsão de conclusão","expectedDate",{type:"date"})}{field("Garantia (dias)","warrantyDays",{type:"number"})}{field("Técnico responsável","technician",{placeholder:"Nome do técnico"})}
<label className={s.field}><span>Forma de pagamento prevista</span><select value={f.paymentMethod} onChange={e=>change("paymentMethod",e.target.value)}><option value="A definir">A definir na finalização</option>{[...new Set(["Pix","Dinheiro","Cartão de débito","Cartão de crédito",...paymentMethods])].filter(m=>m!=="A definir").map(m=><option key={m} value={m}>{m}</option>)}</select><small>É apenas a forma combinada com o cliente. Nenhum recebimento será lançado agora.</small></label></div>{textArea("Diagnóstico preliminar","diagnosis","Informações da análise técnica, se houver.")}{textArea("Observações internas","notes","Detalhes para a equipe de atendimento")}</>}
 {step===3&&<><div className={s.sectionIntro}><div className={s.sectionIcon}><ClipboardList size={22}/></div><h2>Revisar e abrir OS</h2><p>Confira os dados. Cliente e aparelho serão cadastrados no mesmo processo.</p></div><div className={s.summary}><h3>Cliente <button onClick={()=>setStep(0)}>Editar</button></h3><strong>{f.name}</strong><span>{f.phone||"Sem telefone"}{f.cpf?" · "+f.documentType+" "+f.cpf:""}</span><span>{mode==="new"?"Novo cadastro será criado automaticamente":"Cliente já cadastrado"}</span></div><div className={s.summary}><h3>Aparelho <button onClick={()=>setStep(1)}>Editar</button></h3><strong>{f.deviceType} · {f.brand} {f.device}</strong><span>Cor: {f.color||"Não informada"} · IMEI: {f.imei||"Não informado"}</span><span>{f.issue||f.service}</span></div><div className={s.summary}><h3>Orçamento <button onClick={()=>setStep(2)}>Editar</button></h3><strong>{reais(Number(f.price||0))}</strong><span>Serviço: {f.service||f.issue}</span><span>Previsão: {f.expectedDate||"A definir"} · Garantia: {f.warrantyDays||"0"} dias</span><span>Pagamento combinado: {f.paymentMethod} · A receber na finalização</span></div><div className={s.success}><ShieldCheck size={18}/> Ao confirmar, a nova OS aparecerá imediatamente na Bancada e no histórico do cliente.</div></>}
 </div><footer className={s.footer}><button className={s.back} onClick={step===0?onClose:()=>{setStep(v=>v-1);setError("")}}>{step===0?"Cancelar":"Voltar"}</button><button className={s.next} onClick={proceed}>{step===3?"Salvar e abrir OS":"Continuar"} {step===3?<Check size={17}/>:<ArrowRight size={18}/>}</button></footer>
 {showModelBrand&&<div className={s.modelBrandBackdrop} role="presentation" onMouseDown={e=>{if(e.currentTarget===e.target)setShowModelBrand(false)}} onKeyDown={e=>{if(e.key==="Escape")setShowModelBrand(false)}}>
  <div className={s.modelBrandDialog} role="dialog" aria-modal="true" aria-labelledby="model-brand-title">
   <div className={s.modelBrandHeading}>
    <div><span className={s.modelBrandEyebrow}>CADASTRO DE MODELO</span><h3 id="model-brand-title">Escolha a marca do modelo</h3><p>Para cadastrar <strong>{f.device.trim()}</strong> como {f.deviceType.toLowerCase()}, selecione a marca correspondente.</p></div>
    <button type="button" className={s.iconButton} onClick={()=>setShowModelBrand(false)} aria-label="Fechar seleção de marca"><X size={20}/></button>
   </div>
   <div className={s.modelBrandContent}>
    <label className={s.field} htmlFor="model-brand-filter"><span>Pesquisar marca cadastrada</span></label>
    <div className={s.modelBrandSearch}><Search size={18}/><input id="model-brand-filter" autoFocus value={modelBrandQuery} onChange={e=>setModelBrandQuery(e.target.value)} placeholder="Ex.: Samsung, Apple, Tramontina..." /></div>
    <div className={s.modelBrandList} role="group" aria-label="Marcas disponíveis">
      {brands.filter(b=>simple(b).includes(simple(modelBrandQuery))).map(brand=><button type="button" key={brand} className={simple(chosenModelBrand)===simple(brand)?s.modelBrandSelected:""} onClick={()=>{setChosenModelBrand(brand);setModelBrandError("")}}><span>{brand}</span>{simple(chosenModelBrand)===simple(brand)&&<Check size={18}/>}</button>)}
      {!brands.some(b=>simple(b).includes(simple(modelBrandQuery)))&&<p>Nenhuma marca encontrada. Cadastre-a pelo botão + Marca no formulário.</p>}
    </div>
    {modelBrandError&&<div role="alert" className={s.modelBrandError}><AlertCircle size={16}/>{modelBrandError}</div>}
   </div>
   <div className={s.modelBrandActions}>
     <button type="button" className={s.back} onClick={()=>setShowModelBrand(false)}>Cancelar</button>
     <button type="button" className={s.next} onClick={()=>{
       const brand=brands.find(b=>simple(b)===simple(chosenModelBrand));
       if(!brand){setModelBrandError("Selecione uma marca da lista para continuar.");return}
       const model=f.device.trim();
       if(models.some(m=>simple(m.brand)===simple(brand)&&simple(m.model)===simple(model)&&m.type===f.deviceType)){
         setModelBrandError('O modelo "'+model+'" já está cadastrado para '+brand+'.');return
       }
       onAddModel({brand,model,type:f.deviceType});
       setF(v=>({...v,brand,device:model}));
       setShowModelBrand(false);
       setCatalogNote({kind:"model",text:'Modelo "'+model+'" cadastrado com sucesso para '+brand+'!',success:true});
     }}>Cadastrar modelo <Check size={17}/></button>
   </div>
  </div>
 </div>}
 </section></div>;
}
