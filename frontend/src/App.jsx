import React from "react";
import Header from "./components/Header";
import StatsBar from "./components/StatsBar";
import LookupPanel from "./components/LookupPanel";
import BrowseTable from "./components/BrowseTable";
import ApiDocs from "./components/ApiDocs";

function Hero() {
  return (
    <div style={{padding:"56px 0 40px",position:"relative"}}>
      
      <div style={{
        position:"absolute",inset:0,
        backgroundImage:"radial-gradient(circle,rgba(232,97,58,0.04) 1px,transparent 1px)",
        backgroundSize:"28px 28px",
        maskImage:"radial-gradient(ellipse 80% 100% at 50% 0%,black 50%,transparent 100%)",
        pointerEvents:"none"
      }}/>
      <div style={{position:"relative"}}>
        <div style={{
          display:"inline-flex",alignItems:"center",gap:8,
          fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:"0.09em",
          textTransform:"uppercase",color:"var(--accent)",
          background:"var(--accentbg)",border:"1px solid var(--accentbd)",
          borderRadius:100,padding:"5px 14px",marginBottom:20
        }}>
          <span style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",animation:"pulse 2s infinite"}}/>
          Karnataka · India Post Network
        </div>
        <h1 style={{
          fontFamily:"var(--font-display)",fontWeight:800,
          fontSize:"clamp(36px,6vw,64px)",lineHeight:1.05,
          letterSpacing:"-0.03em",marginBottom:16,
          background:"linear-gradient(135deg,#eef0f4 40%,#555d77)",
          WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"
        }}>
          Bangalore<br/>Pincode Explorer
        </h1>
        <p style={{fontSize:16,color:"var(--text2)",maxWidth:520,lineHeight:1.7,fontWeight:300}}>
          Full-stack pincode lookup powered by a Node.js/Express API and the
          live India Post database. Search any locality or 6-digit code instantly.
        </p>
        <div style={{display:"flex",gap:12,marginTop:24,flexWrap:"wrap"}}>
          <a href="#lookup" style={{
            fontFamily:"var(--font-mono)",fontSize:13,
            padding:"10px 22px",borderRadius:"var(--radius-sm)",
            background:"var(--accent)",color:"white",
            textDecoration:"none",border:"none",cursor:"pointer",
            transition:"opacity 0.15s"
          }}>Search Pincodes →</a>
          <a href="#api-docs" style={{
            fontFamily:"var(--font-mono)",fontSize:13,
            padding:"10px 22px",borderRadius:"var(--radius-sm)",
            background:"transparent",color:"var(--text2)",
            textDecoration:"none",border:"1px solid var(--border2)",
            transition:"all 0.15s"
          }}>API Docs</a>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      
      <div style={{
        position:"fixed",width:800,height:800,borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(232,97,58,0.05) 0%,transparent 70%)",
        top:-300,right:-300,pointerEvents:"none",zIndex:0
      }}/>
      <div style={{
        position:"fixed",width:600,height:600,borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(74,175,238,0.03) 0%,transparent 70%)",
        bottom:-200,left:-200,pointerEvents:"none",zIndex:0
      }}/>

      <div style={{position:"relative",zIndex:1}}>
        <Header/>
        <main style={{maxWidth:1200,margin:"0 auto",padding:"0 32px"}}>
          <Hero/>
          <StatsBar/>
          <LookupPanel/>
          <BrowseTable/>
          <ApiDocs/>
        </main>
        <footer style={{
          borderTop:"1px solid var(--border)",padding:"24px 32px",
          textAlign:"center",color:"var(--text3)",fontSize:12,
          fontFamily:"var(--font-mono)",letterSpacing:"0.04em"
        }}>
          Bangalore Pincode Explorer · Node.js + React · Data: India Post API
        </footer>
      </div>
    </>
  );
}
