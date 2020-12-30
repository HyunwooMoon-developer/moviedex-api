/* eslint-disable no-undef */
require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const MOVIE = require('./movie-data.json');
const cors = require('cors');
const helmet = require('helmet');

const app = express();


app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

console.log(process.env.API_TOKEN)

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    next()
  })

app.get('/movie', function handleMovies(req, res){
    let response = MOVIE;
    //filter movies by genre if genre query param is present
    if(req.query.genre){
        response = response.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }
    //filter movies by country if country query param is present
    if(req.query.country){
        response = response.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }
    if(req.query.avg_vote){
        response = response.filter(movie => 
          Number(movie.avg_vote) >= Number(req.query.avg_vote))
    }
    res.json(response);
})


app.listen(8000, () => {
    console.log('local host 8000 connected');
})