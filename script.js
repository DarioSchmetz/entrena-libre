// Base de datos de ejercicios (Versión 6 Completa con Estadísticas)
const ejercicios = [
    { 
        nombre: "Sentadillas Isométricas (contra la pared)", 
        nivel: "principiante", 
        zona: "piernas", 
        icono: "🦵", 
        desc: "3 series de 30 segundos", 
        detalle: "Fortalece cuádriceps y resistencia de piernas." 
    },
    { 
        nombre: "Plancha abdominal", 
        nivel: "principiante", 
        zona: "core", 
        icono: "🛡️", 
        desc: "3 series de 30 segundos", 
        detalle: "Trabaja el abdomen profundo y la estabilidad central." 
    },
    { 
        nombre: "Flexiones de brazos (apoyando rodillas)", 
        nivel: "principiante", 
        zona: "brazos", 
        icono: "💪", 
        desc: "3 series de 8 a 10 repeticiones", 
        detalle: "Trabaja pecho, hombros y tríceps con menor impacto." 
    },
    { 
        nombre: "Sentadillas libres", 
        nivel: "principiante", 
        zona: "piernas", 
        icono: "🦵", 
        desc: "3 series de 12 repeticiones", 
        detalle: "Trabaja cuádriceps, glúteos y piernas en general." 
    },
    { 
        nombre: "Zancadas o estocadas", 
        nivel: "intermedio", 
        zona: "piernas", 
        icono: "🦵", 
        desc: "3 series de 10 por pierna", 
        detalle: "Trabaja piernas, equilibrio y estabilidad de forma unilateral." 
    },
    { 
        nombre: "Plancha lateral", 
        nivel: "intermedio", 
        zona: "core", 
        icono: "🛡️", 
        desc: "3 series de 20 segundos por lado", 
        detalle: "Trabaja oblicuos y la estabilidad lateral del core." 
    },
    { 
        nombre: "Flexiones de pecho tradicionales", 
        nivel: "intermedio", 
        zona: "brazos", 
        icono: "💪", 
        desc: "3 series de 10 repeticiones", 
        detalle: "Trabaja pecho, tríceps y core por completo." 
    },
    { 
        nombre: "Burpees sin salto", 
        nivel: "intermedio", 
        zona: "todas", 
        icono: "🏃", 
        desc: "3 series de 8 repeticiones", 
        detalle: "Ejercicio full body: activa todo el cuerpo y quema calorías." 
    }
];

// --- NUEVO: Función para mostrar Estadísticas y Favoritos ---
function actualizarPanelInformativo() {
    let seccionInfo = document.getElementById('seccion-info');
    
    if (!seccionInfo) {
        seccionInfo = document.createElement('section');
        seccionInfo.id = 'seccion-info';
        seccionInfo.className = 'card';
        document.querySelector('main').appendChild(seccionInfo);
    }

    const totalGeneradas = localStorage.getItem('totalRutinasGeneradas') || 0;
    const favoritos = JSON.parse(localStorage.getItem('rutinasFavoritas')) || [];

    let htmlInfo = `
        <h3 style="color: var(--primary-color);">📊 Panel de Estadísticas</h3>
        <p style="font-size: 0.95rem; color: #444; margin-bottom: 1rem;">
            🔥 Rutinas generadas en total: <strong>${totalGeneradas}</strong><br>
            ⭐ Rutinas guardadas en favoritos: <strong>${favoritos.length}</strong>
        </p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 1rem 0;">
        <h3 style="color: var(--primary-color);">⭐ Mis Rutinas Favoritas</h3>
    `;

    if (favoritos.length === 0) {
        htmlInfo += `<p style="color: #666; font-size: 0.9rem;">No tenés rutinas guardadas todavía. ¡Generá una y guardala!</p>`;
    } else {
        favoritos.forEach((rutina, index) => {
            htmlInfo += `
                <div style="background: #f9f9f9; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: left; border: 1px solid #eee;">
                    <strong>Rutina #${index + 1}</strong>
                    <ul style="margin: 5px 0 10px 20px; padding: 0; font-size: 0.9rem;">
                        ${rutina.map(ej => `<li>${ej.icono} ${ej.nombre} (${ej.desc})</li>`).join('')}
                    </ul>
                    <button class="btn btn-eliminar-fav" data-index="${index}" style="background-color: #d32f2f; padding: 0.3rem 0.8rem; font-size: 0.8rem; width: auto;">🗑️ Borrar</button>
                </div>
            `;
        });
    }

    seccionInfo.innerHTML = htmlInfo;

    // Eventos para borrar favoritos
    document.querySelectorAll('.btn-eliminar-fav').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const indexToRemove = e.target.getAttribute('data-index');
            let favs = JSON.parse(localStorage.getItem('rutinasFavoritas')) || [];
            favs.splice(indexToRemove, 1);
            localStorage.setItem('rutinasFavoritas', JSON.stringify(favs));
            actualizarPanelInformativo();
        });
    });
}

