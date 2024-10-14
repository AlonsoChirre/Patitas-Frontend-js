//se ejecuta cuando la pagina haya cargado completamente (DOM,CSS,IMAGENES,ETC)
//En caso desees ejecutar el JS apenas se haya cargado el DOM, puedes usar 2 tecnicas
// -> document.addEventListener('DOMContentLoaded',{});
//-> <script type="module" src="js/inicio.js" defer></script>
window.addEventListener('load', function(){
    
    //referenciar los controles del formulario
    const TipoDocumento = this.document.getElementById('TipoDocumento');
    const NumeroDocumento = this.document.getElementById('NumeroDocumento');
    const Password = this.document.getElementById('Password');
    const btnIngresar = this.document.getElementById('btnIngresar');
    const MsgError = this.document.getElementById('MsgError');
    const MsgSucces = this.document.getElementById('MsgSucces');
    const ResultLogout = JSON.parse(this.localStorage.getItem('ResultLogout'));

    if (resultLogout) {
        MostrarAlerta(`${resultLogout.MensajeError}`);
    }
    

    //implementar listener del boton
    btnIngresar.addEventListener('click',function(){
        //validar campos del formulario
        if(TipoDocumento.value === null || TipoDocumento.value.trim() === ''||
            NumeroDocumento.value === null || NumeroDocumento.value.trim() === ''||
            Password.value === null || Password.value.trim() === '' ){
                mostrarAlerta('Error: Debe completar correctamente sus credenciales');
                
                return;
            }
            ocultarAlerta();
            autenticar();
    });

});

function mostrarAlerta(mensaje){
    MsgError.innerHTML = mensaje;
     MsgError.style.display = 'block';
     setTimeout(() => {
        ocultarAlerta();
    }, 3000);
}
function ocultarAlerta(mensaje){
    MsgError.innerHTML = '';
     MsgError.style.display = 'none';
}
async function autenticar(){

    const url = 'http://localhost:8082/login/autenticar-async';
    const request = {
        TipoDocumento : TipoDocumento.value,
        NumeroDocumento: NumeroDocumento.value,
        Password: Password.value
    };

    try{
        const response = await fetch(url,{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(request)
    });
    if(!response.ok){
        MostrarAlerta('Error: Ocurrio un problema con la autenticacion');
        throw new Error(`Error: ${response.statusText}`);
    }
    //validar respuesta
    const result = await response.json();
    console.log('Respuesta del servidor: ', result);

    if(result.codigo === '00'){
        localStorage.setItem('result',JSON.stringify(result));
        localStorage.removeItem('resultLogout');
        window.location.replace('principal.html');
    }else{
        mostrarAlerta(result.mensaje);
    }
        

    }catch(error){
        console.log('Error: Ocurrió un problema ', error);
        MostrarAlerta('Error: Ocurrio un problema ')
    }
}