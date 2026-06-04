/**
 * ==========================================================================
 * JARVIS HOLOGRAPHIC ENGINE v2.0 - IEEE 802.11 PRESENTATION
 * PROTOCOL: ACTIVE
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("JARVIS SYSTEM: Booting Presentation Engine...");
    initNavigation();
    initSubNavigation();
    initTooltipEngine();
    initVisualEngine();
    initParallax3D();
    console.log("JARVIS SYSTEM: All systems green. Ready for presentation, Sir.");
});

/* ==========================================================================
   1. CONTROLADOR MAESTRO DE DIAPOSITIVAS Y ESTADOS
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

    // Soporte total para Presentadores Láser y Teclado
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        }
        if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        }
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToSlide(index));
    });
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    slides[currentSlide].classList.remove('active');
    if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    slides[currentSlide].classList.add('active');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');

    // Reiniciar animaciones de la diapositiva actual para que siempre entren frescas
    triggerSlideAnimations(currentSlide);
}

function triggerSlideAnimations(index) {
    const activeSlide = slides[index];
    const tags = activeSlide.querySelectorAll('.tag, .main-title, .stat-value');
    tags.forEach(tag => {
        tag.style.opacity = '0';
        tag.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            tag.style.transition = 'all 0.5s ease-out';
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
        }, Math.random() * 300); // Cascada aleatoria
    });
}

/* ==========================================================================
   2. SUB-NAVEGACIÓN (Cambio de Gráficos Holográficos)
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentSection = this.closest('section');
            if(!parentSection) return;
            
            // Actualizar botones
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apagar SVGs y HUDs
            parentSection.querySelectorAll('.svg-container').forEach(svg => svg.classList.remove('active'));
            const hudSubtitle = parentSection.querySelector('.hud-subtitle');
            
            // Encender destino
            const targetId = this.getAttribute('data-target');
            const targetSvg = document.getElementById(targetId);
            
            if(targetSvg) {
                targetSvg.classList.add('active');
                // Actualizar el HUD dinámicamente con texto futurista
                if(hudSubtitle) typeWriterEffect(hudSubtitle, this.innerText + " DETECTADO");
            }
        });
    });
}

function typeWriterEffect(element, text) {
    element.innerHTML = '';
    let i = 0;
    let timer = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 30);
}

/* ==========================================================================
   3. TRACKER HOLOGRÁFICO DE RATÓN (Global Tooltip Inteligente)
   ========================================================================== */
function initTooltipEngine() {
    const tooltip = document.getElementById('global-tech-tooltip');
    if(!tooltip) return;

    document.addEventListener('mousemove', (e) => {
        // Busca si el ratón está sobre un elemento interactivo
        const target = e.target.closest('[data-tech-tip]');
        
        if (target) {
            const tipText = target.getAttribute('data-tech-tip');
            
            // Inyectar el texto
            tooltip.innerHTML = `<span style="color:#00f0ff;">[ANÁLISIS]:</span><br>${tipText}`;
            tooltip.classList.add('visible');
            
            // Lógica de colisión con los bordes de la pantalla (Para que no se salga)
            let xOffset = 20;
            let yOffset = 20;
            
            let posX = e.clientX + xOffset;
            let posY = e.clientY + yOffset;
            
            const tooltipRect = tooltip.getBoundingClientRect();
            
            if (posX + tooltipRect.width > window.innerWidth) {
                posX = e.clientX - tooltipRect.width - xOffset;
            }
            if (posY + tooltipRect.height > window.innerHeight) {
                posY = e.clientY - tooltipRect.height - yOffset;
            }
            
            // Mover el tooltip suavemente
            tooltip.style.left = `${posX}px`;
            tooltip.style.top = `${posY}px`;
            tooltip.style.transform = `scale(1)`;
        } else {
            // Ocultar si sale del elemento
            tooltip.classList.remove('visible');
            tooltip.style.transform = `scale(0.9)`;
        }
    });
}

/* ==========================================================================
   4. EFECTO PARALLAX 3D PARA SVGs
   ========================================================================== */
function initParallax3D() {
    document.addEventListener('mousemove', (e) => {
        const activePanels = document.querySelectorAll('.svg-container.active .3d-perspective');
        if(!activePanels.length) return;

        const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 50;

        activePanels.forEach(panel => {
            // Inclina el gráfico SVG hacia donde mire el ratón
            panel.style.transform = `perspective(800px) rotateY(${xAxis}deg) rotateX(${15 + yAxis}deg)`;
        });
    });
}

