'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile)
      User.hasMany(models.Post)
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.BOOLEAN,
    status: DataTypes.BOOLEAN
  }, {
    hooks: {
      beforeCreate(instance, options) {
        instance.role = false
        instance.status = false
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};