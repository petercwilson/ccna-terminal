import { useState, useRef, useEffect, useCallback } from "react";

// ─── STYLES ──────────────────────────────────────────────────────────
const styles = `
  /* PARROT OS FONTS */
  @import url('https://fonts.googleapis.com/css2?family=Cantarell:wght@400;700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack.css');
  
  /* 1. PARROT OS COLOR PALETTE & BASE */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0a111a; } /* Deep Parrot slate-blue */
  .app { min-height: 100vh; background: #0a111a; color: #00e5ff; font-family: 'Cantarell', sans-serif; font-size: 16px; line-height: 1.6; }
  
  /* 2. SUBTLE TERMINAL EFFECTS */
  .scanlines { position: fixed; inset: 0; pointer-events: none; z-index: 100; background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.03) 2px,rgba(0,0,0,0.03) 4px); }
  .crt-glow { position: fixed; inset: 0; pointer-events: none; z-index: 99; box-shadow: inset 0 0 80px rgba(0,229,255,0.015); }
  
  /* HEADER & NAV */
  .header { border-bottom: 1px solid rgba(0,229,255,0.2); padding: 12px 20px; display: flex; align-items: center; gap: 14px; background: rgba(0,229,255,0.03); flex-wrap: wrap; }
  .logo { font-family: 'Hack', monospace; font-size: 30px; color: #00e5ff; font-weight: bold; letter-spacing: 1px; }
  .header-tag { font-family: 'Hack', monospace; font-size: 14px; color: rgba(255,255,255,0.6); border: 1px solid rgba(255,255,255,0.3); padding: 2px 8px; }
  
  .nav { display: flex; gap: 3px; padding: 8px 20px; border-bottom: 1px solid rgba(0,229,255,0.15); flex-wrap: wrap; }
  .nav-btn { background: transparent; border: 1px solid rgba(0,229,255,0.3); color: rgba(255,255,255,0.8); font-family: 'Cantarell', sans-serif; font-size: 14px; padding: 6px 14px; cursor: pointer; transition: all 0.15s; }
  .nav-btn:hover, .nav-btn.active { background: rgba(0,229,255,0.1); border-color: #00e5ff; color: #00e5ff; }
  .nav-btn.exam-btn { border-color: rgba(255,170,0,0.4); color: rgba(255,170,0,0.8); }
  .nav-btn.exam-btn:hover, .nav-btn.exam-btn.active { background: rgba(255,170,0,0.1); border-color: #ffaa00; color: #ffaa00; }
  .nav-btn.progress-btn { border-color: rgba(0,204,255,0.4); color: rgba(0,204,255,0.8); }
  .nav-btn.progress-btn:hover, .nav-btn.progress-btn.active { background: rgba(0,204,255,0.1); border-color: #00ccff; color: #00ccff; }
  
  .main { padding: 18px 20px; max-width: 1140px; margin: 0 auto; }

  /* IOS TERMINAL STYLING */
  /*.ios-terminal {
    background: #04080c;
    border: 1px solid #00e5ff33;
    padding: 20px;
    font-family: 'Hack', monospace;
    font-size: 14px;
    color: #00e5ff;
    height: 400px;
    overflow-y: auto;
    border-radius: 4px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  }
  */
  
  /*.ios-input-line { display: flex; align-items: center; gap: 8px; }*/
  
  /* Ensure the native caret is still hidden for that terminal feel */
  .ios-input-line input {
    background: transparent;
    border: none;
    color: #ffffff;
    font-family: 'Hack', monospace;
    font-size: 14px;
    outline: none;
    flex: 1;
  }
  .ios-history { white-space: pre-wrap; }
  
  /* BUTTONS */
  .btn { background: rgba(0,229,255,0.05); border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Hack', monospace; font-size: 14px; padding: 8px 18px; cursor: pointer; transition: all 0.15s; }
  .btn:hover { background: rgba(0,229,255,0.15); box-shadow: 0 0 10px rgba(0,229,255,0.1); }
  .btn:disabled { opacity: 0.3; cursor: not-allowed; }
  .btn-danger { border-color: #ff4444; color: #ff4444; background: rgba(255,68,68,0.05); }
  .btn-danger:hover { background: rgba(255,68,68,0.15); }
  .btn-warn { border-color: #ffaa00; color: #ffaa00; background: rgba(255,170,0,0.05); }
  .btn-warn:hover { background: rgba(255,170,0,0.15); }
  .btn-info { border-color: #00ccff; color: #00ccff; background: rgba(0,204,255,0.05); }
  .btn-info:hover { background: rgba(0,204,255,0.15); }

  /* TABS */
  .mod-tabs { display: flex; gap: 0; border-bottom: 1px solid rgba(0,229,255,0.3); flex-wrap: wrap; }
  .mod-tab { background: #0c1520; border: 1px solid rgba(0,229,255,0.2); border-bottom: none; color: rgba(255,255,255,0.6); font-family: 'Cantarell', sans-serif; font-size: 14px; padding: 8px 18px; cursor: pointer; transition: all 0.15s; margin-right: 4px; border-radius: 4px 4px 0 0; }
  .mod-tab:hover { color: #00e5ff; border-color: rgba(0,229,255,0.5); }
  .mod-tab.active { background: #111d2b; border-color: #00e5ff; color: #00e5ff; border-bottom: 1px solid #111d2b; margin-bottom: -1px; }
  .mod-content { border: 1px solid rgba(0,229,255,0.3); padding: 24px; background: #111d2b; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }

  /* CARDS & MODULES */
  .home-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; margin-top: 14px; }
  .module-card { border: 1px solid rgba(0,229,255,0.2); padding: 20px; cursor: pointer; transition: all 0.2s; background: #0c1520; position: relative; overflow: hidden; border-radius: 4px; }
  .module-card::after { content:''; position:absolute; bottom:0; left:0; right:0; height:2px; background:#00e5ff; transform:scaleX(0); transition:transform 0.2s; }
  .module-card:hover { border-color:#00e5ff; background:#111d2b; transform:translateY(-2px); box-shadow:0 6px 15px rgba(0,229,255,0.05); }
  .module-card:hover::after { transform:scaleX(1); }
  .module-card.new-card { border-color: rgba(29,233,182,0.4); } /* Teal accent */
  .module-card.new-card::after { background: #1de9b6; }
  .module-card.new-card:hover { border-color: #1de9b6; box-shadow: 0 6px 15px rgba(29,233,182,0.05); }
  .module-icon { font-size: 28px; margin-bottom: 10px; color: rgba(255,255,255,0.9); }
  .module-title { font-family: 'Cantarell', sans-serif; font-size: 20px; font-weight: bold; color: #00e5ff; margin-bottom: 8px; }
  .module-card.new-card .module-title { color: #1de9b6; }
  .module-desc { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.6; }
  .module-tag { margin-top: 12px; font-size: 12px; font-family: 'Hack', monospace; color: rgba(0,229,255,0.7); border: 1px solid rgba(0,229,255,0.3); background: rgba(0,229,255,0.05); display: inline-block; padding: 3px 8px; border-radius: 2px; }
  .new-badge { font-size: 11px; font-family: 'Hack', monospace; color: #1de9b6; border: 1px solid rgba(29,233,182,0.4); background: rgba(29,233,182,0.05); display: inline-block; padding: 2px 6px; margin-left: 8px; border-radius: 2px; }

  /* TEACH SECTION */
  .scroll-area { max-height: 600px; overflow-y: auto; padding-right: 10px; }
  .scroll-area::-webkit-scrollbar { width: 6px; }
  .scroll-area::-webkit-scrollbar-thumb { background: rgba(0,229,255,0.3); border-radius: 3px; }
  .teach-h1 { font-family: 'Hack', monospace; font-size: 18px; color: #00e5ff; margin-bottom: 16px; border-bottom: 1px dashed rgba(0,229,255,0.3); padding-bottom: 8px; }
  .teach-h2 { font-size: 14px; color: #ffffff; text-transform: uppercase; margin-bottom: 10px; border-left: 3px solid #00e5ff; padding-left: 12px; margin-top: 24px; font-weight: bold; }
  .teach-p { font-size: 15px; color: rgba(255,255,255,0.85); line-height: 1.8; margin-bottom: 14px; }
  .teach-code { font-family: 'Hack', monospace; background: #060b10; border: 1px solid rgba(0,229,255,0.2); border-left: 3px solid #00e5ff; padding: 16px; font-size: 14px; color: #00e5ff; line-height: 1.8; margin: 14px 0; white-space: pre; overflow-x: auto; border-radius: 0 4px 4px 0; }
  .teach-table { width: 100%; border-collapse: collapse; font-size: 14px; margin: 14px 0; }
  .teach-table th { border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px; color: #ffffff; text-align: left; background: rgba(255,255,255,0.05); }
  .teach-table td { border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px; color: rgba(255,255,255,0.8); }
  .teach-table tr:hover td { background: rgba(0,229,255,0.03); color: #00e5ff; }
  .teach-tip { border: 1px solid rgba(255,170,0,0.4); background: rgba(255,170,0,0.05); padding: 14px 18px; font-size: 15px; color: rgba(255,255,255,0.9); border-left: 4px solid #ffaa00; margin: 14px 0; border-radius: 0 4px 4px 0; }
  .teach-tip::before { content: '⚡ EXAM TIP: '; color: #ffaa00; font-weight: bold; font-family: 'Hack', monospace; font-size: 13px; }
  .teach-info { border: 1px solid rgba(0,204,255,0.4); background: rgba(0,204,255,0.05); padding: 14px 18px; font-size: 15px; color: rgba(255,255,255,0.9); border-left: 4px solid #00ccff; margin: 14px 0; border-radius: 0 4px 4px 0; }
  .teach-info::before { content: 'ℹ KEY CONCEPT: '; color: #00ccff; font-weight: bold; font-family: 'Hack', monospace; font-size: 13px; }
  .teach-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin: 14px 0; }
  .teach-cols-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin: 14px 0; }
  .teach-card { border: 1px solid rgba(255,255,255,0.1); padding: 16px; background: #0c1520; border-radius: 4px; }
  .teach-card-title { font-size: 14px; color: #00e5ff; font-weight: bold; margin-bottom: 8px; }
  .teach-card-body { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.7; }
  .cheatsheet-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 10px; margin: 14px 0; }
  .cheatsheet-item { border: 1px solid rgba(255,255,255,0.1); padding: 10px 14px; background: #0c1520; border-radius: 4px; }
  .cheatsheet-key { font-size: 16px; font-family: 'Hack', monospace; color: #00e5ff; }
  .cheatsheet-val { font-size: 13px; color: rgba(255,255,255,0.6); margin-top: 4px; }

  /* QUIZ & MAGIC CALC */
  .subnet-display { font-family: 'Hack', monospace; font-size: 26px; color: #ffffff; text-align: center; padding: 18px; border: 1px solid rgba(0,229,255,0.3); background: #060b10; margin: 14px 0; border-radius: 4px; }
  .answer-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 14px; }
  .answer-btn { background: #0c1520; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85); font-family: 'Hack', monospace; font-size: 15px; padding: 14px 18px; cursor: pointer; transition: all 0.15s; text-align: left; line-height: 1.5; border-radius: 4px; }
  .answer-btn:hover { background: rgba(0,229,255,0.05); border-color: #00e5ff; }
  .answer-btn.correct { background: rgba(0,229,255,0.15); border-color: #00e5ff; color: #00e5ff; }
  .answer-btn.wrong { background: rgba(255,68,68,0.15); border-color: #ff4444; color: #ff6666; }
  .feedback { margin-top: 14px; padding: 16px 20px; font-size: 15px; line-height: 1.8; border-radius: 4px; }
  .feedback.ok { border: 1px solid rgba(0,229,255,0.5); color: rgba(255,255,255,0.9); background: rgba(0,229,255,0.08); border-left: 4px solid #00e5ff; }
  .feedback.bad { border: 1px solid rgba(255,68,68,0.5); color: #ffecec; background: rgba(255,68,68,0.08); border-left: 4px solid #ff4444; }
  .progress-bar { height: 6px; background: rgba(255,255,255,0.05); margin: 14px 0; border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: #00e5ff; transition: width 0.3s; }
  .stat-row { display: flex; gap: 10px; margin: 14px 0; flex-wrap: wrap; }
  .stat { border: 1px solid rgba(255,255,255,0.1); padding: 12px 16px; text-align: center; flex: 1; min-width: 80px; background: #0c1520; border-radius: 4px; }
  .stat-val { font-family: 'Hack', monospace; font-size: 22px; color: #ffffff; }
  .stat-label { font-size: 12px; color: rgba(0,229,255,0.7); margin-top: 4px; text-transform: uppercase; font-weight: bold; }
  .result-screen { text-align: center; padding: 40px 20px; }
  .result-score { font-family: 'Hack', monospace; font-size: 58px; color: #00e5ff; line-height: 1; margin-bottom: 10px; }

  /* MAGIC CALC INPUTS & BITS */
  .magic-input-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
  .magic-input, .magic-cidr-input { background: #060b10; border: 1px solid rgba(255,255,255,0.2); color: #00e5ff; font-family: 'Hack', monospace; font-size: 18px; padding: 10px 16px; outline: none; border-radius: 4px; }
  .magic-input:focus, .magic-cidr-input:focus { border-color: #00e5ff; background: rgba(0,229,255,0.05); }
  .magic-cidr-input { width: 70px; text-align: center; }
  .bit-grid { display: flex; gap: 4px; flex-wrap: nowrap; margin: 14px 0; overflow-x: auto; padding-bottom: 8px; }
  .bit-group { display: flex; gap: 3px; }
  .bit-group + .bit-group { margin-left: 10px; }
  .bit-cell { width: 34px; height: 48px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid; font-family: 'Hack', monospace; font-size: 15px; flex-shrink: 0; border-radius: 2px; }
  .bit-cell.net { border-color: rgba(0,229,255,0.4); background: rgba(0,229,255,0.1); color: #00e5ff; }
  .bit-cell.host { border-color: rgba(29,233,182,0.4); background: rgba(29,233,182,0.1); color: #1de9b6; }
  .bit-cell .bit-pos { font-size: 10px; opacity: 0.6; margin-top: 2px; }
  .octet-label { text-align: center; font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px; }
  .octet-val { text-align: center; font-size: 16px; color: #ffffff; font-family: 'Hack', monospace; margin-top: 4px;}
  .magic-result-card { border: 1px solid rgba(255,255,255,0.1); padding: 16px; background: #0c1520; border-radius: 4px; }
  .magic-result-label { font-size: 12px; color: rgba(255,255,255,0.5); letter-spacing: 1px; margin-bottom: 6px; text-transform: uppercase; }
  .magic-result-val { font-family: 'Hack', monospace; font-size: 18px; color: #00e5ff; }
  .step-box { border: 1px solid rgba(0,229,255,0.2); background: rgba(0,229,255,0.02); padding: 18px; margin: 14px 0; border-radius: 4px; }
  .step-num { font-family: 'Hack', monospace; font-size: 16px; color: rgba(0,229,255,0.5); width: 24px; flex-shrink: 0; }
  .step-highlight { color: #00e5ff; font-family: 'Hack', monospace; font-size: 14px; }

  /* DRAG & DROP DRILL */
  .drag-zone { border: 1px dashed rgba(0,229,255,0.4); min-height: 50px; padding: 10px; background: rgba(0,229,255,0.02); display: flex; flex-wrap: wrap; gap: 8px; border-radius: 4px; transition: all 0.2s; }
  .drag-zone.over { background: rgba(0,229,255,0.08); border-color: #00e5ff; }
  .drag-chip { background: #0c1520; border: 1px solid #00e5ff; color: #00e5ff; font-family: 'Hack', monospace; font-size: 13px; padding: 6px 12px; cursor: grab; user-select: none; border-radius: 2px; }
  .drag-chip:active { cursor: grabbing; border-color: #1de9b6; color: #1de9b6; }

  /* DRAG & DROP DRILL */
  .drag-zone { position: relative; border: 2px solid rgba(0,229,255,0.15); min-height: 64px; padding: 22px 12px 12px 12px; background: #04080c; box-shadow: inset 0 4px 12px rgba(0,0,0,0.5); display: flex; flex-wrap: wrap; gap: 10px; border-radius: 6px; transition: all 0.2s; align-items: center; }
  .drag-zone.over { background: rgba(0,229,255,0.05); border-color: #00e5ff; box-shadow: inset 0 0 20px rgba(0,229,255,0.15); }
  .port-label { position: absolute; top: 4px; left: 8px; font-family: 'Hack', monospace; font-size: 10px; color: rgba(0,229,255,0.3); font-weight: bold; letter-spacing: 1px; pointer-events: none; }
  .drag-chip { background: linear-gradient(180deg, #111d2b 0%, #0c1520 100%); border: 1px solid #00e5ff; border-left: 6px solid #1de9b6; color: #ffffff; font-family: 'Hack', monospace; font-size: 13px; padding: 8px 14px; cursor: grab; user-select: none; border-radius: 4px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); display: flex; align-items: center; transition: transform 0.1s; }
  .drag-chip::before { content: '⣿'; margin-right: 10px; color: #00e5ff; opacity: 0.6; font-size: 14px; }
  .drag-chip:hover { border-color: #1de9b6; }
  .drag-chip:active { cursor: grabbing; border-color: #1de9b6; background: rgba(29, 233, 182, 0.1); transform: translateY(2px); box-shadow: 0 1px 2px rgba(0,0,0,0.4); }
  .empty-port-text { font-family: 'Hack', monospace; font-size: 12px; color: rgba(0,229,255,0.2); width: 100%; text-align: center; pointer-events: none; }

  /* =========================================
     3. DYNAMIC UI UPGRADES (ANIMATIONS & GLOWS)
     ========================================= */
     
  /* Blinking Terminal Cursor */
  /*@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }*/
  .cursor { display: inline-block; width: 8px; height: 16px; background-color: #00e5ff; animation: blink 1s step-end infinite; vertical-align: middle; margin-left: 6px; transform: translateY(2px); }
  
  /* Pulsing Attention Button */
  @keyframes pulseWarn {
    0% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.2); }
    50% { box-shadow: 0 0 18px rgba(255, 170, 0, 0.6); }
    100% { box-shadow: 0 0 5px rgba(255, 170, 0, 0.2); }
  }
  .btn-pulse-warn { animation: pulseWarn 2.5s infinite; }
  
  /* Enhanced Card Hover Glows */
  .module-card { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease; }
  .module-card:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,229,255,0.15), inset 0 0 15px rgba(0,229,255,0.05); border-color: #00e5ff; }
  .module-card.new-card:hover { box-shadow: 0 10px 30px rgba(29,233,182,0.15), inset 0 0 15px rgba(29,233,182,0.05); }

  /* Segmented LED Progress Bars */
  .progress-fill, .exam-domain-fill, .progress-bar-fill { 
    background-color: #00e5ff; 
    /* This creates the dark gaps between the "LEDs" */
    background-image: repeating-linear-gradient(90deg, transparent, transparent 6px, #04080c 6px, #04080c 8px); 
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1); 
  }
`;

