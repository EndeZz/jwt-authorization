const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    // нет ли с таким email пользака в БД
    if (candidate) {
      throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // ссылка для активации

    // сохраняем пользака в БД
    const user = await UserModel.create({ email, password: hashPassword, activationLink });
    await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

    // Отправляем на почту письмо для активации
    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken); // Сохраняем refreshToken в БД

    // возвращаем инфу о пользователе и токены
    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    // ищем пользака
    const user = await UserModel.findOne({ activationLink });
    if (!user) {
      throw ApiError.BadRequest('Некорректная ссылка активации');
    }
    user.isActivated = true;
    await user.save();
  }
}

module.exports = new UserService();
