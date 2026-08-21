// ==========================================
// SCRIPT PRINCIPAL - ENTRENA LIBRE
// ==========================================

import { supabase } from './js/superbase.js';
import { verificarSesion, renderizarPanelUsuario } from './js/auth.js';
import { cargarFavoritosNube, borrarRutinaNube } from './js/favoritos.js';
import { ejercicios, actualizarPanelInformativo, generarPlanSemanal, cargarPlanSemanalGuardado } from './js/rutinas.js';

document.addEventListener('DOMContentLoaded', () => {
    verificarSesion();
    cargarPlanSemanalGuardado();

    // --- ESCUCHAR CAMBIOS DE SESIÓN (OAuth / Google) ---
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            renderizarPanelUsuario(session.user.email);
            cargarFavoritosNube();
            actualizarPanelInformativo();
            document.dispatchEvent(new CustomEvent('sesionIniciada', { detail: session }));
        }
    });

    // --- LÓGICA DEL MODO OSCURO ---
    const btnModoOscuro = document.getElementById('btn-modo-oscuro');

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if (btnModoOscuro) btnModoOscuro.textContent = '☀️ Modo Claro';
    }

    btnModoOscuro?.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        btnModoOscuro.textContent = isDark ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
    });

    document.addEventListener('sesionIniciada', () => {
        cargarFavoritosNube();
        actualizarPanelInformativo();
    });

    // --- GESTIÓN CENTRALIZADA DE CLICS ---
    document.addEventListener('click', async (e) => {
        const targetId = e.target?.id;
        const targetClass = e.target?.classList;

        // Cerrar Sesión
        if (targetId === 'btn-logout') {
            await supabase.auth.signOut();
            location.reload(); 
        }

        // Iniciar Sesión con Correo
        if (targetId === 'btn-login') {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                alert('Error al iniciar sesión: ' + error.message);
            } else {
                await verificarSesion();
                cargarFavoritosNube();
            }
        }

        // Registro de Usuario
        if (targetId === 'btn-signup') {
            const email = document.getElementById('auth-email').value;
            const password = document.getElementById('auth-password').value;
            const { error } = await supabase.auth.signUp({ email, password });
            
            if (error) {
                alert('Error al registrarse: ' + error.message);
            } else {
                alert('¡Registro exitoso! Ya podés iniciar sesión.');
            }
        }

        // Inicio de Sesión con Google (Independiente y con ruta segura)
        if (targetId === 'btn-google-login') {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: 'https://darioschmetz.github.io/entrena-libre/'
                }
            });
            if (error) {
                alert('Error al iniciar con Google: ' + error.message);
            }
        }

        // Guardar Perfil Físico
        if (targetId === 'btn-guardar-perfil') {
            const perfil = {
                nombre: document.getElementById('perfil-nombre')?.value || '',
                edad: document.getElementById('perfil-edad')?.value || '',
                peso: document.getElementById('perfil-peso')?.value || '',
                altura: document.getElementById('perfil-altura')?.value || ''
            };

            localStorage.setItem('perfilFisicoUser', JSON.stringify(perfil));
            alert('¡Datos personales guardados con éxito!');
            
            const { data: { session } } = await supabase.auth.getSession();
            if (session) renderizarPanelUsuario(session.user.email);
        }

        // Borrar Historial
        if (targetId === 'btn-borrar-historial') {
            localStorage.removeItem('historialEntrenamientos');
            localStorage.setItem('totalRutinasGeneradas', '0');
            localStorage.setItem('rutinasCompletadas', '0');
            actualizarPanelInformativo();
        }

        // Generar Plan Semanal
        if (targetId === 'btn-generar-plan') {
            generarPlanSemanal();
        }

        // Borrar Rutina de la Nube
        if (targetClass?.contains('btn-borrar-nube')) {
            const idRutina = e.target.getAttribute('data-id');
            await borrarRutinaNube(idRutina);
        }

        // Marcar Rutina como Completada
        if (targetId === 'btn-completar-rutina') {
            let completadas = parseInt(localStorage.getItem('rutinasCompletadas') || 0) + 1;
            localStorage.setItem('rutinasCompletadas', completadas);
            actualizarPanelInformativo();
            alert('¡Felicitaciones! Rutina marcada como realizada.');
            e.target.disabled = true;
            e.target.style.background = '#ccc';
            e.target.textContent = '✅ ¡Realizada!';
        }
    });
});

