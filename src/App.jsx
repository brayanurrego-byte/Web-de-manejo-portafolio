import { useEffect, useRef, useState, useCallback } from "react";

/* ══════════════════════════════════════════════════════════
   CONSTANTS & DATA
══════════════════════════════════════════════════════════ */
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
  AVAX:"Avalanche",MATIC:"Polygon",DOT:"Polkadot",GLD:"SPDR Gold Shares",
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

/* simple hash for password (not cryptographic, but fine for localStorage) */
function hashStr(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) { h = (Math.imul(31, h) + s.charCodeAt(i)) | 0; }
  return h.toString(36);
}

const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n);
const fmtPct = (n) => (n>=0?"+":"")+n.toFixed(2)+"%";
const fmtNum = (n) => new Intl.NumberFormat("en-US",{maximumFractionDigits:6}).format(n);

/* ══════════════════════════════════════════════════════════
   STORAGE HELPERS
══════════════════════════════════════════════════════════ */
function getPortfolioIndex() {
  try { return JSON.parse(localStorage.getItem("pfm_index")||"[]"); } catch { return []; }
}
function savePortfolioIndex(idx) { localStorage.setItem("pfm_index", JSON.stringify(idx)); }
function getPortfolioData(id) {
  try { return JSON.parse(localStorage.getItem(`pfm_data_${id}`)||"[]"); } catch { return []; }
}
function savePortfolioData(id, data) { localStorage.setItem(`pfm_data_${id}`, JSON.stringify(data)); }

/* ══════════════════════════════════════════════════════════
   THEME TOKENS
══════════════════════════════════════════════════════════ */
const THEMES = {
  light: {
    bg:"#f0f4f8", bg2:"#e4eaf2", bg3:"#d8e0ed",
    card:"#ffffff", border:"#c2cfe0",
    text:"#0f1c2e", muted:"#6b7f99", muted2:"#4a607a",
    accent:"#1a4fa0", accent2:"#c9a84c",
    positive:"#1a8a4a", negative:"#c0392b",
    inputBg:"#edf2f7", headerBg:"rgba(240,244,248,0.95)",
    shadow:"rgba(10,30,80,0.08)",
    gridColor:"rgba(26,79,160,0.06)",
    tableHover:"rgba(26,79,160,0.04)",
    tableBorder:"rgba(194,207,224,0.6)",
    thBg:"#e8eef7",
  },
  dark: {
    bg:"#0a0f1e", bg2:"#0d1526", bg3:"#1e293b",
    card:"#1a2235", border:"#1e3a5f",
    text:"#e2e8f0", muted:"#64748b", muted2:"#94a3b8",
    accent:"#6366f1", accent2:"#c9a84c",
    positive:"#22c55e", negative:"#ef4444",
    inputBg:"rgba(15,23,42,0.8)", headerBg:"rgba(10,15,30,0.92)",
    shadow:"rgba(0,0,0,0.3)",
    gridColor:"rgba(99,102,241,0.04)",
    tableHover:"rgba(99,102,241,0.05)",
    tableBorder:"rgba(30,41,59,0.8)",
    thBg:"#0d1526",
  },
};

/* ══════════════════════════════════════════════════════════
   MICRO COMPONENTS
══════════════════════════════════════════════════════════ */
function Toast({message,visible,theme}) {
  const t=THEMES[theme];
  return (
    <div style={{
      position:"fixed",bottom:30,right:30,zIndex:9999,
      background:`linear-gradient(135deg,${t.accent},${theme==="dark"?"#8b5cf6":"#2563eb"})`,
      color:"#fff",padding:"12px 22px",borderRadius:12,
      fontSize:13,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
      boxShadow:`0 8px 30px ${t.accent}55`,
      transform:visible?"translateY(0)":"translateY(80px)",
      opacity:visible?1:0, transition:"all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      pointerEvents:"none",
    }}>{message}</div>
  );
}

function AssetLogo({ticker,color}) {
  const [err,setErr]=useState(false);
  const url=LOGO_MAP[ticker?.toUpperCase()];
  const t=ticker?.toUpperCase().substring(0,2)||"?";
  if(url&&!err) return <img src={url} alt={ticker} onError={()=>setErr(true)}
    style={{width:32,height:32,borderRadius:8,objectFit:"contain",background:"#fff",padding:2,flexShrink:0}}/>;
  return <div style={{width:32,height:32,borderRadius:8,background:color||"#334155",display:"flex",
    alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#fff",flexShrink:0,
    boxShadow:`0 0 10px ${color||"#334155"}66`}}>{t}</div>;
}

function ColorPickerCell({color,onChange,theme}) {
  const [open,setOpen]=useState(false);
  const t=THEMES[theme];
  return (
    <div style={{position:"relative"}}>
      <div onClick={()=>setOpen(!open)} title="Cambiar color" style={{
        width:22,height:22,borderRadius:6,background:color,cursor:"pointer",
        border:`2px solid ${color}66`,boxShadow:`0 0 8px ${color}55`,
        transition:"transform 0.2s",
      }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.25)"}
         onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
      {open&&(
        <div style={{position:"absolute",top:30,left:0,zIndex:50,
          background:t.card,border:`1px solid ${t.border}`,borderRadius:12,padding:10,
          display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,
          boxShadow:`0 20px 40px ${t.shadow}`}}>
          {ASSET_PALETTE.map(c=>(
            <div key={c} onClick={()=>{onChange(c);setOpen(false);}} style={{
              width:20,height:20,borderRadius:5,background:c,cursor:"pointer",
              border:color===c?"2.5px solid white":"2px solid transparent",
              transition:"transform 0.15s",
            }} onMouseEnter={e=>e.currentTarget.style.transform="scale(1.3)"}
               onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
          ))}
        </div>
      )}
    </div>
  );
}

