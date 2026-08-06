import { supabase } from './superbase.js';
export async function cargarFavoritosNube() {
    const contenedorFavs = document.getElementById('lista-favoritos-nube');
    if (!contenedorFavs) return;

    const { data, error } = await supabase.from('favorito').select('*');
    
    if (error) {
        console.error('Error al cargar favoritos:', error.message);
        return;
    }

    if (data.length === 0) {
        contenedorFavs.innerHTML = `<p style="color: #666; font-size: 0.9rem;">No tenés rutinas guardadas en la nube todavía.</p>`;
        return;
    }

    let htmlFavs = '';
    data.forEach((item, index) => {
        const rutina = item.contenido;
        htmlFavs += `
            <div style="background: #f9f9f9; padding: 10px; border-radius: 6px; margin-bottom: 10px; text-align: left; border: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong>Rutina en la nube #${index + 1}</strong>
                    <button class="btn-borrar-nube" data-id="${item.id}" style="background: none; border: none; color: #d32f2f; font-size: 0.8rem; cursor: pointer; text-decoration: underline; padding: 0;">🗑️ Borrar</button>
                </div>
                <ul style="margin: 5px 0 5px 20px; padding: 0; font-size: 0.9rem;">
                    ${Array.isArray(rutina) ? rutina.map(ej => `<li>${ej.icono} ${ej.nombre} (${ej.desc})</li>`).join('') : '<li>Rutina personalizada</li>'}
                </ul>
            </div>
        `;
    });
    contenedorFavs.innerHTML = htmlFavs;
}

export async function borrarRutinaNube(id) {
    const { error } = await supabase.from('favorito').delete().eq('id', id);
    if (error) {
        alert('Error al borrar de la nube: ' + error.message);
    } else {
        alert('Rutina eliminada de la nube con éxito.');
        cargarFavoritosNube();
    }
}