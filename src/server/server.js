const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const multer = require('multer');
const path = require('path');
const { Parser } = require('json2csv');
const fs = require('fs');

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { subscribe } = require('diagnostics_channel');
const { error } = require('console');


const { spawn } = require('child_process');
const { exec } = require("child_process");
const { determineType } = require('../utils/personalityUtils');
//Generate secure token for password reset

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateSecurePassword(length = 10) {
  return crypto.randomBytes(length).toString('base64').slice(0, length);
}

function convertToCSV(data) {
  const headers = Object.keys(data[0]).join(",");
  const rows = data.map(row =>
    Object.values(row).map(val => `"${val}"`).join(",")
  );
  return [headers, ...rows].join("\n");
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pics/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `user_${req.userId}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

const app = express();

app.use(bodyParser.json());
app.use(cors());


app.use('/uploads/profile_pics', express.static('uploads/profile_pics'));
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

//login and signup




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

        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        const logQuery = `
          INSERT INTO access_logs (user_id, username, role, action, ip_address)
          VALUES (?, ?, ?, 'Login', ?)
        `;
        db.query(logQuery, [user.id, user.username, user.role, ip], (logErr) => {
          if (logErr) {
            console.error('Failed to insert access log:', logErr);

          }
        })

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

  const query = 'SELECT id, username, role, profile_pic FROM users WHERE id = ?';

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
    res.status(200).send({ id: user.id, username: user.username, role: user.role, profilePic: user.profile_pic });
  })
})


//test routes
app.post('/save-result', verifyToken, (req, res) => {
  const { results } = req.body;
  const userId = req.userId;
  const userType = determineType(results);
  if (!results) {
    return res.status(400).send({ message: 'Results are required' });
  }

  const query = 'INSERT INTO test_results (user_id, result, type, date) VALUES (?, ?, ?, NOW())';

  db.query(query, [userId, JSON.stringify(results), userType], (err) => {
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


//password
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

//admin

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
        return res.status(500).send({ message: 'Server error' });
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

  const plainPassword = "ChangeMe";
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

app.get('/admin/content-creators', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = 'SELECT id, username FROM users WHERE role = "creator"';
  db.query(query, (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to fetch content creators' });
    res.json(results);
  });
});

app.get('/admin/creator/:id', verifyToken, authorizeRole(['admin']), (req, res) => {
  const creatorId = req.params.id;

  const query = `
    SELECT 
      id, username, email, created_at AS joined,
      (SELECT COUNT(*) FROM articles WHERE creator_id = ?) AS articles,
      (SELECT COUNT(*) FROM surveys WHERE creator_id = ?) AS surveys
    FROM users
    WHERE id = ? AND role = 'creator'
  `;

  db.query(query, [creatorId, creatorId, creatorId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Error fetching creator info' });
    if (results.length === 0) return res.status(404).send({ message: 'Creator not found' });
    res.json(results[0]);
  });
});

app.get('/admin/creator-content/:id', verifyToken, authorizeRole(['admin']), (req, res) => {
  const creatorId = req.params.id;
  console.log('[DEBUG] Fetching content for creator:', creatorId); // ✅

  const query = `
    SELECT id, creator_id, title, 'article' AS type, created_at AS date
    FROM articles
    WHERE creator_id = ?

    UNION ALL

    SELECT id, creator_id, title, 'survey' AS type, created_at AS date
    FROM surveys
    WHERE creator_id = ?

    ORDER BY date DESC
  `;

  db.query(query, [creatorId, creatorId], (err, results) => {
    if (err) {
      console.error('[ERROR] DB Query:', err);
      return res.status(500).send({ message: 'Error fetching creator content' });
    }

    console.log('[SUCCESS] Content fetched:', results); // ← Add this line

    res.json(results.map(row => ({ ...row })));  // Flatten RowDataPacket

  });

});



//creator

app.post('/creator/articles', verifyToken, authorizeRole(['creator']), (req, res) => {
  const { title, content } = req.body;
  const creatorId = req.userId;

  if (!title || !content) {
    return res.status(400).send({ message: 'Title and content are required' });
  }

  const query = 'INSERT INTO articles (creator_id, title, content) VALUES (?, ?, ?)';
  db.query(query, [creatorId, title, content], (err) => {
    if (err) {
      console.error('Article creation failed:', err);
      return res.status(500).send({ message: 'Database error' });
    }

    res.status(201).send({ message: 'Article created successfully!' });
  });
});

app.get('/creator/articles', verifyToken, authorizeRole(['creator']), (req, res) => {
  const userId = req.userId;
  const query = 'SELECT id, title, content, created_at FROM articles WHERE creator_id = ? ORDER BY created_at DESC';

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Error fetching articles' });
    res.status(200).json(results);
  });
});


app.put('/creator/articles/:id', verifyToken, authorizeRole(['creator']), (req, res) => {
  const userId = req.userId;
  const articleId = req.params.id;
  const { title, content } = req.body;

  const query = `
    UPDATE articles 
    SET title = ?, content = ?, updated_at = NOW() 
    WHERE id = ? AND creator_id = ?`;

  db.query(query, [title, content, articleId, userId], (err, result) => {
    if (err) return res.status(500).send({ message: 'Error updating article' });
    res.send({ message: 'Article updated successfully' });
  });
});

app.delete('/creator/articles/:id', verifyToken, authorizeRole(['creator']), (req, res) => {
  const userId = req.userId;
  const articleId = req.params.id;

  const query = 'DELETE FROM articles WHERE id = ? AND creator_id = ?';
  db.query(query, [articleId, userId], (err) => {
    if (err) return res.status(500).send({ message: 'Error deleting article' });
    res.send({ message: 'Article deleted successfully' });
  });
});

app.get('/public/recent-articles', (req, res) => {
  const query = `
    SELECT a.id, a.title, a.content, a.created_at, u.username 
    FROM articles a
    JOIN users u ON a.creator_id = u.id
    ORDER BY a.created_at DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent articles:', err);
      return res.status(500).send({ message: 'Failed to load articles' });
    }

    const trimmed = results.map(a => ({
      ...a,
      contentPreview: a.content.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
    }));

    res.json(trimmed);
  });
});

