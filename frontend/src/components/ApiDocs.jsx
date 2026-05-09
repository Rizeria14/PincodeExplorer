import React, { useState } from "react";

const ENDPOINTS = [
  {
    method:"GET", path:"/api/health", desc:"Server health check",
    response:`{ "status": "ok", "timestamp": "...", "uptime": 123.4 }`
  },
  {
    method:"GET", path:"/api/pincodes", desc:"List all pincodes with filters",
    params:[
      {name:"zone",type:"string",desc:'Zone code, e.g. "SE", "N". Default: all'},
      {name:"search",type:"string",desc:"Search term across pin, area, landmark"},
      {name:"page",type:"number",desc:"Page number (default: 1)"},
      {name:"limit",type:"number",desc:"Items per page (max 100, default: 20)"},
      {name:"sort",type:"string",desc:'Sort field: "pin" | "area" | "zone"'},
      {name:"order",type:"string",desc:'"asc" | "desc" (default: asc)'},
    ],
    response:`{ "data": [...], "meta": { "total": 100, "page": 1, "limit": 20, "totalPages": 5 } }`
  },
  {
    method:"GET", path:"/api/pincode/:pin", desc:"Lookup a single pincode — hits India Post API live",
    params:[{name:"pin",type:"path",desc:"6-digit pincode e.g. 560041"}],
    response:`{ "pincode":"560041", "local": {...}, "official": { "postOffices":[...], "source":"api|cache" } }`
  },
  {
    method:"GET", path:"/api/search/area", desc:"Search by area or landmark name",
    params:[{name:"q",type:"string",desc:"Area name (min 2 chars)"}],
    response:`{ "query":"koramangala", "results": [...], "count": 2 }`
  },
  {
    method:"GET", path:"/api/zones", desc:"List all zones with pincode counts",
    response:`{ "zones": [{ "zone":"SE", "label":"South East", "count":12 }], "total": 100 }`
  },
  {
    method:"GET", path:"/api/stats", desc:"Dashboard statistics",
    response:`{ "totalPincodes":100, "totalZones":9, "range":{...}, "cacheSize":5, "zones":{...} }`
  },
];

const METHOD_COLORS = {
  GET:  {bg:"rgba(61,214,140,0.1)",  color:"#3dd68c",  border:"rgba(61,214,140,0.25)"},
  POST: {bg:"rgba(74,175,238,0.1)",  color:"#4aafee",  border:"rgba(74,175,238,0.25)"},
};

export default function ApiDocs() {
  const [open, setOpen] = useState(null);

  return (
    <section id="api-docs" style={{marginBottom:64}}>
      <div style={{marginBottom:20}}>
        <h2 style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:22,
          letterSpacing:"-0.01em",marginBottom:6}}>API Reference</h2>
        <p style={{fontSize:14,color:"var(--text2)"}}>
          RESTful API running on <code style={{fontFamily:"var(--font-mono)",color:"var(--accent)",
          background:"var(--accentbg)",padding:"1px 6px",borderRadius:4}}>http://localhost:5000</code>.
          Rate limited to 100 req/15min per IP.
        </p>
      </div>

      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {ENDPOINTS.map((ep, i) => {
          const isOpen = open === i;
          const mc = METHOD_COLORS[ep.method] || METHOD_COLORS.GET;
          return (
            <div key={i} style={{
              background:"var(--card)",border:"1px solid var(--border)",
              borderRadius:"var(--radius)",overflow:"hidden"
            }}>
              <button
                onClick={()=>setOpen(isOpen?null:i)}
                style={{
                  width:"100%",display:"flex",alignItems:"center",gap:14,
                  padding:"14px 20px",background:"transparent",border:"none",
                  textAlign:"left",cursor:"pointer"
                }}
              >
                <span style={{
                  fontFamily:"var(--font-mono)",fontSize:11,fontWeight:500,
                  padding:"3px 10px",borderRadius:6,
                  background:mc.bg,color:mc.color,border:`1px solid ${mc.border}`,
                  flexShrink:0,letterSpacing:"0.04em"
                }}>{ep.method}</span>
                <code style={{
                  fontFamily:"var(--font-mono)",fontSize:14,color:"var(--text)",flex:1
                }}>{ep.path}</code>
                <span style={{fontSize:13,color:"var(--text3)",marginRight:8}}>{ep.desc}</span>
                <span style={{color:"var(--text3)",fontSize:18,transition:"transform 0.2s",
                  transform:isOpen?"rotate(90deg)":"none"}}>›</span>
              </button>

              {isOpen && (
                <div className="animate-in" style={{padding:"0 20px 20px",borderTop:"1px solid var(--border)"}}>
                  {ep.params && (
                    <div style={{marginTop:16}}>
                      <div style={{fontSize:11,fontFamily:"var(--font-mono)",textTransform:"uppercase",
                        letterSpacing:"0.08em",color:"var(--text3)",marginBottom:10}}>Parameters</div>
                      <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
                        <thead>
                          <tr>
                            {["Name","Type","Description"].map(h=>(
                              <th key={h} style={{textAlign:"left",padding:"6px 12px",
                                fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text3)",
                                borderBottom:"1px solid var(--border)",textTransform:"uppercase",letterSpacing:"0.06em"}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {ep.params.map(p=>(
                            <tr key={p.name} style={{borderBottom:"1px solid var(--border)"}}>
                              <td style={{padding:"8px 12px",fontFamily:"var(--font-mono)",fontSize:12,color:"var(--accent)"}}>{p.name}</td>
                              <td style={{padding:"8px 12px",fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text3)"}}>{p.type}</td>
                              <td style={{padding:"8px 12px",color:"var(--text2)"}}>{p.desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div style={{marginTop:16}}>
                    <div style={{fontSize:11,fontFamily:"var(--font-mono)",textTransform:"uppercase",
                      letterSpacing:"0.08em",color:"var(--text3)",marginBottom:8}}>Example Response</div>
                    <pre style={{
                      background:"var(--bg2)",border:"1px solid var(--border)",
                      borderRadius:"var(--radius-sm)",padding:"14px 16px",
                      fontFamily:"var(--font-mono)",fontSize:12,color:"var(--text2)",
                      overflowX:"auto",lineHeight:1.7,whiteSpace:"pre-wrap"
                    }}>{ep.response}</pre>
                  </div>
                  <div style={{marginTop:14}}>
                    <code style={{
                      fontFamily:"var(--font-mono)",fontSize:12,color:"var(--text3)",
                      background:"var(--bg2)",padding:"8px 14px",borderRadius:6,display:"block"
                    }}>
                      curl http://localhost:5000{ep.path.replace(":pin","560041")}
                    </code>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
