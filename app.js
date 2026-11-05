const $ = selector => document.querySelector(selector);
const node = (tag, text, cls) => {const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el;};
const date = value => new Intl.DateTimeFormat('es-CR',{day:'numeric',month:'short',year:'numeric',timeZone:'America/Costa_Rica'}).format(new Date(value));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
$('.menu-toggle')?.addEventListener('click',event=>{const button=event.currentTarget;const expanded=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(expanded));$('#nav').classList.toggle('open',expanded);});
document.querySelectorAll('#nav a').forEach(link=>link.addEventListener('click',()=>{$('#nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape' && $('#nav')?.classList.contains('open')){$('#nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle').focus();}});
function card(post){
 const article=node('article',null,'news-card'),meta=node('div',null,'meta');
 meta.append(node('span',post.category),node('time',date(post.published_at)));meta.lastChild.dateTime=post.published_at;
 if(post.cover){const image=node('img',null,'news-cover');image.src=post.cover.url;image.srcset=post.cover.srcset;image.sizes='(max-width: 600px) calc(100vw - 80px), 380px';image.alt=post.cover_alt;image.width=post.cover.width;image.height=post.cover.height;image.loading='lazy';image.decoding='async';article.append(image);}
 const heading=node('h3'),title=node('a',post.title);title.href=post.url;heading.append(title);
 const link=node('a','Leer noticia ↗','text-link');link.href=title.href;link.setAttribute('aria-label','Leer noticia: '+post.title);
 article.append(meta,heading,node('p',post.summary),link);return article;
}
async function loadNews(target,query=''){
 if(document.documentElement.dataset.staticPreview==='true'){
  target.replaceChildren(node('p','Esta vista previa todavía no incluye noticias.','empty'));return {posts:[],total:0};
 }
 try{const response=await fetch('/api/posts'+query);if(!response.ok)throw new Error();const data=await response.json();target.replaceChildren();
 if(!data.posts.length){const filters=new URLSearchParams(query);target.append(node('p',filters.get('q')||filters.get('category')?'No hay noticias para esta búsqueda. Pruebe otro término o categoría.':'Pronto compartiremos las noticias de nuestra comunidad.','empty'));}
 else data.posts.slice(0,target.id==='home-news'?3:12).forEach(post=>target.append(card(post)));return data;
 }catch{target.replaceChildren(node('p','No fue posible cargar las noticias. Actualice la página para volver a intentarlo.','empty'));return null;}
}
if($('#home-news'))loadNews($('#home-news'),'?limit=3');
if($('#news-list')){
 let page=1;
 async function search(){const params=new URLSearchParams(new FormData($('#search-form')));params.set('page',page);const data=await loadNews($('#news-list'),'?'+params);const pages=Math.ceil((data?.total||0)/12);$('.pagination').hidden=pages<=1;$('#page-label').textContent=`Página ${page} de ${pages}`;$('#previous-page').disabled=page<=1;$('#next-page').disabled=page>=pages;}
 $('#search-form').addEventListener('submit',e=>{e.preventDefault();page=1;search();});
 $('#previous-page').addEventListener('click',()=>{page--;search();});$('#next-page').addEventListener('click',()=>{page++;search();});search();
}
