/**
 * ==========================================================================
 * JARVIS HOLOGRAPHIC ENGINE v3.0 - IEEE 802.11 PRESENTATION
 * PROTOCOL: ACTIVE & STABLE
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("JARVIS: Booting Holographic Presentation Engine...");
    initNavigation();
    initSubNavigation();
    initTooltipEngine();
    initVisualEngine();
    initParallax3D();
    console.log("JARVIS: All systems green. No syntax errors detected. Ready, Sir.");
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

    // Soporte impecable para Presentadores Láser y Teclado
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
    
    // Transición de salida
    slides[currentSlide].classList.remove('active');
    if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    // Transición de entrada
    slides[currentSlide].classList.add('active');
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

/* ==========================================================================
   2. SUB-NAVEGACIÓN (Paneles Holográficos Internos)
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentSection = this.closest('section');
            if(!parentSection) return;
            
            // Actualizar estado de los botones
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apagar SVGs actuales
            parentSection.querySelectorAll('.svg-container').forEach(svg => svg.classList.remove('active'));
            
            // Encender SVG destino
            const targetId = this.getAttribute('data-target');
            const targetSvg = document.getElementById(targetId);
            
            if(targetSvg) {
                targetSvg.classList.add('active');
                
                // Actualizar el HUD dinámicamente si existe
                const hudSubtitle = parentSection.querySelector('.hud-subtitle');
                if(hudSubtitle) {
                    typeWriterEffect(hudSubtitle, this.innerText.toUpperCase());
                }
            }
        });
    });
}

// Efecto de máquina de escribir futurista
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
    }, 40);
}

/* ==========================================================================
   3. ESCÁNER HOLOGRÁFICO DE RATÓN (Global Tooltip Inteligente)
   ========================================================================== */
function initTooltipEngine() {
    const tooltip = document.getElementById('global-tech-tooltip');
    if(!tooltip) return;

    // Usamos mousemove en el window para garantizar que nunca se congele
    window.addEventListener('mousemove', (e) => {
        // Busca cualquier elemento o ancestro que tenga el atributo data-tech-tip o data-tooltip
        const targetTech = e.target.closest('[data-tech-tip]');
        const targetStat = e.target.closest('[data-tooltip]');
        
        let tipText = "";
        
        if (targetTech) {
            tipText = `<span style="color:#00f0ff;">[ANÁLISIS ESTRUCTURAL]:</span><br><br>${targetTech.getAttribute('data-tech-tip')}`;
        } else if (targetStat) {
            tipText = `<span style="color:#ffd700;">[DATOS TÉCNICOS]:</span><br><br>${targetStat.getAttribute('data-tooltip')}`;
        }
        
        if (tipText !== "") {
            tooltip.innerHTML = tipText;
            tooltip.classList.add('visible');
            
            // Lógica avanzada de colisión con los bordes de la pantalla
            let xOffset = 20;
            let yOffset = 20;
            let posX = e.clientX + xOffset;
            let posY = e.clientY + yOffset;
            
            const tooltipRect = tooltip.getBoundingClientRect();
            
            // Si choca con el borde derecho, voltear a la izquierda
            if (posX + tooltipRect.width > window.innerWidth) {
                posX = e.clientX - tooltipRect.width - (xOffset / 2);
            }
            // Si choca con el borde inferior, subir
            if (posY + tooltipRect.height > window.innerHeight) {
                posY = e.clientY - tooltipRect.height - (yOffset / 2);
            }
            
            // Aplicar coordenadas
            tooltip.style.left = `${posX}px`;
            tooltip.style.top = `${posY}px`;
        } else {
            // Ocultar suavemente
            tooltip.classList.remove('visible');
        }
    });
}

/* ==========================================================================
   4. EFECTO PARALLAX 3D PARA REDES
   ========================================================================== */
