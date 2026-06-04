/**
 * ==========================================================================
 * JARVIS HOLOGRAPHIC ENGINE v3.3 - HOTFIX DEFINITIVO
 * PROTOCOL: ACTIVE & ISOLATED
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSubNavigation();
    initTooltipEngine();
    initVisualEngine();
    initParallax3D();
});

/* ==========================================================================
   1. CONTROLADOR MAESTRO Y BLOQUEO DE CAPAS INVISIBLES
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
    
    // Inicializar el estado de bloqueo en todas las diapositivas
    slides.forEach((s, index) => {
        if(index !== currentSlide) s.style.pointerEvents = 'none';
    });
}

function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Apagar la actual y bloquear su interacción
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].style.pointerEvents = 'none';
    if(dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    // Encender la nueva y habilitar su interacción
    slides[currentSlide].classList.add('active');
    slides[currentSlide].style.pointerEvents = 'auto';
    if(dots[currentSlide]) dots[currentSlide].classList.add('active');
}

/* ==========================================================================
   2. SUB-NAVEGACIÓN CON BLOQUEO DE INTERFERENCIAS
   ========================================================================== */
function initSubNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    // Inicializar bloqueo en todos los SVGs ocultos para que no roben el ratón
    document.querySelectorAll('.svg-container').forEach(svg => {
        if(!svg.classList.contains('active')) svg.style.pointerEvents = 'none';
    });
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const parentSection = this.closest('section');
            if(!parentSection) return;
            
            parentSection.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Apagar y bloquear TODOS los SVGs de esta sección
            parentSection.querySelectorAll('.svg-container').forEach(svg => {
                svg.classList.remove('active');
                svg.style.pointerEvents = 'none';
            });
            
            // Encender y desbloquear SOLO el SVG objetivo
            const targetId = this.getAttribute('data-target');
            const targetSvg = document.getElementById(targetId);
            
            if(targetSvg) {
                targetSvg.classList.add('active');
                targetSvg.style.pointerEvents = 'auto';
                
                const hudSubtitle = parentSection.querySelector('.hud-subtitle');
                if(hudSubtitle) {
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
   3. ESCÁNER HOLOGRÁFICO DE RATÓN (Tooltip Global)
   ========================================================================== */
function initTooltipEngine() {
    const tooltip = document.getElementById('global-tech-tooltip');
    if(!tooltip) return;

    window.addEventListener('mousemove', (e) => {
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
   5. MOTOR DE INYECCIÓN SVG
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
    buildTWT();
}

/* --- ESCENAS PIONEROS --- */
function buildCSMACA() {
    const g = document.querySelector('.csmaca-waves');
    if(!g) return;
    g.appendChild(createSVG('path', { d: 'M 120 230 L 250 70 L 380 230', fill: 'none', stroke: 'rgba(0,240,255,0.15)', 'stroke-width': 1, 'stroke-dasharray': '5 5' }));
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let scanWave = createSVG('circle', { cx: 380, cy: 230, r: 10, fill: 'none', stroke: 'rgba(148, 163, 184, 0.6)', 'stroke-width': 2, style: 'animation: pulse-wave 2s ease-out forwards; pointer-events: none;' });
        g.appendChild(scanWave);
        setTimeout(() => scanWave.remove(), 2000);
    }, 1500);
    setInterval(() => {
        if(!document.querySelector('#vis-csmaca').classList.contains('active')) return;
        let dataPacket = createSVG('circle', { cx: 120, cy: 230, r: 5, fill: '#00f0ff', filter: 'url(#glow-cyan)', style:'pointer-events: none;' });
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
                let ackWave = createSVG('circle', { cx: 250, cy: 70, r: 20, fill: 'none', stroke: '#00f0ff', 'stroke-width': 3, style: 'animation: pulse-wave 1s ease-out forwards; pointer-events: none;' });
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

/* --- ESCENAS HARDWARE --- */
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
        node.appendChild(createSVG('use', {href: '#icon-laptop', x: t.x, y: t.y, style:'pointer-events:none;'}));
        node.appendChild(createSVG('text', {x: t.x + 35, y: t.y + 5, class: 'svg-tech-label', fill: colors[index], style: 'text-anchor: start; pointer-events:none;'}).appendChild(document.createTextNode(`STR_${index+1}`)).parentNode);
        
        // Hitbox dedicado para MU-MIMO
        node.appendChild(createSVG('rect', {x: t.x - 20, y: t.y - 20, width: 90, height: 40, fill: 'transparent'}));
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

/* --- ESCENAS EFICIENCIA --- */
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

/* REPARADO: HITBOXES INDEPENDIENTES PARA EVITAR SOLAPAMIENTO DE CIRCULOS */
function buildBSSColoring() {
    const g = document.querySelector('.bss-cells');
    if(!g) return;
    
    g.innerHTML = ''; 
    const cells = [
        {x: 130, y: 150, c: '#00f0ff', id: 'BSS_Color_42'}, 
        {x: 370, y: 150, c: '#ffd700', id: 'BSS_Color_12'}, 
        {x: 250, y: 250, c: '#ff0055', id: 'BSS_Color_55'}
    ];
    
    cells.forEach(c => {
        // El pulso y elementos visuales DEBEN tener pointer-events: none para no estorbar
        g.appendChild(createSVG('circle', {
            cx: c.x, cy: c.y, r: 90, fill: c.c, opacity: 0.15, stroke: c.c, 'stroke-width': 2, 'stroke-dasharray': '8 8',
            style: `animation: pulse-wave 5s infinite linear; pointer-events: none;`
        }));
        
        g.appendChild(createSVG('use', {href: '#icon-router', x: c.x, y: c.y, transform: `scale(0.8) translate(${-c.x*0.2}, ${-c.y*0.2})`, style: 'pointer-events: none;'}));
        
        let textNode = createSVG('text', {x: c.x, y: c.y - 20, class: 'svg-tech-label', style: 'pointer-events: none;'});
        textNode.appendChild(document.createTextNode(c.id));
        g.appendChild(textNode);
        
        // ZONA DE IMPACTO (Hitbox invisible) - Es lo único que interactúa
        let hitbox = createSVG('circle', {
            cx: c.x, cy: c.y, r: 30, fill: 'transparent', class: 'interactive-node',
            'data-tech-tip': `Identificador de Red: ${c.id}.<br>Mecanismo: Reutilización Espacial Agresiva.<br>Las estaciones ignorarán tramas de otros colores, permitiendo transmitir simultáneamente sin esperar.`
        });
        g.appendChild(hitbox);
    });
}

/* REPARADO: TARGET WAKE TIME COMPLETAMENTE REFACTORIZADO Y ESTÉTICO */
function buildTWT() {
    const g = document.querySelector('.timeline-battery');
    if(!g) return;
    
    g.innerHTML = '';

    // SENSOR IOT (Izquierda)
    let sensor = createSVG('g', {transform: 'translate(30, 80)'});
    sensor.appendChild(createSVG('rect', {x:0, y:0, width:30, height:50, rx:4, fill:'#0f172a', stroke:'#00f0ff', 'stroke-width':2}));
    sensor.appendChild(createSVG('circle', {cx:15, cy:15, r:6, fill:'#00f0ff'}));
    sensor.appendChild(createSVG('line', {x1:15, y1:30, x2:15, y2:40, stroke:'#00f0ff', 'stroke-width':2}));
    let textSensor = createSVG('text', {x:15, y:70, class:'svg-tech-label', style:'text-anchor:middle;'});
    textSensor.appendChild(document.createTextNode('IoT SENSOR'));
    sensor.appendChild(textSensor);
    g.appendChild(sensor);

    // PUNTO DE ACCESO (Derecha)
    let ap = createSVG('g', {transform: 'translate(410, 90)'});
    ap.appendChild(createSVG('rect', {x:0, y:0, width:40, height:20, rx:3, fill:'#1e293b', stroke:'#00f0ff', 'stroke-width':2}));
    ap.appendChild(createSVG('line', {x1:5, y1:0, x2:0, y2:-20, stroke:'#00f0ff', 'stroke-width':2}));
    ap.appendChild(createSVG('line', {x1:35, y1:0, x2:40, y2:-20, stroke:'#00f0ff', 'stroke-width':2}));
    ap.appendChild(createSVG('circle', {cx:20, cy:10, r:3, fill:'#00f0ff'}));
    let textAP = createSVG('text', {x:20, y:45, class:'svg-tech-label', style:'text-anchor:middle;'});
    textAP.appendChild(document.createTextNode('AP (TWT)'));
    ap.appendChild(textAP);
    g.appendChild(ap);

    // LÍNEA DE TIEMPO
    g.appendChild(createSVG('line', {x1: 40, y1: 220, x2: 460, y2: 220, stroke: 'rgba(0,240,255,0.3)', 'stroke-width': 2}));

    for(let i=0; i<3; i++) {
        // Hitbox y grupo para Sleep Mode
        let sleepNode = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Fase SLEEP (Ahorro Energético).<br>El radio Wi-Fi se apaga por completo hasta el milisegundo exacto acordado.`});
        sleepNode.appendChild(createSVG('rect', {x: 80 + (i*120), y: 216, width: 100, height: 8, fill: '#1e293b', rx: 2, stroke:'#94a3b8', 'stroke-width':0.5}));
        g.appendChild(sleepNode);

        // Hitbox y grupo para Transmisión
        let activeNode = createSVG('g', {'class': 'interactive-node', 'data-tech-tip': `Fase WAKE / TX (Transmisión).<br>Intercambio de datos ultrarrápido y vuelta a dormir sin generar colisiones en el canal.`});
        activeNode.appendChild(createSVG('rect', {
            x: 180 + (i*120), y: 150, width: 12, height: 70, fill: '#00f0ff', rx: 2,
            style: `opacity: 0.9; filter: drop-shadow(0 0 10px #00f0ff); animation: pulse-wave 3s infinite ${i*0.8}s; pointer-events: none;`
        }));
        
        // Rayo de conexión
        activeNode.appendChild(createSVG('path', {
            d: `M ${186 + (i*120)} 150 Q 250 100 410 100`,
            fill: 'none', stroke: '#ffd700', 'stroke-width': 2, 'stroke-dasharray': '5 5',
            style: `opacity:0.6; animation: dash-flow 1s linear infinite reverse; pointer-events:none;`
        }));
        
        // Hitbox transparente para facilitar el hover en la transmisión
        activeNode.appendChild(createSVG('rect', {x: 170 + (i*120), y: 140, width: 30, height: 90, fill: 'transparent'}));
        g.appendChild(activeNode);
    }

    // BATERÍA GIGANTE INDICADORA
    let batGroup = createSVG('g', {transform: 'translate(180, 20)', class:'interactive-node', 'data-tech-tip':'Impacto directo de TWT:<br>Extiende la vida útil de las baterías IoT hasta 7 veces en comparación con estándares anteriores (802.11ac/n).'});
    batGroup.appendChild(createSVG('rect', {x:0, y:0, width:100, height:35, rx:5, fill:'rgba(15,23,42,0.8)', stroke:'#ffd700', 'stroke-width':2}));
    batGroup.appendChild(createSVG('rect', {x:102, y:10, width:6, height:15, rx:2, fill:'#ffd700'}));
    batGroup.appendChild(createSVG('rect', {x:4, y:4, width:92, height:27, rx:2, fill:'#ffd700', style:'animation: pulse-wave 4s infinite alternate; pointer-events:none;'}));
    
    let batText = createSVG('text', {x:50, y:23, fill:'#000', 'font-weight':'900', 'font-family':'JetBrains Mono', 'font-size':'14px', 'text-anchor':'middle', style:'pointer-events:none;'});
    batText.appendChild(document.createTextNode('7x BATTERY LIFE'));
    batGroup.appendChild(batText);
    
    g.appendChild(batGroup);
}
