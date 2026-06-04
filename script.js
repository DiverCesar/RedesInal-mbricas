/**
 * ==========================================================================
 * JARVIS HOLOGRAPHIC ENGINE v3.1 - IEEE 802.11 PRESENTATION
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
    console.log("JARVIS: All systems green. Ready, Sir.");
});

/* ==========================================================================
   1. CONTROLADOR MAESTRO
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
}

/* ==========================================================================
   2. SUB-NAVEGACIÓN Y TÍTULOS LIMPIOS
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentSection = this.closest('section');
            if(!parentSection) return;
            
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            parentSection.querySelectorAll('.svg-container').forEach(svg => svg.classList.remove('active'));
            
            const targetId = this.getAttribute('data-target');
            const targetSvg = document.getElementById(targetId);
            
            if(targetSvg) {
                targetSvg.classList.add('active');
                const hudSubtitle = parentSection.querySelector('.hud-subtitle');
                if(hudSubtitle) {
                    // SE ELIMINÓ LA PALABRA "DETECTADO". AHORA ES TOTALMENTE PROFESIONAL.
                    typeWriterEffect(hudSubtitle, this.innerText.toUpperCase());
                }
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
    }, 40);
}

/* ==========================================================================
   3. ESCÁNER HOLOGRÁFICO DE RATÓN (Tooltip Global Restaurado)
   ========================================================================== */
function initTooltipEngine() {
    const tooltip = document.getElementById('global-tech-tooltip');
    if(!tooltip) return;

    window.addEventListener('mousemove', (e) => {
        const targetTech = e.target.closest('[data-tech-tip]');
        
        if (targetTech) {
            let tipText = `<span style="color:#00f0ff;">[ANÁLISIS]:</span><br><br>${targetTech.getAttribute('data-tech-tip')}`;
            tooltip.innerHTML = tipText;
            tooltip.classList.add('visible');
            
            let xOffset = 20;
            let yOffset = 20;
            let posX = e.clientX + xOffset;
            let posY = e.clientY + yOffset;
            
            const tooltipRect = tooltip.getBoundingClientRect();
            if (posX + tooltipRect.width > window.innerWidth) posX = e.clientX - tooltipRect.width - (xOffset / 2);
            if (posY + tooltipRect.height > window.innerHeight) posY = e.clientY - tooltipRect.height - (yOffset / 2);
            
            tooltip.style.left = `${posX}px`;
            tooltip.style.top = `${posY}px`;
        } else {
            tooltip.classList.remove('visible');
        }
    });
}

/* ==========================================================================
   4. EFECTO PARALLAX 3D
   ========================================================================== */
function initParallax3D() {
    window.addEventListener('mousemove', (e) => {
        const activePanels = document.querySelectorAll('.svg-container.active .3d-perspective');
        if(!activePanels.length) return;
        const xAxis = (window.innerWidth / 2 - e.clientX) / 60;
        const yAxis = (window.innerHeight / 2 - e.clientY) / 60;
        activePanels.forEach(panel => {
            panel.style.transform = `perspective(1000px) rotateY(${xAxis}deg) rotateX(${15 + yAxis}deg)`;
        });
    });
}

/* ==========================================================================
   5. MOTOR DE INYECCIÓN SVG (CON EL NUEVO TWT)
   ========================================================================== */
const SVG_NS = "http://www.w3.org/2000/svg";

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
    buildTWT_Redesigned(); // Llamamos al gráfico completamente nuevo
}

function buildCSMACA() {
    const g = document.querySelector('.csmaca-waves');
    if(!g) return;
    g.appendChild(createSVG('path', { d: 'M 120 230 L 250 70 L 380 230', fill: 'none', stroke: 'rgba(0,240,255,0.15)', 'stroke-width': 1, 'stroke-dasharray': '5 5' }));
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let scanWave = createSVG('circle', { cx: 380, cy: 230, r: 10, fill: 'none', stroke: 'rgba(148, 163, 184, 0.6)', 'stroke-width': 2, style: 'animation: pulse-wave 2s ease-out forwards;' });
        g.appendChild(scanWave);
        setTimeout(() => scanWave.remove(), 2000);
    }, 1500);
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let dataPacket = createSVG('circle', { cx: 120, cy: 230, r: 5, fill: '#00f0ff', filter: 'url(#glow-cyan)' });
        g.appendChild(dataPacket);
        let frame = 0;
        function animatePacket() {
            frame += 0.02;
            let x = 120 + (250 - 120) * frame;
            let y = 230 + (70 - 230) * frame;
            dataPacket.setAttribute('cx', x);
            dataPacket.setAttribute('cy', y);
            if(frame < 1) requestAnimationFrame(animatePacket);
            else {
                dataPacket.remove();
                let ackWave = createSVG('circle', { cx: 250, cy: 70, r: 20, fill: 'none', stroke: '#00f0ff', 'stroke-width': 3, style: 'animation: pulse-wave 1s ease-out forwards;' });
                g.appendChild(ackWave);
                setTimeout(() => ackWave.remove(), 1000);
            }
        }
        animatePacket();
    }, 3000);
}