// ─── QUESTION BANKS ──────────────────────────────────────────────────────────

const ALL_QUESTIONS = {

  subnetting: [
    {id:"sn01",domain:"Subnetting",q:"How many usable hosts does a /24 subnet support?",choices:["254","256","255","252"],answer:0,explain:"/24 = 2^8 - 2 = 254. Always subtract 2 (network + broadcast)."},
    {id:"sn02",domain:"Subnetting",q:"What is the subnet mask for /26?",choices:["255.255.255.192","255.255.255.128","255.255.255.224","255.255.255.240"],answer:0,explain:"/26 borrows 2 bits from the last octet: 128+64=192 → 255.255.255.192."},
    {id:"sn03",domain:"Subnetting",q:"172.16.5.130/26 — what is the network address?",choices:["172.16.5.128","172.16.5.0","172.16.5.64","172.16.5.192"],answer:0,explain:"Block size = 256-192=64. Blocks: 0,64,128,192. 130 falls in 128 block. Network = .128."},
    {id:"sn04",domain:"Subnetting",q:"192.168.1.200/28 — what is the broadcast address?",choices:["192.168.1.207","192.168.1.255","192.168.1.223","192.168.1.215"],answer:0,explain:"Block=16. 200 is in the 192 block. Broadcast=192+16-1=207."},
    {id:"sn05",domain:"Subnetting",q:"How many usable hosts per subnet does /27 provide?",choices:["30","32","62","14"],answer:0,explain:"2^5 - 2 = 30 usable hosts per /27 subnet."},
    {id:"sn06",domain:"Subnetting",q:"172.31.0.0 — which private range does this belong to?",choices:["172.16.0.0/12","10.0.0.0/8","192.168.0.0/16","169.254.0.0/16"],answer:0,explain:"172.16.0.0-172.31.255.255 = Class B private range = 172.16.0.0/12."},
    {id:"sn07",domain:"Subnetting",q:"What is the magic number (block size) for /28?",choices:["16","32","64","8"],answer:0,explain:"256 - 240 (mask value) = 16. /28 = 255.255.255.240."},
    {id:"sn08",domain:"Subnetting",q:"How many /27 subnets can be created from a /24?",choices:["8","4","16","32"],answer:0,explain:"Borrowing 3 bits: 2^3 = 8 subnets."},
    {id:"sn09",domain:"Subnetting",q:"What does VLSM stand for?",choices:["Variable Length Subnet Masking","Variable LAN Subnet Method","Virtual Layer Subnet Mapping","Variable Link Subnet Mode"],answer:0,explain:"VLSM = Variable Length Subnet Masking. Allows different-sized subnets on the same network."},
    {id:"sn10",domain:"Subnetting",q:"169.254.10.5 is an example of which address type?",choices:["APIPA","Loopback","Multicast","Private Class B"],answer:0,explain:"169.254.0.0/16 is APIPA (Automatic Private IP Addressing) — assigned when DHCP fails."},
  ],

  routing: [
    {id:"rt01",domain:"Routing",q:"What is the Administrative Distance of OSPF?",choices:["110","90","120","1"],answer:0,explain:"OSPF AD = 110. Must-memorize: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120."},
    {id:"rt02",domain:"Routing",q:"Which route selection criterion takes highest priority?",choices:["Longest prefix match","Administrative Distance","Metric","Route age"],answer:0,explain:"Longest prefix match ALWAYS wins first. /29 beats /24 beats /0 regardless of AD or metric."},
    {id:"rt03",domain:"Routing",q:"What is the AD of a directly connected route?",choices:["0","1","5","10"],answer:0,explain:"Connected interfaces have AD=0 — most trusted source possible."},
    {id:"rt04",domain:"Routing",q:"OSPF uses which algorithm to calculate best paths?",choices:["Dijkstra SPF","Bellman-Ford","DUAL","Distance Vector"],answer:0,explain:"OSPF uses Dijkstra's Shortest Path First (SPF) algorithm. It's a link-state protocol."},
    {id:"rt05",domain:"Routing",q:"What metric does RIP use?",choices:["Hop count","Bandwidth","Cost","Delay"],answer:0,explain:"RIP uses hop count (max 15). 16 = unreachable. This limits RIP to small networks."},
    {id:"rt06",domain:"Routing",q:"Which command displays the routing table on a Cisco router?",choices:["show ip route","show route table","display ip route","show routing"],answer:0,explain:"'show ip route' is the standard IOS command to view the IPv4 routing table."},
    {id:"rt07",domain:"Routing",q:"What is a floating static route?",choices:["A backup static route with higher AD than dynamic routes","A route that changes based on traffic","A route learned via OSPF","A default route only"],answer:0,explain:"A floating static route has a manually set higher AD (e.g. 150) so it only activates when the primary dynamic route is lost."},
    {id:"rt08",domain:"Routing",q:"EIGRP's AD for internal routes is?",choices:["90","110","100","170"],answer:0,explain:"EIGRP internal = 90. EIGRP external = 170. Both lower than OSPF (110)."},
    {id:"rt09",domain:"Routing",q:"What does the 'O' code mean in 'show ip route'?",choices:["OSPF-learned route","Original route","Outbound route","Optional route"],answer:0,explain:"Route codes: C=Connected, S=Static, O=OSPF, D=EIGRP, R=RIP, B=BGP."},
    {id:"rt10",domain:"Routing",q:"Which OSPF network type uses a DR/BDR election?",choices:["Broadcast multi-access","Point-to-point","NBMA (no DR)","Loopback"],answer:0,explain:"On broadcast networks (Ethernet), OSPF elects a DR and BDR to reduce LSA flooding. P2P links don't need DR/BDR."},
  ],

  switching: [
    {id:"sw01",domain:"Switching",q:"What STP port state forwards data AND learns MAC addresses?",choices:["Forwarding","Learning","Listening","Blocking"],answer:0,explain:"Only Forwarding passes user traffic. Learning builds the MAC table but drops user frames."},
    {id:"sw02",domain:"Switching",q:"Which switch wins the STP Root Bridge election?",choices:["Lowest Bridge ID","Highest Bridge ID","Lowest MAC address only","Fastest port speed"],answer:0,explain:"Bridge ID = Priority (default 32768) + MAC address. Lowest Bridge ID wins. Tie → lowest MAC."},
    {id:"sw03",domain:"Switching",q:"What is the default STP port cost for a 1 Gbps link?",choices:["4","19","100","2"],answer:0,explain:"Port costs: 10M=100, 100M=19, 1G=4, 10G=2. Lower cost = preferred path to root."},
    {id:"sw04",domain:"Switching",q:"What command assigns a port to VLAN 10?",choices:["switchport access vlan 10","vlan 10 assign port","set vlan 10","switchport vlan 10 access"],answer:0,explain:"Full sequence: switchport mode access → switchport access vlan 10."},
    {id:"sw05",domain:"Switching",q:"What encapsulation protocol tags VLAN frames on trunk links?",choices:["802.1Q","802.1X","802.3ad","ISL"],answer:0,explain:"802.1Q (dot1q) adds a 4-byte tag to Ethernet frames. ISL is Cisco proprietary and legacy."},
    {id:"sw06",domain:"Switching",q:"PortFast should ONLY be enabled on which type of port?",choices:["Access ports connected to end devices","Trunk ports","Uplinks to other switches","Root ports"],answer:0,explain:"PortFast skips Listening/Learning. NEVER on trunk/switch ports — causes loops. Use BPDU Guard alongside."},
    {id:"sw07",domain:"Switching",q:"Which STP variant provides the fastest convergence?",choices:["Rapid PVST+","802.1D STP","PVST+","MST"],answer:0,explain:"Rapid PVST+ (802.1w per-VLAN) converges in ~1-2 seconds vs ~50 seconds for classic STP."},
    {id:"sw08",domain:"Switching",q:"What is the native VLAN on a trunk port?",choices:["The VLAN whose traffic is sent untagged","The management VLAN","VLAN 1 always","The highest VLAN number"],answer:0,explain:"Native VLAN traffic is untagged on trunk links. Both ends must match or frames get misrouted (VLAN hopping attack)."},
  ],

  ipServices: [
    {id:"ip01",domain:"IP Services",q:"Which NAT type maps one private IP to one public IP permanently?",choices:["Static NAT","Dynamic NAT","PAT","NAT overload"],answer:0,explain:"Static NAT = 1:1 permanent mapping. Used for servers that need a consistent public IP (web, mail servers)."},
    {id:"ip02",domain:"IP Services",q:"PAT allows many private IPs to share one public IP using what?",choices:["Port numbers","MAC addresses","VLAN tags","ARP entries"],answer:0,explain:"PAT (Port Address Translation) = NAT Overload. Tracks sessions by unique source port numbers."},
    {id:"ip03",domain:"IP Services",q:"Which DHCP message is broadcast from a client seeking an IP?",choices:["DHCPDISCOVER","DHCPOFFER","DHCPREQUEST","DHCPACK"],answer:0,explain:"DORA: Discover (broadcast) → Offer (server) → Request (broadcast) → Acknowledge (server)."},
    {id:"ip04",domain:"IP Services",q:"What command enables a router interface as a DHCP relay agent?",choices:["ip helper-address","ip dhcp relay","ip forward-dhcp","helper dhcp enable"],answer:0,explain:"'ip helper-address <server>' converts DHCP broadcasts to unicast and forwards to the DHCP server."},
    {id:"ip05",domain:"IP Services",q:"NTP stratum 1 servers synchronize directly from what?",choices:["Reference clocks (GPS/atomic)","Stratum 0","The internet","Each other"],answer:0,explain:"Stratum 0 = physical clock device. Stratum 1 = directly connected to stratum 0. Each hop adds 1."},
    {id:"ip06",domain:"IP Services",q:"Which protocol does SNMP use for transport?",choices:["UDP","TCP","ICMP","ARP"],answer:0,explain:"SNMP uses UDP port 161 (agent) and 162 (trap). UDP is lightweight — suitable for monitoring traffic."},
    {id:"ip07",domain:"IP Services",q:"What is the purpose of a DHCP address pool exclusion?",choices:["Reserve IPs for static assignment","Delete the DHCP pool","Block specific clients","Set lease duration"],answer:0,explain:"'ip dhcp excluded-address' prevents DHCP from assigning specific IPs — used for routers, servers, printers that need static IPs."},
    {id:"ip08",domain:"IP Services",q:"What protocol resolves IP addresses to MAC addresses?",choices:["ARP","DNS","RARP","ICMP"],answer:0,explain:"ARP (Address Resolution Protocol) broadcasts a request for the MAC address associated with an IP. Cached in the ARP table."},
    {id:"ip09",domain:"IP Services",q:"DNS uses which port number?",choices:["53","80","443","67"],answer:0,explain:"DNS = port 53 (UDP for queries, TCP for zone transfers). Key ports: HTTP=80, HTTPS=443, DHCP=67/68."},
    {id:"ip10",domain:"IP Services",q:"Which NAT term describes the inside global address?",choices:["The public IP that represents internal hosts","The private IP of internal hosts","The outside server's IP","The router's inside interface IP"],answer:0,explain:"NAT terms: Inside Local=private host IP, Inside Global=public IP representing private host, Outside Global=destination server IP."},
  ],

  ipv6: [
    {id:"v601",domain:"IPv6",q:"How many bits are in an IPv6 address?",choices:["128","64","32","256"],answer:0,explain:"IPv6 = 128 bits written as 8 groups of 4 hex digits. vs IPv4 = 32 bits."},
    {id:"v602",domain:"IPv6",q:"Which IPv6 address type is equivalent to IPv4 private addresses?",choices:["Unique Local (fc00::/7)","Link-Local (fe80::/10)","Global Unicast (2000::/3)","Multicast (ff00::/8)"],answer:0,explain:"Unique Local (fc00::/7) ≈ private. Link-local is fe80::/10 (auto-configured, not routable). Global unicast is internet-routable."},
    {id:"v603",domain:"IPv6",q:"What replaces ARP in IPv6?",choices:["Neighbor Discovery Protocol (NDP)","RARP","DHCPv6","ICMPv6 ping"],answer:0,explain:"NDP uses ICMPv6 messages (NS/NA) to resolve IPv6 addresses to MAC addresses. Also does router discovery."},
    {id:"v604",domain:"IPv6",q:"Which IPv6 address is the loopback address?",choices:["::1","fe80::1","::","ff02::1"],answer:0,explain:"::1 is loopback (equivalent to 127.0.0.1). :: is the unspecified address. ff02::1 is all-nodes multicast."},
    {id:"v605",domain:"IPv6",q:"What is SLAAC?",choices:["Stateless Address Autoconfiguration","Static Link Address Allocation","Subnet Layer Auto Assignment Code","Secure Local Address Access Control"],answer:0,explain:"SLAAC lets IPv6 hosts configure their own address using the network prefix (from Router Advertisement) + EUI-64 interface ID."},
    {id:"v606",domain:"IPv6",q:"Which rule allows consecutive groups of zeros to be abbreviated in IPv6?",choices:[":: replaces one consecutive group of all-zero groups","A single : replaces zeros","Zeros can be dropped entirely","Leading zeros only can be removed"],answer:0,explain:":: can replace ONE consecutive sequence of all-zero groups. Leading zeros in each group can always be dropped."},
    {id:"v607",domain:"IPv6",q:"OSPFv3 is used to route which type of traffic?",choices:["IPv6","IPv4 only","Both IPv4 and IPv6","MPLS"],answer:0,explain:"OSPFv3 supports IPv6. OSPFv2 supports IPv4. Modern implementations use OSPFv3 with address families for both."},
    {id:"v608",domain:"IPv6",q:"What prefix is used for IPv6 link-local addresses?",choices:["fe80::/10","fc00::/7","2000::/3","ff00::/8"],answer:0,explain:"Link-local addresses (fe80::/10) are auto-configured on every IPv6 interface and only usable on the local link."},
  ],

  wireless: [
    {id:"wl01",domain:"Wireless",q:"Which 802.11 standard operates only in the 5 GHz band?",choices:["802.11a","802.11b","802.11g","802.11n"],answer:0,explain:"802.11a = 5GHz only, up to 54 Mbps. 802.11b/g = 2.4GHz. 802.11n = both bands (dual-band)."},
    {id:"wl02",domain:"Wireless",q:"How many non-overlapping channels exist in 2.4 GHz (US)?",choices:["3 (1, 6, 11)","11","14","6"],answer:0,explain:"Channels 1, 6, and 11 are the only non-overlapping channels in 2.4 GHz. Adjacent channels cause co-channel interference."},
    {id:"wl03",domain:"Wireless",q:"What is the role of a Wireless LAN Controller (WLC)?",choices:["Centrally manages lightweight APs","Provides DHCP to wireless clients","Acts as a wireless repeater","Encrypts all wireless traffic"],answer:0,explain:"WLC centrally manages lightweight APs (LAPs). Handles roaming, config, RF management, and security policies."},
    {id:"wl04",domain:"Wireless",q:"Which wireless security protocol is considered most secure?",choices:["WPA3","WPA2","WPA","WEP"],answer:0,explain:"WPA3 (2018) is most secure. WEP is completely broken. WPA2 with AES/CCMP is still widely used and acceptable."},
    {id:"wl05",domain:"Wireless",q:"What is the CAPWAP protocol used for?",choices:["Communication between WLC and lightweight APs","Wireless client authentication","VLAN tagging on wireless frames","QoS for wireless traffic"],answer:0,explain:"CAPWAP (Control And Provisioning of Wireless Access Points) tunnels management and data traffic between lightweight APs and the WLC."},
    {id:"wl06",domain:"Wireless",q:"802.11ac operates in which frequency band?",choices:["5 GHz only","2.4 GHz only","Both 2.4 and 5 GHz","6 GHz only"],answer:0,explain:"802.11ac (Wi-Fi 5) operates in 5 GHz only, up to several Gbps. 802.11ax (Wi-Fi 6) added 6 GHz."},
    {id:"wl07",domain:"Wireless",q:"What does BSS stand for in wireless networking?",choices:["Basic Service Set","Broadcast Signal Strength","Base Station System","Bandwidth Signal Standard"],answer:0,explain:"BSS = single AP with its clients. IBSS = ad-hoc (peer-to-peer). ESS = multiple APs sharing the same SSID."},
    {id:"wl08",domain:"Wireless",q:"Which authentication method uses a RADIUS server for wireless?",choices:["802.1X / EAP","PSK (Pre-Shared Key)","WEP","Open Authentication"],answer:0,explain:"802.1X with EAP uses a RADIUS server to authenticate each user individually. More secure than PSK for enterprise."},
  ],

  security: [
    {id:"sc01",domain:"Security",q:"Which ACL type can filter based on both source AND destination IP?",choices:["Extended ACL","Standard ACL","Named ACL","Dynamic ACL"],answer:0,explain:"Extended ACLs (100-199) filter on src IP, dst IP, protocol, and port. Standard ACLs (1-99) filter src IP only."},
    {id:"sc02",domain:"Security",q:"Where should a Standard ACL be placed?",choices:["Close to the destination","Close to the source","On the core switch","On the WAN link"],answer:0,explain:"Standard ACLs only match source IP. Place near destination to avoid over-blocking traffic to other destinations."},
    {id:"sc03",domain:"Security",q:"What does AAA stand for?",choices:["Authentication, Authorization, Accounting","Access, Authorization, Auditing","Authentication, Access, Auditing","Accounting, Authorization, Access"],answer:0,explain:"AAA: Authentication (who are you?), Authorization (what can you do?), Accounting (what did you do?)."},
    {id:"sc04",domain:"Security",q:"Which protocol does RADIUS use for transport?",choices:["UDP","TCP","Both UDP and TCP","ICMP"],answer:0,explain:"RADIUS uses UDP (ports 1812/1813). TACACS+ uses TCP (port 49) and encrypts the entire packet (more secure)."},
    {id:"sc05",domain:"Security",q:"What is a VLAN hopping attack?",choices:["Attacker gains access to VLANs they shouldn't by exploiting trunk negotiation","Attacker jumps between wireless VLANs","Attacker floods the CAM table","Attacker spoofs VLAN tags"],answer:0,explain:"VLAN hopping exploits DTP (Dynamic Trunking Protocol). Mitigation: disable DTP, change native VLAN from 1, use dedicated trunks."},
    {id:"sc06",domain:"Security",q:"What is the purpose of DHCP snooping?",choices:["Prevents rogue DHCP servers","Encrypts DHCP messages","Speeds up DHCP response","Assigns static IPs to clients"],answer:0,explain:"DHCP snooping builds a binding table of legitimate DHCP leases. Untrusted ports drop DHCP server responses, blocking rogue servers."},
    {id:"sc07",domain:"Security",q:"Port security violation mode that drops frames silently with no log?",choices:["Protect","Restrict","Shutdown","Disabled"],answer:0,explain:"Protect: silently drops. Restrict: drops + logs/increments counter. Shutdown (default): err-disables the port."},
    {id:"sc08",domain:"Security",q:"What does the 'implicit deny' at the end of an ACL mean?",choices:["All traffic not matching an ACL entry is dropped","The last rule always permits all","Deny rules override permit rules","ACL processing stops at first deny"],answer:0,explain:"Every ACL has an invisible 'deny any' at the end. If no rule matches a packet, it's dropped. Always add 'permit ip any any' if needed."},
    {id:"sc09",domain:"Security",q:"Which command enables SSH on a Cisco router (version 2)?",choices:["ip ssh version 2","ssh enable version 2","crypto ssh version 2","enable ssh v2"],answer:0,explain:"Steps: hostname, domain-name, crypto key generate rsa, ip ssh version 2, line vty: transport input ssh."},
    {id:"sc10",domain:"Security",q:"What is Dynamic ARP Inspection (DAI)?",choices:["Validates ARP packets against DHCP snooping binding table","Encrypts ARP broadcasts","Blocks all ARP traffic","Converts ARP to unicast"],answer:0,explain:"DAI prevents ARP poisoning/spoofing by checking ARP packets against the DHCP snooping binding table. Works with DHCP snooping."},
  ],

  automation: [
    {id:"au01",domain:"Automation",q:"Which data format uses curly braces and key-value pairs?",choices:["JSON","XML","YAML","CSV"],answer:0,explain:"JSON (JavaScript Object Notation) uses {} for objects, [] for arrays, and key:value pairs. Most common in REST APIs."},
    {id:"au02",domain:"Automation",q:"REST APIs use which protocol?",choices:["HTTP/HTTPS","SNMP","NETCONF","SSH"],answer:0,explain:"REST (Representational State Transfer) uses HTTP/HTTPS methods: GET, POST, PUT, PATCH, DELETE."},
    {id:"au03",domain:"Automation",q:"What is the difference between a traditional network and an SDN?",choices:["SDN separates control plane from data plane","SDN uses faster hardware","SDN eliminates the need for switches","SDN only works with wireless"],answer:0,explain:"SDN (Software Defined Networking) centralizes the control plane in a controller, leaving switches/routers to handle data plane forwarding only."},
    {id:"au04",domain:"Automation",q:"Which protocol uses YANG data models for network device configuration?",choices:["NETCONF","SNMP","REST","Telnet"],answer:0,explain:"NETCONF uses XML and YANG data models. RESTCONF is similar but uses HTTP/JSON. Both are modern alternatives to SNMP."},
    {id:"au05",domain:"Automation",q:"What does an Ansible playbook use to define tasks?",choices:["YAML","Python","JSON","XML"],answer:0,explain:"Ansible playbooks are written in YAML. Ansible is agentless (uses SSH), making it popular for network automation."},
    {id:"au06",domain:"Automation",q:"Which HTTP method is used to retrieve data from a REST API?",choices:["GET","POST","PUT","DELETE"],answer:0,explain:"REST verbs: GET=read, POST=create, PUT=replace, PATCH=update, DELETE=remove."},
    {id:"au07",domain:"Automation",q:"What is a controller-based network's northbound interface used for?",choices:["Communication between controller and applications","Communication between controller and network devices","Connecting to the internet","Managing physical cabling"],answer:0,explain:"Northbound = controller ↔ applications (REST API). Southbound = controller ↔ network devices (OpenFlow, NETCONF)."},
    {id:"au08",domain:"Automation",q:"Which Cisco platform provides a DNA Center controller?",choices:["Cisco DNA Center (Catalyst Center)","Cisco ASA","Cisco ISE","Cisco Prime"],answer:0,explain:"Cisco DNA Center (now Catalyst Center) is Cisco's SDN controller for campus networks, providing intent-based networking."},
  ],
};

