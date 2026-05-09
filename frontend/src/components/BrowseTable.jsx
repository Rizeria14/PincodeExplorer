import React, { useState, useMemo } from "react";
import { usePincodes, useZones, useDebounce, useCopy } from "../hooks";
import { ZoneBadge, Spinner, ErrorMsg, CopyButton, Input } from "./UI";

const PAGE_SIZE = 15;

function SortTh({ label, col, sortKey, sortDir, onSort }) {
  const active = sortKey === col;
  return (
    <th
      onClick={() => onSort(col)}
      style={{
        textAlign:"left",padding:"12px 16px",
        fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.08em",
        textTransform:"uppercase",fontWeight:400,
        color: active ? "var(--accent)" : "var(--text3)",
        cursor:"pointer",userSelect:"none",whiteSpace:"nowrap",
        borderBottom:"1px solid var(--border)",
        transition:"color 0.15s"
      }}
    >
      {label}
      <span style={{marginLeft:4,opacity:active?1:0.35}}>
        {active ? (sortDir==="asc"?"↑":"↓") : "⇅"}
      </span>
    </th>
  );
}

export default function BrowseTable() {
  const [zone, setZone] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("pin");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const { copy, copiedKey } = useCopy();

  const debouncedSearch = useDebounce(search, 300);

  const params = useMemo(() => ({
    zone, search: debouncedSearch, sort, order, page, limit: PAGE_SIZE
  }), [zone, debouncedSearch, sort, order, page]);

  const { data, loading, error } = usePincodes(params);
  const { data: zonesData } = useZones();

  const handleSort = (col) => {
    if (sort === col) setOrder(o => o === "asc" ? "desc" : "asc");
    else { setSort(col); setOrder("asc"); }
    setPage(1);
  };

  const handleZone = (z) => { setZone(z); setPage(1); };
  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };

  const rows = data?.data || [];
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;

  return (
    <section id="browse" style={{marginBottom:64}}>
      <div style={{marginBottom:20}}>
        <h2 style={{
          fontFamily:"var(--font-display)",fontWeight:700,fontSize:22,
          letterSpacing:"-0.01em",marginBottom:6
        }}>Browse All Pincodes</h2>
        <p style={{fontSize:14,color:"var(--text2)"}}>
          Filter by zone, search across all fields, sort by any column.
        </p>
      </div>

      
      <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16,alignItems:"center"}}>
        <span style={{fontSize:12,color:"var(--text3)",marginRight:4,fontFamily:"var(--font-mono)"}}>zone:</span>
        {[{zone:"all",label:`All`,count:zonesData?.total||0},
          ...(zonesData?.zones||[])
        ].map(z=>{
          const key = z.zone||"all";
          const active = zone===key;
          return (
            <button
              key={key}
              onClick={()=>handleZone(key)}
              style={{
                fontFamily:"var(--font-mono)",fontSize:11,
                padding:"5px 13px",borderRadius:100,
                border: active ? "1px solid var(--accent)" : "1px solid var(--border2)",
                background: active ? "var(--accentbg)" : "transparent",
                color: active ? "var(--accent)" : "var(--text2)",
                transition:"all 0.15s",cursor:"pointer"
              }}
            >
              {key==="all"?"All":""}
              {key!=="all"&&<ZoneBadge zone={z.zone}/>}
              {key!=="all"&&<span style={{marginLeft:5,opacity:0.7}}>{z.label}</span>}
              {key==="all"&&` (${z.count})`}
            </button>
          );
        })}
      </div>

      <div style={{
        background:"var(--card)",border:"1px solid var(--border)",
        borderRadius:"var(--radius)",overflow:"hidden"
      }}>
        
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 20px",borderBottom:"1px solid var(--border)",
          gap:12,flexWrap:"wrap"
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontFamily:"var(--font-display)",fontWeight:600,fontSize:14}}>
              Pincode Directory
            </span>
            {loading && <Spinner size={14}/>}
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,justifyContent:"flex-end"}}>
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Search pincode, area, landmark…"
              style={{maxWidth:280,fontSize:13,padding:"8px 14px"}}
            />
            <span style={{
              fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text3)",
              padding:"5px 10px",borderRadius:6,background:"var(--bg2)",
              border:"1px solid var(--border)",whiteSpace:"nowrap"
            }}>
              {meta.total || 0} results
            </span>
          </div>
        </div>

        {error && <div style={{padding:20}}><ErrorMsg message={error}/></div>}

        
        {selected && (
          <div className="animate-in" style={{
            display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",
            padding:"16px 20px",background:"rgba(232,97,58,0.06)",
            borderBottom:"1px solid var(--accentbd)"
          }}>
            <div style={{fontFamily:"var(--font-display)",fontWeight:800,fontSize:38,
              color:"var(--accent)",lineHeight:1,letterSpacing:"-0.03em"}}>{selected.pin}</div>
            <div style={{width:1,height:50,background:"var(--border2)",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontFamily:"var(--font-display)",fontWeight:700,fontSize:18,marginBottom:4}}>{selected.area}</div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
                <ZoneBadge zone={selected.zone} showLabel/>
                <span style={{fontSize:13,color:"var(--text2)"}}>📍 {selected.landmark}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <CopyButton text={selected.pin} label="PIN" copiedKey={copiedKey} onCopy={copy}/>
              <CopyButton text={selected.area} label="area" copiedKey={copiedKey} onCopy={copy}/>
            </div>
            <button
              onClick={()=>setSelected(null)}
              style={{
                background:"var(--bg3)",border:"1px solid var(--border)",
                color:"var(--text3)",width:28,height:28,borderRadius:6,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16
              }}
            >×</button>
          </div>
        )}

        
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                <SortTh label="Pincode" col="pin" sortKey={sort} sortDir={order} onSort={handleSort}/>
                <SortTh label="Area / Locality" col="area" sortKey={sort} sortDir={order} onSort={handleSort}/>
                <SortTh label="Zone" col="zone" sortKey={sort} sortDir={order} onSort={handleSort}/>
                <th style={{textAlign:"left",padding:"12px 16px",fontFamily:"var(--font-mono)",
                  fontSize:10,letterSpacing:"0.08em",textTransform:"uppercase",
                  color:"var(--text3)",borderBottom:"1px solid var(--border)"}}>Landmark</th>
                <th style={{padding:"12px 16px",borderBottom:"1px solid var(--border)"}}/>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} style={{padding:"60px 20px",textAlign:"center",color:"var(--text3)",fontSize:14}}>
                    <div style={{fontSize:32,marginBottom:12,opacity:0.4}}>🔍</div>
                    <div style={{color:"var(--text2)",fontWeight:500,marginBottom:6}}>No results found</div>
                    Try a different search or clear the zone filter.
                  </td>
                </tr>
              ) : rows.map((row,i) => (
                <tr
                  key={row.pin}
                  onClick={()=>setSelected(s=>s?.pin===row.pin?null:row)}
                  style={{
                    borderBottom:"1px solid var(--border)",cursor:"pointer",
                    background: selected?.pin===row.pin ? "rgba(232,97,58,0.05)" : "transparent",
                    transition:"background 0.1s",
                    animation:`fadeIn 0.2s ${i*0.02}s both`
                  }}
                  onMouseEnter={e=>{ if(selected?.pin!==row.pin) e.currentTarget.style.background="var(--bg3)"; }}
                  onMouseLeave={e=>{ if(selected?.pin!==row.pin) e.currentTarget.style.background="transparent"; }}
                >
                  <td style={{padding:"12px 16px",fontFamily:"var(--font-mono)",fontSize:15,fontWeight:500,color:"var(--accent)"}}>
                    {row.pin}
                  </td>
                  <td style={{padding:"12px 16px",fontWeight:500,fontSize:14}}>{row.area}</td>
                  <td style={{padding:"12px 16px"}}>
                    <ZoneBadge zone={row.zone}/>
                  </td>
                  <td style={{padding:"12px 16px",fontSize:12,color:"var(--text3)"}}>
                    {row.landmark}
                  </td>
                  <td style={{padding:"12px 16px"}} onClick={e=>e.stopPropagation()}>
                    <CopyButton text={row.pin} copiedKey={copiedKey} onCopy={copy}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
        <div style={{
          display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"14px 20px",borderTop:"1px solid var(--border)",
          flexWrap:"wrap",gap:10
        }}>
          <span style={{fontSize:12,color:"var(--text3)",fontFamily:"var(--font-mono)"}}>
            {meta.total > 0
              ? `${(page-1)*PAGE_SIZE+1}–${Math.min(page*PAGE_SIZE,meta.total)} of ${meta.total}`
              : "0 results"}
          </span>
          <div style={{display:"flex",gap:6}}>
            <PgBtn label="← Prev" disabled={page<=1} onClick={()=>setPage(p=>p-1)}/>
            {Array.from({length:Math.min(totalPages,7)},(_,i)=>{
              let p;
              if(totalPages<=7) p=i+1;
              else if(page<=4) p=i+1;
              else if(page>=totalPages-3) p=totalPages-6+i;
              else p=page-3+i;
              if(p<1||p>totalPages) return null;
              return <PgBtn key={p} label={p} active={page===p} onClick={()=>setPage(p)}/>;
            })}
            <PgBtn label="Next →" disabled={page>=totalPages} onClick={()=>setPage(p=>p+1)}/>
          </div>
        </div>
      </div>
    </section>
  );
}

function PgBtn({label,active,disabled,onClick}){
  return (
    <button onClick={onClick} disabled={disabled} style={{
      fontFamily:"var(--font-mono)",fontSize:12,padding:"5px 12px",borderRadius:6,
      border: active ? "1px solid var(--accent)" : "1px solid var(--border)",
      background: active ? "var(--accentbg)" : "var(--bg2)",
      color: active ? "var(--accent)" : disabled ? "var(--text3)" : "var(--text2)",
      cursor: disabled ? "not-allowed" : "pointer",opacity: disabled ? 0.35 : 1,
      transition:"all 0.15s"
    }}>{label}</button>
  );
}