function EditCell({value,onSave,format="number",theme}) {
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState("");
  const ref=useRef(null);
  const t=THEMES[theme];
  const start=()=>{ setDraft(String(value)); setEditing(true); setTimeout(()=>ref.current?.select(),10); };
  const commit=()=>{ const p=parseFloat(draft); if(!isNaN(p)&&p>0) onSave(p); setEditing(false); };
  if(editing) return (
    <input ref={ref} value={draft} onChange={e=>setDraft(e.target.value)}
      onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}}
      style={{width:90,background:t.inputBg,border:`1.5px solid ${t.accent}`,borderRadius:6,
        color:t.text,fontFamily:"'DM Mono',monospace",fontSize:13,padding:"4px 8px",outline:"none"}}/>
  );
  return (
    <span onClick={start} title="Clic para editar" style={{
      cursor:"pointer",borderBottom:`1px dashed ${t.accent}66`,paddingBottom:1,
      transition:"border-color 0.2s",
    }} onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
       onMouseLeave={e=>e.currentTarget.style.borderColor=`${t.accent}66`}>
      {format==="currency"?fmt(value):fmtNum(value)}
    </span>
  );
}

function DonutChart({canvasId,labels,data,colors,total,theme}) {
  const chartRef=useRef(null);
  const t=THEMES[theme];
  useEffect(()=>{
    if(!window.Chart||data.length===0) return;
    if(chartRef.current) chartRef.current.destroy();
    const ctx=document.getElementById(canvasId)?.getContext("2d");
    if(!ctx) return;
    chartRef.current=new window.Chart(ctx,{
      type:"doughnut",
      data:{labels,datasets:[{data,backgroundColor:colors,borderColor:t.bg,borderWidth:3,hoverOffset:10,hoverBorderColor:t.card}]},
      options:{responsive:true,maintainAspectRatio:true,cutout:"72%",
        animation:{duration:600,easing:"easeInOutQuart"},
        plugins:{legend:{display:false},tooltip:{
          callbacks:{label:(ctx)=>` ${ctx.label}: ${fmt(ctx.raw)} (${total>0?(ctx.raw/total*100).toFixed(1):0}%)`},
          backgroundColor:t.card,borderColor:t.border,borderWidth:1,
          titleColor:t.text,bodyColor:t.muted,padding:12,
          titleFont:{family:"'DM Sans',sans-serif",size:13},
          bodyFont:{family:"'DM Mono',monospace",size:12},
        }},
      },
    });
    return ()=>{ if(chartRef.current) chartRef.current.destroy(); };
  },[canvasId,JSON.stringify(labels),JSON.stringify(data),JSON.stringify(colors),total,theme]);
  return <canvas id={canvasId} style={{maxHeight:210}}/>;
}

