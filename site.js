const filters = document.querySelector('#categories');
const grid = document.querySelector('#menu-grid');
const status = document.querySelector('#menu-status');
const dialog = document.querySelector('#dish');
const dishPhoto = document.querySelector('#dish-photo');
const dishTitle = document.querySelector('#dish-title');
const dishOptions = document.querySelector('#dish-options');
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#navigation');
const photoURL = (dish) => `media/item-${dish.photo}.webp`;
const rubles = (price) => `${price} ₽`;
const volume = (size) => size === 1000 ? '1 л' : `${size} мл`;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let revealObserver;
if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0, rootMargin: '0px 0px 24px 0px' });
  document.documentElement.classList.add('motion-enabled');
}

function revealOnScroll(element) {
  if (!revealObserver) return;
  element.setAttribute('data-reveal', '');
  revealObserver.observe(element);
}

function showDish(dish) {
  dishPhoto.src = photoURL(dish);
  dishTitle.textContent = dish.name;
  dishOptions.replaceChildren();
  if (dish.sizes.every(([size]) => size === null)) {
    const row = document.createElement('li');
    row.textContent = dish.sizes.map(([, price]) => rubles(price)).join(' / ');
    dishOptions.append(row);
  } else {
    for (const [size, price] of dish.sizes) {
      const row = document.createElement('li');
      const label = document.createElement('span');
      const amount = document.createElement('strong');
      label.textContent = volume(size);
      amount.textContent = rubles(price);
      row.append(label, amount);
      dishOptions.append(row);
    }
  }
  dialog.showModal();
}

function makeCard(dish) {
  const card = document.createElement('button');
  card.className = 'dish-card';
  card.type = 'button';
  card.setAttribute('aria-haspopup', 'dialog');
  const image = new Image(360, 260);
  image.src = photoURL(dish);
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  const body = document.createElement('span');
  body.className = 'card-body';
  const title = document.createElement('strong');
  title.className = 'card-title';
  title.textContent = dish.name;
  const detail = document.createElement('span');
  detail.className = 'card-detail';
  const sizes = dish.sizes.map(([size]) => size).filter(Boolean);
  const size = document.createElement('span');
  size.className = 'card-size';
  size.textContent = sizes.map(volume).join(' / ');
  const price = document.createElement('span');
  price.className = 'card-price';
  price.textContent = (dish.sizes.length > 1 ? 'от ' : '') + rubles(Math.min(...dish.sizes.map(([, amount]) => amount)));
  detail.append(price, size);
  body.append(title, detail);
  card.append(image, body);
  card.addEventListener('click', () => showDish(dish));
  return card;
}

function selectCategory(category, announce = true) {
  for (const button of filters.children) {
    button.setAttribute('aria-pressed', String(button.dataset.category === category));
  }
  const visible = category === 'all' ? dishes : dishes.filter(dish => dish.category === category);
  for (const card of grid.children) revealObserver?.unobserve(card);
  grid.replaceChildren(...visible.map(makeCard));
  for (const card of grid.children) revealOnScroll(card);
  if (announce) status.textContent = `Позиций в категории: ${visible.length}`;
}

for (const [category, label] of [['all', 'Всё меню'], ...categories]) {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.category = category;
  button.textContent = label;
  button.setAttribute('aria-controls', 'menu-grid');
  button.addEventListener('click', () => selectCategory(category));
  filters.append(button);
}
selectCategory('all', false);

for (const section of document.querySelectorAll('.menu-heading, .categories, .atmosphere-copy, .gallery, .about-inner, .contacts > div')) {
  revealOnScroll(section);
}

for (const button of document.querySelectorAll('[data-featured-dish]')) {
  const dish = dishes.find(item => item.photo === Number(button.dataset.featuredDish));
  button.setAttribute('aria-haspopup', 'dialog');
  button.addEventListener('click', () => showDish(dish));
}

for (const link of document.querySelectorAll('[data-menu-category]')) {
  link.addEventListener('click', () => selectCategory(link.dataset.menuCategory));
}

dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) {
    dialog.close();
  }
});

function toggleNavigation(open) {
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Закрыть навигацию' : 'Открыть навигацию');
}
navToggle.addEventListener('click', () => toggleNavigation(navToggle.getAttribute('aria-expanded') === 'false'));
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) toggleNavigation(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
    toggleNavigation(false);
    navToggle.focus();
  }
});
