/**ojo con el use strict no te lo olvides */
'use strict';

const url = 'http://localhost:3000/usuarios/';
let listado, id, email, password, dni, formulario, estasSeguro;
/*escucha un evento y cuando ocurre ejecuta asincronamente una funcion*/
document.addEventListener('DOMContentLoaded', async function () 
{/*esta es la definicion de la funcion */
    /*se recogen todos los datos del dom */
    
    estasSeguro = document.getElementById('estasSeguro');
    listado = document.querySelector('#listado tbody');
    formulario = document.getElementById('formulario');
    id = document.getElementById('id');
    email = document.getElementById('email');
    password = document.getElementById('password');
    dni = document.getElementById('dni');

    /**------------------------------------------------------------------- */
    /* añade elistener submit y ejecuta la funcion aceptar*/ 
    formulario.addEventListener('submit', aceptar);
    /*añade  a dni elistener cuando cambia y ejecuta la funcion cambioDni*/ 
    dni.addEventListener('change', cambioDni);
    /*ejecuta la funcion activarModal*/
    activarModal();
    /*ejecuta la funcion listar*/ 
    listar();
}/*aqui acaba la funcion y se cierra la instruccion elistener*/
);

/*------------------------------------------------------------------------
---------------------------------------------------------------------------*/ 

/*funcion cambioDni */
function cambioDni() {
    /*llama a la funcion dniValido y le pasa el valor dni.value*/
    if(dniValido(dni.value)) {
        /*El metodo HTMLSelectElement.setCustomValidity() 
        define el mensaje de validación personalizado para el elemento 
        seleccionado con el mensaje especifico. 
        Usa una string vacia para indicar que ese elemento no tiene
        error de validación customizado.
        HTMLButtonElement.setCustomValidity(error: string): void
        Sets a custom error message that is displayed when a form
         is submitted.*/
         /*en este caso es true por tanto el mensaje sera '' (nada) */
        dni.setCustomValidity('');
    } else {
        
        dni.setCustomValidity('El DNI no es correcto');
    }
}
/*-----------------------------------------------------------------------
aceptar es la funcion que envia datos para insertar o modificar con el
prevent default no envia los datos, los envia esta funcion eligiendo metodo
PUT o POST segun sea insertar o modificar   */



