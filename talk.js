
function style(){
  var temp =`
.talk{
  position:fixed;
  top:2rem;right:2rem;
  background:white;
  color:black;
}

.talk{
  display:flex;
  flex-wrap:wrap;
  gap:0.5rem;
  width:360px;
  max-width:360px;
  box-shadow:1px 1px 30px rgba(0,0,0,0.1);
  padding:1rem;
  border-radius:0.2rem;
  box-sizing:border-box;
}
.talk input,.talk label{
  width:100%;
}
.talk input{
  padding:4px 8px;
}
.talk button{
  cursor:pointer;
  padding:6px 8px;
  width:6rem;
  background:#26f;
  color:white;
  border:unset;
  margin-top:0.25rem;
}
.talk button.cancel{
  background:#aaa;
}  
  `
  var el =document.createElement('style')
  el.innerHTML = temp;
  return el;
}

function save(key,ary){
  if(!key) return;
  if(!ary) return;
  var data = JSON.stringify(ary)
  localStorage.setItem(key,data)  
}
function load(key){
  if(!key) return;
  var data = localStorage.getItem(key)
  var ary = null
  if(data){
    ary = JSON.parse(data)
  }
  return ary;
}


//////////////////////

function talk(text,key){return new Promise(sol=>{
  var data = load(key)||[]
  var count = 0
  var html=text.trim().split('\n').map(line=>{
    if(/\[.*\]/.test(line)){
      const pla = line.slice(1,-1)
      const value = data[count]||''
      count++;
      return `<input type="text" value="${value}" placeholder="${pla}">`
    }else{
      return `<label>${line}</label>`
    }
  }).join('\n')

  //console.log(html)

  var el = document.createElement('div')
  el.classList.add('talk')
  el.innerHTML= html;
  var ok = document.createElement('button')
  ok.textContent = 'OK'
  el.append(ok)
  var cancel = document.createElement('button')
  cancel.textContent = 'CANCEL'
  cancel.classList.add('cancel')
  el.append(cancel)

  ok.onclick =()=>{
    var ary = Array.from(el.querySelectorAll('input')).map(d=>d.value)
    save(key,ary)
    el.remove();
    return sol(ary)
  }
  cancel.onclick =()=>{
    el.remove();
    return sol(null);
  }

  el.append(style())

  document.body.append(el)
})}

function _talk(key){
  return load(key)
}

window.talk = talk;
window._talk = _talk;//keyのデータを取得する場合

////////////////////////////
/*

talk(`
＃ テンプレート
template.htmlの場所：url
[]
データ２：
[]
`,'xyz').then(d=>{

  console.log(d)
})
*/
/*
const key = 'policyok';
if(!_talk(key)){
talk(`
# このサイトがユーザ情報を取得するために許可求めています。
詳しく知りたい場合は<a href="#">個人情報保護方針</a>を御覧ください。
`,key)
}
*/