/* ══════════════════════════════════════════════════════════
   LANDING SCREEN
══════════════════════════════════════════════════════════ */
function LandingScreen({onNew,onLogin,theme,toggleTheme}) {
  const t=THEMES[theme];
  const portfolios=getPortfolioIndex();
  const [show,setShow]=useState(false);

  // stagger animation
  useEffect(()=>{ setTimeout(()=>setShow(true),50); },[]);

  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
      {/* Background decoration */}
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"-15%",left:"-10%",width:500,height:500,borderRadius:"50%",
        background:`radial-gradient(circle,${t.accent}10 0%,transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",bottom:"-15%",right:"-10%",width:400,height:400,borderRadius:"50%",
        background:`radial-gradient(circle,${t.accent2}10 0%,transparent 70%)`,pointerEvents:"none"}}/>

      {/* Theme toggle */}
      <button onClick={toggleTheme} style={{
        position:"absolute",top:24,right:24,background:t.card,border:`1px solid ${t.border}`,
        borderRadius:10,padding:"8px 14px",cursor:"pointer",color:t.text,fontSize:18,
        boxShadow:`0 2px 10px ${t.shadow}`,transition:"all 0.2s",
      }}>{theme==="light"?"🌙":"☀️"}</button>

      <div style={{
        position:"relative",zIndex:1,textAlign:"center",maxWidth:520,padding:"0 24px",
        opacity:show?1:0,transform:show?"translateY(0)":"translateY(30px)",
        transition:"all 0.7s cubic-bezier(0.34,1.2,0.64,1)",
      }}>
        {/* Logo */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:14,marginBottom:36}}>
          <div style={{
            width:64,height:64,borderRadius:18,
            background:`linear-gradient(135deg,${t.accent},${t.accent2})`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,
            boxShadow:`0 8px 30px ${t.accent}44`,
          }}>📊</div>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:700,
              color:t.text,lineHeight:1,letterSpacing:"-1px"}}>Portfolio</div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:13,color:t.muted,letterSpacing:"2px",
              textTransform:"uppercase",marginTop:2}}>Manager Pro</div>
          </div>
        </div>

        <p style={{color:t.muted2,fontSize:16,marginBottom:44,lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}>
          Gestiona tus inversiones de manera inteligente.<br/>
          Cada portafolio, protegido con tu contraseña personal.
        </p>

        {/* Cards */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <button onClick={onNew} style={{
            background:t.card,border:`2px solid ${t.accent}`,borderRadius:18,
            padding:"28px 20px",cursor:"pointer",textAlign:"center",
            boxShadow:`0 4px 20px ${t.accent}22`,
            transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${t.accent}33`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 20px ${t.accent}22`;}}>
            <div style={{fontSize:36,marginBottom:12}}>✨</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:t.text,marginBottom:8}}>Nuevo Portafolio</div>
            <div style={{color:t.muted,fontSize:13,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>Crea uno nuevo con nombre y contraseña</div>
          </button>

          <button onClick={onLogin} style={{
            background:`linear-gradient(135deg,${t.accent},${t.accent2})`,
            border:`2px solid transparent`,borderRadius:18,
            padding:"28px 20px",cursor:"pointer",textAlign:"center",
            boxShadow:`0 4px 20px ${t.accent}44`,
            transition:"all 0.25s cubic-bezier(0.34,1.2,0.64,1)",
          }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${t.accent}55`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.boxShadow=`0 4px 20px ${t.accent}44`;}}>
            <div style={{fontSize:36,marginBottom:12}}>🔐</div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:17,fontWeight:700,color:"#fff",marginBottom:8}}>Tengo un Portafolio</div>
            <div style={{color:"rgba(255,255,255,0.8)",fontSize:13,fontFamily:"'DM Sans',sans-serif",lineHeight:1.5}}>
              {portfolios.length>0?`${portfolios.length} portafolio${portfolios.length!==1?"s":""} guardado${portfolios.length!==1?"s":""}` : "Accede con tu contraseña"}
            </div>
          </button>
        </div>

        {portfolios.length>0&&(
          <div style={{marginTop:20,display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>
            {portfolios.map(p=>(
              <span key={p.id} style={{
                background:t.bg2,border:`1px solid ${t.border}`,borderRadius:20,
                padding:"4px 12px",fontSize:12,color:t.muted2,fontFamily:"'DM Mono',monospace",
              }}>📁 {p.name}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   AUTH SCREEN (create or login)
══════════════════════════════════════════════════════════ */
function AuthScreen({mode,onSuccess,onBack,theme}) {
  const t=THEMES[theme];
  const [pfName,setPfName]=useState("");
  const [password,setPassword]=useState("");
  const [showPw,setShowPw]=useState(false);
  const [selectedId,setSelectedId]=useState("");
  const [error,setError]=useState("");
  const [shaking,setShaking]=useState(false);
  const portfolios=getPortfolioIndex();

  const shake=()=>{ setShaking(true); setTimeout(()=>setShaking(false),500); };

  const handleCreate=()=>{
    if(!pfName.trim()) { setError("Escribe un nombre para el portafolio"); return; }
    if(password.length<4) { setError("La contraseña debe tener al menos 4 caracteres"); return; }
    const exists=portfolios.find(p=>p.name.toLowerCase()===pfName.trim().toLowerCase());
    if(exists) { setError("Ya existe un portafolio con ese nombre"); shake(); return; }
    const newPf={ id: Date.now().toString(), name: pfName.trim(), passwordHash: hashStr(password), createdAt: new Date().toISOString() };
    const newIndex=[...portfolios,newPf];
    savePortfolioIndex(newIndex);
    savePortfolioData(newPf.id,[]);
    onSuccess(newPf.id, pfName.trim());
  };

  const handleLogin=()=>{
    const pf=portfolios.find(p=>p.id===selectedId);
    if(!pf) { setError("Selecciona un portafolio"); return; }
    if(hashStr(password)!==pf.passwordHash) { setError("Contraseña incorrecta"); shake(); setPassword(""); return; }
    onSuccess(pf.id, pf.name);
  };

  const inputS={
    background:t.inputBg,border:`1.5px solid ${t.border}`,borderRadius:10,
    padding:"13px 16px",color:t.text,fontFamily:"'DM Sans',sans-serif",
    fontSize:15,outline:"none",width:"100%",boxSizing:"border-box",
    transition:"border-color 0.2s",
  };

  return (
    <div style={{minHeight:"100vh",background:t.bg,display:"flex",alignItems:"center",justifyContent:"center",
      position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none"}}/>

      <div style={{
        background:t.card,border:`1px solid ${t.border}`,borderRadius:24,
        padding:"40px 44px",width:"100%",maxWidth:420,position:"relative",zIndex:1,
        boxShadow:`0 20px 60px ${t.shadow}`,
        animation:shaking?"shake 0.4s":"none",
      }}>
        <button onClick={onBack} style={{
          background:"none",border:`1px solid ${t.border}`,color:t.muted,
          borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:13,
          marginBottom:24,transition:"all 0.2s",fontFamily:"'DM Sans',sans-serif",
        }}>← Volver</button>

        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{fontSize:44,marginBottom:12}}>{mode==="create"?"✨":"🔐"}</div>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:t.text,margin:0}}>
            {mode==="create"?"Crear Portafolio":"Acceder"}
          </h2>
          <p style={{color:t.muted,fontSize:14,marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>
            {mode==="create"?"Elige un nombre y contraseña única":"Selecciona tu portafolio e ingresa tu contraseña"}
          </p>
        </div>

        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {mode==="create"?(
            <div>
              <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>Nombre del Portafolio</label>
              <input value={pfName} onChange={e=>setPfName(e.target.value)} placeholder="Mi Portafolio 2025"
                style={inputS} onFocus={e=>e.currentTarget.style.borderColor=t.accent}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
                onKeyDown={e=>{if(e.key==="Enter")handleCreate();}}/>
            </div>
          ):(
            <div>
              <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>Selecciona tu Portafolio</label>
              {portfolios.length===0?(
                <div style={{color:t.muted,fontSize:14,fontStyle:"italic",textAlign:"center",padding:"16px 0"}}>No hay portafolios guardados.<br/>¡Crea uno nuevo!</div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {portfolios.map(p=>(
                    <div key={p.id} onClick={()=>{setSelectedId(p.id);setError("");}} style={{
                      background:selectedId===p.id?`${t.accent}15`:t.inputBg,
                      border:`2px solid ${selectedId===p.id?t.accent:t.border}`,
                      borderRadius:10,padding:"12px 16px",cursor:"pointer",
                      display:"flex",alignItems:"center",gap:10,
                      transition:"all 0.2s",
                    }}>
                      <span style={{fontSize:20}}>📁</span>
                      <div>
                        <div style={{fontFamily:"'DM Sans',sans-serif",fontWeight:600,color:t.text,fontSize:14}}>{p.name}</div>
                        <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted}}>
                          Creado: {new Date(p.createdAt).toLocaleDateString("es-CO")}
                        </div>
                      </div>
                      {selectedId===p.id&&<span style={{marginLeft:"auto",color:t.accent,fontSize:18}}>✓</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label style={{fontSize:11,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace",display:"block",marginBottom:8}}>
              {mode==="create"?"Contraseña":"Contraseña"}
            </label>
            <div style={{position:"relative"}}>
              <input value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                type={showPw?"text":"password"} placeholder={mode==="create"?"Mínimo 4 caracteres":"Tu contraseña"}
                style={{...inputS,paddingRight:48}}
                onFocus={e=>e.currentTarget.style.borderColor=t.accent}
                onBlur={e=>e.currentTarget.style.borderColor=t.border}
                onKeyDown={e=>{if(e.key==="Enter") mode==="create"?handleCreate():handleLogin();}}/>
              <button onClick={()=>setShowPw(!showPw)} style={{
                position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                background:"none",border:"none",cursor:"pointer",fontSize:18,
              }}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>

          {error&&(
            <div style={{background:`${t.negative}15`,border:`1px solid ${t.negative}44`,
              borderRadius:8,padding:"10px 14px",color:t.negative,fontSize:13,
              fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:8}}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={mode==="create"?handleCreate:handleLogin}
            disabled={mode==="login"&&portfolios.length===0}
            style={{
              background:portfolios.length===0&&mode==="login"?t.bg3:`linear-gradient(135deg,${t.accent},${mode==="dark"?"#8b5cf6":"#1d6db5"})`,
              color:"#fff",border:"none",borderRadius:12,padding:"14px",
              fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:16,
              cursor:portfolios.length===0&&mode==="login"?"not-allowed":"pointer",
              marginTop:4,boxShadow:`0 4px 20px ${t.accent}44`,
              transition:"all 0.2s",
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
            {mode==="create"?"🚀 Crear y Entrar":"🔓 Acceder"}
          </button>
        </div>
      </div>

      <style>{`@keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(6px)} }`}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════════════ */
function Dashboard({portfolioId,portfolioName,onLogout,theme,toggleTheme}) {
  const t=THEMES[theme];
  const [portfolio,setPortfolio]=useState(()=>getPortfolioData(portfolioId));
  const [chartReady,setChartReady]=useState(!!window.Chart);
  const [toast,setToast]=useState({msg:"",visible:false});
  const [search,setSearch]=useState("");
  const [sortKey,setSortKey]=useState("ticker");
  const [sortDir,setSortDir]=useState(1);
  const [form,setForm]=useState({ticker:"",name:"",sector:"Tecnología",shares:"",avgCost:"",price:""});
  const [confirmLogout,setConfirmLogout]=useState(false);

  useEffect(()=>{
    if(window.Chart){setChartReady(true);return;}
    const s=document.createElement("script");
    s.src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    s.onload=()=>setChartReady(true);
    document.head.appendChild(s);
  },[]);

  const showToast=useCallback((msg)=>{
    setToast({msg,visible:true});
    setTimeout(()=>setToast(p=>({...p,visible:false})),2500);
  },[]);

  const save=(p)=>{ savePortfolioData(portfolioId,p); };

  const addAsset=()=>{
    const ticker=form.ticker.trim().toUpperCase();
    const name=form.name.trim();
    const shares=parseFloat(form.shares);
    const avgCost=parseFloat(form.avgCost);
    const price=parseFloat(form.price);
    if(!ticker||!name||isNaN(shares)||isNaN(avgCost)||isNaN(price)) { showToast("⚠️ Completa todos los campos"); return; }
    if(portfolio.find(a=>a.ticker===ticker)) { showToast("⚠️ Ese ticker ya existe"); return; }
    const colorIdx=portfolio.length%ASSET_PALETTE.length;
    const a={id:Date.now(),ticker,name,sector:form.sector,shares,avgCost,price,color:ASSET_PALETTE[colorIdx]};
    const next=[...portfolio,a];
    setPortfolio(next); save(next);
    setForm({ticker:"",name:"",sector:"Tecnología",shares:"",avgCost:"",price:""});
    showToast(`✅ ${ticker} agregado`);
  };

  const deleteAsset=(id)=>{ const next=portfolio.filter(a=>a.id!==id); setPortfolio(next); save(next); showToast("🗑 Activo eliminado"); };

  const updateAsset=(id,field,value)=>{ const next=portfolio.map(a=>a.id===id?{...a,[field]:value}:a); setPortfolio(next); save(next); };

  const tickerBlur=()=>{
    const tk=form.ticker.trim().toUpperCase();
    setForm(f=>({...f,name:f.name||TICKER_NAMES[tk]||f.name,sector:TICKER_SECTORS[tk]||f.sector}));
  };

  const exportCSV=()=>{
    const hdr=["Ticker","Nombre","Sector","Acciones","Costo Prom","Precio Act","Invertido","Valor Act","G/P","G/P %"];
    const rows=portfolio.map(a=>{
      const inv=a.shares*a.avgCost,cur=a.shares*a.price,pnl=cur-inv;
      return [a.ticker,a.name,a.sector,a.shares,a.avgCost,a.price,inv.toFixed(2),cur.toFixed(2),pnl.toFixed(2),((inv>0?pnl/inv*100:0).toFixed(2))+"%"];
    });
    const csv=[hdr,...rows].map(r=>r.join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    Object.assign(document.createElement("a"),{href:url,download:`${portfolioName}.csv`}).click();
    showToast("📥 CSV exportado");
  };

  const toggleSort=(k)=>{ if(sortKey===k) setSortDir(d=>d*-1); else{setSortKey(k);setSortDir(1);} };

  const filtered=portfolio.filter(a=>
    a.ticker.includes(search.toUpperCase())||a.name.toLowerCase().includes(search.toLowerCase())||a.sector.toLowerCase().includes(search.toLowerCase())
  );
  const sorted=[...filtered].sort((a,b)=>{
    let av=a[sortKey],bv=b[sortKey];
    if(sortKey==="current"){av=a.shares*a.price;bv=b.shares*b.price;}
    if(sortKey==="pnl"){av=(a.shares*a.price)-(a.shares*a.avgCost);bv=(b.shares*b.price)-(b.shares*b.avgCost);}
    if(sortKey==="pnlPct"){av=a.avgCost>0?(a.price-a.avgCost)/a.avgCost:0;bv=b.avgCost>0?(b.price-b.avgCost)/b.avgCost:0;}
    if(typeof av==="string") return av.localeCompare(bv)*sortDir;
    return (av-bv)*sortDir;
  });

  const totalInvested=portfolio.reduce((s,a)=>s+a.shares*a.avgCost,0);
  const totalCurrent=portfolio.reduce((s,a)=>s+a.shares*a.price,0);
  const totalPnL=totalCurrent-totalInvested;
  const totalPnLPct=totalInvested>0?(totalPnL/totalInvested)*100:0;

  const assetLabels=portfolio.map(a=>a.ticker);
  const assetData=portfolio.map(a=>a.shares*a.price);
  const assetColors=portfolio.map(a=>a.color||ASSET_PALETTE[0]);

  const sectorMap={};
  portfolio.forEach(a=>{const v=a.shares*a.price;sectorMap[a.sector]=(sectorMap[a.sector]||0)+v;});
  const sectorLabels=Object.keys(sectorMap);
  const sectorData=Object.values(sectorMap);
  const sectorColors=sectorLabels.map(s=>SECTOR_COLORS[s]||"#64748b");

  const best=portfolio.length>0?portfolio.reduce((b,a)=>{
    const ap=a.avgCost>0?(a.price-a.avgCost)/a.avgCost:0;
    const bp=b.avgCost>0?(b.price-b.avgCost)/b.avgCost:0;
    return ap>bp?a:b;
  }):null;
  const worst=portfolio.length>0?portfolio.reduce((w,a)=>{
    const ap=a.avgCost>0?(a.price-a.avgCost)/a.avgCost:0;
    const wp=w.avgCost>0?(w.price-w.avgCost)/w.avgCost:0;
    return ap<wp?a:w;
  }):null;
  const biggest=portfolio.length>0?portfolio.reduce((b,a)=>(a.shares*a.price>b.shares*b.price?a:b)):null;

  const inputS={background:t.inputBg,border:`1px solid ${t.border}`,borderRadius:8,
    padding:"10px 12px",color:t.text,fontFamily:"'DM Mono',monospace",fontSize:13,
    outline:"none",width:"100%",transition:"border-color 0.2s",boxSizing:"border-box"};
  const SortArrow=({k})=>sortKey!==k?<span style={{color:t.border,marginLeft:3}}>↕</span>:<span style={{color:t.accent,marginLeft:3}}>{sortDir===1?"↑":"↓"}</span>;
  const thS={padding:"11px 14px",textAlign:"left",fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",
    color:t.muted,fontFamily:"'DM Mono',monospace",fontWeight:400,borderBottom:`1px solid ${t.border}`,
    background:t.thBg,cursor:"pointer",userSelect:"none",whiteSpace:"nowrap"};

  // Stat card mini
  const SC=({label,value,sub,color})=>(
    <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,padding:"22px 24px",
      position:"relative",overflow:"hidden",transition:"all 0.2s",boxShadow:`0 2px 12px ${t.shadow}`}}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${color||t.accent}66`;e.currentTarget.style.transform="translateY(-2px)";}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.transform="translateY(0)";}}>
      <div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${color||t.accent},transparent)`}}/>
      <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1.5px",color:t.muted,fontFamily:"'DM Mono',monospace",marginBottom:10}}>{label}</div>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:24,fontWeight:500,color:t.text,lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,marginTop:8,fontFamily:"'DM Mono',monospace",color:sub.startsWith("+")?t.positive:sub.startsWith("-")?t.negative:t.muted}}>{sub}</div>}
    </div>
  );

  return (
    <div style={{background:t.bg,minHeight:"100vh",position:"relative"}}>
      <div style={{position:"fixed",inset:0,backgroundImage:`linear-gradient(${t.gridColor} 1px,transparent 1px),linear-gradient(90deg,${t.gridColor} 1px,transparent 1px)`,backgroundSize:"48px 48px",pointerEvents:"none",zIndex:0}}/>
      <div style={{position:"fixed",top:"-20%",left:"-10%",width:600,height:600,borderRadius:"50%",background:`radial-gradient(circle,${t.accent}08 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

      {/* HEADER */}
      <header style={{borderBottom:`1px solid ${t.border}`,padding:"16px 0",backdropFilter:"blur(20px)",position:"sticky",top:0,zIndex:100,background:t.headerBg}}>
        <div style={{maxWidth:1500,margin:"0 auto",padding:"0 28px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:36,height:36,borderRadius:10,background:`linear-gradient(135deg,${t.accent},${t.accent2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 20px ${t.accent}44`}}>📊</div>
            <div>
              <span style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:700,color:t.text}}>Portfolio<span style={{color:t.accent}}>.</span>Pro</span>
              <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted,marginLeft:10}}>📁 {portfolioName}</span>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:t.muted}}>
              {new Date().toLocaleDateString("es-CO",{weekday:"short",year:"numeric",month:"short",day:"numeric"})}
            </span>
            {portfolio.length>0&&<button onClick={exportCSV} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.muted2,borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=t.accent}
              onMouseLeave={e=>e.currentTarget.style.borderColor=t.border}>↓ CSV</button>}
            <button onClick={toggleTheme} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.text,borderRadius:8,padding:"7px 11px",fontSize:16,cursor:"pointer",transition:"all 0.2s"}}>
              {theme==="light"?"🌙":"☀️"}
            </button>
            <button onClick={()=>setConfirmLogout(true)} style={{background:t.bg2,border:`1px solid ${t.border}`,color:t.muted2,borderRadius:8,padding:"7px 13px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.color=t.negative}
              onMouseLeave={e=>e.currentTarget.style.color=t.muted2}>Salir 🚪</button>
          </div>
        </div>
      </header>

      {/* CONFIRM LOGOUT MODAL */}
      {confirmLogout&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}}>
          <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:20,padding:"36px 40px",textAlign:"center",maxWidth:360,boxShadow:`0 20px 60px ${t.shadow}`}}>
            <div style={{fontSize:44,marginBottom:12}}>👋</div>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:t.text,fontSize:22,margin:"0 0 8px"}}>¿Cerrar sesión?</h3>
            <p style={{color:t.muted,fontSize:14,fontFamily:"'DM Sans',sans-serif",marginBottom:24}}>Tu portafolio quedará guardado. Vuelve cuando quieras con tu contraseña.</p>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setConfirmLogout(false)} style={{flex:1,background:t.bg2,border:`1px solid ${t.border}`,color:t.text,borderRadius:10,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer",fontSize:14}}>Cancelar</button>
              <button onClick={onLogout} style={{flex:1,background:`linear-gradient(135deg,${t.negative},#ff6b6b)`,border:"none",color:"#fff",borderRadius:10,padding:"11px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,cursor:"pointer",fontSize:14}}>Salir</button>
            </div>
          </div>
        </div>
      )}

      <div style={{maxWidth:1500,margin:"0 auto",padding:"0 28px 60px",position:"relative",zIndex:1}}>

        {/* STAT CARDS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,padding:"28px 0 24px"}}>
          <SC label="Capital Invertido" value={fmt(totalInvested)} sub={`${portfolio.length} posicion${portfolio.length!==1?"es":""}`} color={t.accent}/>
          <SC label="Valor de Mercado" value={fmt(totalCurrent)} sub={totalInvested>0?`Rendimiento: ${fmtPct(totalPnLPct)}`:undefined} color="#10b981"/>
          <SC label="Ganancia / Pérdida" value={fmt(totalPnL)} sub={totalInvested>0?fmtPct(totalPnLPct):undefined} color={totalPnL>=0?t.positive:t.negative}/>
          <SC label="Sectores" value={[...new Set(portfolio.map(a=>a.sector))].length} sub={`de ${portfolio.length} activos`} color={t.accent2}/>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 380px",gap:24}}>
          {/* LEFT */}
          <div style={{display:"flex",flexDirection:"column",gap:24}}>

            {/* ADD FORM */}
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
              <div style={{padding:"16px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Agregar Activo</span>
              </div>
              <div style={{padding:"18px 24px",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,alignItems:"end"}}>
                {[
                  {key:"ticker",label:"Ticker",placeholder:"AAPL",style:{textTransform:"uppercase"}},
                  {key:"name",label:"Nombre",placeholder:"Apple Inc."},
                ].map(f=>(
                  <div key={f.key} style={{display:"flex",flexDirection:"column",gap:5}}>
                    <label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>{f.label}</label>
                    <input value={form[f.key]} placeholder={f.placeholder} style={{...inputS,...(f.style||{})}}
                      onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                      onBlur={f.key==="ticker"?tickerBlur:undefined}
                      onKeyDown={e=>{if(e.key==="Enter")addAsset();}}
                      onFocus={e=>e.currentTarget.style.borderColor=t.accent}/>
                  </div>
                ))}
                <div style={{display:"flex",flexDirection:"column",gap:5}}>
                  <label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>Sector</label>
                  <select value={form.sector} onChange={e=>setForm(p=>({...p,sector:e.target.value}))} style={inputS}>
                    {SECTORS.map(s=><option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {[
                  {key:"shares",label:"Acciones",placeholder:"10"},
                  {key:"avgCost",label:"Costo Prom ($)",placeholder:"150.00"},
                  {key:"price",label:"Precio Actual ($)",placeholder:"175.00"},
                ].map(f=>(
                  <div key={f.key} style={{display:"flex",flexDirection:"column",gap:5}}>
                    <label style={{fontSize:10,textTransform:"uppercase",letterSpacing:"1px",color:t.muted,fontFamily:"'DM Mono',monospace"}}>{f.label}</label>
                    <input value={form[f.key]} placeholder={f.placeholder} type="number" min="0" style={inputS}
                      onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))}
                      onKeyDown={e=>{if(e.key==="Enter")addAsset();}}
                      onFocus={e=>e.currentTarget.style.borderColor=t.accent}
                      onBlur={e=>e.currentTarget.style.borderColor=t.border}/>
                  </div>
                ))}
                <button onClick={addAsset} style={{
                  background:`linear-gradient(135deg,${t.accent},${theme==="dark"?"#8b5cf6":"#1d6db5"})`,
                  color:"#fff",border:"none",borderRadius:10,padding:"10px 16px",
                  fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",
                  height:42,alignSelf:"end",boxShadow:`0 4px 16px ${t.accent}44`,transition:"all 0.2s",
                }} onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                   onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>+ Agregar</button>
              </div>
            </div>

            {/* TABLE */}
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
              <div style={{padding:"16px 24px",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Mis Activos</span>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:11,color:t.muted,fontFamily:"'DM Mono',monospace"}}>✏️ Clic en precio/acciones para editar</span>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Buscar..."
                    style={{...inputS,width:155,padding:"7px 12px",fontSize:12}}
                    onFocus={e=>e.currentTarget.style.borderColor=t.accent}
                    onBlur={e=>e.currentTarget.style.borderColor=t.border}/>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      <th style={thS}>Color</th>
                      {[["ticker","Activo"],["sector","Sector"],["shares","Acciones"],["avgCost","Costo Prom"],["price","Precio Act."],[null,"Invertido"],["current","Valor Act."],["pnl","G/P"],["pnlPct","G/P %"],[null,"% Port."],[null,""]].map(([k,h],i)=>(
                        <th key={i} style={{...thS,...(k?{}:{cursor:"default"})}} onClick={k?()=>toggleSort(k):undefined}>
                          {h}{k&&<SortArrow k={k}/>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length===0?(
                      <tr><td colSpan={12} style={{textAlign:"center",padding:"60px 24px",color:t.muted,fontSize:14,fontStyle:"italic",fontFamily:"'DM Sans',sans-serif"}}>
                        {portfolio.length===0?"Agrega tu primer activo para comenzar 🚀":"Sin resultados para tu búsqueda"}
                      </td></tr>
                    ):sorted.map(a=>{
                      const inv=a.shares*a.avgCost,cur=a.shares*a.price,pnl=cur-inv;
                      const pnlPct=inv>0?(pnl/inv)*100:0;
                      const portPct=totalCurrent>0?(cur/totalCurrent)*100:0;
                      const sc=SECTOR_COLORS[a.sector]||"#64748b";
                      return (
                        <tr key={a.id} style={{transition:"background 0.15s"}}
                          onMouseEnter={e=>e.currentTarget.style.background=t.tableHover}
                          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`}}>
                            <ColorPickerCell color={a.color||ASSET_PALETTE[0]} onChange={v=>updateAsset(a.id,"color",v)} theme={theme}/>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <AssetLogo ticker={a.ticker} color={a.color}/>
                              <div>
                                <div style={{fontWeight:600,color:t.text}}>{a.ticker}</div>
                                <div style={{color:t.muted,fontSize:11}}>{a.name}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`}}>
                            <span style={{display:"inline-block",padding:"2px 8px",borderRadius:5,fontSize:10,fontFamily:"'DM Mono',monospace",background:`${sc}22`,color:sc,border:`1px solid ${sc}44`}}>{a.sector}</span>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}>
                            <EditCell value={a.shares} onSave={v=>updateAsset(a.id,"shares",v)} format="number" theme={theme}/>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}>
                            <EditCell value={a.avgCost} onSave={v=>updateAsset(a.id,"avgCost",v)} format="currency" theme={theme}/>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text}}>
                            <EditCell value={a.price} onSave={v=>updateAsset(a.id,"price",v)} format="currency" theme={theme}/>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.muted2}}>{fmt(inv)}</td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:t.text,fontWeight:500}}>{fmt(cur)}</td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:pnl>=0?t.positive:t.negative,fontWeight:600}}>{fmt(pnl)}</td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`,fontFamily:"'DM Mono',monospace",fontSize:13,color:pnlPct>=0?t.positive:t.negative,fontWeight:600}}>{fmtPct(pnlPct)}</td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <div style={{width:50,height:5,background:t.bg3,borderRadius:3,overflow:"hidden"}}>
                                <div style={{width:`${portPct}%`,height:"100%",background:a.color||t.accent,borderRadius:3,transition:"width 0.5s"}}/>
                              </div>
                              <span style={{color:t.muted,fontSize:11,fontFamily:"'DM Mono',monospace"}}>{portPct.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td style={{padding:"12px 14px",borderBottom:`1px solid ${t.tableBorder}`}}>
                            <button onClick={()=>deleteAsset(a.id)} style={{background:"none",border:`1px solid ${t.border}`,color:t.muted,borderRadius:6,padding:"4px 10px",fontSize:12,cursor:"pointer",transition:"all 0.2s",fontFamily:"'DM Mono',monospace"}}
                              onMouseEnter={e=>{e.currentTarget.style.borderColor=t.negative;e.currentTarget.style.color=t.negative;}}
                              onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.muted;}}>✕</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{display:"flex",flexDirection:"column",gap:24}}>
            {[
              {title:"Por Activo",cId:"chartAssets",labels:assetLabels,data:assetData,colors:assetColors,legend:portfolio.map(a=>({label:a.ticker,color:a.color||ASSET_PALETTE[0],val:a.shares*a.price}))},
              {title:"Por Sector",cId:"chartSectors",labels:sectorLabels,data:sectorData,colors:sectorColors,legend:sectorLabels.map((s,i)=>({label:s,color:sectorColors[i],val:sectorData[i]}))},
            ].map(c=>(
              <div key={c.cId} style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
                <div style={{padding:"16px 24px",borderBottom:`1px solid ${t.border}`}}>
                  <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>{c.title}</span>
                </div>
                <div style={{padding:"20px 24px"}}>
                  {chartReady&&c.data.length>0?(
                    <>
                      <div style={{display:"flex",justifyContent:"center",marginBottom:14}}>
                        <DonutChart canvasId={c.cId} labels={c.labels} data={c.data} colors={c.colors} total={totalCurrent} theme={theme}/>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:160,overflowY:"auto"}}>
                        {[...c.legend].sort((a,b)=>b.val-a.val).map(item=>{
                          const pct=totalCurrent>0?(item.val/totalCurrent*100):0;
                          return (
                            <div key={item.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'DM Mono',monospace",fontSize:12}}>
                              <div style={{display:"flex",alignItems:"center",gap:8}}>
                                <div style={{width:8,height:8,borderRadius:2,background:item.color,flexShrink:0,boxShadow:`0 0 5px ${item.color}88`}}/>
                                <span style={{color:t.muted2}}>{item.label}</span>
                              </div>
                              <div style={{display:"flex",gap:10}}>
                                <span style={{color:t.text,fontWeight:500}}>{pct.toFixed(1)}%</span>
                                <span style={{color:t.muted,fontSize:11,minWidth:75,textAlign:"right"}}>{fmt(item.val)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ):(
                    <div style={{textAlign:"center",padding:"40px 0",color:t.muted,fontSize:13,fontStyle:"italic"}}>
                      {chartReady?"Sin datos aún":"Cargando gráfica..."}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* PERFORMANCE */}
            <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:16,overflow:"hidden",boxShadow:`0 2px 12px ${t.shadow}`}}>
              <div style={{padding:"16px 24px",borderBottom:`1px solid ${t.border}`}}>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:15,fontWeight:700,color:t.text}}>Resumen de Rendimiento</span>
              </div>
              <div style={{padding:"8px 24px 20px"}}>
                {portfolio.length===0?(
                  <div style={{textAlign:"center",padding:"30px 0",color:t.muted,fontSize:13,fontStyle:"italic"}}>Agrega activos para ver el resumen</div>
                ):[
                  {label:"Capital Invertido",val:fmt(totalInvested),color:""},
                  {label:"Valor de Mercado",val:fmt(totalCurrent),color:""},
                  {label:"Ganancia / Pérdida",val:`${fmt(totalPnL)} (${fmtPct(totalPnLPct)})`,color:totalPnL>=0?t.positive:t.negative},
                  {label:"Mejor Posición",val:best?`${best.ticker} ${fmtPct(best.avgCost>0?(best.price-best.avgCost)/best.avgCost*100:0)}`:"-",color:t.positive},
                  {label:"Peor Posición",val:worst?`${worst.ticker} ${fmtPct(worst.avgCost>0?(worst.price-worst.avgCost)/worst.avgCost*100:0)}`:"-",color:worst&&worst.price<worst.avgCost?t.negative:t.positive},
                  {label:"Mayor Posición",val:biggest?`${biggest.ticker} — ${fmt(biggest.shares*biggest.price)}`:"-",color:""},
                  {label:"Número de Sectores",val:String([...new Set(portfolio.map(a=>a.sector))].length),color:""},
                ].map((row,i,arr)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<arr.length-1?`1px solid ${t.border}`:"none"}}>
                    <span style={{fontSize:13,color:t.muted2,fontFamily:"'DM Sans',sans-serif"}}>{row.label}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:13,fontWeight:600,color:row.color||t.text}}>{row.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast.msg} visible={toast.visible} theme={theme}/>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;}
        ::-webkit-scrollbar{width:5px;height:5px;}
        ::-webkit-scrollbar-track{background:${t.bg};}
        ::-webkit-scrollbar-thumb{background:${t.border};border-radius:3px;}
        input[type=number]::-webkit-inner-spin-button{opacity:0.3;}
        select option{background:${t.card};color:${t.text};}
        @media(max-width:1100px){.dash-grid{grid-template-columns:1fr!important;}}
        @media(max-width:700px){.stat-grid{grid-template-columns:1fr 1fr!important;}}
      `}</style>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT APP — ROUTING
══════════════════════════════════════════════════════════ */
export default function App() {
  const [screen,setScreen]=useState("landing"); // landing | create | login | dashboard
  const [activePortfolio,setActivePortfolio]=useState(null); // {id, name}
  const [theme,setTheme]=useState(()=>localStorage.getItem("pfm_theme")||"light");

  useEffect(()=>{
    const link=document.createElement("link");
    link.rel="stylesheet";
    link.href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
    return ()=>document.head.removeChild(link);
  },[]);

  useEffect(()=>{
    const t=THEMES[theme];
    document.body.style.cssText=`margin:0;padding:0;background:${t.bg};color:${t.text};font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden;`;
    localStorage.setItem("pfm_theme",theme);
  },[theme]);

  const toggleTheme=()=>setTheme(t=>t==="light"?"dark":"light");

  const handleAuthSuccess=(id,name)=>{
    setActivePortfolio({id,name});
    setScreen("dashboard");
  };

  const handleLogout=()=>{
    setActivePortfolio(null);
    setScreen("landing");
  };

  if(screen==="landing") return <LandingScreen onNew={()=>setScreen("create")} onLogin={()=>setScreen("login")} theme={theme} toggleTheme={toggleTheme}/>;
  if(screen==="create") return <AuthScreen mode="create" onSuccess={handleAuthSuccess} onBack={()=>setScreen("landing")} theme={theme}/>;
  if(screen==="login") return <AuthScreen mode="login" onSuccess={handleAuthSuccess} onBack={()=>setScreen("landing")} theme={theme}/>;
  if(screen==="dashboard"&&activePortfolio) return <Dashboard portfolioId={activePortfolio.id} portfolioName={activePortfolio.name} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}/>;
  return null;
}
