// index.js

document.addEventListener('DOMContentLoaded', () => {
    let carrito = [];
    const listaCarrito = document.getElementById('lista-carrito');
    const total = document.getElementById('total');
    const botonesAgregar = document.querySelectorAll('.agregar-carrito');
    const botonVaciar = document.getElementById('vaciar-carrito');
    const navLinks = document.querySelectorAll('.mdl-navigation__link');
    const secciones = {
        productos: document.getElementById('productos'),
        carrito: document.getElementById('carrito')
    };
    const botonCambiarFondo = document.getElementById('cambiar-fondo');

    // Cargar carrito desde localStorage si existe
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito();
    }

    botonesAgregar.forEach(boton => {
        boton.addEventListener('click', agregarProducto);
    });

    botonVaciar.addEventListener('click', () => {
        carrito.length = 0;
        actualizarCarrito();
        localStorage.removeItem('carrito');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');
            mostrarSeccion(target);
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    botonCambiarFondo.addEventListener('click', () => {
        document.body.style.backgroundColor = "#b0e0e6"; // Color azul suave
    });

    function agregarProducto(e) {
        const producto = e.target.closest('.mdl-card');
        const nombre = producto.querySelector('.mdl-card__title-text').textContent;
        const precio = parseFloat(producto.querySelector('.text-primary').textContent.replace('$', '').replace(' COP', ''));

        const existe = carrito.find(item => item.nombre === nombre);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carrito.push({ nombre, precio, cantidad: 1 });
        }
        actualizarCarrito();
        guardarCarrito();
    }

    function actualizarCarrito() {
        listaCarrito.innerHTML = '';
        let sumaTotal = 0;

        carrito.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'mdl-list__item mdl-list__item--two-line';
            li.innerHTML = `
                <span class="mdl-list__item-primary-content">
                    <span>${item.nombre} x ${item.cantidad}</span>
                    <span class="mdl-list__item-sub-title">$${(item.precio * item.cantidad).toFixed(2)} COP</span>
                </span>
                <button class="mdl-button mdl-js-button mdl-button--icon eliminar-producto" data-index="${index}">
                    <i class="material-icons">delete</i>
                </button>
            `;
            listaCarrito.appendChild(li);
        });

        // Añadir eventos a los nuevos botones de eliminar
        const botonesEliminar = document.querySelectorAll('.eliminar-producto');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', eliminarProducto);
        });

        sumaTotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        total.textContent = `Total: $${sumaTotal.toFixed(2)} COP`;
    }

    function mostrarSeccion(target) {
        // Ocultar todas las secciones
        Object.values(secciones).forEach(seccion => seccion.classList.add('d-none'));
        // Mostrar la sección seleccionada
        secciones[target].classList.remove('d-none');
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function eliminarProducto(e) {
        const index = e.target.getAttribute('data-index');
        carrito.splice(index, 1);
        actualizarCarrito();
        guardarCarrito();
    }
});
