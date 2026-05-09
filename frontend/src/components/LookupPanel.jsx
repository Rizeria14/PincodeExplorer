import React, { useState, useEffect } from "react";
import { usePincodeLookup, useAreaSearch, useDebounce, useCopy } from "../hooks";
import { ZoneBadge, Spinner, ErrorMsg, CopyButton, Input } from "./UI";

function PinLookup() {
  const [pin, setPin] = useState("");
  const debouncedPin = useDebounce(pin, 400);
  const { data, loading, error, execute } = usePincodeLookup();
  const { copy, copiedKey } = useCopy();

  useEffect(() => {
    if (/^\d{6}$/.test(debouncedPin)) execute(debouncedPin);
  }, [debouncedPin]);

  const hasResult = data && !error;

  return (
    <div style={{flex:1,minWidth:280}}>
      <div style={{
        fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.1em",
        textTransform:"uppercase",color:"var(--text3)",marginBottom:10,
        display:"flex",alignItems:"center",gap:8
      }}>
        <span style={{
          width:22,height:22,borderRadius:6,background:"var(--accentbg)",
          border:"1px solid var(--accentbd)",display:"inline-flex",
          alignItems:"center",justifyContent:"center",fontSize:12
        }}>🔢</span>
        Pincode → Area
      </div>

      <div style={{position:"relative"}}>
        <Input
          type="text"
          value={pin}
          onChange={e=>setPin(e.target.value.replace(/\D/g,"").slice(0,6))}
          placeholder="560041"
          style={{fontFamily:"var(--font-mono)",fontSize:22,fontWeight:500,letterSpacing:"0.12em",paddingRight:48}}
        />
        {loading && (
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)"}}>
            <Spinner size={16}/>
          </span>
        )}
      </div>

      {pin.length > 0 && pin.length < 6 && (
        <p style={{fontSize:12,color:"var(--text3)",marginTop:8,fontFamily:"var(--font-mono)"}}>
          {6 - pin.length} more digit{pin.length < 5 ? "s" : ""} needed
        </p>
      )}

      {error && <div style={{marginTop:10}}><ErrorMsg message={error}/></div>}

      {hasResult && (
        <div className="animate-in" style={{
          marginTop:14,padding:"18px 20px",
          background:"var(--bg3)",borderRadius:"var(--radius-sm)",
          border:"1px solid var(--border)"
        }}>
          {data.local && (
            <>
              <div style={{
                fontFamily:"var(--font-display)",fontWeight:700,fontSize:20,
                marginBottom:6,letterSpacing:"-0.01em"
              }}>{data.local.area}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",marginBottom:12}}>
                <ZoneBadge zone={data.local.zone} showLabel />
                <span style={{fontSize:12,color:"var(--text3)"}}>📍 {data.local.landmark}</span>
              </div>
              <div style={{display:"flex",gap:8}}>
                <CopyButton text={data.pincode} label="PIN" copiedKey={copiedKey} onCopy={copy}/>
                <CopyButton text={data.local.area} label="area" copiedKey={copiedKey} onCopy={copy}/>
              </div>
            </>
          )}

          {data.official && data.official.postOffices?.length > 0 && (
            <div style={{marginTop:14,paddingTop:14,borderTop:"1px solid var(--border)"}}>
              <div style={{fontSize:11,fontFamily:"var(--font-mono)",color:"var(--text3)",
                textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>
                India Post data
                <span style={{marginLeft:8,color:"var(--green)",fontSize:10}}>
                  {data.official.source==="cache"?"● cached":"● live"}
                </span>
              </div>
              {data.official.postOffices.slice(0,3).map((po,i)=>(
                <div key={i} style={{
                  display:"flex",justifyContent:"space-between",
                  fontSize:12,padding:"5px 0",
                  borderBottom: i < Math.min(data.official.postOffices.length,3)-1 ? "1px solid var(--border)" : "none"
                }}>
                  <span style={{color:"var(--text2)"}}>{po.name}</span>
                  <span style={{color:"var(--text3)",fontSize:11}}>{po.branchType}</span>
                </div>
              ))}
              {data.official.postOffices.length > 3 && (
                <div style={{fontSize:11,color:"var(--text3)",marginTop:6}}>
                  +{data.official.postOffices.length - 3} more offices
                </div>
              )}
            </div>
          )}
          {data.note && <p style={{fontSize:11,color:"var(--text3)",marginTop:8}}>{data.note}</p>}
        </div>
      )}
    </div>
  );
}

function AreaSearch() {
  const [area, setArea] = useState("");
  const debouncedArea = useDebounce(area, 350);
  const { data, loading, error, execute } = useAreaSearch();
  const { copy, copiedKey } = useCopy();

  useEffect(() => {
    if (debouncedArea.trim().length >= 2) execute(debouncedArea.trim());
  }, [debouncedArea]);

  return (
    <div style={{flex:1,minWidth:280}}>
      <div style={{
        fontFamily:"var(--font-mono)",fontSize:10,letterSpacing:"0.1em",
        textTransform:"uppercase",color:"var(--text3)",marginBottom:10,
        display:"flex",alignItems:"center",gap:8
      }}>
        <span style={{
          width:22,height:22,borderRadius:6,background:"rgba(74,175,238,0.1)",
          border:"1px solid rgba(74,175,238,0.25)",display:"inline-flex",
          alignItems:"center",justifyContent:"center",fontSize:12
        }}>📍</span>
        Area → Pincode
      </div>

      <div style={{position:"relative"}}>
        <Input
          value={area}
          onChange={e=>setArea(e.target.value)}
          placeholder="Koramangala, Whitefield…"
        />
        {loading && (
          <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)"}}>
            <Spinner size={16}/>
          </span>
        )}
      </div>

      {error && <div style={{marginTop:10}}><ErrorMsg message={error}/></div>}

      {data?.results?.length > 0 && (
        <div className="animate-in" style={{
          marginTop:14,padding:"10px 0",
          background:"var(--bg3)",borderRadius:"var(--radius-sm)",
          border:"1px solid var(--border)",overflow:"hidden"
        }}>
          {data.results.slice(0,6).map((r,i)=>(
            <div key={r.pin} style={{
              display:"flex",alignItems:"center",gap:12,
              padding:"10px 16px",
              borderBottom: i < Math.min(data.results.length,6)-1 ? "1px solid var(--border)" : "none",
              transition:"background 0.1s",cursor:"pointer"
            }}
            onMouseEnter={e=>e.currentTarget.style.background="var(--card2)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <ZoneBadge zone={r.zone}/>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:500}}>{r.area}</div>
                <div style={{fontSize:11,color:"var(--text3)"}}>📍 {r.landmark}</div>
              </div>
              <span style={{
                fontFamily:"var(--font-mono)",fontSize:15,fontWeight:500,
                color:"var(--accent)"
              }}>{r.pin}</span>
              <CopyButton text={r.pin} copiedKey={copiedKey} onCopy={copy}/>
            </div>
          ))}
          {data.results.length > 6 && (
            <div style={{fontSize:12,color:"var(--text3)",padding:"10px 16px",textAlign:"center"}}>
              +{data.results.length - 6} more — use the table below to browse all
            </div>
          )}
        </div>
      )}

      {data?.results?.length === 0 && area.length >= 2 && !loading && (
        <div style={{marginTop:14,padding:"16px",textAlign:"center",color:"var(--text3)",fontSize:13}}>
          No results for "<em>{area}</em>"
        </div>
      )}
    </div>
  );
}

export default function LookupPanel() {
  return (
    <section id="lookup" style={{marginBottom:48}}>
      <div style={{marginBottom:24}}>
        <h2 style={{
          fontFamily:"var(--font-display)",fontWeight:700,fontSize:22,
          letterSpacing:"-0.01em",marginBottom:6
        }}>Instant Lookup</h2>
        <p style={{fontSize:14,color:"var(--text2)"}}>
          Search by 6-digit pincode to get area details, or type an area name to find its pincode.
          Live data fetched from the India Post API.
        </p>
      </div>

      <div style={{
        background:"var(--card)",border:"1px solid var(--border)",
        borderRadius:"var(--radius)",padding:28,
        display:"flex",gap:32,flexWrap:"wrap"
      }}>
        <PinLookup/>
        <div style={{width:"1px",background:"var(--border)",flexShrink:0}}/>
        <AreaSearch/>
      </div>
    </section>
  );
}
