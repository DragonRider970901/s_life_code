const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





const app = express();

app.use(bodyParser.json());
app.use(cors());

//connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 's_life_code',
    }
)


db.connect((err) => {
    if (err) {throw err;}
    console.log('Database connected!');
})

//middleware

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if(!token) {
    console.error('No token provided');
    return res.status(403).send({ message: 'No token provided. Unauthorized'})
  }

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).send({ message: 'Invalid token. Unauthorized!'})
    }
    console.log('Token verified. User ID:', decoded.userId);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  })
}

const authorizeRole = (allowedRoles) => {

  return (req, res, next) => {
    const userRole = req.userRole;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).send( { message: 'Forbidden' });
    }
    next();
  };
}

//routes


app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
        return res.status(400).send({ message: 'Username, email and password are required!' });
    }

    try {

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        db.query(query, [username, email, hashedPassword], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send({ message: 'Error creating user'});
            }
            res.status(201).send({ message: 'Signup successful!'});
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Server error' });
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).send({ message: 'Username and password are required!' });
    }
  
    try {
      const query = 'SELECT * FROM users WHERE username = ?';
      db.query(query, [username], async (err, results) => {
        if (err) {
          console.error('Database query error:', err);
          return res.status(500).send({ message: 'Server error' });
        }
  
        if (results.length === 0) {
          return res.status(400).send({ message: 'Invalid username or password!' });
        }
  
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
  
        if (match) {
          const token = jwt.sign({ userId: user.id, role: user.role }, 'yourSecretKey', { expiresIn: '1h' });
          return res.status(200).send({ message: 'Login successful!', token });
        } else {
          return res.status(400).send({ message: 'Invalid username or password!' });
        }
      });
    } catch (error) {
      console.error('Unhandled server error:', error);
      res.status(500).send({ message: 'An unexpected error occurred' });
    }
  });

app.get('/me', verifyToken, (req, res) => {
  const userId = req.userId;

  const query = 'SELECT id, username, role FROM users WHERE id = ?';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send({ message: 'Server error'});
    }
    if (results.length === 0) {
      console.error('User not found for ID:', userId);
      return res.status(404).send({ message: 'User not found'});
    }
    const user = results[0];
    res.status(200).send({ id: user.id, username: user.username, role: user.role});
  })
})

app.post('/save-result', verifyToken, (req, res) => {
  const { results } = req.body;
  const userId = req.userId;

  if (!results) {
    return res.status(400).send({ message: 'Results are required'});
  }

  const query = 'INSERT INTO test_results (user_id, result, date) VALUES (?, ?, NOW())';

  db.query(query, [userId, JSON.stringify(results)], (err) => {
    if (err) {
      console.error('Error saving results:', err);
      return res.status(500).send({ message: 'Failed to save results'})
    }
    res.status(200).send({ message: 'Results saved successfully!'})
  })
})

app.get('/user-results', verifyToken, (req, res) => {
  const userId = req.userId;

  const query = 'SELECT id, result, date WHERE user_id = ? ORDER BY date DESC';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching test results: ', err);
      return res.status(500).send({ message: 'Failed to retrieve test results' });
    }

    if(results.length === 0 ) {
      res.status(404).send({ message: 'No test results found for this user' });
    }

    res.status(200).json(results);
  })
})

app.listen(5000, () => console.log('Server running on port 5000'))