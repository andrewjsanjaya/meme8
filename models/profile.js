'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    get formatDate() {
      return this.birthDate.toLocaleDateString('en-CA');
    }

    static associate(models) {
      Profile.belongsTo(models.User)
    }
  }
  Profile.init({
    UserId: {
      type: DataTypes.INTEGER,
    },
    fullName: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "Name can't be empty"}
      }
    },
    birthDate: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {msg: "Birth Date can't be empty"}
      }
    },
    location: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {msg: "Phone Number can't be empty"}
      }
    }
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};