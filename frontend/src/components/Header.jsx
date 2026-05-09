import React, { useEffect, useState } from "react";
import { pincodeApi } from "../api";

export default function Header() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    pincodeApi.health()
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <header style={{
      borderBottom:"1px solid var(--border)",
      background:"rgba(8,9,14,0.85)",backdropFilter:"blur(20px)",
      position:"sticky",top:0,zIndex:100,padding:"0 32px"
    }}>
      <div style={{
        maxWidth:1200,margin:"0 auto",height:60,
        display:"flex",alignItems:"center",justifyContent:"space-between"
      }}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{
            width:34,height:34,borderRadius:8,
            background:"linear-gradient(135deg,#e8613a,#f07b55)",
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:16,fontWeight:700,color:"white",
            fontFamily:"var(--font-display)"
          }}>B</div>
          <div>
            <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:15,letterSpacing:"-0.01em"}}>
              Pincode Explorer
            </div>
            <div style={{fontSize:11,color:"var(--text3)",fontFamily:"var(--font-mono)",letterSpacing:"0.03em"}}>
              bangalore · karnataka
            </div>
          </div>
        </div>

        <nav style={{display:"flex",alignItems:"center",gap:24}}>
          <a href="#lookup" style={{fontSize:13,color:"var(--text2)",textDecoration:"none"}}>Lookup</a>
          <a href="#browse" style={{fontSize:13,color:"var(--text2)",textDecoration:"none"}}>Browse</a>
          <a href="#api-docs" style={{fontSize:13,color:"var(--text2)",textDecoration:"none"}}>API Docs</a>
          <div style={{
            display:"flex",alignItems:"center",gap:6,
            fontFamily:"var(--font-mono)",fontSize:11,
            padding:"5px 12px",borderRadius:100,
            background: status==="online" ? "rgba(61,214,140,0.1)" : status==="offline" ? "rgba(248,113,113,0.1)" : "var(--card)",
            color: status==="online" ? "var(--green)" : status==="offline" ? "#f87171" : "var(--text3)",
            border: `1px solid ${status==="online" ? "rgba(61,214,140,0.25)" : status==="offline" ? "rgba(248,113,113,0.25)" : "var(--border)"}`,
          }}>
            <span style={{
              width:6,height:6,borderRadius:"50%",
              background:"currentColor",
              animation: status==="online" ? "pulse 2s infinite" : "none"
            }}/>
            {status === "checking" ? "checking" : status === "online" ? "API online" : "API offline"}
          </div>
        </nav>
      </div>
    </header>
  );
}