/* ==========================================================================
   5. MOTOR DE GENERACIÓN GEOMÉTRICA SVG (HARDCODE MATH ENGINE)
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

function createSVG(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

function initVisualEngine() {
    buildCSMACA();
    buildOscilloscopes(); // Reemplaza renderFrequencies
    buildMIMOMatrix();
    buildMUMIMO();
    buildBeamforming();
    buildOFDMAGrid();
    buildBSSColoring();
    buildTWT();
}

/* --- ESCENA 1: CSMA/CA Avanzado --- */
function buildCSMACA() {
    const g = document.querySelector('.csmaca-waves');
    if(!g) return;

    // Conexiones de red base (Malla invisible)
    g.appendChild(createSVG('path', {
        d: 'M 120 220 L 250 80 L 380 220',
        fill: 'none', stroke: 'rgba(255,255,255,0.1)', 'stroke-width': 1, 'stroke-dasharray': '5 5'
    }));

    // Simulación de colisiones evitadas (Ondas que chocan y desaparecen)
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        
        let wave = createSVG('circle', {
            cx: 120, cy: 220, r: 10,
            fill: 'none', stroke: '#ff0055', 'stroke-width': 2,
            style: 'animation: pulse-wave 1.5s ease-out forwards;'
        });
        g.appendChild(wave);
        setTimeout(() => wave.remove(), 1500);
    }, 2000);
}

/* --- ESCENA 2: Osciloscopios (Las Ondas Animadas) --- */
function buildOscilloscopes() {
    // 2.4 GHz Lenta
    const svg24 = document.querySelector('#vis-80211b svg');
    if(svg24) startOscilloscope(svg24, '#00f0ff', 50, 70, 0.05);

    // 5 GHz Rápida
    const svg5 = document.querySelector('#vis-80211a svg');
    if(svg5) startOscilloscope(svg5, '#ffd700', 20, 40, 0.15);

    // Híbrida
    const svgG = document.querySelector('#vis-80211g svg');
    if(svgG) {
        startOscilloscope(svgG, '#00f0ff', 50, 70, 0.05, 0);
        startOscilloscope(svgG, '#ffd700', 25, 30, 0.1, 20); // Subportadora
    }
}

function startOscilloscope(svg, color, frequency, amplitude, speed, offset=0) {
    const path = createSVG('path', {
        fill: 'none', stroke: color, 'stroke-width': 3,
        style: `opacity: 0.8; filter: drop-shadow(0 0 10px ${color});`
    });
    // Insertamos antes de los puntos interactivos
    svg.insertBefore(path, svg.firstChild);

    let frame = 0;
    function animateWave() {
        frame += speed;
        let d = `M 0 ${150 + offset} `;
        for(let x = 0; x <= 500; x += 5) {
            let y = 150 + offset + Math.sin((x / frequency) + frame) * amplitude;
            d += `L ${x} ${y} `;
        }
        path.setAttribute('d', d);
        requestAnimationFrame(animateWave);
    }
    animateWave();
}

/* --- ESCENA 3: Matriz MIMO 4x4 (Multi-Path Dinámico) --- */
function buildMIMOMatrix() {
    const g = document.querySelector('.mimo-paths');
    if(!g) return;

    // Crear 8 rutas caóticas simulando rebotes en paredes invisibles
    for(let i=0; i<8; i++) {
        let p = createSVG('path', {
            d: `M 70 ${100 + Math.random()*100} Q ${250 + Math.random()*200 - 100} ${Math.random()*400 - 50} 430 ${100 + Math.random()*100}`,
            fill: 'none', stroke: i%2===0 ? '#00f0ff' : '#ffd700', 'stroke-width': 1.5,
            'stroke-dasharray': '8 6',
            style: `opacity: 0.6; animation: dash-flow ${1 + Math.random()}s linear infinite; filter: drop-shadow(0 0 5px currentColor);`
        });
        g.appendChild(p);
    }
}

