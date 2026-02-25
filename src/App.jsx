import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SECTOR_COLORS = {
  Tecnología:"#4f63f5",Finanzas:"#d4a017",Salud:"#12a87b",Consumo:"#e05c9a",
  Energía:"#e04040",Industria:"#7c3aed",Materiales:"#0891b2","Real Estate":"#ea7327",
  Servicios:"#65a30d",Cripto:"#9333ea",ETF:"#64748b",Otro:"#475569",
};
const ASSET_PALETTE = [
  "#f43f5e","#f97316","#eab308","#22c55e","#10b981","#14b8a6",
  "#06b6d4","#3b82f6","#6366f1","#8b5cf6","#a855f7","#ec4899",
  "#ff6b6b","#ffd93d","#6bcb77","#4d96ff","#c77dff","#ff9f43",
  "#00d2d3","#ff6348","#7bed9f","#70a1ff","#e056fd","#2ed573",
];
const SECTORS = ["Tecnología","Finanzas","Salud","Consumo","Energía","Industria","Materiales","Real Estate","Servicios","Cripto","ETF","Otro"];

const ASSET_CLASSIFICATION = {
  NVDA:"growth",TSLA:"growth",META:"growth",SHOP:"growth",SNOW:"growth",
  UBER:"growth",NFLX:"growth",AMD:"growth",CRM:"growth",ADBE:"growth",
  GOOGL:"growth",GOOG:"growth",AMZN:"growth",SQ:"growth",ZM:"growth",
  AAPL:"value",MSFT:"value",V:"value",MA:"value",JPM:"value",
  BAC:"value",GS:"value",MS:"value",WFC:"value",ORCL:"value",
  QCOM:"value",INTC:"value",AXP:"value",LLY:"value",UNH:"value",
  KO:"defensive",PEP:"defensive",JNJ:"defensive",MRK:"defensive",
  ABBV:"defensive",WMT:"defensive",COST:"defensive",TGT:"defensive",
  MCD:"defensive",SBUX:"defensive",NKE:"defensive",PFE:"defensive",
  XOM:"defensive",CVX:"defensive",SPY:"defensive",VOO:"defensive",
  VTI:"defensive",QQQ:"value",IWM:"value",GLD:"defensive",
  BTC:"speculative",ETH:"speculative",BNB:"speculative",SOL:"speculative",
  ADA:"speculative",XRP:"speculative",DOT:"speculative",DOGE:"speculative",
  AVAX:"speculative",MATIC:"speculative",LINK:"speculative",PYPL:"growth",
};

const CLASS_META = {
  growth:    {label:"Crecimiento", icon:"🚀",color:"#6366f1",desc:"Alto potencial, mayor volatilidad"},
  value:     {label:"Largo Plazo", icon:"🏛",color:"#10b981",desc:"Fundamentals sólidos, moat competitivo"},
  defensive: {label:"Defensivo",   icon:"🛡",color:"#3b82f6",desc:"Estabilidad, dividendos, baja beta"},
  speculative:{label:"Especulativo",icon:"⚡",color:"#f97316",desc:"Alta volatilidad, alto riesgo/retorno"},
};

const KNOWN_YIELDS = {
  AAPL:0.5,MSFT:0.7,GOOGL:0,GOOG:0,META:0.4,AMZN:0,NVDA:0.03,TSLA:0,
  JNJ:3.1,PFE:5.8,MRK:2.6,ABBV:3.8,UNH:1.4,LLY:0.6,
  KO:3.0,PEP:2.9,MCD:2.3,SBUX:2.7,NKE:1.4,WMT:1.2,TGT:3.5,COST:0.7,
  XOM:3.4,CVX:4.1,JPM:2.4,BAC:2.7,GS:2.5,MS:3.2,WFC:2.8,V:0.8,MA:0.6,AXP:1.2,
  SPY:1.3,QQQ:0.6,VTI:1.4,VOO:1.3,IWM:1.2,GLD:0,
  NFLX:0,AMD:0,CRM:0,ADBE:0,ORCL:1.3,INTC:1.9,QCOM:1.9,
  BTC:0,ETH:0,BNB:0,SOL:0,ADA:0,XRP:0,DOGE:0,AVAX:0,MATIC:0,LINK:0,
};

const LOGO_MAP = {
  SPY:"https://logo.clearbit.com/ssga.com",QQQ:"https://logo.clearbit.com/invesco.com",
  IWM:"https://logo.clearbit.com/ishares.com",VTI:"https://logo.clearbit.com/vanguard.com",
  VOO:"https://logo.clearbit.com/vanguard.com",GLD:"https://logo.clearbit.com/spdrgoldshares.com",
  AAPL:"https://logo.clearbit.com/apple.com",MSFT:"https://logo.clearbit.com/microsoft.com",
  GOOGL:"https://logo.clearbit.com/google.com",GOOG:"https://logo.clearbit.com/google.com",
  META:"https://logo.clearbit.com/meta.com",AMZN:"https://logo.clearbit.com/amazon.com",
  NVDA:"https://logo.clearbit.com/nvidia.com",TSLA:"https://logo.clearbit.com/tesla.com",
  NFLX:"https://logo.clearbit.com/netflix.com",ADBE:"https://logo.clearbit.com/adobe.com",
  CRM:"https://logo.clearbit.com/salesforce.com",ORCL:"https://logo.clearbit.com/oracle.com",
  INTC:"https://logo.clearbit.com/intel.com",AMD:"https://logo.clearbit.com/amd.com",
  QCOM:"https://logo.clearbit.com/qualcomm.com",SNOW:"https://logo.clearbit.com/snowflake.com",
  UBER:"https://logo.clearbit.com/uber.com",SHOP:"https://logo.clearbit.com/shopify.com",
  SQ:"https://logo.clearbit.com/squareup.com",PYPL:"https://logo.clearbit.com/paypal.com",
  ZM:"https://logo.clearbit.com/zoom.us",JPM:"https://logo.clearbit.com/jpmorganchase.com",
  BAC:"https://logo.clearbit.com/bankofamerica.com",GS:"https://logo.clearbit.com/goldmansachs.com",
  MS:"https://logo.clearbit.com/morganstanley.com",WFC:"https://logo.clearbit.com/wellsfargo.com",
  V:"https://logo.clearbit.com/visa.com",MA:"https://logo.clearbit.com/mastercard.com",
  AXP:"https://logo.clearbit.com/americanexpress.com",JNJ:"https://logo.clearbit.com/jnj.com",
  PFE:"https://logo.clearbit.com/pfizer.com",UNH:"https://logo.clearbit.com/unitedhealthgroup.com",
  MRK:"https://logo.clearbit.com/merck.com",ABBV:"https://logo.clearbit.com/abbvie.com",
  LLY:"https://logo.clearbit.com/lilly.com",KO:"https://logo.clearbit.com/coca-cola.com",
  PEP:"https://logo.clearbit.com/pepsico.com",MCD:"https://logo.clearbit.com/mcdonalds.com",
  SBUX:"https://logo.clearbit.com/starbucks.com",NKE:"https://logo.clearbit.com/nike.com",
  WMT:"https://logo.clearbit.com/walmart.com",TGT:"https://logo.clearbit.com/target.com",
  COST:"https://logo.clearbit.com/costco.com",XOM:"https://logo.clearbit.com/exxonmobil.com",
  CVX:"https://logo.clearbit.com/chevron.com",
  BTC:"https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ETH:"https://cryptologos.cc/logos/ethereum-eth-logo.png",
  BNB:"https://cryptologos.cc/logos/bnb-bnb-logo.png",
  SOL:"https://cryptologos.cc/logos/solana-sol-logo.png",
  ADA:"https://cryptologos.cc/logos/cardano-ada-logo.png",
  XRP:"https://cryptologos.cc/logos/xrp-xrp-logo.png",
  DOT:"https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
  DOGE:"https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  AVAX:"https://cryptologos.cc/logos/avalanche-avax-logo.png",
  MATIC:"https://cryptologos.cc/logos/polygon-matic-logo.png",
  LINK:"https://cryptologos.cc/logos/chainlink-link-logo.png",
};