// --- LÓGICA DEL GENERADOR DE RUTINAS ---
document.getElementById('btn-generar')?.addEventListener('click', () => {
    const nivelSeleccionado = document.getElementById('nivel').value;
    const zonaSeleccionada = document.getElementById('zona').value;
    const valorDuracion = parseInt(document.getElementById('duracion')?.value) || 3;
    
    const textosDuracion = { 2: "15 minutos", 3: "30 minutos", 4: "45 minutos", 5: "60 minutos" };
    const textoMinutos = textosDuracion[valorDuracion] || "30 minutos";

    const ejerciciosFiltrados = ejercicios.filter(ej => {
        const coincideNivel = (nivelSeleccionado === 'todos' || ej.nivel === nivelSeleccionado);
        const coincideZona = (zonaSeleccionada === 'todas' || ej.zona === zonaSeleccionada || ej.zona === 'todas');
        return coincideNivel && coincideZona;
    });

    const contenedor = document.getElementById('resultado-rutina');

    if (ejerciciosFiltrados.length === 0) {
        contenedor.innerHTML = `<h3>¡Ups!</h3><p>No encontramos ejercicios para esa combinación.</p>`;
        return;
    }

    let totalGeneradas = parseInt(localStorage.getItem('totalRutinasGeneradas') || 0) + 1;
    localStorage.setItem('totalRutinasGeneradas', totalGeneradas);

    const tomarEjercicios = Math.min(valorDuracion, ejerciciosFiltrados.length);
    let rutinaAleatoria = [...ejerciciosFiltrados].sort(() => 0.5 - Math.random()).slice(0, tomarEjercicios);

    let historial = JSON.parse(localStorage.getItem('historialEntrenamientos')) || [];
    historial.unshift({
        fecha: new Date().toLocaleDateString(),
        detalles: `${textoMinutos} - ` + rutinaAleatoria.map(e => e.nombre).join(', ')
    });
    if (historial.length > 5) historial.pop();
    localStorage.setItem('historialEntrenamientos', JSON.stringify(historial));

    actualizarPanelInformativo();

    let htmlRutina = `
        <div class="card" style="margin-top: 1rem; border: 2px solid var(--primary);">
            <h3>🔥 Tu Rutina Personalizada (${textoMinutos})</h3>
            <ul class="lista-rutina" style="padding-left: 20px;">
    `;

    rutinaAleatoria.forEach((ej, index) => {
        htmlRutina += `
            <li class="item-ejercicio" style="margin-bottom: 8px;">
                <strong>${ej.icono} Ejercicio ${index + 1}: ${ej.nombre}</strong><br>
                <span class="detalle-ejercicio" style="font-size: 0.85rem; color: var(--text-muted);">Grupo: ${ej.zona.toUpperCase()} | ${ej.desc}</span>
            </li>
        `;
    });

    htmlRutina += `</ul>
            <div style="margin-top: 1rem; display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" id="btn-guardar-nube" style="flex: 1; font-size: 0.9rem;">☁️ Guardar en la Nube</button>
                <button class="btn" id="btn-completar-rutina" style="flex: 1; background-color: #2e7d32; font-size: 0.9rem;">✅ Marcar como Realizada</button>
            </div>
        </div>
    `;

    contenedor.innerHTML = htmlRutina;

    document.getElementById('btn-guardar-nube')?.addEventListener('click', async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            alert('Debes iniciar sesión para guardar en la nube.');
            return;
        }

        const { error } = await supabase.from('favorito').insert([{ contenido: rutinaAleatoria }]);
        if (error) {
            alert('Error al guardar: ' + error.message);
        } else {
            alert('¡Rutina guardada en tu perfil de Supabase con éxito!');
            cargarFavoritosNube();
        }
    });
});
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Previene que aparezca el banner automático predeterminado sola
    e.preventDefault();
    // Guarda el evento para usarlo después con tu botón
    deferredPrompt = e;
    
    // Hace visible tu botón personalizado en la web
    const btnInstalar = document.getElementById('btn-instalar');
    if (btnInstalar) {
        btnInstalar.style.display = 'block';
        
        btnInstalar.addEventListener('click', () => {
            // Muestra el cuadro nativo del sistema
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario aceptó instalar la PWA');
                }
                deferredPrompt = null;
            });
        });
    }
});
// --- REGISTRO DE SERVICE WORKER PARA PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registrado con éxito:', reg.scope))
            .catch(err => console.log('Error al registrar el Service Worker:', err));
    });
}