import React, { useState, useRef } from "react";
import { T } from "./tokens.js";
import { USER, MATCHES, ACTIVE_CONN, ONBOARD_QS } from "./data.js";
import { BackBtn, Badge, Pill, ScoreBar, Card, Btn, SectionLabel } from "./ui.jsx";

var S = { OI:"oi",OQ:"oq",OD:"od",HOME:"home",MV:"mv",MC:"mc",REF:"ref",DEC:"dec",ACC:"acc",MSG:"msg",CHAT:"chat",CONN:"conn",CHK:"chk",PROF:"prof",INS:"ins" };

function e(tag, props) {
  var args = Array.prototype.slice.call(arguments);
  return React.createElement.apply(React, args);
}

export default function App() {
  var s = useState, r = useRef;
  var _s = s(S.HOME), screen = _s[0], setScreen = _s[1];
  var _p = s(null), prev = _p[0], setPrev = _p[1];
  var _m = s(null), match = _m[0], setMatch = _m[1];
  var _q = s(0), qIdx = _q[0], setQIdx = _q[1];
  var _a = s({}), ans = _a[0], setAns = _a[1];
  var _r = s({q1:"",q2:""}), refl = _r[0], setRefl = _r[1];
  var _ms = s([{from:"system",text:"You matched! Here is a conversation starter:"},{from:"system",text:"You both value personal growth. Ask about a belief she changed recently."}]), msgs = _ms[0], setMsgs = _ms[1];
  var _i = s(""), inp = _i[0], setInp = _i[1];
  var _c = s(0), ckSt = _c[0], setCkSt = _c[1];
  var _cd = s({}), ckD = _cd[0], setCkD = _cd[1];
  var _f = s(true), fade = _f[0], setFade = _f[1];
  var _t = s("home"), tab = _t[0], setTab = _t[1];
  var scrollRef = r(null);

  function go(sc, mt) { setFade(false); setTimeout(function(){ setPrev(screen); setScreen(sc); if(mt) setMatch(mt); setFade(true); if(scrollRef.current) scrollRef.current.scrollTop=0; },150); }
  function back() { if(prev) go(prev); }
  function navTab(t) { setTab(t); var map={home:S.HOME,matches:S.MSG,connection:S.CONN,profile:S.PROF}; if(map[t]) go(map[t]); }
  function send() { if(!inp.trim()) return; setMsgs(function(p){return p.concat({from:"me",text:inp})}); setInp(""); setTimeout(function(){setMsgs(function(p){return p.concat({from:"them",text:"Great question! Let me think about it."})})},1200); }

  var st = function(o){return {style:o}};

  function content() {
    if(screen===S.OI) return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"85vh",textAlign:"center",padding:"0 20px"}},
      e("div",{style:{width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,"+T.accent+","+T.accentL+")",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,marginBottom:24}},"\u2726"),
      e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:26,color:T.dark,margin:"0 0 10px"}},"Let's learn about you"),
      e("p",{style:{fontFamily:T.body,fontSize:14,color:T.sub,lineHeight:1.6,maxWidth:300,margin:"0 0 32px"}},"8 questions. ~4 minutes. No right or wrong answers."),
      e(Btn,{primary:true,full:true,onClick:function(){go(S.OQ)}},"Begin"),
      e("button",{onClick:function(){go(S.HOME)},style:{fontFamily:T.body,fontSize:12,color:T.muted,background:"none",border:"none",cursor:"pointer",marginTop:16,textDecoration:"underline"}},"Skip (demo)")
    );

    if(screen===S.OQ) {
      var q=ONBOARD_QS[qIdx], prog=((qIdx+1)/ONBOARD_QS.length)*100;
      return e("div",null,
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:20}},
          e("button",{onClick:function(){qIdx>0?setQIdx(qIdx-1):go(S.OI)},style:{fontSize:16,color:T.muted,background:"none",border:"none",cursor:"pointer"}},"<-"),
          e("div",{style:{flex:1,height:3,background:T.border,borderRadius:2}},e("div",{style:{height:"100%",width:prog+"%",background:T.accent,borderRadius:2,transition:"width 0.3s"}})),
          e("span",{style:{fontFamily:T.mono,fontSize:11,color:T.muted}},(qIdx+1)+"/"+ONBOARD_QS.length)
        ),
        e(Pill,{text:q.section,color:T.ocean}),
        e("h3",{style:{fontFamily:T.serif,fontWeight:600,fontSize:20,color:T.dark,margin:"14px 0 20px",lineHeight:1.35}},q.q),
        q.type==="choice"&&e("div",{style:{display:"flex",flexDirection:"column",gap:8}},
          q.options.map(function(opt,i){
            return e("button",{key:i,onClick:function(){var a=Object.assign({},ans);a[q.id]=i;setAns(a);setTimeout(function(){qIdx<ONBOARD_QS.length-1?setQIdx(qIdx+1):go(S.OD)},300)},style:{padding:"14px 16px",borderRadius:12,textAlign:"left",border:ans[q.id]===i?"2px solid "+T.accent:"1.5px solid "+T.border,background:ans[q.id]===i?T.accent+"08":T.card,fontFamily:T.body,fontSize:14,color:T.text,cursor:"pointer",lineHeight:1.4}},opt)
          })
        ),
        q.type==="rank"&&e("div",{style:{display:"flex",flexDirection:"column",gap:6}},
          e("p",{style:{fontFamily:T.body,fontSize:12,color:T.muted,margin:"0 0 8px"}},"Tap to assign priority (1 = highest)"),
          q.options.map(function(opt,i){
            var rk=ans[q.id+"_"+i];
            return e("button",{key:i,onClick:function(){var ct=Object.keys(ans).filter(function(k){return k.startsWith(q.id+"_")}).length;var nx=ct<6?ct+1:null;if(nx){var a=Object.assign({},ans);a[q.id+"_"+i]=nx;setAns(a);if(ct+1>=6)setTimeout(function(){qIdx<ONBOARD_QS.length-1?setQIdx(qIdx+1):go(S.OD)},400)}},style:{padding:"12px 16px",borderRadius:10,display:"flex",alignItems:"center",gap:12,border:rk?"2px solid "+T.accent:"1.5px solid "+T.border,background:rk?T.accent+"08":T.card,cursor:"pointer"}},
              e("div",{style:{width:28,height:28,borderRadius:"50%",background:rk?T.accent:T.border,color:rk?"#fff":T.muted,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:T.mono,fontWeight:700,fontSize:12}},rk||"-"),
              e("span",{style:{fontFamily:T.body,fontSize:14,color:T.text}},opt)
            )
          })
        )
      );
    }

    if(screen===S.OD) return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center",padding:"0 20px"}},
      e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:24,color:T.dark,margin:"0 0 10px"}},"Profile complete"),
      e("p",{style:{fontFamily:T.body,fontSize:14,color:T.sub,lineHeight:1.6,maxWidth:320,margin:"0 0 32px"}},"Your first matches arrive within 24 hours."),
      e(Btn,{primary:true,full:true,onClick:function(){setTab("home");go(S.HOME)}},"Go to Home")
    );

    if(screen===S.HOME) return e("div",null,
      e("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}},
        e("div",null,
          e("div",{style:{fontFamily:T.mono,fontSize:12,color:T.muted,letterSpacing:1.5,marginBottom:4}},"WEDNESDAY, FEB 19"),
          e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:24,color:T.dark,margin:0}},"Good evening, "+USER.name)
        ),
        e("div",{style:{width:40,height:40,borderRadius:"50%",background:"linear-gradient(135deg,"+T.accent+","+T.accentL+")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:16,color:"#fff"}},USER.name[0])
      ),
      e(Card,{style:{marginBottom:14,background:"linear-gradient(135deg,"+T.dark+",#2A2520)",border:"none",cursor:"pointer"},onClick:function(){setTab("connection");go(S.CONN)}},
        e(SectionLabel,{text:"YOUR CONNECTION"}),
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
          e("div",{style:{width:44,height:44,borderRadius:"50%",background:"linear-gradient(135deg,"+T.rose+","+T.roseL+")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,color:"#fff"}},"S"),
          e("div",null,e("div",{style:{fontWeight:600,fontSize:16,color:T.cream}},ACTIVE_CONN.name),e("div",{style:{fontSize:12,color:T.muted}},"Stage "+ACTIVE_CONN.stage+" - Week "+ACTIVE_CONN.week))
        ),
        e("div",{style:{fontSize:12,color:T.accentL}},"Next check-in: "+ACTIVE_CONN.nextCheckin+" ->")
      ),
      e(SectionLabel,{text:"NEW MATCHES"}),
      MATCHES.map(function(m){return e(Card,{key:m.id,style:{marginBottom:10,cursor:"pointer"},onClick:function(){go(S.MV,m)}},
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:10}},
          e("div",{style:{width:52,height:52,borderRadius:14,background:"linear-gradient(135deg,#D4C5B5,#BEA998)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}},m.name[0]),
          e("div",{style:{flex:1,minWidth:0}},
            e("div",{style:{display:"flex",alignItems:"center",gap:8}},e("span",{style:{fontWeight:600,fontSize:16,color:T.dark}},m.name+", "+m.age),e(Badge,{level:m.verified})),
            e("div",{style:{fontSize:12,color:T.sub,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}},m.tagline)
          ),
          e("div",{style:{textAlign:"right"}},e("div",{style:{fontFamily:T.mono,fontWeight:700,fontSize:22,color:T.sage}},m.compat.overall),e("div",{style:{fontFamily:T.mono,fontSize:9,color:T.muted}},"MATCH"))
        ),
        e("div",{style:{display:"flex",gap:6,flexWrap:"wrap"}},m.shared.map(function(v){return e(Pill,{key:v,text:v})}),m.isNew&&e(Pill,{text:"NEW",color:T.accent})),
        e("div",{style:{fontFamily:T.mono,fontSize:10,color:T.muted,marginTop:8}},"Expires: "+m.expires)
      )})
    );

    if(screen===S.MV&&match) return e("div",null,
      e(BackBtn,{label:"Home",onClick:back}),
      e("div",{style:{height:220,borderRadius:18,background:"linear-gradient(145deg,#D4C5B5,#BEA998)",display:"flex",alignItems:"flex-end",padding:20,marginBottom:16,position:"relative"}},
        e("div",{style:{position:"absolute",top:14,right:14}},e(Badge,{level:match.verified})),
        e("div",null,e("div",{style:{fontFamily:T.serif,fontWeight:700,fontSize:28,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.25)"}},match.name+", "+match.age),e("div",{style:{fontSize:13,color:"rgba(255,255,255,0.85)",marginTop:2}},match.loc))
      ),
      e(Card,{style:{marginBottom:12}},
        e("div",{style:{display:"flex",alignItems:"center",gap:14,marginBottom:14}},e("div",{style:{fontFamily:T.mono,fontWeight:700,fontSize:34,color:T.sage}},match.compat.overall),e("div",null,e("div",{style:{fontFamily:T.mono,fontSize:10,color:T.muted,letterSpacing:1.5}},"COMPATIBILITY"),e("div",{style:{fontSize:13,color:T.sub}},"Strong alignment across all dimensions"))),
        e("div",{style:{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}},match.shared.map(function(v){return e(Pill,{key:v,text:v})})),
        e("button",{onClick:function(){go(S.MC)},style:{width:"100%",padding:11,borderRadius:10,border:"1.5px solid "+T.border,background:"none",fontWeight:600,fontSize:13,color:T.dark,cursor:"pointer"}},"Explore compatibility ->")
      ),
      match.prompts.map(function(pr,i){return e(Card,{key:i,style:{marginBottom:10}},e("div",{style:{fontFamily:T.serif,fontWeight:600,fontSize:14,color:T.accent,fontStyle:"italic",marginBottom:6}},pr.q),e("div",{style:{fontSize:14,color:T.text,lineHeight:1.6}},pr.a))}),
      e(Btn,{primary:true,full:true,onClick:function(){go(S.REF)},style:{marginTop:6}},"Continue to reflection")
    );

    if(screen===S.MC&&match) {
      var dims=[{key:"values",label:"Values",color:T.accent,note:"You both prioritize benevolence and growth."},{key:"attachment",label:"Emotional Security",color:"#7B6B8D",note:"Both bring a secure base."},{key:"goals",label:"Life Direction",color:T.sage,note:"Aligned on children and location."},{key:"comms",label:"Communication",color:T.ocean,note:"Complementary styles."},{key:"conflict",label:"Conflict Style",color:"#8C7355",note:"Both collaborative repairers."}];
      return e("div",null,e(BackBtn,{label:"Profile",onClick:back}),e("h3",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 18px"}},"Compatibility with "+match.name.split(" ")[0]),
        dims.map(function(d){return e(Card,{key:d.key,style:{marginBottom:8,padding:"14px 16px"}},
          e("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:8}},e("span",{style:{fontWeight:500,fontSize:14}},d.label),e("span",{style:{fontFamily:T.mono,fontWeight:700,fontSize:18,color:d.color}},match.compat[d.key])),
          e("div",{style:{height:4,background:T.border,borderRadius:2,marginBottom:8}},e("div",{style:{height:"100%",width:match.compat[d.key]+"%",background:d.color,borderRadius:2}})),
          e("div",{style:{fontSize:12.5,color:T.sub,lineHeight:1.5}},d.note)
        )}),e(Btn,{full:true,onClick:back,style:{marginTop:8}},"Back to profile"))
    }

    if(screen===S.REF) {
      var fn=match?match.name.split(" ")[0]:"";
      return e("div",null,e(BackBtn,{label:"Profile",onClick:back}),
        e("div",{style:{textAlign:"center",marginBottom:24}},e("div",{style:{fontFamily:T.mono,fontSize:10,letterSpacing:2,color:T.accent,marginBottom:8}},"REFLECTION MOMENT"),e("h3",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 8px"}},"Before you decide")),
        e(Card,{style:{marginBottom:14}},e("div",{style:{fontFamily:T.serif,fontWeight:600,fontSize:15,color:T.dark,marginBottom:10}},"What about "+fn+"'s profile resonated?"),e("textarea",{value:refl.q1,onChange:function(ev){setRefl({q1:ev.target.value,q2:refl.q2})},placeholder:"Take your time...",style:{width:"100%",minHeight:70,padding:12,borderRadius:8,border:"1.5px solid "+T.border,fontSize:14,color:T.text,background:T.warm,resize:"vertical",boxSizing:"border-box"}})),
        e(Card,{style:{marginBottom:20}},e("div",{style:{fontFamily:T.serif,fontWeight:600,fontSize:15,color:T.dark,marginBottom:10}},"Anything that gives you pause?"),e("textarea",{value:refl.q2,onChange:function(ev){setRefl({q1:refl.q1,q2:ev.target.value})},placeholder:"Okay either way...",style:{width:"100%",minHeight:70,padding:12,borderRadius:8,border:"1.5px solid "+T.border,fontSize:14,color:T.text,background:T.warm,resize:"vertical",boxSizing:"border-box"}})),
        refl.q1.length>10?e(Btn,{primary:true,full:true,onClick:function(){go(S.DEC)}},"I'm ready to decide"):e("div",{style:{textAlign:"center",padding:13,borderRadius:10,border:"1.5px dashed "+T.border,color:T.muted,fontSize:13}},"Share what resonated to unlock")
      )
    }

    if(screen===S.DEC&&match) return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"65vh",textAlign:"center"}},
      e("div",{style:{width:56,height:56,borderRadius:"50%",background:"linear-gradient(135deg,#D4C5B5,#BEA998)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:22,color:"#fff",marginBottom:16}},match.name[0]),
      e("h3",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 4px"}},match.name),
      e("div",{style:{fontFamily:T.mono,fontSize:12,color:T.sage,margin:"0 0 28px"}},match.compat.overall+"% compatible"),
      e("div",{style:{display:"flex",flexDirection:"column",gap:10,width:"100%",maxWidth:300}},
        e(Btn,{primary:true,full:true,onClick:function(){go(S.ACC)},style:{background:T.sage}},"I'd like to connect"),
        e(Btn,{full:true,onClick:function(){go(S.HOME)}},"Not the right fit")),
      e("div",{style:{fontFamily:T.mono,fontSize:10,color:T.muted,marginTop:20}},"Neither person sees the other's decision until both decide.")
    );

    if(screen===S.ACC&&match) return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",textAlign:"center"}},
      e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:24,color:T.dark,margin:"0 0 8px"}},"You're interested"),
      e("p",{style:{fontSize:14,color:T.sub,lineHeight:1.5,maxWidth:320,margin:"0 0 20px"}},"We will notify you when "+match.name.split(" ")[0]+" decides."),
      e(Card,{style:{width:"100%",maxWidth:340,textAlign:"left",marginBottom:16}},e(SectionLabel,{text:"CONVERSATION STARTERS"}),match.starters.map(function(st,i){return e("div",{key:i,style:{background:T.warm,borderRadius:8,padding:"10px 12px",fontSize:13,color:T.text,lineHeight:1.4,borderLeft:"3px solid "+T.accentL,marginBottom:8}},st)})),
      e(Btn,{full:true,onClick:function(){setTab("home");go(S.HOME)}},"Back to home")
    );

    if(screen===S.MSG) return e("div",null,
      e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 18px"}},"Messages"),
      e(Card,{style:{marginBottom:10,cursor:"pointer"},onClick:function(){go(S.CHAT)}},
        e("div",{style:{display:"flex",alignItems:"center",gap:12}},
          e("div",{style:{width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,"+T.rose+","+T.roseL+")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:18,color:"#fff"}},"S"),
          e("div",{style:{flex:1}},e("div",{style:{fontWeight:600,fontSize:15,color:T.dark}},"Sophie M."),e("div",{style:{fontSize:12,color:T.sub}},"Can't wait for Saturday!")),
          e("div",{style:{fontFamily:T.mono,fontSize:10,color:T.muted}},"2h ago"))
      ),
      e(Card,{style:{padding:"14px 16px",background:T.warm}},e("div",{style:{fontSize:13,color:T.sub,textAlign:"center"}},"Waiting for Elena to decide..."))
    );

    if(screen===S.CHAT) return e("div",{style:{display:"flex",flexDirection:"column",height:"calc(100vh - 140px)"}},
      e("div",{style:{display:"flex",alignItems:"center",gap:12,paddingBottom:14,borderBottom:"1px solid "+T.border,marginBottom:12}},
        e("button",{onClick:function(){go(S.MSG)},style:{fontSize:16,color:T.muted,background:"none",border:"none",cursor:"pointer"}},"<-"),
        e("div",{style:{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,"+T.rose+","+T.roseL+")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:14,color:"#fff"}},"S"),
        e("div",null,e("div",{style:{fontWeight:600,fontSize:15,color:T.dark}},"Sophie M."),e("div",{style:{fontFamily:T.mono,fontSize:11,color:T.sage}},"Stage 2"))
      ),
      e("div",{style:{flex:1,overflowY:"auto",display:"flex",flexDirection:"column",gap:8,paddingBottom:8}},
        msgs.map(function(m,i){var me=m.from==="me",sy=m.from==="system";return e("div",{key:i,style:{alignSelf:me?"flex-end":sy?"center":"flex-start",maxWidth:sy?"90%":"78%",padding:sy?"8px 14px":"10px 14px",borderRadius:16,background:me?T.dark:sy?T.sage+"12":T.card,color:me?T.cream:sy?T.sage:T.text,fontFamily:sy?T.mono:T.body,fontSize:sy?12:14,lineHeight:1.5,border:!me&&!sy?"1px solid "+T.border:"none",fontStyle:sy?"italic":"normal"}},m.text)})
      ),
      e("div",{style:{display:"flex",gap:8,paddingTop:10,borderTop:"1px solid "+T.border}},
        e("input",{value:inp,onChange:function(ev){setInp(ev.target.value)},onKeyDown:function(ev){if(ev.key==="Enter")send()},placeholder:"Type a message...",style:{flex:1,padding:"10px 14px",borderRadius:24,border:"1.5px solid "+T.border,fontSize:14,color:T.text,background:T.cream}}),
        e("button",{onClick:send,style:{width:42,height:42,borderRadius:"50%",background:T.dark,border:"none",color:T.cream,fontWeight:600,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}},"^"))
    );

    if(screen===S.CONN) {var c=ACTIVE_CONN; return e("div",null,
      e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 4px"}},"You & "+c.name.split(" ")[0]),
      e("div",{style:{fontFamily:T.mono,fontSize:12,color:T.muted,marginBottom:18}},"Stage "+c.stage+" - Week "+c.week),
      e(Card,{style:{marginBottom:12}},e(SectionLabel,{text:"CONNECTION HEALTH"}),e(ScoreBar,{label:"Emotional",score:Math.round(c.health.emotional*10),color:T.rose}),e(ScoreBar,{label:"Communication",score:Math.round(c.health.communication*10),color:T.ocean}),e(ScoreBar,{label:"Trust",score:Math.round(c.health.trust*10),color:T.sage}),e(ScoreBar,{label:"Growth",score:Math.round(c.health.growth*10),color:T.accent})),
      e(Card,{style:{marginBottom:12,background:T.sage+"12",border:"1.5px solid "+T.sage+"30",cursor:"pointer"},onClick:function(){setCkSt(0);setCkD({});go(S.CHK)}},e("div",{style:{fontWeight:600,fontSize:15,color:T.dark}},"Weekly Check-in"),e("div",{style:{fontSize:12,color:T.sub}},"Due "+c.nextCheckin+" - ~3 min")),
      e(Card,{style:{marginBottom:12}},e(SectionLabel,{text:"YOUR JOURNEY"}),c.milestones.map(function(m,i){return e("div",{key:i,style:{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<c.milestones.length-1?"1px solid "+T.border:"none"}},e("div",{style:{width:8,height:8,borderRadius:"50%",background:T.sage}}),e("span",{style:{fontSize:13,color:T.text}},m))})),
      e(SectionLabel,{text:"TOOLS"}),
      e("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}},["Conversation Guide","Date Ideas","Conflict Toolkit","Growth Dashboard"].map(function(t,i){return e(Card,{key:i,style:{padding:14,textAlign:"center",cursor:"pointer"}},e("div",{style:{fontWeight:600,fontSize:12,color:T.dark}},t))}))
    )}

    if(screen===S.CHK) {
      var steps=[{l:"APPRECIATION",q:"What did Sophie do this week that made you feel cared for?",t:"text"},{l:"CONNECTION",q:"Rate your emotional connection this week",t:"slider"},{l:"GROWTH",q:"What did you learn about Sophie?",t:"text"},{l:"INTENTION",q:"One thing you want to do for her next week?",t:"text"}];
      if(ckSt>=steps.length) return e("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"70vh",textAlign:"center"}},e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 8px"}},"Check-in complete"),e("p",{style:{fontSize:14,color:T.sub,maxWidth:300,margin:"0 0 24px"}},"Your reflections are private."),e(Btn,{primary:true,full:true,onClick:function(){setTab("connection");go(S.CONN)}},"Back to connection"));
      var stp=steps[ckSt];
      return e("div",null,
        e("div",{style:{display:"flex",alignItems:"center",gap:12,marginBottom:20}},
          e("button",{onClick:function(){ckSt>0?setCkSt(ckSt-1):go(S.CONN)},style:{fontSize:16,color:T.muted,background:"none",border:"none",cursor:"pointer"}},"<-"),
          e("div",{style:{flex:1,height:3,background:T.border,borderRadius:2}},e("div",{style:{height:"100%",width:((ckSt+1)/steps.length*100)+"%",background:T.sage,borderRadius:2}})),
          e("span",{style:{fontFamily:T.mono,fontSize:11,color:T.muted}},(ckSt+1)+"/"+steps.length)),
        e(SectionLabel,{text:"CHECK-IN - "+stp.l}),
        e("h3",{style:{fontFamily:T.serif,fontWeight:600,fontSize:20,color:T.dark,margin:"0 0 18px",lineHeight:1.35}},stp.q),
        stp.t==="text"&&e("textarea",{value:ckD[ckSt]||"",onChange:function(ev){var d=Object.assign({},ckD);d[ckSt]=ev.target.value;setCkD(d)},placeholder:"Take your time...",style:{width:"100%",minHeight:100,padding:14,borderRadius:12,border:"1.5px solid "+T.border,fontSize:14,color:T.text,background:T.warm,resize:"vertical",boxSizing:"border-box",marginBottom:16}}),
        stp.t==="slider"&&e("div",{style:{marginBottom:16}},e("input",{type:"range",min:"1",max:"10",value:ckD[ckSt]||7,onChange:function(ev){var d=Object.assign({},ckD);d[ckSt]=ev.target.value;setCkD(d)},style:{width:"100%"}}),e("div",{style:{display:"flex",justifyContent:"space-between",fontFamily:T.mono,fontSize:11,color:T.muted}},e("span",null,"Disconnected"),e("span",{style:{fontWeight:700,fontSize:18,color:T.sage}},(ckD[ckSt]||7)+"/10"),e("span",null,"Connected"))),
        e(Btn,{primary:true,full:true,onClick:function(){setCkSt(ckSt+1)}},ckSt<steps.length-1?"Next":"Complete"))
    }

    if(screen===S.PROF) return e("div",null,
      e("div",{style:{display:"flex",alignItems:"center",gap:16,marginBottom:24}},
        e("div",{style:{width:64,height:64,borderRadius:"50%",background:"linear-gradient(135deg,"+T.accent+","+T.accentL+")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:26,color:"#fff"}},USER.name[0]),
        e("div",null,e("div",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark}},USER.name+", "+USER.age),e("div",{style:{display:"flex",gap:6,marginTop:4}},e(Pill,{text:"PREMIUM",color:T.accent}),e(Badge,{level:3})))
      ),
      e(Card,{style:{marginBottom:12,cursor:"pointer"},onClick:function(){go(S.INS)}},e(SectionLabel,{text:"YOUR INSIGHTS"}),e("div",{style:{fontSize:13,color:T.text,lineHeight:1.8}},e("strong",null,"Attachment: "),USER.insights.attachment,e("br"),e("strong",null,"Communication: "),USER.insights.communication,e("br"),e("strong",null,"Conflict: "),USER.insights.conflict),e("div",{style:{fontWeight:500,fontSize:12,color:T.accent,marginTop:8}},"See full breakdown ->")),
      e(Card,{style:{marginBottom:12}},e(SectionLabel,{text:"YOUR SCORES"}),e(ScoreBar,{label:"Values",score:USER.scores.values,color:T.accent}),e(ScoreBar,{label:"Security",score:USER.scores.attachment,color:"#7B6B8D"}),e(ScoreBar,{label:"Direction",score:USER.scores.goals,color:T.sage}),e(ScoreBar,{label:"Communication",score:USER.scores.comms,color:T.ocean}),e(ScoreBar,{label:"Conflict",score:USER.scores.conflict,color:"#8C7355"})),
      e(Btn,{full:true,onClick:function(){go(S.OI)},style:{marginTop:8}},"Retake Assessment (Demo)")
    );

    if(screen===S.INS) {
      var ins=[{title:"Attachment: Secure-Leaning",color:"#7B6B8D",text:"You feel comfortable with closeness and tolerate distance well."},{title:"Communication: Analytical-Expressive",color:T.ocean,text:"You process internally before sharing. Thoughtful and precise."},{title:"Conflict: Collaborative Repair",color:"#8C7355",text:"You solve disagreements together. Strong repair instinct."},{title:"Values: Benevolence + Growth",color:T.accent,text:"You care for others and seek continuous improvement."}];
      return e("div",null,e(BackBtn,{label:"Profile",onClick:back}),e("h2",{style:{fontFamily:T.serif,fontWeight:700,fontSize:22,color:T.dark,margin:"0 0 18px"}},"Your Insights"),
        ins.map(function(n,i){return e(Card,{key:i,style:{marginBottom:10}},e("div",{style:{fontFamily:T.serif,fontWeight:600,fontSize:15,color:n.color,marginBottom:8}},n.title),e("div",{style:{fontSize:13,color:T.text,lineHeight:1.6}},n.text))}))
    }

    return e("div",null,"Loading...");
  }

  var showNav=screen!==S.OI&&screen!==S.OQ&&screen!==S.OD&&screen!==S.CHAT;
  return e("div",{style:{maxWidth:430,margin:"0 auto",minHeight:"100vh",background:T.bg,fontFamily:T.body,color:T.text,position:"relative",display:"flex",flexDirection:"column"}},
    e("div",{style:{padding:"8px 20px 0",display:"flex",justifyContent:"space-between",fontFamily:T.mono,fontWeight:600,fontSize:12,color:T.muted}},e("span",null,"9:41"),e("span",null,"...")),
    e("div",{ref:scrollRef,style:{flex:1,padding:"12px 20px 100px",overflowY:"auto",opacity:fade?1:0,transition:"opacity 0.15s ease"}},content()),
    showNav&&e("div",{style:{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:T.card,borderTop:"1px solid "+T.border,display:"flex",justifyContent:"space-around",padding:"8px 0 22px",zIndex:100}},
      ["home","matches","connection","profile"].map(function(t){return e("button",{key:t,onClick:function(){navTab(t)},style:{background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,padding:"4px 12px",color:tab===t?T.dark:T.muted}},
        e("span",{style:{fontWeight:tab===t?600:400,fontSize:10,letterSpacing:0.3,textTransform:"capitalize"}},t==="matches"?"Messages":t))})
    )
  );
}
