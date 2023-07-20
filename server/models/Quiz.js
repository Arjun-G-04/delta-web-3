module.exports = (sequelize, DataTypes) => {
    const Quiz = sequelize.define("Quiz", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        visibility: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Quiz.associate = (models) => {
        Quiz.belongsTo(models.User)
        Quiz.hasMany(models.Question, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })

        Quiz.hasMany(models.Score, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })
    }

    return Quiz
}