app.get('/public/recent-surveys', (req, res) => {
  const query = `
    SELECT s.id, s.title, s.created_at, u.username 
    FROM surveys s
    JOIN users u ON s.creator_id = u.id
    ORDER BY s.created_at DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching recent surveys:', err);
      return res.status(500).send({ message: 'Failed to load surveys' });
    }

    const trimmed = results.map(s => ({
      ...s,

    }));

    res.json(trimmed);
  });
});

app.get('/public/article/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM articles WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (result.length === 0) return res.status(404).json({ error: "Article not found" });
        res.json(result[0]);
    });
});

app.get('/public/get-author/:aid', (req, res) => {

  const aid = req.params.aid;
  const sql = "SELECT username FROM users WHERE id = ?";
  db.query(sql, [aid], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.length === 0) return res.status(404).json({ error: "Author not found" });
    res.json(result[0]);
  });
});


app.post('/admin/add-admin', verifyToken, authorizeRole(['admin']), (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).send({ message: 'Username and email are required' });
  }

  const plainPassword = generateSecurePassword(10);
  bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
    if (err) return res.status(500).send({ message: 'Hash error' });

    const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "admin")';
    db.query(query, [username, email, hashedPassword], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send({ message: 'DB error' });
      }

      res.status(201).send({
        message: 'Admin added',
        generatedPassword: plainPassword
      });
    });
  });
});


app.post('/admin/send-message', verifyToken, authorizeRole(['admin']), (req, res) => {
  const senderId = req.userId;  // admin's ID
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).send({ message: 'Receiver and message are required.' });
  }

  const query = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(query, [senderId, receiverId, message], (err) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).send({ message: 'Failed to send message.' });
    }

    const notifyQuery = "INSERT INTO notifications (user_id, type, content_id, status, date) VALUES (?, 'message', LAST_INSERT_ID(), 'unseen', NOW())";

    db.query(notifyQuery, [receiverId], (notifyErr) => {
      if (notifyErr) console.error("Notification error: ", notifyErr);
    })

    return res.status(201).send({ message: 'Message sent successfully!' });

    //console.log("Message sent!");
  });
});


app.post('/creator/send-message', verifyToken, authorizeRole(['creator']), (req, res) => {
  const senderId = req.userId;  // admin's ID
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).send({ message: 'Receiver and message are required.' });
  }

  const query = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(query, [senderId, receiverId, message], (err) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).send({ message: 'Failed to send message.' });
    }

    const notifyQuery = "INSERT INTO notifications (user_id, type, content_id, status, date) VALUES (?, 'message', LAST_INSERT_ID(), 'unseen', NOW())";

    db.query(notifyQuery, [receiverId], (notifyErr) => {
      if (notifyErr) console.error("Notification error: ", notifyErr);
    })

    return res.status(201).send({ message: 'Message sent successfully!' });

    //console.log("Message sent!");
  });
});

app.post('/user/send-message', verifyToken, authorizeRole(['user']), (req, res) => {
  const senderId = req.userId;  // admin's ID
  const { receiverId, message } = req.body;

  if (!receiverId || !message) {
    return res.status(400).send({ message: 'Receiver and message are required.' });
  }

  const query = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
  db.query(query, [senderId, receiverId, message], (err) => {
    if (err) {
      console.error('Error saving message:', err);
      return res.status(500).send({ message: 'Failed to send message.' });
    }

    const notifyQuery = "INSERT INTO notifications (user_id, type, content_id, status, date) VALUES (?, 'message', LAST_INSERT_ID(), 'unseen', NOW())";

    db.query(notifyQuery, [receiverId], (notifyErr) => {
      if (notifyErr) console.error("Notification error: ", notifyErr);
    })

    return res.status(201).send({ message: 'Message sent successfully!' });

    //console.log("Message sent!");
  });
});

app.get('/admin/message-partners', verifyToken, authorizeRole(['admin']), (req, res) => {
  const adminId = req.userId;

  const query = `
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.receiver_id
    WHERE m.sender_id = ?
    UNION
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.sender_id
    WHERE m.receiver_id = ?
  `;

  db.query(query, [adminId, adminId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to fetch users' });
    res.json(results);
  });
});

app.get('/creator/message-partners', verifyToken, authorizeRole(['creator']), (req, res) => {
  const creatorId = req.userId;

  const query = `
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.receiver_id
    WHERE m.sender_id = ?
    UNION
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.sender_id
    WHERE m.receiver_id = ?
  `;

  db.query(query, [creatorId, creatorId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to fetch users' });
    res.json(results);
  });
});


app.get('/user/message-partners', verifyToken, authorizeRole(['user']), (req, res) => {
  const userId = req.userId;

  const query = `
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.receiver_id
    WHERE m.sender_id = ?
    UNION
    SELECT DISTINCT u.id, u.username, u.role
    FROM users u
    JOIN messages m ON u.id = m.sender_id
    WHERE m.receiver_id = ?
  `;

  db.query(query, [userId, userId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to fetch users' });
    res.json(results);
  });
});



app.get('/admin/messages/:userId', verifyToken, authorizeRole(['admin']), (req, res) => {
  const adminId = req.userId;
  const userId = req.params.userId;

  const query = `
    SELECT 
      m.*, u.username AS sender_username
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE 
      (sender_id = ? AND receiver_id = ?) 
      OR 
      (sender_id = ? AND receiver_id = ?)
    ORDER BY m.sent_at ASC
  `;

  db.query(query, [adminId, userId, userId, adminId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to load messages' });
    res.json(results);
  });
});

app.get('/creator/messages/:userId', verifyToken, authorizeRole(['creator']), (req, res) => {
  const creatorId = req.userId;
  const userId = req.params.userId;

  const query = `
    SELECT 
      m.*, u.username AS sender_username
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE 
      (sender_id = ? AND receiver_id = ?) 
      OR 
      (sender_id = ? AND receiver_id = ?)
    ORDER BY m.sent_at ASC
  `;

  db.query(query, [creatorId, userId, userId, creatorId], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to load messages' });
    res.json(results);
  });
});

app.get('/user/messages/:userId', verifyToken, authorizeRole(['user']), (req, res) => {
  const id = req.userId;
  const userId = req.params.userId;

  const query = `
    SELECT 
      m.*, u.username AS sender_username
    FROM messages m
    JOIN users u ON u.id = m.sender_id
    WHERE 
      (sender_id = ? AND receiver_id = ?) 
      OR 
      (sender_id = ? AND receiver_id = ?)
    ORDER BY m.sent_at ASC
  `;

  db.query(query, [id, userId, userId, id], (err, results) => {
    if (err) return res.status(500).send({ message: 'Failed to load messages' });
    res.json(results);
  });
});

app.get('/admin/test-results', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = `
    SELECT id, user_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, result
    FROM test_results
    ORDER BY date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('[ERROR] Fetching test results:', err);
      return res.status(500).send({ message: 'Error fetching test results' });
    }
    res.json(results);
  });
});

