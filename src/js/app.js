import * as scroll from './scroll-up.js';

const formulario   		  = document.querySelector('#formulario');
const contenedorResultado = document.querySelector('#contenedorResultado');
const contendorPagination = document.querySelector('.pagination');
let pagActual 			  = 1;
let totalPag;
let iterador;

document.addEventListener('DOMContentLoaded', () => {

	formulario.addEventListener('submit', obtenerImagenes);

});

function obtenerImagenes(e) {
	
	e.preventDefault();

	const busqueda = document.querySelector('#busqueda').value;
	pagActual = 1;

	if (busqueda == '') {
		mostrarAlerta('¡Error!', 'Debes ingresar un término de búsqueda!', 'error', 'Cerrar');
		return
	}else{
		consultarAPi(busqueda);
	}


}

function consultarAPi(busqueda) {

	const key 	   = '10409523-662252db1a3d665cba3067ecf';
	const uri 	   = `https://pixabay.com/api/?key=${key}&q=${busqueda}&lang=es&per_page=18&page=${pagActual}`;
	
	fetch(uri)
		.then(response => response.json())
		.then(data => {
			if(data.hits.length === 0){
				mostrarAlerta('¡Lo siento!', 'No se encontró ninguna imagen. Intenta con otro término.', 'warning', 'Cerrar');
				return
			}
			totalPag = calcularPag(data.totalHits);
			mostrarImagenes(data, busqueda);
		})
}

function mostrarImagenes(datos, busqueda) {
	
	const {total, totalHits, hits} = datos;

	const totalImagenes    = contenedorResultado.previousElementSibling.previousElementSibling;
	const totalDisponibles = contenedorResultado.previousElementSibling;

	totalImagenes.classList.remove('visually-hidden');
	totalDisponibles.classList.remove('visually-hidden');
	totalImagenes.textContent    = `Total imágenes: ${total}`;
	totalDisponibles.innerHTML   = `Resultados disponibles: ${totalHits} ${total == totalHits ? '' : `<a href="https://pixabay.com/es/images/search/${busqueda}/" target="_blank" rel="noopener noreferrer" class="link-light">Ver todas</a>`} `;

	contenedorResultado.innerHTML = '';
	hits.forEach(hit =>{

		const {id, pageURL, type, tags, previewURL, previewWidth, previewHeight, webformatURL, webformatWidth, webformatHeight, largeImageURL, imageWidth, imageHeight, views, downloads, likes, user_id, user, userImageURL} = hit;
		const etiquetas = tags.split(',');
		contenedorResultado.innerHTML += `
				<div class="col animate__animated animate__zoomIn animate__faster animate__delay-0.7s">
					<div class="card shadow-sm rounded rounded-2 shadow-lg">
						<img class="rounded-top" width="100%" height="350px" src="${webformatURL}" alt="${id}">
						<div class="card-body">
							<div class="d-flex justify-content-between align-items-center">
								<div class="btn-group">
									<div class="btn-group" role="group">
										<button class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" type="button" aria-expanded="false">
											Descargar
										</button>
										<ul class="dropdown-menu dropdown-menu-dark">
											<li>
												<a class="dropdown-item" target="_blank" rel="noopener noreferrer" href="${previewURL}">Baja (${previewHeight}x${previewWidth})</a>
											</li>
											<li>
												<a class="dropdown-item" target="_blank" rel="noopener noreferrer" href="${webformatURL}">Media (${webformatHeight}x${webformatWidth})</a>
											</li>
											<li>
												<span class="dropdown-item"><a class="link-light nav-link" target="_blank" rel="noopener noreferrer" href="${largeImageURL}">Alta (${imageHeight}x${imageWidth})</span>
											</li>
										</ul>
									</div>
									<a href="${pageURL}" type="button" class="btn btn-sm btn-outline-secondary" target="_blank" rel="noopener noreferrer">Visitar página</a>
								</div>
								<small class="text-muted">${type}</small>
							</div>
							<small class="d-block text-muted mt-2">${views} vistas</small>
							<small class="d-block text-muted mt-2">${likes} me gusta</small>
							<small class="d-block text-muted mt-2">${downloads} veces descargada</small>
							<small class="d-block text-muted mt-2">Etiquetas: <a href="#" class="tags">${etiquetas[0]}</a> <a href="#" class="tags">${etiquetas[1]}</a> <a href="#" class="tags">${etiquetas[2]}</a></small>
							<div class="d-flex align-items-center">
								<a href="https://pixabay.com/es/users/${user}-${user_id}/" target="_blank" rel="noopener noreferrer">
									${userImageURL== ''?`<svg xmlns="http://www.w3.org/2000/svg" class="ionicon rounded-circle me-2 mt-4" width="40" viewBox="0 0 512 512"><title>Sin foto de perfil</title><path d="M258.9 48C141.92 46.42 46.42 141.92 48 258.9c1.56 112.19 92.91 203.54 205.1 205.1 117 1.6 212.48-93.9 210.88-210.88C462.44 140.91 371.09 49.56 258.9 48zm126.42 327.25a4 4 0 01-6.14-.32 124.27 124.27 0 00-32.35-29.59C321.37 329 289.11 320 256 320s-65.37 9-90.83 25.34a124.24 124.24 0 00-32.35 29.58 4 4 0 01-6.14.32A175.32 175.32 0 0180 259c-1.63-97.31 78.22-178.76 175.57-179S432 158.81 432 256a175.32 175.32 0 01-46.68 119.25z"/><path d="M256 144c-19.72 0-37.55 7.39-50.22 20.82s-19 32-17.57 51.93C191.11 256 221.52 288 256 288s64.83-32 67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39 151.44 275.59 144 256 144z"/></svg>`:`<img src="${userImageURL}" alt="" width="40" height="40" class="rounded-circle me-2 mt-4"></img>`}
								</a>
								<strong class="mt-4">${user}</strong>
							</div>
						</div>
					</div>
				</div>`;
	}); 

	const tagsUrl = Array.from(document.querySelectorAll('.tags'));
	tagsUrl.forEach(tag =>{
		tag.addEventListener('click', e =>{
			scroll.scrollUp();
			pagActual = 1; 
			const busqueda = e.target.textContent;
			document.querySelector('#busqueda').value = busqueda;
			consultarAPi(busqueda);
		});
	});

	imprimirPagination();
	normalizarPagination();
	
}
const calcularPag = totalSearch => parseInt(Math.ceil(totalSearch/18));