// IOSLabModule function
function IOSLabModule({ onHome }) {
  const [labIdx, setLabIdx] = useState(0);
  const labs = [
    {
      title: "Basic Device Hardening",
      task: "Enter global configuration mode and change the device hostname to 'Core-Switch'.",
      successMsg: "Hostname updated successfully!",
      check: (cmd, full, host, mode) => host === "Core-Switch" && mode === "config"
    },
    {
      title: "Verification Commands",
      task: "Use the abbreviated 'show' command to check the status of all interfaces.",
      successMsg: "You successfully viewed the interface brief!",
      check: (cmd) => cmd === "sh ip int br" || cmd === "show ip int br"
    }
  ];

  return (
    <div>
      <div className="teach-h1">// IOS COMMAND TRAINING</div>
      <div className="teach-info">
        <strong>LAB OBJECTIVE:</strong> {labs[labIdx].task}
      </div>
      <IOSSimulator 
        labScenario={labs[labIdx]} 
        onComplete={() => setTimeout(() => {
          if (labIdx < labs.length - 1) setLabIdx(i => i + 1);
        }, 2000)}
      />
      <div style={{marginTop: 15}}>
        <button className="btn btn-danger" onClick={onHome}>← EXIT LAB</button>
      </div>
    </div>
  );
}

// Flatten all questions for exam mode
const EXAM_POOL = Object.values(ALL_QUESTIONS).flat();

