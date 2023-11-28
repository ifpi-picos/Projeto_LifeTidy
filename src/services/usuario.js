require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
SALT = 8
const nodemailer = require('nodemailer');
const crypto = require('crypto')

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
            throw {errors:[{msg: 'Esse email já está cadastrado!'}]}
        }
        try{
            usuarioDTO.senha = bcrypt.hashSync(usuarioDTO.senha, SALT)
            usuarioDTO.token_reset = null
            usuarioDTO.token_reset_validade = null
            await this.usuario.create(usuarioDTO)
        } catch(erro){
            console.error(erro.message)
            throw erro
        }
    }

    async buscarNome(req){
        try{
            const userId = req.userId
            console.log(userId)
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
            throw new Error("Não foi possível encontrar usuário" + err.message);
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
            res.status(400).json("Não foi possível editar, tente novamente!" + error.message);
        }
    }

    async mudarEmail(req, novoEmail, senha) {
        const userId = req.userId
        const usuario = await this.usuario.findByPk(userId);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }

        const emailExiste = await this.usuario.findOne({
            where: {
                email: novoEmail
            }
        })
        if (emailExiste != null){
            throw new Error('Esse email já está cadastrado!')
        }

        const senhainvalida = bcrypt.compareSync(senha, usuario.senha);
        if (!senhainvalida) {
            throw new Error('Senha incorreta');
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
    async buscarUsuario(emailUsuario, res) {
        const email = emailUsuario
        try{
            const usuario= await this.usuario.findOne({
                where: {
                    email: email
                }
            })
            if (!usuario){
                return res.status(400).json("Usuário não encontrado!")
            }
            const tokenRecuperacao = crypto.randomBytes(20).toString('hex');
            usuario.token_reset = tokenRecuperacao
            usuario.token_reset_validade = Date.now() + 3600000
            usuario.save()

            const transportador = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.SENHA,
                }
            })
            const emailOpcoes = {
                from: process.env.EMAIL,
                to: `${usuario.email}`,
                subject: 'Link para recuperar senha plataforma Lifetidy',
                text:
                    'Você recebeu esse email porque foi solicitado a recuperação da sua senha.\n\n'
                    + 'Por favor clique no link abaixo para continuar o processo de recuperação, realize a operação em até 1 hora.\n\n'
                    + `http://localhost:4000/usuarios/recuperacao/${tokenRecuperacao}\n\n`
                    + 'Se não foi você que solicitou a recuperação de senha apenas ignore este email.\n',
            }
            return new Promise((resolve, reject) => {
                transportador.sendMail(emailOpcoes, (err, response)=>{
                    if (err) {
                        reject('Falha devido a erro' + err)
                    } else {
                        resolve('Email enviado com sucesso!')
                    }
                })
            })
        }catch(error){
            console.error(error)
            throw new Error('Recuperação de senha sem sucesso!')
        }
    }

    async recuperacaoValidar(tokenUrl){
        const token = tokenUrl
        try{
            const usuario = await this.usuario.findOne({
                where: {
                    token_reset: token
                }
            })
            if(!usuario){
                throw new Error('Esse token não existe ou é inválido')
            }
            return usuario 
        }catch(err){
            throw new Error('Recuperação de senha falhou!')
        }
    }

    async recuperacaoMudar(Token, novaSenha){
        const token = Token
        try{
            const usuario = await this.usuario.findOne({
                where: {
                    token_reset: token
                }
            })
            if (!usuario) {
                throw new Error('Token inválido!');
            }
            usuario.senha = bcrypt.hashSync(novaSenha, SALT);
            usuario.token_reset = undefined;
            usuario.token_reset_validade = undefined;
            await usuario.save();
            return usuario;
        }catch(err){
            throw new Error('Recuperação de senha, erro!' + err)
        }
    }
}

//Exportando
module.exports = UsuarioService