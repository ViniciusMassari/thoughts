const User = require('../models/User.js');
const Thought = require('../models/Thought.js');

const { Op } = require('sequelize');

class ThoughtsController {
  constructor() {}

  static async showThoughts(req, res) {
    let search = '';
    let order = 'DESC';
    if (req.query.search) {
      search = req.query.search;
    }
    if (req.query.order === 'old') {
      order = 'ASC';
    }
    const thoughtsData = await Thought.findAll({
      include: User,
      where: {
        title: { [Op.like]: `%${search}%` },
      },
      order: [['createdAt', order]],
    });
    const thoughts = thoughtsData.map((result) => result.get({ plain: true }));
    const thoughtsWithFormatedDate = thoughts.map((result) => {
      const date = new Date(result.createdAt);
      const formattedDate = new Intl.DateTimeFormat('pt-BR').format(date);
      return { ...result, criadoEm: formattedDate };
    });

    const thoughtsQty = thoughts.length > 0 ? thoughts.length : false;

    res.render('thoughts/home', {
      thoughtsWithFormatedDate,
      search,
      thoughtsQty,
    });
  }

  static async dashboard(req, res) {
    let emptyThoughts = false;
    const userId = req.session.userid;
    const user = await User.findOne({
      where: { id: userId },
      include: Thought,
      plain: true,
    });

    if (!user) {
      res.redirect('/login');
    }

    const thoughts = user.Thoughts.map((result) => result.dataValues);
    if (thoughts.length === 0) {
      emptyThoughts = true;
    }
    res.render('thoughts/dashboard', { thoughts, emptyThoughts });
  }

  static createThought(req, res) {
    res.render('thoughts/create');
  }
  static async createThoughtSave(req, res) {
    const { title } = req.body;
    const thought = { title, UserId: req.session.userid };

    try {
      await Thought.create(thought);
      req.flash('message', 'Pensamento criado com sucesso !');
      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (error) {
      req.flash('message', 'Erro ao criar pensamento ! Tente novamente');
      res.render('thoughts/create');
      console.error('Houve um erro' + error);
    }
  }

  static async removeThought(req, res) {
    const id = req.body.id;
    const UserId = req.session.userid;

    try {
      await Thought.destroy({ where: { id, UserId } });
      req.flash('message', 'Removido com sucesso !');
      req.session.save(() => {
        res.redirect('/thoughts/dashboard');
      });
    } catch (error) {
      req.flash('message', 'Erro ao remover pensamento ! Tente novamente');
      res.render('thoughts/dashboard');
      console.error('Houve um erro' + error);
    }
  }

  static async updateThought(req, res) {
    const id = req.params.id;
    try {
      const thought = await Thought.findOne({ where: { id }, raw: true });
      res.render('thoughts/edit', { thought });
    } catch (error) {
      req.flash('message', 'Houve um erro, tente novamente !');
      res.render('thoughts/dashboard');
    }
  }

  static async updateThoughtSave(req, res) {
    const { title, id } = req.body;

    try {
      await Thought.update({ title }, { where: { id } });
      res.flash('message', 'Pensamento atualizado !');
      res.redirect('/thoughts/dashboard');
    } catch (error) {
      req.flash('message', 'Houve um erro, tente novamente !');
      res.redirect('/thoughts/dashboard');
    }
  }
}

module.exports = ThoughtsController;