function buildOscilloscopes() {
    const svg24 = document.querySelector('#vis-80211b svg');
    if(svg24) startOscilloscope(svg24, '#00f0ff', 45, 60, 0.04);
    const svg5 = document.querySelector('#vis-80211a svg');
    if(svg5) startOscilloscope(svg5, '#ffd700', 18, 35, 0.12);
    const svgG = document.querySelector('#vis-80211g svg');
    if(svgG) {
        startOscilloscope(svgG, '#00f0ff', 45, 60, 0.04, 0); 
        startOscilloscope(svgG, '#ffd700', 20, 25, 0.08, 15);
    }
}

function startOscilloscope(svg, color, frequency, amplitude, speed, offset=0) {
    const path = createSVG('path', { fill: 'none', stroke: color, 'stroke-width': 2.5, style: `opacity: 0.8; filter: drop-shadow(0 0 8px ${color}); pointer-events: none;` });
    svg.insertBefore(path, svg.querySelector('.wave-interactive-points') || svg.firstChild);
    let frame = 0;
    function animateWave() {
        frame += speed;
        let d = `M 0 ${150 + offset} `;
        for(let x = 0; x <= 500; x += 5) d += `L ${x} ${150 + offset + Math.sin((x / frequency) + frame) * amplitude} `;
        path.setAttribute('d', d);
        requestAnimationFrame(animateWave);
    }
    animateWave();
}

function buildMIMOMatrix() {
    const g = document.querySelector('.mimo-paths');
    if(!g) return;
    for(let i=0; i<6; i++) {
        let p = createSVG('path', {
            d: `M 65 ${95 + Math.random()*100} Q ${250 + Math.random()*200 - 100} ${Math.random()*350 - 25} 435 ${95 + Math.random()*100}`,
            fill: 'none', stroke: i%2===0 ? '#00f0ff' : '#ffd700', 'stroke-width': 1.5,
            'stroke-dasharray': '10 8', style: `opacity: 0.6; animation: dash-flow ${1.5 + Math.random()}s linear infinite; pointer-events: none;`
        });
        g.appendChild(p);
    }
}

