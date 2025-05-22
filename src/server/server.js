const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { subscribe } = require('diagnostics_channel');
const { error } = require('console');

//Generate secure token for password reset

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecurePassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}


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
  if (err) { throw err; }
  console.log('Database connected!');
})

//middleware

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.status(403).send({ message: 'No token provided. Unauthorized' })
  }

  jwt.verify(token, 'yourSecretKey', (err, decoded) => {
    if (err) {
      console.error('Token verification failed:', err.message);
      return res.status(403).send({ message: 'Invalid token. Unauthorized!' })
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
      return res.status(403).send({ message: 'Forbidden' });
    }
    next();
  };
}

//routes


app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({ message: 'Username, email and password are required!' });
  }

  try {

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send({ message: 'Error creating user' });
      }
      res.status(201).send({ message: 'Signup successful!' });
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
      return res.status(500).send({ message: 'Server error' });
    }
    if (results.length === 0) {
      console.error('User not found for ID:', userId);
      return res.status(404).send({ message: 'User not found' });
    }
    const user = results[0];
    res.status(200).send({ id: user.id, username: user.username, role: user.role });
  })
})

app.post('/save-result', verifyToken, (req, res) => {
  const { results } = req.body;
  const userId = req.userId;

  if (!results) {
    return res.status(400).send({ message: 'Results are required' });
  }

  const query = 'INSERT INTO test_results (user_id, result, date) VALUES (?, ?, NOW())';

  db.query(query, [userId, JSON.stringify(results)], (err) => {
    if (err) {
      console.error('Error saving results:', err);
      return res.status(500).send({ message: 'Failed to save results' })
    }
    res.status(200).send({ message: 'Results saved successfully!' })
  })
})

app.get('/user-results', verifyToken, (req, res) => {
  const userId = req.userId;

  const query = 'SELECT id, result, date FROM test_results WHERE user_id = ? ORDER BY date DESC';

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching test results: ', err);
      return res.status(500).send({ message: 'Failed to retrieve test results' });
    }

    if (results.length === 0) {
      res.status(404).send({ message: 'No test results found for this user' });
    }

    res.status(200).json(results);
  })
})

app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  console.log('[REQUEST] Forgot password for:', email);

  if (!email) return res.status(400).send({ message: 'Email is required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('[DB ERROR] While fetching user:', err);
      return res.status(500).send({ message: 'Server error' });
    }

    if (results.length === 0) {
      console.warn('[WARNING] Email not found in DB:', email);
      return res.status(404).send({ message: 'Email not found' });
    }

    const user = results[0];
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 3600000);

    const insertQuery = 'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)';
    db.query(insertQuery, [user.id, token, expiresAt], (insertErr) => {
      if (insertErr) {
        console.error('[DB ERROR] Inserting reset token:', insertErr);
        return res.status(500).send({ message: 'Error saving reset token' });
      }

      const resetLink = `http://localhost:3000/reset-password/${token}`;
      console.log('[INFO] Generated reset link:', resetLink);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'dalbitsum@gmail.com',
          pass: 'trep ajkj qbsx awjx'
        }
      });

      const mailOptions = {
        from: 'dalbitsum@gmail.com',
        to: email,
        subject: 'Reset Your Password',
        html: `<p>Click the link to reset your password:</p><a href="${resetLink}">${resetLink}</a>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('[EMAIL ERROR]', error);
          return res.status(500).send({ message: 'Failed to send email' });
        }

        console.log('[SUCCESS] Reset email sent:', info.response);
        res.send({ message: 'Reset link sent to your email' });
      });
    });
  });
});



app.post('/reset-password/:token', (req, res) => {

  const { token } = req.params;
  const { password } = req.body;

  const query = 'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW() LIMIT 1';

  db.query(query, [token], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).send({ message: 'Invalid or expired token' });
    }

    const resetEntry = results[0];
    const userId = resetEntry.user_id;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).send({ message: 'Error hashing password' });

      const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';

      db.query(updateQuery, [hashedPassword, userId], (updateErr) => {
        if (updateErr) return res.status(500).send({ message: 'Error updating password' });


        db.query('DELETE FROM password_resets WHERE user_id = ?', [userId]);

        res.send({ message: 'Password reset successfully' });
      });

    })
  })



})

app.get('/admin/stats', verifyToken, authorizeRole(['admin']), (req, res) => {
  const stats = {};

  const queries = {
    totalUsers: 'SELECT COUNT(*) AS count FROM users',
    normalUsers: 'SELECT COUNT(*) AS count FROM users WHERE role = "user"',
    contentCreators: 'SELECT COUNT(*) AS count FROM users WHERE role = "creator"',
    admins: 'SELECT COUNT(*) AS count FROM users WHERE role = "admin"',
    testsTaken: 'SELECT COUNT(*) AS count FROM test_results',
  };

  let completed = 0;
  const keys = Object.keys(queries);

  keys.forEach((key) => {
    db.query(queries[key], (err, result) => {
      if (err) {
        console.error(`Error fetching ${key}`);
        return res.status(500).send({ message: 'Server error'});
      }

      stats[key] = result[0].count;
      completed++;

      if (completed === keys.length) {
        res.json(stats);
      }
    });
  });

});

app.get('/admin/users', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = 'SELECT id, username, role FROM users ORDER BY id ASC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('[DB ERROR]', err);
      return res.status(500).send({ message: 'Failed to fetch users' });
    }
    res.status(200).json(results);
  });
});

app.delete('/admin/users/:id', verifyToken, authorizeRole(['admin']), (req, res) => {
  const userId = req.params.id;

  db.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).send({ message: 'Error deleting user' });
    }
    res.send({ message: 'User deleted successfully' });
  });
});

app.put('/admin/users/:id', verifyToken, authorizeRole(['admin']), (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!['user', 'admin', 'creator'].includes(role)) {
    return res.status(400).send({ message: 'Invalid role' });
  }

  db.query('UPDATE users SET role = ? WHERE id = ?', [role, userId], (err) => {
    if (err) {
      console.error('Error updating role:', err);
      return res.status(500).send({ message: 'Error updating user role' });
    }
    res.send({ message: 'User role updated' });
  });
});


app.post('/admin/add-content-creator', verifyToken, authorizeRole(['admin']), (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).send({ message: 'Username and email are required' });
  }

  const plainPassword = generateSecurePassword(10); 
  bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send({ message: 'Hash error' });

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "creator")';
    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'DB error' });
      }

      res.status(201).send({
        message: 'Content creator added',
        generatedPassword: plainPassword
      });
    });
  });
});



app.listen(5000, () => console.log('Server running on port 5000'))