const TICKER_NAMES = {
  AAPL:"Apple Inc.",MSFT:"Microsoft Corp.",GOOGL:"Alphabet Inc.",GOOG:"Alphabet Inc.",
  META:"Meta Platforms",AMZN:"Amazon.com",NVDA:"NVIDIA Corp.",TSLA:"Tesla Inc.",
  NFLX:"Netflix Inc.",ADBE:"Adobe Inc.",CRM:"Salesforce Inc.",ORCL:"Oracle Corp.",
  INTC:"Intel Corp.",AMD:"Advanced Micro Devices",QCOM:"Qualcomm Inc.",
  JPM:"JPMorgan Chase",BAC:"Bank of America",GS:"Goldman Sachs",MS:"Morgan Stanley",
  WFC:"Wells Fargo",V:"Visa Inc.",MA:"Mastercard Inc.",AXP:"American Express",
  JNJ:"Johnson & Johnson",PFE:"Pfizer Inc.",UNH:"UnitedHealth Group",
  KO:"Coca-Cola Co.",PEP:"PepsiCo Inc.",MCD:"McDonald's Corp.",SBUX:"Starbucks Corp.",
  NKE:"Nike Inc.",WMT:"Walmart Inc.",TGT:"Target Corp.",COST:"Costco Wholesale",
  XOM:"Exxon Mobil",CVX:"Chevron Corp.",SPY:"SPDR S&P 500 ETF",QQQ:"Invesco QQQ ETF",
  VTI:"Vanguard Total Market ETF",VOO:"Vanguard S&P 500 ETF",
  BTC:"Bitcoin",ETH:"Ethereum",BNB:"BNB",SOL:"Solana",ADA:"Cardano",XRP:"XRP",
  SNOW:"Snowflake Inc.",UBER:"Uber Technologies",SHOP:"Shopify Inc.",
  PYPL:"PayPal Holdings",SQ:"Block Inc.",ZM:"Zoom Video",LLY:"Eli Lilly & Co.",
  ABBV:"AbbVie Inc.",MRK:"Merck & Co.",LINK:"Chainlink",DOGE:"Dogecoin",
  AVAX:"Avalanche",MATIC:"Polygon",DOT:"Polkadot",GLD:"SPDR Gold Shares",IWM:"iShares Russell 2000 ETF",
};

const TICKER_SECTORS = {
  AAPL:"Tecnología",MSFT:"Tecnología",GOOGL:"Tecnología",GOOG:"Tecnología",
  META:"Tecnología",AMZN:"Tecnología",NVDA:"Tecnología",TSLA:"Tecnología",
  NFLX:"Tecnología",ADBE:"Tecnología",CRM:"Tecnología",ORCL:"Tecnología",
  INTC:"Tecnología",AMD:"Tecnología",QCOM:"Tecnología",SNOW:"Tecnología",
  UBER:"Tecnología",SHOP:"Tecnología",PYPL:"Finanzas",SQ:"Finanzas",ZM:"Tecnología",
  JPM:"Finanzas",BAC:"Finanzas",GS:"Finanzas",MS:"Finanzas",WFC:"Finanzas",
  V:"Finanzas",MA:"Finanzas",AXP:"Finanzas",
  JNJ:"Salud",PFE:"Salud",UNH:"Salud",MRK:"Salud",ABBV:"Salud",LLY:"Salud",
  KO:"Consumo",PEP:"Consumo",MCD:"Consumo",SBUX:"Consumo",NKE:"Consumo",
  WMT:"Consumo",TGT:"Consumo",COST:"Consumo",
  XOM:"Energía",CVX:"Energía",
  SPY:"ETF",QQQ:"ETF",VTI:"ETF",VOO:"ETF",IWM:"ETF",GLD:"ETF",
  BTC:"Cripto",ETH:"Cripto",BNB:"Cripto",SOL:"Cripto",ADA:"Cripto",
  XRP:"Cripto",DOT:"Cripto",DOGE:"Cripto",AVAX:"Cripto",MATIC:"Cripto",LINK:"Cripto",
};

const THEMES = {
  light:{
    bg:"#f0f4f8",bg2:"#e4eaf2",bg3:"#d8e0ed",card:"#ffffff",border:"#c2cfe0",
    text:"#0f1c2e",muted:"#6b7f99",muted2:"#4a607a",accent:"#1a4fa0",accent2:"#c9a84c",
    positive:"#1a8a4a",negative:"#c0392b",inputBg:"#edf2f7",headerBg:"rgba(240,244,248,0.97)",
    shadow:"rgba(10,30,80,0.08)",gridColor:"rgba(26,79,160,0.05)",
    tableHover:"rgba(26,79,160,0.04)",tableBorder:"rgba(194,207,224,0.7)",thBg:"#e8eef7",
  },
  dark:{
    bg:"#0a0f1e",bg2:"#0d1526",bg3:"#1e293b",card:"#1a2235",border:"#1e3a5f",
    text:"#e2e8f0",muted:"#64748b",muted2:"#94a3b8",accent:"#6366f1",accent2:"#c9a84c",
    positive:"#22c55e",negative:"#ef4444",inputBg:"rgba(15,23,42,0.8)",headerBg:"rgba(10,15,30,0.92)",
    shadow:"rgba(0,0,0,0.3)",gridColor:"rgba(99,102,241,0.04)",
    tableHover:"rgba(99,102,241,0.05)",tableBorder:"rgba(30,41,59,0.8)",thBg:"#0d1526",
  },
};

function hashStr(s){let h=0;for(let i=0;i<s.length;i++)h=(Math.imul(31,h)+s.charCodeAt(i))|0;return h.toString(36);}
const fmt=(n)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n);
const fmtPct=(n)=>(n>=0?"+":"")+n.toFixed(2)+"%";
const fmtNum=(n)=>new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(n);

