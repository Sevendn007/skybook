(function(){
  function initHeader(){
    const badge = document.getElementById('cartBadge');
    const cart = JSON.parse(localStorage.getItem('sbCart')||'[]');
    if(badge) badge.innerText = cart.length;
    const accountLink = document.getElementById('accountLink');
    const user = localStorage.getItem('skybookUser');
    if(accountLink){
      if(user){
        accountLink.textContent = user.split('@')[0];
        accountLink.href = '#';
        accountLink.onclick = function(){ localStorage.removeItem('skybookUser'); location.reload(); };
      }else{
        accountLink.textContent = 'Đăng nhập';
        accountLink.href = './login.html';
      }
    }
  }
  async function injectButtons(){
    const grid = document.getElementById('grid');
    const featured = document.getElementById('featured');
    const host = grid || featured;
    if(!host) return;
    const obs = new MutationObserver(()=>{
      host.querySelectorAll('article .p-4').forEach(box=>{
        if(box.querySelector('[data-add]')) return;
        const idAttr = box.closest('article').getAttribute('data-id');
        const btn = document.createElement('button');
        btn.className = 'mt-3 w-full px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700';
        btn.setAttribute('data-add','1'); btn.setAttribute('data-id', idAttr||'');
        btn.innerText = 'Thêm vào giỏ';
        btn.addEventListener('click', async ()=>{
          const items = await (await fetch('./products.json')).json();
          const it = items.find(x=>String(x.id)===String(idAttr));
          if(!it) return;
          const cart = JSON.parse(localStorage.getItem('sbCart')||'[]');
          cart.push({id: it.id, title: it.title, author: it.author, price: it.price, image: it.image});
          localStorage.setItem('sbCart', JSON.stringify(cart));
          const badge = document.getElementById('cartBadge'); if(badge) badge.innerText = cart.length;
          btn.innerText = 'Đã thêm'; setTimeout(()=>btn.innerText='Thêm vào giỏ',1200);
        });
        box.appendChild(btn);
      });
    });
    obs.observe(host, {childList:true, subtree:true});
  }
  document.addEventListener('DOMContentLoaded', ()=>{ initHeader(); injectButtons(); });
})();