app.post('/creator/create-survey-full', verifyToken, authorizeRole(['creator']), (req, res) => {
  const { title, questions } = req.body;
  const creatorId = req.userId;

  if (!title || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).send({ message: 'Invalid input' });
  }

  db.beginTransaction(err => {
    if (err) return res.status(500).send({ message: 'Transaction failed' });

    db.query('INSERT INTO surveys (creator_id, title) VALUES (?, ?)', [creatorId, title], (err, result) => {
      if (err) return db.rollback(() => res.status(500).send({ message: 'Survey insert failed' }));

      const surveyId = result.insertId;

      const questionPromises = questions.map((q, index) => {
        return new Promise((resolve, reject) => {
          db.query(
            'INSERT INTO survey_questions (survey_id, question_text, question_type, required, `order`) VALUES (?, ?, ?, ?, ?)',
            [surveyId, q.question_text, q.question_type, q.required, index],
            (err, result) => {
              if (err) return reject(err);

              const questionId = result.insertId;

              if (q.question_type === 'single' || q.question_type === 'multiple') {
                const optionValues = q.options.map(opt => [questionId, opt, false]);

                if (q.isOtherEnabled) {
                  optionValues.push([questionId, 'Other', true]);
                }

                db.query(
                  'INSERT INTO survey_options (question_id, option_text, is_other) VALUES ?',
                  [optionValues],
                  (err) => {
                    if (err) return reject(err);
                    resolve();
                  }
                );
              } else {
                resolve();
              }
            }
          );
        });
      });

      Promise.all(questionPromises)
        .then(() => {
          db.commit(err => {
            if (err) return db.rollback(() => res.status(500).send({ message: 'Commit failed' }));
            res.status(201).send({ message: 'Survey and questions saved' });
          });
        })
        .catch(err => {
          console.error(err);
          db.rollback(() => res.status(500).send({ message: 'Failed to save survey questions' }));
        });
    });
  });
});


