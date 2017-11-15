module.exports = (sequelize, Sequelize) => (
  sequelize.define('User', {
      email: Sequelize.STRING,
  }, {
      classMethods: {
          associate: function(models) {
              // associations can be defined here
          }
      }
  })
);