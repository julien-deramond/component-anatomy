var $=class{constructor(t){this.observer=null,this.root=t}query(){const t=new Map;return this.root.querySelectorAll("[data-part]").forEach(r=>{const a=r.dataset.part;if(!a)return;const s=t.get(a)??[];s.push(r),t.set(a,s)}),t}partIds(){const t=new Set,o=[];return this.root.querySelectorAll("[data-part]").forEach(r=>{const a=r.dataset.part;a&&!t.has(a)&&(t.add(a),o.push(a))}),o}observe(t){return this.observer=new MutationObserver(o=>{o.some(a=>Array.from(a.addedNodes).concat(Array.from(a.removedNodes)).some(s=>s instanceof HTMLElement&&(s.hasAttribute("data-part")||s.querySelector("[data-part]")!==null)))&&t()}),this.observer.observe(this.root,{childList:!0,subtree:!0}),()=>{this.observer?.disconnect(),this.observer=null}}destroy(){this.observer?.disconnect(),this.observer=null}},b="ca-overlay",y="ca-overlay-label",S="ca-overlay-styles";function C(){if(document.getElementById(S))return;const t=document.createElement("style");t.id=S,t.textContent=`
    .${b} {
      position: fixed;
      pointer-events: none;
      box-sizing: border-box;
      border-radius: var(--ca-overlay-radius, 4px);
      background: var(--ca-overlay-bg, rgba(99, 102, 241, 0.18));
      outline: 2px solid var(--ca-overlay-border, rgba(99, 102, 241, 0.75));
      outline-offset: 1px;
      z-index: var(--ca-overlay-z, 9998);
      transition: opacity 150ms ease;
    }
    .${b}.ca-overlay--hidden {
      opacity: 0;
    }

    /* Name label chip — floats above the overlay */
    .${y} {
      position: fixed;
      pointer-events: none;
      z-index: var(--ca-overlay-z, 9999);
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px 2px 5px;
      border-radius: 4px;
      background: var(--ca-label-bg, rgba(79, 70, 229, 1));
      color: var(--ca-label-fg, #fff);
      font-family: ui-monospace, 'Cascadia Code', 'Fira Mono', monospace;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.02em;
      white-space: nowrap;
      line-height: 1.6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.25);
      transition: opacity 150ms ease;
    }
    .${y}.ca-overlay--hidden {
      opacity: 0;
    }
    .${y}::before {
      content: '';
      display: inline-block;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.6);
      flex-shrink: 0;
    }
  `,document.head.appendChild(t)}var F=class{constructor(){this.overlays=[],this.labels=[],this.activeElements=[],this.activePartName="",this.rafId=null,C()}show(t,o=""){this.hide(),this.activeElements=t,this.activePartName=o,t.forEach(()=>{const r=document.createElement("div");r.className=`${b} ca-overlay--hidden`,r.setAttribute("aria-hidden","true"),document.body.appendChild(r),this.overlays.push(r);const a=document.createElement("div");a.className=`${y} ca-overlay--hidden`,a.setAttribute("aria-hidden","true"),a.textContent=o,document.body.appendChild(a),this.labels.push(a)}),requestAnimationFrame(()=>{this._position(),this.overlays.forEach(r=>r.classList.remove("ca-overlay--hidden")),this.labels.forEach(r=>r.classList.remove("ca-overlay--hidden"))})}hide(){this.rafId!==null&&(cancelAnimationFrame(this.rafId),this.rafId=null),this.overlays.forEach(t=>t.remove()),this.labels.forEach(t=>t.remove()),this.overlays=[],this.labels=[],this.activeElements=[],this.activePartName=""}reposition(){this.overlays.length!==0&&(this.rafId!==null&&cancelAnimationFrame(this.rafId),this.rafId=requestAnimationFrame(()=>{this._position(),this.rafId=null}))}destroy(){this.hide()}_position(){this.activeElements.forEach((r,a)=>{const s=this.overlays[a],n=this.labels[a];if(!s)return;const d=r.getBoundingClientRect();if(s.style.top=`${d.top}px`,s.style.left=`${d.left}px`,s.style.width=`${d.width}px`,s.style.height=`${d.height}px`,!n)return;const l=d.top-22-6,h=l<4?d.bottom+6:l;n.style.top=`${h}px`,n.style.left=`${d.left}px`})}};function f(t){return t.replace(/[-_]/g," ").replace(/\b\w/g,o=>o.toUpperCase())}function _(t){const{root:o,panel:r}=t,a=new $(o),s=new F;t.parts??a.partIds().map(e=>({id:e,name:f(e)}));const n=new Map;function d(e,i){n.get(e)?.forEach(u=>u(i))}const l=[];function h(e,i="panel"){const u=a.query().get(e)??[];s.show(u,e),r&&r.querySelectorAll("[data-anatomy-item]").forEach(c=>{c.dataset.anatomyItem===e?(c.setAttribute("data-active",""),i==="preview"&&c.scrollIntoView({behavior:"smooth",block:"nearest"})):c.removeAttribute("data-active")}),d("part:enter",e)}function v(){s.hide(),r&&r.querySelectorAll("[data-anatomy-item]").forEach(e=>{e.removeAttribute("data-active")}),d("part:leave","")}function m(){a.query().forEach((i,u)=>{i.forEach(c=>{const w=()=>h(u,"preview"),A=()=>v();c.addEventListener("mouseenter",w),c.addEventListener("mouseleave",A),l.push(()=>{c.removeEventListener("mouseenter",w),c.removeEventListener("mouseleave",A)})})})}function p(){r&&r.querySelectorAll("[data-anatomy-item]").forEach(e=>{const i=e.dataset.anatomyItem??"",u=()=>h(i,"panel"),c=()=>v();e.addEventListener("mouseenter",u),e.addEventListener("mouseleave",c),e.addEventListener("focus",u),e.addEventListener("blur",c),l.push(()=>{e.removeEventListener("mouseenter",u),e.removeEventListener("mouseleave",c),e.removeEventListener("focus",u),e.removeEventListener("blur",c)})})}const E=()=>s.reposition(),g=()=>s.reposition(),L=new ResizeObserver(()=>s.reposition());function q(){m(),p(),window.addEventListener("scroll",E,{passive:!0,capture:!0}),window.addEventListener("resize",g,{passive:!0}),L.observe(o);const e=a.observe(()=>{x(),t.parts||a.partIds().map(i=>({id:i,name:f(i)})),m(),p()});l.push(e)}function x(){const e=l.pop();l.forEach(i=>i()),l.length=0,e&&l.push(e)}return q(),{highlight:h,unhighlight:v,refresh(){v(),x(),t.parts||a.partIds().map(e=>({id:e,name:f(e)})),m(),p()},destroy(){v(),l.forEach(e=>e()),l.length=0,window.removeEventListener("scroll",E,{capture:!0}),window.removeEventListener("resize",g),L.disconnect(),s.destroy(),a.destroy(),n.clear()},on(e,i){return n.has(e)||n.set(e,new Set),n.get(e).add(i),()=>n.get(e)?.delete(i)}}}function I(){document.querySelectorAll("[data-anatomy-root]").forEach(t=>{if(t.dataset.anatomyInit)return;t.dataset.anatomyInit="1";const o=t.dataset.anatomyRoot,r=t.querySelector(`[data-anatomy-preview="${o}"]`),a=t.querySelector(`[data-anatomy-panel="${o}"]`),s=t.querySelector(`[data-anatomy-pill="${o}"]`),n=s?.querySelector(".ca-active-pill-name");if(!r)return;const d=_({root:r,panel:a??void 0});if(s&&a){const l=new IntersectionObserver(h=>{const v=a.querySelector("[data-anatomy-item][data-active]");if(!v){s.classList.remove("ca-pill--visible");return}const m=h.some(p=>p.target===v&&p.isIntersecting);s.classList.toggle("ca-pill--visible",!m)},{root:a,threshold:.5});d.on("part:enter",h=>{n&&(n.textContent=h);const v=a.querySelector(`[data-anatomy-item="${h}"]`);v?l.observe(v):s.classList.remove("ca-pill--visible")}),d.on("part:leave",()=>{s.classList.remove("ca-pill--visible"),n&&(n.textContent="")})}})}I();document.addEventListener("astro:page-load",I);