function initParallax3D() {
    window.addEventListener('mousemove', (e) => {
        const activePanels = document.querySelectorAll('.svg-container.active .3d-perspective');
        if(!activePanels.length) return;

        // Cálculos matemáticos suaves basados en el centro de la pantalla
        const xAxis = (window.innerWidth / 2 - e.clientX) / 60;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 60;

        activePanels.forEach(panel => {
            panel.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${15 + yAxis}deg)`;
        });
    });
}

/* ==========================================================================
   5. MOTOR DE INYECCIÓN Y RENDERIZADO SVG (THE HEAVY LIFTING)
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

// Utilidad para construir nodos SVG
function createSVG(tag, attrs) {
    const el = document.createElementNS(SVG_NS, tag);
    for (let k in attrs) {
        if(k === 'href') el.setAttributeNS("http://www.w3.org/1999/xlink", "href", attrs[k]);
        else el.setAttribute(k, attrs[k]);
    }
    return el;
}

function initVisualEngine() {
    buildCSMACA();
    buildOscilloscopes();
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

    // Malla invisible entre nodos
    g.appendChild(createSVG('path', {
        d: 'M 120 230 L 250 70 L 380 230',
        fill: 'none', stroke: 'rgba(0,240,255,0.15)', 'stroke-width': 1, 'stroke-dasharray': '5 5'
    }));

    // Señales de radar constantes desde la STA 2 escaneando el medio
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let scanWave = createSVG('circle', {
            cx: 380, cy: 230, r: 10,
            fill: 'none', stroke: 'rgba(148, 163, 184, 0.6)', 'stroke-width': 2,
            style: 'animation: pulse-wave 2s ease-out forwards;'
        });
        g.appendChild(scanWave);
        setTimeout(() => scanWave.remove(), 2000);
    }, 1500);

    // Trama de Datos desde STA 1 a AP
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let dataPacket = createSVG('circle', {
            cx: 120, cy: 230, r: 5, fill: '#00f0ff', filter: 'url(#glow-cyan)'
        });
        g.appendChild(dataPacket);
        
        let frame = 0;
        function animatePacket() {
            frame += 0.02; // Velocidad
            let x = 120 + (250 - 120) * frame;
            let y = 230 + (70 - 230) * frame;
            dataPacket.setAttribute('cx', x);
            dataPacket.setAttribute('cy', y);
            
            if(frame < 1) {
                requestAnimationFrame(animatePacket);
            } else {
                dataPacket.remove();
                // Simular ACK del AP
                let ackWave = createSVG('circle', {
                    cx: 250, cy: 70, r: 20, fill: 'none', stroke: '#00f0ff', 'stroke-width': 3,
                    style: 'animation: pulse-wave 1s ease-out forwards;'
                });
                g.appendChild(ackWave);
                setTimeout(() => ackWave.remove(), 1000);
            }
        }
        animatePacket();
    }, 3000);
}

/* --- ESCENA 2: Osciloscopios (Ondas de Frecuencia Puras) --- */
function buildOscilloscopes() {
    const svg24 = document.querySelector('#vis-80211b svg');
    if(svg24) startOscilloscope(svg24, '#00f0ff', 45, 60, 0.04);

    const svg5 = document.querySelector('#vis-80211a svg');
    if(svg5) startOscilloscope(svg5, '#ffd700', 18, 35, 0.12);

    const svgG = document.querySelector('#vis-80211g svg');
    if(svgG) {
        startOscilloscope(svgG, '#00f0ff', 45, 60, 0.04, 0); // Onda portadora
        startOscilloscope(svgG, '#ffd700', 20, 25, 0.08, 15); // Onda superpuesta OFDM
    }
}

function startOscilloscope(svg, color, frequency, amplitude, speed, offset=0) {
    const path = createSVG('path', {
        fill: 'none', stroke: color, 'stroke-width': 2.5,
        style: `opacity: 0.8; filter: drop-shadow(0 0 8px ${color}); pointer-events: none;`
    });
    // Lo insertamos antes de los puntos interactivos para no bloquear el hover
    svg.insertBefore(path, svg.querySelector('.wave-interactive-points') || svg.firstChild);

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

/* --- ESCENA 3: Matriz MIMO 4x4 (Multi-Path) --- */
function buildMIMOMatrix() {
    const g = document.querySelector('.mimo-paths');
    if(!g) return;

    for(let i=0; i<6; i++) {
        let p = createSVG('path', {
            d: `M 65 ${95 + Math.random()*100} Q ${250 + Math.random()*200 - 100} ${Math.random()*350 - 25} 435 ${95 + Math.random()*100}`,
            fill: 'none', stroke: i%2===0 ? '#00f0ff' : '#ffd700', 'stroke-width': 1.5,
            'stroke-dasharray': '10 8',
            style: `opacity: 0.6; animation: dash-flow ${1.5 + Math.random()}s linear infinite; pointer-events: none;`
        });
        g.appendChild(p);
    }
}

/* --- ESCENA 4: MU-MIMO (Transmisión Simultánea) --- */
function buildMUMIMO() {
    const g = document.querySelector('.mu-streams');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#00ffaa'];
    const targets = [
        {x: 400, y: 70, type: "Smartphone_User_1"}, 
        {x: 400, y: 120, type: "SmartTV_User_2"}, 
        {x: 400, y: 170, type: "Laptop_User_3"}, 
        {x: 400, y: 220, type: "Tablet_User_4"}
    ];
    
    targets.forEach((t, index) => {
        // Dispositivo final interactivo insertando el icono de laptop dinámicamente
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Cliente: ${t.type} | Stream espacial dedicado operando simultáneamente.`});
        node.appendChild(createSVG('use', {href: '#icon-laptop', x: t.x, y: t.y}));
        node.appendChild(createSVG('text', {x: t.x + 35, y: t.y + 5, class: 'svg-tech-label', fill: colors[index], style: 'text-anchor: start;'}).appendChild(document.createTextNode(`STR_${index+1}`)).parentNode);
        g.appendChild(node);
        
        // Rutas de datos activas
        g.appendChild(createSVG('path', {
            d: `M 80 150 C 200 150, 250 ${t.y}, ${t.x - 20} ${t.y}`,
            fill: 'none', stroke: colors[index], 'stroke-width': 3,
            style: `opacity: 0.8; filter: drop-shadow(0 0 8px ${colors[index]}); stroke-dasharray: 15 10; animation: dash-flow 0.8s linear infinite reverse; pointer-events:none;`
        }));
    });
}

