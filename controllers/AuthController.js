const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash('message', 'Usuário não encontrado');
      res.render('auth/login');
      return;
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      req.flash(
        'message',
        'Usuário não encontrado, verifique se email/senha estão corretos'
      );
      res.render('auth/login');
      return;
    }

    req.session.userid = user.id;
    req.flash('message', 'Login realizado com sucesso!');

    req.session.save(() => {
      res.redirect('/');
    });
  }

  static register(req, res) {
    res.render('auth/register');
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmPassword } = req.body;

    if (password != confirmPassword) {
      req.flash('message', 'As senhas não conferem, tente novamente!');
      res.render('auth/register');
      return;
    }

    const checkIfUserExists = await User.findOne({ where: { email } });
    if (checkIfUserExists) {
      req.flash('message', 'Usuário já existe!');
      res.render('auth/register');
      return;
    }
    const SALT_ROUNDS = 10;
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword,
    };

    User.create(user)
      .then((user) => {
        req.session.userid = user.id;
        req.flash('message', 'Cadastro realizado com sucesso!');
        req.session.save(() => {
          res.redirect('/');
        });
      })
      .catch((err) =>
        console.error('Não foi possível cadastrar o usuário', err)
      );
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/login');
  }
};