function buildMUMIMO() {
    const g = document.querySelector('.mu-streams');
    if(!g) return;
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#00ffaa'];
    const targets = [{x: 400, y: 70, type: "Smartphone_User_1"}, {x: 400, y: 120, type: "SmartTV_User_2"}, {x: 400, y: 170, type: "Laptop_User_3"}, {x: 400, y: 220, type: "Tablet_User_4"}];
    targets.forEach((t, index) => {
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Cliente: ${t.type} | Stream espacial dedicado operando simultáneamente.`});
        node.appendChild(createSVG('use', {href: '#icon-laptop', x: t.x, y: t.y}));
        node.appendChild(createSVG('text', {x: t.x + 35, y: t.y + 5, class: 'svg-tech-label', fill: colors[index], style: 'text-anchor: start;'}).appendChild(document.createTextNode(`STR_${index+1}`)).parentNode);
        g.appendChild(node);
        g.appendChild(createSVG('path', {
            d: `M 80 150 C 200 150, 250 ${t.y}, ${t.x - 20} ${t.y}`, fill: 'none', stroke: colors[index], 'stroke-width': 3,
            style: `opacity: 0.8; filter: drop-shadow(0 0 8px ${colors[index]}); stroke-dasharray: 15 10; animation: dash-flow 0.8s linear infinite reverse; pointer-events:none;`
        }));
    });
}

function buildBeamforming() {
    const g = document.querySelector('.beam-waves');
    if(!g) return;
    let cone = createSVG('path', { d: 'M 100 150 L 400 100 L 400 180 Z', fill: 'url(#beam-gradient)', opacity: 0.6, style: 'transform-origin: 100px 150px; pointer-events: none;' });
    let defs = createSVG('defs', {});
    let grad = createSVG('linearGradient', {id: 'beam-gradient', x1: '0%', y1: '0%', x2: '100%', y2: '0%'});
    grad.appendChild(createSVG('stop', {offset: '0%', 'stop-color': 'rgba(0,240,255,0.9)'}));
    grad.appendChild(createSVG('stop', {offset: '100%', 'stop-color': 'rgba(0,240,255,0)'}));
    defs.appendChild(grad);
    g.appendChild(defs);
    g.appendChild(cone);
    let angle = 0;
    setInterval(() => {
        if(!document.querySelector('#vis-beamforming').classList.contains('active')) return;
        angle = Math.sin(Date.now() / 600) * 15;
        cone.style.transform = `rotate(${angle}deg)`;
    }, 50);
}

function buildOFDMAGrid() {
    const g = document.querySelector('.ofdma-blocks');
    if(!g) return;
    const colors = ['#00f0ff', '#ffd700', '#ff0055', '#94a3b8'];
    const users = ['Usuario_A (Video Alta Demanda)', 'Usuario_B (Navegación Web)', 'Usuario_C (Telemetría IoT)', 'Espectro Libre (Sin Asignar)'];
    for(let col=0; col<8; col++) {
        for(let row=0; row<4; row++) {
            let rnd = Math.floor(Math.random() * colors.length);
            let block = createSVG('rect', {
                x: 55 + (col * 49), y: 85 + (row * 36), width: 45, height: 32, rx: 4, fill: colors[rnd], class: 'interactive-node',
                'data-tech-tip': `Resource Unit (RU).<br>Estado: Asignado a ${users[rnd]}.<br>Técnica OFDMA empacando datos para reducir latencia global.`,
                style: `transition: all 0.5s; opacity: 0.3; cursor: crosshair;`
            });
            g.appendChild(block);
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

function buildBSSColoring() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    const cells = [{x: 130, y: 150, c: '#00f0ff', id: 'BSS_Color_42'}, {x: 370, y: 150, c: '#ffd700', id: 'BSS_Color_12'}, {x: 250, y: 250, c: '#ff0055', id: 'BSS_Color_55'}];
    cells.forEach(c => {
        let node = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Identificador de Red: ${c.id}.<br>Mecanismo: Reutilización Espacial Agresiva.<br>Las estaciones ignorarán tramas de otros colores, permitiendo transmitir simultáneamente.`});
        node.appendChild(createSVG('circle', { cx: c.x, cy: c.y, r: 90, fill: c.c, opacity: 0.1, stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '8 8', style: `animation: pulse-wave 5s infinite linear; pointer-events: none;` }));
        node.appendChild(createSVG('use', {href: '#icon-router', x: c.x, y: c.y, transform: `scale(0.8) translate(${-c.x*0.2}, ${-c.y*0.2})`}));
        node.appendChild(createSVG('text', {x: c.x, y: c.y - 20, class: 'svg-tech-label'}).appendChild(document.createTextNode(c.id)).parentNode);
        g.appendChild(node);
    });
}

