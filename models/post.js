'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Post.belongsTo(models.User)
      Post.hasMany(models.PostTag)
      Post.belongsToMany(models.Tag, {through: models.PostTag})
    }
  }
  Post.init({
    UserId: DataTypes.INTEGER,
    caption: DataTypes.STRING,
    url: DataTypes.STRING,
    like: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};