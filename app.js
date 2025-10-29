(async function(){
  const res = await fetch('./products.json');
  const items = await res.json();
  const featured = document.getElementById('featured');
  if(featured){
    const top = items.slice(0,8);
    featured.innerHTML = top.map(i => `
      <article data-id="${i.id}" class="bg-white rounded-2xl shadow overflow-hidden">
        <img src="${i.image}" class="w-full h-60 object-cover" alt="${i.title}"/>
        <div class="p-4">
          <h3 class="font-semibold">${i.title}</h3>
          <p class="text-sm text-gray-500 mb-1">Tác giả: ${i.author}</p>
          <p class="text-blue-700 font-semibold">${new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(i.price)}</p>
        </div>
      </article>
    `).join('');
  }
  const grid = document.getElementById('grid');
  if(grid){
    const q = document.getElementById('q');
    const cat = document.getElementById('cat');
    const cats = Array.from(new Set(items.map(i=>i.category))).sort();
    cat.innerHTML += cats.map(c=>`<option value="${c}">${c}</option>`).join('');
    function render(){
      const Q = (q.value||'').toLowerCase();
      const C = cat.value||'';
      const filtered = items.filter(i => (!Q || (i.title.toLowerCase().includes(Q)||i.author.toLowerCase().includes(Q))) && (!C || i.category===C));
      grid.innerHTML = filtered.map(i=>`
        <article data-id="${i.id}" class="bg-white rounded-2xl shadow overflow-hidden">
          <img src="${i.image}" class="w-full h-60 object-cover" alt="${i.title}"/>
          <div class="p-4">
            <h3 class="font-semibold">${i.title}</h3>
            <p class="text-sm text-gray-500 mb-1">Tác giả: ${i.author}</p>
            <p class="text-blue-700 font-semibold">${new Intl.NumberFormat('vi-VN',{style:'currency',currency:'VND'}).format(i.price)}</p>
          </div>
        </article>
      `).join('');
    }
    q.addEventListener('input', render);
    cat.addEventListener('change', render);
    render();
  }
})();