/* --- ESCENA 8: TARGET WAKE TIME (COMPLETAMENTE REDISEÑADO) --- */
function buildTWT_Redesigned() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    // 1. DIBUJAR SENSOR IOT (Izquierda)
    let sensorGroup = createSVG('g', {transform: 'translate(30, 80)'});
    sensorGroup.appendChild(createSVG('rect', {x:0, y:0, width:40, height:60, rx:5, fill:'#0f172a', stroke:'#00f0ff', 'stroke-width':2}));
    sensorGroup.appendChild(createSVG('circle', {cx:20, cy:20, r:8, fill:'#00f0ff', filter:'url(#glow-cyan)'}));
    sensorGroup.appendChild(createSVG('line', {x1:20, y1:40, x2:20, y2:50, stroke:'#00f0ff', 'stroke-width':2}));
    sensorGroup.appendChild(createSVG('line', {x1:10, y1:45, x2:30, y2:45, stroke:'#00f0ff', 'stroke-width':2}));
    sensorGroup.appendChild(createSVG('text', {x:20, y:80, class:'svg-tech-label'}).appendChild(document.createTextNode('IoT SENSOR')).parentNode);
    g.appendChild(sensorGroup);

    // 2. DIBUJAR PUNTO DE ACCESO (Derecha)
    let apGroup = createSVG('g', {transform: 'translate(430, 80)'});
    apGroup.appendChild(createSVG('use', {href:'#icon-router', x:20, y:30, transform:'scale(1.2) translate(-15, -15)'}));
    apGroup.appendChild(createSVG('text', {x:20, y:80, class:'svg-tech-label'}).appendChild(document.createTextNode('AP (TWT)')).parentNode);
    g.appendChild(apGroup);

    // 3. DIBUJAR LÍNEA DE TIEMPO LATIDOS
    g.appendChild(createSVG('line', {x1: 80, y1: 220, x2: 420, y2: 220, stroke: 'rgba(0,240,255,0.3)', 'stroke-width': 2}));
    g.appendChild(createSVG('text', {x: 250, y: 260, class:'svg-tech-label', fill:'#94a3b8'}).appendChild(document.createTextNode('TIEMPO: Sincronización de Milisegundos')).parentNode);

    // 4. CICLOS DE SUEÑO Y TRANSMISIÓN
    for(let i=0; i<3; i++) {
        // Bloque de Sueño Profundo
        let sleepNode = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Fase TWT Negociada.<br>Estado: SLEEP (Ahorro Energético).<br>El radio Wi-Fi se apaga por completo hasta el milisegundo exacto acordado.`});
        sleepNode.appendChild(createSVG('rect', {x: 90 + (i*110), y: 216, width: 95, height: 8, fill: '#1e293b', rx: 2, stroke:'#94a3b8', 'stroke-width':0.5}));
        g.appendChild(sleepNode);

        // Pico Activo de Transmisión
        let activeNode = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Fase TWT Negociada.<br>Estado: WAKE / TX (Transmisión).<br>Intercambio de datos ultrarrápido y vuelta a dormir sin generar colisiones en el canal.`});
        activeNode.appendChild(createSVG('rect', {
            x: 185 + (i*110), y: 140, width: 12, height: 80, fill: '#00f0ff', rx: 2,
            style: `opacity: 0.9; filter: drop-shadow(0 0 10px #00f0ff); animation: pulse-wave 3s infinite ${i*0.8}s; pointer-events: none;`
        }));
        
        // Rayo de conexión desde el pico al AP
        activeNode.appendChild(createSVG('path', {
            d: `M ${190 + (i*110)} 140 Q 300 90 420 110`,
            fill: 'none', stroke: '#ffd700', 'stroke-width': 2, 'stroke-dasharray': '5 5',
            style: `opacity:0.6; animation: dash-flow 1s linear infinite reverse; pointer-events:none;`
        }));
        
        g.appendChild(activeNode);
    }

    // 5. BATERÍA GIGANTE INDICADORA
    let batGroup = createSVG('g', {transform: 'translate(200, 30)', class:'interactive-node', 'data-tech-tip':'Impacto directo de TWT:<br>Extiende la vida útil de las baterías de dispositivos IoT hasta 7 veces en comparación con estándares anteriores (802.11ac/n).'});
    batGroup.appendChild(createSVG('rect', {x:0, y:0, width:100, height:35, rx:5, fill:'rgba(15,23,42,0.8)', stroke:'#ffd700', 'stroke-width':2}));
    batGroup.appendChild(createSVG('rect', {x:102, y:10, width:6, height:15, rx:2, fill:'#ffd700'}));
    // Batería Latiendo
    batGroup.appendChild(createSVG('rect', {x:4, y:4, width:92, height:27, rx:2, fill:'#ffd700', style:'animation: pulse-wave 4s infinite alternate;'}));
    
    // Texto sobre batería
    let batText = createSVG('text', {x:50, y:23, fill:'#000', 'font-weight':'900', 'font-family':'JetBrains Mono', 'font-size':'14px', 'text-anchor':'middle'});
    batText.appendChild(document.createTextNode('7x BATTERY LIFE'));
    batGroup.appendChild(batText);
    
    g.appendChild(batGroup);
}
