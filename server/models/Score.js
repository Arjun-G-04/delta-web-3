module.exports = (sequelize, DataTypes) => {
    const Score = sequelize.define("Score", {
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        maxScore: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    })

    Score.associate = (models) => {
        Score.belongsTo(models.Quiz)
        Score.belongsTo(models.User)
    }

    return Score
}