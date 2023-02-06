const socketClient = io()

const nombreUsuario = document.getElementById('NombreUsuario')
const formulario = document.getElementById('formulario')
const mensaje = document.getElementById('mensaje')
const btnEnviar = document.getElementById('btnEnviar')
const containerMensajes = document.getElementById('containerMensajes')

let usuario = null
if(!usuario){
    Swal.fire({
        title: 'Bienvenido',
        text: 'Ingrese su usuario😊',
        input: 'text',
        inputValidator:(value)=>{
            if(!value){
                return 'Necesitas enviar un usuario'
            }
        }
    })
    .then(username=>{
        usuario = username.value
        nombreUsuario.innerText = usuario
        socketClient.emit('nuevoUsuario',usuario)
    })
}

formulario.onsubmit = (e) =>{
    e.preventDefault()
    const info = {
        nombre:usuario,
        message: mensaje.value
    }
    socketClient.emit('mensaje',info)
    mensaje.value = ''
}

socketClient.on('chat', menssages=>{
    const htmlRender = menssages.map((m)=>{
        return `<p style="text-transform:uppercase;font-weight:bolder">${m.nombre}:</p><p>${m.message}</p>`
    }).join('')
    containerMensajes.innerHTML = htmlRender
})

socketClient.on('broadcast', nombreUsuario => {
    Toastify({
        text:`${nombreUsuario} is in the chat!`,
        duration:5000,
        position:'right',
        style: {
            background: "linear-gradient(to right, #00b05b, #96c93e)",
        },
    }).showToast()
})