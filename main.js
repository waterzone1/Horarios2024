import { db } from './firebase-config.js';

const infoData = {
    "Taller de Emprendedorismo": {
        horario: "Martes 14:00 - 18:00",
        parcial: "-",
        recuperatorio: "-",
        final: "-",
        profesores: "-",
        email: "-",
        campus: "https://eva.uca.edu.ar/course/view.php?id=23845" ,
        aula: "252 Magno",
        comentarios: [],
        tareas: []
    },
    "Seguridad Informática y Criptografía": {
        horario: "Lunes 18:00 - 23:00",
        parcial: "-",
        recuperatorio: "-",
        final: "-",
        profesores: "German Bollman y Marcelo Cipriano",
        email: "germanbollmann@uca.edu.ar y marcelocipriano@uca.edu.ar",
        campus: "https://eva.uca.edu.ar/course/view.php?id=16083" ,
        aula: "LIR B",
        comentarios: [],
        tareas: []
    },
    "Auditoría Informática": {
        horario: "Martes 18:00 - 23:00",
        parcial: "-",
        recuperatorio: "-",
        final: "-",
        profesores: "German Bollman",
        email: "germanbollmann@uca.edu.ar",
        campus: "https://eva.uca.edu.ar/course/view.php?id=24209" ,
        aula: "109 Magno",
        comentarios: [],
        tareas: []
    },
    "Gerenciamiento y Evaluación de Proyectos": {
        horario: "Miércoles 18:00 - 23:00",
        parcial: "-",
        recuperatorio: "-",
        final: "-",
        profesores: "Liliana Radicce",
        email: "-",
        campus: "https://eva.uca.edu.ar/course/view.php?id=24230" ,
        aula: "S0B Moro (auditorio)",
        comentarios: [],
        tareas: []
    },
    "Proyecto Integral de Desarrollo": {
        horario: "Jueves 18:00 - 23:00",
        parcial: "-",
        recuperatorio: "-",
        final: "-",
        profesores: "Jorge Nahas",
        email: "-",
        campus: "https://eva.uca.edu.ar/course/view.php?id=23924" ,
        aula: "220 San José",
        comentarios: [],
        tareas: []
    },
    "Economía de la Empresa": {
        horario: "Viernes 18:00 - 23:00",
        parcial: "25 de Octubre",
        recuperatorio: "29 de Noviembre (chequear)",
        final: "-",
        profesores: "Alejandro",
        email: "-",
        campus: "https://eva.uca.edu.ar/course/view.php?id=23680" ,
        aula: "217 San José",
        comentarios: [],
        tareas: []
    }
};

let currentMateria = '';

window.showInfo = async function(materia) {
    currentMateria = materia;
    const data = infoData[materia];

    document.getElementById('materiaTitle').innerText = materia;
    document.getElementById('horario').innerText = data.horario;
    document.getElementById('parcial').innerText = data.parcial;
    document.getElementById('recuperatorio').innerText = data.recuperatorio;
    document.getElementById('final').innerText = data.final;
    document.getElementById('profesores').innerText = data.profesores;
    document.getElementById('email').innerText = data.email;
    document.getElementById('aula').innerText = data.aula;

    const campusElement = document.getElementById('campus');
    campusElement.innerHTML = `<a href="${data.campus}" target="_blank"><button>Visitar Campus</button></a>`;

    const dbRef = ref(db);
    const comentariosSnapshot = await get(child(dbRef, 'comentarios'));
    let comentarios = [];
    if (comentariosSnapshot.exists()) {
        comentariosSnapshot.forEach(childSnapshot => {
            const comentarioData = childSnapshot.val();
            if (comentarioData.materia === currentMateria) {
                comentarios.push({ id: childSnapshot.key, texto: comentarioData.comentario });
            }
        });
    }
    infoData[currentMateria].comentarios = comentarios;
    actualizarLista('comentariosList', comentarios, 'comentarios');

    const tareasSnapshot = await get(child(dbRef, 'tareas'));
    let tareas = [];
    if (tareasSnapshot.exists()) {
        tareasSnapshot.forEach(childSnapshot => {
            const tareaData = childSnapshot.val();
            if (tareaData.materia === currentMateria) {
                tareas.push({ id: childSnapshot.key, texto: tareaData.tarea });
            }
        });
    }
    infoData[currentMateria].tareas = tareas;
    actualizarLista('tareasList', tareas, 'tareas');

    document.getElementById('horarioTable').classList.add('shrink');
    document.getElementById('infoModule').classList.add('active');
};

window.closeInfo = function() {
    document.getElementById('horarioTable').classList.remove('shrink');
    document.getElementById('infoModule').classList.remove('active');
};

window.agregarComentario = async function() {
    const comentario = document.getElementById('nuevoComentario').value;
    if (comentario) {
        const newCommentRef = ref(db, 'comentarios/' + Date.now());
        set(newCommentRef, {
            comentario: comentario,
            materia: currentMateria,
            timestamp: Date.now(),
        });
        infoData[currentMateria].comentarios.push({ id: newCommentRef.key, texto: comentario });
        actualizarLista('comentariosList', infoData[currentMateria].comentarios, 'comentarios');
        document.getElementById('nuevoComentario').value = '';
    }
};

window.agregarTarea = async function() {
    const tarea = document.getElementById('nuevaTarea').value;
    if (tarea) {
        const newTaskRef = ref(db, 'tareas/' + Date.now());
        set(newTaskRef, {
            tarea: tarea,
            materia: currentMateria,
            timestamp: Date.now(),
        });
        infoData[currentMateria].tareas.push({ id: newTaskRef.key, texto: tarea });
        actualizarLista('tareasList', infoData[currentMateria].tareas, 'tareas');
        document.getElementById('nuevaTarea').value = '';
    }
};

function actualizarLista(elementId, items, type) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = item.texto;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = function() {
            items.splice(index, 1);
            remove(ref(db, type + '/' + item.id));
            actualizarLista(elementId, items, type);
        };

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}
