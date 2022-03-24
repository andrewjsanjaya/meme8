'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PostTag.belongsTo(models.Post)
      PostTag.belongsTo(models.Tag)
    }
  }
  PostTag.init({
    PostId: DataTypes.INTEGER,
    TagId:{ 
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate(instance, options) {
        instance.TagId = 10
      }
    },
    modelName: 'PostTag',
  });
  return PostTag;
};