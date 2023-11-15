// Selectores
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacion = document.querySelector('#paginacion');

// variables para la paginacion
const registroPorPagina = 40;
let totalPaginas;
let iterador;
let paginaActual = 1;

// Eventos
formulario.addEventListener('submit', validarFormulario);

// Funciones
function validarFormulario(e) {
    e.preventDefault();
    const busqueda = document.querySelector('#termino').value;
    
    if (busqueda === '' || busqueda.length > 100) {
        mostrarAlerta('Agrega una busqueda valida');
        return;
    }

    // me regresa a la pagina 1 siempre que valido el formulario
    paginaActual = 1;

    // Consultar API
    consultarImagenes();
}

function consultarImagenes() {
    const busqueda = document.querySelector('#termino').value;
    const key = '40677804-be16a06fbc0cb73be0bd93c8a';
    
    const radio = document.querySelectorAll('input[name="opcion"]');
    let valueRadio = 'all';
    radio.forEach( input=> {
        if (input.checked) { valueRadio = input.value }
    });

    console.log(valueRadio);

    const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${registroPorPagina}&page=${paginaActual}&orientation=${valueRadio}`;
    
    return fetch(url)
        .then( respuesta => respuesta.json())
        .then( data =>{ 
            totalPaginas = calcularPaginas(data.totalHits);
            mostrarImagenes(data.hits);
        });
}

function mostrarImagenes(imagenes) {
    console.log(imagenes);

    // eliminar resultados previos
    while (resultado.firstChild) { resultado.removeChild(resultado.firstChild) }

    // iteracion
    imagenes.forEach(imagen => {
        const {previewURL, likes, views, largeImageURL} = imagen;

        resultado.innerHTML += `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white">
                    <img class="w-full" src="${previewURL}">
                    <div class="p-4">
                        <p class="font-bold"> ${likes} <span class="font-light">Me gusta</span></p>
                        <p class="font-bold"> ${views} <span class="font-light">Vistas</span></p>

                        <a class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferre">
                            Ver imagen
                        </a>
                    </div>
                </div>
            </div>
        `;
    });

    imprimirPaginador();
}

const calcularPaginas = total => parseInt(Math.ceil(total / registroPorPagina));

function *crearPaginador(total) {
    for (let i = 1; i <= total; i++) {
        yield i;
    }
}

function imprimirPaginador() {
    iterador = crearPaginador(totalPaginas);

    while (paginacion.firstChild) { paginacion.removeChild(paginacion.firstChild) }
    
    while (true) {
        const { value, done} = iterador.next();
        
        // si done es true, esto señala que el generador llego a su fin, entonces salte del while, y lo hacemos con un return
        if (done) return;

        // caso contrario creame un boton 
        const btn = document.createElement('a');
        btn.href = "#";
        btn.dataset.pagina = value;
        btn.textContent = value;
        btn.className = 'siguiente bg-yellow-400 px-4 py-1 mr-2 font-bold mb-10 rounded';
        if (paginaActual === value) {
            btn.classList.add('text-red-700');
        }

        btn.onclick = (e)=>{
            // e.preventDefault();
            paginaActual = value;
            consultarImagenes();
        }

        paginacion.appendChild(btn);
    }
}

function mostrarAlerta(mensaje) {
    const existeElerta = document.querySelector('.alerta');

    if (!existeElerta) {
        const alerta = document.createElement('p');
        
        alerta.className = 'bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded max-w-lg mx-auto mt-6 text-center alerta';
    
        alerta.innerHTML = `
            <strong class="font-bold">Error!</strong>
            <span class="block">${mensaje}</span>
        `;
    
        formulario.appendChild(alerta);
    
        setTimeout(() => { alerta.remove() }, 2000);
    }
}