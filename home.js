const campaign=document.querySelector('.campaign-hero');
if(campaign){
 const messages=[
  {theme:'welcome',kicker:'TU PUNTO DE PARTIDA',title:'Reconocemos tus',highlight:'capacidades.',description:'Cada estudiante tiene una forma de aprender y un camino por construir. Conozca el Centro Educativo Graymar.',label:'Conozca Graymar',target:'#institucion',image:'estudiantes-960.webp?v=graymar-uniforme-1',sources:['estudiantes-480.webp?v=graymar-uniforme-1 480w','estudiantes-960.webp?v=graymar-uniforme-1 960w'],width:960,height:1440,alt:'Dos estudiantes con uniforme blanco y escudo de Graymar, libros y mochilas.',caption:'Imagen ilustrativa'},
  {theme:'support',kicker:'EDUCACIÓN QUE ACOMPAÑA',title:'Cada aprendizaje',highlight:'merece apoyo.',description:'Escuchar, orientar y acompañar forman parte del camino. Conozca nuestra propuesta de acompañamiento educativo.',label:'Explore el acompañamiento',target:'#oferta',image:'experiencia-docentes-1280.webp?v=graymar-uniforme-1',sources:['experiencia-docentes-640.webp?v=graymar-uniforme-1 640w','experiencia-docentes-1280.webp?v=graymar-uniforme-1 1280w'],width:1280,height:960,alt:'Una docente acompaña a dos estudiantes con uniforme blanco y escudo de Graymar en sus cuadernos.',caption:'Imagen ilustrativa'},
  {theme:'opportunities',kicker:'TU SIGUIENTE PASO',title:'Construyamos',highlight:'oportunidades.',description:'Conversemos sobre el próximo paso de su familia. Estamos en Barrio Escalante, San José: 2233-2789.',label:'Consulte por admisiones',target:'tel:+50622332789',image:'graymar-oportunidades-940.webp',sources:['graymar-oportunidades-640.webp 640w','graymar-oportunidades-940.webp 940w'],width:940,height:788,alt:'Publicación de Graymar con dos manos que se acercan y el mensaje Te impulsamos a construir oportunidades.',caption:'Publicación de Graymar'}
 ];
 const interval=8000;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)');
 const image=campaign.querySelector('.campaign-photo img');
 const assetBase=new URL('.',image.src);
 const assetURL=name=>new URL(name,assetBase).href;
 const sourceSet=item=>item.sources.map(source=>{const [name,width]=source.split(' ');return assetURL(name)+' '+width;}).join(', ');
 const controls=campaign.querySelector('.campaign-controls');
 const buttons=[...controls.querySelectorAll('[data-campaign]')];
 const rotation=controls.querySelector('#campaign-rotation');
 const count=controls.querySelector('#campaign-count');
 const deck=document.createElement('section');
 deck.className='campaign-deck';deck.setAttribute('role','region');
 deck.setAttribute('aria-roledescription','carrusel');deck.setAttribute('aria-label','Presentaciones de Graymar');
 const stage=document.createElement('div');stage.className='campaign-stage';
 const navigation=document.createElement('div');navigation.className='campaign-navigation container';
 const status=document.createElement('p');status.className='campaign-status';
 status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
 campaign.before(deck);deck.append(stage,navigation,status);navigation.append(controls);stage.append(campaign);
 // Cada escena conserva su propio fondo y distribución durante el fundido.
 const panels=messages.map((item,index)=>{
  const panel=index===0?campaign:campaign.cloneNode(true);
  if(index>0){panel.removeAttribute('id');panel.querySelectorAll('[id]').forEach(element=>element.removeAttribute('id'));stage.append(panel);}
  panel.classList.add('campaign-scene');panel.dataset.campaignTheme=item.theme;
  panel.setAttribute('role','group');panel.setAttribute('aria-roledescription','diapositiva');
  panel.setAttribute('aria-label',`${index+1} de ${messages.length}: ${item.title} ${item.highlight}`);
  panel.querySelectorAll('[aria-live]').forEach(element=>element.removeAttribute('aria-live'));
  panel.querySelector('.campaign-kicker').textContent=item.kicker;
  panel.querySelector('h1 span').textContent=item.title;panel.querySelector('h1 strong').textContent=item.highlight;
  panel.querySelector('.campaign-description').textContent=item.description;
  const photo=panel.querySelector('.campaign-photo img');
  photo.srcset=sourceSet(item);photo.src=assetURL(item.image);photo.width=item.width;photo.height=item.height;photo.alt=item.alt;
  photo.sizes='(max-width: 650px) calc(100vw - 40px), 50vw';
  panel.querySelector('.campaign-photo figcaption').textContent=item.caption;
  const link=panel.querySelector('.campaign-button');link.replaceChildren(document.createTextNode(item.label+' '));
  const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(arrow);link.href=item.target;
  panel.inert=index!==0;panel.setAttribute('aria-hidden',String(index!==0));panel.classList.toggle('is-active',index===0);
  return panel;
 });
 const ready=panels.map(panel=>{
  const photo=panel.querySelector('img');
  return typeof photo.decode==='function'?photo.decode().catch(()=>{}):Promise.resolve();
 });
 let current=0,timer=null,busy=false,pending=null,userPaused=motion.matches;
 let hovered=false,focused=false,visible=!('IntersectionObserver' in window),resizeFrame=0;
 let transitionAnimations=[];
 const zooms=new Map();
 const running=()=>!userPaused&&!hovered&&!focused&&visible&&!document.hidden;
 function syncPlayback(){
  rotation.setAttribute('aria-pressed',String(userPaused));
  const label=userPaused?'Reanudar presentación automática':'Pausar presentación automática';
  rotation.setAttribute('aria-label',label);rotation.title=label;
  rotation.firstElementChild.textContent=userPaused?'▶':'Ⅱ';
  deck.dataset.rotating=String(running());
  for(const animation of zooms.values()){
   if(running())animation.play();else animation.pause();
  }
 }
 function schedule(){
  clearTimeout(timer);timer=null;syncPlayback();
  if(!busy&&running())timer=setTimeout(()=>show(current+1,false),interval);
 }
 function zoom(panel,index){
  if(motion.matches||typeof image.animate!=='function')return;
  const photo=panel.querySelector('.campaign-photo img');
  const animation=photo.animate([{transform:'scale(1)'},{transform:index===2?'scale(1.018)':'scale(1.025)'}],{duration:interval+1100,easing:'linear',fill:'both'});
  zooms.set(panel,animation);syncPlayback();
 }
 function measure(){
  // Se reserva el alto de la escena más grande para evitar saltos de página.
  deck.style.removeProperty('--campaign-copy-height');stage.style.height='auto';
  const copyHeight=Math.max(...panels.map(panel=>panel.querySelector('.campaign-copy').offsetHeight));
  deck.style.setProperty('--campaign-copy-height',`${copyHeight}px`);
  stage.style.height=`${Math.ceil(Math.max(...panels.map(panel=>panel.offsetHeight)))}px`;
 }
 function requestMeasure(){cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measure);}
 async function show(index,manual=true){
  const next=(index+panels.length)%panels.length;
  if(busy){pending={index:next,manual};return;}
  if(next===current){schedule();return;}
  busy=true;clearTimeout(timer);timer=null;
  const previous=panels[current],panel=panels[next];current=next;
  await ready[next];
  previous.inert=true;previous.setAttribute('aria-hidden','true');
  previous.classList.remove('is-active');previous.classList.add('is-leaving');
  panel.inert=false;panel.setAttribute('aria-hidden','false');panel.classList.add('is-active');
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===current)));
  count.textContent=String(current+1).padStart(2,'0')+' / '+String(messages.length).padStart(2,'0');
  if(manual)status.textContent=panel.getAttribute('aria-label');
  try{
   if(!motion.matches&&!document.hidden&&typeof panel.animate==='function'){
    const easing='cubic-bezier(.22,.61,.36,1)';
    transitionAnimations=[
     previous.querySelector('.campaign-copy').animate([{opacity:1},{opacity:0}],{duration:300,easing:'ease-out',fill:'both'}),
     panel.animate([{opacity:0},{opacity:1}],{duration:900,easing:'ease-in-out',fill:'both'}),
     ...[...panel.querySelectorAll('.campaign-kicker,h1,.campaign-description,.campaign-button')].map((element,i)=>element.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:100+i*60,easing,fill:'both'}))
    ];
    zoom(panel,current);
    await Promise.allSettled(transitionAnimations.map(animation=>animation.finished));
   }
  }finally{
   previous.classList.remove('is-leaving');
   transitionAnimations.forEach(animation=>animation.cancel());transitionAnimations=[];
   zooms.get(previous)?.cancel();zooms.delete(previous);busy=false;
   const queued=pending;pending=null;
   if(queued&&queued.index!==current)show(queued.index,queued.manual);else schedule();
  }
 }
 rotation.hidden=false;
 rotation.addEventListener('click',()=>{userPaused=!userPaused;if(!userPaused){hovered=false;focused=false;}schedule();});
 buttons.forEach((button,index)=>button.addEventListener('click',()=>show(index)));
 document.getElementById('campaign-previous').addEventListener('click',()=>show(current-1));
 document.getElementById('campaign-next').addEventListener('click',()=>show(current+1));
 controls.addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(current+(event.key==='ArrowRight'?1:-1));}
 });
 deck.addEventListener('mouseenter',()=>{if(finePointer.matches){hovered=true;schedule();}});
 deck.addEventListener('mouseleave',()=>{hovered=false;schedule();});
 deck.addEventListener('focusin',()=>{focused=true;schedule();});
 deck.addEventListener('focusout',event=>{if(!deck.contains(event.relatedTarget)){focused=false;schedule();}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)transitionAnimations.forEach(animation=>animation.cancel());schedule();});
 motion.addEventListener('change',()=>{
  if(motion.matches){userPaused=true;transitionAnimations.forEach(animation=>animation.cancel());zooms.forEach(animation=>animation.cancel());zooms.clear();}
  schedule();
 });
 window.addEventListener('resize',requestMeasure);
 if('ResizeObserver' in window){let width=0;new ResizeObserver(entries=>{const next=entries[0].contentRect.width;if(Math.abs(next-width)>1){width=next;requestMeasure();}}).observe(deck);}
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.15}).observe(deck);
 Promise.allSettled(ready).then(requestMeasure);
 document.fonts?.ready.then(requestMeasure);
 measure();zoom(panels[0],0);schedule();
}
