import React from "react";
import { useStats } from "../hooks";
import { StatCard, ZoneBadge } from "./UI";

const ZONE_LABELS = {N:"North",S:"South",E:"East",W:"West",C:"Central",NE:"North East",NW:"North West",SE:"South East",SW:"South West"};

export default function StatsBar() {
  const { data } = useStats();

  if (!data) return null;

  const maxCount = Math.max(...Object.values(data.zones || {}));

  return (
    <section style={{marginBottom:48}}>
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",
        gap:12,marginBottom:24
      }}>
        <StatCard label="Total Pincodes" value={data.totalPincodes} sub="active entries"/>
        <StatCard label="Zones Covered" value={data.totalZones} sub="across Bangalore"/>
        <StatCard label="Range From" value={data.range?.from} sub="Central Bangalore"/>
        <StatCard label="Range To" value={data.range?.to} sub="Devanahalli"/>
        <StatCard label="API Cache" value={data.cacheSize} sub="cached lookups"/>
      </div>

      
      <div style={{
        background:"var(--card)",border:"1px solid var(--border)",
        borderRadius:"var(--radius)",padding:"22px 24px"
      }}>
        <div style={{fontFamily:"var(--font-mono)",fontSize:10,textTransform:"uppercase",
          letterSpacing:"0.08em",color:"var(--text3)",marginBottom:18}}>
          Pincode distribution by zone
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {Object.entries(data.zones||{})
            .sort((a,b)=>b[1]-a[1])
            .map(([zone,count])=>(
              <div key={zone} style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:48,flexShrink:0}}><ZoneBadge zone={zone}/></div>
                <div style={{flex:1,position:"relative",height:8,borderRadius:4,background:"var(--bg2)",overflow:"hidden"}}>
                  <div style={{
                    height:"100%",borderRadius:4,
                    background:`var(--accent)`,
                    width:`${(count/maxCount)*100}%`,
                    opacity:0.7,transition:"width 0.6s ease"
                  }}/>
                </div>
                <div style={{
                  fontSize:12,fontFamily:"var(--font-mono)",
                  color:"var(--text2)",width:32,textAlign:"right"
                }}>{count}</div>
                <div style={{fontSize:11,color:"var(--text3)",width:70}}>{ZONE_LABELS[zone]||zone}</div>
              </div>
            ))
          }
        </div>
      </div>
    </section>
  );
}
