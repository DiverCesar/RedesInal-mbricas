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
let slides = [];
let dots = [];
let totalSlides = 0;

function initNavigation() {
    slides = document.querySelectorAll('.slide');
    dots = document.querySelectorAll('.dot');
    totalSlides = slides.length;

    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');

    if(btnNext) btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    if(btnPrev) btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));

    // Navegación por teclado (Flechas y Espacio) ideal para pasador inalámbrico
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') goToSlide(currentSlide + 1);
        if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
    });

    // Navegación por puntos inferiores
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Apagar la actual
    slides[currentSlide].classList.remove('active');
    if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    // Actualizar índice
    currentSlide = index;
    
    // Encender la nueva
    slides[currentSlide].classList.add('active');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

/* ==========================================================================
   2. NAVEGACIÓN DE SUB-PANELES (VISUALES DINÁMICOS EN LA MISMA DIAPO)
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 1. Encontrar el contenedor padre (la diapositiva actual)
            const parentSection = this.closest('section');
            if(!parentSection) return;
            
            // 2. Limpiar botones activos en esta sección
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active'); // Activar el clickeado
            
            // 3. Ocultar todos los SVGs en esta sección
            parentSection.querySelectorAll('.svg-container').forEach(svg => {
                svg.classList.remove('active');
            });
            
            // 4. Mostrar el SVG objetivo usando el atributo data-target
            const targetId = this.getAttribute('data-target');
            const targetSvg = document.getElementById(targetId);
            if(targetSvg) {
                targetSvg.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   3. MOTOR DE RENDERIZADO SVG (GENERACIÓN MATEMÁTICA Y ANIMACIÓN)
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

// Utilidad para crear nodos SVG compatibles
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
    
    // Crear ondas de transmisión desde el AP simulando la escucha del canal
    for(let i=0; i<3; i++) {
        let wave = createNode('circle', {
            cx: 250, cy: 100, r: 0,
            fill: 'none', stroke: '#00f0ff', 'stroke-width': 2,
            style: `animation: pulse-wave 2s infinite ${i*0.6}s`
        });
        container.appendChild(wave);
    }
}

function renderFrequencies() {
    // 802.11b: 2.4 GHz - Ondas largas y de gran amplitud
    const cont24 = document.querySelector('#vis-80211b svg');
    if(cont24) drawSineWave(cont24, '#00f0ff', 40, 80);

    // 802.11a: 5 GHz - Ondas cortas y rápidas
    const cont5 = document.querySelector('#vis-80211a svg');
    if(cont5) drawSineWave(cont5, '#ffd700', 15, 40);

    // 802.11g: Híbrido 
    const contG = document.querySelector('#vis-80211g svg');
    if(contG) {
        drawSineWave(contG, '#00f0ff', 40, 80);
        drawSineWave(contG, '#ffd700', 20, 30, 20); 
    }
}

// Función matemática para dibujar la onda seno pura
function drawSineWave(svg, color, frequency, amplitude, offset=0) {
    let path = `M 0 ${150 + offset} `;
    for(let x=0; x<=500; x+=5) {
        let y = 150 + offset + Math.sin(x / frequency) * amplitude;
        path += `L ${x} ${y} `;
    }
    let wave = createNode('path', {
        d: path, fill: 'none', stroke: color, 'stroke-width': 3,
        style: `opacity: 0.7; filter: drop-shadow(0 0 8px ${color});`
    });
    svg.insertBefore(wave, svg.firstChild);
}

/* --- ANIMACIONES PARTE 2: HARDWARE (n/ac) --- */
function renderMIMO() {
    const svg = document.querySelector('#vis-mimo svg');
    if(!svg) return;
    
    // Dibujar Antenas Transmisoras y Receptoras (4x4)
    for(let i=0; i<4; i++) {
        svg.appendChild(createNode('rect', {x: 60, y: 80 + (i*40), width: 10, height: 25, fill: '#fff', rx: 3}));
        svg.appendChild(createNode('rect', {x: 430, y: 80 + (i*40), width: 10, height: 25, fill: '#fff', rx: 3}));
        
        // Crear rutas de multipercurso caóticas
        let p = createNode('path', {
            d: `M 70 ${92 + (i*40)} Q ${250 + Math.random()*150 - 75} ${Math.random()*300} 430 ${92 + (Math.floor(Math.random()*4)*40)}`,
            fill: 'none', stroke: 'rgba(0, 240, 255, 0.5)', 'stroke-width': 2,
            'stroke-dasharray': '15, 10',
            style: `animation: dash-flow ${1.5 + Math.random()}s linear infinite`
        });
        svg.appendChild(p);
    }
}

