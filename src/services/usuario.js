require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
SALT = 8

//Responsável por fornecer serviços relacionados a usuários, como buscar todos os usuários no banco de dados e adicionar novos usuários. 
class UsuarioService{
    constructor(UsuarioModel){
        this.usuario = UsuarioModel
    }

    async get(){
        const usuario = await this.usuario.findAll()
        return usuario
    }

    geraToken(usuario) {
        const token = jwt.sign({id:usuario.id_usuario}, process.env.JWT_SECRET, {expiresIn:'1h'})
        return token;
    }

    async login(email, senha) {
        const usuario = await this.usuario.findOne({
            where: {
                email: email
            }
        });

        if (usuario === null) {
            throw new Error('Email incorreto');
        }

        const senhainvalida = bcrypt.compareSync(senha, usuario.senha);

        if (!senhainvalida) {
            throw new Error('Senha incorreta');
        }  
        const {nome} = usuario
        const token = this.geraToken(usuario);
        return { token, userData: { nome, email } }
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
            usuarioDTO.senha = bcrypt.hashSync(usuarioDTO.senha, SALT)
            await this.usuario.create(usuarioDTO)
        } catch(erro){
            console.error(erro.message)
            throw erro
        }
    }
    async buscarNome(req){
        try{
            const userId = req.userId
            const usuario = await this.usuario.findOne({
                where:{
                    id_usuario:userId
                } 
            })
            if (usuario){
                const usuarioNome = usuario.nome_usuario
                return usuarioNome
            }else{
                throw new Error('Usuário não encontrado.')
            }
        }catch(error){
            throw new Error("Não foi possível encontrar usuário");
        }
    }
    async deletar(req, res) {
        try {
            const userId = req.userId;

            const usuario = await this.usuario.findOne({
                where: {
                    id_usuario: userId
                }
            });
    
            if (usuario) {
                await usuario.destroy();
                res.status(200).json("Usuário excluído com sucesso.")
            } else {
                res.status(404).json("Usuário não encontrado.");
            }
        } catch (error) {
            res.status(500).json("Não foi possível excluir, tente novamente!");
        }
    }

    async mudarNome(req, novoNomeObj, res) {
        try{
            const userId = req.userId
            const novoNome = novoNomeObj.novoNome;
            const usuario = await this.usuario.findByPk(userId);

            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }
            usuario.nome_usuario = novoNome;
            await usuario.save()
            res.status(200).json("Nome do usuário alterado com sucesso.")
        } catch(error){
            res.status(400).json("Não foi possível editar, tente novamente!");
        }
    }

    async mudarEmail(req, novoEmail) {
        const userId = req.userId
        const usuario = await this.usuario.findByPk(userId);
    
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
    
        usuario.email = novoEmail;
        await usuario.save();
    
        return usuario;
    }

    async mudarTelefone(req, novoTelefone) {
        const userId = req.userId
        const usuario = await this.usuario.findByPk(userId);
    
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
    
        usuario.telefone = novoTelefone;
        await usuario.save();
    
        return usuario;
    }

    async mudarSenha(req, senhaAntiga, novaSenha) {
        const userId = req.userId
        console.log(userId)
        const usuario = await this.usuario.findByPk(userId);
    
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const senhainvalida = bcrypt.compareSync(senhaAntiga, usuario.senha)
        if (!senhainvalida) {
            throw new Error('Senha incorreta');
        }

        usuario.senha = bcrypt.hashSync(novaSenha, SALT)
        await usuario.save()
    
        return usuario;
    }
}
//Exportando
module.exports = UsuarioService