(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const key='adilzhan-gulzat-2027-v1';
let data={rsvp:null,wishes:[]};
try{Object.assign(data,JSON.parse(localStorage.getItem(key)||'{}'))}catch{}
function save(){try{localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
let lastFocus=null, activeModal=null;
function closeModal(){if(!activeModal)return;activeModal.classList.remove('show');activeModal.setAttribute('aria-hidden','true');activeModal.removeAttribute('aria-modal');activeModal=null;document.body.classList.remove('modal-open');$('.local-backdrop')?.remove();lastFocus?.focus()}
function openModal(id){closeModal();lastFocus=document.activeElement;activeModal=$(id);activeModal.classList.add('show');activeModal.setAttribute('aria-hidden','false');activeModal.setAttribute('aria-modal','true');document.body.classList.add('modal-open');const backdrop=document.createElement('div');backdrop.className='local-backdrop';backdrop.onclick=closeModal;document.body.append(backdrop);setTimeout(()=>activeModal?.querySelector('input,button')?.focus(),50)}
$$('.w8-close').forEach(b=>b.addEventListener('click',closeModal));
$$('.w8-modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m)closeModal()}));
document.addEventListener('keydown',e=>{if(!activeModal)return;if(e.key==='Escape')closeModal();if(e.key==='Tab'){let nodes=[...activeModal.querySelectorAll('button,input,textarea,a[href]')].filter(n=>n.offsetParent);let first=nodes[0],last=nodes.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
function renderRSVP(){const r=data.rsvp;$('.opros').style.display=r?'none':'';$('.otvetnaopros').style.display=r?'block':'none';if(r){$('.otvetname').textContent=r.name;$('.otvetzhauap').textContent=r.answer;$('#w8-rsvp-name').value=r.name;const radio=$(`input[name="zhauap"][value="${r.value}"]`);if(radio)radio.checked=true}}
$('#form-1 .zayotrp').addEventListener('click',()=>{const input=$('#w8-rsvp-name'), name=input.value.trim(), error=$('.w8-name-entry .namekate2');if(!name){error.textContent='Аты-жөніңізді жазыңыз.';input.setAttribute('aria-invalid','true');input.focus();return}input.removeAttribute('aria-invalid');error.textContent='';const radio=$('input[name="zhauap"]:checked');data.rsvp={name,value:radio.value,answer:radio.nextElementSibling.textContent};if(!save()){error.textContent='Браузер деректерді сақтауға рұқсат бермеді.';data.rsvp=null;return}renderRSVP();openModal('#sattizhauap')});
$('.oprosozgertu').addEventListener('click',()=>{data.rsvp=null;save();renderRSVP();$('#w8-rsvp-name').focus()});
$('#w8-rsvp-name').addEventListener('keydown',e=>{if(e.key==='Enter')$('#form-1 .zayotrp').click()});
function renderWishes(){const list=$('#saved-wishes');list.replaceChildren();$('.wishes-empty').hidden=data.wishes.length>0;for(const wish of data.wishes){const article=document.createElement('article');article.className='w8-wish';const p=document.createElement('p'),cite=document.createElement('cite');p.textContent=wish.text;cite.textContent=wish.name;article.append(p,cite);list.append(article)}}
$$('.tilek_kaldir,[data-wishes-compose]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();$('#w8-wish-name').value=data.rsvp?.name||'';openModal('#tilekengiz')}));
$('#tilekengiz .zayotrp2').addEventListener('click',()=>{const name=$('#w8-wish-name').value.trim(),text=$('#w8-wish-text').value.trim();$('#tilekengiz .namekate').textContent=name?'':'Есіміңізді жазыңыз.';$('#tilekengiz .tilekkate').textContent=text?'':'Ізгі тілегіңізді жазыңыз.';if(!name){$('#w8-wish-name').focus();return}if(!text){$('#w8-wish-text').focus();return}data.wishes.unshift({name,text});if(!save()){data.wishes.shift();$('#tilekengiz .tilekkate').textContent='Браузер деректерді сақтауға рұқсат бермеді.';return}renderWishes();$('#w8-wish-text').value='';openModal('#sattitilek')});
$$('a[href="#all-wishes"]').forEach(a=>a.addEventListener('click',()=>closeModal()));
window.audio=new Audio('1701928841.mp3');audio.loop=true;audio.preload='none';
const on=$('.sound-on'),off=$('.sound-off');
function audioState(){on.style.display=audio.paused?'block':'none';off.style.display=audio.paused?'none':'block';$('.w8-music-shortcut').setAttribute('aria-pressed',String(!audio.paused))}
on.addEventListener('click',async()=>{try{await audio.play();audioState()}catch{on.textContent='Әуен ашылмады · қайта көру'}});off.addEventListener('click',()=>{audio.pause();audioState()});audio.addEventListener('pause',audioState);audio.addEventListener('play',audioState);
renderRSVP();renderWishes();audioState();
})();
