import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../config/database.config.js";
import dotenv from 'dotenv'

dotenv.config(``)

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'Email already exists',
        },
        validate: {
            notEmpty: {
                msg: 'Email address cannot be empty'
            },
            isEmail: {
                msg: 'Please enter a valid email'
            }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true,  // for google/microsoft users
        validate: {
            notEmpty: {
                msg: 'Password must required'
            },
            len: {
                args: [8, 14],
                msg: 'Password must be between 8 and 16'
            }
        }
    },
    role: {
        type: DataTypes.ENUM('invitee', 'admin'),
        defaultValue: 'admin',
    },
    authType: {
        type: DataTypes.ENUM('local', 'google', 'microsoft'),
        allowNull: false,
        defaultValue: local,
    },
    microsoftId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
    },
    googleId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
    },
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    lastLogin: {
        type: DataTypes.DATE
    },
    lastLoginMethod: {
        type: DataTypes.ENUM('local', 'google', 'microsoft')
    },
    timezone: {
        type: DataTypes.STRING,
        allowNull: true,
    }

}, {
    schema: process.env.DATABASE_SCHEMA_NAME,
    timestamps: true
})