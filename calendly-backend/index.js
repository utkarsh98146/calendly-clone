import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import { sequelize } from './config/database.config.js';
import passport, { session } from 'passport';
import { Strategy } from 'passport-google-oauth20';


dotenv.config()


const PORT = process.env.SERVER_PORT || 3000
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use(session(
    {
        secret: process.env.SECRET_KEY,
        resave: false, //stop resaving the session if no modification
        saveUninitialized: true, // save the session even not modified
    }
))

//*-*-*-*- Initialize Passport to authenticate users *-*-*-*

app.use(passport.initialize()) // initialize the passoword lib

// it will use the session to store the user information and integrate with passport-session,as the user information is stored in the session as they logged in
app.use(passport.session())

//*-*-*-*- Configure google OAuth credential *-*-*-*
passport.use(new Strategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => { // This function is called when the user is authenticated
        // The profile object contains the user information returned by Google
        console.log("User Profile: ", profile);

        // Here you can save the user information to your database
        return done(null, profile); //  profile is the user information returned by Google,we can use it to create a new user in our database
    }
))

//*-*-*-*- Serialize(saving the user data inside the session) and deserialize user(retriving the data from session) *-*-*-*

passport.serializeUser((user, done) => {
    done(null, user) // it will save the user information in the session
})

passport.deserializeUser((user, done) => {
    done(null, done)// it will retrieve the user information from the session
})

app.listen(PORT, (req, res) => {
    console.log(`Server started at http://localhost:${PORT}`)
})

sequelize.sync({ alter: true })
    .then(() => {
        console.log(`Database synchronized successfully..`)
    })
    .catch((err) => {
        console.log(`Database connection failed: ${err.message}`);

    })
