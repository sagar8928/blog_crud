import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db3.js';

const router = express.Router();
const JWT_SECRET = 'jwt_secret_key';

// Register Route

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const [rows] = await db.execute('select * from users where email =?', [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'user is already esxists' });
    }
    // hased password
    const hasedPassword = await bcrypt.hash(password, 10);
    // insert users into database
    await db.execute(
      'insert into users ( username , email , password) values (?,?,?)',
      [username, email, hasedPassword]
    );
    res.json({ message: 'user is registered successfully' });
  } catch (err) {
    console.error('Registered error : ', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// login route

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.execute('select * from users where username = ?', [
      username,
    ]);
    // check if username is registered if not send error
    if (rows.length === 0) {
      return res.status(400).json({ message: 'invalide username ' });
    }

    const user = rows[0];
    // compare password
    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      return res.status(400).json({ message: 'invalide password' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'login is successfull',
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('Login error : ', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
