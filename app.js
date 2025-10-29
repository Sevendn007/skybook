
async function loadProducts() {
  const res = await fetch('./products.json');
  const items = await res.json();
  // Featured (first 8)
  const featured = document.getElementById('featured');
  if (featured) {
    featured.innerHTML = items.slice(0, 8).map(card).join('');
  }
  // Catalog
  const grid = document.getElementById('grid');
  const catSel = document.getElementById('category');
  const search = document.getElementById('search');
  if (catSel) {
    const cats = [...new Set(items.map(i => i.category))].sort();
    cats.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      catSel.appendChild(opt);
    });
  }
  
  let page = 1;
  const PAGE_SIZE = 48;
  const btnMore = document.createElement('button');
  btnMore.textContent = 'Xem thêm';
  btnMore.className = 'mt-6 mx-auto block px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-black';
  function mountMoreButton(show) {
    if (!grid) return;
    if (show) {
      if (!btnMore.isConnected) grid.parentElement.appendChild(btnMore);
    } else if (btnMore.isConnected) {
      btnMore.remove();
    }
  }

  function render() {
    if (!grid) return;
    const q = (search?.value || '').toLowerCase();
    const cat = catSel?.value || '';
    let filtered = items.filter(i => {
      const okQ = !q || (i.title.toLowerCase().includes(q) || i.author.toLowerCase().includes(q));
      const okC = !cat || i.category === cat;
      return okQ && okC;
    });
    const end = page * PAGE_SIZE;
    const slice = filtered.slice(0, end);
    grid.innerHTML = slice.map(card).join('');
    mountMoreButton(filtered.length > slice.length);
  }
  search?.addEventListener('input', render);
  catSel?.addEventListener('change', render);
  render();
  // modal
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  modalClose?.addEventListener('click', () => modal.classList.add('hidden'));
  document.body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-id]');
    if (!t) return;
    const id = t.getAttribute('data-id');
    const book = items.find(x => String(x.id) === id);
    if (!book) return;
    document.getElementById('modalTitle').textContent = book.title;
    document.getElementById('modalAuthor').textContent = 'Tác giả: ' + book.author;
    document.getElementById('modalPrice').textContent = new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(book.price);
    document.getElementById('modalDesc').textContent = book.description;
    document.getElementById('modalImg').src = book.image;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });
}
function card(i) {
  return `
  <article class="rounded-2xl bg-white shadow hover:shadow-md transition overflow-hidden" data-id="${i.id}">
    <img loading="lazy" class="w-full h-56 object-cover" src="${i.image}" alt="${i.title}">
    <div class="p-4">
      <h3 class="font-semibold line-clamp-2 min-h-[3.2rem]">${i.title}</h3>
      <p class="text-sm text-gray-600 mt-1">${i.author}</p>
      <div class="mt-2 font-semibold text-blue-700">${new Intl.NumberFormat('vi-VN', {style:'currency', currency:'VND'}).format(i.price)}</div>
      <button class="mt-3 w-full px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700">Xem chi tiết</button>
    </div>
  </article>`;
}
document.addEventListener('DOMContentLoaded', loadProducts);

  btnMore.addEventListener('click', () => { page += 1; render(); });