async function fetchQuoteV2(ticker){
  try{
    const url=`https://query2.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=summaryDetail,price`;
    const proxy=`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const res=await fetch(proxy,{signal:AbortSignal.timeout(8000)});
    const json=await res.json();
    const data=JSON.parse(json.contents);
    const r=data?.quoteSummary?.result?.[0];
    if(!r)return null;
    const sd=r.summaryDetail||{};
    const pr=r.price||{};
    return{
      price:pr.regularMarketPrice?.raw,
      dividendYield:(sd.dividendYield?.raw||0)*100,
      trailingPE:sd.trailingPE?.raw,
      beta:sd.beta?.raw,
      marketCap:pr.marketCap?.raw,
      dayChangePct:(pr.regularMarketChangePercent?.raw||0)*100,
      name:pr.longName||pr.shortName,
    };
  }catch{return null;}
}

function calculateRiskScore(portfolio){
  if(portfolio.length===0)return{score:0,label:"—",color:"#64748b",breakdown:{}};
  const total=portfolio.reduce((s,a)=>s+a.shares*a.price,0);
  if(total===0)return{score:0,label:"—",color:"#64748b",breakdown:{}};
  const weights=portfolio.map(a=>(a.shares*a.price)/total);
  const hhi=weights.reduce((s,w)=>s+w*w,0);
  const concentrationScore=Math.min(25,hhi*25/0.5);
  const cryptoVal=portfolio.filter(a=>a.sector==="Cripto").reduce((s,a)=>s+a.shares*a.price,0);
  const cryptoScore=Math.min(25,(cryptoVal/total)*50);
  const sectors=new Set(portfolio.map(a=>a.sector)).size;
  const sectorScore=Math.max(0,20-sectors*2.5);
  const classW={speculative:1.0,growth:0.6,value:0.3,defensive:0.0};
  const classScore=portfolio.reduce((s,a)=>{
    const cl=ASSET_CLASSIFICATION[a.ticker]||(a.sector==="Cripto"?"speculative":"growth");
    return s+((a.shares*a.price)/total)*classW[cl]*20;
  },0);
  const posScore=Math.max(0,10-portfolio.length*0.8);
  const score=Math.min(10,Math.max(0,(concentrationScore+cryptoScore+sectorScore+classScore+posScore)/10));
  const label=score<2?"Muy Conservador":score<4?"Conservador":score<5.5?"Moderado":score<7?"Moderado-Agresivo":score<8.5?"Agresivo":"Especulativo";
  const color=score<3?"#3b82f6":score<5?"#10b981":score<6.5?"#eab308":score<8?"#f97316":"#ef4444";
  return{score:parseFloat(score.toFixed(1)),label,color,
    breakdown:{concentración:parseFloat(concentrationScore.toFixed(1)),cripto:parseFloat(cryptoScore.toFixed(1)),sectores:parseFloat(sectorScore.toFixed(1)),clasificación:parseFloat(classScore.toFixed(1)),posiciones:parseFloat(posScore.toFixed(1))}};
}

function Toast({message,visible,theme}){
  const t=THEMES[theme];
  return(<div style={{position:"fixed",bottom:30,right:30,zIndex:9999,background:`linear-gradient(135deg,${t.accent},${theme==="dark"?"#8b5cf6":"#1d6db5"})`,color:"#fff",padding:"12px 22px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",boxShadow:`0 8px 30px ${t.accent}55`,transform:visible?"translateY(0)":"translateY(80px)",opacity:visible?1:0,transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",pointerEvents:"none"}}>{message}</div>);
}

function AssetLogo({ticker,color}){
  const[err,setErr]=useState(false);
  const url=LOGO_MAP[ticker?.toUpperCase()];
  const t2=ticker?.toUpperCase().substring(0,2)||"?";
  if(url&&!err)return(<img src={url} alt={ticker} onError={()=>setErr(true)} style={{width:32,height:32,borderRadius:8,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>);
  return(<div style={{width:32,height:32,borderRadius:8,background:color||"#334155",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,boxShadow:`0 0 10px ${color||"#334155"}66`}}>{t2}</div>);
}

function ColorPickerCell({color,onChange,theme}){
  const[open,setOpen]=useState(false);
  const t=THEMES[theme];
  const ref=useRef(null);
  useEffect(()=>{if(!open)return;const h=(e)=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);},[open]);
  return(<div ref={ref} style={{position:"relative"}}><div onClick={()=>setOpen(!open)} style={{width:22,height:22,borderRadius:6,background:color,cursor:"pointer",border:`2px solid ${color}66`,boxShadow:`0 0 8px ${color}55`,transition:"transform 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.25)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>{open&&(<div style={{position:"absolute",top:30,left:0,zIndex:100,background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:10,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,boxShadow:`0 20px 40px ${t.shadow}`}}>{ASSET_PALETTE.map(c=>(<div key={c} onClick={()=>{onChange(c);setOpen(false);}} style={{width:20,height:20,borderRadius:5,background:c,cursor:"pointer",border:color===c?"2.5px solid white":"2px solid transparent",transition:"transform 0.15s"}} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"} onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>))}</div>)}</div>);
}

function EditCell({value,onSave,format="number",theme}){
  const[editing,setEditing]=useState(false);
  const[draft,setDraft]=useState("");
  const ref=useRef(null);
  const t=THEMES[theme];
  const start=()=>{setDraft(String(value));setEditing(true);setTimeout(()=>ref.current?.select(),10);};
  const commit=()=>{const p=parseFloat(draft);if(!isNaN(p)&&p>0)onSave(p);setEditing(false);};
  if(editing)return(<input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{width:90,background:t.inputBg,border:`1.5px solid ${t.accent}`,borderRadius:6,color:t.text,fontFamily:"'DM Mono',monospace",fontSize:13,padding:"4px 8px",outline:"none"}}/>);
  return(<span onClick={start} title="Clic para editar" style={{cursor:"pointer",borderBottom:`1px dashed ${t.accent}66`,paddingBottom:1,transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=`${t.accent}66`}>{format==="currency"?fmt(value):fmtNum(value)}</span>);
}

function DonutChart({canvasId,labels,data,colors,total,theme}){
  const chartRef=useRef(null);
  const t=THEMES[theme];
  useEffect(()=>{
    if(!window.Chart||data.length===0)return;
    if(chartRef.current)chartRef.current.destroy();
    const ctx=document.getElementById(canvasId)?.getContext("2d");
    if(!ctx)return;
    chartRef.current=new window.Chart(ctx,{type:"doughnut",data:{labels,datasets:[{data,backgroundColor:colors,borderColor:t.bg,borderWidth:3,hoverOffset:10,hoverBorderColor:t.card}]},options:{responsive:true,maintainAspectRatio:true,cutout:"72%",animation:{duration:600,easing:"easeInOutQuart"},plugins:{legend:{display:false},tooltip:{callbacks:{label:(ctx)=>` ${ctx.label}: ${fmt(ctx.raw)} (${total>0?(ctx.raw/total*100).toFixed(1):0}%)`},backgroundColor:t.card,borderColor:t.border,borderWidth:1,titleColor:t.text,bodyColor:t.muted,padding:12}}}});
    return()=>{if(chartRef.current)chartRef.current.destroy();};
  },[canvasId,JSON.stringify(labels),JSON.stringify(data),JSON.stringify(colors),total,theme]);
  return <canvas id={canvasId} style={{maxHeight:200}}/>;
}

function RiskGauge({score,label,color,theme}){
  const t=THEMES[theme];
  return(<div style={{textAlign:"center"}}><div style={{display:"flex",gap:4,alignItems:"flex-end",justifyContent:"center",marginBottom:12,padding:"0 8px"}}>{Array.from({length:10},(_,i)=>(<div key={i} style={{flex:1,height:i<3?8:i<6?12:16,background:i<score?color:t.bg3,borderRadius:3,transition:"background 0.5s",opacity:i<score?1:0.3}}/>))}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:32,fontWeight:700,color,lineHeight:1}}>{score}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted,marginTop:2}}>/10</div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color,marginTop:6}}>{label}</div></div>);
}

function LandingScreen({onNew,onLogin,theme,toggleTheme}){
  const t=THEMES[theme];
  const[portfolios,setPortfolios]=useState([]);
  const[loading,setLoading]=useState(true);
  const[show,setShow]=useState(false);
  useEffect(()=>{
    setTimeout(()=>setShow(true),50);
    supabase.from("portfolios").select("id,name,created_at").then(({data})=>{setPortfolios(data||[]);setLoading(false);});
  },[]);
  return(
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"-15%",left:"-10%",width:500,height:500,borderRadius:"50%",background:`radial-gradient(circle,${t.accent}0d 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <button onClick={toggleTheme} style={{position:"absolute",top:24,right:24,background:t.card,border:`1px solid ${t.border}`,borderRadius:10,padding:"8px 14px",cursor:"pointer",color:t.text,fontSize:18,boxShadow:`0 2px 10px ${t.shadow}`}}>{theme==="light"?"🌙":"☀️"}</button>
      <div style={{position:"relative",zIndex:1,textAlign:"center",maxWidth:540,padding:"0 24px",opacity:show?1:0,transform:show?"translateY(0)":"translateY(30px)",transition:"all 0.7s cubic-bezier(0.34,1.2,0.64,1)"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg,${t.accent},${t.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,boxShadow:`0 8px 30px ${t.accent}44`}}>📊</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,color:t.text,lineHeight:1,letterSpacing:"-1px"}}>Portfolio</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:t.muted,letterSpacing:"2px",textTransform:"uppercase",marginTop:2}}>Manager Pro</div>
          </div>
        </div>
        <p style={{color:t.muted2,fontSize:16,marginBottom:40,lineHeight:1.7,fontFamily:"'DM Sans',sans-serif"}}>Gestiona tus inversiones con datos en tiempo real.<br/>Clasificación automática · Score de riesgo · Dividend Yield</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:24}}>
          <button onClick={onNew} style={{background:t.card,border:`2px solid ${t.accent}`,borderRadius:18,padding:"28px 20px",cursor:"pointer",textAlign:"center",boxShadow:`0 4px 20px ${t.accent}22`,transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${t.accent}33`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 20px ${t.accent}22`;}}>
            <div style={{fontSize:36,marginBottom:10}}>✨</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.text,marginBottom:6}}>Nuevo Portafolio</div>
            <div style={{color:t.muted,fontSize:13,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>Crea uno con nombre y contraseña</div>
          </button>
          <button onClick={onLogin} style={{background:`linear-gradient(135deg,${t.accent},${t.accent2})`,border:"2px solid transparent",borderRadius:18,padding:"28px 20px",cursor:"pointer",textAlign:"center",boxShadow:`0 4px 20px ${t.accent}44`,transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${t.accent}55`;}} onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 20px ${t.accent}44`;}}>
            <div style={{fontSize:36,marginBottom:10}}>🔐</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#fff",marginBottom:6}}>Tengo un Portafolio</div>
            <div style={{color:"rgba(255,255,255,0.85)",fontSize:13,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>{loading?"Cargando...":portfolios.length>0?`${portfolios.length} portafolio${portfolios.length!==1?"s":""} guardado${portfolios.length!==1?"s":""}` : "Accede con tu contraseña"}</div>
          </button>
        </div>
        {portfolios.length>0&&(<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{portfolios.map(p=>(<span key={p.id} style={{background:t.bg2,border:`1px solid ${t.border}`,borderRadius:20,padding:"4px 14px",fontSize:12,color:t.muted2,fontFamily:"'DM Mono',monospace",cursor:"pointer"}} onClick={onLogin}>📁 {p.name}</span>))}</div>)}
      </div>
    </div>
  );
}

function AuthScreen({mode,onSuccess,onBack,theme}){
  const t=THEMES[theme];
  const[pfName,setPfName]=useState("");
  const[password,setPassword]=useState("");
  const[showPw,setShowPw]=useState(false);
  const[selectedId,setSelectedId]=useState("");
  const[error,setError]=useState("");
  const[shaking,setShaking]=useState(false);
  const[loading,setLoading]=useState(false);
  const[portfolios,setPortfolios]=useState([]);
  useEffect(()=>{supabase.from("portfolios").select("*").then(({data})=>setPortfolios(data||[]));},[] );
  const shake=()=>{setShaking(true);setTimeout(()=>setShaking(false),500);};
  const handleCreate=async()=>{
    if(!pfName.trim()){setError("Escribe un nombre");return;}
    if(password.length<4){setError("Contraseña: mínimo 4 caracteres");return;}
    const exists=portfolios.find(p=>p.name.toLowerCase()===pfName.trim().toLowerCase());
    if(exists){setError("Ya existe un portafolio con ese nombre");shake();return;}
    setLoading(true);
    const id=Date.now().toString();
    const{error:err}=await supabase.from("portfolios").insert({id,name:pfName.trim(),password_hash:hashStr(password),created_at:new Date().toISOString()});
    setLoading(false);
    if(err){setError("Error al crear. Intenta de nuevo.");return;}
    onSuccess(id,pfName.trim());
  };
  const handleLogin=async()=>{
    const pf=portfolios.find(p=>p.id===selectedId);
    if(!pf){setError("Selecciona un portafolio");return;}
    if(hashStr(password)!==pf.password_hash){setError("Contraseña incorrecta");shake();setPassword("");return;}
    onSuccess(pf.id,pf.name);
  };
  const inputS={background:t.inputBg,border:`1.5px solid ${t.border}`,borderRadius:10,padding:"13px 16px",color:t.text,fontFamily:"'DM Sans',sans-serif",fontSize:15,outline:"none",width:"100%",boxSizing:"border-box",transition:"border-color 0.2s"};
  return(
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>
      <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:24,padding:"40px 44px",width:"100%",maxWidth:440,position:"relative",zIndex:1,boxShadow:`0 20px 60px ${t.shadow}`,animation:shaking?"shake 0.4s":"none"}}>
        <button onClick={onBack} style={{background:"none",border:`1px solid ${t.border}`,color:t.muted,borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,marginBottom:24,fontFamily:"'DM Sans',sans-serif"}}>← Volver</button>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:44,marginBottom:10}}>{mode==="create"?"✨":"🔐"}</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:t.text,margin:0}}>{mode==="create"?"Crear Portafolio":"Acceder"}</h2>
          <p style={{color:t.muted,fontSize:14,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>{mode==="create"?"Elige nombre y contraseña":"Selecciona tu portafolio e ingresa tu contraseña"}</p>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {mode==="create"?(
            <div>
              <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>Nombre del Portafolio</label>
              <input value={pfName} onChange={e=>setPfName(e.target.value)} placeholder="Mi Portafolio 2025" style={inputS} onFocus={e=>e.currentTarget.style.borderColor=t.accent} onBlur={e=>e.currentTarget.style.borderColor=t.border} onKeyDown={e=>{if(e.key==="Enter")handleCreate();}}/>
            </div>
          ):(
            <div>
              <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>Tu Portafolio</label>
              {portfolios.length===0?(<div style={{color:t.muted,fontSize:14,fontStyle:"italic",textAlign:"center",padding:"16px 0"}}>No hay portafolios. ¡Crea uno!</div>):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {portfolios.map(p=>(<div key={p.id} onClick={()=>{setSelectedId(p.id);setError("");}} style={{background:selectedId===p.id?`${t.accent}15`:t.inputBg,border:`2px solid ${selectedId===p.id?t.accent:t.border}`,borderRadius:10,padding:"12px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:10,transition:"all 0.2s"}}>
                    <span style={{fontSize:20}}>📁</span>
                    <div><div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:t.text,fontSize:14}}>{p.name}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted}}>Creado: {new Date(p.created_at).toLocaleDateString("es-CO")}</div></div>
                    {selectedId===p.id&&<span style={{marginLeft:"auto",color:t.accent,fontSize:18}}>✓</span>}
                  </div>))}
                </div>
              )}
            </div>
          )}
          <div>
            <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>Contraseña</label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>{setPassword(e.target.value);setError("");}} type={showPw?"text":"password"} placeholder={mode==="create"?"Mínimo 4 caracteres":"Tu contraseña"} style={{...inputS,paddingRight:48}} onFocus={e=>e.currentTarget.style.borderColor=t.accent} onBlur={e=>e.currentTarget.style.borderColor=t.border} onKeyDown={e=>{if(e.key==="Enter")mode==="create"?handleCreate():handleLogin();}}/>
              <button onClick={()=>setShowPw(!showPw)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:18}}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>
          {error&&(<div style={{background:`${t.negative}15`,border:`1px solid ${t.negative}44`,borderRadius:8,padding:"10px 14px",color:t.negative,fontSize:13,fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8}}>⚠️ {error}</div>)}
          <button onClick={mode==="create"?handleCreate:handleLogin} disabled={loading} style={{background:loading?t.bg3:`linear-gradient(135deg,${t.accent},${theme==="dark"?"#8b5cf6":"#1d6db5"})`,color:"#fff",border:"none",borderRadius:12,padding:"14px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:16,cursor:loading?"wait":"pointer",marginTop:4,boxShadow:`0 4px 20px ${t.accent}44`,transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>{loading?"⏳ Cargando...":mode==="create"?"🚀 Crear y Entrar":"🔓 Acceder"}</button>
        </div>
      </div>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

function AnalysisPanel({portfolio,theme}){
  const t=THEMES[theme];
  const totalCurrent=portfolio.reduce((s,a)=>s+a.shares*a.price,0);
  const risk=calculateRiskScore(portfolio);
  const dividendIncome=portfolio.reduce((s,a)=>{const y=a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0;return s+(a.shares*a.price*y/100);},0);
  const portfolioYield=totalCurrent>0?(dividendIncome/totalCurrent)*100:0;
  const classBreakdown={growth:0,value:0,defensive:0,speculative:0};
  portfolio.forEach(a=>{const cl=ASSET_CLASSIFICATION[a.ticker]||(a.sector==="Cripto"?"speculative":"growth");classBreakdown[cl]+=(a.shares*a.price);});
  const topDividend=[...portfolio].map(a=>({...a,yld:a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0,income:a.shares*a.price*(a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0)/100})).filter(a=>a.yld>0).sort((a,b)=>b.income-a.income).slice(0,5);
  const card=(children,extra={})=>(<div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`,...extra}}>{children}</div>);
  const secH=(title,icon)=>(<div style={{padding:"16px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{icon}</span><span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>{title}</span></div>);
  return(
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      {card(<>
        {secH("Score de Riesgo","⚖️")}
        <div style={{padding:"24px"}}>
          {portfolio.length===0?(<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Agrega activos para ver el análisis</div>):<>
            <RiskGauge score={risk.score} label={risk.label} color={risk.color} theme={theme}/>
            <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:8}}>
              {Object.entries(risk.breakdown).map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:12,color:t.muted2,fontFamily:"'DM Sans',sans-serif",textTransform:"capitalize"}}>{k}</span><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:80,height:4,background:t.bg3,borderRadius:2,overflow:"hidden"}}><div style={{width:`${(v/25)*100}%`,height:"100%",background:risk.color,borderRadius:2}}/></div><span style={{fontSize:11,color:t.muted,fontFamily:"'DM Mono',monospace",width:28,textAlign:"right"}}>{v}</span></div></div>))}
            </div>
            <div style={{marginTop:16,padding:"10px 14px",background:`${risk.color}15`,border:`1px solid ${risk.color}44`,borderRadius:8}}>
              <div style={{fontSize:12,color:risk.color,fontFamily:"'DM Sans',sans-serif",fontWeight:600}}>{risk.score<3?"💚 Portafolio muy conservador — ideal para preservación de capital":risk.score<5?"🟢 Portafolio equilibrado — buena diversificación":risk.score<6.5?"🟡 Riesgo moderado-alto — revisa la concentración":risk.score<8?"🟠 Portafolio agresivo — alta exposición a volatilidad":"🔴 Riesgo muy alto — considera diversificar"}</div>
            </div>
          </>}
        </div>
      </>)}
      {card(<>
        {secH("Análisis de Dividendos","💰")}
        <div style={{padding:"24px"}}>
          {portfolio.length===0?(<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Sin datos aún</div>):<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
              {[{label:"Yield del Portafolio",val:portfolioYield.toFixed(2)+"%",color:t.positive},{label:"Ingreso Anual Est.",val:fmt(dividendIncome),color:t.accent},{label:"Ingreso Mensual Est.",val:fmt(dividendIncome/12),color:t.accent2},{label:"Activos con Dividendo",val:`${topDividend.length}/${portfolio.length}`,color:t.muted2}].map((item,i)=>(<div key={i} style={{background:t.bg2,borderRadius:10,padding:"12px 14px"}}><div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",marginBottom:4}}>{item.label}</div><div style={{fontFamily:"'DM Mono',monospace",fontSize:16,fontWeight:600,color:item.color}}>{item.val}</div></div>))}
            </div>
            {topDividend.length>0&&<><div style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",marginBottom:10}}>Top Pagadores</div>{topDividend.map(a=>(<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><AssetLogo ticker={a.ticker} color={a.color}/><div><div style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:t.text}}>{a.ticker}</div><div style={{fontSize:11,color:t.muted}}>Yield: {a.yld.toFixed(2)}%</div></div></div><div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:t.positive,fontWeight:600}}>{fmt(a.income)}/año</div></div>))}</>}
          </>}
        </div>
      </>)}
      {card(<>
        {secH("Clasificación del Portafolio","🏷️")}
        <div style={{padding:"24px"}}>
          {portfolio.length===0?(<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Sin datos aún</div>):Object.entries(CLASS_META).map(([key,meta])=>{
            const val=classBreakdown[key]||0;
            const pct=totalCurrent>0?(val/totalCurrent)*100:0;
            const assets=portfolio.filter(a=>(ASSET_CLASSIFICATION[a.ticker]||(a.sector==="Cripto"?"speculative":"growth"))===key);
            return(<div key={key} style={{marginBottom:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{meta.icon}</span><div><div style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:t.text}}>{meta.label}</div><div style={{fontSize:11,color:t.muted}}>{meta.desc}</div></div></div><div style={{textAlign:"right"}}><div style={{fontFamily:"'DM Mono',monospace",fontSize:15,fontWeight:700,color:meta.color}}>{pct.toFixed(1)}%</div><div style={{fontSize:11,color:t.muted,fontFamily:"'DM Mono',monospace"}}>{fmt(val)}</div></div></div><div style={{height:6,background:t.bg3,borderRadius:3,overflow:"hidden"}}><div style={{width:`${pct}%`,height:"100%",background:meta.color,borderRadius:3,transition:"width 0.6s ease"}}/></div>{assets.length>0&&(<div style={{display:"flex",flexWrap:"wrap",gap:4,marginTop:6}}>{assets.map(a=>(<span key={a.id} style={{fontSize:10,fontFamily:"'DM Mono',monospace",padding:"2px 7px",borderRadius:4,background:`${meta.color}20`,color:meta.color,border:`1px solid ${meta.color}40`}}>{a.ticker}</span>))}</div>)}</div>);
          })}
        </div>
      </>)}
      {card(<>
        {secH("Estadísticas de Mercado","📈")}
        <div style={{padding:"24px"}}>
          {portfolio.length===0?(<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Sin datos aún</div>):<>
            {portfolio.filter(a=>a.beta||a.pe_ratio||a.day_change_pct).slice(0,7).map(a=>(<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${t.border}`}}><div style={{display:"flex",alignItems:"center",gap:8}}><AssetLogo ticker={a.ticker} color={a.color}/><span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:t.text}}>{a.ticker}</span></div><div style={{display:"flex",gap:12,fontFamily:"'DM Mono',monospace",fontSize:11}}>{a.beta&&<div><span style={{color:t.muted}}>β </span><span style={{color:t.text}}>{parseFloat(a.beta).toFixed(2)}</span></div>}{a.pe_ratio&&<div><span style={{color:t.muted}}>P/E </span><span style={{color:t.text}}>{parseFloat(a.pe_ratio).toFixed(1)}</span></div>}{a.day_change_pct!==null&&a.day_change_pct!==undefined&&<div style={{color:a.day_change_pct>=0?t.positive:t.negative,fontWeight:600}}>{fmtPct(parseFloat(a.day_change_pct))}</div>}</div></div>))}
            {portfolio.every(a=>!a.beta&&!a.pe_ratio)&&(<div style={{textAlign:"center",color:t.muted,fontSize:13,padding:"20px 0",fontStyle:"italic"}}>Actualiza precios para ver estadísticas</div>)}
          </>}
        </div>
      </>)}
    </div>
  );
}

