class UsuarioService{
    constructor(UsuarioModel){
        this.usuario = UsuarioModel
    }

    async get(){
        const usuario = await this.usuario.findAll()
        return usuario
    }

    async adicionar(usuarioDTO){
        try{
            await this.usuario.create(usuarioDTO)
        } catch(erro){
            console.erro(erro.message)
            throw erro
        }
    }
}

module.exports = UsuarioService