/* --- ESCENA 5: Beamforming (Direccionamiento) --- */
function buildBeamforming() {
    const g = document.querySelector('.beam-waves');
    if(!g) return;
    
    let cone = createSVG('path', {
        d: 'M 100 150 L 400 100 L 400 180 Z', // Forma del haz
        fill: 'url(#beam-gradient)', opacity: 0.6,
        style: 'transform-origin: 100px 150px; pointer-events: none;'
    });
    
    let defs = createSVG('defs', {});
    let grad = createSVG('linearGradient', {id: 'beam-gradient', x1: '0%', y1: '0%', x2: '100%', y2: '0%'});
    grad.appendChild(createSVG('stop', {offset: '0%', 'stop-color': 'rgba(0,240,255,0.9)'}));
    grad.appendChild(createSVG('stop', {offset: '100%', 'stop-color': 'rgba(0,240,255,0)'}));
    defs.appendChild(grad);
    g.appendChild(defs);
    g.appendChild(cone);

    // Oscilación suave del haz
    let angle = 0;
    setInterval(() => {
        if(!document.querySelector('#vis-beamforming').classList.contains('active')) return;
        angle = Math.sin(Date.now() / 600) * 15; // Oscila entre -15 y 15 grados
        cone.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

/* --- ESCENA 6: Matriz OFDMA (Resource Units) --- */
function buildOFDMAGrid() {
    const g = document.querySelector('.ofdma-blocks');
    if(!g) return;
    
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#94a3b8'];
    const users = ['Usuario_A (Alta Demanda)', 'Usuario_B (Navegación)', 'Usuario_C (IoT)', 'Espectro Libre'];

    for(let col=0; col<8; col++) {
        for(let row=0; row<4; row++) {
            let rnd = Math.floor(Math.random() * colors.length);
            
            let block = createSVG('rect', {
                x: 55 + (col * 49), y: 85 + (row * 36),
                width: 45, height: 32, rx: 4,
                fill: colors[rnd],
                class: 'interactive-node',
                'data-tech-tip': `Resource Unit (RU).<br>Estado: Asignado a ${users[rnd]}.<br>Técnica OFDMA empacando datos para reducir latencia global.`,
                style: `transition: all 0.5s; opacity: 0.3; cursor: crosshair;`
            });
            
            g.appendChild(block);

            // Modificación procedural para simular red en vivo
            setInterval(() => {
                if(!document.querySelector('#vis-ofdma').classList.contains('active')) return;
                if(Math.random() > 0.8) {
                    let newRnd = Math.floor(Math.random() * colors.length);
                    block.setAttribute('fill', colors[newRnd]);
                    block.setAttribute('data-tech-tip', `Resource Unit (RU).<br>Estado: Asignado a ${users[newRnd]}.`);
                    block.style.opacity = '0.9';
                    setTimeout(() => block.style.opacity = '0.3', 600);
                }
            }, 1000 + Math.random()*2500);
        }
    }
}

/* --- ESCENA 7: BSS Coloring (Superposición de Celdas) --- */
function buildBSSColoring() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    
    const cells = [
        {x: 130, y: 150, c: '#00f0ff', id: 'BSS_Color_42'}, 
        {x: 370, y: 150, c: '#ffd700', id: 'BSS_Color_12'}, 
        {x: 250, y: 250, c: '#ff0055', id: 'BSS_Color_55'}
    ];
    
    cells.forEach(c => {
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Identificador de Red: ${c.id}.<br>Mecanismo: Reutilización Espacial Agresiva.<br>Las estaciones ignorarán tramas de otros colores, permitiendo transmitir simultáneamente.`});
        
        // Área de cobertura con pulso
        node.appendChild(createSVG('circle', {
            cx: c.x, cy: c.y, r: 90,
            fill: c.c, opacity: 0.1, stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '8 8',
            style: `animation: pulse-wave 5s infinite linear; pointer-events: none;`
        }));
        
        // Router central
        node.appendChild(createSVG('use', {href: '#icon-router', x: c.x, y: c.y, transform: `scale(0.8) translate(${-c.x*0.2}, ${-c.y*0.2})`}));
        node.appendChild(createSVG('text', {x: c.x, y: c.y - 20, class: 'svg-tech-label'}).appendChild(document.createTextNode(c.id)).parentNode);
        
        g.appendChild(node);
    });
}

/* --- ESCENA 8: Target Wake Time (TWT) --- */
function buildTWT() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    // Eje X
    g.appendChild(createSVG('line', {x1: 40, y1: 220, x2: 460, y2: 220, stroke: 'rgba(255,255,255,0.3)', 'stroke-width': 2}));
    
    for(let i=0; i<4; i++) {
        let group = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Fase TWT.<br>Dispositivo en modo activo solo durante la ventana de transmisión.<br>Multiplica la vida de la batería en sensores.`});
        
        // Sleep Mode
        group.appendChild(createSVG('rect', {x: 40 + (i*105), y: 215, width: 90, height: 10, fill: '#1e293b', rx: 2}));
        
        // Active Peak
        group.appendChild(createSVG('rect', {
            x: 125 + (i*105), y: 120, width: 10, height: 100, fill: '#00f0ff', rx: 2,
            style: `opacity: 0.8; filter: drop-shadow(0 0 10px #00f0ff); animation: pulse-wave 3s infinite ${i*0.7}s; pointer-events: none;`
        }));
        
        g.appendChild(group);
    }
}