function imprimirPagination() {
	
	iterador = crearPagination(totalPag);
	contendorPagination.innerHTML = '';

	while(true){
		
		const {value, done} = iterador.next();

		if(done) return;

		const li = document.createElement('li');
		li.classList.add('page-item');
		const a = document.createElement('a');
		a.href = '#';
		a.classList.add('page-link');
		a.classList.add('link-dark');
		a.dataset.pag = value;
		a.textContent = value; 
		li.appendChild(a);
		contendorPagination.appendChild(li);

		if(value == 1) a.classList.add('active');

		li.onclick = () => {
			pagActual = value;
			const busqueda = document.querySelector('#busqueda').value;
			consultarAPi(busqueda);
		}
	}
}

function *crearPagination(totalPagination) {
	for (let i = 1; i <= totalPagination; i++) {
		yield i;		
	}
}

function normalizarPagination() {
	
	const enlacesPagination = Array.from(document.querySelectorAll('.page-link'));
	enlacesPagination.forEach(enlace => {
		enlace.addEventListener('click', scroll.scrollUp);
		enlace.classList.add('visually-hidden');
		if (enlace.dataset.pag == pagActual) {
			enlace.classList.add('active');	
			enlace.parentElement.classList.add('disabled');	
		}else{
			enlace.classList.remove('active');
			enlace.parentElement.classList.remove('disabled');	
		}
		if (enlace.dataset.pag == pagActual || enlace.dataset.pag == pagActual + 1 || enlace.dataset.pag == pagActual + 2 || enlace.dataset.pag == pagActual + 3 || enlace.dataset.pag == pagActual - 1 || enlace.dataset.pag == pagActual - 2 || enlace.dataset.pag == pagActual - 3) {
			enlace.classList.remove('visually-hidden');
		}
		if (enlace.dataset.pag == enlacesPagination.length - 1) {
			enlace.classList.remove('visually-hidden');
			const li = document.createElement('li');
			li.id = 'separator';
			li.classList.add('page-item', 'mx-2', 'pt-3');
			li.textContent = '...';
			enlace.parentElement.parentElement.insertBefore(li, enlace.parentElement);
		}
		if (pagActual == enlacesPagination.length - 6 || pagActual == enlacesPagination.length - 5 || pagActual == enlacesPagination.length - 4 || pagActual == enlacesPagination.length - 3 || pagActual == enlacesPagination.length - 2 || pagActual == enlacesPagination.length - 1) {
			if(document.querySelector('#separator')) document.querySelector('#separator').remove();
		}
	});

	const anterior = document.createElement('li');
	anterior.classList.add('page-item');
	anterior.classList.remove('visually-hidden');
	anterior.innerHTML = '<a class="page-link link-dark" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>';
	contendorPagination.insertAdjacentElement("afterbegin",anterior);
	if (pagActual == enlacesPagination[0].dataset.pag) anterior.classList.add('disabled');
	anterior.onclick = () => {
		if(pagActual > 1) {
			pagActual--;
			const busqueda = document.querySelector('#busqueda').value;
			consultarAPi(busqueda);
		}
	}

	const siguiente = document.createElement('li');
	siguiente.classList.add('page-item');
	siguiente.classList.remove('visually-hidden');
	siguiente.innerHTML = '<a class="page-link link-dark" href="#" aria-label="Next"> <span aria-hidden="true">&raquo;</span></a>';
	contendorPagination.appendChild(siguiente);
	if (pagActual == enlacesPagination.length) siguiente.classList.add('disabled');
	siguiente.onclick = () => {
		if (pagActual < enlacesPagination.length) {
			pagActual++;
			const busqueda = document.querySelector('#busqueda').value;
			consultarAPi(busqueda);
		}
	}
}

function mostrarAlerta(titulo, mensaje, tipo, btn){
	swal({
		title: titulo,
		text: mensaje,
		icon: tipo,
		button: btn,
		closeOnClickOutside: false,
		closeOnEsc: false,
	});
}














