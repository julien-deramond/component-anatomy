const r={title:"Components/Button",render:()=>{const t=document.createElement("button");return t.className="sb-btn",t.innerHTML=`
      <span data-part="icon">★</span>
      <span data-part="label">Favorite</span>
      <span class="sb-btn-badge" data-part="badge">12</span>
    `,t}},n={parts:[{id:"icon",name:"Icon",description:"Optional leading glyph reinforcing the action."},{id:"label",name:"Label",description:"The visible action text. Keep it a verb."},{id:"badge",name:"Badge",description:"Numeric counter for associated items."}]},e={parameters:{anatomy:n}},a={parameters:{anatomy:{...n,preset:"blueprint",overlayPadding:2}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    anatomy
  }
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    anatomy: {
      ...anatomy,
      preset: 'blueprint',
      overlayPadding: 2
    } satisfies AnatomyParameters
  }
}`,...a.parameters?.docs?.source}}};const s=["Anatomy","CustomTheme"];export{e as Anatomy,a as CustomTheme,s as __namedExportsOrder,r as default};
