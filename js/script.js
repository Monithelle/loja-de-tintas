const menuButton = document.getElementById('menuButton');
const siteNav = document.getElementById('siteNav');
const currentYear = document.getElementById('currentYear');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// Menu mobile
if (menuButton && siteNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');

    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    });
  });
}

// Rolagem para botões com data-scroll
document.querySelectorAll('[data-scroll]').forEach((button) => {
  button.addEventListener('click', () => {
    const target = document.querySelector(button.dataset.scroll);

    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Paleta do hero
const heroPaintPreview = document.getElementById('heroPaintPreview');
const heroColorName = document.getElementById('heroColorName');
const heroColorCode = document.getElementById('heroColorCode');

document.querySelectorAll('.palette-dot').forEach((button) => {
  button.addEventListener('click', () => {
    const color = button.dataset.color;
    const name = button.dataset.name;

    if (heroPaintPreview) {
      heroPaintPreview.style.background = color;
    }

    if (heroColorName) {
      heroColorName.textContent = name;
    }

    if (heroColorCode) {
      heroColorCode.textContent = color.toUpperCase();
    }
  });
});

// Estúdio de cores
const colorPicker = document.getElementById('colorPicker');
const hexInput = document.getElementById('hexInput');
const colorCanvas = document.getElementById('colorCanvas');
const selectedColorHex = document.getElementById('selectedColorHex');
const copyColorButton = document.getElementById('copyColorButton');
const copyColorStatus = document.getElementById('copyColorStatus');

function normalizeHex(value) {
  const cleaned = value.trim().toUpperCase();

  if (/^#[0-9A-F]{6}$/.test(cleaned)) {
    return cleaned;
  }

  return null;
}

function applyColor(value) {
  const color = normalizeHex(value);

  if (!color) {
    return false;
  }

  if (colorCanvas) {
    colorCanvas.style.background = color;
  }

  if (selectedColorHex) {
    selectedColorHex.textContent = color;
  }

  if (colorPicker) {
    colorPicker.value = color.toLowerCase();
  }

  if (hexInput) {
    hexInput.value = color;
  }

  return true;
}

if (colorPicker) {
  colorPicker.addEventListener('input', () => {
    applyColor(colorPicker.value);
  });
}

if (hexInput) {
  hexInput.addEventListener('change', () => {
    const valid = applyColor(hexInput.value);

    if (!valid) {
      hexInput.value = selectedColorHex?.textContent || '#4C7A8A';
    }
  });
}

if (copyColorButton) {
  copyColorButton.addEventListener('click', async () => {
    const color = selectedColorHex?.textContent || '#4C7A8A';

    try {
      await navigator.clipboard.writeText(color);

      if (copyColorStatus) {
        copyColorStatus.textContent = `${color} copiado para a área de transferência.`;
      }
    } catch {
      if (copyColorStatus) {
        copyColorStatus.textContent = `Cor selecionada: ${color}`;
      }
    }
  });
}

// Filtros de produtos
const filterButtons = document.querySelectorAll('.filter-button');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle('is-active', item === button);
    });

    productCards.forEach((card) => {
      const shouldShow =
        filter === 'todos' ||
        card.dataset.category === filter;

      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

// Lista simples de orçamento
const quoteCount = document.getElementById('quoteCount');
const quoteItems = new Set();
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add('is-visible');

  window.clearTimeout(toastTimer);

  toastTimer = window.setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
}

document.querySelectorAll('.add-quote').forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;

    quoteItems.add(product);

    if (quoteCount) {
      quoteCount.textContent = String(quoteItems.size);
    }

    button.textContent = 'Adicionado ✓';
    button.disabled = true;

    showToast(`${product} foi adicionado ao orçamento.`);
  });
});

// Calculadora de tinta
const paintCalculator = document.getElementById('paintCalculator');
const calculatorResult = document.getElementById('calculatorResult');

