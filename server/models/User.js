module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    User.associate = (models) => {
        User.hasMany(models.Quiz, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })

        User.hasMany(models.Score, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        })
    }

    return User
}