async function aceptar(e) {

    /*Event.preventDefault(): void
    Cancela el evento si este es cancelable, 
    sin detener el resto del funcionamiento del evento, 
    es decir, puede ser llamado de nuevo.
    Sintaxis
    event.preventDefault()
    https://developer.mozilla.org/es/docs/Web/API/Event/preventDefault*/
    e.preventDefault();
    /*se añade a la lista de clases del formulario ('was-validated')
     que es requerida por bootstrap para funcionar*/
    formulario.classList.add('was-validated');
    /*HTMLButtonElement.checkValidity(): boolean
    Returns whether a form will validate when it is submitted, 
    without having to submit it. */
    /*si el formulario no es correcto se sale de la funcion aceptar si es correcto seguimos */
    if(!formulario.checkValidity()) {
        return;
    }
    /*se define una variable metodo*/
    let metodo;
    /*se almacena una constante usuario con los valores del formulario*/
    const usuario = { email: email.value, password: password.value, dni: dni.value };
    /* id no se puede modificar en el formulario; id.value dara true si existe  
    lo que nos dice que el usuario existe tiene un id y queremos editar por lo que 
    lanzaremos un metodo PUT*/
    /*si el usuario no existe id.value = false querremos añadirlo por tanto metodo POST */
    if (id.value) {
        usuario.id = id.value;
        metodo = 'PUT';
    } else {
        metodo = 'POST';
    }

    console.log(usuario);
    /*se envia la respuesta a la const url concatenada con el valor
     del id si este existe en un caso añadira y en otro modificara */
    const respuesta = await fetch(url + id.value, {
        method: metodo,
        body: JSON.stringify(usuario),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    console.log(respuesta);
    /*se vacian los campos del formulario y se quita laclase was-validated*/
    id.value = email.value = password.value = dni.value = '';
    formulario.classList.remove('was-validated');
    /*llamada de nuevo a la funcion listar (ha habido cambios)*/
    listar();
} 

    /*------------------------------------------------------------------------
    --------------------------------------------------------------------------
    funcion listar
    */

async function listar() {
    /*url es una variable global, se puede usar aqui
    fetch devuelve una promesa de que enviara los datos
    cuando esta se recibe se esperan los datos en formato json
    .json convierte datos al formato json*/
    const respuesta = await fetch(url);
    /*const usuarios tendra varios objetos tipo usuario*/

    const usuarios = await respuesta.json();

    console.log(usuarios);
    /*se eliminan los datos anteriores en la tabla */
    
    /*Element.innerHTML devuelve o establece la sintaxis HTML describiendo
     los descendientes del elemento.
    Al establecerse se reemplaza la sintaxis HTML del elemento por la nueva.*/
    /**ojo el id listado deberia ser el tbody */
    listado.innerHTML = '';
    /* variable fila de la tabla*/ 
    let tr;
    /*objetos.forEach(funcion(laquesea)) ejecuta
     la funcion laquesea para cada objeto*/
    usuarios.forEach(function (usuario) {
        /*aqui se define y se ejecuta la funcion usuario para cada usuario*/
        tr = document.createElement('tr');
        /*primero se crea un tr table row, dentro de se tr se
        crean th  ${valor}  y los botones */
        /*se añaden como hijos a listado*/
        /*el enlace editar llama como href a la funcion editar y le pasa
         el valor de id de su usuario
         el boton borrar llama al modal  y tiene un href con la funcion borrar con
          su id de usuario esta no es llamada directamente, la llama el modal*/
        tr.innerHTML = `
            <th>${usuario.id}</th>
            <td>${usuario.email}</td>
            <td>${usuario.dni}</td>
            <td> 
               <a class="btn btn-primary" href="javascript:editar(${usuario.id})">Editar</a>
                <a class="btn btn-danger" data-id="${usuario.id}" data-bs-toggle="modal" data-bs-target="#estasSeguro" href="javascript:borrar(${usuario.id})">Borrar</a>
            </td>`;
        listado.appendChild(tr);
    });
}
/**------------------------------------------------------------------------------------------
 * editar = se envia peticion con el id 
 */
async function editar(idSeleccionado) {
    console.log(idSeleccionado);

    const respuesta = await fetch(url + idSeleccionado);
    const usuario = await respuesta.json();

    id.value = usuario.id;
    email.value = usuario.email;
    password.value = usuario.password;
    dni.value = usuario.dni;
}

async function borrar(id) {
    console.log(id);

    // if(!confirm(`¿Estás seguro de que quieres borrar el registro id=${id}?`)) {
    //     return;
    // }   

    const respuesta = await fetch(url + id, { method: 'DELETE' });

    console.log(respuesta);

    const modal = bootstrap.Modal.getInstance(estasSeguro);

    modal.hide();

    listar();
}
function activarModal() {
    estasSeguro.addEventListener('show.bs.modal', function (event) {
        console.log(event);
        // Button that triggered the modal
        const boton = event.relatedTarget;
        // Extract info from data-bs-* attributes
        const id = boton.dataset.id; // boton.getAttribute('data-id');
        // Update the modal's content.
        const cuerpo = estasSeguro.querySelector('.modal-body');

        cuerpo.innerText = `¿Estás seguro de que quieres borrar el id ${id}?`;

        const aceptar = estasSeguro.querySelector('#modal-aceptar');
        aceptar.href = boton.href;
    });
}
/*funcion dniValido es una funcion a la que hay que pasar un dni*/
function dniValido(dni) {
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    /*en javascript un texto se puede tratar como un array , ademas una expresion
    regular (algo entre//) es tratado como un objeto y tiene sus metodos
    (method) RegExp.test(string: string): boolean
    Returns a Boolean value that indicates whether or not a pattern exists in
    a searched string.
    @param string — String on which to perform the search.*/
    if(!/^[XYZ\d]\d{7}[TRWAGMYFPDXBNJZSQVHLCKE]$/.test(dni)) {
        /*si nos da falso pues, se sale, se pone un return y se acabo
        se manda un false con el return para sabar que no coincide con la regex   */
        return false;
    }
    /*String.substring(start: number, end?: number): string
    The zero-based index number indicating the beginning of the substring.
    Returns the substring at the specified location within a String object.*/
    /*dni.substring(0, 8) los caracteres del dni (es un texto) del 0 al 8
    el ultimo no se incluye*/
    /*String.replace(searchValue: string | RegExp, replaceValue: string): string
    reemplaza en un string un valor por otro*/
    /*con el + transformamos el strin en numero*/
    const numero = +dni.substring(0, 8).replace('X', '0').replace('Y','1').replace('Z','2');
    /*como un texto es un array se puede pedir una posicion de letra 
    en un dni la letra es el octavo(empieza en 0)*/ 
    const letra = dni[8];
    /* % =modulo, devuelve el resto de una division*/
    return letras[numero % 23] === letra;
}