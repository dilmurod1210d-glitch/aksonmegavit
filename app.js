let products=[],selected=new URLSearchParams(location.search).get('category')||'Барчаси';const $=s=>document.querySelector(s),grid=$('#grid');
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){
 const q=$('#search').value.trim().toLocaleLowerCase();
 const list=products.filter(p=>(selected==='Барчаси'||p.category===selected)&&p.name.toLocaleLowerCase().includes(q));
 $('#result-count').textContent=list.length+' та маҳсулот';$('#reset').hidden=!q&&selected==='Барчаси';$('#empty').hidden=!!list.length;grid.replaceChildren();
 const categories=[...new Set(list.map(p=>p.category))];
 categories.forEach((category,index)=>{const items=list.filter(p=>p.category===category);const section=document.createElement('section');section.className='product-category';section.setAttribute('aria-labelledby','category-title-'+index);const heading=document.createElement('div');heading.className='category-heading';heading.innerHTML='<div><span class="category-number">'+String(index+1).padStart(2,'0')+'</span><h2 id="category-title-'+index+'">'+esc(category)+'</h2></div><span class="category-count">'+items.length+' та маҳсулот</span>';section.append(heading);const cards=document.createElement('div');cards.className='category-products';items.forEach(p=>{const card=document.createElement('a');card.className='card';card.href=p.url||'mahsulot/'+p.slug+'/';card.innerHTML='<div class="photo">'+(p.image?'<img loading="lazy" src="'+esc(p.thumb||p.image)+'"'+(p.srcset?' srcset="'+esc(p.srcset)+'" sizes="(max-width:650px) 45vw, 260px"':'')+' alt="'+esc(p.name)+'">':'<span class="placeholder">Сурат тайёрланмоқда</span>')+'</div><div class="card-text"><h3>'+esc(p.name)+'</h3><div class="card-bottom"><span>Батафсил маълумот</span><span class="arrow">↗</span></div></div>';cards.append(card)});section.append(cards);grid.append(section)});
 document.querySelectorAll('.filters button').forEach(b=>{const active=b.dataset.category===selected;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
 document.querySelectorAll('.top-categories a').forEach(a=>{const url=new URL(a.href,location.href);if(!url.pathname.includes('catalog'))return;const category=url.searchParams.get('category')||'Барчаси';if(category===selected)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
}

$('#search').oninput=render;$('#reset').onclick=()=>{selected='Барчаси';$('#search').value='';render()};$('#year').textContent=new Date().getFullYear();
window.SiteData.then(d=>d.products).then(data=>{products=data;$('#total').textContent=`${products.length} та маҳсулот`;['Барчаси',...new Set(products.map(p=>p.category))].forEach(category=>{const b=document.createElement('button');b.dataset.category=category;b.innerHTML=`${esc(category)} <span>${category==='Барчаси'?products.length:products.filter(p=>p.category===category).length}</span>`;b.onclick=()=>{selected=category;render()};$('#filters').append(b)});render()}).catch(()=>{$('#empty').hidden=false;$('#empty').textContent='Каталог юкланмади. Саҳифани янгилаб кўринг.'});





