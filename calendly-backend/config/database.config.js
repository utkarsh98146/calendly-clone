import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const DB_NAME = process.env.DATABASE_NAME
const DB_USER_NAME = process.env.DATABASE_USER_NAME
const DB_USER_PASSWORD = process.env.DATABASE_USER_PASSWORD
const DB_HOST_NAME = process.env.DATABASE_HOST_NAME
const DB_PORT_NO = process.env.DATABASE_PORT_NO

const dialectGroup = {
    '3306': 'mysql', // MySQL & MariaDB both runs same PORT
    '5432': 'postgres', // PostgreSQL
    '1433': 'mssql', // Microsoft SQL Server
    '1521': 'oracle', // Oracle
    '50000': 'db2', // IBM DB2
}

const dialect = dialectGroup[DB_PORT_NO] || 'postgres'

// Create a PostgreSQL client to check if database exists
async function createDatabaseIfNotExists() {
    const client = new pg.Client({
        user: DB_USER_NAME,
        password: DB_USER_PASSWORD,
        host: DB_HOST_NAME,
        port: DB_PORT_NO,
        database: process.env.DB_NAME, // Connect to default postgres database first
        dialect: dialect,
    })

    try {
        await client.connect()
        const query = `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
        const result = await client.query(query)

        if (result.rowCount === 0) {
            await client.query(`CREATE DATABASE "${DB_NAME}"`)
            console.log(`Database ${DB_NAME} created successfully.`)
        } else {
            console.log(`Database ${DB_NAME} already exists.`)
        }
    } catch (error) {
        console.error(`Error checking/creating database: ${error.message}`)
        throw error
    } finally {
        await client.end()
    }
}

// Initialize and export the Sequelize instance
export async function initializeDatabase() {
    try {

        await createDatabaseIfNotExists() // First ensure the database exists

        // Then create the Sequelize connection
        const sequelize = new Sequelize(DB_NAME, DB_USER_NAME, DB_USER_PASSWORD, {
            host: DB_HOST_NAME,
            port: DB_PORT_NO,
            dialect: dialect,
            logging: false,
        })


        await sequelize.authenticate() // Test the connection
        console.log('Database connection has been established successfully.')

        return sequelize
    } catch (error) {
        console.error(`Error connecting to the database: ${error.message}`)
        throw error
    }
}
export const sequelize = await initializeDatabase()