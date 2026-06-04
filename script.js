/**
 * ==========================================================================
 * JARVIS VISUAL ENGINE - IEEE 802.11 PRESENTATION
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSubNavigation();
    initVisualEngine();
});

/* ==========================================================================
   1. CONTROLADOR MAESTRO DE DIAPOSITIVAS
   ========================================================================== */
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function initNavigation() {
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));

    // Navegación por teclado para que puedan usar un presentador inalámbrico
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'Space') goToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    });

    // Navegación por puntos
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

/* ==========================================================================
   2. NAVEGACIÓN DE SUB-PANELES (VISUALES DINÁMICOS)
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Encontrar el contenedor padre (la diapositiva actual)
            const parentSection = this.closest('section');
            
            // Limpiar botones activos en esta sección
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Ocultar todos los SVGs en esta sección
            parentSection.querySelectorAll('.svg-container').forEach(svg => {
                svg.classList.remove('active');
            });
            
            // Mostrar el SVG objetivo
            const targetId = this.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });
}

/* ==========================================================================
   3. MOTOR DE RENDERIZADO SVG (GENERACIÓN MATEMÁTICA Y ANIMACIÓN)
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

function createNode(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function initVisualEngine() {
    renderCSMACA();
    renderFrequencies();
    renderMIMO();
    renderMUMIMO();
    renderBeamforming();
    renderOFDMA();
    renderBSS();
    renderTWT();
}

/* --- ANIMACIONES PARTE 1: PIONEROS --- */
function renderCSMACA() {
    const container = document.querySelector('#vis-csmaca svg');
    if(!container) return;
    
    // Crear ondas de radar desde el AP y las estaciones
    for(let i=0; i<3; i++) {
        let wave = createNode('circle', {
            cx: 250, cy: 50, r: 0,
            fill: 'none', stroke: '#00f0ff', 'stroke-width': 2,
            style: `animation: pulse-wave 2s infinite ${i*0.6}s`
        });
        container.appendChild(wave);
    }
}

function renderFrequencies() {
    // 2.4 GHz - Ondas largas y amplias
    const cont24 = document.querySelector('#vis-80211b svg');
    if(cont24) drawSineWave(cont24, '#00f0ff', 40, 150);

    // 5 GHz - Ondas cortas y rápidas (OFDM)
    const cont5 = document.querySelector('#vis-80211a svg');
    if(cont5) drawSineWave(cont5, '#ffd700', 15, 60);

    // 2.4 GHz Híbrido (g)
    const contG = document.querySelector('#vis-80211g svg');
    if(contG) {
        drawSineWave(contG, '#00f0ff', 40, 150);
        drawSineWave(contG, '#ffd700', 40, 60, 20); // Multiplexado
    }
}

function drawSineWave(svg, color, frequency, amplitude, offset=0) {
    let path = `M 0 ${150 + offset} `;
    for(let x=0; x<=500; x+=5) {
        let y = 150 + offset + Math.sin(x / frequency) * amplitude;
        path += `L ${x} ${y} `;
    }
    let wave = createNode('path', {
        d: path, fill: 'none', stroke: color, 'stroke-width': 3,
        style: 'opacity: 0.6; filter: drop-shadow(0 0 5px '+color+');'
    });
    svg.insertBefore(wave, svg.firstChild);
}

/* --- ANIMACIONES PARTE 2: HARDWARE (MIMO) --- */
function renderMIMO() {
    const svg = document.querySelector('#vis-mimo svg');
    if(!svg) return;
    
    // Transmisor 4 Antenas
    for(let i=0; i<4; i++) {
        svg.appendChild(createNode('rect', {x: 50, y: 80 + (i*40), width: 10, height: 30, fill: '#fff'}));
        svg.appendChild(createNode('rect', {x: 440, y: 80 + (i*40), width: 10, height: 30, fill: '#fff'}));
        
        // Crear rutas de multipercurso caóticas pero conectadas
        let p = createNode('path', {
            d: `M 60 ${95 + (i*40)} Q ${250 + Math.random()*100 - 50} ${Math.random()*300} 440 ${95 + (Math.floor(Math.random()*4)*40)}`,
            fill: 'none', stroke: 'rgba(0, 240, 255, 0.4)', 'stroke-width': 2,
            'stroke-dasharray': '10, 5',
            style: `animation: dash-flow ${2 + Math.random()}s linear infinite`
        });
        svg.appendChild(p);
    }
}