// Domain display names and colors
const DOMAIN_META = {
  Subnetting:  { color: "#00ff41", label: "Subnetting & IP" },
  Routing:     { color: "#00ccff", label: "Routing Protocols" },
  Switching:   { color: "#00ffcc", label: "Switching & VLANs" },
  "IP Services":   { color: "#ffaa00", label: "IP Services" },
  IPv6:        { color: "#aa88ff", label: "IPv6" },
  Wireless:    { color: "#ff88aa", label: "Wireless" },
  Security:    { color: "#ff4444", label: "Security" },
  Automation:  { color: "#44aaff", label: "Automation" },
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function ModuleTabs({ tabs, active, onSelect }) {
  return (
    <div className="mod-tabs">
      {tabs.map(t => <button key={t.id} className={`mod-tab ${active===t.id?"active":""}`} onClick={()=>onSelect(t.id)}>{t.label}</button>)}
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

function ResultScreen({ score, total, onRetry, onLearn, onHome }) {
  const pct = score/total;
  const grade = pct>=0.8?"ACCESS GRANTED":pct>=0.6?"MARGINAL PASS":"ACCESS DENIED";
  const gradeColor = pct>=0.8?"#00ff41":pct>=0.6?"#ffaa00":"#ff4444";
  return (
    <div className="result-screen">
      <div style={{fontSize:11,color:"#00ff4155",marginBottom:8,letterSpacing:3}}>DRILL COMPLETE</div>
      <div className="result-score">{score}/{total}</div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:gradeColor,margin:"12px 0",letterSpacing:2}}>{grade}</div>
      <div style={{fontSize:13,color:"#00ff4188",marginBottom:20}}>
        {pct>=0.8?"Solid understanding of this domain.":pct>=0.6?"Review the weak areas in the LEARN tab.":"Study the concepts carefully before retrying."}
      </div>
      <div style={{display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap"}}>
        <button className="btn" onClick={onRetry}>RETRY</button>
        {onLearn && <button className="btn btn-info" onClick={onLearn}>📖 REVIEW</button>}
        <button className="btn btn-danger" onClick={onHome}>← HOME</button>
      </div>
    </div>
  );
}

// Generic quiz engine — takes a question array and domain color
function QuizEngine({ questions, onHome, learnTab, domain }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [progress] = useProgress();

  const q = questions[idx];
  const pick = (i) => {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.answer;
    if (correct) setScore(s => s+1);
    progress.record(q.id, q.domain, correct);
  };
  const next = () => {
    if (idx+1 >= questions.length) setDone(true);
    else { setIdx(i=>i+1); setSelected(null); }
  };
  const reset = () => { setIdx(0); setScore(0); setSelected(null); setDone(false); };

  if (done) return <ResultScreen score={score} total={questions.length} onRetry={reset} onLearn={learnTab} onHome={onHome} />;

  return (
    <div>
      <StatRow stats={[{val:idx+1,label:"QUESTION"},{val:questions.length,label:"TOTAL"},{val:score,label:"CORRECT"}]} />
      <div className="progress-bar"><div className="progress-fill" style={{width:`${(idx/questions.length)*100}%`}}/></div>
      <div className="subnet-display flicker">{q.domain} · Q{idx+1}</div>
      <div style={{fontSize:13,color:"#00ff41cc",marginBottom:12,lineHeight:1.85,padding:"10px 0"}}>{q.q}</div>
      <div className="answer-grid">
        {q.choices.map((c,i) => (
          <button key={i}
            className={`answer-btn ${selected===i?(i===q.answer?"correct":"wrong"):selected!==null&&i===q.answer?"correct":""}`}
            onClick={()=>pick(i)}>
            [{String.fromCharCode(65+i)}] {c}
          </button>
        ))}
      </div>
      {selected !== null && (
        <div className={`feedback ${selected===q.answer?"ok":"bad"}`}>
          <strong>{selected===q.answer?"✓ CORRECT":"✗ INCORRECT"}</strong> — {q.explain}
          <div style={{marginTop:10}}><button className="btn" onClick={next}>{idx+1>=questions.length?"VIEW RESULTS":"NEXT ›"}</button></div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRESS HOOK ────────────────────────────────────────────────────────────

function useProgress() {
  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ccna_progress") || "{}"); }
    catch { return {}; }
  });

  const record = useCallback((qId, domain, correct) => {
    setData(prev => {
      const next = { ...prev };
      if (!next[qId]) next[qId] = { domain, attempts: 0, correct: 0 };
      next[qId].attempts += 1;
      if (correct) next[qId].correct += 1;
      try { localStorage.setItem("ccna_progress", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setData({});
    try { localStorage.removeItem("ccna_progress"); } catch {}
  }, []);

  const getDomainStats = useCallback(() => {
    const domains = {};
    Object.values(data).forEach(entry => {
      if (!domains[entry.domain]) domains[entry.domain] = { attempts: 0, correct: 0 };
      domains[entry.domain].attempts += entry.attempts;
      domains[entry.domain].correct += entry.correct;
    });
    return domains;
  }, [data]);

  const getWeakSpots = useCallback(() => {
    return Object.entries(data)
      .filter(([,v]) => v.attempts >= 2)
      .map(([id,v]) => ({ id, domain: v.domain, pct: Math.round((v.correct/v.attempts)*100), attempts: v.attempts }))
      .filter(x => x.pct < 70)
      .sort((a,b) => a.pct - b.pct)
      .slice(0, 8);
  }, [data]);

  const getStreak = useCallback(() => {
    const ids = Object.keys(data);
    let streak = 0;
    for (let i = ids.length-1; i >= 0; i--) {
      const d = data[ids[i]];
      if (d.attempts > 0 && d.correct === d.attempts) streak++;
      else break;
    }
    return streak;
  }, [data]);

  return [{ data, record, reset, getDomainStats, getWeakSpots, getStreak }];
}

// ─── MAGIC NUMBER CALCULATOR ──────────────────────────────────────────────────

function MagicNumberCalc() {
  const [ip, setIp] = useState("192.168.1.130");
  const [cidr, setCidr] = useState("26");

  const compute = () => {
    const prefix = parseInt(cidr, 10);
    if (isNaN(prefix) || prefix < 1 || prefix > 32) return null;
    const octets = ip.split(".").map(Number);
    if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) return null;
    const ipNum = (octets[0]<<24 | octets[1]<<16 | octets[2]<<8 | octets[3]) >>> 0;
    const maskNum = prefix===0?0:(0xFFFFFFFF<<(32-prefix))>>>0;
    const maskOctets = [(maskNum>>>24)&0xFF,(maskNum>>>16)&0xFF,(maskNum>>>8)&0xFF,maskNum&0xFF];
    const netNum = (ipNum & maskNum) >>> 0;
    const netOctets = [(netNum>>>24)&0xFF,(netNum>>>16)&0xFF,(netNum>>>8)&0xFF,netNum&0xFF];
    const wildcard = (~maskNum)>>>0;
    const bcNum = (netNum | wildcard)>>>0;
    const bcOctets = [(bcNum>>>24)&0xFF,(bcNum>>>16)&0xFF,(bcNum>>>8)&0xFF,bcNum&0xFF];
    const firstOctets = [...netOctets]; firstOctets[3]+=1;
    const lastOctets = [...bcOctets]; lastOctets[3]-=1;
    const hostBits = 32-prefix;
    const totalAddresses = Math.pow(2,hostBits);
    const usableHosts = Math.max(0,totalAddresses-2);
    let interestingOctet = 3;
    for (let i=0;i<4;i++) { if (maskOctets[i]!==255){interestingOctet=i;break;} }
    const magicNumber = 256-maskOctets[interestingOctet];
    const networkInteresting = netOctets[interestingOctet];
    const blocks = [];
    const start = Math.max(0,networkInteresting-magicNumber*3);
    for (let b=start;b<=255;b+=magicNumber) { if(blocks.length>12)break; blocks.push(b); }
    const ipBits = [];
    for (let i=31;i>=0;i--) ipBits.unshift((ipNum>>>i)&1);
    return { ip:octets,cidrPrefix:prefix,mask:maskOctets,network:netOctets,broadcast:bcOctets,
      firstHost:firstOctets,lastHost:lastOctets,hostBits,totalAddresses,usableHosts,magicNumber,
      interestingOctet,blocks,networkInteresting,ipBits,
      wildcard:[(wildcard>>>24)&0xFF,(wildcard>>>16)&0xFF,(wildcard>>>8)&0xFF,wildcard&0xFF] };
  };

  const r = compute();

  return (
    <div>
      <div className="teach-h1">// MAGIC NUMBER CALCULATOR</div>
      <div className="teach-p">Type any IP and CIDR prefix — all subnet math computes instantly with visual bit mapping.</div>
      <div className="magic-input-row">
        <input className="magic-input" value={ip} onChange={e=>setIp(e.target.value)} placeholder="192.168.1.130" spellCheck={false}/>
        <span style={{fontSize:20,color:"#00ff4166"}}>/</span>
        <input className="magic-cidr-input" value={cidr} onChange={e=>setCidr(e.target.value.replace(/\D/g,"").slice(0,2))} placeholder="26"/>
        <span style={{fontSize:12,color:"#00ff4155"}}>← type any valid IP and prefix</span>
      </div>
      {!r && <div className="magic-error">✗ Invalid input — enter a valid IP (e.g. 192.168.1.130) and prefix (1–32).</div>}
      {r && <>
        <div className="teach-h2" style={{marginTop:0}}>32-BIT VISUALIZATION</div>
        <div className="bit-legend">
          <div className="bit-legend-item"><div className="bit-legend-swatch" style={{background:"rgba(0,255,65,0.14)",borderColor:"#00ff4166"}}/><span>Network bits ({r.cidrPrefix})</span></div>
          <div className="bit-legend-item"><div className="bit-legend-swatch" style={{background:"rgba(0,204,255,0.07)",borderColor:"#00ccff44"}}/><span>Host bits ({r.hostBits})</span></div>
        </div>
        <div className="bit-grid">
          {[0,1,2,3].map(octet => (
            <div key={octet} style={{display:"flex",flexDirection:"column"}}>
              <div className="bit-group">
                {[0,1,2,3,4,5,6,7].map(bit => {
                  const gb = octet*8+bit;
                  return (
                    <div key={bit} className={`bit-cell ${gb<r.cidrPrefix?"net":"host"}`}>
                      {r.ipBits[gb]}<span className="bit-pos">{Math.pow(2,7-bit)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="octet-val">{r.ip[octet]}</div>
              <div className="octet-label">Octet {octet+1}</div>
            </div>
          ))}
        </div>
        <div className="teach-h2">STEP-BY-STEP CALCULATION</div>
        <div className="step-box">
          {[
            {n:1,text:<>Mask for <span className="step-highlight">/{r.cidrPrefix}</span> = <span className="step-highlight">{r.mask.join(".")}</span></>},
            {n:2,text:<>Magic Number = 256 − {r.mask[r.interestingOctet]} = <span style={{color:"#ffaa00",fontSize:16,fontWeight:500}}>{r.magicNumber}</span> (block size in octet {r.interestingOctet+1})</>},
            {n:3,text:<>Count in blocks of {r.magicNumber}: <div className="block-row">{r.blocks.map(b=><div key={b} className={`block-item ${b===r.networkInteresting?"current-block":""}`}>{b}{b===r.networkInteresting?" ←":""}</div>)}</div><span style={{fontSize:11,color:"#00ff4155"}}>{r.ip[r.interestingOctet]} falls in the {r.networkInteresting} block</span></>},
            {n:4,text:<><span className="step-highlight">Network</span>: {r.network.join(".")} &nbsp;|&nbsp; <span className="step-highlight">Broadcast</span>: {r.broadcast.join(".")}</>},
            {n:5,text:<><span className="step-highlight">First host</span>: {r.firstHost.join(".")} &nbsp;|&nbsp; <span className="step-highlight">Last host</span>: {r.lastHost.join(".")} &nbsp;|&nbsp; <span className="step-calc">Usable: 2^{r.hostBits}−2 = {r.usableHosts}</span></>},
          ].map(s=>(
            <div className="step-line" key={s.n}><span className="step-num">{s.n}</span><span className="step-text">{s.text}</span></div>
          ))}
        </div>
        <div className="teach-h2">COMPUTED VALUES</div>
        <div className="magic-results">
          {[["IP ADDRESS",r.ip.join("."),`/${r.cidrPrefix}`],["SUBNET MASK",r.mask.join("."),`Wildcard: ${r.wildcard.join(".")}`],["NETWORK",r.network.join("."),"First address (not usable)"],["BROADCAST",r.broadcast.join("."),"Last address (not usable)"],["FIRST HOST",r.firstHost.join("."),"First usable"],["LAST HOST",r.lastHost.join("."),"Last usable"],[`USABLE HOSTS`,r.usableHosts.toLocaleString(),`2^${r.hostBits} − 2`],["MAGIC NUMBER",r.magicNumber,`Block size (256 − ${r.mask[r.interestingOctet]})`]].map(([l,v,s])=>(
            <div className="magic-result-card" key={l}>
              <div className="magic-result-label">{l}</div>
              <div className="magic-result-val">{v}</div>
              <div className="magic-result-sub">{s}</div>
            </div>
          ))}
        </div>
        <div className="teach-tip">Magic Number = 256 minus the interesting octet of the mask. Count up in blocks of that size — your IP's block = your subnet.</div>
      </>}
    </div>
  );
}

// ─── EXAM SIMULATOR ──────────────────────────────────────────────────────────

const EXAM_DURATION = 60 * 60; // 60 minutes in seconds

function ExamSimulator({ onHome }) {
  const [phase, setPhase] = useState("intro"); // intro | exam | results
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({}); // qIdx -> chosen answer index
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [progress] = useProgress();
  const timerRef = useRef(null);

  const startExam = (numQ) => {
    // Shuffle and pick questions proportional to domain weights (matching real CCNA)
    const weights = {
      Subnetting: 15, Routing: 15, Switching: 15,
      "IP Services": 12, IPv6: 10, Wireless: 10,
      Security: 13, Automation: 10,
    };
    const pool = [];
    Object.entries(ALL_QUESTIONS).forEach(([key, qs]) => {
      const domainName = qs[0]?.domain;
      const weight = weights[domainName] || 10;
      const count = Math.max(1, Math.round((weight / 100) * numQ));
      const shuffled = [...qs].sort(() => Math.random()-0.5);
      pool.push(...shuffled.slice(0, count));
    });
    const final = pool.sort(() => Math.random()-0.5).slice(0, numQ);
    setQuestions(final);
    setAnswers({});
    setFlagged(new Set());
    setCurrentQ(0);
    setTimeLeft(EXAM_DURATION);
    setPhase("exam");
  };

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setPhase("results"); return 0; }
        return t-1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const formatTime = (s) => {
    const m = Math.floor(s/60);
    const sec = s%60;
    return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
  };

  const submitExam = () => {
    clearInterval(timerRef.current);
    // Record all answers to progress
    questions.forEach((q, i) => {
      if (answers[i] !== undefined) {
        progress.record(q.id, q.domain, answers[i] === q.answer);
      }
    });
    setPhase("results");
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(currentQ) ? next.delete(currentQ) : next.add(currentQ);
      return next;
    });
  };

  // ── INTRO SCREEN
  if (phase === "intro") return (
    <div>
      <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,color:"#ffaa00",marginBottom:16,letterSpacing:2}}>
        ⏱ EXAM SIMULATOR — CCNA 200-301
      </div>
      <div className="teach-p">Simulates the real CCNA exam experience: timed, question navigator, flag-for-review, and domain breakdown at the end.</div>
      <div className="teach-info">The real CCNA 200-301 has 100–120 questions in 120 minutes. These practice sessions use ~40 questions in 60 minutes for focused drilling.</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10,margin:"20px 0"}}>
        {[{n:20,label:"Quick Drill",desc:"~20 min · Good for daily review"},{n:40,label:"Standard Exam",desc:"~60 min · Best exam simulation"},{n:60,label:"Extended Exam",desc:"~90 min · Deep coverage"}].map(opt => (
          <div key={opt.n} className="module-card" style={{cursor:"pointer"}} onClick={()=>startExam(opt.n)}>
            <div className="module-icon" style={{fontSize:22}}>⏱</div>
            <div className="module-title" style={{color:"#ffaa00",fontFamily:"'Orbitron',sans-serif",fontSize:13}}>{opt.label}</div>
            <div className="module-desc">{opt.desc}</div>
            <div className="module-tag" style={{color:"#ffaa0088",borderColor:"#ffaa0033"}}>{opt.n} QUESTIONS</div>
          </div>
        ))}
      </div>
      <div className="teach-h2" style={{marginTop:16}}>DOMAIN WEIGHTING</div>
      <table className="teach-table">
        <thead><tr><th>Domain</th><th>Weight</th><th>Topics</th></tr></thead>
        <tbody>
          {[["Network Fundamentals","15%","OSI, cables, topologies, Ethernet"],["Network Access","15%","VLANs, STP, EtherChannel, wireless"],["IP Connectivity","15%","Routing protocols, static routes, OSPF"],["IP Services","12%","NAT, DHCP, NTP, SNMP, DNS"],["Security Fundamentals","13%","ACLs, AAA, VPN, port security"],["Automation","10%","SDN, REST, Ansible, JSON/YAML"],["IPv6","10%","Addressing, routing, NDP, SLAAC"],["Wireless","10%","Standards, WLC, CAPWAP, WPA"]].map(([d,w,t]) => (
            <tr key={d}><td style={{color:"#00ff41"}}>{d}</td><td style={{color:"#ffaa00"}}>{w}</td><td>{t}</td></tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:16}}>
        <button className="btn btn-danger" onClick={onHome}>← BACK TO HOME</button>
      </div>
    </div>
  );

  // ── RESULTS SCREEN
  if (phase === "results") {
    const totalAnswered = Object.keys(answers).length;
    const totalCorrect = Object.entries(answers).filter(([i,a]) => questions[i] && a===questions[i].answer).length;
    const pct = Math.round((totalCorrect/questions.length)*100);
    const passed = pct >= 82; // CCNA passing ~825/1000

    const domainResults = {};
    questions.forEach((q,i) => {
      if (!domainResults[q.domain]) domainResults[q.domain] = { total:0, correct:0 };
      domainResults[q.domain].total++;
      if (answers[i]===q.answer) domainResults[q.domain].correct++;
    });

    return (
      <div>
        <div className="result-screen" style={{paddingBottom:0}}>
          <div style={{fontSize:11,color:"#ffaa0088",letterSpacing:3,marginBottom:8}}>EXAM COMPLETE</div>
          <div className="result-score" style={{color:passed?"#00ff41":"#ff4444"}}>{pct}%</div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:passed?"#00ff41":"#ff4444",margin:"10px 0",letterSpacing:2}}>
            {passed?"PASS — CCNA READY":"FAIL — KEEP STUDYING"}
          </div>
          <div style={{fontSize:13,color:"#00ff4188",marginBottom:4}}>{totalCorrect}/{questions.length} correct · {totalAnswered} answered</div>
          <div style={{fontSize:12,color:"#00ff4155",marginBottom:20}}>CCNA passing score ≈ 825/1000 (~82%)</div>
        </div>

        <div className="teach-h2">PERFORMANCE BY DOMAIN</div>
        <div className="exam-result-grid">
          {Object.entries(domainResults).map(([domain,{total,correct}]) => {
            const dpct = Math.round((correct/total)*100);
            const meta = DOMAIN_META[domain] || { color:"#00ff41" };
            return (
              <div className="exam-domain-card" key={domain}>
                <div className="exam-domain-name">{domain}</div>
                <div className="exam-domain-score" style={{color:meta.color}}>{dpct}%</div>
                <div className="exam-domain-bar"><div className="exam-domain-fill" style={{width:`${dpct}%`,background:dpct>=80?meta.color:dpct>=60?"#ffaa00":"#ff4444"}}/></div>
                <div style={{fontSize:11,color:"#00ff4155"}}>{correct}/{total} correct</div>
              </div>
            );
          })}
        </div>

        <div className="teach-h2">QUESTION REVIEW</div>
        <div style={{display:"grid",gap:8}}>
          {questions.map((q,i) => {
            const userAnswer = answers[i];
            const correct = userAnswer===q.answer;
            const answered = userAnswer !== undefined;
            return (
              <div key={i} style={{border:`1px solid ${correct?"#00ff4133":answered?"#ff333333":"#00ff4122"}`,padding:"10px 14px",background:correct?"rgba(0,255,65,0.02)":answered?"rgba(255,51,51,0.03)":"transparent"}}>
                <div style={{fontSize:12,color:correct?"#00ff41":answered?"#ff6666":"#ffaa00",marginBottom:4}}>
                  {correct?"✓":answered?"✗":"⊘"} Q{i+1} [{q.domain}]
                </div>
                <div style={{fontSize:12,color:"#00ff41aa",marginBottom:6}}>{q.q}</div>
                {answered && !correct && <div style={{fontSize:11,color:"#ff888888"}}>Your answer: {q.choices[userAnswer]}</div>}
                <div style={{fontSize:11,color:"#00ff4188"}}>Correct: {q.choices[q.answer]}</div>
                {answered && !correct && <div style={{fontSize:11,color:"#00ff4155",marginTop:4}}>{q.explain}</div>}
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
          <button className="btn btn-gold" onClick={()=>startExam(questions.length)}>RETAKE</button>
          <button className="btn btn-danger" onClick={onHome}>← HOME</button>
        </div>
      </div>
    );
  }

  // ── EXAM IN PROGRESS
  const q = questions[currentQ];
  const isFlagged = flagged.has(currentQ);
  const danger = timeLeft < 300;

  return (
    <div>
      <div className="exam-header">
        <div>
          <div style={{fontSize:10,color:"#ffaa0077",letterSpacing:2,marginBottom:2}}>TIME REMAINING</div>
          <div className={`exam-timer ${danger?"danger":""}`}>{formatTime(timeLeft)}</div>
        </div>
        <div>
          <div className="exam-question-counter">Question {currentQ+1} of {questions.length}</div>
          <div style={{fontSize:11,color:"#ffaa0055",marginTop:2}}>{Object.keys(answers).length} answered · {flagged.size} flagged</div>
        </div>
        <button className={`exam-flag-btn ${isFlagged?"flagged":""}`} onClick={toggleFlag}>
          {isFlagged?"⚑ FLAGGED":"⚐ FLAG FOR REVIEW"}
        </button>
      </div>

      <div style={{display:"flex",gap:14,marginBottom:14,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:11,color:DOMAIN_META[q.domain]?.color||"#00ff41",marginBottom:8,letterSpacing:1}}>[{q.domain}]</div>
          <div style={{fontSize:14,color:"#00ff41cc",lineHeight:1.85,marginBottom:14}}>{q.q}</div>
          <div className="answer-grid">
            {q.choices.map((c,i) => (
              <button key={i}
                className={`answer-btn ${answers[currentQ]===i?(i===q.answer?"correct":"wrong"):""}`}
                onClick={()=>setAnswers(prev=>({...prev,[currentQ]:i}))}>
                [{String.fromCharCode(65+i)}] {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <button className="btn" disabled={currentQ===0} onClick={()=>setCurrentQ(i=>i-1)}>‹ PREV</button>
        <button className="btn" disabled={currentQ>=questions.length-1} onClick={()=>setCurrentQ(i=>i+1)}>NEXT ›</button>
        <button className="btn btn-gold" style={{marginLeft:"auto"}} onClick={submitExam}>SUBMIT EXAM</button>
      </div>

      <div style={{fontSize:11,color:"#00ff4155",marginBottom:6,letterSpacing:1}}>QUESTION NAVIGATOR</div>
      <div className="exam-nav">
        {questions.map((_,i) => (
          <button key={i}
            className={`exam-q-dot ${i===currentQ?"current":""} ${flagged.has(i)?"flagged":""} ${answers[i]!==undefined?"answered":""}`}
            onClick={()=>setCurrentQ(i)}>
            {i+1}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── PROGRESS TRACKER ────────────────────────────────────────────────────────

function ProgressTracker({ onHome }) {
  const [progress] = useProgress();
  const domainStats = progress.getDomainStats();
  const weakSpots = progress.getWeakSpots();
  const streak = progress.getStreak();
  const totalAttempts = Object.values(progress.data).reduce((s,v)=>s+v.attempts,0);
  const totalCorrect = Object.values(progress.data).reduce((s,v)=>s+v.correct,0);
  const overall = totalAttempts>0 ? Math.round((totalCorrect/totalAttempts)*100) : 0;

  return (
    <div className="progress-page">
      <div className="progress-header">// PERFORMANCE DASHBOARD</div>

      <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
        <div style={{border:"1px solid #00ccff44",padding:"12px 20px",background:"rgba(0,204,255,0.03)",textAlign:"center",minWidth:120}}>
          <div style={{fontSize:10,color:"#00ccff55",letterSpacing:2,marginBottom:4}}>OVERALL</div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:32,color:overall>=80?"#00ff41":overall>=60?"#ffaa00":"#ff4444"}}>{overall}%</div>
          <div style={{fontSize:11,color:"#00ccff55"}}>{totalCorrect}/{totalAttempts} correct</div>
        </div>
        <div style={{border:"1px solid #ffdd0033",padding:"12px 20px",background:"rgba(255,221,0,0.02)",textAlign:"center",minWidth:120}}>
          <div style={{fontSize:10,color:"#ffdd0055",letterSpacing:2,marginBottom:4}}>STREAK</div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:32,color:"#ffdd00"}}>{streak}</div>
          <div style={{fontSize:11,color:"#ffdd0055"}}>consecutive ✓</div>
        </div>
        <div style={{border:"1px solid #00ff4133",padding:"12px 20px",background:"rgba(0,255,65,0.02)",textAlign:"center",minWidth:120}}>
          <div style={{fontSize:10,color:"#00ff4155",letterSpacing:2,marginBottom:4}}>QUESTIONS</div>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:32,color:"#00ff41"}}>{totalAttempts}</div>
          <div style={{fontSize:11,color:"#00ff4155"}}>total attempts</div>
        </div>
      </div>

      <div className="teach-h2" style={{marginTop:0}}>PERFORMANCE BY DOMAIN</div>
      <div className="progress-grid">
        {Object.entries(DOMAIN_META).map(([domain,meta]) => {
          const stats = domainStats[domain] || {attempts:0,correct:0};
          const pct = stats.attempts>0 ? Math.round((stats.correct/stats.attempts)*100) : null;
          const fillClass = pct===null?"":pct>=80?"":"warn"+(pct<60?" danger":"");
          return (
            <div className="progress-card" key={domain} style={{borderColor:meta.color+"33"}}>
              <div className="progress-card-title" style={{color:meta.color+"99"}}>{meta.label}</div>
              {pct===null
                ? <div style={{fontSize:12,color:"#00ff4133",marginTop:8}}>No data yet</div>
                : <>
                    <div className="progress-pct" style={{color:pct>=80?meta.color:pct>=60?"#ffaa00":"#ff4444"}}>{pct}%</div>
                    <div className="progress-bar-wrap" style={{marginTop:6}}>
                      <div className="progress-bar-fill" style={{width:`${pct}%`,background:pct>=80?meta.color:pct>=60?"#ffaa00":"#ff4444"}}/>
                    </div>
                    <div className="progress-attempts">{stats.correct}/{stats.attempts} correct</div>
                  </>
              }
            </div>
          );
        })}
      </div>

      {weakSpots.length > 0 && (
        <>
          <div className="teach-h2">WEAK SPOTS — NEEDS REVIEW</div>
          <div className="weak-spot-list">
            <div className="weak-spot-title">⚠ QUESTIONS YOU FREQUENTLY MISS</div>
            {weakSpots.map(ws => {
              const q = EXAM_POOL.find(x=>x.id===ws.id);
              return q ? (
                <div className="weak-spot-item" key={ws.id}>
                  <span className="weak-spot-pct">{ws.pct}%</span>
                  <div>
                    <div style={{fontSize:12,color:"#ff8888aa"}}>[{ws.domain}] {q.q.slice(0,70)}{q.q.length>70?"...":""}</div>
                    <div style={{fontSize:11,color:"#ff444466"}}>{ws.attempts} attempts</div>
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </>
      )}

      {totalAttempts === 0 && (
        <div className="teach-info">No data yet — complete some drills or an exam to see your performance tracked here.</div>
      )}

      <div style={{display:"flex",gap:10,marginTop:16,flexWrap:"wrap"}}>
        <button className="btn btn-danger" style={{fontSize:11}} onClick={()=>{if(window.confirm("Reset all progress data?"))progress.reset();}}>RESET DATA</button>
        <button className="btn btn-info" onClick={onHome}>← HOME</button>
      </div>
    </div>
  );
}

// ─── IOS SIMULATOR COMPONENT ───────────────────────────────────────

function IOSSimulator({ labScenario, onComplete }) {
  const [history, setHistory] = useState([
    "Cisco IOS Software, C2960 Software (C2960-LANBASEK9-M), Version 15.0(2)SE4",
    "Copyright (c) 1986-2013 by Cisco Systems, Inc.",
    "Compiled Wed 26-Jun-13 02:49 by mclaire",
    ""
  ]);
  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState("user"); // user, privileged, config
  const [hostname, setHostname] = useState("Switch");
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const terminalEndRef = useRef(null);

  const getPrompt = () => {
    if (mode === "user") return `${hostname}>`;
    if (mode === "privileged") return `${hostname}#`;
    if (mode === "config") return `${hostname}(config)#`;
    return `${hostname}>`;
  };

  const scrollToBottom = () => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [history]);

  const handleCommand = (e) => {
    if (e.key === "Enter") {
      const cmd = inputValue.trim().toLowerCase();
      const fullCmd = inputValue.trim();
      processCommand(cmd, fullCmd);
      setInputValue("");
      setHistoryIdx(-1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIdx = Math.min(historyIdx + 1, commandHistory.length - 1);
        setHistoryIdx(newIdx);
        setInputValue(commandHistory[commandHistory.length - 1 - newIdx]);
      }
    }
  };

  const processCommand = (cmd, fullCmd) => {
    let output = [];
    const newHistory = [...history, `${getPrompt()} ${fullCmd}`];
    
    if (fullCmd) setCommandHistory(prev => [...prev, fullCmd]);

    // Command Logic
    if (cmd === "enable" || cmd === "en") {
      setMode("privileged");
    } else if ((cmd === "configure terminal" || cmd === "conf t") && mode === "privileged") {
      setMode("config");
    } else if (cmd === "exit" || cmd === "ex") {
      if (mode === "config") setMode("privileged");
      else if (mode === "privileged") setMode("user");
    } else if (cmd.startsWith("hostname ") && mode === "config") {
      const newName = fullCmd.split(" ")[1];
      setHostname(newName);
    } else if (cmd === "show ip int br" || cmd === "sh ip int br") {
      output = [
        "Interface              IP-Address      OK? Method Status                Protocol",
        "FastEthernet0/1        unassigned      YES unset  up                    up",
        "FastEthernet0/2        unassigned      YES unset  down                  down",
        "Vlan1                  192.168.1.1     YES manual up                    up"
      ];
    } else if (cmd === "?" || cmd === "help") {
      output = mode === "config" 
        ? ["  hostname    Set system's network name", "  exit        Exit from configure mode", "  interface   Select an interface to configure"]
        : ["  enable      Turn on privileged commands", "  show        Show running system information", "  exit        Exit from the EXEC"];
    } else if (cmd !== "") {
      output = [`% Invalid input detected at '^' marker.`];
    }

    setHistory([...newHistory, ...output]);
    
    // Check Lab Objective
    if (labScenario && labScenario.check(cmd, fullCmd, hostname, mode)) {
      setHistory(prev => [...prev, "", "💡 OBJECTIVE COMPLETE: " + labScenario.successMsg]);
      if (onComplete) onComplete();
    }
  };

  const handleTabCompletion = () => {
    const commands = ["enable", "configure terminal", "show ip interface brief", "hostname", "exit"];
    const match = commands.find(c => c.startsWith(inputValue.toLowerCase()));
    if (match) setInputValue(match);
  };

  return (
    <div className="ios-terminal" onClick={() => document.getElementById('ios-input').focus()}>
      <div className="ios-history">
        {history.map((line, i) => <div key={i}>{line}</div>)}
        <div className="ios-input-line">
          <span>{getPrompt()}</span>
          <input 
            id="ios-input"
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleCommand}
            autoComplete="off"
            spellCheck="false"
          />
          <span className="cursor"></span>
        </div>
        <div ref={terminalEndRef} />
      </div>
    </div>
  );
}

// ─── TEACH CONTENT ────────────────────────────────────────────────────────────

function IPServicesLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// IP SERVICES: NAT, DHCP, DNS, NTP, SNMP</div>
      <div className="teach-p">IP Services are the supporting protocols that make networks usable. They handle address translation, automatic IP assignment, name resolution, time synchronization, and monitoring.</div>

      <div className="teach-h2">NAT — NETWORK ADDRESS TRANSLATION</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Static NAT</div><div className="teach-card-body">One-to-one permanent mapping. Inside local ↔ inside global. Used for servers needing a consistent public IP.</div></div>
        <div className="teach-card"><div className="teach-card-title">Dynamic NAT</div><div className="teach-card-body">Pool of public IPs shared among private hosts. Mapping is temporary. No port sharing — limited scalability.</div></div>
        <div className="teach-card"><div className="teach-card-title">PAT / NAT Overload</div><div className="teach-card-body">Many private IPs → one public IP using unique port numbers. Most common in homes/offices. Tracks sessions by port.</div></div>
        <div className="teach-card"><div className="teach-card-title">NAT Terminology</div><div className="teach-card-body">Inside Local = private host IP. Inside Global = public IP for host. Outside Global = destination IP. Outside Local = rare.</div></div>
      </div>
      <div className="teach-code">{`! Static NAT
ip nat inside source static 192.168.1.10 203.0.113.10
interface gi0/0
 ip nat inside
interface gi0/1
 ip nat outside

! PAT (overload)
ip nat inside source list 1 interface gi0/1 overload
access-list 1 permit 192.168.1.0 0.0.0.255`}</div>
      <div className="teach-tip">PAT = NAT Overload. The exam uses both terms. When you see "many-to-one NAT" or "port numbers used for translation" → PAT.</div>

      <div className="teach-h2">DHCP</div>
      <div className="teach-p">DORA process: <strong>D</strong>iscover → <strong>O</strong>ffer → <strong>R</strong>equest → <strong>A</strong>cknowledge. Client broadcasts, server responds.</div>
      <div className="teach-code">{`! DHCP Server config
ip dhcp excluded-address 192.168.1.1 192.168.1.10
ip dhcp pool OFFICE
 network 192.168.1.0 255.255.255.0
 default-router 192.168.1.1
 dns-server 8.8.8.8
 lease 7

! DHCP Relay (ip helper-address)
interface gi0/0
 ip helper-address 10.0.0.5  ! Forward DHCP broadcasts to server`}</div>
      <div className="teach-tip">If clients get 169.254.x.x addresses → DHCP failure (APIPA). Check: DHCP server reachable? Helper-address configured? Pool not exhausted?</div>

      <div className="teach-h2">KEY PORT NUMBERS</div>
      <table className="teach-table">
        <thead><tr><th>Protocol</th><th>Port</th><th>Transport</th><th>Purpose</th></tr></thead>
        <tbody>
          {[["DNS","53","UDP/TCP","Name resolution"],["DHCP","67 (server) / 68 (client)","UDP","Address assignment"],["HTTP","80","TCP","Web (unencrypted)"],["HTTPS","443","TCP","Web (encrypted)"],["Telnet","23","TCP","Remote CLI (insecure)"],["SSH","22","TCP","Remote CLI (secure)"],["SNMP","161/162","UDP","Network monitoring"],["NTP","123","UDP","Time synchronization"],["FTP","20/21","TCP","File transfer"],["SMTP","25","TCP","Email sending"],["TFTP","69","UDP","Trivial file transfer"],["Syslog","514","UDP","Log messages"]].map(r=><tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td style={{color:"#ffaa00"}}>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">Port numbers are heavily tested. Memorize: 22(SSH), 23(Telnet), 25(SMTP), 53(DNS), 67/68(DHCP), 80(HTTP), 110(POP3), 443(HTTPS).</div>

      <div className="teach-h2">NTP & SNMP</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">NTP (port 123)</div><div className="teach-card-body">Synchronizes device clocks. Stratum 1 = directly connected to reference clock. Each hop adds 1. Cisco default: NTP stratum 8. Config: ntp server x.x.x.x</div></div>
        <div className="teach-card"><div className="teach-card-title">SNMP (ports 161/162)</div><div className="teach-card-body">Manager polls agents (GET/SET). Agents send traps on events. v1/v2c use community strings. SNMPv3 adds encryption + authentication.</div></div>
      </div>
    </div>
  );
}

function IPv6Learn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// IPv6 ADDRESSING & ROUTING</div>
      <div className="teach-p">IPv6 uses 128-bit addresses (vs IPv4's 32-bit) to solve address exhaustion. Written as 8 groups of 4 hex digits separated by colons.</div>

      <div className="teach-h2">ADDRESS TYPES</div>
      <table className="teach-table">
        <thead><tr><th>Type</th><th>Prefix</th><th>Scope</th><th>Notes</th></tr></thead>
        <tbody>
          {[["Global Unicast","2000::/3","Internet-routable","Equivalent to public IPv4"],["Unique Local","fc00::/7","Private","≈ RFC 1918 private space"],["Link-Local","fe80::/10","Link only","Auto-configured, not routable, always present"],["Loopback","::1/128","Local only","≡ 127.0.0.1"],["Unspecified","::","N/A","Used in DHCP before address assigned"],["Multicast","ff00::/8","Group","Replaces broadcast in IPv6"],["Solicited-Node Multicast","ff02::1:ff00:0/104","Link","Used by NDP for address resolution"]].map(r=><tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td style={{color:"#aa88ff"}}>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>

      <div className="teach-h2">ABBREVIATION RULES</div>
      <div className="teach-code">{`Full:       2001:0db8:0000:0000:0000:0000:0000:0001
Rule 1 — Drop leading zeros per group:
            2001:db8:0:0:0:0:0:1
Rule 2 — Replace ONE consecutive all-zero group sequence with :::
            2001:db8::1

Examples:
  fe80:0000:0000:0000:0200:5eff:fe00:5301
  → fe80::200:5eff:fe00:5301

  0000:0000:0000:0000:0000:0000:0000:0001
  → ::1  (loopback)`}</div>
      <div className="teach-tip">:: can only appear ONCE in an address. If you see :: twice — it's invalid. The exam may show trick addresses to identify.</div>

      <div className="teach-h2">NEIGHBOR DISCOVERY PROTOCOL (NDP)</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Replaces ARP</div><div className="teach-card-body">Uses ICMPv6 Neighbor Solicitation (NS) and Neighbor Advertisement (NA) to resolve IPv6 → MAC. No broadcast — uses multicast.</div></div>
        <div className="teach-card"><div className="teach-card-title">Router Discovery</div><div className="teach-card-body">Hosts send Router Solicitation (RS). Routers reply with Router Advertisement (RA) containing prefix info for SLAAC.</div></div>
      </div>

      <div className="teach-h2">SLAAC vs DHCPv6</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">SLAAC (Stateless)</div><div className="teach-card-body">Host uses prefix from RA + generates its own 64-bit interface ID (from MAC via EUI-64 or random). No server needed. The "M" flag in RA = 0.</div></div>
        <div className="teach-card"><div className="teach-card-title">DHCPv6 (Stateful)</div><div className="teach-card-body">Works like DHCPv4 but for IPv6. Server assigns full address. "M" flag in RA = 1. Useful when you need address tracking.</div></div>
      </div>

      <div className="teach-h2">IPv6 ROUTING CONFIGURATION</div>
      <div className="teach-code">{`! Enable IPv6 routing
ipv6 unicast-routing

! Configure interface
interface gi0/0
 ipv6 address 2001:db8:1::1/64
 ipv6 address fe80::1 link-local
 no shutdown

! Static route
ipv6 route 2001:db8:2::/48 2001:db8:1::2

! OSPFv3
ipv6 router ospf 1
 router-id 1.1.1.1
interface gi0/0
 ipv6 ospf 1 area 0`}</div>
    </div>
  );
}

function WirelessLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// WIRELESS — 802.11 & WLC ARCHITECTURE</div>

      <div className="teach-h2">802.11 STANDARDS COMPARISON</div>
      <table className="teach-table">
        <thead><tr><th>Standard</th><th>Band</th><th>Max Speed</th><th>Notes</th></tr></thead>
        <tbody>
          {[["802.11a","5 GHz","54 Mbps","5GHz only — less interference, shorter range"],["802.11b","2.4 GHz","11 Mbps","First widely adopted, slow, legacy"],["802.11g","2.4 GHz","54 Mbps","Backward compatible with 802.11b"],["802.11n (Wi-Fi 4)","2.4 + 5 GHz","600 Mbps","MIMO, dual-band, channel bonding"],["802.11ac (Wi-Fi 5)","5 GHz only","~3.5 Gbps","MU-MIMO, wider channels (80/160 MHz)"],["802.11ax (Wi-Fi 6)","2.4+5+6 GHz","~9.6 Gbps","OFDMA, BSS coloring, improved density"]].map(r=><tr key={r[0]}><td style={{color:"#ff88aa"}}>{r[0]}</td><td>{r[1]}</td><td style={{color:"#00ff41"}}>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">2.4 GHz: 3 non-overlapping channels (1,6,11). Better range, more interference. 5 GHz: 24+ non-overlapping channels. Faster, shorter range, less interference.</div>

      <div className="teach-h2">AUTONOMOUS vs LIGHTWEIGHT AP ARCHITECTURE</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Autonomous APs</div><div className="teach-card-body">Self-contained — each AP configured independently. Simple for small deployments. No central controller. Roaming is complex.</div></div>
        <div className="teach-card"><div className="teach-card-title">Lightweight APs (LAP) + WLC</div><div className="teach-card-body">APs are "dumb" — all intelligence in WLC. CAPWAP tunnel carries traffic. Centralized config, seamless roaming, RF management.</div></div>
      </div>

      <div className="teach-h2">CAPWAP PROTOCOL</div>
      <div className="teach-p">CAPWAP (Control And Provisioning of Wireless Access Points) creates a tunnel between LAPs and WLC.</div>
      <div className="teach-code">{`CAPWAP uses two tunnels:
1. Control channel  (UDP 5246) — Management, config, stats
2. Data channel     (UDP 5247) — Client data traffic

AP boots → discovers WLC via:
  1. DHCP option 43 (WLC IP)
  2. DNS (cisco-capwap-controller)
  3. Broadcast (same subnet)
  4. Previously remembered WLC`}</div>

      <div className="teach-h2">WIRELESS SECURITY STANDARDS</div>
      <table className="teach-table">
        <thead><tr><th>Standard</th><th>Encryption</th><th>Auth</th><th>Status</th></tr></thead>
        <tbody>
          {[["WEP","RC4 (broken)","Open/Shared Key","⛔ Never use"],["WPA","TKIP","PSK or 802.1X","⚠ Deprecated"],["WPA2","AES-CCMP","PSK or 802.1X","✓ Current standard"],["WPA3","AES-GCMP","SAE or 802.1X","✓✓ Most secure"]].map(r=><tr key={r[0]}><td style={{color:r[3].includes("⛔")?"#ff4444":r[3].includes("⚠")?"#ffaa00":"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">WPA3 uses SAE (Simultaneous Authentication of Equals) instead of PSK — resistant to offline dictionary attacks. Enterprise wireless uses 802.1X + RADIUS for per-user auth.</div>

      <div className="teach-h2">WIRELESS TERMINOLOGY</div>
      <div className="teach-cols-3">
        {[["BSS","Basic Service Set: single AP + clients. Each BSS has a BSSID (AP's MAC address)."],["ESS","Extended Service Set: multiple APs sharing same SSID. Enables seamless roaming."],["IBSS","Independent BSS: ad-hoc mode, peer-to-peer. No AP required."],["SSID","Service Set Identifier: the wireless network name (up to 32 chars)."],["BSSID","MAC address of the AP radio. Unique per AP."],["RSSI","Received Signal Strength Indicator: signal power. Higher (less negative) = better."]].map(([t,d])=>(
          <div className="teach-card" key={t}><div className="teach-card-title">{t}</div><div className="teach-card-body">{d}</div></div>
        ))}
      </div>
    </div>
  );
}

function AutomationLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// NETWORK AUTOMATION & PROGRAMMABILITY</div>
      <div className="teach-p">Modern networks use software to automate configuration, reduce human error, and respond faster. The CCNA tests conceptual knowledge — not deep coding skills.</div>

      <div className="teach-h2">TRADITIONAL vs SDN</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Traditional Networking</div><div className="teach-card-body">Control plane + data plane both on each device. Each device configured independently via CLI. Slow to change. Human error-prone.</div></div>
        <div className="teach-card"><div className="teach-card-title">SDN Architecture</div><div className="teach-card-body">Control plane centralized in a controller. Devices only handle data plane forwarding. Controller has full network view. Faster, consistent changes.</div></div>
      </div>
      <div className="teach-code">{`SDN Interfaces:
Northbound Interface (NBI):
  Controller ↔ Applications (REST API, JSON)
  e.g. your Python script talks to DNA Center API

Southbound Interface (SBI):
  Controller ↔ Network Devices
  e.g. OpenFlow, NETCONF, RESTCONF, SSH`}</div>

      <div className="teach-h2">DATA FORMATS</div>
      <div className="teach-cols-3">
        <div className="teach-card">
          <div className="teach-card-title">JSON</div>
          <div className="teach-card-body">Key-value pairs, {"{}"} objects, [] arrays. Most common in REST APIs. Human-readable.</div>
          <div className="teach-code" style={{fontSize:11,padding:"6px 8px",marginTop:6}}>{`{
  "hostname": "R1",
  "interfaces": [
    {"name": "Gi0/0",
     "ip": "10.0.0.1"}
  ]
}`}</div>
        </div>
        <div className="teach-card">
          <div className="teach-card-title">XML</div>
          <div className="teach-card-body">Tag-based markup. Used by NETCONF. More verbose than JSON. Self-describing.</div>
          <div className="teach-code" style={{fontSize:11,padding:"6px 8px",marginTop:6}}>{`<interface>
  <name>Gi0/0</name>
  <ip>10.0.0.1</ip>
</interface>`}</div>
        </div>
        <div className="teach-card">
          <div className="teach-card-title">YAML</div>
          <div className="teach-card-body">Indentation-based. Used in Ansible playbooks. Very human-readable. No brackets.</div>
          <div className="teach-code" style={{fontSize:11,padding:"6px 8px",marginTop:6}}>{`hostname: R1
interfaces:
  - name: Gi0/0
    ip: 10.0.0.1`}</div>
        </div>
      </div>

      <div className="teach-h2">REST API METHODS</div>
      <table className="teach-table">
        <thead><tr><th>Method</th><th>Action</th><th>Example</th></tr></thead>
        <tbody>
          {[["GET","Retrieve data","GET /api/v1/interfaces"],["POST","Create new resource","POST /api/v1/vlans"],["PUT","Replace entire resource","PUT /api/v1/vlan/10"],["PATCH","Update part of resource","PATCH /api/v1/interface/gi0"],["DELETE","Remove resource","DELETE /api/v1/vlan/10"]].map(r=><tr key={r[0]}><td style={{color:"#44aaff",fontWeight:500}}>{r[0]}</td><td>{r[1]}</td><td style={{color:"#00ff4188"}}>{r[2]}</td></tr>)}
        </tbody>
      </table>

      <div className="teach-h2">AUTOMATION TOOLS</div>
      <table className="teach-table">
        <thead><tr><th>Tool</th><th>Language</th><th>Agent?</th><th>Use Case</th></tr></thead>
        <tbody>
          {[["Ansible","YAML playbooks","Agentless (SSH)","Config management, multi-vendor"],["Puppet","Ruby/DSL","Agent required","Declarative, state enforcement"],["Chef","Ruby","Agent required","Infrastructure as code"],["Terraform","HCL","Agentless","Cloud infrastructure provisioning"],["Python + Netmiko","Python","Agentless (SSH)","Script-based automation"]].map(r=><tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td style={{color:r[2]==="Agentless (SSH)"?"#00ff41":"#ffaa00"}}>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">Ansible is the most CCNA-tested automation tool. Key facts: agentless (uses SSH), playbooks in YAML, idempotent, most popular for network automation.</div>

      <div className="teach-h2">CISCO DNA CENTER (CATALYST CENTER)</div>
      <div className="teach-p">Cisco's intent-based networking controller for campus networks. Provides a GUI and REST API for network management, automation, and analytics. Replaces traditional CLI-per-device management.</div>
    </div>
  );
}

function SecurityLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// SECURITY FUNDAMENTALS</div>

      <div className="teach-h2">ACL TYPES & PLACEMENT</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Standard ACL (1-99, 1300-1999)</div><div className="teach-card-body">Matches source IP only. Place CLOSE TO DESTINATION to avoid over-blocking. Simple but limited.</div></div>
        <div className="teach-card"><div className="teach-card-title">Extended ACL (100-199, 2000-2699)</div><div className="teach-card-body">Matches src+dst IP, protocol, port. Place CLOSE TO SOURCE — stops traffic early. Much more flexible.</div></div>
      </div>
      <div className="teach-code">{`! ACL Rules:
! 1. Processed top-to-bottom — first match wins
! 2. Implicit deny all at the end (invisible)
! 3. Always add permit if you don't want to block everything

! Standard ACL example
access-list 10 deny   192.168.1.0 0.0.0.255
access-list 10 permit any

! Extended ACL — block Telnet from 10.0.0.0/8
access-list 110 deny   tcp 10.0.0.0 0.255.255.255 any eq 23
access-list 110 permit ip any any

! Apply to interface
interface gi0/0
 ip access-group 110 in   ! Extended: close to source = inbound`}</div>
      <div className="teach-tip">Wildcard masks are the inverse of subnet masks. 0.0.0.255 = match any host in the /24. 0.0.0.0 = match exact IP. 255.255.255.255 = match any IP.</div>

      <div className="teach-h2">AAA FRAMEWORK</div>
      <table className="teach-table">
        <thead><tr><th>Component</th><th>Question Answered</th><th>Example</th></tr></thead>
        <tbody>
          {[["Authentication","Who are you?","Username + password verified"],["Authorization","What can you do?","Read-only vs full admin access"],["Accounting","What did you do?","Log of all commands executed"]].map(r=><tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">RADIUS</div><div className="teach-card-body">UDP ports 1812/1813. Encrypts password only. Combines Authentication + Authorization in one step. Common for wireless/network access.</div></div>
        <div className="teach-card"><div className="teach-card-title">TACACS+</div><div className="teach-card-body">TCP port 49. Encrypts ENTIRE packet. Separates Authentication, Authorization, Accounting. Preferred for device administration (Cisco proprietary).</div></div>
      </div>
      <div className="teach-tip">RADIUS = remote user access (wireless, VPN). TACACS+ = network device administration. TACACS+ is more secure (full encryption, separated AAA).</div>

      <div className="teach-h2">LAYER 2 SECURITY THREATS & MITIGATIONS</div>
      <table className="teach-table">
        <thead><tr><th>Attack</th><th>How it Works</th><th>Mitigation</th></tr></thead>
        <tbody>
          {[["MAC Flooding","Floods CAM table forcing switch to broadcast","Port Security — limit MACs per port"],["VLAN Hopping","Exploits DTP to access other VLANs","Disable DTP, change native VLAN, dedicated trunks"],["ARP Spoofing","Fake ARP replies poison ARP caches","Dynamic ARP Inspection (DAI)"],["DHCP Spoofing","Rogue DHCP server gives bad IPs","DHCP Snooping — trust only uplink ports"],["STP Attack","Injects BPDUs to become root bridge","BPDU Guard on access ports, root guard on distribution"]].map(r=><tr key={r[0]}><td style={{color:"#ff4444"}}>{r[0]}</td><td>{r[1]}</td><td style={{color:"#00ff41"}}>{r[2]}</td></tr>)}
        </tbody>
      </table>

      <div className="teach-h2">VPN TYPES</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Site-to-Site VPN</div><div className="teach-card-body">Connects two networks permanently. Uses IPsec. Both endpoints are routers/firewalls. Transparent to end users.</div></div>
        <div className="teach-card"><div className="teach-card-title">Remote Access VPN</div><div className="teach-card-body">Individual users connect to the corporate network. SSL/TLS (AnyConnect) or IPsec. User needs VPN client software.</div></div>
      </div>
    </div>
  );
}

// ─── MODULE WRAPPERS ──────────────────────────────────────────────────────────

function SubnetModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"magic",label:"🔢 Magic Calc"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <SubnetLearn />}
        {tab==="magic" && <MagicNumberCalc />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.subnetting} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function RoutingModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <RoutingLearn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.routing} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function SwitchingModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  const [qIdx, setQIdx] = useState(0);
  const [placed, setPlaced] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [verified, setVerified] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [progress] = useProgress();

  const vlanQs = [
    {
      title: "VLAN Port Assignment",
      desc: "Drag the correct VLAN assignment to each switch port.",
      pools: ["VLAN 10", "VLAN 20", "VLAN 99"], // The things you drag
      zones: [
        { label: "Fa0/1 (Finance PC)", correct: [0] }, // Port 1 expects VLAN 10 (index 0)
        { label: "Fa0/2 (Guest WiFi)", correct: [1] }, // Port 2 expects VLAN 20 (index 1)
        { label: "Fa0/3 (HR Laptop)", correct: [0] },  // Port 3 expects VLAN 10 (index 0)
        { label: "Gi0/1 (Trunk to SW2)", correct: [2] } // Port 4 expects VLAN 99 (index 2)
      ],
      explain: "Finance and HR share VLAN 10. Guest is isolated on VLAN 20. The Trunk port carries all traffic and uses VLAN 99 natively."
    },
    {
      title: "STP Port States",
      desc: "Assign the correct STP state to its description.",
      pools: ["Blocking", "Listening", "Learning", "Forwarding"],
      zones: [
        { label: "Drops ALL frames, discards MAC table", correct: [0] },
        { label: "Drops frames, NO MAC table, listens for BPDUs", correct: [1] },
        { label: "Drops frames but DOES build MAC table", correct: [2] },
        { label: "Passes frames AND learns MAC addresses", correct: [3] }
      ],
      explain: "STP state order: Blocking → Listening → Learning → Forwarding. Only Forwarding passes user data."
    },
    {
      title: "Layer 2 Security",
      desc: "Assign the correct mitigation to each threat.",
      pools: ["Port Security", "DHCP Snooping", "DAI", "BPDU Guard"],
      zones: [
        { label: "Limits MAC addresses per port (MAC Flooding)", correct: [0] },
        { label: "Prevents rogue DHCP servers", correct: [1] },
        { label: "Prevents ARP spoofing attacks", correct: [2] },
        { label: "Shuts port if BPDU received on access port", correct: [3] }
      ],
      explain: "Each L2 security feature targets a specific attack. DHCP Snooping enables DAI — they work together."
    }
  ];

  const q = vlanQs[qIdx];
  const unplaced = q.pools.filter((_,i) => !Object.values(placed).flat().includes(i));
  const handleDrop = (zi) => {
    if (dragItem===null) return;
    setPlaced(prev => { const u={...prev}; Object.keys(u).forEach(k=>{u[k]=(u[k]||[]).filter(x=>x!==dragItem);}); u[zi]=[...(u[zi]||[]),dragItem]; return u; });
    setDragItem(null); setVerified(null);
  };
  const verify = () => {
    let ok=true;
    q.zones.forEach((z,zi)=>{if((placed[zi]||[]).sort().join(",")!==z.correct.sort().join(","))ok=false;});
    setVerified(ok); if(ok)setScore(s=>s+1);
  };
  const next = () => { if(qIdx+1>=vlanQs.length)setDone(true); else{setQIdx(i=>i+1);setPlaced({});setVerified(null);} };
  const reset = () => { setQIdx(0);setScore(0);setPlaced({});setVerified(null);setDone(false); };

  const renderDragDrill = () => {
    if (done) return <ResultScreen score={score} total={vlanQs.length} onRetry={reset} onLearn={()=>setTab("learn")} onHome={onHome} />;
    
    // Check if every zone has exactly one item placed in it
    const isReadyToVerify = Object.values(placed).length === q.zones.length && 
                            Object.values(placed).every(arr => arr.length > 0);

    return (
      <div>
        <StatRow stats={[{val:qIdx+1,label:"EXERCISE"},{val:vlanQs.length,label:"TOTAL"},{val:score,label:"CORRECT"}]} />
        
        <div style={{margin:"14px 0",padding:"14px 18px",border:"1px solid rgba(0,229,255,0.2)",background:"rgba(0,229,255,0.02)",borderRadius:4}}>
          <div style={{fontSize:12,color:"rgba(0,229,255,0.7)",marginBottom:6,letterSpacing:2,fontWeight:"bold"}}>{q.title}</div>
          <div style={{fontSize:14,color:"#ffffff"}}>{q.desc}</div>
        </div>

        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:"rgba(0,229,255,0.7)",marginBottom:8,letterSpacing:1,fontWeight:"bold"}}>AVAILABLE TAGS</div>
          <div className="drag-zone" style={{minHeight:"auto"}}>
            {q.pools.map((poolItem, i) => (
              <div key={i} className="drag-chip" draggable onDragStart={(e) => {
                  setDragItem(i); 
                  e.dataTransfer.setData('text/plain', i);
              }}>{poolItem}</div>
            ))}
          </div>
        </div>

        <div style={{display:"grid",gap:16}}>
          {q.zones.map((zone, zi) => {
            // Determine if the item placed here is correct (only when verified is triggered)
            const placedItem = (placed[zi] || [])[0];
            const isEvaluated = verified !== null && placedItem !== undefined;
            const isItemCorrect = isEvaluated && zone.correct.includes(placedItem);

            // Dynamic border and background based on correctness
            const chipStyle = isEvaluated 
              ? (isItemCorrect 
                  ? { borderColor: "#1de9b6", borderLeft: "6px solid #1de9b6", background: "rgba(29, 233, 182, 0.1)", color: "#1de9b6" } 
                  : { borderColor: "#ff4444", borderLeft: "6px solid #ff4444", background: "rgba(255, 68, 68, 0.1)", color: "#ff8888" })
              : {};

            return (
              <div key={zi}>
                <div style={{fontSize:12,color:"rgba(0,229,255,0.7)",marginBottom:6,letterSpacing:1,fontWeight:"bold"}}>{zone.label}</div>
                <div className="drag-zone" 
                     onDragOver={e => {e.preventDefault(); e.currentTarget.classList.add("over");}} 
                     onDragLeave={e => e.currentTarget.classList.remove("over")} 
                     onDrop={e => {
                       e.preventDefault(); 
                       e.currentTarget.classList.remove("over");
                       if (dragItem !== null) {
                         setPlaced(prev => ({ ...prev, [zi]: [dragItem] }));
                         setDragItem(null);
                       }
                     }}>
                  
                  <div className="port-label">PORT {String(zi+1).padStart(2, '0')}</div>
                  
                  {placedItem !== undefined && (
                    <div className="drag-chip" style={chipStyle} onClick={() => {
                        setPlaced(prev => {
                          const u = { ...prev };
                          u[zi] = []; 
                          return u;
                        });
                        setVerified(null);
                    }} title="Click to remove">
                      {q.pools[placedItem]} 
                      {/* Add visual indicator text if evaluated */}
                      {isEvaluated && (isItemCorrect ? " ✓" : " ✗")}
                    </div>
                  )}
                  
                  {placedItem === undefined && <span className="empty-port-text">[ UNASSIGNED ]</span>}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button className="btn" onClick={verify} disabled={!isReadyToVerify}>VERIFY CONNECTIONS</button>
          <button className="btn btn-warn" onClick={() => {setPlaced({}); setVerified(null);}}>CLEAR ALL</button>
        </div>

        {verified !== null && (
          <div className={`feedback ${verified?"ok":"bad"}`} style={{marginTop:16}}>
            <strong>{verified?"✓ CORRECT CONFIGURATION":"✗ CONFIGURATION ERROR"}</strong>
            {verified ? " — " + q.explain : " — Some assignments are incorrect. They are marked in red. Click a module to remove it and try again."}
            {verified && <div style={{marginTop:12}}><button className="btn" onClick={next}>{qIdx+1>=vlanQs.length?"VIEW RESULTS":"NEXT EXERCISE ›"}</button></div>}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"quiz",label:"🎯 Quiz"},{id:"drag",label:"🔌 Drag & Drop"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <VlanLearn />}
        {tab==="quiz" && <QuizEngine questions={ALL_QUESTIONS.switching} onHome={onHome} learnTab={()=>setTab("learn")} />}
        {tab==="drag" && renderDragDrill()}
      </div>
    </div>
  );
}

function IPServicesModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <IPServicesLearn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.ipServices} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function IPv6Module({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <IPv6Learn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.ipv6} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function WirelessModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <WirelessLearn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.wireless} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function SecurityModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <SecurityLearn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.security} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

function AutomationModule({ onHome }) {
  const [tab, setTab] = useState("learn");
  return (
    <div>
      <ModuleTabs tabs={[{id:"learn",label:"📖 Learn"},{id:"drill",label:"🎯 Drill"}]} active={tab} onSelect={setTab} />
      <div className="mod-content">
        {tab==="learn" && <AutomationLearn />}
        {tab==="drill" && <QuizEngine questions={ALL_QUESTIONS.automation} onHome={onHome} learnTab={()=>setTab("learn")} />}
      </div>
    </div>
  );
}

// ─── SUBNET LEARN (kept from v2) ──────────────────────────────────────────────
function SubnetLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// SUBNETTING & IP ADDRESSING</div>
      <div className="teach-p">Subnetting divides a network into smaller segments. The key skill: given an IP and prefix, calculate network address, broadcast, host range, and block size using the Magic Number method.</div>
      <div className="teach-info">An IP address is 32 bits in 4 octets. The subnet mask separates network bits from host bits.</div>
      <div className="teach-h2">CIDR QUICK REFERENCE</div>
      <div className="cheatsheet-grid">
        {[["/30","255.255.255.252","2 hosts"],["/29","255.255.255.248","6 hosts"],["/28","255.255.255.240","14 hosts"],["/27","255.255.255.224","30 hosts"],["/26","255.255.255.192","62 hosts"],["/25","255.255.255.128","126 hosts"],["/24","255.255.255.0","254 hosts"],["/23","255.255.254.0","510 hosts"],["/22","255.255.252.0","1022 hosts"],["/21","255.255.248.0","2046 hosts"],["/20","255.255.240.0","4094 hosts"],["/16","255.255.0.0","65534 hosts"]].map(([c,m,h])=>(
          <div className="cheatsheet-item" key={c}><div className="cheatsheet-key">{c}</div><div className="cheatsheet-val">{m}</div><div className="cheatsheet-val" style={{color:"#00ff41"}}>{h}</div></div>
        ))}
      </div>
      <div className="teach-h2">THE MAGIC NUMBER METHOD</div>
      <div className="teach-code">{`GIVEN: 172.16.5.130/26
1. Mask = 255.255.255.192
2. Magic Number = 256 - 192 = 64  (block size)
3. Count: 0, 64, 128, 192... → 130 is in 128 block
4. Network  = 172.16.5.128
   Broadcast = 172.16.5.191  (128 + 64 - 1)
   Hosts     = .129 to .190  (62 usable)`}</div>
      <div className="teach-tip">Magic Number = 256 minus the "interesting" octet value. This gives you the block size. Count up in blocks until you pass your IP — previous block start = network address.</div>
      <div className="teach-h2">IP ADDRESS CLASSES</div>
      <table className="teach-table">
        <thead><tr><th>Class</th><th>First Octet</th><th>Default Mask</th><th>Private Range</th></tr></thead>
        <tbody>
          {[["A","1–126","/8","10.0.0.0/8"],["B","128–191","/16","172.16.0.0/12"],["C","192–223","/24","192.168.0.0/16"]].map(r=><tr key={r[0]}><td style={{color:"#00ff41"}}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-h2">FORMULAS</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">SUBNETS CREATED</div><div className="teach-card-body">2^n where n = bits borrowed</div></div>
        <div className="teach-card"><div className="teach-card-title">HOSTS PER SUBNET</div><div className="teach-card-body">2^h − 2 where h = host bits remaining</div></div>
      </div>
      <div className="teach-tip">Powers of 2: 1,2,4,8,16,32,64,128,256,512,1024,2048,4096. Memorize these — you'll need them constantly.</div>
    </div>
  );
}

function RoutingLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// ROUTING PROTOCOLS & PATH SELECTION</div>
      <div className="teach-h2">ROUTE SELECTION PRIORITY</div>
      <div className="teach-code">{`1. LONGEST PREFIX MATCH — most specific always wins
   /29 > /24 > /16 > /8 > /0
   
2. ADMINISTRATIVE DISTANCE — if same prefix length
   Lower = more trusted

3. METRIC — if same protocol
   Lower = better path`}</div>
      <div className="teach-info">Longest prefix match ALWAYS wins first. A specific /29 via RIP beats a /0 via static — every time.</div>
      <div className="teach-h2">ADMINISTRATIVE DISTANCE</div>
      <table className="teach-table">
        <thead><tr><th>Source</th><th>AD</th></tr></thead>
        <tbody>
          {[["Connected",0],["Static",1],["EIGRP Summary",5],["eBGP",20],["EIGRP Internal",90],["OSPF",110],["IS-IS",115],["RIP",120],["EIGRP External",170],["iBGP",200],["Unknown",255]].map(([s,a])=><tr key={s}><td>{s}</td><td style={{color:a<=1?"#00ff41":a<=90?"#00ccff":a>=120?"#ffaa00":"#00ff41aa",fontFamily:"'Orbitron',sans-serif",fontSize:15}}>{a}</td></tr>)}
        </tbody>
      </table>
      <div className="teach-tip">Must memorize: Connected=0, Static=1, EIGRP=90, OSPF=110, RIP=120.</div>
      <div className="teach-h2">OSPF KEY FACTS</div>
      <div className="teach-code">{`Type: Link-State | Metric: Cost (ref BW / interface BW)
AD: 110 | Algorithm: Dijkstra SPF
Areas: area 0 = backbone (all areas connect to it)
DR/BDR election on broadcast networks (Ethernet)
Packets: Hello, DBD, LSR, LSU, LSAck

router ospf 1
 network 10.0.0.0 0.255.255.255 area 0
 router-id 1.1.1.1`}</div>
      <div className="teach-h2">STATIC ROUTES</div>
      <div className="teach-code">{`ip route 192.168.2.0 255.255.255.0 10.0.0.2   ! next-hop
ip route 0.0.0.0 0.0.0.0 10.0.0.1             ! default
ip route 192.168.2.0 255.255.255.0 10.0.0.3 150 ! floating (backup)`}</div>
    </div>
  );
}

function VlanLearn() {
  return (
    <div className="scroll-area">
      <div className="teach-h1">// SWITCHING, VLANs & STP</div>
      <div className="teach-h2">VLAN CONFIGURATION</div>
      <div className="teach-code">{`vlan 10
 name Finance
interface fa0/1
 switchport mode access
 switchport access vlan 10
interface gi0/1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,99
 switchport trunk native vlan 99`}</div>
      <div className="teach-tip">Never use VLAN 1 for user traffic. Change native VLAN from 1. Put unused ports in a dead VLAN (e.g. 999).</div>
      <div className="teach-h2">STP ELECTION & PORT STATES</div>
      <div className="teach-code">{`Election: Lowest Bridge ID (Priority + MAC) = Root Bridge
Default priority = 32768. Lower wins.
Port costs: 10M=100, 100M=19, 1G=4, 10G=2

States: Blocking → Listening(15s) → Learning(15s) → Forwarding
Only FORWARDING passes user traffic.
LEARNING builds MAC table but drops user frames.

Rapid PVST+ converges in ~1-2 sec (use this!)
PortFast + BPDU Guard on all access ports`}</div>
      <div className="teach-h2">INTER-VLAN ROUTING</div>
      <div className="teach-cols">
        <div className="teach-card"><div className="teach-card-title">Router-on-a-Stick</div><div className="teach-card-body">Sub-interfaces with dot1q encapsulation. One physical port, multiple logical interfaces.</div></div>
        <div className="teach-card"><div className="teach-card-title">L3 Switch SVIs</div><div className="teach-card-body">interface vlan X + ip routing. Faster, preferred in modern networks. No external router needed.</div></div>
      </div>
      <div className="teach-h2">L2 SECURITY</div>
      <table className="teach-table">
        <thead><tr><th>Attack</th><th>Defense</th></tr></thead>
        <tbody>
          {[["MAC Flooding","Port Security"],["VLAN Hopping","Disable DTP, change native VLAN"],["ARP Spoofing","Dynamic ARP Inspection (DAI)"],["Rogue DHCP","DHCP Snooping"],["STP Manipulation","BPDU Guard + Root Guard"]].map(r=><tr key={r[0]}><td style={{color:"#ff4444"}}>{r[0]}</td><td style={{color:"#00ff41"}}>{r[1]}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────

const MODULES = [
  {id:"subnet",icon:"🔢",title:"SUBNET DRILL",desc:"Magic Number calc, CIDR cheat sheet, and rapid-fire subnetting drills.",tag:"IP ADDRESSING · VLSM"},
  {id:"routing",icon:"🗺️",title:"ROUTING",desc:"AD values, prefix matching, OSPF, EIGRP, RIP — learn then drill.",tag:"OSPF · EIGRP · STATIC"},
  {id:"switching",icon:"🔁",title:"SWITCHING",desc:"VLANs, STP, L2 security — quiz + drag-and-drop exercises.",tag:"VLANS · STP · SECURITY"},
  {id:"ipservices",icon:"⚙️",title:"IP SERVICES",desc:"NAT, DHCP, DNS, NTP, SNMP with full port number reference.",tag:"NAT · DHCP · SNMP",isNew:true},
  {id:"ipv6",icon:"6️⃣",title:"IPv6",desc:"128-bit addressing, NDP, SLAAC, DHCPv6, OSPFv3.",tag:"NDP · SLAAC · ROUTING",isNew:true},
  {id:"wireless",icon:"📡",title:"WIRELESS",desc:"802.11 standards, WLC architecture, CAPWAP, WPA3.",tag:"802.11 · WLC · WPA3",isNew:true},
  {id:"security",icon:"🛡️",title:"SECURITY",desc:"ACLs, AAA, RADIUS vs TACACS+, VPNs, L2 attack mitigations.",tag:"ACL · AAA · VPN",isNew:true},
  {id:"automation",icon:"⚡",title:"AUTOMATION",desc:"SDN, REST APIs, JSON/YAML, Ansible, DNA Center.",tag:"SDN · REST · ANSIBLE",isNew:true},
  {id:"ioslab", icon:"⌨️", title:"IOS CONSOLE", desc:"Hands-on Cisco IOS training. Master the CLI with interactive lab scenarios.", tag:"CLI · CONFIG · SHOW", isNew:true},
];

function Home({ onSelect, onExam, onProgress }) {
  const [typedText, setTypedText] = useState("");
  const fullCommand = "./ccna_trainer --version=3 --domains=all";

  // Typing effect hook
  useEffect(() => {
    let i = 0;
    const typing = setInterval(() => {
      setTypedText(fullCommand.slice(0, i));
      i++;
      if (i > fullCommand.length) clearInterval(typing);
    }, 45); // Typing speed
    return () => clearInterval(typing);
  }, []);

  return (
    <div>
      <div style={{marginBottom:14, padding: "16px", background: "rgba(0,229,255,0.02)", border: "1px solid rgba(0,229,255,0.1)", borderRadius: "4px"}}>
        <div className="terminal-line">
          <span className="prompt" style={{color:"#1de9b6", marginRight: "8px"}}>root@ccna:~$</span>
          <span style={{color: "#ffffff"}}>{typedText}</span>
          <span className="cursor"></span>
        </div>
        {typedText.length === fullCommand.length && (
          <div className="terminal-line" style={{marginTop:8, color: "rgba(255,255,255,0.6)", fontSize: "14px"}}>
            <span className="prompt" style={{color:"#00e5ff", marginRight: "8px"}}>[SYS]</span>
            <span>8 modules loaded · 80+ questions · engine ready</span>
          </div>
        )}
      </div>

      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        <button className="btn btn-warn btn-pulse-warn" onClick={onExam} style={{fontSize:13, fontWeight: "bold", padding: "10px 20px"}}>
          ⏱ INITIALIZE EXAM SIMULATOR
        </button>
        <button className="btn btn-info" onClick={onProgress} style={{fontSize:13, padding: "10px 20px"}}>
          📊 VIEW PROGRESS TRACKER
        </button>
      </div>

      <div className="home-grid">
        {MODULES.map(m => (
          <div key={m.id} className={`module-card ${m.isNew?"new-card":""}`} onClick={()=>onSelect(m.id)}>
            <div className="module-icon">{m.icon}</div>
            <div className="module-title">{m.title}{m.isNew&&<span className="new-badge">NEW</span>}</div>
            <div className="module-desc">{m.desc}</div>
            <div className="module-tag" style={m.isNew?{color:"#1de9b6",borderColor:"rgba(29,233,182,0.3)", background: "rgba(29,233,182,0.05)"}:{}}>{m.tag}</div>
          </div>
        ))}
      </div>

      <div style={{marginTop:20,padding:16,border:"1px dashed rgba(0,229,255,0.2)",fontSize:12,color:"rgba(255,255,255,0.5)",lineHeight:1.8, borderRadius: "4px"}}>
        <span style={{color:"#00e5ff",letterSpacing:2,fontSize:11, fontWeight: "bold"}}>CCNA 200-301 COVERAGE: </span><br/>
        {["Network Fundamentals","IP Connectivity","IP Services","Security Fundamentals","Automation","Network Access","IPv6","Wireless"].map(t=>`▸ ${t}`).join("   ")}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView] = useState("home");

  const navItems = [
    {id:"home",label:"HOME"},
    {id:"subnet",label:"SUBNET"},
    {id:"routing",label:"ROUTING"},
    {id:"switching",label:"SWITCHING"},
    {id:"ipservices",label:"IP SERVICES"},
    {id:"ipv6",label:"IPv6"},
    {id:"wireless",label:"WIRELESS"},
    {id:"security",label:"SECURITY"},
    {id:"automation",label:"AUTOMATION"},
    {id:"exam",label:"⏱ EXAM",cls:"exam-btn"},
    {id:"progress",label:"📊 PROGRESS",cls:"progress-btn"},
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="scanlines"/><div className="crt-glow"/>
        <div className="header">
          <div className="logo">CCNA::TERMINAL</div>
          <div className="header-tag">v1.3</div>
          <div className="header-tag">200-301</div>
          <div style={{fontSize:11,color:"#00ff4133",marginLeft:"auto"}}>{new Date().toISOString().split("T")[0]}</div>
        </div>
        <div className="nav">
          {navItems.map(n=>(
            <button key={n.id} className={`nav-btn ${n.cls||""} ${view===n.id?"active":""}`} onClick={()=>setView(n.id)}>
              {n.label}
            </button>
          ))}
        </div>
        <div className="main">
          {view==="home"       && <Home onSelect={setView} onExam={()=>setView("exam")} onProgress={()=>setView("progress")}/>}
          {view==="subnet"     && <SubnetModule onHome={()=>setView("home")}/>}
          {view==="routing"    && <RoutingModule onHome={()=>setView("home")}/>}
          {view==="switching"  && <SwitchingModule onHome={()=>setView("home")}/>}
          {view==="ipservices" && <IPServicesModule onHome={()=>setView("home")}/>}
          {view==="ipv6"       && <IPv6Module onHome={()=>setView("home")}/>}
          {view==="wireless"   && <WirelessModule onHome={()=>setView("home")}/>}
          {view==="security"   && <SecurityModule onHome={()=>setView("home")}/>}
          {view==="automation" && <AutomationModule onHome={()=>setView("home")}/>}
          {view==="exam"       && <ExamSimulator onHome={()=>setView("home")}/>}
          {view==="progress"   && <ProgressTracker onHome={()=>setView("home")}/>}
          {view==="ioslab" && <IOSLabModule onHome={() => setView("home")}/>}
        </div>
      </div>
    </>
  );
}
