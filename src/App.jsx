import { useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --bg: #f0f4f8;
    --bg2: #e4eaf2;
    --bg3: #d8e0ed;
    --border: #c2cfe0;
    --accent: #c9a84c;
    --accent2: #1a4fa0;
    --red: #c0392b;
    --gold: #c9a84c;
    --text: #0f1c2e;
    --muted: #6b7f99;
    --muted2: #4a607a;
    --card: #ffffff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,79,160,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,79,160,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }
  .container { max-width: 1400px; margin: 0 auto; padding: 0 24px; position: relative; z-index: 1; }
  header {
    border-bottom: 1px solid var(--border);
    padding: 20px 0;
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(240,244,248,0.95);
  }
  header .container { display: flex; align-items: center; justify-content: space-between; }
  .logo {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    color: var(--accent);
    letter-spacing: -0.5px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .logo-icon {
    width: 32px; height: 32px;
    background: var(--accent);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .header-date { font-family: 'DM Mono', monospace; font-size: 12px; color: var(--muted); }
  .main-stats {
    padding: 40px 0 32px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 16px;
  }
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s;
  }
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--accent), transparent);
  }
  .stat-card:hover { border-color: rgba(201,168,76,0.5); }
  .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 10px; }
  .stat-value { font-family: 'DM Mono', monospace; font-size: 28px; font-weight: 500; color: var(--text); line-height: 1; }
  .stat-sub { font-size: 12px; margin-top: 8px; font-family: 'DM Mono', monospace; }
  .positive { color: var(--accent); }
  .negative { color: var(--red); }
  .main-layout { display: grid; grid-template-columns: 1fr 400px; gap: 24px; padding-bottom: 40px; }
  .left-col { display: flex; flex-direction: column; gap: 24px; }
  .right-col { display: flex; flex-direction: column; gap: 24px; }
  .section-card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .section-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .section-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--text); }
  .add-form {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    align-items: end;
  }
  .form-group { display: flex; flex-direction: column; gap: 6px; }
  .form-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); font-family: 'DM Mono', monospace; }
  .form-input, .form-select {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
    width: 100%;
  }
  .form-input:focus, .form-select:focus { border-color: var(--accent); }
  .form-select option { background: var(--bg3); }
  .btn-add {
    background: var(--accent2);
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 20px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s;
    align-self: end;
    height: 40px;
  }
  .btn-add:hover { background: #143d80; transform: translateY(-1px); }
  .portfolio-table { width: 100%; border-collapse: collapse; }
  .portfolio-table th {
    padding: 12px 16px;
    text-align: left;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: var(--muted);
    font-family: 'DM Mono', monospace;
    font-weight: 400;
    border-bottom: 1px solid var(--border);
    background: var(--bg2);
  }
  .portfolio-table td {
    padding: 14px 16px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    border-bottom: 1px solid rgba(30,37,53,0.5);
    vertical-align: middle;
  }
  .portfolio-table tr:hover td { background: rgba(26,79,160,0.04); }
  .asset-name-cell { display: flex; align-items: center; gap: 10px; }
  .asset-logo { width: 32px; height: 32px; border-radius: 8px; object-fit: contain; background: #fff; padding: 2px; flex-shrink: 0; }
  .asset-logo-fallback {
    width: 32px; height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1a4fa0, #c9a84c);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  }
  .asset-ticker { color: var(--muted2); font-size: 11px; }
  .pct-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .pct-bar { height: 4px; border-radius: 2px; background: var(--accent); transition: width 0.5s ease; }
  .btn-delete { background: none; border: 1px solid var(--border); color: var(--muted); border-radius: 6px; padding: 4px 10px; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .btn-delete:hover { border-color: var(--red); color: var(--red); }
  .charts-section { padding: 24px; }
  .chart-wrap { position: relative; height: 260px; display: flex; align-items: center; justify-content: center; }
  .legend { display: flex; flex-direction: column; gap: 8px; padding: 0 4px; }
  .legend-item { display: flex; align-items: center; justify-content: space-between; font-family: 'DM Mono', monospace; font-size: 12px; }
  .legend-left { display: flex; align-items: center; gap: 8px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
  .legend-name { color: var(--muted2); }
  .legend-val { color: var(--text); font-weight: 500; }
  .sector-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-family: 'DM Mono', monospace;
    background: rgba(59,130,246,0.15);
    color: #93c5fd;
    border: 1px solid rgba(59,130,246,0.2);
  }
  .perf-section { padding: 20px 24px; }
  .perf-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(30,37,53,0.5); }
  .perf-label { font-size: 13px; color: var(--muted2); }
  .perf-val { font-family: 'DM Mono', monospace; font-size: 14px; font-weight: 500; }
  .empty-state { text-align: center; padding: 60px 24px; color: var(--muted); font-size: 14px; font-style: italic; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
  .toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--accent2);
    color: #fff;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    z-index: 9999;
    transform: translateY(80px);
    transition: transform 0.3s ease;
    pointer-events: none;
  }
  .toast.show { transform: translateY(0); }
  @media (max-width: 1100px) {
    .main-layout { grid-template-columns: 1fr; }
    .main-stats { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 600px) {
    .main-stats { grid-template-columns: 1fr; }
    .add-form { grid-template-columns: 1fr 1fr; }
    .stat-value { font-size: 22px; }
  }
`;

export default function App() {
  useEffect(() => {
    // Inject CSS
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // Inject Chart.js
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js";
    script.onload = () => initApp();
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  function initApp() {
    let portfolio = JSON.parse(localStorage.getItem("portfolio_v2") || "[]");
    let chartAssets = null;
    let chartSectors = null;

    const LOGO_MAP = {
      SPY:"https://logo.clearbit.com/ssga.com", QQQ:"https://logo.clearbit.com/invesco.com",
      IWM:"https://logo.clearbit.com/ishares.com", VTI:"https://logo.clearbit.com/vanguard.com",
      VOO:"https://logo.clearbit.com/vanguard.com", GLD:"https://logo.clearbit.com/spdrgoldshares.com",
      AAPL:"https://logo.clearbit.com/apple.com", MSFT:"https://logo.clearbit.com/microsoft.com",
      GOOGL:"https://logo.clearbit.com/google.com", GOOG:"https://logo.clearbit.com/google.com",
      META:"https://logo.clearbit.com/meta.com", AMZN:"https://logo.clearbit.com/amazon.com",
      NVDA:"https://logo.clearbit.com/nvidia.com", TSLA:"https://logo.clearbit.com/tesla.com",
      NFLX:"https://logo.clearbit.com/netflix.com", ADBE:"https://logo.clearbit.com/adobe.com",
      CRM:"https://logo.clearbit.com/salesforce.com", ORCL:"https://logo.clearbit.com/oracle.com",
      INTC:"https://logo.clearbit.com/intel.com", AMD:"https://logo.clearbit.com/amd.com",
      QCOM:"https://logo.clearbit.com/qualcomm.com", SNOW:"https://logo.clearbit.com/snowflake.com",
      UBER:"https://logo.clearbit.com/uber.com", SHOP:"https://logo.clearbit.com/shopify.com",
      SQ:"https://logo.clearbit.com/squareup.com", PYPL:"https://logo.clearbit.com/paypal.com",
      ZM:"https://logo.clearbit.com/zoom.us", JPM:"https://logo.clearbit.com/jpmorganchase.com",
      BAC:"https://logo.clearbit.com/bankofamerica.com", GS:"https://logo.clearbit.com/goldmansachs.com",
      MS:"https://logo.clearbit.com/morganstanley.com", WFC:"https://logo.clearbit.com/wellsfargo.com",
      V:"https://logo.clearbit.com/visa.com", MA:"https://logo.clearbit.com/mastercard.com",
      AXP:"https://logo.clearbit.com/americanexpress.com", JNJ:"https://logo.clearbit.com/jnj.com",
      PFE:"https://logo.clearbit.com/pfizer.com", UNH:"https://logo.clearbit.com/unitedhealthgroup.com",
      MRK:"https://logo.clearbit.com/merck.com", ABBV:"https://logo.clearbit.com/abbvie.com",
      LLY:"https://logo.clearbit.com/lilly.com", KO:"https://logo.clearbit.com/coca-cola.com",
      PEP:"https://logo.clearbit.com/pepsico.com", MCD:"https://logo.clearbit.com/mcdonalds.com",
      SBUX:"https://logo.clearbit.com/starbucks.com", NKE:"https://logo.clearbit.com/nike.com",
      WMT:"https://logo.clearbit.com/walmart.com", TGT:"https://logo.clearbit.com/target.com",
      COST:"https://logo.clearbit.com/costco.com", XOM:"https://logo.clearbit.com/exxonmobil.com",
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

    const SECTOR_COLORS = {
      "Tecnología":"#1a4fa0","Finanzas":"#c9a84c","Salud":"#2e6dd4","Consumo":"#b8922a",
      "Energía":"#c0392b","Industria":"#4a6fa5","Materiales":"#0d3580","Real Estate":"#a07820",
      "Servicios":"#3b7dd8","Cripto":"#d4a843","ETF":"#6b7f99","Otro":"#4a607a",
    };

    const PALETTE = [
      "#1a4fa0","#c9a84c","#2e6dd4","#b8922a","#4a90d9",
      "#d4a843","#6aaee0","#e8c46a","#0d3580","#a07820",
      "#3b7dd8","#c9a84c","#1a5cb8","#9a7225","#5490cc",
    ];

    const TICKER_NAMES = {
      AAPL:"Apple Inc.", MSFT:"Microsoft Corp.", GOOGL:"Alphabet Inc.", GOOG:"Alphabet Inc.",
      META:"Meta Platforms", AMZN:"Amazon.com", NVDA:"NVIDIA Corp.", TSLA:"Tesla Inc.",
      NFLX:"Netflix Inc.", ADBE:"Adobe Inc.", CRM:"Salesforce Inc.", ORCL:"Oracle Corp.",
      INTC:"Intel Corp.", AMD:"Advanced Micro Devices", QCOM:"Qualcomm Inc.",
      JPM:"JPMorgan Chase", BAC:"Bank of America", GS:"Goldman Sachs", MS:"Morgan Stanley",
      WFC:"Wells Fargo", V:"Visa Inc.", MA:"Mastercard Inc.", AXP:"American Express",
      JNJ:"Johnson & Johnson", PFE:"Pfizer Inc.", UNH:"UnitedHealth Group",
      KO:"Coca-Cola Co.", PEP:"PepsiCo Inc.", MCD:"McDonald's Corp.", SBUX:"Starbucks Corp.",
      NKE:"Nike Inc.", WMT:"Walmart Inc.", TGT:"Target Corp.", COST:"Costco Wholesale",
      XOM:"Exxon Mobil", CVX:"Chevron Corp.", SPY:"SPDR S&P 500 ETF", QQQ:"Invesco QQQ ETF",
      VTI:"Vanguard Total Market ETF", VOO:"Vanguard S&P 500 ETF",
      BTC:"Bitcoin", ETH:"Ethereum", BNB:"BNB", SOL:"Solana", ADA:"Cardano", XRP:"XRP",
      SNOW:"Snowflake Inc.", UBER:"Uber Technologies", SHOP:"Shopify Inc.",
      PYPL:"PayPal Holdings", SQ:"Block Inc.", ZM:"Zoom Video", LLY:"Eli Lilly & Co.",
      ABBV:"AbbVie Inc.", MRK:"Merck & Co.", LINK:"Chainlink", DOGE:"Dogecoin",
      AVAX:"Avalanche", MATIC:"Polygon", DOT:"Polkadot", GLD:"SPDR Gold Shares",
    };

    const TICKER_SECTORS = {
      AAPL:"Tecnología", MSFT:"Tecnología", GOOGL:"Tecnología", GOOG:"Tecnología",
      META:"Tecnología", AMZN:"Tecnología", NVDA:"Tecnología", TSLA:"Tecnología",
      NFLX:"Tecnología", ADBE:"Tecnología", CRM:"Tecnología", ORCL:"Tecnología",
      INTC:"Tecnología", AMD:"Tecnología", QCOM:"Tecnología", SNOW:"Tecnología",
      UBER:"Tecnología", SHOP:"Tecnología", PYPL:"Finanzas", SQ:"Finanzas", ZM:"Tecnología",
      JPM:"Finanzas", BAC:"Finanzas", GS:"Finanzas", MS:"Finanzas", WFC:"Finanzas",
      V:"Finanzas", MA:"Finanzas", AXP:"Finanzas",
      JNJ:"Salud", PFE:"Salud", UNH:"Salud", MRK:"Salud", ABBV:"Salud", LLY:"Salud",
      KO:"Consumo", PEP:"Consumo", MCD:"Consumo", SBUX:"Consumo", NKE:"Consumo",
      WMT:"Consumo", TGT:"Consumo", COST:"Consumo",
      XOM:"Energía", CVX:"Energía",
      SPY:"ETF", QQQ:"ETF", VTI:"ETF", VOO:"ETF", IWM:"ETF", GLD:"ETF",
      BTC:"Cripto", ETH:"Cripto", BNB:"Cripto", SOL:"Cripto", ADA:"Cripto",
      XRP:"Cripto", DOT:"Cripto", DOGE:"Cripto", AVAX:"Cripto", MATIC:"Cripto", LINK:"Cripto",
    };

    const fmt = (n) => new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2}).format(n);
    const fmtPct = (n) => (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
    const fmtNum = (n) => new Intl.NumberFormat("en-US",{maximumFractionDigits:4}).format(n);

    function logoHTML(ticker) {
      const url = LOGO_MAP[ticker.toUpperCase()];
      const t = ticker.toUpperCase().substring(0,3);
      if (url) {
        return `<img class="asset-logo" src="${url}" alt="${ticker}" onerror="this.style.display='none';this.nextSibling.style.display='flex';">
                <div class="asset-logo-fallback" style="display:none">${t}</div>`;
      }
      return `<div class="asset-logo-fallback">${t}</div>`;
    }

    function showToast(msg) {
      const t = document.getElementById("toast");
      t.textContent = msg;
      t.classList.add("show");
      setTimeout(() => t.classList.remove("show"), 2500);
    }

    function save() { localStorage.setItem("portfolio_v2", JSON.stringify(portfolio)); }

    window.addAsset = function() {
      const ticker = document.getElementById("inp-ticker").value.trim().toUpperCase();
      const name = document.getElementById("inp-name").value.trim();
      const sector = document.getElementById("inp-sector").value;
      const shares = parseFloat(document.getElementById("inp-shares").value);
      const avgCost = parseFloat(document.getElementById("inp-avgcost").value);
      const price = parseFloat(document.getElementById("inp-price").value);
      if (!ticker || !name || isNaN(shares) || isNaN(avgCost) || isNaN(price)) { showToast("⚠️ Completa todos los campos"); return; }
      if (portfolio.find(a => a.ticker === ticker)) { showToast("⚠️ Ese ticker ya existe."); return; }
      portfolio.push({ id: Date.now(), ticker, name, sector, shares, avgCost, price });
      save(); render();
      ["inp-ticker","inp-name","inp-shares","inp-avgcost","inp-price"].forEach(id => document.getElementById(id).value = "");
      showToast(`✅ ${ticker} agregado`);
    };

    window.deleteAsset = function(id) {
      portfolio = portfolio.filter(a => a.id !== id);
      save(); render();
      showToast("🗑 Activo eliminado");
    };

    function render() {
      const totalInvested = portfolio.reduce((s,a) => s + a.shares * a.avgCost, 0);
      const totalCurrent = portfolio.reduce((s,a) => s + a.shares * a.price, 0);
      const totalPnL = totalCurrent - totalInvested;
      const totalPnLPct = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

      document.getElementById("totalInvested").textContent = fmt(totalInvested);
      document.getElementById("totalCurrent").textContent = fmt(totalCurrent);
      document.getElementById("totalPnL").textContent = fmt(totalPnL);
      document.getElementById("totalPnL").className = "stat-value " + (totalPnL >= 0 ? "positive" : "negative");
      document.getElementById("totalPnLPct").textContent = fmtPct(totalPnLPct);
      document.getElementById("totalPnLPct").className = "stat-sub " + (totalPnLPct >= 0 ? "positive" : "negative");
      document.getElementById("totalPctChange").textContent = totalInvested > 0 ? `Rendimiento: ${fmtPct(totalPnLPct)}` : "—";
      document.getElementById("totalPositions").textContent = portfolio.length;
      const sectors = [...new Set(portfolio.map(a=>a.sector))];
      document.getElementById("sectorCount").textContent = sectors.length + " sector" + (sectors.length !== 1 ? "es" : "");

      const tbody = document.getElementById("assetTableBody");
      if (portfolio.length === 0) {
        tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state">Agrega tu primer activo para comenzar</div></td></tr>`;
      } else {
        tbody.innerHTML = portfolio.map((a, idx) => {
          const invested = a.shares * a.avgCost;
          const current = a.shares * a.price;
          const pnl = current - invested;
          const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
          const portPct = totalCurrent > 0 ? (current / totalCurrent) * 100 : 0;
          const color = PALETTE[idx % PALETTE.length];
          const sc = SECTOR_COLORS[a.sector] || "#4a607a";
          return `<tr>
            <td><div class="asset-name-cell">${logoHTML(a.ticker)}<div><div style="font-weight:500;color:var(--text)">${a.ticker}</div><div class="asset-ticker">${a.name}</div></div></div></td>
            <td><span class="sector-badge" style="background:${sc}22;color:${sc};border-color:${sc}44">${a.sector}</span></td>
            <td>${fmtNum(a.shares)}</td>
            <td>${fmt(a.avgCost)}</td>
            <td>${fmt(a.price)}</td>
            <td>${fmt(invested)}</td>
            <td>${fmt(current)}</td>
            <td class="${pnl >= 0 ? "positive" : "negative"}">${fmt(pnl)}</td>
            <td class="${pnlPct >= 0 ? "positive" : "negative"}">${fmtPct(pnlPct)}</td>
            <td><div class="pct-bar-wrap"><div class="pct-bar" style="width:${portPct*1.2}px;max-width:60px;background:${color}"></div><span>${portPct.toFixed(1)}%</span></div></td>
            <td><button class="btn-delete" onclick="deleteAsset(${a.id})">✕</button></td>
          </tr>`;
        }).join("");
      }
      renderCharts(totalCurrent);
      renderPerf(totalInvested, totalCurrent, totalPnL, totalPnLPct);
    }

    function renderCharts(totalCurrent) {
      const assetLabels = portfolio.map(a => a.ticker);
      const assetData = portfolio.map(a => a.shares * a.price);
      const assetColors = portfolio.map((_, i) => PALETTE[i % PALETTE.length]);
      if (chartAssets) chartAssets.destroy();
      chartAssets = new window.Chart(document.getElementById("chartAssets"), {
        type: "doughnut",
        data: { labels: assetLabels, datasets: [{ data: assetData, backgroundColor: assetColors, borderColor: "#f0f4f8", borderWidth: 3, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: true, cutout: "68%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${fmt(ctx.raw)} (${totalCurrent > 0 ? (ctx.raw/totalCurrent*100).toFixed(1) : 0}%)` }, backgroundColor: "#ffffff", borderColor: "#c2cfe0", borderWidth: 1, titleColor: "#0f1c2e", bodyColor: "#4a607a", padding: 12 } } }
      });
      document.getElementById("legendAssets").innerHTML = portfolio.map((a,i) => {
        const val = a.shares * a.price;
        const pct = totalCurrent > 0 ? (val/totalCurrent*100).toFixed(1) : "0.0";
        return `<div class="legend-item"><div class="legend-left"><div class="legend-dot" style="background:${assetColors[i]}"></div><span class="legend-name">${a.ticker}</span></div><div style="display:flex;gap:12px"><span class="legend-val">${pct}%</span><span style="color:var(--muted);font-size:11px;min-width:80px;text-align:right">${fmt(val)}</span></div></div>`;
      }).join("") || '<div style="text-align:center;color:var(--muted);font-size:12px;padding:10px">Sin datos</div>';

      const sectorMap = {};
      portfolio.forEach(a => { const val = a.shares * a.price; sectorMap[a.sector] = (sectorMap[a.sector]||0) + val; });
      const sectorLabels = Object.keys(sectorMap);
      const sectorData = Object.values(sectorMap);
      const sectorColors = sectorLabels.map(s => SECTOR_COLORS[s] || "#94a3b8");
      if (chartSectors) chartSectors.destroy();
      chartSectors = new window.Chart(document.getElementById("chartSectors"), {
        type: "doughnut",
        data: { labels: sectorLabels, datasets: [{ data: sectorData, backgroundColor: sectorColors, borderColor: "#f0f4f8", borderWidth: 3, hoverOffset: 8 }] },
        options: { responsive: true, maintainAspectRatio: true, cutout: "68%", plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => ` ${ctx.label}: ${fmt(ctx.raw)} (${totalCurrent > 0 ? (ctx.raw/totalCurrent*100).toFixed(1) : 0}%)` }, backgroundColor: "#ffffff", borderColor: "#c2cfe0", borderWidth: 1, titleColor: "#0f1c2e", bodyColor: "#4a607a", padding: 12 } } }
      });
      document.getElementById("legendSectors").innerHTML = sectorLabels.map((s,i) => {
        const val = sectorData[i];
        const pct = totalCurrent > 0 ? (val/totalCurrent*100).toFixed(1) : "0.0";
        return `<div class="legend-item"><div class="legend-left"><div class="legend-dot" style="background:${sectorColors[i]}"></div><span class="legend-name">${s}</span></div><div style="display:flex;gap:12px"><span class="legend-val">${pct}%</span><span style="color:var(--muted);font-size:11px;min-width:80px;text-align:right">${fmt(val)}</span></div></div>`;
      }).join("") || '<div style="text-align:center;color:var(--muted);font-size:12px;padding:10px">Sin datos</div>';
    }

    function renderPerf(totalInvested, totalCurrent, totalPnL, totalPnLPct) {
      if (portfolio.length === 0) {
        document.getElementById("perfSection").innerHTML = `<div style="text-align:center;padding:30px;color:var(--muted);font-size:13px;font-style:italic">Agrega activos para ver el resumen</div>`;
        return;
      }
      const best = portfolio.reduce((b,a) => ((a.price-a.avgCost)/a.avgCost) > ((b.price-b.avgCost)/b.avgCost) ? a : b);
      const worst = portfolio.reduce((w,a) => ((a.price-a.avgCost)/a.avgCost) < ((w.price-w.avgCost)/w.avgCost) ? a : w);
      const biggest = portfolio.reduce((b,a) => (a.shares*a.price > b.shares*b.price) ? a : b);
      const bestPct = best.avgCost > 0 ? ((best.price-best.avgCost)/best.avgCost)*100 : 0;
      const worstPct = worst.avgCost > 0 ? ((worst.price-worst.avgCost)/worst.avgCost)*100 : 0;
      document.getElementById("perfSection").innerHTML = `
        <div class="perf-row"><span class="perf-label">Capital Invertido</span><span class="perf-val">${fmt(totalInvested)}</span></div>
        <div class="perf-row"><span class="perf-label">Valor de Mercado</span><span class="perf-val">${fmt(totalCurrent)}</span></div>
        <div class="perf-row"><span class="perf-label">Ganancia / Pérdida Neta</span><span class="perf-val ${totalPnL>=0?"positive":"negative"}">${fmt(totalPnL)} (${fmtPct(totalPnLPct)})</span></div>
        <div class="perf-row"><span class="perf-label">Mejor Posición</span><span class="perf-val positive">${best.ticker} ${fmtPct(bestPct)}</span></div>
        <div class="perf-row"><span class="perf-label">Peor Posición</span><span class="perf-val ${worstPct>=0?"positive":"negative"}">${worst.ticker} ${fmtPct(worstPct)}</span></div>
        <div class="perf-row"><span class="perf-label">Mayor Posición</span><span class="perf-val">${biggest.ticker} — ${fmt(biggest.shares*biggest.price)}</span></div>
        <div class="perf-row" style="border:none"><span class="perf-label">Número de Sectores</span><span class="perf-val">${[...new Set(portfolio.map(a=>a.sector))].length}</span></div>`;
    }

    // Date
    document.getElementById("dateDisplay").textContent = new Date().toLocaleDateString("es-CO", {weekday:"long",year:"numeric",month:"long",day:"numeric"});

    // Ticker autofill
    document.getElementById("inp-ticker").addEventListener("blur", function() {
      const t = this.value.trim().toUpperCase();
      if (TICKER_NAMES[t] && !document.getElementById("inp-name").value) document.getElementById("inp-name").value = TICKER_NAMES[t];
      if (TICKER_SECTORS[t]) document.getElementById("inp-sector").value = TICKER_SECTORS[t];
    });
    document.getElementById("inp-ticker").addEventListener("keydown", e => { if (e.key === "Enter") window.addAsset(); });

    render();
  }

  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <div className="logo-icon">📊</div>
            Portfolio<span style={{color:"var(--muted2)"}}>Manager</span>
          </div>
          <div className="header-date" id="dateDisplay"></div>
        </div>
      </header>

      <div className="container">
        <div className="main-stats">
          {[
            {label:"Valor Invertido", id:"totalInvested", val:"$0.00", sub:"Capital base", subId:""},
            {label:"Valor Actual", id:"totalCurrent", val:"$0.00", sub:"—", subId:"totalPctChange"},
            {label:"Ganancia / Pérdida", id:"totalPnL", val:"$0.00", sub:"—", subId:"totalPnLPct"},
            {label:"Posiciones", id:"totalPositions", val:"0", sub:"—", subId:"sectorCount"},
          ].map(c => (
            <div className="stat-card" key={c.id}>
              <div className="stat-label">{c.label}</div>
              <div className="stat-value" id={c.id}>{c.val}</div>
              <div className="stat-sub" id={c.subId || undefined} style={{color:"var(--muted)"}}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="main-layout">
          <div className="left-col">
            <div className="section-card">
              <div className="section-header">
                <div className="section-title">Mis Activos</div>
                <span style={{fontSize:"12px",color:"var(--muted)",fontFamily:"'DM Mono',monospace"}}>Haz clic en una fila para editar</span>
              </div>
              <div className="add-form">
                {[
                  {id:"inp-ticker", label:"Ticker", placeholder:"AAPL", extra:{style:{textTransform:"uppercase"}}},
                  {id:"inp-name", label:"Nombre", placeholder:"Apple Inc."},
                ].map(f => (
                  <div className="form-group" key={f.id}>
                    <label className="form-label">{f.label}</label>
                    <input className="form-input" id={f.id} placeholder={f.placeholder} {...(f.extra||{})} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Sector</label>
                  <select className="form-select" id="inp-sector">
                    {["Tecnología","Finanzas","Salud","Consumo","Energía","Industria","Materiales","Real Estate","Servicios","Cripto","ETF","Otro"].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Acciones</label>
                  <input className="form-input" id="inp-shares" type="number" placeholder="10" min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Costo Prom. ($)</label>
                  <input className="form-input" id="inp-avgcost" type="number" placeholder="150.00" min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Precio Actual ($)</label>
                  <input className="form-input" id="inp-price" type="number" placeholder="175.00" min="0" />
                </div>
                <button className="btn-add" onClick={() => window.addAsset()}>+ Agregar</button>
              </div>
              <div style={{overflowX:"auto"}}>
                <table className="portfolio-table">
                  <thead>
                    <tr>
                      {["Activo","Sector","Acciones","Costo Prom","Precio Act.","Invertido","Valor Act.","G/P","G/P %","% Port.",""].map((h,i) => <th key={i}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody id="assetTableBody">
                    <tr><td colSpan={11}><div className="empty-state">Agrega tu primer activo para comenzar</div></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="right-col">
            {[
              {title:"Por Activo", chartId:"chartAssets", legendId:"legendAssets"},
              {title:"Por Sector", chartId:"chartSectors", legendId:"legendSectors"},
            ].map(c => (
              <div className="section-card" key={c.chartId}>
                <div className="section-header"><div className="section-title">{c.title}</div></div>
                <div className="charts-section">
                  <div className="chart-wrap"><canvas id={c.chartId}></canvas></div>
                  <div className="legend" id={c.legendId}></div>
                </div>
              </div>
            ))}
            <div className="section-card">
              <div className="section-header"><div className="section-title">Resumen de Rendimiento</div></div>
              <div className="perf-section" id="perfSection">
                <div style={{textAlign:"center",padding:"30px",color:"var(--muted)",fontSize:"13px",fontStyle:"italic"}}>Agrega activos para ver el resumen</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="toast" id="toast"></div>
    </div>
  );
}