function Dashboard({portfolioId,portfolioName,onLogout,theme,toggleTheme}){
  const t=THEMES[theme];
  const[portfolio,setPortfolio]=useState([]);
  const[chartReady,setChartReady]=useState(!!window.Chart);
  const[toast,setToast]=useState({msg:"",visible:false});
  const[search,setSearch]=useState("");
  const[sortKey,setSortKey]=useState("ticker");
  const[sortDir,setSortDir]=useState(1);
  const[form,setForm]=useState({ticker:"",name:"",sector:"Tecnología",shares:"",avgCost:"",price:""});
  const[confirmLogout,setConfirmLogout]=useState(false);
  const[activeTab,setActiveTab]=useState("portfolio");
  const[updatingPrices,setUpdatingPrices]=useState(false);
  const[fetchingTicker,setFetchingTicker]=useState(false);
  const[loadingData,setLoadingData]=useState(true);

  useEffect(()=>{
    supabase.from("assets").select("*").eq("portfolio_id",portfolioId).then(({data})=>{setPortfolio(data||[]);setLoadingData(false);});
  },[portfolioId]);

  useEffect(()=>{
    if(window.Chart){setChartReady(true);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    s.onload=()=>setChartReady(true);
    document.head.appendChild(s);
  },[]);

  const showToast=useCallback((msg)=>{setToast({msg,visible:true});setTimeout(()=>setToast(p=>({...p,visible:false})),2500);},[]);

  const saveAsset=async(asset)=>{
    const row={id:asset.id,portfolio_id:portfolioId,ticker:asset.ticker,name:asset.name,sector:asset.sector,shares:asset.shares,avg_cost:asset.avgCost||asset.avg_cost,price:asset.price,color:asset.color,updated_at:new Date().toISOString(),dividend_yield:asset.dividendYield||asset.dividend_yield||0,beta:asset.beta||null,pe_ratio:asset.peRatio||asset.pe_ratio||null,day_change_pct:asset.dayChangePct||asset.day_change_pct||null,market_cap:asset.marketCap||asset.market_cap||null};
    await supabase.from("assets").upsert(row);
  };

  const addAsset=async()=>{
    const ticker=form.ticker.trim().toUpperCase();
    const name=form.name.trim();
    const shares=parseFloat(form.shares);
    const avgCost=parseFloat(form.avgCost);
    if(!ticker||!name||isNaN(shares)||isNaN(avgCost)){showToast("⚠️ Completa todos los campos");return;}
    if(portfolio.find(a=>a.ticker===ticker)){showToast("⚠️ Ese ticker ya existe");return;}
    showToast(`🔍 Buscando precio de ${ticker}...`);
    setFetchingTicker(true);
    const marketData=await fetchQuoteV2(ticker);
    setFetchingTicker(false);
    const price=marketData?.price||parseFloat(form.price)||0;
    if(!price){showToast("⚠️ Ingresa el precio actual manualmente");return;}
    const colorIdx=portfolio.length%ASSET_PALETTE.length;
    const newAsset={id:Date.now(),portfolio_id:portfolioId,ticker,name,sector:form.sector,shares,avg_cost:avgCost,avgCost,price,color:ASSET_PALETTE[colorIdx],dividend_yield:marketData?.dividendYield||KNOWN_YIELDS[ticker]||0,dividendYield:marketData?.dividendYield||KNOWN_YIELDS[ticker]||0,beta:marketData?.beta||null,pe_ratio:marketData?.trailingPE||null,peRatio:marketData?.trailingPE||null,day_change_pct:marketData?.dayChangePct||null,dayChangePct:marketData?.dayChangePct||null,market_cap:marketData?.marketCap||null};
    const next=[...portfolio,newAsset];
    setPortfolio(next);
    await saveAsset(newAsset);
    setForm({ticker:"",name:"",sector:"Tecnología",shares:"",avgCost:"",price:""});
    showToast(`✅ ${ticker} agregado — Precio: ${fmt(price)}`);
  };

  const deleteAsset=async(id)=>{const next=portfolio.filter(a=>a.id!==id);setPortfolio(next);await supabase.from("assets").delete().eq("id",id);showToast("🗑 Activo eliminado");};

  const updateAsset=async(id,field,value)=>{
    const next=portfolio.map(a=>a.id===id?{...a,[field]:value,avg_cost:field==="avgCost"?value:(a.avg_cost||a.avgCost),avgCost:field==="avgCost"?value:(a.avgCost||a.avg_cost)}:a);
    setPortfolio(next);
    const asset=next.find(a=>a.id===id);
    if(asset)await saveAsset(asset);
  };

  const tickerBlur=async()=>{
    const tk=form.ticker.trim().toUpperCase();
    if(!tk)return;
    setForm(f=>({...f,name:f.name||TICKER_NAMES[tk]||f.name,sector:TICKER_SECTORS[tk]||f.sector}));
    if(!form.price){
      const data=await fetchQuoteV2(tk);
      if(data?.price){setForm(f=>({...f,price:String(data.price.toFixed(2)),name:f.name||data.name||TICKER_NAMES[tk]||f.name}));showToast(`💹 ${tk}: ${fmt(data.price)}`);}
    }
  };

  const updateAllPrices=async()=>{
    if(portfolio.length===0)return;
    setUpdatingPrices(true);
    showToast(`🔄 Actualizando ${portfolio.length} precios...`);
    let updated=0;
    const next=[...portfolio];
    for(let i=0;i<next.length;i++){
      const data=await fetchQuoteV2(next[i].ticker);
      if(data?.price){
        next[i]={...next[i],price:data.price,dividend_yield:data.dividendYield||next[i].dividend_yield||KNOWN_YIELDS[next[i].ticker]||0,dividendYield:data.dividendYield||next[i].dividendYield||KNOWN_YIELDS[next[i].ticker]||0,beta:data.beta||next[i].beta,pe_ratio:data.trailingPE||next[i].pe_ratio,day_change_pct:data.dayChangePct||next[i].day_change_pct,market_cap:data.marketCap||next[i].market_cap};
        await saveAsset(next[i]);updated++;
      }
      await new Promise(r=>setTimeout(r,350));
    }
    setPortfolio(next);setUpdatingPrices(false);
    showToast(`✅ ${updated}/${portfolio.length} precios actualizados`);
  };

  const exportCSV=()=>{
    const hdr=["Ticker","Nombre","Sector","Tipo","Acciones","Costo Prom","Precio Act","Invertido","Valor Act","G/P","G/P %","Dividend Yield","Ingreso Anual"];
    const rows=portfolio.map(a=>{
      const ac=a.avg_cost||a.avgCost||0;const inv=a.shares*ac,cur=a.shares*a.price,pnl=cur-inv;
      const cl=ASSET_CLASSIFICATION[a.ticker]||"growth";const yld=a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0;
      return[a.ticker,a.name,a.sector,CLASS_META[cl]?.label||"—",a.shares,ac,a.price,inv.toFixed(2),cur.toFixed(2),pnl.toFixed(2),((inv>0?pnl/inv*100:0).toFixed(2))+"%",yld.toFixed(2)+"%",(cur*yld/100).toFixed(2)];
    });
    const csv=[hdr,...rows].map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    Object.assign(document.createElement("a"),{href:url,download:`${portfolioName}.csv`}).click();
    showToast("📥 CSV exportado");
  };

  const toggleSort=(k)=>{if(sortKey===k)setSortDir(d=>d*-1);else{setSortKey(k);setSortDir(1);}};

  const filtered=portfolio.filter(a=>a.ticker?.includes(search.toUpperCase())||a.name?.toLowerCase().includes(search.toLowerCase())||a.sector?.toLowerCase().includes(search.toLowerCase()));
  const sorted=[...filtered].sort((a,b)=>{
    let av=a[sortKey],bv=b[sortKey];
    const acA=a.avg_cost||a.avgCost||0,acB=b.avg_cost||b.avgCost||0;
    if(sortKey==="current"){av=a.shares*a.price;bv=b.shares*b.price;}
    if(sortKey==="pnl"){av=(a.shares*a.price)-(a.shares*acA);bv=(b.shares*b.price)-(b.shares*acB);}
    if(sortKey==="pnlPct"){av=acA>0?(a.price-acA)/acA:0;bv=acB>0?(b.price-acB)/acB:0;}
    if(typeof av==="string")return av.localeCompare(bv)*sortDir;
    return((av||0)-(bv||0))*sortDir;
  });

  const totalInvested=portfolio.reduce((s,a)=>s+a.shares*(a.avg_cost||a.avgCost||0),0);
  const totalCurrent=portfolio.reduce((s,a)=>s+a.shares*a.price,0);
  const totalPnL=totalCurrent-totalInvested;
  const totalPnLPct=totalInvested>0?(totalPnL/totalInvested)*100:0;
  const totalDivIncome=portfolio.reduce((s,a)=>s+(a.shares*a.price*(a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0)/100),0);
  const portfolioYield=totalCurrent>0?(totalDivIncome/totalCurrent)*100:0;
  const risk=calculateRiskScore(portfolio);

  const assetLabels=portfolio.map(a=>a.ticker);
  const assetData=portfolio.map(a=>a.shares*a.price);
  const assetColors=portfolio.map(a=>a.color||ASSET_PALETTE[0]);
  const sectorMap={};portfolio.forEach(a=>{const v=a.shares*a.price;sectorMap[a.sector]=(sectorMap[a.sector]||0)+v;});
  const sectorLabels=Object.keys(sectorMap),sectorData=Object.values(sectorMap);
  const sectorColors=sectorLabels.map(s=>SECTOR_COLORS[s]||"#64748b");

  const inputS={background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:8,padding:"10px 12px",color:t.text,fontFamily:"'DM Mono',monospace",fontSize:13,outline:"none",width:"100%",transition:"border-color 0.2s",boxSizing:"border-box"};
  const SortA=({k})=>sortKey!==k?<span style={{color:t.border,marginLeft:3}}>↕</span>:<span style={{color:t.accent,marginLeft:3}}>{sortDir===1?"↑":"↓"}</span>;
  const thS={padding:"11px 14px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:t.muted,fontFamily:"'DM Mono',monospace",fontWeight:400,borderBottom:`1px solid ${t.border}`,background:t.thBg,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"};
  const SC=({label,value,sub,color,sub2})=>(<div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,padding:"18px 20px",position:"relative",overflow:"hidden",transition:"all 0.2s",boxShadow:`0 2px 12px ${t.shadow}`}} onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color||t.accent}66`;e.currentTarget.style.transform="translateY(-2px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="translateY(0)";}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color||t.accent},transparent)`}}/>
    <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:t.muted,fontFamily:"'DM Mono',monospace",marginBottom:8}}>{label}</div>
    <div style={{fontFamily:"'DM Mono',monospace",fontSize:20,fontWeight:500,color:t.text,lineHeight:1}}>{value}</div>
    {sub&&<div style={{fontSize:12,marginTop:5,fontFamily:"'DM Mono',monospace",color:sub.startsWith("+")?t.positive:sub.startsWith("-")?t.negative:t.muted}}>{sub}</div>}
    {sub2&&<div style={{fontSize:11,marginTop:2,fontFamily:"'DM Mono',monospace",color:t.muted}}>{sub2}</div>}
  </div>);

  return(
    <div style={{background:t.bg,minHeight:"100vh",position:"relative"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"-20%",left:"-10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${t.accent}08 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>
      <header style={{borderBottom:`1px solid ${t.border}`,padding:"13px 0",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100,background:t.headerBg}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${t.accent},${t.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 20px ${t.accent}44`}}>📊</div>
            <div><span style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:t.text}}>Portfolio<span style={{color:t.accent}}>.</span>Pro</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted,marginLeft:10}}>📁 {portfolioName}</span></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            {portfolio.length>0&&(<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 12px",background:`${risk.color}18`,border:`1px solid ${risk.color}44`,borderRadius:20}}><div style={{width:8,height:8,borderRadius:"50%",background:risk.color,boxShadow:`0 0 6px ${risk.color}`}}/><span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:risk.color,fontWeight:600}}>{risk.score}/10 · {risk.label}</span></div>)}
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted}}>{new Date().toLocaleDateString("es-CO",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}</span>
            <button onClick={updateAllPrices} disabled={updatingPrices||portfolio.length===0} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.muted2,borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",opacity:updatingPrices?0.6:1}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>{updatingPrices?"⏳ Actualizando...":"↻ Actualizar precios"}</button>
            {portfolio.length>0&&<button onClick={exportCSV} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.muted2,borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent} onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>↓ CSV</button>}
            <button onClick={toggleTheme} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.text,borderRadius:8,padding:"7px 11px",fontSize:16,cursor:"pointer"}}>{theme==="light"?"🌙":"☀️"}</button>
            <button onClick={()=>setConfirmLogout(true)} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.muted2,borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=t.negative} onMouseLeave={e=>e.currentTarget.style.color=t.muted2}>Salir 🚪</button>
          </div>
        </div>
      </header>

      {confirmLogout&&(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}><div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"36px 40px",textAlign:"center",maxWidth:360,boxShadow:`0 20px 60px ${t.shadow}`}}><div style={{fontSize:44,marginBottom:12}}>👋</div><h3 style={{fontFamily:"'Playfair Display',serif",color:t.text,fontSize:22,margin:"0 0 8px"}}>¿Cerrar sesión?</h3><p style={{color:t.muted,fontSize:14,fontFamily:"'DM Sans',sans-serif",marginBottom:24}}>Tu portafolio queda guardado en la nube. Accede desde cualquier dispositivo.</p><div style={{display:"flex",gap:12}}><button onClick={()=>setConfirmLogout(false)} style={{flex:1,background:t.bg2,border:`1px solid ${t.border}`,color:t.text,borderRadius:10,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer",fontSize:14}}>Cancelar</button><button onClick={onLogout} style={{flex:1,background:`linear-gradient(135deg,${t.negative},#ff6b6b)`,border:"none",color:"#fff",borderRadius:10,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer",fontSize:14}}>Salir</button></div></div></div>)}

      <div style={{maxWidth:1500,margin:"0 auto",padding:"0 28px 60px",position:"relative",zIndex:1}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:14,padding:"22px 0 18px"}}>
          <SC label="Capital Invertido" value={fmt(totalInvested)} sub={`${portfolio.length} posicion${portfolio.length!==1?"es":""}`} color={t.accent}/>
          <SC label="Valor de Mercado" value={fmt(totalCurrent)} sub={totalInvested>0?fmtPct(totalPnLPct):undefined} color="#10b981"/>
          <SC label="Ganancia / Pérdida" value={fmt(totalPnL)} sub={totalInvested>0?fmtPct(totalPnLPct):undefined} color={totalPnL>=0?t.positive:t.negative}/>
          <SC label="Dividend Yield" value={portfolioYield.toFixed(2)+"%"} sub={`${fmt(totalDivIncome)}/año`} sub2={`${fmt(totalDivIncome/12)}/mes`} color={t.accent2}/>
          <SC label="Score de Riesgo" value={`${risk.score}/10`} sub={risk.label} color={risk.color}/>
        </div>

        <div style={{display:"flex",gap:4,marginBottom:20,background:t.bg2,padding:4,borderRadius:12,width:"fit-content",border:`1px solid ${t.border}`}}>
          {[["portfolio","📋 Portafolio"],["analysis","🔬 Análisis"]].map(([id,label])=>(<button key={id} onClick={()=>setActiveTab(id)} style={{background:activeTab===id?t.card:"transparent",border:`1px solid ${activeTab===id?t.border:"transparent"}`,color:activeTab===id?t.text:t.muted,borderRadius:9,padding:"8px 18px",fontFamily:"'DM Sans',sans-serif",fontWeight:activeTab===id?700:400,fontSize:13,cursor:"pointer",transition:"all 0.2s",boxShadow:activeTab===id?`0 2px 8px ${t.shadow}`:"none"}}>{label}</button>))}
        </div>

        {activeTab==="analysis"?(<AnalysisPanel portfolio={portfolio} theme={theme}/>):(
          <div style={{display:"grid",gridTemplateColumns:"1fr 370px",gap:24}}>
            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
                <div style={{padding:"15px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Agregar Activo</span>
                  {fetchingTicker&&<span style={{fontSize:11,color:t.accent,fontFamily:"'DM Mono',monospace"}}>🔍 Buscando precio...</span>}
                </div>
                <div style={{padding:"15px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,alignItems:"end"}}>
                  {[{key:"ticker",label:"Ticker",placeholder:"AAPL",style:{textTransform:"uppercase"}},{key:"name",label:"Nombre",placeholder:"Apple Inc."}].map(f=>(<div key={f.key} style={{display:"flex",flexDirection:"column",gap:5}}><label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>{f.label}</label><input value={form[f.key]} placeholder={f.placeholder} style={{...inputS,...(f.style||{})}} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} onBlur={f.key==="ticker"?tickerBlur:undefined} onKeyDown={e=>{if(e.key==="Enter")addAsset();}} onFocus={e=>e.currentTarget.style.borderColor=t.accent}/></div>))}
                  <div style={{display:"flex",flexDirection:"column",gap:5}}><label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>Sector</label><select value={form.sector} onChange={e=>setForm(p=>({...p,sector:e.target.value}))} style={inputS}>{SECTORS.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
                  {[{key:"shares",label:"Acciones",placeholder:"10"},{key:"avgCost",label:"Costo Prom ($)",placeholder:"150.00"},{key:"price",label:"Precio Act. ($)",placeholder:"Auto"}].map(f=>(<div key={f.key} style={{display:"flex",flexDirection:"column",gap:5}}><label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>{f.label}</label><input value={form[f.key]} placeholder={f.placeholder} type="number" min="0" style={inputS} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} onKeyDown={e=>{if(e.key==="Enter")addAsset();}} onFocus={e=>e.currentTarget.style.borderColor=t.accent} onBlur={e=>e.currentTarget.style.borderColor=t.border}/></div>))}
                  <button onClick={addAsset} style={{background:`linear-gradient(135deg,${t.accent},${theme==="dark"?"#8b5cf6":"#1d6db5"})`,color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",height:40,alignSelf:"end",boxShadow:`0 4px 16px ${t.accent}44`,transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"} onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>+ Agregar</button>
                </div>
                <div style={{padding:"0 24px 10px",fontSize:11,color:t.muted,fontFamily:"'DM Mono',monospace"}}>💡 El precio se obtiene automáticamente al escribir el ticker. Puedes editarlo manualmente.</div>
              </div>

              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
                <div style={{padding:"15px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Mis Activos</span>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{fontSize:11,color:t.muted,fontFamily:"'DM Mono',monospace"}}>✏️ Clic en valores para editar</span>
                    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar..." style={{...inputS,width:150,padding:"6px 12px",fontSize:12}} onFocus={e=>e.currentTarget.style.borderColor=t.accent} onBlur={e=>e.currentTarget.style.borderColor=t.border}/>
                  </div>
                </div>
                <div style={{overflowX:"auto"}}>
                  {loadingData?(<div style={{textAlign:"center",padding:"40px",color:t.muted,fontSize:14}}>⏳ Cargando portafolio desde la nube...</div>):(
                    <table style={{width:"100%",borderCollapse:"collapse"}}>
                      <thead><tr>
                        <th style={thS}>Color</th>
                        {[["ticker","Activo"],["sector","Sector"],[null,"Tipo"],["shares","Acciones"],["avgCost","Costo Prom"],["price","Precio Act."],[null,"Yield"],[null,"Invertido"],["current","Valor Act."],["pnl","G/P"],["pnlPct","G/P %"],[null,"% Port."],[null,""]].map(([k,h],i)=>(<th key={i} style={{...thS,...(!k?{cursor:"default"}:{})}} onClick={k?()=>toggleSort(k):undefined}>{h}{k&&<SortA k={k}/>}</th>))}
                      </tr></thead>
                      <tbody>
                        {sorted.length===0?(<tr><td colSpan={14} style={{textAlign:"center",padding:"60px 24px",color:t.muted,fontSize:14,fontStyle:"italic",fontFamily:"'DM Sans',sans-serif"}}>{portfolio.length===0?"Agrega tu primer activo para comenzar 🚀":"Sin resultados"}</td></tr>):sorted.map(a=>{
                          const ac=a.avg_cost||a.avgCost||0;
                          const inv=a.shares*ac,cur=a.shares*a.price,pnl=cur-inv;
                          const pnlPct=inv>0?(pnl/inv)*100:0;
                          const portPct=totalCurrent>0?(cur/totalCurrent)*100:0;
                          const sc=SECTOR_COLORS[a.sector]||"#64748b";
                          const cl=ASSET_CLASSIFICATION[a.ticker]||(a.sector==="Cripto"?"speculative":"growth");
                          const clMeta=CLASS_META[cl];
                          const yld=a.dividend_yield||a.dividendYield||KNOWN_YIELDS[a.ticker]||0;
                          return(<tr key={a.id} style={{transition:"background 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=t.tableHover} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`}}><ColorPickerCell color={a.color||ASSET_PALETTE[0]} onChange={v=>updateAsset(a.id,"color",v)} theme={theme}/></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13}}><div style={{display:"flex",alignItems:"center",gap:10}}><AssetLogo ticker={a.ticker} color={a.color}/><div><div style={{fontWeight:600,color:t.text}}>{a.ticker}</div><div style={{color:t.muted,fontSize:10,maxWidth:90,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{a.name}</div></div></div></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`}}><span style={{display:"inline-block",padding:"2px 7px",borderRadius:5,fontSize:10,fontFamily:"'DM Mono',monospace",background:`${sc}22`,color:sc,border:`1px solid ${sc}44`}}>{a.sector}</span></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`}}><span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:5,fontSize:10,fontFamily:"'DM Mono',monospace",background:`${clMeta.color}18`,color:clMeta.color,border:`1px solid ${clMeta.color}35`}}>{clMeta.icon} {clMeta.label}</span></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}><EditCell value={a.shares} onSave={v=>updateAsset(a.id,"shares",v)} format="number" theme={theme}/></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}><EditCell value={ac} onSave={v=>updateAsset(a.id,"avgCost",v)} format="currency" theme={theme}/></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}><EditCell value={a.price} onSave={v=>updateAsset(a.id,"price",v)} format="currency" theme={theme}/></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:12,color:yld>2?t.positive:yld>0?t.accent2:t.muted}}>{yld>0?yld.toFixed(2)+"%":"—"}</td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.muted2}}>{fmt(inv)}</td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text,fontWeight:500}}>{fmt(cur)}</td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:pnl>=0?t.positive:t.negative,fontWeight:600}}>{fmt(pnl)}</td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:pnlPct>=0?t.positive:t.negative,fontWeight:600}}>{fmtPct(pnlPct)}</td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`}}><div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:44,height:5,background:t.bg3,borderRadius:3,overflow:"hidden"}}><div style={{width:`${portPct}%`,height:"100%",background:a.color||t.accent,borderRadius:3,transition:"width 0.5s"}}/></div><span style={{color:t.muted,fontSize:10,fontFamily:"'DM Mono',monospace"}}>{portPct.toFixed(1)}%</span></div></td>
                            <td style={{padding:"10px 14px",borderBottom:`1px solid ${t.tableBorder}`}}><button onClick={()=>deleteAsset(a.id)} style={{background:"none",border:`1px solid ${t.border}`,color:t.muted,borderRadius:6,padding:"3px 9px",fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Mono',monospace"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=t.negative;e.currentTarget.style.color=t.negative;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.muted;}}>✕</button></td>
                          </tr>);
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            <div style={{display:"flex",flexDirection:"column",gap:24}}>
              {[{title:"Por Activo",cId:"chartAssets",labels:assetLabels,data:assetData,colors:assetColors,legend:portfolio.map(a=>({label:a.ticker,color:a.color||ASSET_PALETTE[0],val:a.shares*a.price}))},{title:"Por Sector",cId:"chartSectors",labels:sectorLabels,data:sectorData,colors:sectorColors,legend:sectorLabels.map((s,i)=>({label:s,color:sectorColors[i],val:sectorData[i]}))}].map(c=>(<div key={c.cId} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}><div style={{padding:"15px 24px",borderBottom:`1px solid ${t.border}`}}><span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>{c.title}</span></div><div style={{padding:"16px 24px"}}>{chartReady&&c.data.length>0?(<><div style={{display:"flex",justifyContent:"center",marginBottom:10}}><DonutChart canvasId={c.cId} labels={c.labels} data={c.data} colors={c.colors} total={totalCurrent} theme={theme}/></div><div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:150,overflowY:"auto"}}>{[...c.legend].sort((a,b)=>b.val-a.val).map(item=>{const pct=totalCurrent>0?(item.val/totalCurrent*100):0;return(<div key={item.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:12}}><div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:8,height:8,borderRadius:2,background:item.color,flexShrink:0,boxShadow:`0 0 5px ${item.color}88`}}/><span style={{color:t.muted2}}>{item.label}</span></div><div style={{display:"flex",gap:8}}><span style={{color:t.text,fontWeight:500}}>{pct.toFixed(1)}%</span><span style={{color:t.muted,fontSize:11,minWidth:68,textAlign:"right"}}>{fmt(item.val)}</span></div></div>);})}</div></>):(<div style={{textAlign:"center",padding:"40px 0",color:t.muted,fontSize:13,fontStyle:"italic"}}>{chartReady?"Sin datos aún":"Cargando..."}</div>)}</div></div>))}

              <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
                <div style={{padding:"15px 24px",borderBottom:`1px solid ${t.border}`}}><span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Resumen</span></div>
                <div style={{padding:"8px 24px 18px"}}>
                  {portfolio.length===0?(<div style={{textAlign:"center",padding:"30px 0",color:t.muted,fontSize:13,fontStyle:"italic"}}>Agrega activos para ver el resumen</div>):[{label:"Capital Invertido",val:fmt(totalInvested)},{label:"Valor de Mercado",val:fmt(totalCurrent)},{label:"G/P Total",val:`${fmt(totalPnL)} (${fmtPct(totalPnLPct)})`,col:totalPnL>=0?t.positive:t.negative},{label:"Yield del Portafolio",val:portfolioYield.toFixed(2)+"%",col:t.accent2},{label:"Ingreso Anual Est.",val:fmt(totalDivIncome),col:t.accent2},{label:"Score de Riesgo",val:`${risk.score}/10 · ${risk.label}`,col:risk.color},{label:"Sectores",val:String([...new Set(portfolio.map(a=>a.sector))].length)}].map((row,i,arr)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}><span style={{fontSize:13,color:t.muted2,fontFamily:"'DM Sans',sans-serif"}}>{row.label}</span><span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:row.col||t.text}}>{row.val}</span></div>))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toast message={toast.msg} visible={toast.visible} theme={theme}/>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;}::-webkit-scrollbar{width:5px;height:5px;}::-webkit-scrollbar-track{background:${t.bg};}::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}input[type=number]::-webkit-inner-spin-button{opacity:0.3;}select option{background:${t.card};color:${t.text};}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}`}</style>
    </div>
  );
}

export default function App(){
  const[screen,setScreen]=useState("landing");
  const[activePortfolio,setActivePortfolio]=useState(null);
  const[theme,setTheme]=useState(()=>{try{return localStorage.getItem("pfm_theme")||"light";}catch{return"light";}});
  useEffect(()=>{const link=document.createElement("link");link.rel="stylesheet";link.href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap";document.head.appendChild(link);return()=>document.head.removeChild(link);},[]);
  useEffect(()=>{const t=THEMES[theme];document.body.style.cssText=`margin:0;padding:0;background:${t.bg};color:${t.text};font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;`;try{localStorage.setItem("pfm_theme",theme);}catch{}},[theme]);
  const toggleTheme=()=>setTheme(t=>t==="light"?"dark":"light");
  const handleAuthSuccess=(id,name)=>{setActivePortfolio({id,name});setScreen("dashboard");};
  const handleLogout=()=>{setActivePortfolio(null);setScreen("landing");};
  if(screen==="landing")return<LandingScreen onNew={()=>setScreen("create")} onLogin={()=>setScreen("login")} theme={theme} toggleTheme={toggleTheme}/>;
  if(screen==="create")return<AuthScreen mode="create" onSuccess={handleAuthSuccess} onBack={()=>setScreen("landing")} theme={theme}/>;
  if(screen==="login")return<AuthScreen mode="login" onSuccess={handleAuthSuccess} onBack={()=>setScreen("landing")} theme={theme}/>;
  if(screen==="dashboard"&&activePortfolio)return<Dashboard portfolioId={activePortfolio.id} portfolioName={activePortfolio.name} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}/>;
  return null;
}
