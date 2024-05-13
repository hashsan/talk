/*
        <select id="cars" name="cars">
            <option value="volvo">Volvo</option>
            <option value="saab">Saab</option>
            <option value="fiat">Fiat</option>
            <option value="audi">Audi</option>
        </select>
*/

const re_select =/^\[([^\/].+)\]/

function makeSelect(data,value){
  
  const ary = data.slice(1,-1).split('|')
  const flg = ary.includes(value)
  const options = ary.map((d,i)=>{
    let selected = d===value? 'selected':'';
    selected = (!flg && i===0)? 'selected':selected;
    return `  <option value="${d}" ${selected}>${d}</option>`    
  }).join('\n')
  
  const html =`
<select name="myselect">
${options}
</select>
`
  return html  
}

/*
const se = "[optionA|optionB|optionC]"
console.log("select",re_select.test(se))

debug(makeSelect(se,null))
*/
////////////////////////
const re_checkbox = /^\[\/\]/
function makeCheckbox(data,value){
  const checked = value=='on'?'checked':''
  const html =`<input type="checkbox" ${checked}>`
  return html
}

/*
const ch = "[/]"
console.log('checkbox',re_checkbox.test(ch))

debug(makeCheckbox('','on'))
*/
/////////////////////////
const re_input = /^\[\]/

function makeInput(data,value){
  const _value = value==null?'':value
  const html =`<input type="text" value="${_value}">`
  return html;
}
/*
const va ="[]"
console.log('input',re_input.test(va))

debug(makeInput('','on'))
*/


function debug(html){
  var el = document.createElement('div')
  el.innerHTML = html
  document.body.append(el)
}

function parser(text){
 return text.trim().split('\n')
   .map(line=>{
    if(re_select.test(line)){
      return makeSelect(line)
    }else if(re_input.test(line)){
      return makeInput(line)
    }else if(re_checkbox.test(line)){
      return makeCheckbox(line)
    }        
    return `<p>${line}</p>`
  }).join('\n')  
}

function captureInputs(parentElement) {
    return Array.from(parentElement.children)
        .filter(function(element) {
            return /input|select/i.test(element.tagName);
        })
        .map(function(element) {
            return element.value;
        });
}
function makeStyle(){
  var css=`.moca{
  position:fixed;
  right:1rem;top:1rem;
  max-width:360px;
  display:flex;
  flex-wrap:wrap;
  gap:1rem;
  
  box-shadow:1px 1px 30px rgba(0,0,0,0.1);
  padding:1rem;
  box-sizing:border-box;
  border-radius:0.25rem;  
}
.ok,.cancel{
  width:6rem;
}
.moca input,select{
  padding:4px;
}
.moca p,input[type="text"],select{
  width:100%;
  margin:0;
}
`
  var el = document.createElement('style')
  el.textContent = css;
  return el;
}


function moca(text,key){return new Promise(sol=>{
  var el = document.createElement('div')
  el.classList.add('moca')
  el.innerHTML = parser(text)
  
  var ok = document.createElement('button')
  ok.classList.add('ok')
  ok.textContent = 'OK'
  
  var cancel = document.createElement('button')
  cancel.textContent ='cancel'
  cancel.classList.add('cancel')
  el.append(ok)
  el.append(cancel)
  el.append(makeStyle()) //
  document.body.append(el)
  //
  ok.onclick =()=>{
    var ary = captureInputs(el)
    el.remove()
    return sol(ary)
  }
  cancel.onclick=()=>{
    el.remove()
    return sol(null)
  }
})}

window.moca = moca;

/*
var test=`
# タイトル
データインプット:
[]
データチェックボックス：
[/]
データオプション：
[optionA|optionB|optionC]
`
moca(test).then(d=>{
  
  console.log(d)
})
//debug(html)
*/