function renderMUMIMO() {
    const g = document.querySelector('.mu-streams');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#00ffaa'];
    const targets = [{x: 400, y: 80}, {x: 400, y: 140}, {x: 400, y: 200}, {x: 400, y: 260}];
    
    targets.forEach((t, index) => {
        // Dispositivo
        g.appendChild(createNode('circle', {cx: t.x, cy: t.y, r: 15, fill: colors[index]}));
        // Flujo de datos dedicado
        g.appendChild(createNode('path', {
            d: `M 100 170 C 250 170, 250 ${t.y}, ${t.x - 20} ${t.y}`,
            fill: 'none', stroke: colors[index], 'stroke-width': 6,
            style: 'opacity: 0.8; filter: drop-shadow(0 0 10px '+colors[index]+');'
        }));
    });
    // AP Central
    g.appendChild(createNode('rect', {x: 70, y: 130, width: 30, height: 80, fill: '#fff'}));
}

function renderBeamforming() {
    const g = document.querySelector('.beam-waves');
    if(!g) return;
    
    // Antena AP
    g.appendChild(createNode('rect', {x: 80, y: 120, width: 20, height: 60, fill: '#fff'}));
    // Dispositivo Móvil
    g.appendChild(createNode('rect', {x: 400, y: 70, width: 20, height: 40, fill: '#00f0ff'}));
    
    // Crear el haz concentrado (Beam)
    let cone = createNode('path', {
        d: 'M 100 150 L 390 60 L 390 120 Z',
        fill: 'url(#beam-gradient)', opacity: 0.6,
        style: 'animation: float-3d 4s infinite ease-in-out; transform-origin: 100px 150px;'
    });
    
    // Definir gradiente para el haz
    let defs = createNode('defs', {});
    let grad = createNode('linearGradient', {id: 'beam-gradient'});
    grad.appendChild(createNode('stop', {offset: '0%', 'stop-color': 'rgba(0,240,255,0.8)'}));
    grad.appendChild(createNode('stop', {offset: '100%', 'stop-color': 'rgba(0,240,255,0)'}));
    defs.appendChild(grad);
    g.appendChild(defs);
    g.appendChild(cone);
}

/* --- ANIMACIONES PARTE 3: EFICIENCIA (ax) --- */
function renderOFDMA() {
    const g = document.querySelector('.ofdma-blocks');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055'];
    
    // Crear el "camión" / canal dividido
    for(let col=0; col<8; col++) {
        for(let row=0; row<4; row++) {
            let colorIndex = (col + row) % colors.length;
            let block = createNode('rect', {
                x: 80 + (col * 42), y: 100 + (row * 32),
                width: 38, height: 28, rx: 4,
                fill: colors[colorIndex],
                opacity: 0.1,
                style: `transition: opacity 0.3s; animation: flash-block ${Math.random()*3+1}s infinite ${Math.random()}s`
            });
            g.appendChild(block);
        }
    }
    
    // Estilos de animación embebidos dinámicamente
    const style = document.createElement('style');
    style.innerHTML = `@keyframes flash-block { 0%, 100% {opacity: 0.2;} 50% {opacity: 1; filter: brightness(1.5);} }`;
    document.head.appendChild(style);
}

function renderBSS() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    
    // Crear celdas hexagonales simuladas (BSS)
    const centers = [{x: 150, y: 150, c: '#00f0ff'}, {x: 350, y: 150, c: '#ffd700'}, {x: 250, y: 250, c: '#ff0055'}];
    
    centers.forEach(c => {
        g.appendChild(createNode('circle', {
            cx: c.x, cy: c.y, r: 80,
            fill: c.c, opacity: 0.15,
            stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '5,5'
        }));
        g.appendChild(createNode('circle', {cx: c.x, cy: c.y, r: 10, fill: c.c}));
        
        // Simular rechazo de interferencia
        let blockWave = createNode('path', {
            d: `M ${c.x+30} ${c.y-30} L ${c.x+60} ${c.y-60} M ${c.x+60} ${c.y-30} L ${c.x+30} ${c.y-60}`,
            stroke: '#fff', 'stroke-width': 3,
            style: `animation: flash-block 2s infinite ${Math.random()}s`
        });
        g.appendChild(blockWave);
    });
}

function renderTWT() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    // Línea de tiempo
    g.appendChild(createNode('line', {x1: 50, y1: 180, x2: 450, y2: 180, stroke: '#94a3b8', 'stroke-width': 2}));
    
    // Pulsos de despertar (Target Wake Time)
    for(let i=0; i<4; i++) {
        // Bloque de sueño
        g.appendChild(createNode('rect', {x: 50 + (i*100), y: 175, width: 80, height: 10, fill: '#334155'}));
        // Pico de transmisión
        g.appendChild(createNode('rect', {
            x: 130 + (i*100), y: 100, width: 20, height: 80, fill: '#00f0ff',
            style: `animation: pulse-wave 2s infinite ${i*0.5}s`
        }));
        
        // Icono de batería
        g.appendChild(createNode('rect', {x: 125 + (i*100), y: 60, width: 30, height: 15, rx: 2, fill: 'none', stroke: '#ffd700', 'stroke-width': 2}));
        g.appendChild(createNode('rect', {x: 127 + (i*100), y: 62, width: 26, height: 11, fill: '#ffd700'}));
    }
}
