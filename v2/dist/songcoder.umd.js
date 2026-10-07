(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.SongCoder={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t={keys:[`C`,`C#`,`Db`,`D`,`D#`,`Eb`,`E`,`F`,`F#`,`Gb`,`G`,`G#`,`Ab`,`A`,`A#`,`Bb`,`B`],flatKeys:[`C`,`Db`,`D`,`Eb`,`E`,`F`,`Gb`,`G`,`Ab`,`A`,`Bb`,`B`],sharpKeys:[`C`,`C#`,`D`,`D#`,`E`,`F`,`F#`,`G`,`G#`,`A`,`A#`,`B`],noteNames:[`C`,`D`,`E`,`F`,`G`,`A`,`B`],keysWithFlats:[`C`,`F`,`Bb`,`Eb`,`Ab`,`Db`,`Gb`],symbolsLookup:[`[[:`,`[[`,`[[_`,`:]]`,`|`],notesDurationLookup:[`1`,`2`,`4`,`8`,`16`,`1.`,`2.`,`4.`,`8.`,`16.`,`1_`,`2_`,`4_`,`8_`,`16_`,`1._`,`2._`,`4._`,`8._`,`16._`,`8_3`,`4_3`],useFlats:!1,steps:0,transposeNote:function(e){let n=t.sharpKeys.indexOf(e);n===-1&&(n=t.flatKeys.indexOf(e));let r=n+t.steps;return r<0?r=t.sharpKeys.length+r:r>=t.sharpKeys.length&&(r-=t.sharpKeys.length),t.useFlats?t.flatKeys[r]:t.sharpKeys[r]},transposeChord:function(e){let n=e.substr(0,1);if(t.noteNames.indexOf(n)===-1)throw Error(`Error: Invalid note name --> `+n);let r=e.substr(1),i=e.substr(1,1);if(i===`#`?(n+=`#`,r=e.substr(2)):i===`b`&&(n+=`b`,r=e.substr(2)),n=t.transposeNote(n),e=n+r,e.indexOf(`/`)>-1){let n=e.substr(e.indexOf(`/`)+1);e=t.keys.indexOf(n)===-1?e.substr(0,e.indexOf(`/`))+`/`+n:e.substr(0,e.indexOf(`/`))+`/`+t.transposeNote(n)}return e},getItemType:function(e){let n=e.substr(0,1),r=e.substr(e.length-1,1),i=e.substr(0,3);if(n===`[`&&r===`]`)return{type:`section`,value:e.substr(1,e.length-2).replaceAll(`_`,` `)};if(t.symbolsLookup.indexOf(i)!==-1){if(i===`:]]`){let t=e.length>3?e.substr(3):null;return{type:`repeat`,value:i,times:parseInt(t)===2?null:t}}return{type:`symbol`,value:e}}if(n===`"`)return{type:`label`,value:e.substr(1).replaceAll(`_`,` `)};if(n===`'`)return{type:`comment`,value:e.substr(1).replaceAll(`_`,` `)};if(e.substr(0,2)===`[[`){let n=e.substr(2);t.useFlats=t.keysWithFlats.indexOf(n)>-1}else if(n===`(`){e=e.replaceAll(`(`,``).replaceAll(`)`,``);let n=e.split(`,`),r=[];return n.forEach(function(e){t.steps!==0||t.useFlats?r.push(t.transposeNote(e)):r.push(e)}),{type:`chord`,value:`(`+r.join(`,`)+`)`}}else{let n=e,r=null,i=`chord`;if(n.indexOf(`:`)!==-1){let a=e.split(`:`);n=a[0],r=a[1],r=r.split(`,`).map(function(e){if(t.notesDurationLookup.indexOf(e)===-1)throw Error(`Error: Invalid note duration --> `+e);return e}),n===`r`&&(i=`rest`)}return{type:i,value:(function(){return n===`x`||n===`r`?null:n===`%`?n:t.transposeChord(n)})(),timing:r}}return{type:null,value:null}},parse:function(e,n,r){if(t.steps=0,t.useFlats=!1,(n===void 0||n===``||!n)&&(n=`C`,t.useFlats=!0),t.keys.indexOf(n)===-1)throw Error(`Error: Invalid value for key --> `+n);let i=t.sharpKeys.indexOf(n);if(i===-1&&(i=t.flatKeys.indexOf(n)),r!==void 0&&r!==``&&r){if(t.keys.indexOf(r)===-1)throw Error(`Error: Invalid value for new key --> `+n);let e=t.sharpKeys.indexOf(r);e===-1&&(e=t.flatKeys.indexOf(r)),t.steps=e-i,t.useFlats=t.keysWithFlats.indexOf(r)>-1,(t.steps!==0||t.useFlats)&&(n=t.transposeNote(n))}let a=e.trim().split(` `),o=[];return a.forEach(function(e){if(e!==``){if((e.match(/\s*[\r\n]+\s*/g)||[]).length){let n=e.trim().split(/\s*[\r\n]+\s*/g);n.forEach(function(e,r){o.push(t.getItemType(e)),r<n.length-1&&o.push({type:`break`})})}else o.push(t.getItemType(e))}}),o}},n={dot:`<span class="dot">.</span>`,format:function(e){for(let t=0;t<e.length;t++)if(e[t].type===`symbol`||e[t].type===`repeat`){if(!n.symbolsLookup.hasOwnProperty(e[t].value))continue;e[t].value=n.symbolsLookup[e[t].value]}else if(e[t].type===`chord`){if(!e[t].timing)continue;let r=e[t].timing.join(`,`);if(n.beamsLookup.hasOwnProperty(r))e[t].timing=n.beamsLookup[r];else{let r=[];e[t].timing.forEach(function(e){n.notesDurationLookup.hasOwnProperty(e)&&r.push(n.notesDurationLookup[e])}),e[t].timing=r.join(``)}}else if(e[t].type===`rest`){if(!e[t].timing)continue;let r=[];e[t].timing.forEach(function(e){n.restsDurationLookup.hasOwnProperty(e)&&r.push(n.restsDurationLookup[e])}),e[t].timing=r.join(``)}return e}};n.symbolsLookup={"[[:":`{`,"[[":`"`,"[[_":`V`,":]]":`}`,"|":`\\`},n.notesDurationLookup={1:`w`,2:`h`,4:`q`,8:`e`,16:`s`,"1.":`R`,"2.":`d`,"4.":`j`,"8.":`i`,"16.":`s`+n.dot,"1_":`wU`,"2_":`hU`,"4_":`qU`,"8_":`eU`,"16_":`sU`,"1._":`RU`,"2._":`dU`,"4._":`jU`,"8._":`iU`,"16._":`s`+n.dot+`U`},n.restsDurationLookup={1:`W`,2:`H`,4:`Q`,8:`E`,16:`S`,"1.":`W`+n.dot,"2.":`D`,"4.":`J`,"8.":`I`,"16.":`S`+n.dot,"1_":`WU`,"2_":`HU`,"4_":`QU`,"8_":`EU`,"16_":`SU`,"1._":`W`+n.dot+`U`,"2._":`DU`,"4._":`JU`,"8._":`IU`,"16._":`S`+n.dot+`U`},n.beamsLookup={"16,16,8":`M`,"16,16":`N`,"16,8.":`O`,"8_3":`T`,"8,8,8,8":`Y`,"8,16,16":`m`,"8,8":`n`,"8.,16":`o`,"4_3":`t`,"16,16,16,16":`y`,"8,8,8":`§`,"16,16,16":`³`,"16,8,16":`¾`};var r={escapeHTML(e){return String(e).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#39;`)},render(e){return`
        <div class="songcoder">
            ${e.map(e=>e.type?e.type===`break`?`<div></div>`:`
                <div class="songcoder__item ${e.type===`section`?`songcoder__item--section`:``}">
                    ${e.type===`section`?`<div class="songcoder__section">${this.escapeHTML(e.value)}</div>`:``}

                    <div class="songcoder__item-container">
                        ${e.type===`chord`?`
                        <div class="songcoder__item-content chord">
                            <div class="chord-value">${e.value?e.value:`&nbsp;`}</div>

                            ${e.timing?`
                            <div class="timing">${e.timing}</div>
                            `:``}
                        </div>
                        `:``}

                        ${e.type===`symbol`||e.type===`repeat`?`
                            <span class="songcoder__item-content symbol">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.type===`comment`?`
                            <span class="songcoder__item-content comment">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.type===`label`?`
                            <span class="songcoder__item-content label">${this.escapeHTML(e.value)}</span>
                            `:``}

                        ${e.times?`
                            <span class="songcoder__item-content repeat">x${this.escapeHTML(e.times)}</span>
                            `:``}

                        ${e.type===`rest`?`
                            <span class="songcoder__item-content chord">
							    <div class="timing timing--rest">${e.timing}</div>
						    </span>
                            `:``}
                    </div>
                </div>`:``).join(``)}
        </div>
    `}},i=(e,i,a)=>{let o=t.parse(e,i,a),s=n.format(o);return r.render(s)},a=t.keys;e.generateChordSheet=i,e.keys=a});