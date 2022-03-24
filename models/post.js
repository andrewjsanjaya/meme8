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
      Post.belongsToMany(models.Tag, {through: models.PostTag})
    }

    static popularPost(belongsToModel, belongsToManyModel) {
      let options = {
        include: [{model: belongsToModel}, {model: belongsToManyModel, through: {}}]
      }
      options.order = [['like', 'DESC']]
      
      return Post.findAll(options)
    }
  }
  Post.init({
    UserId: DataTypes.INTEGER,
    caption: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Caption is required'
        }
      }
    },
    url: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Url is required'
        },
        isUrl: {
          msg: 'Please check url format'
        }
      }
    },
    like: DataTypes.INTEGER
  }, {
    sequelize,
    hooks: {
      beforeCreate(instance, options) {
        instance.like = 0
      }
    },
    modelName: 'Post',
  });
  return Post;
};