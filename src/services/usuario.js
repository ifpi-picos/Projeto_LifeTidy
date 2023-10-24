//Responsável por fornecer serviços relacionados a usuários, como buscar todos os usuários no banco de dados e adicionar novos usuários. 
class UsuarioService{
    constructor(UsuarioModel){
        this.usuario = UsuarioModel
    }

    async get(){
        const usuario = await this.usuario.findAll()
        return usuario
    }

    async adicionar(usuarioDTO){
        //Verifica se já existe um email igual ao que vai ser adicionando ao banco de dados
        const email= await this.usuario.findOne({
            where: {
                email: usuarioDTO.email
            }
        })
        if (email != null){
            throw new Error('Esse email já está cadastrado!')
        }
        try{
            await this.usuario.create(usuarioDTO)
        } catch(erro){
            console.error(erro.message)
            throw erro
        }
    }
}
//Exportando
module.exports = UsuarioService