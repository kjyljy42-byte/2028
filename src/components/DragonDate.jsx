import { useId, useState } from "react";
import { wedding } from "../data/wedding.js";
function Dragon({ asleep }) {
  const uid = useId();
  return <svg viewBox="0 0 360 280" aria-hidden="true" className="white-dragon">
    <defs>
      <linearGradient id={`${uid}-ivory`} x2=".9" y2="1"><stop stopColor="#fffef7"/><stop offset=".5" stopColor="#deddd4"/><stop offset="1" stopColor="#909faa"/></linearGradient>
      <linearGradient id={`${uid}-membrane`} x2="1" y2="1"><stop stopColor="#eef1ea"/><stop offset="1" stopColor="#81939b"/></linearGradient>
      <pattern id={`${uid}-scales`} width="12" height="10" patternUnits="userSpaceOnUse"><path d="M0 0Q6 12 12 0" fill="none" stroke="#8a999e" strokeOpacity=".35" strokeWidth=".7"/></pattern>
    </defs>
    <g className="dragon-breath" fill={`url(#${uid}-ivory)`} stroke="#cad1cf" strokeWidth="1.4">
      {asleep ? <>
        <path d="M85 193C73 120 141 107 217 145C279 170 297 221 244 240C195 269 103 253 91 215C112 185 171 194 189 220C150 203 117 219 140 234C212 260 272 226 228 193" />
        <path d="M120 189Q96 131 138 108L233 207Q180 159 136 208Z" fill={`url(#${uid}-membrane)`}/>
        <path d="M130 123L180 198M143 145L211 205" fill="none"/>
        <path d="M106 187Q125 161 160 181L191 203L181 221L123 219Q98 212 106 187Z"/>
        <path d="M115 184L100 158L129 179M141 181L139 156L156 186"/>
        <path d="M128 198Q139 205 150 198" fill="none" stroke="#304c42" strokeWidth="2"/>
      </> : <>
        <g className="dragon-wing wing-left"><path d="M160 184Q78 101 39 31L29 194Q68 151 91 219Q109 169 160 184Z" fill={`url(#${uid}-membrane)`}/><path d="M39 31L66 158M39 31L91 219M39 31L160 184" fill="none" strokeWidth="3"/><path d="M39 31Q33 14 50 18L42 38"/></g>
        <g className="dragon-wing wing-right"><path d="M197 175Q260 92 307 31L332 195Q289 154 270 218Q241 175 197 175Z" fill={`url(#${uid}-membrane)`}/><path d="M307 31L294 162M307 31L270 218M307 31L197 175" fill="none" strokeWidth="3"/><path d="M307 31Q316 13 297 19L304 39"/></g>
        <path className="dragon-tail" d="M206 205C294 225 313 249 270 262C238 273 188 252 244 251C201 245 177 232 180 212Z"/>
        <path d="M146 209Q111 226 103 248L85 258L118 261L142 244L168 219M190 211Q222 231 230 252L247 260L213 261L187 238"/>
        <path d="M146 215C115 167 133 125 153 93L175 59L195 79C164 123 182 138 208 168C234 209 201 242 163 229Z"/>
        <path d="M148 212C121 166 134 125 156 94L173 67L188 80C165 122 181 147 203 173C221 203 201 229 166 226Z" fill={`url(#${uid}-scales)`} stroke="none"/>
        <path d="M165 67L138 51L156 81L133 80L148 103L127 103L140 123L124 129L137 146L123 160L143 174L135 189L155 202"/>
        <g className="dragon-head"><path d="M156 81Q158 43 189 45L210 62L238 78L231 97L202 94L184 104Z"/><path d="M166 55Q142 34 141 17Q161 30 183 48M186 46Q181 28 193 19L202 52"/><path d="M158 77L144 68L151 88L138 83L151 102"/><path d="M194 66L211 69L202 79L194 75Z" fill="#55a66c" stroke="#234936"/><ellipse className="dragon-eye" cx="202" cy="72" rx="2" ry="5" fill="#102f22" stroke="none"/><path d="M218 85L233 86M228 78L231 80" stroke="#70817d" fill="none"/></g>
        <path d="M157 156L123 190L114 225L102 235L125 234L139 200L176 178M194 164L218 193L222 226L234 238L211 235L200 201L178 182"/>
      </>}
    </g>
  </svg>;
}
export default function DragonDate() {
  const [revealed, setRevealed] = useState(false);
  return <div className={`dragon-date ${revealed ? "date-revealed" : ""}`}>
    <div id="guarded-date" className="guarded-date" hidden={!revealed} role="status"><span>День нашего свадебного пира</span><strong>{wedding.dateNumeric}</strong><span>{wedding.dateLabel} · {wedding.timeLabel}</span></div>
    <button type="button" className="dragon-guardian" onClick={() => setRevealed(true)} aria-expanded={revealed} aria-controls="guarded-date" aria-label={revealed ? "Белый дракон отдыхает. Дата открыта" : "Попросить дракона открыть дату свадьбы"}>
      <span className="standing-dragon"><Dragon asleep={false}/></span><span className="sleeping-dragon"><Dragon asleep/></span>
    </button>
    {!revealed && <p className="dragon-hint">Хранитель башни бережёт нашу дату.<br/><span>Коснитесь дракона — он откроет её вам.</span></p>}
  </div>;
}