if (paintCalculator && calculatorResult) {
  paintCalculator.addEventListener('submit', (event) => {
    event.preventDefault();

    const width = Number(document.getElementById('wallWidth')?.value || 0);
    const height = Number(document.getElementById('wallHeight')?.value || 0);
    const count = Number(document.getElementById('wallCount')?.value || 0);
    const coats = Number(document.getElementById('paintCoats')?.value || 0);

    const area = width * height * count * coats;

    // Valor demonstrativo. O rendimento real depende do produto.
    const coveragePerLiter = 10;
    const liters = area / coveragePerLiter;

    const litersText = liters.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

    const areaText = area.toLocaleString('pt-BR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    });

    calculatorResult.innerHTML = `
      <span>Estimativa</span>
      <strong>${litersText} L</strong>
      <small>para aproximadamente ${areaText} m² de pintura</small>
    `;
  });
}

/* =========================================================
   EFEITO DE TINTA FLUIDA AO ROLAR A PÁGINA
   ========================================================= */

(() => {
  const paintPath = document.getElementById('paintPath');
  const paintSheen = document.getElementById('paintSheen');
  const stopTop = document.getElementById('paintStopTop');
  const stopBottom = document.getElementById('paintStopBottom');

  if (!paintPath) {
    return;
  }

  /*
    A tinta muda de tom conforme a rolagem avança,
    passando pelas cores da paleta da loja — como se
    fossem latas diferentes se misturando no fundo.
  */
  const paintPalette = [
    { r: 0x2e, g: 0x6f, b: 0x95 }, // azul horizonte
    { r: 0xc9, g: 0x6a, b: 0x45 }, // terracota
    { r: 0x64, g: 0x7a, b: 0x4d }, // verde oliva
    { r: 0x6e, g: 0x5b, b: 0x7e }  // ameixa
  ];

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function toHex(n) {
    return Math.round(n).toString(16).padStart(2, '0');
  }

  function paletteColor(progress, lighten) {
    const scaled = progress * (paintPalette.length - 1);
    const i = Math.min(paintPalette.length - 2, Math.floor(scaled));
    const t = scaled - i;

    const a = paintPalette[i];
    const b = paintPalette[i + 1];

    let r = lerp(a.r, b.r, t);
    let g = lerp(a.g, b.g, t);
    let bl = lerp(a.b, b.b, t);

    if (lighten) {
      r = lerp(r, 255, lighten);
      g = lerp(g, 255, lighten);
      bl = lerp(bl, 255, lighten);
    }

    return `#${toHex(r)}${toHex(g)}${toHex(bl)}`;
  }

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  let currentProgress = 0;
  let targetProgress = 0;
  let lastFrameTime = null;

  /*
    Tempo (em ms) que a tinta leva para "alcançar" a posição
    real do scroll. Menor = mais fluido/ágil, maior = mais lento.
    Usar tempo decorrido (em vez de um fator fixo por frame)
    garante a mesma sensação de fluidez em qualquer taxa de
    atualização de tela (60Hz, 120Hz, 144Hz...).
  */
  const CATCH_UP_MS = 160;

  const WIDTH = 1440;
  const HEIGHT = 1000;

  /*
    Cada objeto cria uma região de tinta que "escorre".
    Os tamanhos diferentes evitam o aspecto repetitivo
    de gotas em formato de bastão.
  */
  const drips = [
    { x: 0.08, width: 54, depth: 110, phase: 0.2 },
    { x: 0.21, width: 82, depth: 175, phase: 1.6 },
    { x: 0.38, width: 48, depth: 82,  phase: 3.1 },
    { x: 0.56, width: 76, depth: 145, phase: 4.4 },
    { x: 0.73, width: 55, depth: 205, phase: 5.7 },
    { x: 0.91, width: 72, depth: 125, phase: 2.5 }
  ];

  function getScrollProgress() {
    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    if (maxScroll <= 0) {
      return 0;
    }

    return Math.min(
      1,
      Math.max(0, window.scrollY / maxScroll)
    );
  }

  function updateTarget() {
    targetProgress = getScrollProgress();
  }

  /*
    Calcula a borda inferior da tinta.
    A onda é contínua e as regiões mais profundas
    se fundem à superfície, em vez de parecerem
    retângulos separados.
  */
  function getEdgeY(x, baseY, time) {
    const t = reduceMotion ? 0 : time;

    let y =
      baseY +
      Math.sin(x * 0.010 + t * 0.00115) * 7 +
      Math.sin(x * 0.023 - t * 0.00075) * 3.5;

    for (const drip of drips) {
      const sway = reduceMotion
        ? 0
        : Math.sin(t * 0.00065 + drip.phase) * 8;

      const center =
        drip.x * WIDTH +
        sway;

      const pulse = reduceMotion
        ? 1
        : 0.94 +
          Math.sin(t * 0.001 + drip.phase) * 0.06;

      const distance =
        (x - center) /
        drip.width;

      /*
        Curva gaussiana:
        cria uma queda arredondada e conectada à massa de tinta.
      */
      const shape =
        Math.exp(
          -Math.pow(Math.abs(distance), 2.35)
        );

      y +=
        drip.depth *
        pulse *
        shape;
    }

    return y;
  }

  function buildPaintPath(progress, time) {
    /*
      No topo da página, a tinta fica praticamente escondida.
      No fim, a borda passa da parte inferior da tela,
      deixando o fundo totalmente preenchido.
    */
    const baseY =
      -230 +
      progress * (HEIGHT + 430);

    const step = 18;
    const points = [];

    for (let x = 0; x <= WIDTH; x += step) {
      points.push({
        x,
        y: getEdgeY(x, baseY, time)
      });
    }

    if (points[points.length - 1].x !== WIDTH) {
      points.push({
        x: WIDTH,
        y: getEdgeY(WIDTH, baseY, time)
      });
    }

    let d = `M 0 -350 L ${WIDTH} -350 `;

    /*
      Desenha a borda da direita para a esquerda.
      Como há muitos pontos próximos, o contorno fica
      suave mesmo sem criar "gotas geométricas".
    */
    for (let i = points.length - 1; i >= 0; i--) {
      d += `L ${points[i].x.toFixed(1)} ${points[i].y.toFixed(1)} `;
    }

    d += 'Z';

    return { d, points };
  }

  /* Uma linha fina acompanhando a borda molhada, para dar brilho. */
  function buildSheenPath(points) {
    let d = '';

    points.forEach((point, i) => {
      d += `${i === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${(point.y - 3).toFixed(1)} `;
    });

    return d;
  }

  function animate(time) {
    /*
      A interpolação dá inércia ao movimento.
      Assim a tinta acompanha o scroll suavemente,
      sem pular junto com a rodinha do mouse.

      O fator de suavização agora usa o tempo decorrido
      entre frames (dt) em vez de uma constante fixa, então
      a velocidade percebida não muda com a taxa de atualização
      da tela. O dt é limitado a 64ms para evitar um "salto"
      da tinta quando o usuário volta para a aba depois de um
      tempo (ex.: trocou de aba e o navegador pausou os frames).
    */
    if (lastFrameTime === null) {
      lastFrameTime = time;
    }

    const dt = Math.min(64, time - lastFrameTime);
    lastFrameTime = time;

    const ease = reduceMotion
      ? 1
      : 1 - Math.exp(-dt / CATCH_UP_MS);

    currentProgress +=
      (targetProgress - currentProgress) *
      ease;

    const { d, points } = buildPaintPath(currentProgress, time);

    paintPath.setAttribute('d', d);

    if (paintSheen) {
      paintSheen.setAttribute('d', buildSheenPath(points));
    }

    if (stopTop && stopBottom) {
      stopTop.setAttribute('stop-color', paletteColor(currentProgress, 0.22));
      stopBottom.setAttribute('stop-color', paletteColor(currentProgress, 0));
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener(
    'scroll',
    updateTarget,
    { passive: true }
  );

  window.addEventListener(
    'resize',
    updateTarget
  );

  updateTarget();
  requestAnimationFrame(animate);
})();
