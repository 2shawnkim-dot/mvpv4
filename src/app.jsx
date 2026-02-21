import React, { useState, useRef } from "react";
import { T } from "./tokens.js";
import { USER, MATCHES, ACTIVE_CONN, ONBOARD_QS } from "./data.js";
import { BackBtn, Badge, Pill, ScoreBar, Card, Btn, SectionLabel } from "./ui.jsx";

var S = {
  ONBOARD_INTRO: "oi",
  ONBOARD_Q: "oq",
  ONBOARD_DONE: "od",
  HOME: "home",
  MATCH_VIEW: "mv",
  MATCH_COMPAT: "mc",
  REFLECT: "ref",
  DECISION: "dec",
  ACCEPTED: "acc",
  MESSAGES: "msg",
  CHAT: "chat",
  CONNECTION: "conn",
  CHECKIN: "chk",
  PROFILE: "prof",
  INSIGHTS: "ins",
};

export default function App() {
  var [screen, setScreen] = useState(S.HOME);
  var [prev, setPrev] = useState(null);
  var [match, setMatch] = useState(null);
  var [qIdx, setQIdx] = useState(0);
  var [answers, setAnswers] = useState({});
  var [reflect, setReflect] = useState({ q1: "", q2: "" });
  var [msgs, setMsgs] = useState([
    { from: "system", text: "You matched! Here is a conversation starter based on your shared values:" },
    { from: "system", text: "You both value personal growth. Ask about a belief she changed her mind about recently." },
  ]);
  var [input, setInput] = useState("");
  var [ckStep, setCkStep] = useState(0);
  var [ckData, setCkData] = useState({});
  var [fade, setFade] = useState(true);
  var [tab, setTab] = useState("home");
  var ref = useRef(null);

  function go(s, m) {
    setFade(false);
    setTimeout(function () {
      setPrev(screen);
      setScreen(s);
      if (m) setMatch(m);
      setFade(true);
      if (ref.current) ref.current.scrollTop = 0;
    }, 150);
  }

  function back() {
    if (prev) go(prev);
  }

  function navTab(t) {
    setTab(t);
    if (t === "home") go(S.HOME);
    if (t === "matches") go(S.MESSAGES);
    if (t === "connection") go(S.CONNECTION);
    if (t === "profile") go(S.PROFILE);
  }

  function sendMsg() {
    if (!input.trim()) return;
    setMsgs(function (p) { return p.concat({ from: "me", text: input }); });
    setInput("");
    setTimeout(function () {
      setMsgs(function (p) { return p.concat({ from: "them", text: "That is a great question! Let me think about it." }); });
    }, 1200);
  }

  function renderScreen() {
    // ONBOARDING INTRO
    if (screen === S.ONBOARD_INTRO) {
      return React.createElement("div", {
        style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "85vh", textAlign: "center", padding: "0 20px" }
      },
        React.createElement("div", { style: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, " + T.accent + ", " + T.accentL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, marginBottom: 24, boxShadow: "0 8px 24px " + T.accent + "30" } }, "\u2726"),
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 26, color: T.dark, margin: "0 0 10px" } }, "Let's learn about you"),
        React.createElement("p", { style: { fontFamily: T.body, fontSize: 14, color: T.sub, lineHeight: 1.6, maxWidth: 300, margin: "0 0 8px" } }, "8 questions that help us find someone who truly fits. No right or wrong answers."),
        React.createElement("p", { style: { fontFamily: T.mono, fontSize: 12, color: T.muted, margin: "0 0 32px" } }, "~4 minutes"),
        React.createElement(Btn, { primary: true, full: true, onClick: function () { go(S.ONBOARD_Q); } }, "Begin"),
        React.createElement("button", { onClick: function () { go(S.HOME); }, style: { fontFamily: T.body, fontSize: 12, color: T.muted, background: "none", border: "none", cursor: "pointer", marginTop: 16, textDecoration: "underline" } }, "Skip for now (demo)")
      );
    }

    // ONBOARDING QUESTIONS
    if (screen === S.ONBOARD_Q) {
      var q = ONBOARD_QS[qIdx];
      var progress = ((qIdx + 1) / ONBOARD_QS.length) * 100;

      function selectChoice(i) {
        var newA = Object.assign({}, answers);
        newA[q.id] = i;
        setAnswers(newA);
        setTimeout(function () {
          if (qIdx < ONBOARD_QS.length - 1) setQIdx(qIdx + 1);
          else go(S.ONBOARD_DONE);
        }, 300);
      }

      function selectRank(i) {
        var key = q.id + "_" + i;
        var used = Object.keys(answers).filter(function (k) { return k.startsWith(q.id + "_"); }).length;
        var next = used < 6 ? used + 1 : null;
        if (next) {
          var newA = Object.assign({}, answers);
          newA[key] = next;
          setAnswers(newA);
          if (used + 1 >= 6) {
            setTimeout(function () {
              if (qIdx < ONBOARD_QS.length - 1) setQIdx(qIdx + 1);
              else go(S.ONBOARD_DONE);
            }, 400);
          }
        }
      }

      return React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 } },
          React.createElement("button", { onClick: function () { if (qIdx > 0) setQIdx(qIdx - 1); else go(S.ONBOARD_INTRO); }, style: { fontFamily: T.body, fontWeight: 500, fontSize: 16, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0 } }, "<-"),
          React.createElement("div", { style: { flex: 1, height: 3, background: T.border, borderRadius: 2 } },
            React.createElement("div", { style: { height: "100%", width: progress + "%", background: T.accent, borderRadius: 2, transition: "width 0.3s" } })
          ),
          React.createElement("span", { style: { fontFamily: T.mono, fontWeight: 500, fontSize: 11, color: T.muted } }, (qIdx + 1) + "/" + ONBOARD_QS.length)
        ),
        React.createElement(Pill, { text: q.section, color: T.ocean }),
        React.createElement("h3", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 20, color: T.dark, margin: "14px 0 20px", lineHeight: 1.35 } }, q.q),

        q.type === "choice" && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } },
          q.options.map(function (opt, i) {
            var sel = answers[q.id] === i;
            return React.createElement("button", {
              key: i,
              onClick: function () { selectChoice(i); },
              style: { padding: "14px 16px", borderRadius: 12, textAlign: "left", border: sel ? "2px solid " + T.accent : "1.5px solid " + T.border, background: sel ? T.accent + "08" : T.card, fontFamily: T.body, fontSize: 14, color: T.text, cursor: "pointer", lineHeight: 1.4, transition: "all 0.15s" }
            }, opt);
          })
        ),

        q.type === "rank" && React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } },
          React.createElement("p", { style: { fontFamily: T.body, fontSize: 12, color: T.muted, margin: "0 0 8px" } }, "Tap to assign priority (1 = highest)"),
          q.options.map(function (opt, i) {
            var rank = answers[q.id + "_" + i];
            return React.createElement("button", {
              key: i,
              onClick: function () { selectRank(i); },
              style: { padding: "12px 16px", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, border: rank ? "2px solid " + T.accent : "1.5px solid " + T.border, background: rank ? T.accent + "08" : T.card, cursor: "pointer", transition: "all 0.15s" }
            },
              React.createElement("div", { style: { width: 28, height: 28, borderRadius: "50%", background: rank ? T.accent : T.border, color: rank ? "#fff" : T.muted, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.mono, fontWeight: 700, fontSize: 12, flexShrink: 0 } }, rank || "-"),
              React.createElement("span", { style: { fontFamily: T.body, fontSize: 14, color: T.text } }, opt)
            );
          })
        )
      );
    }

    // ONBOARDING DONE
    if (screen === S.ONBOARD_DONE) {
      return React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80vh", textAlign: "center", padding: "0 20px" } },
        React.createElement("div", { style: { fontSize: 48, marginBottom: 20 } }, "\u2728"),
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 24, color: T.dark, margin: "0 0 10px" } }, "Profile complete"),
        React.createElement("p", { style: { fontFamily: T.body, fontSize: 14, color: T.sub, lineHeight: 1.6, maxWidth: 320, margin: "0 0 6px" } }, "Your first matches will arrive within 24 hours."),
        React.createElement("p", { style: { fontFamily: T.mono, fontSize: 12, color: T.sage, margin: "0 0 32px" } }, "12 highly compatible people found"),
        React.createElement(Btn, { primary: true, full: true, onClick: function () { setTab("home"); go(S.HOME); } }, "Go to Home")
      );
    }

    // HOME
    if (screen === S.HOME) {
      return React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } },
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: T.mono, fontSize: 12, color: T.muted, letterSpacing: 1.5, marginBottom: 4 } }, "WEDNESDAY, FEB 19"),
            React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 24, color: T.dark, margin: 0 } }, "Good evening, " + USER.name)
          ),
          React.createElement("div", { style: { width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, " + T.accent + ", " + T.accentL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 700, fontSize: 16, color: "#fff" } }, USER.name[0])
        ),

        // Active connection
        React.createElement(Card, { style: { marginBottom: 14, background: "linear-gradient(135deg, " + T.dark + ", #2A2520)", border: "none", cursor: "pointer" }, onClick: function () { setTab("connection"); go(S.CONNECTION); } },
          React.createElement(SectionLabel, { text: "YOUR CONNECTION" }),
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 } },
            React.createElement("div", { style: { width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, " + T.rose + ", " + T.roseL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 700, fontSize: 18, color: "#fff" } }, "S"),
            React.createElement("div", null,
              React.createElement("div", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 16, color: T.cream } }, ACTIVE_CONN.name),
              React.createElement("div", { style: { fontFamily: T.body, fontSize: 12, color: T.muted } }, "Stage " + ACTIVE_CONN.stage + " - Week " + ACTIVE_CONN.week)
            )
          ),
          React.createElement("div", { style: { fontFamily: T.body, fontSize: 12, color: T.accentL } }, "Next check-in: " + ACTIVE_CONN.nextCheckin + " ->")
        ),

        // Matches
        React.createElement(SectionLabel, { text: "NEW MATCHES" }),
        MATCHES.map(function (m) {
          return React.createElement(Card, { key: m.id, style: { marginBottom: 10, cursor: "pointer" }, onClick: function () { go(S.MATCH_VIEW, m); } },
            React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 } },
              React.createElement("div", { style: { width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg, #D4C5B5, #BEA998)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 } }, m.name[0]),
              React.createElement("div", { style: { flex: 1, minWidth: 0 } },
                React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } },
                  React.createElement("span", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 16, color: T.dark } }, m.name + ", " + m.age),
                  React.createElement(Badge, { level: m.verified })
                ),
                React.createElement("div", { style: { fontFamily: T.body, fontSize: 12, color: T.sub, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, m.tagline)
              ),
              React.createElement("div", { style: { textAlign: "right", flexShrink: 0 } },
                React.createElement("div", { style: { fontFamily: T.mono, fontWeight: 700, fontSize: 22, color: T.sage } }, m.compat.overall),
                React.createElement("div", { style: { fontFamily: T.mono, fontSize: 9, color: T.muted } }, "MATCH")
              )
            ),
            React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap" } },
              m.shared.map(function (v) { return React.createElement(Pill, { key: v, text: v }); }),
              m.isNew && React.createElement(Pill, { text: "NEW", color: T.accent })
            ),
            React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 8 } }, "Expires: " + m.expires)
          );
        }),

        // Weekly insight
        React.createElement(Card, { style: { marginTop: 6, background: T.warm, border: "1px solid " + T.accentL + "30" } },
          React.createElement(SectionLabel, { text: "WEEKLY INSIGHT" }),
          React.createElement("p", { style: { fontFamily: T.body, fontSize: 13, color: T.text, lineHeight: 1.5, margin: 0 } }, "Your matches this week score unusually high on conflict compatibility. They share your collaborative approach to disagreements.")
        )
      );
    }

    // MATCH VIEW
    if (screen === S.MATCH_VIEW && match) {
      return React.createElement("div", null,
        React.createElement(BackBtn, { label: "Home", onClick: back }),
        React.createElement("div", { style: { height: 220, borderRadius: 18, background: "linear-gradient(145deg, #D4C5B5 0%, #BEA998 100%)", display: "flex", alignItems: "flex-end", padding: 20, marginBottom: 16, position: "relative" } },
          React.createElement("div", { style: { position: "absolute", top: 14, right: 14 } }, React.createElement(Badge, { level: match.verified })),
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 28, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.25)" } }, match.name + ", " + match.age),
            React.createElement("div", { style: { fontFamily: T.body, fontSize: 13, color: "rgba(255,255,255,0.85)", marginTop: 2 } }, match.loc)
          )
        ),
        React.createElement(Card, { style: { marginBottom: 12 } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 14, marginBottom: 14 } },
            React.createElement("div", { style: { fontFamily: T.mono, fontWeight: 700, fontSize: 34, color: T.sage } }, match.compat.overall),
            React.createElement("div", null,
              React.createElement("div", { style: { fontFamily: T.mono, fontWeight: 500, fontSize: 10, color: T.muted, letterSpacing: 1.5 } }, "COMPATIBILITY"),
              React.createElement("div", { style: { fontFamily: T.body, fontSize: 13, color: T.sub } }, "Strong alignment across all dimensions")
            )
          ),
          React.createElement("div", { style: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 } },
            match.shared.map(function (v) { return React.createElement(Pill, { key: v, text: v }); })
          ),
          React.createElement("button", { onClick: function () { go(S.MATCH_COMPAT); }, style: { width: "100%", padding: "11px", borderRadius: 10, border: "1.5px solid " + T.border, background: "none", fontFamily: T.body, fontWeight: 600, fontSize: 13, color: T.dark, cursor: "pointer" } }, "Explore compatibility breakdown ->")
        ),
        match.prompts.map(function (pr, i) {
          return React.createElement(Card, { key: i, style: { marginBottom: 10 } },
            React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 14, color: T.accent, fontStyle: "italic", marginBottom: 6 } }, pr.q),
            React.createElement("div", { style: { fontFamily: T.body, fontSize: 14, color: T.text, lineHeight: 1.6 } }, pr.a)
          );
        }),
        React.createElement(Btn, { primary: true, full: true, onClick: function () { go(S.REFLECT); }, style: { marginTop: 6 } }, "Continue to reflection")
      );
    }

    // COMPATIBILITY DEEP DIVE
    if (screen === S.MATCH_COMPAT && match) {
      var dims = [
        { key: "values", label: "Values Alignment", color: T.accent, insight: "You both prioritize benevolence and personal growth above achievement." },
        { key: "attachment", label: "Emotional Security", color: "#7B6B8D", insight: "You both bring a secure base. Her slightly higher need for reassurance pairs well with your expressiveness." },
        { key: "goals", label: "Life Direction", color: T.sage, insight: "You both want children within 2-3 years and are open to relocation." },
        { key: "comms", label: "Communication", color: T.ocean, insight: "She is more emotionally expressive; you are more analytical. Complementary when both feel heard." },
        { key: "conflict", label: "Conflict Style", color: "#8C7355", insight: "She repairs quickly and approaches conflict collaboratively." },
      ];
      return React.createElement("div", null,
        React.createElement(BackBtn, { label: "Profile", onClick: back }),
        React.createElement("h3", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 4px" } }, "Compatibility with " + match.name.split(" ")[0]),
        React.createElement("p", { style: { fontFamily: T.body, fontSize: 13, color: T.sub, margin: "0 0 18px" } }, "Tap any dimension for insight."),
        dims.map(function (d) {
          return React.createElement(Card, { key: d.key, style: { marginBottom: 8, padding: "14px 16px" } },
            React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 } },
              React.createElement("span", { style: { fontFamily: T.body, fontWeight: 500, fontSize: 14, color: T.dark } }, d.label),
              React.createElement("span", { style: { fontFamily: T.mono, fontWeight: 700, fontSize: 18, color: d.color } }, match.compat[d.key])
            ),
            React.createElement("div", { style: { height: 4, background: T.border, borderRadius: 2, marginBottom: 8 } },
              React.createElement("div", { style: { height: "100%", width: match.compat[d.key] + "%", background: d.color, borderRadius: 2 } })
            ),
            React.createElement("div", { style: { fontFamily: T.body, fontSize: 12.5, color: T.sub, lineHeight: 1.5 } }, d.insight)
          );
        }),
        React.createElement(Btn, { full: true, onClick: back, style: { marginTop: 8 } }, "<- Back to profile")
      );
    }

    // REFLECTION GATE
    if (screen === S.REFLECT) {
      var firstName = match ? match.name.split(" ")[0] : "";
      return React.createElement("div", null,
        React.createElement(BackBtn, { label: "Profile", onClick: back }),
        React.createElement("div", { style: { textAlign: "center", marginBottom: 24 } },
          React.createElement("div", { style: { fontFamily: T.mono, fontWeight: 500, fontSize: 10, letterSpacing: 2, color: T.accent, marginBottom: 8 } }, "REFLECTION MOMENT"),
          React.createElement("h3", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 8px" } }, "Before you decide"),
          React.createElement("p", { style: { fontFamily: T.body, fontSize: 13, color: T.sub, lineHeight: 1.5, maxWidth: 320, margin: "0 auto" } }, "Take a moment to check in with yourself.")
        ),
        React.createElement(Card, { style: { marginBottom: 14 } },
          React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 15, color: T.dark, marginBottom: 10, lineHeight: 1.3 } }, "What about " + firstName + "'s profile resonated with you?"),
          React.createElement("textarea", { value: reflect.q1, onChange: function (e) { setReflect(function (p) { return Object.assign({}, p, { q1: e.target.value }); }); }, placeholder: "Take your time...", style: { width: "100%", minHeight: 70, padding: 12, borderRadius: 8, border: "1.5px solid " + T.border, fontFamily: T.body, fontSize: 14, color: T.text, background: T.warm, resize: "vertical", boxSizing: "border-box" } })
        ),
        React.createElement(Card, { style: { marginBottom: 20 } },
          React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 15, color: T.dark, marginBottom: 10, lineHeight: 1.3 } }, "Is there anything that gives you pause?"),
          React.createElement("textarea", { value: reflect.q2, onChange: function (e) { setReflect(function (p) { return Object.assign({}, p, { q2: e.target.value }); }); }, placeholder: "Okay if there is, and okay if there is not...", style: { width: "100%", minHeight: 70, padding: 12, borderRadius: 8, border: "1.5px solid " + T.border, fontFamily: T.body, fontSize: 14, color: T.text, background: T.warm, resize: "vertical", boxSizing: "border-box" } })
        ),
        reflect.q1.length > 10
          ? React.createElement(Btn, { primary: true, full: true, onClick: function () { go(S.DECISION); } }, "I'm ready to decide")
          : React.createElement("div", { style: { textAlign: "center", padding: 13, borderRadius: 10, border: "1.5px dashed " + T.border, color: T.muted, fontFamily: T.body, fontSize: 13 } }, "Share what resonated to unlock your decision")
      );
    }

    // DECISION
    if (screen === S.DECISION && match) {
      return React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "65vh", textAlign: "center" } },
        React.createElement("div", { style: { width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #D4C5B5, #BEA998)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 700, fontSize: 22, color: "#fff", marginBottom: 16 } }, match.name[0]),
        React.createElement("h3", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 4px" } }, match.name),
        React.createElement("div", { style: { fontFamily: T.mono, fontWeight: 500, fontSize: 12, color: T.sage, margin: "0 0 28px" } }, match.compat.overall + "% compatible"),
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 300 } },
          React.createElement(Btn, { primary: true, full: true, onClick: function () { go(S.ACCEPTED); }, style: { background: T.sage } }, "I'd like to connect"),
          React.createElement(Btn, { full: true, onClick: function () { go(S.HOME); } }, "Not the right fit")
        ),
        React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 20, lineHeight: 1.5 } }, "Neither person knows the other's decision until both have decided.")
      );
    }

    // ACCEPTED
    if (screen === S.ACCEPTED && match) {
      return React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" } },
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 24, color: T.dark, margin: "0 0 8px" } }, "You're interested"),
        React.createElement("p", { style: { fontFamily: T.body, fontSize: 14, color: T.sub, lineHeight: 1.5, maxWidth: 320, margin: "0 0 20px" } }, "We will let you know when " + match.name.split(" ")[0] + " has decided."),
        React.createElement(Card, { style: { width: "100%", maxWidth: 340, textAlign: "left", marginBottom: 16 } },
          React.createElement(SectionLabel, { text: "CONVERSATION STARTERS" }),
          match.starters.map(function (s, i) {
            return React.createElement("div", { key: i, style: { background: T.warm, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.text, lineHeight: 1.4, borderLeft: "3px solid " + T.accentL, marginBottom: 8, fontFamily: T.body } }, s);
          })
        ),
        React.createElement(Btn, { full: true, onClick: function () { setTab("home"); go(S.HOME); } }, "Back to home")
      );
    }

    // MESSAGES
    if (screen === S.MESSAGES) {
      return React.createElement("div", null,
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 18px" } }, "Messages"),
        React.createElement(Card, { style: { marginBottom: 10, cursor: "pointer" }, onClick: function () { go(S.CHAT); } },
          React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } },
            React.createElement("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, " + T.rose + ", " + T.roseL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 700, fontSize: 18, color: "#fff", flexShrink: 0 } }, "S"),
            React.createElement("div", { style: { flex: 1 } },
              React.createElement("div", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 15, color: T.dark } }, "Sophie M."),
              React.createElement("div", { style: { fontFamily: T.body, fontSize: 12, color: T.sub } }, "Can't wait for Saturday!")
            ),
            React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.muted } }, "2h ago")
          )
        ),
        React.createElement(Card, { style: { padding: "14px 16px", background: T.warm } },
          React.createElement("div", { style: { fontFamily: T.body, fontSize: 13, color: T.sub, textAlign: "center" } }, "Waiting for Elena to decide...")
        )
      );
    }

    // CHAT
    if (screen === S.CHAT) {
      return React.createElement("div", { style: { display: "flex", flexDirection: "column", height: "calc(100vh - 140px)" } },
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, paddingBottom: 14, borderBottom: "1px solid " + T.border, marginBottom: 12 } },
          React.createElement("button", { onClick: function () { go(S.MESSAGES); }, style: { fontFamily: T.body, fontWeight: 500, fontSize: 16, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0 } }, "<-"),
          React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, " + T.rose + ", " + T.roseL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 600, fontSize: 14, color: "#fff" } }, "S"),
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 15, color: T.dark } }, "Sophie M."),
            React.createElement("div", { style: { fontFamily: T.mono, fontSize: 11, color: T.sage } }, "Stage 2 - Week 6")
          )
        ),
        React.createElement("div", { style: { flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingBottom: 8 } },
          msgs.map(function (msg, i) {
            var isMe = msg.from === "me";
            var isSys = msg.from === "system";
            return React.createElement("div", {
              key: i,
              style: { alignSelf: isMe ? "flex-end" : isSys ? "center" : "flex-start", maxWidth: isSys ? "90%" : "78%", padding: isSys ? "8px 14px" : "10px 14px", borderRadius: 16, background: isMe ? T.dark : isSys ? T.sage + "12" : T.card, color: isMe ? T.cream : isSys ? T.sage : T.text, fontFamily: isSys ? T.mono : T.body, fontSize: isSys ? 12 : 14, lineHeight: 1.5, border: !isMe && !isSys ? "1px solid " + T.border : "none", fontStyle: isSys ? "italic" : "normal" }
            }, msg.text);
          })
        ),
        React.createElement("div", { style: { display: "flex", gap: 8, paddingTop: 10, borderTop: "1px solid " + T.border } },
          React.createElement("input", { value: input, onChange: function (e) { setInput(e.target.value); }, onKeyDown: function (e) { if (e.key === "Enter") sendMsg(); }, placeholder: "Type a message...", style: { flex: 1, padding: "10px 14px", borderRadius: 24, border: "1.5px solid " + T.border, fontFamily: T.body, fontSize: 14, color: T.text, background: T.cream } }),
          React.createElement("button", { onClick: sendMsg, style: { width: 42, height: 42, borderRadius: "50%", background: T.dark, border: "none", color: T.cream, fontFamily: T.body, fontWeight: 600, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, "^")
        )
      );
    }

    // CONNECTION
    if (screen === S.CONNECTION) {
      var c = ACTIVE_CONN;
      return React.createElement("div", null,
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 4px" } }, "You & " + c.name.split(" ")[0]),
        React.createElement("div", { style: { fontFamily: T.mono, fontSize: 12, color: T.muted, marginBottom: 18 } }, "Stage " + c.stage + " - Building - Week " + c.week),
        React.createElement(Card, { style: { marginBottom: 12 } },
          React.createElement(SectionLabel, { text: "CONNECTION HEALTH" }),
          React.createElement(ScoreBar, { label: "Emotional", score: Math.round(c.health.emotional * 10), color: T.rose }),
          React.createElement(ScoreBar, { label: "Communication", score: Math.round(c.health.communication * 10), color: T.ocean }),
          React.createElement(ScoreBar, { label: "Trust & Safety", score: Math.round(c.health.trust * 10), color: T.sage }),
          React.createElement(ScoreBar, { label: "Growth", score: Math.round(c.health.growth * 10), color: T.accent })
        ),
        React.createElement(Card, { style: { marginBottom: 12, background: T.sage + "12", border: "1.5px solid " + T.sage + "30", cursor: "pointer" }, onClick: function () { setCkStep(0); setCkData({}); go(S.CHECKIN); } },
          React.createElement("div", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 15, color: T.dark } }, "Weekly Check-in"),
          React.createElement("div", { style: { fontFamily: T.body, fontSize: 12, color: T.sub } }, "Due " + c.nextCheckin + " - ~3 minutes")
        ),
        React.createElement(Card, { style: { marginBottom: 12 } },
          React.createElement(SectionLabel, { text: "YOUR JOURNEY" }),
          c.milestones.map(function (m, i) {
            return React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: i < c.milestones.length - 1 ? "1px solid " + T.border : "none" } },
              React.createElement("div", { style: { width: 8, height: 8, borderRadius: "50%", background: T.sage, flexShrink: 0 } }),
              React.createElement("span", { style: { fontFamily: T.body, fontSize: 13, color: T.text } }, m)
            );
          })
        ),
        React.createElement(SectionLabel, { text: "RELATIONSHIP TOOLS" }),
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 } },
          [
            { icon: "Conversation Guide", sub: "Week 6: Conflict Dry Run" },
            { icon: "Date Ideas", sub: "3 suggestions ready" },
            { icon: "Conflict Toolkit", sub: "Repair phrases & more" },
            { icon: "Growth Dashboard", sub: "Available at Stage 3" },
          ].map(function (tool, i) {
            return React.createElement(Card, { key: i, style: { padding: 14, textAlign: "center", cursor: "pointer" } },
              React.createElement("div", { style: { fontFamily: T.body, fontWeight: 600, fontSize: 12, color: T.dark, lineHeight: 1.3 } }, tool.icon),
              React.createElement("div", { style: { fontFamily: T.mono, fontSize: 10, color: T.muted, marginTop: 4 } }, tool.sub)
            );
          })
        )
      );
    }

    // CHECKIN
    if (screen === S.CHECKIN) {
      var steps = [
        { label: "APPRECIATION", q: "What did Sophie do this week that made you feel cared for?", type: "text" },
        { label: "CONNECTION", q: "Rate your emotional connection this week", type: "slider" },
        { label: "GROWTH", q: "What did you learn about Sophie this week?", type: "text" },
        { label: "INTENTION", q: "One small thing you want to do for her next week?", type: "text" },
      ];
      if (ckStep >= steps.length) {
        return React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70vh", textAlign: "center" } },
          React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 8px" } }, "Check-in complete"),
          React.createElement("p", { style: { fontFamily: T.body, fontSize: 14, color: T.sub, lineHeight: 1.5, maxWidth: 300, margin: "0 0 24px" } }, "Your reflections are private. Sophie will not see them unless you choose to share."),
          React.createElement(Btn, { primary: true, full: true, onClick: function () { setTab("connection"); go(S.CONNECTION); } }, "Back to connection")
        );
      }
      var step = steps[ckStep];
      return React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 } },
          React.createElement("button", { onClick: function () { if (ckStep > 0) setCkStep(ckStep - 1); else go(S.CONNECTION); }, style: { fontFamily: T.body, fontWeight: 500, fontSize: 16, color: T.muted, background: "none", border: "none", cursor: "pointer", padding: 0 } }, "<-"),
          React.createElement("div", { style: { flex: 1, height: 3, background: T.border, borderRadius: 2 } },
            React.createElement("div", { style: { height: "100%", width: ((ckStep + 1) / steps.length * 100) + "%", background: T.sage, borderRadius: 2, transition: "width 0.3s" } })
          ),
          React.createElement("span", { style: { fontFamily: T.mono, fontWeight: 500, fontSize: 11, color: T.muted } }, (ckStep + 1) + "/" + steps.length)
        ),
        React.createElement(SectionLabel, { text: "WEEKLY CHECK-IN - " + step.label }),
        React.createElement("h3", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 20, color: T.dark, margin: "0 0 18px", lineHeight: 1.35 } }, step.q),
        step.type === "text" && React.createElement("textarea", { value: ckData[ckStep] || "", onChange: function (e) { var d = Object.assign({}, ckData); d[ckStep] = e.target.value; setCkData(d); }, placeholder: "Take your time...", style: { width: "100%", minHeight: 100, padding: 14, borderRadius: 12, border: "1.5px solid " + T.border, fontFamily: T.body, fontSize: 14, color: T.text, background: T.warm, resize: "vertical", boxSizing: "border-box", marginBottom: 16 } }),
        step.type === "slider" && React.createElement("div", { style: { marginBottom: 16 } },
          React.createElement("input", { type: "range", min: "1", max: "10", value: ckData[ckStep] || 7, onChange: function (e) { var d = Object.assign({}, ckData); d[ckStep] = e.target.value; setCkData(d); }, style: { width: "100%", accentColor: T.sage } }),
          React.createElement("div", { style: { display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontSize: 11, color: T.muted } },
            React.createElement("span", null, "Disconnected"),
            React.createElement("span", { style: { fontFamily: T.mono, fontWeight: 700, fontSize: 18, color: T.sage } }, (ckData[ckStep] || 7) + "/10"),
            React.createElement("span", null, "Deeply connected")
          )
        ),
        React.createElement(Btn, { primary: true, full: true, onClick: function () { setCkStep(ckStep + 1); } }, ckStep < steps.length - 1 ? "Next" : "Complete check-in")
      );
    }

    // PROFILE
    if (screen === S.PROFILE) {
      return React.createElement("div", null,
        React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 24 } },
          React.createElement("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, " + T.accent + ", " + T.accentL + ")", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.body, fontWeight: 700, fontSize: 26, color: "#fff" } }, USER.name[0]),
          React.createElement("div", null,
            React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark } }, USER.name + ", " + USER.age),
            React.createElement("div", { style: { display: "flex", gap: 6, marginTop: 4 } },
              React.createElement(Pill, { text: "PREMIUM", color: T.accent }),
              React.createElement(Badge, { level: 3 })
            )
          )
        ),
        React.createElement(Card, { style: { marginBottom: 12, cursor: "pointer" }, onClick: function () { go(S.INSIGHTS); } },
          React.createElement(SectionLabel, { text: "YOUR INSIGHTS" }),
          React.createElement("div", { style: { fontFamily: T.body, fontSize: 13, color: T.text, lineHeight: 1.8 } },
            React.createElement("strong", null, "Attachment: "), USER.insights.attachment,
            React.createElement("br", null),
            React.createElement("strong", null, "Communication: "), USER.insights.communication,
            React.createElement("br", null),
            React.createElement("strong", null, "Conflict: "), USER.insights.conflict
          ),
          React.createElement("div", { style: { fontFamily: T.body, fontWeight: 500, fontSize: 12, color: T.accent, marginTop: 8 } }, "See full breakdown ->")
        ),
        React.createElement(Card, { style: { marginBottom: 12 } },
          React.createElement(SectionLabel, { text: "YOUR SCORES" }),
          React.createElement(ScoreBar, { label: "Values Clarity", score: USER.scores.values, color: T.accent }),
          React.createElement(ScoreBar, { label: "Emotional Security", score: USER.scores.attachment, color: "#7B6B8D" }),
          React.createElement(ScoreBar, { label: "Life Direction", score: USER.scores.goals, color: T.sage }),
          React.createElement(ScoreBar, { label: "Communication", score: USER.scores.comms, color: T.ocean }),
          React.createElement(ScoreBar, { label: "Conflict Resilience", score: USER.scores.conflict, color: "#8C7355" })
        ),
        ["Edit Profile", "Subscription", "Safety & Privacy", "Notifications"].map(function (item, i) {
          return React.createElement(Card, { key: i, style: { marginBottom: 8, padding: "14px 16px", cursor: "pointer" } },
            React.createElement("div", { style: { fontFamily: T.body, fontWeight: 500, fontSize: 14, color: T.dark } }, item)
          );
        }),
        React.createElement(Btn, { full: true, onClick: function () { go(S.ONBOARD_INTRO); }, style: { marginTop: 8 } }, "Retake Assessment (Demo)")
      );
    }

    // INSIGHTS
    if (screen === S.INSIGHTS) {
      var insights = [
        { title: "Attachment Style: Secure-Leaning", color: "#7B6B8D", text: "You generally feel comfortable with emotional closeness and can tolerate periods without contact. Under stress, you might briefly shift toward anxious patterns. This is normal and healthy awareness." },
        { title: "Communication: Analytical-Expressive", color: T.ocean, text: "You process feelings internally before sharing them. Your communication tends to be thoughtful and precise. Partners who are more spontaneously expressive may sometimes interpret your processing time as distance." },
        { title: "Conflict: Collaborative Repair", color: "#8C7355", text: "You approach disagreements as problems to solve together. Your repair instinct is strong. This is one of the strongest predictors of relationship longevity." },
        { title: "Values: Benevolence + Growth", color: T.accent, text: "Your core values center on caring for others and continuous self-improvement. You are most compatible with partners who share this growth orientation." },
      ];
      return React.createElement("div", null,
        React.createElement(BackBtn, { label: "Profile", onClick: back }),
        React.createElement("h2", { style: { fontFamily: T.serif, fontWeight: 700, fontSize: 22, color: T.dark, margin: "0 0 4px" } }, "Your Insights"),
        React.createElement("p", { style: { fontFamily: T.body, fontSize: 13, color: T.sub, margin: "0 0 18px" } }, "Based on your assessment and in-app behavior."),
        insights.map(function (ins, i) {
          return React.createElement(Card, { key: i, style: { marginBottom: 10 } },
            React.createElement("div", { style: { fontFamily: T.serif, fontWeight: 600, fontSize: 15, color: ins.color, marginBottom: 8 } }, ins.title),
            React.createElement("div", { style: { fontFamily: T.body, fontSize: 13, color: T.text, lineHeight: 1.6 } }, ins.text)
          );
        })
      );
    }

    return React.createElement("div", null, "Loading...");
  }

  // TAB BAR
  var showNav = screen !== S.ONBOARD_INTRO && screen !== S.ONBOARD_Q && screen !== S.ONBOARD_DONE && screen !== S.CHAT;

  var tabs = [
    { id: "home", label: "Home" },
    { id: "matches", label: "Messages" },
    { id: "connection", label: "Connection" },
    { id: "profile", label: "Profile" },
  ];

  return React.createElement("div", { style: { maxWidth: 430, margin: "0 auto", minHeight: "100vh", background: T.bg, fontFamily: T.body, color: T.text, position: "relative", display: "flex", flexDirection: "column" } },
    React.createElement("div", { style: { padding: "8px 20px 0", display: "flex", justifyContent: "space-between", fontFamily: T.mono, fontWeight: 600, fontSize: 12, color: T.muted } },
      React.createElement("span", null, "9:41"),
      React.createElement("span", { style: { letterSpacing: 2 } }, "...")
    ),
    React.createElement("div", { ref: ref, style: { flex: 1, padding: "12px 20px 100px", overflowY: "auto", opacity: fade ? 1 : 0, transition: "opacity 0.15s ease" } }, renderScreen()),
    showNav && React.createElement("div", { style: { position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.card, borderTop: "1px solid " + T.border, display: "flex", justifyContent: "space-around", padding: "8px 0 22px", zIndex: 100 } },
      tabs.map(function (t) {
        return React.createElement("button", { key: t.id, onClick: function () { navTab(t.id); }, style: { background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "4px 12px", color: tab === t.id ? T.dark : T.muted, transition: "color 0.15s" } },
          React.createElement("span", { style: { fontFamily: T.body, fontWeight: tab === t.id ? 600 : 400, fontSize: 10, letterSpacing: 0.3 } }, t.label)
        );
      })
    )
  );
}
