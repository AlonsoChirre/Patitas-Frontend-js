window.addEventListener('load', function () {
    const MsgSucces = this.document.getElementById('MsgSucces');
    const MsgError = this.document.getElementById('MsgError');
    const Result = JSON.parse(this.localStorage.getItem('result'));
    const btnLogout = this.document.getElementById('btnLogout');
    const ResultLogout = JSON.parse(this.localStorage.getItem('resultLogout'));
    // mostrar nombre de usuario en alerta
    mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);
    
    
    if (resultLogout) {
        mostrarError(`${resultLogout.mensajeError}`);
    }

    btnLogout.addEventListener('click', function (event) {
        event.preventDefault();  // Prevenir que el enlace navegue por defecto
        logout();  // Llamar a la función logout
    });

});
function mostrarError(mensaje){
    MsgError.innerHTML = mensaje;
     MsgError.style.display = 'block';
     setTimeout(() => {
        ocultarAlerta();
    }, 3000);
}
function mostrarAlerta(mensaje) {
    MsgSucces.innerHTML = mensaje;
    MsgSucces.style.display = 'block';
    setTimeout(() => {
        ocultarAlerta();
    }, 5000);
}
function ocultarAlerta(mensaje){
    MsgError.innerHTML = '';
     MsgError.style.display = 'none';
}


async function logout() {
    //Consumiendo con FeignClient
    const url = 'http://localhost:8082/loginfeign/logout-async';
   // Consumir con WebClient const url = 'http://localhost:8082/login/logout-async';

    const result = JSON.parse(localStorage.getItem('result'));


    if (!result) {
        console.error("No se encontró el item 'result' en localStorage.");
        return;
    }
    const responseBody = {
        TipoDocumento: result.TipoDocumento,
        NumeroDocumento: result.NumeroDocumento
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(responseBody)
        });
        if (!response.ok) {
            console.error('Error al cerrar sesión: ', response.statusText);
            throw new Error(`Error: ${response.statusText}`);
        }

        const resultLogout = await response.json();
        console.log('Respuesta del servidor: ', resultLogout);

        if (resultLogout.resultado === true) {
            localStorage.setItem('resultLogout', JSON.stringify(resultLogout));
            localStorage.removeItem('result');
            window.location.replace('index.html');
        } else {
            localStorage.setItem('resultLogout', JSON.stringify(resultLogout));
            MostrarError(resultLogout.mensajeError);
        }
    } catch (error) {
        console.error('Error: Ocurrio un problema ', error);
        MostrarAlerta('Error: Ocurrio un problema ')
    }
};