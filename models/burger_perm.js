module.exports = function(sequelize, DataTypes) {
    var BurgerPerm = sequelize.define("BurgerPerm", {
      text: {
        type: DataTypes.STRING,
        // AllowNull is a flag that restricts a burger from being entered if it doesn't
        // have a text value
        allowNull: false,
        // len is a validation that checks that our burger is between 1 and 140 characters
        validate: {
          len: [1, 140]
        }
      }
    });
    return BurgerPerm;
  };