app.get('/admin/surveys', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = `
    SELECT id, creator_id, title, DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at
    FROM surveys
    ORDER BY created_at DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('[ERROR] Fetching surveys:', err);
      return res.status(500).send({ message: 'Error fetching surveys' });
    }
    res.json(results);
  });
});

app.get('/admin/all-content', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = `
    SELECT id, creator_id, title, type, DATE_FORMAT(created_at, '%Y-%m-%d') AS date
    FROM (
      SELECT id, creator_id, title, 'article' AS type, created_at FROM articles
      UNION ALL
      SELECT id, creator_id, title, 'survey' AS type, created_at FROM surveys
    ) AS all_content
    ORDER BY date DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('[ERROR] Fetching all content:', err);
      return res.status(500).send({ message: 'Error fetching content' });
    }
    res.json(results);
  });
});


app.get('/admin/access-logs', verifyToken, authorizeRole(['admin']), (req, res) => {
  const query = `
    SELECT id, user_id, username, role, action, ip_address, 
           DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS time
    FROM access_logs
    ORDER BY timestamp DESC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).send({ message: 'Error fetching logs' });
    res.json(results);
  });
});


app.put('/me/update-profile', verifyToken, upload.single('profile_pic'), (req, res) => {
  const userId = req.userId;
  const { username, email } = req.body;
  const profilePic = req.file ? `/uploads/profile_pics/${req.file.filename}` : null;

  let updates = [];
  let params = [];

  if (username) {
    updates.push('username = ?');
    params.push(username);
  }

  if (email) {
    updates.push('email = ?');
    params.push(email);
  }

  if (profilePic) {
    updates.push('profile_pic = ?');
    params.push(profilePic);
  }

  if (updates.length === 0) {
    return res.status(400).send({ message: 'Nothing to update' });
  }

  const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  params.push(userId);

  db.query(query, params, (err) => {
    if (err) {
      console.error('[ERROR] Profile update failed:', err);
      return res.status(500).send({ message: 'Failed to update profile' });
    }

    res.send({ message: 'Profile updated successfully' });
  });
});


app.post('/me/change-password', verifyToken, (req, res) => {
  const userId = req.userId;
  const { currentPassword, newPassword } = req.body;

  const getUserPass = 'SELECT * FROM users WHERE id = ?';
  const user = db.query(getUserPass, [userId], async (err, results) => {
    if (err) {
      console.log("Error fetching user");
      return res.status(500).send({ message: "Server error" });

    } else if (results.length === 0) {
      console.log("User not found");
      return res.status(404).send({ message: "User not found" });
    }
    const user = results[0];
    const currentUserPassword = user.password;

    bcrypt.compare(currentPassword, currentUserPassword, (compareErr, match) => {
      if (compareErr) return res.status(500).send({ message: "Error comparing passwords" });

      if (!match) return res.status(401).send({ message: "Current password is incorrect" });

      bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
        if (err) res.status(500).send({ message: "Failed to hash new password" });

        const query = "UPDATE users SET password = ? WHERE id = ?";

        db.query(query, [hashedPassword, userId], (changeErr) => {
          if (changeErr) res.status(500).send({ message: "Failed to change password" });

          res.send({ message: "Password was changed successfully" });
        })
      })

    });


  });


})

app.get('/me/users', verifyToken, authorizeRole(['admin', 'creator', 'user']), (req, res) => {

  const id = req.userId;

  const query = 'SELECT id, username FROM users WHERE id != ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log('Database error:  ', err);
      return res.status(500).send({ message: 'Server error in fetching users' });
    }

    if (results.length === 0) {
      console.log("No other users were found");
      return res.status(404).send({ message: "No other users were found" });
    }

    const users = results;

    return res.status(200).send({ users: users });
  })
})


app.get('/me/notifications', verifyToken, authorizeRole(['admin', 'creator', 'user']), (req, res) => {

  const userId = req.userId;

  const query = "SELECT * FROM notifications WHERE user_id = ? AND status = 'unseen'";

  db.query(query, [userId], (err, results) => {

    if (err) {
      console.error("Failed to fetch notifications: ", err);
      return res.status(500).send({ message: "Server error" });
    }

    res.send(results);
  })
});

app.post('/me/notifications/mark-seen', verifyToken, authorizeRole(['admin', 'creator', 'user']), (req, res) => {

  const userId = req.userId;

  const query = "UPDATE notifications SET status = 'seen' WHERE user_id = ? AND status = 'unseen'";

  db.query(query, [userId], (err) => {

    if (err) {
      console.error("Error when updating notifications status: ", err);
      return res.status(500).send({ message: "Server error" });
    }

    res.send({ message: "Notifications marked as seen" });

  });


})

app.post('/creator/request-csv', verifyToken, authorizeRole(['creator']), (req, res) => {

  const creatorId = req.userId;
  const { requestFor, reason } = req.body;

  const query = "INSERT INTO csv_requests (creator_id, request_for, reason, status, created_at) VALUES (?, ?, ?, 'pending', NOW())";

  db.query(query, [creatorId, requestFor, reason], (err) => {
    if (err) console.error("Failed to send request: ", err);

    return res.status(201).send({ message: "Request sent seuccessfully!" });
  })

});

app.get('/admin/requests', verifyToken, authorizeRole(['admin']), (req, res) => {


  const query = "SELECT * FROM csv_requests";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Server error in fetching requests: ", err);
      return res.status(500).send({ message: "(Server) Failed to fetch requests." });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: "(Server) No requests found." });
    }

    res.send(results);
  })
})

app.post("/admin/approve-request/:id", verifyToken, authorizeRole(['admin']), (req, res) => {

  const adminId = req.userId;
  const requestId = req.params.id

  const query = 'SELECT * FROM research_data';


  db.query(query, (err, results) => {
    if (err) return res.status(500).send({ message: "DB error in approving request" });

    const parser = new Parser();
    const csv = parser.parse(results);

    const filePath = path.join(__dirname, 'exports', `research-data-${requestId}.csv`);

    fs.writeFile(filePath, csv, (err) => {
      if (err) return res.status(500).send({ message: "Failed to write file" });


      db.query("UPDATE csv_requests SET status='approved', responded_at = NOW(), responded_by = ?, file_path = ? WHERE id = ?",
        [adminId, `/download/${requestId}`, requestId], (updateErr) => {
          if (updateErr) return res.status(500).send({ message: "Failed to update request" });
          res.send({ message: "Request approved and file ready." });
        }
      )
    })
  })


})

app.post("/admin/reject-request/:id", verifyToken, authorizeRole(['admin']), (req, res) => {

  const adminId = req.userId;

  const requestId = req.params.id;

  const query = "UPDATE csv_requests SET status = 'rejected', responded_at = NOW(), responded_by = ? WHERE id = ?";

  db.query(query, [adminId, requestId], (err) => {

    if (err) {
      return res.status(500).send({ message: "(Server) Failed to reject request." });
    }

    res.status(200).send({ message: "Request rejected successfully." });
  })
})


app.get("/creator/requests", verifyToken, authorizeRole(['creator']), (req, res) => {
  const userId = req.userId;

  const query = "SELECT * FROM csv_requests WHERE creator_id = ?";
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send({ message: "DB error while fetching creator requests" });
    res.send(results);
  });
});



app.get('/download/:id', verifyToken, authorizeRole(['creator', 'admin']), (req, res) => {
  const requestId = req.params.id;

  // Match the file name generated during export
  const filePath = path.join(__dirname, 'exports', `research-data-${requestId}.csv`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", filePath);
      return res.status(404).send("File not found");
    }

    res.download(filePath, `research-data-${requestId}.csv`, (downloadErr) => {
      if (downloadErr) {
        console.error("Download failed:", downloadErr);
        res.status(500).send("Error sending file");
      }
    });
  });
});


app.post('/ml/analyze', (req, res) => {
  const data = req.body.data;
  if (!data || !Array.isArray(data)) {
    return res.status(400).send({ message: 'Invalid data format' });
  }

  // Save to temp CSV
  const csvFields = Object.keys(data[0]);
  const csvParser = new Parser({ fields: csvFields });
  const csv = csvParser.parse(data);
  const csvPath = path.join(__dirname, 'ml_input.csv');

  fs.writeFile(csvPath, csv, (err) => {
    if (err) {
      console.error('Failed to save CSV:', err);
      return res.status(500).send({ message: 'CSV write failed' });
    }

    // ✅ Use your Anaconda Python here:
    const pythonPath = 'C:\\Users\\inana\\anaconda3\\python.exe';
    const scriptPath = path.join(__dirname, 'ml_analyzer.py');

    const pythonProcess = spawn(pythonPath, [scriptPath, csvPath]);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python error:', errorOutput);
        return res.status(500).send({ message: 'Python script error', error: errorOutput });
      }

      try {
        const parsed = JSON.parse(output);
        res.json(parsed);
      } catch (e) {
        console.error('Failed to parse Python output:', output);
        res.status(500).send({ message: 'Invalid Python output', raw: output });
      }
    });
  });
});

app.get('/public/survey/:id', (req, res) => {
    const surveyId = req.params.id;

    const surveyQuery = `SELECT * FROM surveys WHERE id = ?`;
    const questionQuery = `SELECT * FROM survey_questions WHERE survey_id = ? ORDER BY survey_questions.order ASC`;
    const optionQuery = `SELECT * FROM survey_options WHERE question_id IN (?)`;

    db.query(surveyQuery, [surveyId], (err, surveyResult) => {
        if (err || surveyResult.length === 0) return res.status(404).json({ error: "Survey not found" });

        const survey = surveyResult[0];

        db.query(questionQuery, [surveyId], (err, questions) => {
            if (err) return res.status(500).json({ error: "Failed to get questions" });

            const questionIds = questions.map(q => q.id);
            if (questionIds.length === 0) {
                survey.questions = [];
                return res.json(survey);
            }

            db.query(optionQuery, [questionIds], (err, options) => {
                if (err) return res.status(500).json({ error: "Failed to get options" });

                const optionsMap = {};
                options.forEach(opt => {
                    if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = [];
                    optionsMap[opt.question_id].push(opt);
                });

                survey.questions = questions.map(q => ({
                    ...q,
                    options: optionsMap[q.id] || []
                }));

                res.json(survey);
            });
        });
    });
});


app.post('/public/survey/:id/submit', verifyToken, (req, res) => {
    const surveyId = req.params.id;
    const userId = req.userId; // or get from session/token
    const answers = req.body.answers;

    const responseQuery = `INSERT INTO survey_responses (user_id, survey_id, submitted_at) VALUES (?, ?, NOW())`;

    db.query(responseQuery, [userId, surveyId], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to save response" });

        const responseId = result.insertId;
        const answerEntries = Object.entries(answers);

        const answerValues = answerEntries.flatMap(([questionId, value]) => {
            if (Array.isArray(value)) {
                return value.map(v => [responseId, questionId, v]);
            } else {
                return [[responseId, questionId, value]];
            }
        });

        const insertAnswers = `INSERT INTO survey_answers (response_id, question_id, answer_text) VALUES ?`;

        db.query(insertAnswers, [answerValues], (err) => {
            if (err) return res.status(500).json({ error: "Failed to save answers" });
            res.json({ message: "Survey submitted successfully" });
        });
    });
});

app.get("/creator/see-surveys", verifyToken, authorizeRole(['creator']), (req, res) => {

  const query = "SELECT * FROM surveys";

  db.query(query, (err, results) => {
    if (err) {
      console.error("(Server) Failed to fetch surveys!");
      return res.status(500).send({ message: "(Server) Failed to fetch surveys!"});
    }

    res.status(200).send(results);
  })
})


app.get('/ml/survey-answers/:surveyId', (req, res) => {
  const surveyId = req.params.surveyId;

  const query = `
    SELECT 
      u.id AS user_id,
      tr.type AS personality_type,
      q.id AS question_id,
      q.question_text,
      a.answer_text
    FROM survey_answers a
    JOIN survey_responses sr ON a.response_id = sr.id
    JOIN survey_questions q ON a.question_id = q.id
    JOIN users u ON sr.user_id = u.id
    JOIN test_results tr ON u.id = tr.user_id
    WHERE sr.survey_id = ?
  `;

  db.query(query, [surveyId], (err, results) => {
    if (err) {
      console.error("Error fetching survey answers:", err);
      return res.status(500).send({ message: "Error retrieving answers" });
    }

    res.json(results);
  });
});


app.get('/creator/survey-columns/:surveyId', verifyToken, authorizeRole(['creator']), (req, res) => {
    const surveyId = req.params.surveyId;

    const query = `
        SELECT id, question_text
        FROM survey_questions
        WHERE survey_id = ?
        ORDER BY \`order\` ASC
    `;

    db.query(query, [surveyId], (err, results) => {
        if (err) {
            console.error("Error fetching survey columns:", err);
            return res.status(500).json({ error: 'Database error' });
        }

        // Send back an array of { id, question_text } for frontend to show
        const columns = results.map(row => ({
            id: row.id,
            label: row.question_text
        }));

        res.json(columns);
    });
});

app.post('/creator/ml/distribution', verifyToken, authorizeRole(['creator']), (req, res) => {
  const { surveyId, columnId } = req.body;
  const scriptPath = path.join(__dirname, 'distribution_tool.py');
  const pythonPath = 'C:\\Users\\inana\\anaconda3\\python.exe';

  const process = spawn(pythonPath, [scriptPath, surveyId, columnId]);

  let output = '';
  process.stdout.on('data', (data) => output += data.toString());
  process.stderr.on('data', (data) => console.error('stderr:', data.toString()));

  process.on('close', (code) => {
    try {
      const parsed = JSON.parse(output);
      res.json(parsed);
    } catch (e) {
      res.status(500).send({ error: 'Failed to parse script output' });
    }
  });
});

app.get('/me/overview/tests-taken', verifyToken, (req, res) => {

  const userId = req.userId;

  const query = "SELECT * FROM test_results WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("(Server) Failed to fetch user test results!");
      return res.status(500).send({ message: '(Server) Failed to fetch user test results'});
    }
    if (results.length === 0) {
      
      return res. status(200).send([]);
    }
    
    return res.status(200).send(results);
  })
})

app.listen(5000, () => console.log('Server running on port 5000'))