const fs = require('fs');
const path = require('path');
const axios = require('axios');

const CACHE_FILE_PATH = path.join(__dirname, '../data/exercises.json');
const RAPID_API_KEY = process.env.RAPID_API_KEY;

// Use standard ExerciseDB v2 API which returns full objects
const RAPID_API_HOST = 'exercisedb.p.rapidapi.com';
const RAPID_API_URL = 'https://exercisedb.p.rapidapi.com/exercises';

const getExercises = async (req, res) => {
  try {
    // 1. Check if cache exists
    if (fs.existsSync(CACHE_FILE_PATH)) {
      console.log('Serving exercises from local cache');
      const cachedData = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      const exercises = JSON.parse(cachedData);
      
      const { bodyPart } = req.query;
      let result = exercises;
      
      if (bodyPart && bodyPart !== 'all') {
        result = exercises.filter(ex => ex.bodyPart === bodyPart);
      }
      
      console.log(`Returning ${result.length} exercises (filtered by ${bodyPart || 'all'})`);
      return res.json(result);
    }

    // 2. If no cache, fetch from API
    console.log('Cache miss. Fetching from RapidAPI...');
    
    if (!RAPID_API_KEY) {
      console.error('RAPID_API_KEY is missing in backend environment variables');
      return res.status(500).json({ message: 'Server configuration error: RAPID_API_KEY missing' });
    }

    const options = {
      method: 'GET',
      url: RAPID_API_URL,
      params: { limit: '1300' }, 
      headers: {
        'X-RapidAPI-Key': RAPID_API_KEY,
        'X-RapidAPI-Host': RAPID_API_HOST
      }
    };

    console.log(`Making request to ${RAPID_API_URL} with host ${RAPID_API_HOST}`);
    const response = await axios.request(options);
    const exercises = response.data;
    
    // Validate response is array of objects
    if (!Array.isArray(exercises)) {
      console.error('Unexpected API response format:', typeof exercises, exercises);
      throw new Error('Invalid API response: Expected an array of exercises');
    }

    if (exercises.length > 0 && typeof exercises[0] === 'string') {
       console.error('API returned strings/IDs instead of objects. Wrong endpoint or params.');
       throw new Error('API returned IDs instead of detailed exercise objects');
    }

    // 3. Save to cache
    const dir = path.dirname(CACHE_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(exercises, null, 2));
    console.log(`Cached ${exercises.length} exercises to file.`);

    // 4. Return data
    const { bodyPart } = req.query;
    let result = exercises;
    if (bodyPart && bodyPart !== 'all') {
      result = exercises.filter(ex => ex.bodyPart === bodyPart);
    }

    res.json(result);

  } catch (error) {
    console.error('Error in getExercises:', error);
    if (error.response) {
       console.error('API Response:', error.response.status, error.response.data);
    }
    res.status(500).json({ message: 'Error fetching exercises', error: error.message });
  }
};

module.exports = { getExercises };
