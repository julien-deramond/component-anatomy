const t={title:"Components/Slider",render:()=>{const a=document.createElement("div");return a.className="sb-slider",a.innerHTML=`
      <div class="sb-slider-track" data-part="track">
        <div class="sb-slider-fill" data-part="fill"></div>
        <div class="sb-slider-thumb" data-part="thumb"></div>
      </div>
    `,a}},e={parameters:{anatomy:{parts:[{id:"track",name:"Track",description:"The rail the thumb travels along."},{id:"fill",name:"Fill",description:"Visualizes the selected portion of the range."},{id:"thumb",name:"Thumb",description:"The draggable handle. Focusable and arrow-key operable."}],theme:{accent:"#0d9488"}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    anatomy: {
      parts: [{
        id: 'track',
        name: 'Track',
        description: 'The rail the thumb travels along.'
      }, {
        id: 'fill',
        name: 'Fill',
        description: 'Visualizes the selected portion of the range.'
      }, {
        id: 'thumb',
        name: 'Thumb',
        description: 'The draggable handle. Focusable and arrow-key operable.'
      }],
      theme: {
        accent: '#0d9488'
      }
    } satisfies AnatomyParameters
  }
}`,...e.parameters?.docs?.source}}};const r=["Anatomy"];export{e as Anatomy,r as __namedExportsOrder,t as default};
