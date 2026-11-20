// Prodigo_o — interações do site

const WHATSAPP = '5592992120062';

// Ano no rodapé
document.getElementById('ano').textContent = new Date().getFullYear();

// Menu do celular
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  })
);

// Filtro dos trabalhos
const filters = document.querySelectorAll('.filter');
const works = document.querySelectorAll('.work');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
  const cat = btn.dataset.filter;
  works.forEach(w => w.classList.toggle('is-hidden', cat !== 'todos' && w.dataset.cat !== cat));
}));

// Lightbox: mostra todas as imagens do projeto, inclusive as que não aparecem na capa
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
let lbList = [], lbIdx = 0;

function lbShow() {
  const img = lbList[lbIdx];
  lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt;
  lb.querySelectorAll('.lb-nav').forEach(b => b.hidden = lbList.length < 2);
}
function lbOpen(list, idx) { lbList = list; lbIdx = idx; lbShow(); lb.hidden = false; document.body.style.overflow = 'hidden'; lb.querySelector('.lb-close').focus(); }
function lbClose() { lb.hidden = true; document.body.style.overflow = ''; }
function lbMove(d) { lbIdx = (lbIdx + d + lbList.length) % lbList.length; lbShow(); }

document.querySelectorAll('[data-gallery]').forEach(g => {
  const imgs = [...g.querySelectorAll('img')];
  imgs.forEach((img, i) => img.addEventListener('click', () => lbOpen(imgs, i)));
});
lb.querySelector('.lb-close').addEventListener('click', lbClose);
lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); lbMove(-1); });
lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); lbMove(1); });
lb.addEventListener('click', e => { if (e.target === lb) lbClose(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') lbClose();
  if (e.key === 'ArrowRight') lbMove(1);
  if (e.key === 'ArrowLeft') lbMove(-1);
});
let tx = 0;
lb.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 40) lbMove(dx < 0 ? 1 : -1); }, { passive: true });

// Formulário de orçamento: monta a mensagem e abre o WhatsApp
const form = document.getElementById('quote');
const err = form.querySelector('.form-error');
form.addEventListener('submit', e => {
  e.preventDefault();
  const d = new FormData(form);
  const nome = (d.get('nome') || '').trim();
  const msg = (d.get('mensagem') || '').trim();
  if (!nome || !msg) { err.hidden = false; return; }
  err.hidden = true;
  const empresa = (d.get('empresa') || '').trim();
  const servicos = d.getAll('servico');
  const linhas = [
    `Olá! Vim pelo site da Prodigo_o.`,
    ``,
    `*Nome:* ${nome}`,
    empresa ? `*Empresa/projeto:* ${empresa}` : null,
    servicos.length ? `*Assunto:* ${servicos.join(', ')}` : null,
    `*Sobre o projeto:* ${msg}`,
  ].filter(l => l !== null);
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas.join('\n'))}`, '_blank', 'noopener');
});

// Animação de entrada das seções
const revealEls = document.querySelectorAll('.section-head, .service, .work, .steps li, .contact');
if ('IntersectionObserver' in window) {
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver(entries => entries.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
}

// "Voltar ao topo" e o logo: o cabeçalho com id="topo" fica grudado no alto
// da tela, então o navegador acha que já está no lugar e não rola. Rola na mão.
document.querySelectorAll('a[href="#topo"]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: smooth ? 'smooth' : 'auto' });
    history.replaceState(null, '', location.pathname + location.search);
  })
);
