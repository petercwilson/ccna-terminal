import { useState, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Orbitron:wght@700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a0a0a; }
  .app { min-height: 100vh; background: #0a0a0a; color: #00ff41; font-family: 'Fira Code', monospace; font-size: 15px; line-height: 1.6; }
  .scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 100; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px); }
  .crt-glow { position: fixed; inset: 0; pointer-events: none; z-index: 99; box-shadow: inset 0 0 120px rgba(0,255,65,0.05); }
  .header { border-bottom: 1px solid #00ff4133; padding: 14px 24px; display: flex; align-items: center; gap: 16px; background: rgba(0,255,65,0.03); flex-wrap: wrap; }
  .logo { font-family: 'Orbitron', sans-serif; font-size: 22px; color: #00ff41; text-shadow: 0 0 10px #00ff41, 0 0 20px #00ff4166; letter-spacing: 4px; }
  .header-tag { font-size: 13px; color: #00ff4166; border: 1px solid #00ff4133; padding: 3px 10px; animation: blink 2s step-end infinite; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .nav { display: flex; gap: 4px; padding: 10px 24px; border-bottom: 1px solid #00ff4122; flex-wrap: wrap; }
  .nav-btn { background: transparent; border: 1px solid #00ff4144; color: #00ff4199; font-family: 'Fira Code', monospace; font-size: 13px; padding: 7px 16px; cursor: pointer; transition: all 0.15s; }
  .nav-btn:hover, .nav-btn.active { background: rgba(0,255,65,0.1); border-color: #00ff41; color: #00ff41; text-shadow: 0 0 8px #00ff41; box-shadow: 0 0 12px rgba(0,255,65,0.2); }
  .main { padding: 22px 24px; max-width: 1100px; margin: 0 auto; }
  .btn { background: transparent; border: 1px solid #00ff41; color: #00ff41; font-family: 'Fira Code', monospace; font-size: 13px; padding: 8px 20px; cursor: pointer; transition: all 0.15s; }
  .btn:hover { background: rgba(0,255,65,0.15); text-shadow: 0 0 8px #00ff41; box-shadow: 0 0 16px rgba(0,255,65,0.25); }
  .btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-danger { border-color: #ff3333; color: #ff3333; }
  .btn-danger:hover { background: rgba(255,51,51,0.15); }
  .btn-warn { border-color: #ffaa00; color: #ffaa00; }
  .btn-info { border-color: #00ccff; color: #00ccff; }
  .btn-info:hover { background: rgba(0,204,255,0.1); }

  .mod-tabs { display: flex; gap: 0; margin-bottom: 0; border-bottom: 1px solid #00ff4133; flex-wrap: wrap; }
  .mod-tab { background: transparent; border: 1px solid #00ff4122; border-bottom: none; color: #00ff4177; font-family: 'Fira Code', monospace; font-size: 13px; padding: 8px 18px; cursor: pointer; transition: all 0.15s; margin-right: 4px; }
  .mod-tab:hover { color: #00ff41; border-color: #00ff4166; }
  .mod-tab.active { background: rgba(0,255,65,0.06); border-color: #00ff41; color: #00ff41; text-shadow: 0 0 6px #00ff4166; }
  .mod-content { border: 1px solid #00ff4133; border-top: none; padding: 22px; background: rgba(0,255,65,0.01); }

  .home-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 14px; margin-top: 8px; }
  .module-card { border: 1px solid #00ff4133; padding: 20px; cursor: pointer; transition: all 0.2s; background: rgba(0,255,65,0.02); position: relative; overflow: hidden; }
  .module-card::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: #00ff41; transform: scaleX(0); transition: transform 0.2s; }
  .module-card:hover { border-color: #00ff41; background: rgba(0,255,65,0.06); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,255,65,0.1); }
  .module-card:hover::after { transform: scaleX(1); }
  .module-icon { font-size: 30px; margin-bottom: 10px; }
  .module-title { font-family: 'Orbitron', sans-serif; font-size: 14px; color: #00ff41; text-shadow: 0 0 8px #00ff4166; margin-bottom: 7px; letter-spacing: 1px; }
  .module-desc { font-size: 13px; color: #00ff41aa; line-height: 1.65; }
  .module-tag { margin-top: 12px; font-size: 11px; color: #00ff4166; border: 1px solid #00ff4133; display: inline-block; padding: 3px 9px; }

  .teach-h1 { font-family: 'Orbitron', sans-serif; font-size: 16px; color: #00ff41; text-shadow: 0 0 8px #00ff4166; letter-spacing: 2px; margin-bottom: 12px; }
  .teach-h2 { font-size: 12px; color: #00ff41bb; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; border-left: 3px solid #00ff41; padding-left: 10px; margin-top: 20px; font-weight: 500; }
  .teach-p { font-size: 14px; color: #00ff41cc; line-height: 1.85; margin-bottom: 12px; }
  .teach-code { font-family: 'Fira Code', monospace; background: rgba(0,255,65,0.07); border: 1px solid #00ff4133; padding: 12px 16px; font-size: 13px; color: #00ff41dd; line-height: 1.85; margin: 12px 0; white-space: pre; overflow-x: auto; }
  .teach-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
  .teach-table th { border: 1px solid #00ff4144; padding: 9px 12px; color: #00ff41bb; text-align: left; font-weight: 500; background: rgba(0,255,65,0.05); }
  .teach-table td { border: 1px solid #00ff4122; padding: 9px 12px; color: #00ff41bb; }
  .teach-table tr:hover td { background: rgba(0,255,65,0.04); color: #00ff41; }
  .teach-tip { border: 1px solid #ffaa0055; background: rgba(255,170,0,0.05); padding: 12px 16px; font-size: 13px; color: #ffaa00cc; line-height: 1.8; margin: 12px 0; }
  .teach-tip::before { content: '⚡ EXAM TIP: '; color: #ffaa00; font-weight: 500; }
  .teach-info { border: 1px solid #00ccff44; background: rgba(0,204,255,0.04); padding: 12px 16px; font-size: 13px; color: #00ccffcc; line-height: 1.8; margin: 12px 0; }
  .teach-info::before { content: 'ℹ KEY CONCEPT: '; color: #00ccff; font-weight: 500; }
  .teach-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 12px 0; }
  .teach-cols-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin: 12px 0; }
  .teach-card { border: 1px solid #00ff4133; padding: 14px; background: rgba(0,255,65,0.02); }
  .teach-card-title { font-size: 12px; color: #00ff41; letter-spacing: 1px; margin-bottom: 8px; text-transform: uppercase; font-weight: 500; }
  .teach-card-body { font-size: 13px; color: #00ff41aa; line-height: 1.75; }
  .cheatsheet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin: 12px 0; }
  .cheatsheet-item { border: 1px solid #00ff4133; padding: 10px 12px; background: rgba(0,255,65,0.03); }
  .cheatsheet-key { font-size: 16px; color: #00ff41; text-shadow: 0 0 6px #00ff4166; font-weight: 500; }
  .cheatsheet-val { font-size: 12px; color: #00ff41aa; margin-top: 3px; }
  .scroll-area { max-height: 560px; overflow-y: auto; padding-right: 6px; }
  .scroll-area::-webkit-scrollbar { width: 4px; }
  .scroll-area::-webkit-scrollbar-thumb { background: #00ff4133; }

  .subnet-display { font-family: 'Fira Code', monospace; font-size: 28px; font-weight: 500; color: #00ff41; text-shadow: 0 0 15px #00ff41; letter-spacing: 3px; text-align: center; padding: 18px; border: 1px solid #00ff4133; background: rgba(0,255,65,0.03); margin: 14px 0; }
  .answer-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 12px; }
  .answer-btn { background: transparent; border: 1px solid #00ff4144; color: #00ff41cc; font-family: 'Fira Code', monospace; font-size: 14px; padding: 12px 14px; cursor: pointer; transition: all 0.15s; text-align: left; line-height: 1.4; }
  .answer-btn:hover { background: rgba(0,255,65,0.1); border-color: #00ff41; color: #00ff41; }
  .answer-btn.correct { background: rgba(0,255,65,0.2); border-color: #00ff41; color: #00ff41; }
  .answer-btn.wrong { background: rgba(255,51,51,0.15); border-color: #ff3333; color: #ff6666; }
  .feedback { margin-top: 12px; padding: 14px; font-size: 14px; line-height: 1.8; }
  .feedback.ok { border: 1px solid #00ff4166; color: #00ff41cc; background: rgba(0,255,65,0.05); }
  .feedback.bad { border: 1px solid #ff333366; color: #ff8888; background: rgba(255,51,51,0.05); }
  .progress-bar { height: 3px; background: #00ff4122; margin: 12px 0; }
  .progress-fill { height: 100%; background: #00ff41; box-shadow: 0 0 8px #00ff41; transition: width 0.3s; }
  .stat-row { display: flex; gap: 10px; margin: 12px 0; }
  .stat { border: 1px solid #00ff4133; padding: 8px 14px; text-align: center; flex: 1; background: rgba(0,255,65,0.02); }
  .stat-val { font-family: 'Orbitron', sans-serif; font-size: 22px; color: #00ff41; text-shadow: 0 0 10px #00ff4166; }
  .stat-label { font-size: 11px; color: #00ff4166; margin-top: 3px; }
  .result-screen { text-align: center; padding: 40px 20px; }
  .result-score { font-family: 'Orbitron', sans-serif; font-size: 56px; color: #00ff41; text-shadow: 0 0 30px #00ff41, 0 0 60px #00ff4166; line-height: 1; }

  .topo-canvas { border: 1px solid #00ff4133; background: rgba(0,0,0,0.5); position: relative; height: 360px; overflow: hidden; }
  .device-node { position: absolute; width: 70px; text-align: center; cursor: grab; user-select: none; }
  .device-node:active { cursor: grabbing; }
  .device-icon { width: 46px; height: 46px; border: 2px solid #00ff4166; background: rgba(0,255,65,0.08); display: flex; align-items: center; justify-content: center; font-size: 20px; margin: 0 auto 4px; transition: all 0.15s; }
  .device-node:hover .device-icon, .device-node.selected .device-icon { border-color: #00ff41; background: rgba(0,255,65,0.2); box-shadow: 0 0 12px rgba(0,255,65,0.4); }
  .device-label { font-size: 11px; color: #00ff41aa; }
  .topo-device-pick { border: 1px solid #00ff4133; padding: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-size: 13px; color: #00ff41aa; transition: all 0.15s; background: transparent; font-family: 'Fira Code', monospace; width: 100%; text-align: left; margin-bottom: 4px; }
  .topo-device-pick:hover { border-color: #00ff41; color: #00ff41; background: rgba(0,255,65,0.06); }
  .connection-svg { position: absolute; inset: 0; pointer-events: none; width: 100%; height: 100%; }

  .drag-zone { min-height: 70px; border: 1px dashed #00ff4144; padding: 10px; display: flex; flex-wrap: wrap; gap: 8px; align-items: flex-start; transition: all 0.2s; background: rgba(0,255,65,0.01); }
  .drag-zone.over { border-color: #00ff41; background: rgba(0,255,65,0.06); }
  .drag-chip { border: 1px solid #00ff4166; padding: 6px 12px; font-size: 13px; cursor: grab; background: rgba(0,255,65,0.08); color: #00ff41cc; user-select: none; transition: all 0.15s; font-family: 'Fira Code', monospace; }
  .drag-chip:hover { border-color: #00ff41; color: #00ff41; box-shadow: 0 0 8px rgba(0,255,65,0.3); }

  .routing-table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 12px 0; }
  .routing-table th { border: 1px solid #00ff4144; padding: 9px 12px; color: #00ff41bb; text-align: left; font-weight: 500; background: rgba(0,255,65,0.05); }
  .routing-table td { border: 1px solid #00ff4122; padding: 9px 12px; color: #00ff41bb; }
  .routing-table tr:hover td { background: rgba(0,255,65,0.04); color: #00ff41; }
  .highlighted-row td { color: #00ff41 !important; background: rgba(0,255,65,0.08) !important; }
  .terminal-line { font-size: 14px; color: #00ff41aa; line-height: 1.9; }
  .terminal-line .prompt { color: #00ff41; margin-right: 10px; }
  @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:1} 93%{opacity:0.7} 94%{opacity:1} }
  .flicker { animation: flicker 5s infinite; }
  @media(max-width:600px){ .teach-cols,.teach-cols-3{grid-template-columns:1fr} .answer-grid{grid-template-columns:1fr} }

  /* ── MAGIC NUMBER CALCULATOR ── */
  .magic-input-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
  .magic-input { background: rgba(0,255,65,0.05); border: 1px solid #00ff4166; color: #00ff41; font-family: 'Fira Code', monospace; font-size: 17px; padding: 9px 16px; outline: none; width: 230px; letter-spacing: 1px; }
  .magic-input:focus { border-color: #00ff41; box-shadow: 0 0 10px rgba(0,255,65,0.2); }
  .magic-input-slash { font-family: 'Fira Code', monospace; font-size: 22px; color: #00ff4166; }
  .magic-cidr-input { background: rgba(0,255,65,0.05); border: 1px solid #00ff4166; color: #00ff41; font-family: 'Fira Code', monospace; font-size: 17px; padding: 9px 10px; outline: none; width: 68px; text-align: center; }
  .magic-cidr-input:focus { border-color: #00ff41; box-shadow: 0 0 10px rgba(0,255,65,0.2); }

  .bit-grid { display: flex; gap: 3px; flex-wrap: nowrap; margin: 12px 0; overflow-x: auto; padding-bottom: 4px; }
  .bit-group { display: flex; gap: 2px; position: relative; }
  .bit-group + .bit-group { margin-left: 8px; }
  .bit-cell { width: 32px; height: 44px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid; font-family: 'Fira Code', monospace; font-size: 14px; font-weight: 500; transition: all 0.2s; position: relative; flex-shrink: 0; }
  .bit-cell.net { border-color: #00ff4166; background: rgba(0,255,65,0.15); color: #00ff41; }
  .bit-cell.host { border-color: #00ccff44; background: rgba(0,204,255,0.08); color: #00ccff; }
  .bit-cell .bit-pos { font-size: 9px; opacity: 0.55; margin-top: 2px; }

  .octet-label { text-align: center; font-size: 11px; color: #00ff4166; letter-spacing: 1px; margin-top: 4px; }
  .octet-val { text-align: center; font-size: 16px; color: #00ff41; font-family: 'Fira Code', monospace; font-weight: 500; }
  .bit-legend { display: flex; gap: 20px; margin: 10px 0; }
  .bit-legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #00ff41aa; }
  .bit-legend-swatch { width: 16px; height: 16px; border: 1px solid; }

  .magic-results { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 10px; margin: 16px 0; }
  .magic-result-card { border: 1px solid #00ff4133; padding: 14px; background: rgba(0,255,65,0.02); }
  .magic-result-label { font-size: 11px; color: #00ff4166; letter-spacing: 2px; margin-bottom: 6px; text-transform: uppercase; }
  .magic-result-val { font-family: 'Fira Code', monospace; font-size: 17px; font-weight: 500; color: #00ff41; text-shadow: 0 0 8px #00ff4166; }
  .magic-result-sub { font-size: 12px; color: #00ff41aa; margin-top: 4px; }

  .block-row { display: flex; gap: 4px; flex-wrap: wrap; margin: 10px 0; }
  .block-item { border: 1px solid #00ff4133; padding: 4px 10px; font-size: 13px; color: #00ff41aa; background: rgba(0,255,65,0.03); transition: all 0.15s; }
  .block-item.current-block { border-color: #00ff41; background: rgba(0,255,65,0.15); color: #00ff41; text-shadow: 0 0 6px #00ff4166; font-weight: 500; }

  .step-box { border: 1px solid #00ff4133; background: rgba(0,255,65,0.02); padding: 16px; margin: 12px 0; }
  .step-box-title { font-size: 11px; color: #00ff4166; letter-spacing: 3px; margin-bottom: 12px; text-transform: uppercase; }
  .step-line { display: flex; align-items: baseline; gap: 12px; margin: 8px 0; font-size: 14px; }
  .step-num { font-family: 'Orbitron', sans-serif; font-size: 15px; color: #00ff4155; width: 22px; flex-shrink: 0; }
  .step-text { color: #00ff41bb; line-height: 1.75; }
  .step-highlight { color: #00ff41; font-weight: 500; }
  .step-calc { color: #ffaa00; }

  .magic-error { border: 1px solid #ff333366; background: rgba(255,51,51,0.05); padding: 12px 16px; font-size: 14px; color: #ff8888; margin: 12px 0; }
`;


// ── TEACHING CONTENT ─────────────────────────────────────────────────────────

function SubnetLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// SUBNETTING & IP ADDRESSING</div>
      <div className="teach-p">Subnetting divides a network into smaller segments. Each subnet shares the same network bits but has a unique host range. You borrow bits from the host portion to create subnets, reducing waste and improving security.</div>
      <div className="teach-info">An IP address is 32 bits written as 4 octets (e.g. 192.168.1.0). The subnet mask tells the router which bits are "network" and which are "host".</div>

      <div className="teach-h2">CIDR CHEAT SHEET</div>
      <div className="cheatsheet-grid">
        {[["/30","255.255.255.252","4 total","2 hosts"],["/29","255.255.255.248","8 total","6 hosts"],["/28","255.255.255.240","16 total","14 hosts"],["/27","255.255.255.224","32 total","30 hosts"],["/26","255.255.255.192","64 total","62 hosts"],["/25","255.255.255.128","128 total","126 hosts"],["/24","255.255.255.0","256 total","254 hosts"],["/23","255.255.254.0","512 total","510 hosts"],["/22","255.255.252.0","1024 total","1022 hosts"],["/16","255.255.0.0","65536 total","65534 hosts"],["/8","255.0.0.0","16M total","~16M hosts"]].map(([cidr,mask,total,hosts]) => (
          <div className="cheatsheet-item" key={cidr}>
            <div className="cheatsheet-key">{cidr}</div>
            <div className="cheatsheet-val">{mask}</div>
            <div className="cheatsheet-val" style={{color:"#00ff41"}}>{hosts}</div>
            <div className="cheatsheet-val">{total}</div>
          </div>
        ))}
      </div>

      <div className="teach-h2">THE 4-STEP METHOD</div>
      <div className="teach-code">{`GIVEN: 172.16.5.130/26

Step 1 — Subnet mask for /26 = 255.255.255.192
Step 2 — Block size = 256 - 192 = 64
Step 3 — Count blocks: 0, 64, 128, 192...
          130 falls in the 128 block
Step 4 — Network   = 172.16.5.128
          Broadcast = 172.16.5.191  (128 + 64 - 1)
          Hosts     = 172.16.5.129 → .190  (62 usable)`}</div>
      <div className="teach-tip">Magic number trick: 256 minus the interesting octet of the mask = block size. Count up in blocks until you pass your IP. Previous block = your network address.</div>

      <div className="teach-h2">IP ADDRESS CLASSES</div>
      <table className="teach-table">
        <thead><tr><th>Class</th><th>Range</th><th>Default Mask</th><th>Private Range</th></tr></thead>
        <tbody>
          {[["A","1–126","255.0.0.0 (/8)","10.0.0.0/8"],["B","128–191","255.255.0.0 (/16)","172.16.0.0/12"],["C","192–223","255.255.255.0 (/24)","192.168.0.0/16"],["D","224–239","N/A (Multicast)","—"],["E","240–255","N/A (Experimental)","—"]].map(r => <tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>

      <div className="teach-h2">SPECIAL ADDRESSES</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">LOOPBACK</div><div className="teach-card-body">127.0.0.0/8 — always refers to localhost. 127.0.0.1 used to test the TCP/IP stack on the local machine.</div></div>
        <div className="teach-card"><div className="teach-card-title">APIPA</div><div className="teach-card-body">169.254.0.0/16 — auto-assigned when DHCP fails. Not routable. Indicates a DHCP problem.</div></div>
        <div className="teach-card"><div className="teach-card-title">BROADCAST</div><div className="teach-card-body">255.255.255.255 — limited broadcast (local subnet only). Subnet broadcast = last address in the block.</div></div>
        <div className="teach-card"><div className="teach-card-title">NETWORK ADDRESS</div><div className="teach-card-body">First address in a block — identifies the subnet itself. Cannot be assigned to a host.</div></div>
      </div>

      <div className="teach-h2">SUBNETTING FORMULAS</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">SUBNETS CREATED</div><div className="teach-card-body">2^n where n = bits borrowed from host portion</div></div>
        <div className="teach-card"><div className="teach-card-title">HOSTS PER SUBNET</div><div className="teach-card-body">2^h − 2 where h = remaining host bits (−2 removes network & broadcast)</div></div>
      </div>
      <div className="teach-tip">Powers of 2 to memorize: 2¹=2, 2²=4, 2³=8, 2⁴=16, 2⁵=32, 2⁶=64, 2⁷=128, 2⁸=256, 2⁹=512, 2¹⁰=1024. You'll use these constantly on the exam.</div>
    </div>
  );
}

function RoutingLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// ROUTING PROTOCOLS & PATH SELECTION</div>
      <div className="teach-p">When a router receives a packet, it consults its routing table to find the best path. Route selection follows a strict priority: Longest Prefix Match → Administrative Distance → Metric. Understanding this order is critical for the CCNA exam.</div>

      <div className="teach-h2">ROUTE SELECTION PRIORITY</div>
      <div className="teach-code">{`Priority 1: LONGEST PREFIX MATCH (most specific always wins)
  /29 > /24 > /16 > /8 > /0 (default route)
  Destination 192.168.1.50:
    /29 → 192.168.1.48/29 ← WINS (most specific)
    /24 → 192.168.1.0/24
    /0  → 0.0.0.0/0 (last resort only)

Priority 2: ADMINISTRATIVE DISTANCE (if same prefix length)
  Lower AD = more trusted = preferred

Priority 3: METRIC (if same protocol)
  Lower metric = shorter/faster path`}</div>
      <div className="teach-info">Longest prefix match ALWAYS wins regardless of AD or metric. A specific /32 host route beats a /0 default route every time, even if the /0 is static (AD=1) and the /32 is RIP (AD=120).</div>

      <div className="teach-h2">ADMINISTRATIVE DISTANCE TABLE</div>
      <table className="teach-table">
        <thead><tr><th>Route Source</th><th>AD</th><th>Notes</th></tr></thead>
        <tbody>
          {[["Connected Interface",0,"Most trusted — you're directly attached"],["Static Route",1,"Near-maximum trust — manually configured"],["EIGRP Summary",5,"Auto-summarized EIGRP routes"],["External BGP (eBGP)",20,"Routes from other AS via BGP"],["EIGRP Internal",90,"EIGRP routes within same AS ← memorize"],["OSPF",110,"Most common on CCNA ← memorize"],["IS-IS",115,"Used in ISP networks"],["RIP",120,"Old distance-vector ← memorize"],["External EIGRP",170,"EIGRP redistributed routes"],["Internal BGP (iBGP)",200,"BGP within same AS"],["Unknown",255,"Not installed in routing table"]].map(([src,ad,note]) => (
            <tr key={src}><td>{src}</td><td style={{color:ad<=1?"#00ff41":ad<=90?"#00ccff":ad>=120?"#ffaa00":"#00ff41aa",fontFamily:"'Orbitron',sans-serif",fontSize:18}}>{ad}</td><td style={{color:"#00ff4166"}}>{note}</td></tr>
          ))}
        </tbody>
      </table>
      <div className="teach-tip">Must-memorize AD values: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120. These appear in almost every CCNA routing question.</div>

      <div className="teach-h2">OSPF vs EIGRP vs RIP COMPARISON</div>
      <div className="teach-cols-3">
        {[{n:"OSPF",t:"Link-State",m:"Cost (bandwidth)",ad:110,c:"Fast (~subsecond w/ BFD)",s:"Enterprise/Large",cmd:"router ospf 1\n network 10.0.0.0 0.255.255.255 area 0"},
          {n:"EIGRP",t:"Advanced D-V (Hybrid)",m:"BW + Delay + Load + Reliability",ad:90,c:"Very Fast (DUAL algo)",s:"Cisco-only, Large",cmd:"router eigrp 100\n network 10.0.0.0\n no auto-summary"},
          {n:"RIP v2",t:"Distance-Vector",m:"Hop count (max 15)",ad:120,c:"Slow (30s updates)",s:"Small/Legacy only",cmd:"router rip\n version 2\n network 10.0.0.0\n no auto-summary"}].map(p => (
          <div className="teach-card" key={p.n}>
            <div className="teach-card-title" style={{fontFamily:"'Orbitron',sans-serif",fontSize:18}}>{p.n}</div>
            <div className="teach-card-body">
              <div>Type: {p.t}</div>
              <div>Metric: {p.m}</div>
              <div>AD: <span style={{color:"#00ff41"}}>{p.ad}</span></div>
              <div>Conv: {p.c}</div>
            </div>
            <div className="teach-code" style={{marginTop:8,fontSize:10,padding:"6px 8px"}}>{p.cmd}</div>
          </div>
        ))}
      </div>

      <div className="teach-h2">READING A ROUTING TABLE</div>
      <div className="teach-code">{`R1# show ip route
Codes: C-connected, S-static, O-OSPF, D-EIGRP, R-RIP

C   192.168.1.0/24 is directly connected, GigabitEthernet0/0
S   0.0.0.0/0 [1/0] via 10.0.0.1
O   10.10.0.0/16 [110/2] via 10.0.0.2, 00:01:23, Gi0/1
D   172.16.0.0/12 [90/256640] via 10.0.0.3, Gi0/2
R   192.168.5.0/24 [120/1] via 10.0.0.4, 00:00:23, Gi0/3
         ^code  ^network   ^[AD/metric]  ^next-hop  ^interface`}</div>

      <div className="teach-h2">STATIC ROUTE CONFIGURATION</div>
      <div className="teach-code">{`! Standard static route
ip route 192.168.2.0 255.255.255.0 10.0.0.2

! Default route (gateway of last resort)
ip route 0.0.0.0 0.0.0.0 10.0.0.1

! Floating static (AD=150 loses to OSPF=110, acts as backup)
ip route 192.168.2.0 255.255.255.0 10.0.0.3 150

! Null route (blackhole — drop traffic, prevent routing loops)
ip route 10.0.0.0 255.0.0.0 Null0`}</div>
    </div>
  );
}

function TopoLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// NETWORK TOPOLOGY & DESIGN</div>
      <div className="teach-p">Network topology defines how devices connect physically and logically. The right topology affects performance, fault tolerance, and cost. Cisco's hierarchical model is the most tested design framework on the CCNA exam.</div>

      <div className="teach-h2">THE CISCO 3-TIER HIERARCHY</div>
      <div className="teach-code">{`┌──────────────────────────────────────────┐
│              CORE LAYER                  │
│  [Core-SW1] ←────────────→ [Core-SW2]   │  Fast backbone, NO filtering
└────────────┬───────────────────┬─────────┘
             │                   │
┌────────────┴────┐       ┌──────┴──────────┐
│ DISTRIBUTION    │       │ DISTRIBUTION     │
│ [Dist-SW1]      │       │ [Dist-SW2]       │  Routing, ACLs, policy
│ Inter-VLAN rtg  │       │ Inter-VLAN rtg   │
└────┬────────────┘       └──────────┬───────┘
     │                               │
┌────┴──────┐                 ┌──────┴────┐
│  ACCESS   │                 │  ACCESS   │
│ [Acc-SW1] │                 │ [Acc-SW2] │  End devices, VLANs, port sec
│ PCs/VoIP  │                 │ PCs/VoIP  │
└───────────┘                 └───────────┘`}</div>
      <div className="teach-cols-3">
        <div className="teach-card"><div className="teach-card-title">CORE LAYER</div><div className="teach-card-body">High-speed backbone. No packet manipulation. Just fast switching between distribution blocks. Never put ACLs here.</div></div>
        <div className="teach-card"><div className="teach-card-title">DISTRIBUTION LAYER</div><div className="teach-card-body">Routing between VLANs, applying ACLs, summarizing routes. Boundary between access and core. QoS policies applied here.</div></div>
        <div className="teach-card"><div className="teach-card-title">ACCESS LAYER</div><div className="teach-card-body">Where end devices connect. Port security, VLAN assignment, PoE for phones/APs. First STP domain. 802.1X auth.</div></div>
      </div>

      <div className="teach-h2">NETWORK DEVICES BY OSI LAYER</div>
      <table className="teach-table">
        <thead><tr><th>Device</th><th>OSI Layer</th><th>Forwarding Basis</th><th>Creates</th></tr></thead>
        <tbody>
          {[["Hub","L1 Physical","None (repeats signal)","1 collision domain, 1 broadcast domain"],["Switch","L2 Data Link","MAC address (CAM table)","Separate collision domains, 1 broadcast domain"],["Router","L3 Network","IP address (routing table)","Separate broadcast domains"],["L3 Switch","L2 + L3","MAC + IP","Separate broadcast domains (SVI routing)"],["Firewall","L3–L7","IP + port + stateful rules","Security zones"],["AP","L1–L2","Bridges 802.11 ↔ 802.3","Wireless collision domain"]].map(r => <tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td style={{color:"#00ff4166"}}>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">Routers break broadcast domains. Switches break collision domains. Hubs do neither. This distinction appears constantly on the CCNA exam.</div>

      <div className="teach-h2">CABLE TYPES</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">STRAIGHT-THROUGH</div><div className="teach-card-body">Connects unlike devices: PC↔Switch, Router↔Switch. Pins map 1:1. Most common cable type.</div></div>
        <div className="teach-card"><div className="teach-card-title">CROSSOVER</div><div className="teach-card-body">Connects like devices: Switch↔Switch, PC↔PC. Tx↔Rx crossed. Modern switches use Auto-MDIX so often not needed.</div></div>
        <div className="teach-card"><div className="teach-card-title">ROLLOVER / CONSOLE</div><div className="teach-card-body">PC COM port to device console port. Pin 1↔8, 2↔7 (fully reversed). Used for initial device configuration.</div></div>
        <div className="teach-card"><div className="teach-card-title">FIBER (SMF vs MMF)</div><div className="teach-card-body">SMF = single-mode, long distance, laser, yellow. MMF = multi-mode, shorter range, LED, orange/aqua. SFP slots on switches.</div></div>
      </div>

      <div className="teach-h2">TOPOLOGY TYPES OVERVIEW</div>
      <table className="teach-table">
        <thead><tr><th>Topology</th><th>Pros</th><th>Cons</th><th>Use Case</th></tr></thead>
        <tbody>
          {[["Star","Easy troubleshoot, scalable","Single PoF at center","Office LANs"],["Mesh (Full)","Max redundancy","Very expensive","WAN core"],["Mesh (Partial)","Balanced cost/redundancy","Complex","Enterprise WAN"],["Bus","Simple","Shared collision domain, legacy","Old Ethernet"],["Ring","Predictable latency","Full ring failure risk","SONET, FDDI"],["Spine-Leaf","Predictable latency, no STP","Higher cost","Data centers"]].map(r => <tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

function VlanLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// VLANs, STP & NETWORK SECURITY</div>
      <div className="teach-p">VLANs logically segment broadcast domains on a single physical switch. STP prevents Layer 2 loops. ACLs filter traffic at Layer 3. These three topics make up a huge portion of the CCNA switching and security domains.</div>

      <div className="teach-h2">VLAN CONFIGURATION</div>
      <div className="teach-code">{`! Create VLANs
Switch(config)# vlan 10
Switch(config-vlan)# name Finance
Switch(config)# vlan 20
Switch(config-vlan)# name Guest

! Access port — carries ONE VLAN, for end devices
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

! Trunk port — carries MULTIPLE VLANs, between switches/routers
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk encapsulation dot1q
Switch(config-if)# switchport trunk allowed vlan 10,20,99

! Native VLAN (untagged traffic on trunk)
Switch(config-if)# switchport trunk native vlan 99

! Verify
Switch# show vlan brief
Switch# show interfaces trunk`}</div>

      <table className="teach-table">
        <thead><tr><th>VLAN Range</th><th>Type</th><th>Notes</th></tr></thead>
        <tbody>
          {[["1","Default VLAN","All ports start here — never use for user traffic"],["2–1001","Normal range","Standard user VLANs — stored in flash:vlan.dat"],["1002–1005","Legacy","Reserved for Token Ring/FDDI — cannot be deleted"],["1006–4094","Extended","Requires VTP transparent mode — large environments"]].map(r => <tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">Best practice: Never use VLAN 1. Put user data on custom VLANs. Put unused ports in a "parking lot" VLAN (e.g. 999) with no routing. Change native VLAN to something other than 1.</div>

      <div className="teach-h2">INTER-VLAN ROUTING</div>
      <div className="teach-cols">
        <div className="teach-card">
          <div className="teach-card-title">ROUTER-ON-A-STICK</div>
          <div className="teach-card-body">One physical router port with sub-interfaces per VLAN. 802.1Q tags frames. Simple but can be a bottleneck.</div>
          <div className="teach-code" style={{fontSize:10,padding:"6px 8px",marginTop:6}}>{`interface gi0/0.10
 encapsulation dot1q 10
 ip address 192.168.10.1 255.255.255.0
interface gi0/0.20
 encapsulation dot1q 20
 ip address 192.168.20.1 255.255.255.0`}</div>
        </div>
        <div className="teach-card">
          <div className="teach-card-title">LAYER 3 SWITCH (SVIs)</div>
          <div className="teach-card-body">Switch Virtual Interfaces — routing done internally at wire speed. No external router needed. Preferred in modern networks.</div>
          <div className="teach-code" style={{fontSize:10,padding:"6px 8px",marginTop:6}}>{`ip routing
interface vlan 10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
interface vlan 20
 ip address 192.168.20.1 255.255.255.0
 no shutdown`}</div>
        </div>
      </div>

      <div className="teach-h2">SPANNING TREE PROTOCOL (STP)</div>
      <div className="teach-code">{`STP Election (802.1D):
1. Elect Root Bridge — lowest Bridge ID (Priority + MAC)
   Default priority = 32768. Lower wins.
   Tie-break: lower MAC address

2. All non-root switches elect a Root Port
   (port with lowest cost path to root)

3. Each segment elects a Designated Port
   (one per segment — usually on root bridge side)

4. Remaining ports go BLOCKING

Port Cost by speed:   Port States:
  10 Mbps  = 100        Blocking  (20s max age)
  100 Mbps = 19         Listening (15s fwd delay)
  1 Gbps   = 4          Learning  (15s fwd delay)
  10 Gbps  = 2          Forwarding ← only state that passes data
                        Disabled`}</div>

      <table className="teach-table">
        <thead><tr><th>Variant</th><th>Standard</th><th>Convergence</th><th>Per-VLAN?</th></tr></thead>
        <tbody>
          {[["STP","802.1D","~50 seconds","No (1 instance)"],["PVST+","Cisco proprietary","~50 seconds","Yes"],["RSTP","802.1w","~1–2 seconds","No (1 instance)"],["Rapid PVST+","Cisco 802.1w","~1–2 seconds","Yes ← use this"],["MST (802.1s)","IEEE","~1–2 seconds","Groups of VLANs"]].map(r => <tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td style={{color:r[3].includes("use this")?"#00ff41":"inherit"}}>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">PortFast + BPDU Guard on access ports: PortFast skips Listening/Learning states. BPDU Guard shuts the port if a switch is accidentally connected — prevents accidental loops.</div>

      <div className="teach-h2">ACL FUNDAMENTALS</div>
      <div className="teach-code">{`ACL Processing Rules:
• Processed TOP to BOTTOM — first match wins
• Implicit "deny all" at the end (invisible)
• Always add "permit ip any any" if needed!

Standard ACL (1–99, 1300–1999) — source IP only:
  access-list 10 deny   192.168.1.0 0.0.0.255
  access-list 10 permit any
  interface gi0/1
   ip access-group 10 out   ← Apply OUT (close to destination)

Extended ACL (100–199, 2000–2699) — src+dst+port+protocol:
  access-list 110 deny tcp 10.0.0.0 0.0.0.255 any eq 23
  access-list 110 permit ip any any
  interface gi0/0
   ip access-group 110 in   ← Apply IN (close to source)`}</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">STANDARD ACL PLACEMENT</div><div className="teach-card-body">Place CLOSE TO DESTINATION. Standard ACLs only match source IP — placing near source would over-block traffic to other destinations.</div></div>
        <div className="teach-card"><div className="teach-card-title">EXTENDED ACL PLACEMENT</div><div className="teach-card-body">Place CLOSE TO SOURCE. Stop unwanted traffic as early as possible to conserve bandwidth on the network.</div></div>
      </div>

      <div className="teach-h2">PORT SECURITY</div>
      <div className="teach-code">{`Switch(config-if)# switchport port-security
Switch(config-if)# switchport port-security maximum 2
Switch(config-if)# switchport port-security mac-address sticky
Switch(config-if)# switchport port-security violation shutdown

Violation Modes:
  shutdown  — port goes err-disabled (default, most secure)
  restrict  — drops frames, logs violation, port stays up
  protect   — silently drops frames, no logging`}</div>
      <div className="teach-info">Err-disabled ports must be manually re-enabled: shutdown → no shutdown on the interface, after fixing the cause.</div>
    </div>
  );
}

// ── DATA ─────────────────────────────────────────────────────────────────────

const subnetQuestions = [
  {ip:"192.168.10.0/24",q:"How many usable hosts can this subnet support?",choices:["254","256","255","128"],answer:0,explain:"/24 = 8 host bits. Formula: 2^8 - 2 = 254 usable hosts. We subtract 2 for the network and broadcast addresses."},
  {ip:"10.0.0.0/8",q:"What is the default subnet mask for this Class A address?",choices:["255.255.255.0","255.0.0.0","255.255.0.0","255.255.255.128"],answer:1,explain:"Class A = /8 = 255.0.0.0. Remember: A=/8, B=/16, C=/24 are the defaults."},
  {ip:"172.16.5.130/26",q:"What is the network address of this host?",choices:["172.16.5.128","172.16.5.0","172.16.5.129","172.16.5.192"],answer:0,explain:"/26 mask = 255.255.255.192. Block size = 256-192 = 64. Blocks: 0, 64, 128, 192. 130 falls in 128 block. Network = 172.16.5.128."},
  {ip:"192.168.1.200/28",q:"What is the broadcast address of this subnet?",choices:["192.168.1.207","192.168.1.255","192.168.1.215","192.168.1.223"],answer:0,explain:"/28 mask = 255.255.255.240. Block size = 256-240 = 16. Blocks: 192, 208... 200 is in 192 block. Broadcast = 192+16-1 = 207."},
  {ip:"192.168.100.64/27",q:"What is the valid host range for this subnet?",choices:["192.168.100.65–94","192.168.100.64–95","192.168.100.65–126","192.168.100.64–91"],answer:0,explain:"/27 block=32. Range 64–95. Network=64, Broadcast=95. Valid hosts: 65–94 (30 usable)."},
  {ip:"172.31.0.0/16",q:"This IP belongs to which private IP range?",choices:["10.0.0.0/8","172.16.0.0/12","192.168.0.0/16","169.254.0.0/16"],answer:1,explain:"172.16.0.0–172.31.255.255 is the Class B private range, summarized as 172.16.0.0/12."},
  {ip:"192.168.1.0/25",q:"How many usable subnets from splitting a /24 into /25?",choices:["2","4","8","126"],answer:0,explain:"Borrowing 1 bit from host: 2^1 = 2 subnets. Each /25 has 2^7-2 = 126 usable hosts."},
  {ip:"10.10.10.0/22",q:"How many usable hosts does a /22 network support?",choices:["1022","2046","1024","4094"],answer:0,explain:"/22 has 10 host bits. 2^10 - 2 = 1024 - 2 = 1022 usable hosts."},
];

const routingQuestions = [
  {scenario:"Router receives a packet for 192.168.1.50. Which route is selected from the routing table?",routes:[{dest:"0.0.0.0/0",next:"10.0.0.1",proto:"Static",ad:1},{dest:"192.168.1.0/24",next:"10.0.0.2",proto:"OSPF",ad:110},{dest:"192.168.1.48/29",next:"10.0.0.3",proto:"EIGRP",ad:90},{dest:"192.168.0.0/16",next:"10.0.0.4",proto:"RIP",ad:120}],answer:2,explain:"LONGEST PREFIX MATCH always wins first. /29 is the most specific match for 192.168.1.50 (covers .48–.55). AD and metric are not consulted when prefix lengths differ."},
  {scenario:"Two routes to 10.0.0.0/8 exist — one via OSPF (AD=110), one via RIP (AD=120). Which wins?",routes:[{dest:"10.0.0.0/8",next:"172.16.0.1",proto:"OSPF",ad:110},{dest:"10.0.0.0/8",next:"172.16.0.2",proto:"RIP",ad:120},{dest:"0.0.0.0/0",next:"172.16.0.1",proto:"Static",ad:1},{dest:"10.10.0.0/16",next:"172.16.0.3",proto:"EIGRP",ad:90}],answer:0,explain:"Both routes have the same /8 prefix. When prefix length is equal, compare AD. OSPF (110) < RIP (120), so OSPF wins. Lower AD = more trusted."},
  {scenario:"Which route source has Administrative Distance = 0?",routes:[{dest:"192.168.1.0/24",next:"Gi0/0",proto:"Connected Interface",ad:0},{dest:"0.0.0.0/0",next:"10.0.0.1",proto:"Static Route",ad:1},{dest:"10.0.0.0/8",next:"10.0.0.2",proto:"EIGRP Internal",ad:90},{dest:"172.16.0.0/12",next:"10.0.0.3",proto:"OSPF",ad:110}],answer:0,explain:"Directly connected interfaces have AD=0 — they are considered perfectly trustworthy since you are physically attached."},
  {scenario:"Static default route exists. OSPF learns 10.5.5.0/24. Packet destined for 10.5.5.1 — which route wins?",routes:[{dest:"0.0.0.0/0",next:"192.168.1.1",proto:"Static",ad:1},{dest:"10.5.5.0/24",next:"192.168.1.2",proto:"OSPF",ad:110},{dest:"10.0.0.0/8",next:"192.168.1.3",proto:"EIGRP",ad:90},{dest:"10.5.0.0/16",next:"192.168.1.4",proto:"RIP",ad:120}],answer:1,explain:"10.5.5.0/24 is the longest prefix match for 10.5.5.1. Even though Static has lower AD (1), the /24 prefix is more specific than /0, so OSPF wins by prefix length."},
];

const vlanQuestions = [
  {title:"VLAN Port Assignment",desc:"Drag each port to its correct VLAN zone. Finance and HR must be isolated from Guest traffic.",pools:["Fa0/1 (Finance PC)","Fa0/2 (Guest WiFi)","Fa0/3 (HR Laptop)","Gi0/1 (Trunk to SW2)"],zones:[{label:"VLAN 10 – Finance/HR (internal)",correct:[0,2]},{label:"VLAN 20 – Guest (untrusted)",correct:[1]},{label:"VLAN 99 – Trunk (carries all VLANs)",correct:[3]}],explain:"Finance and HR share VLAN 10 (same trust level, same broadcast domain). Guest goes to isolated VLAN 20. The trunk port carries tagged frames for all VLANs between switches."},
  {title:"STP Port States",desc:"Drag each STP port state to its correct behavior description.",pools:["Blocking","Learning","Forwarding","Listening"],zones:[{label:"Passes user frames AND builds MAC table",correct:[2]},{label:"Drops user frames but builds MAC table",correct:[1]},{label:"Drops user frames, listens for BPDUs, no MAC table",correct:[3]},{label:"Drops ALL frames, discards MAC table, blocks everything",correct:[0]}],explain:"STP transitions: Blocking → Listening → Learning → Forwarding. Only the Forwarding state passes user traffic. Learning builds the MAC table to prevent flooding when it reaches Forwarding."},
];

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────

function ModuleTabs({ tabs, active, onSelect }) {
  return (
    <div className="mod-tabs">
      {tabs.map(t => <button key={t.id} className={`mod-tab ${active===t.id?"active":""}`} onClick={() => onSelect(t.id)}>{t.label}</button>)}
    </div>
  );
}

function StatRow({ stats }) {
  return (
    <div className="stat-row">
      {stats.map((s,i) => <div className="stat" key={i}><div className="stat-val">{s.val}</div><div className="stat-label">{s.label}</div></div>)}
    </div>
  );
}

function ResultScreen({ score, total, onRetry, onLearn }) {
  const pct = score/total;
  return (
    <div className="result-screen">
      <div style={{fontSize:12,color:"#00ff4188",marginBottom:8}}>FINAL SCORE</div>
      <div className="result-score">{score}/{total}</div>
      <div style={{fontSize:13,color:"#00ff4188",margin:"14px 0"}}>
        {pct>=0.8?"[ ACCESS GRANTED ] Excellent work.":pct>=0.5?"[ PARTIAL ] Review the LEARN tab for weak areas.":"[ ACCESS DENIED ] Study the concepts before retrying."}
      </div>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:16}}>
        <button className="btn" onClick={onRetry}>RETRY DRILL</button>
        <button className="btn btn-info" onClick={onLearn}>📖 REVIEW CONCEPTS</button>
      </div>
    </div>
  );
}

// ── MAGIC NUMBER CALCULATOR ───────────────────────────────────────────────────

function MagicNumberCalc() {
  const [ip, setIp] = useState("192.168.1.130");
  const [cidr, setCidr] = useState("26");

  // Parse and compute everything
  const compute = () => {
    const prefix = parseInt(cidr, 10);
    if (isNaN(prefix) || prefix < 1 || prefix > 32) return null;

    // Validate IP
    const octets = ip.split(".").map(Number);
    if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;

    const ipNum = (octets[0] << 24 | octets[1] << 16 | octets[2] << 8 | octets[3]) >>> 0;

    // Mask
    const maskNum = prefix === 0 ? 0 : (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const maskOctets = [(maskNum >>> 24) & 0xFF, (maskNum >>> 16) & 0xFF, (maskNum >>> 8) & 0xFF, maskNum & 0xFF];

    // Network
    const netNum = (ipNum & maskNum) >>> 0;
    const netOctets = [(netNum >>> 24) & 0xFF, (netNum >>> 16) & 0xFF, (netNum >>> 8) & 0xFF, netNum & 0xFF];

    // Broadcast
    const wildcard = (~maskNum) >>> 0;
    const bcNum = (netNum | wildcard) >>> 0;
    const bcOctets = [(bcNum >>> 24) & 0xFF, (bcNum >>> 16) & 0xFF, (bcNum >>> 8) & 0xFF, bcNum & 0xFF];

    // First/Last host
    const firstOctets = [...netOctets]; firstOctets[3] += 1;
    const lastOctets = [...bcOctets]; lastOctets[3] -= 1;

    const hostBits = 32 - prefix;
    const totalAddresses = Math.pow(2, hostBits);
    const usableHosts = Math.max(0, totalAddresses - 2);

    // The "interesting octet" — the last non-255 octet of the mask
    let interestingOctet = 3;
    for (let i = 0; i < 4; i++) { if (maskOctets[i] !== 255) { interestingOctet = i; break; } }
    const magicNumber = 256 - maskOctets[interestingOctet];

    // Generate block list around current network
    const networkInteresting = netOctets[interestingOctet];
    const blocks = [];
    const start = Math.max(0, networkInteresting - magicNumber * 3);
    for (let b = start; b <= 255; b += magicNumber) {
      if (blocks.length > 12) break;
      blocks.push(b);
    }

    // 32 bits of the IP as array
    const ipBits = [];
    for (let i = 31; i >= 0; i--) ipBits.unshift((ipNum >>> i) & 1);

    return {
      ip: octets, cidrPrefix: prefix, mask: maskOctets, network: netOctets,
      broadcast: bcOctets, firstHost: firstOctets, lastHost: lastOctets,
      hostBits, totalAddresses, usableHosts, magicNumber, interestingOctet,
      blocks, networkInteresting, ipBits, wildcard: [(wildcard>>>24)&0xFF,(wildcard>>>16)&0xFF,(wildcard>>>8)&0xFF,wildcard&0xFF],
    };
  };

  const r = compute();

  const octetLabels = ["Octet 1","Octet 2","Octet 3","Octet 4"];

  return (
    <div>
      <div className="teach-h1">// MAGIC NUMBER CALCULATOR</div>
      <div className="teach-p" style={{marginBottom:16}}>
        Type any IP address and CIDR prefix below. The calculator will walk through every step of the subnetting process visually — exactly how Professor Messer teaches it.
      </div>

      {/* Input Row */}
      <div className="magic-input-row">
        <input
          className="magic-input"
          value={ip}
          onChange={e => setIp(e.target.value)}
          placeholder="192.168.1.130"
          spellCheck={false}
        />
        <span className="magic-input-slash">/</span>
        <input
          className="magic-cidr-input"
          value={cidr}
          onChange={e => setCidr(e.target.value.replace(/\D/g, "").slice(0, 2))}
          placeholder="26"
        />
        <span style={{fontSize:12,color:"#00ff4155"}}>← type any IP and prefix</span>
      </div>

      {!r && <div className="magic-error">✗ Invalid input — enter a valid IP (e.g. 192.168.1.130) and prefix (1–32).</div>}

      {r && <>
        {/* BIT MAP */}
        <div style={{marginBottom:6}}>
          <div className="teach-h2" style={{marginTop:0}}>BIT MAP — 32-BIT IP ADDRESS VISUALIZATION</div>
          <div className="bit-legend">
            <div className="bit-legend-item"><div className="bit-legend-swatch" style={{background:"rgba(0,255,65,0.15)",borderColor:"#00ff4166"}}/><span>Network bits ({r.cidrPrefix})</span></div>
            <div className="bit-legend-item"><div className="bit-legend-swatch" style={{background:"rgba(0,204,255,0.08)",borderColor:"#00ccff44"}}/><span>Host bits ({r.hostBits})</span></div>
          </div>
          <div className="bit-grid">
            {[0,1,2,3].map(octet => (
              <div key={octet} style={{display:"flex",flexDirection:"column",gap:0}}>
                <div className="bit-group">
                  {[0,1,2,3,4,5,6,7].map(bit => {
                    const globalBit = octet * 8 + bit;
                    const isNet = globalBit < r.cidrPrefix;
                    const val = r.ipBits[globalBit];
                    return (
                      <div key={bit} className={`bit-cell ${isNet ? "net" : "host"}`}>
                        {val}
                        <span className="bit-pos">{Math.pow(2, 7-bit)}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="octet-val">{r.ip[octet]}</div>
                <div className="octet-label">{octetLabels[octet]}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:11,color:"#00ff4155",marginTop:4}}>
            Each cell shows the bit value (0 or 1) and its positional value (128, 64, 32...). Green = network, Blue = host.
          </div>
        </div>

        {/* STEP-BY-STEP */}
        <div className="teach-h2">STEP-BY-STEP CALCULATION</div>
        <div className="step-box">
          <div className="step-box-title">// MAGIC_NUMBER_METHOD.exe</div>

          <div className="step-line">
            <span className="step-num">1</span>
            <span className="step-text">
              Subnet mask for <span className="step-highlight">/{r.cidrPrefix}</span> = <span className="step-highlight">{r.mask.join(".")}</span>
              <br/>
              <span style={{fontSize:11,color:"#00ff4155"}}>
                ({r.cidrPrefix} network bits → {r.cidrPrefix < 8 ? "first" : r.cidrPrefix < 16 ? "second" : r.cidrPrefix < 24 ? "third" : "fourth"} octet is the "interesting" one)
              </span>
            </span>
          </div>

          <div className="step-line">
            <span className="step-num">2</span>
            <span className="step-text">
              Interesting octet value = <span className="step-highlight">{r.mask[r.interestingOctet]}</span>
              <br/>
              <span className="step-calc">Magic Number = 256 − {r.mask[r.interestingOctet]} = <strong style={{color:"#ffaa00",fontSize:15}}>{r.magicNumber}</strong></span>
              <br/>
              <span style={{fontSize:11,color:"#00ff4155"}}>This is your block size — subnets repeat every {r.magicNumber} addresses in octet {r.interestingOctet + 1}</span>
            </span>
          </div>

          <div className="step-line">
            <span className="step-num">3</span>
            <span className="step-text">
              Count up in blocks of <span className="step-highlight">{r.magicNumber}</span> until you pass <span className="step-highlight">{r.ip[r.interestingOctet]}</span>:
              <br/>
              <div className="block-row" style={{marginTop:6}}>
                {r.blocks.map(b => (
                  <div key={b} className={`block-item ${b === r.networkInteresting ? "current-block" : ""}`}>
                    {b}{b === r.networkInteresting ? " ←" : ""}
                  </div>
                ))}
              </div>
              <span style={{fontSize:11,color:"#00ff4155"}}>
                {r.ip[r.interestingOctet]} falls in the <strong style={{color:"#00ff41"}}>{r.networkInteresting}</strong> block
                (between {r.networkInteresting} and {Math.min(255, r.networkInteresting + r.magicNumber - 1)})
              </span>
            </span>
          </div>

          <div className="step-line">
            <span className="step-num">4</span>
            <span className="step-text">
              <span className="step-highlight">Network address</span> = block start = <span className="step-highlight">{r.network.join(".")}</span>
              <br/>
              <span className="step-highlight">Broadcast address</span> = block end = <span className="step-highlight">{r.broadcast.join(".")}</span>
              <br/>
              <span style={{fontSize:11,color:"#00ff4155"}}>(Network + {r.magicNumber} − 1 = {r.networkInteresting} + {r.magicNumber} − 1 = {r.networkInteresting + r.magicNumber - 1})</span>
            </span>
          </div>

          <div className="step-line">
            <span className="step-num">5</span>
            <span className="step-text">
              <span className="step-highlight">First host</span> = {r.firstHost.join(".")} &nbsp;
              <span className="step-highlight">Last host</span> = {r.lastHost.join(".")}
              <br/>
              <span className="step-calc">Usable hosts = 2^{r.hostBits} − 2 = {r.totalAddresses} − 2 = <strong style={{color:"#ffaa00"}}>{r.usableHosts}</strong></span>
            </span>
          </div>
        </div>

        {/* RESULTS GRID */}
        <div className="teach-h2">COMPUTED VALUES</div>
        <div className="magic-results">
          {[
            {label:"IP ADDRESS",val:r.ip.join("."),sub:`/${r.cidrPrefix}`},
            {label:"SUBNET MASK",val:r.mask.join("."),sub:`Wildcard: ${r.wildcard.join(".")}`},
            {label:"NETWORK ADDRESS",val:r.network.join("."),sub:"First address (not usable)"},
            {label:"BROADCAST",val:r.broadcast.join("."),sub:"Last address (not usable)"},
            {label:"FIRST HOST",val:r.firstHost.join("."),sub:"First usable host"},
            {label:"LAST HOST",val:r.lastHost.join("."),sub:"Last usable host"},
            {label:"USABLE HOSTS",val:r.usableHosts.toLocaleString(),sub:`2^${r.hostBits} − 2 = ${r.totalAddresses} − 2`},
            {label:"MAGIC NUMBER",val:r.magicNumber,sub:`Block size (256 − ${r.mask[r.interestingOctet]})`},
          ].map(c => (
            <div className="magic-result-card" key={c.label}>
              <div className="magic-result-label">{c.label}</div>
              <div className="magic-result-val">{c.val}</div>
              <div className="magic-result-sub">{c.sub}</div>
            </div>
          ))}
        </div>

        <div className="teach-tip">
          The Magic Number (block size) is always 256 minus the value of the "interesting" octet in the subnet mask. Memorize this and you can subnet any /24–/30 in seconds — no binary conversion needed.
        </div>
      </>}
    </div>
  );
}

// ── SUBNET MODULE ─────────────────────────────────────────────────────────────

function SubnetModule({ onBack }) {
  const [tab, setTab] = useState("learn");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = subnetQuestions[idx];
  const pick = (i) => { if(selected!==null)return; setSelected(i); if(i===q.answer)setScore(s=>s+1); };
  const next = () => { if(idx+1>=subnetQuestions.length)setDone(true); else{setIdx(i=>i+1);setSelected(null);} };
  const reset = () => { setIdx(0);setScore(0);setSelected(null);setDone(false); };

  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 LEARN — Subnetting & IP"},{id:"magic",label:"🔢 MAGIC NUMBER CALC"},{id:"drill",label:"🎯 SUBNET DRILL"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <SubnetLearn />}
        {tab==="magic" && <MagicNumberCalc />}
        {tab==="drill" && (done
          ? <ResultScreen score={score} total={subnetQuestions.length} onRetry={reset} onLearn={()=>setTab("magic")} />
          : <div>
              <StatRow stats={[{val:idx+1,label:"QUESTION"},{val:subnetQuestions.length,label:"TOTAL"},{val:score,label:"CORRECT"}]} />
              <div className="progress-bar"><div className="progress-fill" style={{width:`${(idx/subnetQuestions.length)*100}%`}}/></div>
              <div className="subnet-display flicker">{q.ip}</div>
              <div style={{fontSize:12,color:"#00ff41aa",marginBottom:12,lineHeight:1.8}}><span style={{color:"#00ff4155"}}>QUERY &gt; </span>{q.q}</div>
              <div className="answer-grid">
                {q.choices.map((c,i) => <button key={i} className={`answer-btn ${selected===i?(i===q.answer?"correct":"wrong"):selected!==null&&i===q.answer?"correct":""}`} onClick={()=>pick(i)}>[{String.fromCharCode(65+i)}] {c}</button>)}
              </div>
              {selected!==null && <div className={`feedback ${selected===q.answer?"ok":"bad"}`}>
                <div><strong>{selected===q.answer?"✓ CORRECT":"✗ INCORRECT"}</strong> — {q.explain}</div>
                {selected!==q.answer && <div style={{marginTop:8,fontSize:11,color:"#ffaa0088"}}>💡 Use the 🔢 MAGIC NUMBER CALC tab to work through this step by step.</div>}
                <div style={{marginTop:12}}><button className="btn" onClick={next}>{idx+1>=subnetQuestions.length?"VIEW RESULTS":"NEXT >>>"}</button></div>
              </div>}
            </div>
        )}
        <div style={{marginTop:16}}><button className="btn btn-danger" style={{fontSize:11}} onClick={onBack}>← BACK</button></div>
      </div>
    </div>
  );
}

// ── TOPOLOGY MODULE ───────────────────────────────────────────────────────────

const DEVICE_TYPES = [{type:"router",icon:"🔀",label:"Router"},{type:"switch",icon:"🔁",label:"Switch"},{type:"pc",icon:"💻",label:"PC"},{type:"server",icon:"🖥️",label:"Server"},{type:"firewall",icon:"🛡️",label:"Firewall"},{type:"ap",icon:"📡",label:"AP"}];
const CHALLENGES = [
  {text:"Basic LAN: 1 Router → 1 Switch → 3 PCs. Connect to form a star topology.",check:(d,c)=>d.filter(x=>x.type==="router").length>=1&&d.filter(x=>x.type==="switch").length>=1&&d.filter(x=>x.type==="pc").length>=3&&c.length>=4,hint:"Place 1 Router, 1 Switch, 3 PCs. Click a device then click another to connect them.",concept:"Classic Access Layer star. Switch creates separate collision domains. Router separates broadcast domains."},
  {text:"DMZ: Firewall between Router and Server. PCs connect through the switch.",check:(d,c)=>d.some(x=>x.type==="firewall")&&d.some(x=>x.type==="server")&&c.length>=3,hint:"Router→Firewall→Server (DMZ segment). Firewall→Switch→PCs (LAN segment).",concept:"DMZ (Demilitarized Zone) isolates public-facing servers from the internal LAN, limiting breach impact."},
  {text:"Redundant uplinks: 2 Switches cross-connected AND both connected to the same Router.",check:(d,c)=>d.filter(x=>x.type==="switch").length>=2&&d.filter(x=>x.type==="router").length>=1&&c.length>=3,hint:"Two switches need an uplink to each other (trunk) and individual uplinks to the router.",concept:"Redundant paths prevent single points of failure. STP will block one link to prevent broadcast storms."},
];

function TopologyModule({ onBack }) {
  const [tab, setTab] = useState("learn");
  const [devices, setDevices] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(null);
  const [challengeIdx, setChallengeIdx] = useState(0);
  const [verified, setVerified] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [dragOffset, setDragOffset] = useState({x:0,y:0});
  const canvasRef = useRef(null);
  const idRef = useRef(0);
  const challenge = CHALLENGES[challengeIdx];
  const addDevice = (type) => { const dt=DEVICE_TYPES.find(d=>d.type===type); setDevices(prev=>[...prev,{id:++idRef.current,type,icon:dt.icon,label:dt.label,x:60+Math.random()*270,y:60+Math.random()*250}]); };
  const getCenter = (id) => { const d=devices.find(x=>x.id===id); return d?{x:d.x+33,y:d.y+26}:{x:0,y:0}; };
  const clearCanvas = () => { setDevices([]);setConnections([]);setSelected(null);setVerified(null); };

  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 LEARN — Topology & Design"},{id:"build",label:"🌐 TOPO BUILDER"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <TopoLearn />}
        {tab==="build" && <div>
          <div style={{display:"flex",gap:10,marginBottom:12,flexWrap:"wrap"}}>
            <div style={{flex:1,minWidth:200,border:"1px solid #00ff4122",padding:10,background:"rgba(0,255,65,0.02)",fontSize:11}}>
              <div style={{color:"#00ff41",marginBottom:4,fontSize:10,letterSpacing:2}}>CHALLENGE {challengeIdx+1}/{CHALLENGES.length}</div>
              <div style={{color:"#00ff41aa",marginBottom:6}}>{challenge.text}</div>
              <div style={{color:"#00ff4155",fontSize:10}}>HINT: {challenge.hint}</div>
            </div>
            <div style={{flex:1,minWidth:180,border:"1px solid #00ccff33",padding:10,background:"rgba(0,204,255,0.03)",fontSize:11}}>
              <div style={{color:"#00ccff",marginBottom:4,fontSize:10,letterSpacing:2}}>WHY THIS MATTERS</div>
              <div style={{color:"#00ccffaa",lineHeight:1.7}}>{challenge.concept}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:12}}>
            <div style={{display:"flex",flexDirection:"column",minWidth:130}}>
              <div style={{fontSize:10,color:"#00ff4155",marginBottom:6,letterSpacing:2}}>ADD DEVICE</div>
              {DEVICE_TYPES.map(dt => <button key={dt.type} className="topo-device-pick" onClick={()=>addDevice(dt.type)}><span>{dt.icon}</span>{dt.label}</button>)}
              <div style={{marginTop:8,fontSize:10,color:"#00ff4533",borderTop:"1px solid #00ff4122",paddingTop:8,lineHeight:1.7}}>Click 2 devices<br/>to connect.<br/>Drag to move.</div>
            </div>
            <div style={{flex:1}}>
              <div className="topo-canvas" ref={canvasRef}
                onMouseMove={e => { if(!dragging)return; const r=canvasRef.current.getBoundingClientRect(); const x=Math.max(0,Math.min(r.width-70,e.clientX-r.left-dragOffset.x)); const y=Math.max(0,Math.min(r.height-70,e.clientY-r.top-dragOffset.y)); setDevices(prev=>prev.map(d=>d.id===dragging?{...d,x,y}:d)); }}
                onMouseUp={()=>setDragging(null)} onMouseLeave={()=>setDragging(null)}>
                <svg className="connection-svg">
                  {connections.map((c,i)=>{const a=getCenter(c.a),b=getCenter(c.b);return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#00ff41" strokeWidth="1.5" opacity="0.5" strokeDasharray="4 3"/>;})}
                </svg>
                {devices.map(dev => (
                  <div key={dev.id} className={`device-node ${selected===dev.id?"selected":""}`} style={{left:dev.x,top:dev.y}}
                    onMouseDown={e=>{e.stopPropagation();const r=canvasRef.current.getBoundingClientRect();setDragging(dev.id);setDragOffset({x:e.clientX-r.left-dev.x,y:e.clientY-r.top-dev.y});}}
                    onClick={e=>{e.stopPropagation();if(dragging)return;if(selected===null){setSelected(dev.id);}else if(selected===dev.id){setSelected(null);}else{const exists=connections.some(c=>(c.a===selected&&c.b===dev.id)||(c.a===dev.id&&c.b===selected));if(!exists)setConnections(prev=>[...prev,{a:selected,b:dev.id}]);setSelected(null);}}}>
                    <div className="device-icon">{dev.icon}</div>
                    <div className="device-label">{dev.label}-{dev.id}</div>
                  </div>
                ))}
                {devices.length===0&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#00ff4133",fontSize:12,letterSpacing:2}}>[ ADD DEVICES FROM SIDEBAR ]</div>}
              </div>
              <div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
                <button className="btn" onClick={()=>setVerified(challenge.check(devices,connections))}>VERIFY</button>
                <button className="btn btn-warn" onClick={clearCanvas}>CLEAR</button>
                {challengeIdx+1<CHALLENGES.length&&<button className="btn" onClick={()=>{setChallengeIdx(i=>i+1);clearCanvas();}}>NEXT CHALLENGE</button>}
              </div>
              {verified!==null&&<div className={`feedback ${verified?"ok":"bad"}`} style={{marginTop:10}}>{verified?"✓ TOPOLOGY VALIDATED — Correct architecture detected.":"✗ NOT QUITE — Check the challenge requirements and try again."}</div>}
            </div>
          </div>
        </div>}
        <div style={{marginTop:16}}><button className="btn btn-danger" style={{fontSize:11}} onClick={onBack}>← BACK</button></div>
      </div>
    </div>
  );
}

// ── ROUTING MODULE ────────────────────────────────────────────────────────────

function RoutingModule({ onBack }) {
  const [tab, setTab] = useState("learn");
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = routingQuestions[idx];
  const pick = (i) => { if(selected!==null)return; setSelected(i); if(i===q.answer)setScore(s=>s+1); };
  const next = () => { if(idx+1>=routingQuestions.length)setDone(true); else{setIdx(i=>i+1);setSelected(null);} };
  const reset = () => { setIdx(0);setScore(0);setSelected(null);setDone(false); };

  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 LEARN — Routing Protocols"},{id:"drill",label:"🗺️ ROUTE SELECT"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <RoutingLearn />}
        {tab==="drill" && (done
          ? <ResultScreen score={score} total={routingQuestions.length} onRetry={reset} onLearn={()=>setTab("learn")} />
          : <div>
              <StatRow stats={[{val:idx+1,label:"SCENARIO"},{val:routingQuestions.length,label:"TOTAL"},{val:score,label:"CORRECT"}]} />
              <div className="progress-bar"><div className="progress-fill" style={{width:`${(idx/routingQuestions.length)*100}%`}}/></div>
              <div style={{margin:"12px 0",padding:12,border:"1px solid #00ff4122",background:"rgba(0,255,65,0.02)"}}>
                <div style={{fontSize:10,color:"#00ff4155",marginBottom:5,letterSpacing:2}}>SCENARIO</div>
                <div style={{fontSize:12,color:"#00ff41aa"}}>{q.scenario}</div>
              </div>
              <div style={{fontSize:10,color:"#00ff4155",marginBottom:6,letterSpacing:1}}>ROUTING TABLE — Click the route the router will use:</div>
              <table className="routing-table">
                <thead><tr><th>#</th><th>Destination</th><th>Next-Hop</th><th>Protocol</th><th>AD</th></tr></thead>
                <tbody>
                  {q.routes.map((r,i)=>(
                    <tr key={i} className={selected!==null&&i===q.answer?"highlighted-row":""} style={{cursor:"pointer"}} onClick={()=>pick(i)}>
                      <td style={{color:selected===i?(i===q.answer?"#00ff41":"#ff4444"):"#00ff4155"}}>{selected===i?(i===q.answer?"✓":"✗"):`[${i+1}]`}</td>
                      <td>{r.dest}</td><td>{r.next}</td><td>{r.proto}</td>
                      <td style={{color:r.ad<=1?"#00ff41":r.ad<=90?"#00ccff":r.ad>=120?"#ffaa00":"#00ff41aa",fontFamily:"'Orbitron',sans-serif",fontSize:16}}>{r.ad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {selected!==null&&<div className={`feedback ${selected===q.answer?"ok":"bad"}`}>
                <div><strong>{selected===q.answer?"✓ CORRECT":"✗ INCORRECT"}</strong> — {q.explain}</div>
                {selected!==q.answer&&<div style={{marginTop:8,fontSize:11,color:"#ffaa0088"}}>💡 Review the AD table and prefix matching rules in the LEARN tab.</div>}
                <div style={{marginTop:12}}><button className="btn" onClick={next}>{idx+1>=routingQuestions.length?"VIEW RESULTS":"NEXT >>>"}</button></div>
              </div>}
            </div>
        )}
        <div style={{marginTop:16}}><button className="btn btn-danger" style={{fontSize:11}} onClick={onBack}>← BACK</button></div>
      </div>
    </div>
  );
}

// ── VLAN MODULE ───────────────────────────────────────────────────────────────

function VlanModule({ onBack }) {
  const [tab, setTab] = useState("learn");
  const [qIdx, setQIdx] = useState(0);
  const [placed, setPlaced] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [verified, setVerified] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = vlanQuestions[qIdx];
  const unplaced = q.pools.filter((_,i)=>!Object.values(placed).flat().includes(i));

  const handleDrop = (zi) => {
    if(dragItem===null)return;
    setPlaced(prev=>{const u={...prev};Object.keys(u).forEach(k=>{u[k]=(u[k]||[]).filter(x=>x!==dragItem);});u[zi]=[...(u[zi]||[]),dragItem];return u;});
    setDragItem(null); setVerified(null);
  };

  const verify = () => {
    let ok=true;
    q.zones.forEach((z,zi)=>{if((placed[zi]||[]).sort().join(",")!==z.correct.sort().join(","))ok=false;});
    setVerified(ok); if(ok)setScore(s=>s+1);
  };

  const next = () => { if(qIdx+1>=vlanQuestions.length)setDone(true); else{setQIdx(i=>i+1);setPlaced({});setVerified(null);} };
  const reset = () => { setQIdx(0);setScore(0);setPlaced({});setVerified(null);setDone(false); };

  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 LEARN — VLANs, STP & ACLs"},{id:"drill",label:"🔌 VLAN/STP DROP"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <VlanLearn />}
        {tab==="drill" && (done
          ? <ResultScreen score={score} total={vlanQuestions.length} onRetry={reset} onLearn={()=>setTab("learn")} />
          : <div>
              <StatRow stats={[{val:qIdx+1,label:"EXERCISE"},{val:vlanQuestions.length,label:"TOTAL"},{val:score,label:"CORRECT"}]} />
              <div style={{margin:"12px 0",padding:10,border:"1px solid #00ff4122",background:"rgba(0,255,65,0.02)"}}>
                <div style={{fontSize:10,color:"#00ff4155",marginBottom:4,letterSpacing:2}}>EXERCISE: {q.title}</div>
                <div style={{fontSize:12,color:"#00ff41aa"}}>{q.desc}</div>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontSize:10,color:"#00ff4155",marginBottom:5,letterSpacing:2}}>AVAILABLE — Drag to a zone below</div>
                <div className="drag-zone" onDragOver={e=>e.preventDefault()} onDrop={()=>{if(dragItem!==null){setPlaced(prev=>{const u={...prev};Object.keys(u).forEach(k=>{u[k]=(u[k]||[]).filter(x=>x!==dragItem);});return u;});setDragItem(null);}}}>
                  {unplaced.map(i=><div key={i} className="drag-chip" draggable onDragStart={()=>setDragItem(i)}>{q.pools[i]}</div>)}
                  {unplaced.length===0&&<span style={{color:"#00ff4133",fontSize:11}}>[ ALL PLACED ]</span>}
                </div>
              </div>
              <div style={{display:"grid",gap:8}}>
                {q.zones.map((zone,zi)=>(
                  <div key={zi}>
                    <div style={{fontSize:10,color:"#00ff4166",marginBottom:4,letterSpacing:1}}>{zone.label}</div>
                    <div className="drag-zone" onDragOver={e=>{e.preventDefault();e.currentTarget.classList.add("over");}} onDragLeave={e=>e.currentTarget.classList.remove("over")} onDrop={e=>{e.currentTarget.classList.remove("over");handleDrop(zi);}}>
                      {(placed[zi]||[]).map(item=><div key={item} className="drag-chip" draggable onDragStart={()=>setDragItem(item)} onClick={()=>{setPlaced(prev=>{const u={...prev};u[zi]=(u[zi]||[]).filter(x=>x!==item);return u;});setVerified(null);}} title="Click to remove">{q.pools[item]}</div>)}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",gap:8,marginTop:14,flexWrap:"wrap"}}>
                <button className="btn" onClick={verify} disabled={Object.values(placed).flat().length!==q.pools.length}>VERIFY</button>
                <button className="btn btn-warn" onClick={()=>{setPlaced({});setVerified(null);}}>RESET</button>
              </div>
              {verified!==null&&<div className={`feedback ${verified?"ok":"bad"}`} style={{marginTop:12}}>
                <div><strong>{verified?"✓ CORRECT":"✗ TRY AGAIN"}</strong>{verified?" — ":""}{verified?q.explain:"Some items are in the wrong zones. Click items to remove them."}</div>
                {!verified&&<div style={{marginTop:8,fontSize:11,color:"#ffaa0088"}}>💡 Review the LEARN tab for VLAN port types and STP state descriptions.</div>}
                {verified&&<div style={{marginTop:12}}><button className="btn" onClick={next}>{qIdx+1>=vlanQuestions.length?"VIEW RESULTS":"NEXT EXERCISE >>>"}</button></div>}
              </div>}
            </div>
        )}
        <div style={{marginTop:16}}><button className="btn btn-danger" style={{fontSize:11}} onClick={onBack}>← BACK</button></div>
      </div>
    </div>
  );
}

// ── HOME ──────────────────────────────────────────────────────────────────────

const MODULES = [
  {id:"subnet",icon:"🔢",title:"SUBNET DRILL",desc:"Learn CIDR, block sizes, host ranges — then drill with rapid-fire questions.",tag:"IP ADDRESSING · VLSM"},
  {id:"topology",icon:"🌐",title:"TOPO BUILDER",desc:"Study topology types and device roles, then build and validate network diagrams.",tag:"NETWORK DESIGN · LAN/WAN"},
  {id:"routing",icon:"🗺️",title:"ROUTE SELECT",desc:"Master AD values and prefix matching, then pick winning routes from live tables.",tag:"OSPF · EIGRP · RIP · STATIC"},
  {id:"vlan",icon:"🔌",title:"VLAN/STP DROP",desc:"Learn VLANs, STP states, and ACL placement — then drag-and-drop to test yourself.",tag:"SWITCHING · STP · SECURITY"},
];

function Home({ onSelect }) {
  return (
    <div>
      <div style={{marginBottom:16}}>
        <div className="terminal-line"><span className="prompt">root@ccna:~$</span><span>./launch_trainer.sh --mode=learn+drill</span></div>
        <div className="terminal-line" style={{marginTop:4}}><span className="prompt">[SYS]</span><span>4 modules ready. Each has a LEARN tab + interactive DRILL. Start with LEARN.</span></div>
      </div>
      <div className="home-grid">
        {MODULES.map(m => (
          <div key={m.id} className="module-card" onClick={()=>onSelect(m.id)}>
            <div className="module-icon">{m.icon}</div>
            <div className="module-title">{m.title}</div>
            <div className="module-desc">{m.desc}</div>
            <div className="module-tag">{m.tag}</div>
          </div>
        ))}
      </div>
      <div style={{marginTop:16,padding:12,border:"1px solid #00ff4122",background:"rgba(0,255,65,0.01)"}}>
        <div style={{fontSize:10,color:"#00ff4155",letterSpacing:2,marginBottom:8}}>RECOMMENDED WORKFLOW</div>
        <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
          {["① Open a module","② Read the 📖 LEARN tab","③ Switch to the drill","④ Return to LEARN if stuck"].map(t=><div key={t} style={{fontSize:11,color:"#00ff4188"}}>▸ {t}</div>)}
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("home");
  const navItems = [{id:"home",label:"HOME"},{id:"subnet",label:"SUBNET DRILL"},{id:"topology",label:"TOPO BUILDER"},{id:"routing",label:"ROUTE SELECT"},{id:"vlan",label:"VLAN/STP DROP"}];

  return (
    <>
      <style>{styles}</style>
      <div className="app flicker">
        <div className="scanlines"/><div className="crt-glow"/>
        <div className="header">
          <div className="logo">CCNA::TERMINAL</div>
          <div className="header-tag">v2.0</div>
          <div className="header-tag">EXAM 200-301</div>
          <div style={{fontSize:11,color:"#00ff4144",marginLeft:"auto"}}>{new Date().toISOString().split("T")[0]}</div>
        </div>
        <div className="nav">
          {navItems.map(n=><button key={n.id} className={`nav-btn ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>{n.label}</button>)}
        </div>
        <div className="main">
          {view==="home"&&<Home onSelect={setView}/>}
          {view==="subnet"&&<SubnetModule onBack={()=>setView("home")}/>}
          {view==="topology"&&<TopologyModule onBack={()=>setView("home")}/>}
          {view==="routing"&&<RoutingModule onBack={()=>setView("home")}/>}
          {view==="vlan"&&<VlanModule onBack={()=>setView("home")}/>}
        </div>
      </div>
    </>
  );
}
