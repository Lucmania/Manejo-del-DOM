let personal = [];
let sectores = ['Depósito', 'Taller', 'Cocina'];
let registrosGuardados = 0;

document.getElementById('guardar').addEventListener('click', guardarPersonal);
document.getElementById('listar').addEventListener('click', listarPersonal);

window.onload = function () {
    let pisoValue = document.getElementById('piso').value.trim();
    let departamentoInput = document.getElementById('departamento');
    let departamentoLabel = document.querySelector('label[for="departamento"]');

    if (pisoValue === '') {
        departamentoInput.style.display = 'none';
        departamentoLabel.style.display = 'none';
    }
};

document.getElementById('piso').addEventListener('input', function () {
    let pisoValue = this.value.trim();
    let departamentoInput = document.getElementById('departamento');
    let departamentoLabel = document.querySelector('label[for="departamento"]');

    if (pisoValue !== '') {
        departamentoInput.style.display = 'block';
        departamentoLabel.style.display = 'block';
    } else {
        departamentoInput.style.display = 'none';
        departamentoLabel.style.display = 'none';
        departamentoInput.value = '';
    }
});

function validarTextoSinNumeros(valor) {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(valor);
}

function validarNumeroPositivo(valor) {
    return !isNaN(valor) && Number(valor) >= 0;
}

function guardarPersonal(event) {
    event.preventDefault();

    let errores = [];
    let nombre = document.getElementById('nombre').value.trim();
    let apellido = document.getElementById('apellido').value.trim();
    let direccion = document.getElementById('direccion').value.trim();
    let numero = document.getElementById('numero').value.trim();
    let piso = document.getElementById('piso').value.trim();
    let departamento = document.getElementById('departamento').value.trim();
    let ciudad = document.getElementById('ciudad').value.trim();

    document.querySelectorAll('.error').forEach(e => e.textContent = '');

    if (nombre === '') errores.push({ field: 'nombre', message: 'El campo Nombre es obligatorio' });
    if (apellido === '') errores.push({ field: 'apellido', message: 'El campo Apellido es obligatorio' });
    if (direccion === '') errores.push({ field: 'direccion', message: 'El campo Dirección es obligatorio' });
    if (numero === '') errores.push({ field: 'numero', message: 'El campo Número es obligatorio' });
    if (ciudad === '') errores.push({ field: 'ciudad', message: 'Debe Seleccionar Ciudad' });

    if (nombre.length > 40) errores.push({ field: 'nombre', message: 'El Nombre no debe superar los 40 caracteres' });
    if (apellido.length > 40) errores.push({ field: 'apellido', message: 'El Apellido no debe superar los 40 caracteres' });
    if (direccion.length > 100) errores.push({ field: 'direccion', message: 'La Dirección no debe superar los 100 caracteres' });
    if (numero.length > 5) errores.push({ field: 'numero', message: 'El Número de la Dirección no debe superar los 5 caracteres' });
    if (piso && piso.length > 2) errores.push({ field: 'piso', message: 'El Número de Piso no debe superar los 2 caracteres' });
    if (departamento && departamento.length > 2) errores.push({ field: 'departamento', message: 'El Número de Departamento no debe superar los 2 caracteres' });

    if (!validarTextoSinNumeros(nombre)) errores.push({ field: 'nombre', message: 'El campo Nombre es obligatorio' });
    if (!validarTextoSinNumeros(apellido)) errores.push({ field: 'apellido', message: 'El campo Apellido es obligatorio' });
    if (!validarTextoSinNumeros(direccion)) errores.push({ field: 'direccion', message: 'El campo Dirección es obligatorio' });

    if (!validarNumeroPositivo(numero)) errores.push({ field: 'numero', message: 'El campo Número es obligatorio' });
    if (departamento && !validarNumeroPositivo(departamento)) errores.push({ field: 'departamento', message: 'El Número de Departamento no debe superar los 2 caracteres' });

    if (piso && !departamento) errores.push({ field: 'departamento', message: 'El Número de Departamento es obligatorio si ha ingresado piso' });

    if (errores.length > 0) {
        errores.forEach(error => {
            document.getElementById(`error-${error.field}`).textContent = error.message;
        });
    } else {
        if (registrosGuardados === 3) {
            let confirmacion = confirm('Se ha alcanzado el límite de 3 registros. ¿Desea eliminar uno?');
            if (confirmacion) {
                eliminarRegistro();
            } else {
                return;
            }
        } else {
            let nuevoPersonal = {
                nombre: nombre,
                apellido: apellido,
                direccion: direccion,
                numero: numero,
                piso: piso,
                departamento: departamento,
                ciudad: ciudad,
                sector: asignarSector()
            };

            personal.push(nuevoPersonal);
            registrosGuardados++;
            document.getElementById('form-personal').reset();
        }

        if (registrosGuardados >= 3) {
            document.getElementById('guardar').textContent = 'Cambiar registro';
        } else {
            document.getElementById('guardar').textContent = 'Guardar';
        }
    }
}

function eliminarRegistro() {
    let indice = prompt('Ingrese el número del registro que desea eliminar (1, 2 o 3):');
    if (isNaN(indice) || indice < 1 || indice > personal.length) {
        alert('El valor ingresado no es válido. Por favor, ingrese un número válido.');
        return;
    }
    indice--;
    let sectorLiberado = personal[indice].sector;
    sectores.push(sectorLiberado);
    personal.splice(indice, 1);
    registrosGuardados--;

    if (registrosGuardados < 3) {
        document.getElementById('guardar').textContent = 'Guardar';
    }
}

function listarPersonal(event) {
    event.preventDefault();
    let registros = document.getElementById('registros');
    registros.innerHTML = '';
    personal.forEach((p, index) => {
        let registro = document.createElement('div');
        let domicilio = `${p.direccion} ${p.numero}`;
        if (p.piso && p.departamento) {
            domicilio += `, Piso ${p.piso} departamento ${p.departamento}`;
        }
        registro.textContent = `${index + 1}. ${p.apellido}, ${p.nombre} cuyo domicilio es ${domicilio} de la Ciudad de ${p.ciudad} tiene asignado el sector ${p.sector}.`;
        registros.appendChild(registro);
    });
}

function asignarSector() {
    if (sectores.length === 0) {
        alert('No hay más sectores disponibles.');
        return 'N/A';
    }
    let indiceAleatorio = Math.floor(Math.random() * sectores.length);
    let sectorAsignado = sectores.splice(indiceAleatorio, 1)[0];
    return sectorAsignado;
}
