const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const sequelize = require('../sequelizeConn');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 12);
  user.password = hashedPassword;
});

User.prototype.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

User.prototype.toJSON = function () {
  const values = {
    ..._.omit(this.get(), ['createdAt', 'updatedAt']),
  };

  return values;
};

const createUsers = async () => {
  try {
    await User.sync();
    console.log(`User table have been created`);
  } catch (error) {
    console.log(`Error creating table`);
  }
};

createUsers();

module.exports = User;