document.addEventListener('DOMContentLoaded', actualizarPanelInformativo);

document.getElementById('btn-generar').addEventListener('click', () => {
    const nivelSeleccionado = document.getElementById('nivel').value;
    const zonaSeleccionada = document.getElementById('zona').value;

    const ejerciciosFiltrados = ejercicios.filter(ej => {
        const coincideNivel = (nivelSeleccionado === 'todos' || ej.nivel === nivelSeleccionado);
        const coincideZona = (zonaSeleccionada === 'todas' || ej.zona === zonaSeleccionada || ej.zona === 'todas');
        return coincideNivel && coincideZona;
    });

    const contenedor = document.getElementById('resultado-rutina');

    if (ejerciciosFiltrados.length === 0) {
        contenedor.innerHTML = `
            <h3>¡Ups!</h3>
            <p>No encontramos ejercicios exactos para esa combinación, ¡probá con otra categoría!</p>
        `;
        return;
    }

    // --- Incrementar contador de estadísticas ---
    let totalGeneradas = parseInt(localStorage.getItem('totalRutinasGeneradas') || 0) + 1;
    localStorage.setItem('totalRutinasGeneradas', totalGeneradas);
    actualizarPanelInformativo(); // Actualiza el panel en vivo

    // --- Evitar repetir ejercicios recientes ---
    let ultimosEjercicios = JSON.parse(localStorage.getItem('ultimosEjercicios')) || [];
    let ejerciciosDisponibles = ejerciciosFiltrados.filter(ej => !ultimosEjercicios.includes(ej.nombre));

    if (ejerciciosDisponibles.length < 3) {
        ejerciciosDisponibles = ejerciciosFiltrados;
    }

    let rutinaAleatoria = ejerciciosDisponibles.sort(() => 0.5 - Math.random()).slice(0, 3);
    localStorage.setItem('ultimosEjercicios', JSON.stringify(rutinaAleatoria.map(ej => ej.nombre)));

    let htmlRutina = `
        <h3>🔥 Tu Rutina Personalizada</h3>
        <p>Realizá estos ejercicios seguidos. ¡Vos podés!</p>
        <ul class="lista-rutina">
    `;

    rutinaAleatoria.forEach((ej, index) => {
        htmlRutina += `
            <li class="item-ejercicio">
                <strong>${ej.icono} Ejercicio ${index + 1}: ${ej.nombre}</strong><br>
                <span class="detalle-ejercicio">Grupo: ${ej.zona.toUpperCase()} | ${ej.desc}</span><br>
                <span class="subdetalle-ejercicio">💡 ${ej.detalle}</span>
            </li>
        `;
    });

    htmlRutina += `</ul>`;
    
    htmlRutina += `
        <div class="temporizador-box" style="margin-top: 1.5rem; background: #f8f9fa; padding: 1rem; border-radius: 6px; text-align: center; border: 1px solid #ddd;">
            <h4 style="margin: 0 0 0.5rem 0; color: var(--primary-color);">⏱️ Temporizador de Descanso</h4>
            <div id="reloj" style="font-size: 2rem; font-weight: bold; color: #333; margin: 0.5rem 0;">00:45</div>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
                <button class="btn" id="btn-iniciar-timer" style="flex: 1; padding: 0.5rem; background-color: #388e3c; font-size: 0.9rem;">▶️ Iniciar (45s)</button>
                <button class="btn" id="btn-pausar-timer" style="flex: 1; padding: 0.5rem; background-color: #d32f2f; font-size: 0.9rem;">⏹️ Reiniciar</button>
            </div>
        </div>

        <div style="margin-top: 1rem; display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="btn" id="btn-copiar" style="flex: 1; background-color: #1976d2; font-size: 0.9rem;">📋 Copiar</button>
            <button class="btn" id="btn-guardar" style="flex: 1; background-color: #c2185b; font-size: 0.9rem;">❤️ Guardar</button>
            <button class="btn" id="btn-otra-rutina" style="flex: 1; background-color: var(--primary-color); font-size: 0.9rem;">🔄 Otra</button>
        </div>
    `;

    contenedor.innerHTML = htmlRutina;

    // Lógica del Temporizador
    let tiempoRestante = 45;
    let intervaloTimer = null;
    const displayReloj = document.getElementById('reloj');
    const btnIniciar = document.getElementById('btn-iniciar-timer');
    const btnPausar = document.getElementById('btn-pausar-timer');

    function actualizarReloj() {
        let minutos = Math.floor(tiempoRestante / 60);
        let segundos = tiempoRestante % 60;
        displayReloj.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }

    btnIniciar.addEventListener('click', () => {
        if (intervaloTimer) return;
        if (tiempoRestante <= 0) tiempoRestante = 45;

        intervaloTimer = setInterval(() => {
            if (tiempoRestante > 0) {
                tiempoRestante--;
                actualizarReloj();
            } else {
                clearInterval(intervaloTimer);
                intervaloTimer = null;
                alert('¡Tiempo de descanso cumplido! A por el siguiente ejercicio 💪');
                tiempoRestante = 45;
                actualizarReloj();
            }
        }, 1000);
    });

    btnPausar.addEventListener('click', () => {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
        tiempoRestante = 45;
        actualizarReloj();
    });

    // Guardar en Favoritos
    document.getElementById('btn-guardar').addEventListener('click', () => {
        let favoritos = JSON.parse(localStorage.getItem('rutinasFavoritas')) || [];
        favoritos.push(rutinaAleatoria);
        localStorage.setItem('rutinasFavoritas', JSON.stringify(favoritos));

        const btnGuardar = document.getElementById('btn-guardar');
        const textoOriginal = btnGuardar.innerHTML;
        btnGuardar.innerHTML = '✅ ¡Guardada!';
        btnGuardar.style.backgroundColor = '#2e7d32';

        setTimeout(() => {
            btnGuardar.innerHTML = textoOriginal;
            btnGuardar.style.backgroundColor = '#c2185b';
        }, 2000);

        actualizarPanelInformativo();
    });

    // Copiar rutina
    document.getElementById('btn-copiar').addEventListener('click', () => {
        const textoRutina = `🔥 Mi Rutina Entrena Libre\n\n` + 
            rutinaAleatoria.map((ej, i) => `Ejercicio ${i+1}: ${ej.icono} ${ej.nombre} (${ej.zona.toUpperCase()}) - ${ej.desc}\n💡 ${ej.detalle}`).join('\n\n') + 
            `\n\n¡Vamos con todo!`;
        
        navigator.clipboard.writeText(textoRutina).then(() => {
            const btnCopy = document.getElementById('btn-copiar');
            const originalText = btnCopy.innerHTML;
            btnCopy.innerHTML = '✅ ¡Copiada!';
            btnCopy.style.backgroundColor = '#2e7d32';
            
            setTimeout(() => {
                btnCopy.innerHTML = originalText;
                btnCopy.style.backgroundColor = '#1976d2';
            }, 2000);
        }).catch(err => {
            console.error('Error al copiar: ', err);
            alert('Hubo un error al copiar.');
        });
    });

    // Generar otra rutina
    document.getElementById('btn-otra-rutina').addEventListener('click', () => {
        document.getElementById('btn-generar').click();
    });
});