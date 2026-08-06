export const ejercicios = [
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

export function actualizarPanelInformativo() {
    const totalGeneradas = localStorage.getItem('totalRutinasGeneradas') || 0;
    const completadas = parseInt(localStorage.getItem('rutinasCompletadas') || 0);
    const historial = JSON.parse(localStorage.getItem('historialEntrenamientos')) || [];

    const statTotal = document.getElementById('stat-total-generadas');
    if (statTotal) {
        statTotal.innerHTML = `🔥 Rutinas generadas: <strong>${totalGeneradas}</strong>`;
    }

    const statCompletadas = document.getElementById('stat-completadas');
    const barraProgreso = document.getElementById('barra-progreso');
    
    const metaSemanal = 4;
    const porcentaje = Math.min(Math.round((completadas / metaSemanal) * 100), 100);

    if (statCompletadas) {
        statCompletadas.innerHTML = `✅ Rutinas completadas: <strong>${completadas} / ${metaSemanal} meta semanal</strong>`;
    }
    if (barraProgreso) {
        barraProgreso.style.width = `${porcentaje}%`;
    }

    const listaHistorialPerfil = document.getElementById('lista-historial-perfil');
    if (listaHistorialPerfil) {
        if (historial.length > 0) {
            listaHistorialPerfil.innerHTML = historial.map(h => `<li style="font-size: 0.8rem; color: #555;">📅 ${h.fecha}: ${h.detalles}</li>`).join('');
        } else {
            listaHistorialPerfil.innerHTML = `<li style="font-size: 0.8rem; color: #666;">Sin historial reciente.</li>`;
        }
    }
}

export function generarPlanSemanal() {
    const dias = [
        { dia: "Lunes", enfoque: "Piernas y Glúteos" },
        { dia: "Martes", enfoque: "Core y Abdomen" },
        { dia: "Miércoles", enfoque: "Descanso / Activo" },
        { dia: "Jueves", enfoque: "Brazos y Pecho" },
        { dia: "Viernes", enfoque: "Full Body (Todo el cuerpo)" },
        { dia: "Fin de semana", enfoque: "Descanso total" }
    ];

    let htmlPlan = `<ul style="padding-left: 15px; margin: 5px 0;">`;
    dias.forEach(d => {
        htmlPlan += `<li style="margin-bottom: 3px;"><strong>${d.dia}:</strong> ${d.enfoque}</li>`;
    });
    htmlPlan += `</ul>`;

    const contenedorPlan = document.getElementById('contenedor-plan-semanal');
    if (contenedorPlan) {
        contenedorPlan.innerHTML = htmlPlan;
    }
    localStorage.setItem('planSemanalGenerado', htmlPlan);
}

export function cargarPlanSemanalGuardado() {
    const planGuardado = localStorage.getItem('planSemanalGenerado');
    const contenedorPlan = document.getElementById('contenedor-plan-semanal');
    if (planGuardado && contenedorPlan) {
        contenedorPlan.innerHTML = planGuardado;
    }
}