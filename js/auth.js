import { supabase } from './superbase.js';
export async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession();
    actualizarVistaAuth(session);
    if (session) {
        // Importaríamos dinámicamente o llamaríamos a favoritos
        document.dispatchEvent(new CustomEvent('sesionIniciada', { detail: session }));
    }
}

export function actualizarVistaAuth(session) {
    const formAuth = document.getElementById('seccion-auth');

    if (session) {
        if (formAuth) {
            formAuth.style.display = 'block';
            renderizarPanelUsuario(session.user.email);
        }
    } else {
        if (formAuth) {
            formAuth.innerHTML = `
                <div id="form-auth-container">
                    <h3 style="color: var(--primary-color); margin-bottom: 0.8rem;">💪 Entrena Libre</h3>
                    <p style="font-size: 0.9rem; color: #666; margin-bottom: 1rem;">Iniciá sesión o registrate para guardar tu progreso y rutinas.</p>
                    <div style="display: flex; flex-direction: column; gap: 10px; max-width: 300px; margin: 0 auto;">
                        <input type="email" id="auth-email" placeholder="Correo electrónico" class="form-input">
                        <input type="password" id="auth-password" placeholder="Contraseña" class="form-input">
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-login" id="btn-login">🔑 Ingresar</button>
                            <button class="btn btn-signup" id="btn-signup">📝 Registrarse</button>
                        </div>
                        
                        <div class="auth-divider">
                            <hr class="divider-line">
                            <span class="divider-text">o con redes</span>
                            <hr class="divider-line">
                        </div>

                        <button class="btn btn-social" id="btn-google-login">
                            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.36 7.23 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7s.43 3.57 1.19 5.1l4.08-3.16z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.64 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                            Continuar con Google
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

export function renderizarPanelUsuario(email) {
    const seccionAuth = document.getElementById('seccion-auth');
    if (!seccionAuth) return;

    const perfilFisico = JSON.parse(localStorage.getItem('perfilFisicoUser')) || { nombre: '', edad: '', peso: '', altura: '' };

    seccionAuth.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
            <div style="font-size: 2.5rem; background: #e3f2fd; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; border-radius: 50%;">👤</div>
            <div style="text-align: left;">
                <h3 id="user-email-display" style="color: var(--primary-color); margin: 0; font-size: 1.1rem;">${perfilFisico.nombre ? perfilFisico.nombre : 'Atleta'}</h3>
                <p style="font-size: 0.85rem; color: #666; margin: 2px 0 0 0;">${email}</p>
            </div>
        </div>

        <div style="background: #fafafa; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: left; border: 1px solid #e0e0e0;">
            <h4 style="color: #333; margin-bottom: 8px; font-size: 0.95rem;">📋 Datos Personales</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
                <input type="text" id="perfil-nombre" placeholder="Nombre" value="${perfilFisico.nombre}" class="form-input" style="margin-bottom:0;">
                <input type="number" id="perfil-edad" placeholder="Edad" value="${perfilFisico.edad}" class="form-input" style="margin-bottom:0;">
                <input type="number" id="perfil-peso" placeholder="Peso (kg)" value="${perfilFisico.peso}" class="form-input" style="margin-bottom:0;">
                <input type="number" id="perfil-altura" placeholder="Altura (cm)" value="${perfilFisico.altura}" class="form-input" style="margin-bottom:0;">
            </div>
            <button class="btn" id="btn-guardar-perfil" style="background-color: #0288d1; font-size: 0.8rem; padding: 0.4rem; width: 100%; margin-top:8px;">💾 Guardar Datos</button>
        </div>

        <div style="background: #f1f8e9; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: left; border: 1px solid #c8e6c9;">
            <label style="font-size: 0.9rem; font-weight: bold; color: #2e7d32;">🎯 Tu Objetivo Actual:</label>
            <select id="select-objetivo" class="form-select" style="margin-top: 5px; margin-bottom: 0;">
                <option value="bajar">Bajar de peso</option>
                <option value="ganar">Ganar masa muscular</option>
                <option value="resistir">Mejorar resistencia</option>
                <option value="activo">Mantenerse activo</option>
            </select>
        </div>

        <div style="background: #e3f2fd; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: left; border: 1px solid #90caf9;">
            <h4 style="color: #1565c0; margin-bottom: 5px; font-size: 0.95rem;">📊 Progreso y Estadísticas</h4>
            <p id="stat-total-generadas" style="font-size: 0.9rem; color: #333; margin-bottom: 5px;">
                🔥 Rutinas generadas: <strong>0</strong>
            </p>
            <p id="stat-completadas" style="font-size: 0.9rem; color: #333; margin-bottom: 8px;">
                ✅ Rutinas completadas: <strong>0 / 4 meta semanal</strong>
            </p>
            <div style="background: #bbdefb; border-radius: 4px; height: 8px; width: 100%; margin-bottom: 10px; overflow: hidden;">
                <div id="barra-progreso" style="background: #1976d2; width: 0%; height: 100%; transition: width 0.3s ease;"></div>
            </div>

            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.85rem; font-weight: bold; color: #333;">📈 Historial reciente:</span>
                    <button id="btn-borrar-historial" style="background: none; border: none; color: #d32f2f; font-size: 0.75rem; cursor: pointer; text-decoration: underline; padding: 0;">🗑️ Borrar</button>
                </div>
                <ul id="lista-historial-perfil" style="padding-left: 15px; margin: 5px 0 0 0; max-height: 100px; overflow-y: auto;">
                    <li style="font-size: 0.8rem; color: #666;">Sin historial reciente.</li>
                </ul>
            </div>
        </div>

        <div style="background: #fff3e0; padding: 12px; border-radius: 8px; margin-bottom: 15px; text-align: left; border: 1px solid #ffe0b2;">
            <h4 style="color: #e65100; margin-bottom: 5px; font-size: 0.95rem;">📅 Plan Semanal</h4>
            <div id="contenedor-plan-semanal" style="font-size: 0.85rem; color: #444; margin-bottom: 8px;">
                <p style="color: #666; margin: 0;">Generá tu plan semanal basado en tus preferencias.</p>
            </div>
            <button class="btn" id="btn-generar-plan" style="background-color: #f57c00; font-size: 0.85rem; padding: 0.4rem; width: 100%;">🔄 Generar Plan Semanal</button>
        </div>

        <div style="margin-bottom: 15px; text-align: left;">
            <h4 style="color: var(--primary-color); margin-bottom: 5px; font-size: 0.95rem;">☁️ Mis Rutinas en la Nube</h4>
            <div id="lista-favoritos-nube" style="max-height: 180px; overflow-y: auto; padding-right: 5px;">
                <p style="color: #666; font-size: 0.9rem;">Cargando rutinas...</p>
            </div>
        </div>

        <button class="btn btn-logout" id="btn-logout" style="width: 100%;">🚪 Cerrar Sesión</button>
    `;

    const selectObjetivo = document.getElementById('select-objetivo');
    const objetivoGuardado = localStorage.getItem('usuarioObjetivo');
    if (selectObjetivo && objetivoGuardado) {
        selectObjetivo.value = objetivoGuardado;
    }

    selectObjetivo?.addEventListener('change', (e) => {
        localStorage.setItem('usuarioObjetivo', e.target.value);
    });
}