/* --- ESCENA 4: MU-MIMO --- */
function buildMUMIMO() {
    const g = document.querySelector('.mu-streams');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#00ffaa'];
    const targets = [
        {x: 400, y: 60, type: "Smartphone"}, 
        {x: 400, y: 120, type: "Smart TV 4K"}, 
        {x: 400, y: 180, type: "Laptop"}, 
        {x: 400, y: 240, type: "IoT Sensor"}
    ];
    
    targets.forEach((t, index) => {
        // Dispositivo interactivo
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Target: ${t.type} | Stream dedicado sin espera.`});
        node.appendChild(createSVG('circle', {cx: t.x, cy: t.y, r: 12, fill: colors[index]}));
        node.appendChild(createSVG('text', {x: t.x + 20, y: t.y + 4, class: 'svg-tech-label', style: 'text-anchor: start;'}).appendChild(document.createTextNode(`STR_${index}`)).parentNode);
        g.appendChild(node);
        
        // Rayo Láser de Datos
        g.appendChild(createSVG('path', {
            d: `M 70 150 C 200 150, 250 ${t.y}, ${t.x - 15} ${t.y}`,
            fill: 'none', stroke: colors[index], 'stroke-width': 4,
            style: `opacity: 0.7; filter: drop-shadow(0 0 8px ${colors[index]}); stroke-dasharray: 20 10; animation: dash-flow 0.8s linear infinite reverse;`
        }));
    });
}

/* --- ESCENA 5: Beamforming (Haz concentrado) --- */
function buildBeamforming() {
    const g = document.querySelector('.beam-waves');
    if(!g) return;
    
    let cone = createSVG('path', {
        d: 'M 250 150 L 450 0 L 450 300 Z', // Cono hacia la derecha
        fill: 'url(#beam-gradient)', opacity: 0.5,
        style: 'transform-origin: 250px 150px;'
    });
    
    let defs = createSVG('defs', {});
    let grad = createSVG('radialGradient', {id: 'beam-gradient', cx: '0%', cy: '50%', r: '100%'});
    grad.appendChild(createSVG('stop', {offset: '0%', 'stop-color': 'rgba(0,240,255,0.9)'}));
    grad.appendChild(createSVG('stop', {offset: '100%', 'stop-color': 'rgba(0,240,255,0)'}));
    defs.appendChild(grad);
    g.appendChild(defs);
    g.appendChild(cone);

    // Rotar el cono simulando búsqueda del AP
    let angle = 0;
    setInterval(() => {
        if(!document.querySelector('#vis-beamforming').classList.contains('active')) return;
        angle = Math.sin(Date.now() / 500) * 30; // Oscila entre -30 y 30 grados
        cone.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

/* --- ESCENA 6: Matriz OFDMA (Resource Units) --- */
function buildOFDMAGrid() {
    const g = document.querySelector('.ofdma-blocks');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#94a3b8'];
    const users = ['User_A (Video)', 'User_B (Web)', 'User_C (IoT)', 'Unused'];

    for(let col=0; col<8; col++) {
        for(let row=0; row<4; row++) {
            let rnd = Math.floor(Math.random() * colors.length);
            
            // Bloque interactivo individual
            let block = createSVG('rect', {
                x: 55 + (col * 49), y: 85 + (row * 36),
                width: 45, height: 32, rx: 4,
                fill: colors[rnd],
                class: 'interactive-node',
                'data-tech-tip': `Resource Unit (RU) asignada a: ${users[rnd]} | OFDMA minimiza latencia empaquetando datos juntos.`,
                style: `transition: all 0.5s; opacity: 0.3;`
            });
            
            g.appendChild(block);

            // Cambiar colores aleatoriamente para simular tráfico de red
            setInterval(() => {
                if(!document.querySelector('#vis-ofdma').classList.contains('active')) return;
                if(Math.random() > 0.7) {
                    let newRnd = Math.floor(Math.random() * colors.length);
                    block.setAttribute('fill', colors[newRnd]);
                    block.setAttribute('data-tech-tip', `Resource Unit (RU) asignada a: ${users[newRnd]}`);
                    block.style.opacity = '0.8';
                    setTimeout(() => block.style.opacity = '0.3', 500);
                }
            }, 1000 + Math.random()*2000);
        }
    }
}

/* --- ESCENA 7: BSS Coloring (Interferencia Evitada) --- */
function buildBSSColoring() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    
    const cells = [
        {x: 130, y: 150, c: '#00f0ff', id: 'BSS_Color_42'}, 
        {x: 370, y: 150, c: '#ffd700', id: 'BSS_Color_12'}, 
        {x: 250, y: 250, c: '#ff0055', id: 'BSS_Color_55'}
    ];
    
    cells.forEach(c => {
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Red Identificada como: ${c.id}. El dispositivo ignorará tramas de otros colores si la señal es baja.`});
        
        node.appendChild(createSVG('circle', {
            cx: c.x, cy: c.y, r: 90,
            fill: c.c, opacity: 0.1, stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '10,10',
            style: `animation: pulse-wave 4s infinite linear;`
        }));
        
        node.appendChild(createSVG('circle', {cx: c.x, cy: c.y, r: 8, fill: '#fff'}));
        node.appendChild(createSVG('text', {x: c.x, y: c.y - 15, class: 'svg-tech-label'}).appendChild(document.createTextNode(c.id)).parentNode);
        
        g.appendChild(node);
    });
}

/* --- ESCENA 8: TWT (Target Wake Time) --- */
function buildTWT() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    // Eje X (Tiempo)
    g.appendChild(createSVG('line', {x1: 40, y1: 200, x2: 460, y2: 200, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 2}));
    
    for(let i=0; i<4; i++) {
        let group = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Target Wake Time (TWT): Radio encendido solo por 10ms. Ahorro de energía crítico para sensores.`});
        
        // Bloque de sueño (Largo y bajo)
        group.appendChild(createSVG('rect', {x: 40 + (i*105), y: 195, width: 90, height: 10, fill: '#1e293b', rx: 2}));
        
        // Pico de Actividad
        group.appendChild(createSVG('rect', {
            x: 125 + (i*105), y: 100, width: 10, height: 100, fill: '#00f0ff', rx: 3,
            style: `opacity: 0.8; filter: drop-shadow(0 0 10px #00f0ff); animation: pulse-wave 3s infinite ${i*0.7}s;`
        }));
        
        g.appendChild(group);
    }
}
