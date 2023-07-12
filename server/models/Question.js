module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("Question", {
        question: {
            type: DataTypes.STRING,
            allowNull: false
        },
        optionOne: {
            type: DataTypes.STRING,
            allowNull: false
        },
        optionTwo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        optionThree: {
            type: DataTypes.STRING,
            allowNull: false
        },
        optionFour: {
            type: DataTypes.STRING,
            allowNull: false
        },
        answer: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    Question.associate = (models) => {
        Question.belongsTo(models.Quiz)
    }

    return Question
}