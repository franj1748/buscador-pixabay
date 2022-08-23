const irArriba = document.querySelector('.up');
irArriba.addEventListener('click', scrollUp);

export function scrollUp() {
	
	let scrollActual = document.documentElement.scrollTop;

	if (scrollActual > 80) {
		
		window.requestAnimationFrame(scrollUp);
		window.scrollTo(0, scrollActual - (scrollActual / 3));
	}
}

window.onscroll = () => {

    let cantScroll = document.documentElement.scrollTop; 

    if (cantScroll >= 800) {
        irArriba.style.transform = 'scale(1)';
    }else{
        irArriba.style.transform = 'scale(0)';
    }
}

