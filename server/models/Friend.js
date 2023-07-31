module.exports = (sequelize, DataTypes) => {
    const Friend = sequelize.define("Friend", {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        friendId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return Friend
}