function renderMUMIMO() {
    const g = document.querySelector('.mu-streams');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#00ffaa'];
    const targets = [{x: 400, y: 70}, {x: 400, y: 130}, {x: 400, y: 190}, {x: 400, y: 250}];
    
    // AP Central
    g.appendChild(createNode('rect', {x: 60, y: 120, width: 25, height: 80, fill: '#fff', rx: 5}));

    targets.forEach((t, index) => {
        // Dispositivos clientes
        g.appendChild(createNode('circle', {cx: t.x, cy: t.y, r: 12, fill: colors[index]}));
        
        // Flujos de datos dedicados simultáneos
        g.appendChild(createNode('path', {
            d: `M 85 160 C 200 160, 250 ${t.y}, ${t.x - 20} ${t.y}`,
            fill: 'none', stroke: colors[index], 'stroke-width': 4,
            style: `opacity: 0.8; filter: drop-shadow(0 0 8px ${colors[index]}); stroke-dasharray: 20 10; animation: dash-flow 1s linear infinite reverse;`
        });
    });
}

function renderBeamforming() {
    const g = document.querySelector('.beam-waves');
    if(!g) return;
    
    // Antena AP y Dispositivo Móvil
    g.appendChild(createNode('rect', {x: 80, y: 120, width: 20, height: 60, fill: '#fff', rx: 4}));
    g.appendChild(createNode('rect', {x: 400, y: 70, width: 15, height: 35, fill: '#00f0ff', rx: 2}));
    
    // Haz concentrado (Beam)
    let cone = createNode('path', {
        d: 'M 100 150 L 390 65 L 390 110 Z',
        fill: 'url(#beam-gradient)', opacity: 0.7,
        style: 'animation: float-3d 3s infinite ease-in-out; transform-origin: 100px 150px;'
    });
    
    // Gradiente dinámico
    let defs = createNode('defs', {});
    let grad = createNode('linearGradient', {id: 'beam-gradient'});
    grad.appendChild(createNode('stop', {offset: '0%', 'stop-color': 'rgba(0,240,255,0.9)'}));
    grad.appendChild(createNode('stop', {offset: '100%', 'stop-color': 'rgba(0,240,255,0.1)'}));
    defs.appendChild(grad);
    g.appendChild(defs);
    g.appendChild(cone);
}

/* --- ANIMACIONES PARTE 3: EFICIENCIA (ax/6E) --- */
function renderOFDMA() {
    const g = document.querySelector('.ofdma-blocks');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055'];
    
    // Dibujar las Unidades de Recursos (RU) como camiones fragmentados
    for(let col=0; col<8; col++) {
        for(let row=0; row<4; row++) {
            let colorIndex = (col + row + Math.floor(Math.random()*3)) % colors.length;
            let block = createNode('rect', {
                x: 80 + (col * 45), y: 100 + (row * 35),
                width: 40, height: 30, rx: 4,
                fill: colors[colorIndex],
                opacity: 0.2,
                style: `transition: opacity 0.3s; animation: flash-block ${Math.random()*2+1}s infinite ${Math.random()}s`
            });
            g.appendChild(block);
        }
    }
    
    // Inyectar keyframes para el destello si no existe
    if(!document.getElementById('keyframes-ofdma')) {
        const style = document.createElement('style');
        style.id = 'keyframes-ofdma';
        style.innerHTML = `@keyframes flash-block { 0%, 100% {opacity: 0.2;} 50% {opacity: 1; filter: brightness(1.5); box-shadow: 0 0 10px currentColor;} }`;
        document.head.appendChild(style);
    }
}

function renderBSS() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    
    const centers = [{x: 150, y: 150, c: '#00f0ff'}, {x: 350, y: 150, c: '#ffd700'}, {x: 250, y: 240, c: '#ff0055'}];
    
    centers.forEach(c => {
        // Área de cobertura de la celda
        g.appendChild(createNode('circle', {
            cx: c.x, cy: c.y, r: 85,
            fill: c.c, opacity: 0.1,
            stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '5,5'
        }));
        // Router Central
        g.appendChild(createNode('circle', {cx: c.x, cy: c.y, r: 8, fill: c.c}));
        
        // Animación de choque/ignorar interferencia en los bordes
        let blockWave = createNode('path', {
            d: `M ${c.x+35} ${c.y-35} L ${c.x+60} ${c.y-60} M ${c.x+60} ${c.y-35} L ${c.x+35} ${c.y-60}`,
            stroke: '#fff', 'stroke-width': 3,
            style: `animation: flash-block 2s infinite ${Math.random()}s`
        });
        g.appendChild(blockWave);
    });
}

function renderTWT() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    // Eje de tiempo base
    g.appendChild(createNode('line', {x1: 40, y1: 200, x2: 460, y2: 200, stroke: '#94a3b8', 'stroke-width': 2}));
    
    for(let i=0; i<4; i++) {
        // Estado de Sueño Profundo (Línea baja)
        g.appendChild(createNode('rect', {x: 40 + (i*105), y: 195, width: 85, height: 10, fill: '#334155', rx: 2}));
        
        // Transmisión Programada (Pico)
        g.appendChild(createNode('rect', {
            x: 125 + (i*105), y: 120, width: 15, height: 80, fill: '#00f0ff', rx: 3,
            style: `animation: pulse-wave 2.5s infinite ${i*0.6}s`
        }));
        
        // Icono de Batería indicando ahorro
        let batX = 118 + (i*105);
        g.appendChild(createNode('rect', {x: batX, y: 80, width: 28, height: 14, rx: 2, fill: 'none', stroke: '#ffd700', 'stroke-width': 2}));
        g.appendChild(createNode('rect', {x: batX + 28, y: 83, width: 2, height: 8, fill: '#ffd700'})); // Punta
        g.appendChild(createNode('rect', {x: batX + 2, y: 82, width: 24, height: 10, fill: '#ffd700'})); // Carga
    }
}
