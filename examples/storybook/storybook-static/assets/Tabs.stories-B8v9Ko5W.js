const n={title:"Components/Tabs",render:()=>{const e=document.createElement("div");return e.className="sb-tabs",e.innerHTML=`
      <div class="sb-tabs-list" data-part="tablist">
        <button class="sb-tab is-active" data-part="tab">Overview</button>
        <button class="sb-tab" data-part="tab">Specs</button>
        <button class="sb-tab" data-part="tab">Reviews</button>
        <div class="sb-tabs-indicator" data-part="indicator"></div>
      </div>
      <div class="sb-tabs-panel" data-part="tabpanel">The overview content lives here.</div>
    `,e}},t={parameters:{anatomy:{}}},a={parameters:{anatomy:{preset:"contrast",parts:[{id:"tablist",name:"Tab list",description:"Container for the tab buttons."},{id:"tab",name:"Tab",description:"One selector per panel — all three highlight together."},{id:"indicator",name:"Indicator",description:"Underline marking the active tab."},{id:"tabpanel",name:"Tab panel",description:"Content region controlled by the active tab."}]}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  parameters: {
    anatomy: {} satisfies AnatomyParameters
  }
}`,...t.parameters?.docs?.source},description:{story:"Parts are auto-discovered from `data-part` attributes — no explicit\npart list needed. Names are derived from the ids.",...t.parameters?.docs?.description}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  parameters: {
    anatomy: {
      preset: 'contrast',
      parts: [{
        id: 'tablist',
        name: 'Tab list',
        description: 'Container for the tab buttons.'
      }, {
        id: 'tab',
        name: 'Tab',
        description: 'One selector per panel — all three highlight together.'
      }, {
        id: 'indicator',
        name: 'Indicator',
        description: 'Underline marking the active tab.'
      }, {
        id: 'tabpanel',
        name: 'Tab panel',
        description: 'Content region controlled by the active tab.'
      }]
    } satisfies AnatomyParameters
  }
}`,...a.parameters?.docs?.source}}};const r=["AutoDiscovered","HighContrast"];export{t as AutoDiscovered,a as HighContrast,r as __namedExportsOrder,n as default};
