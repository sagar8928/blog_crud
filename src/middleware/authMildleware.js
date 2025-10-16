import jwt from 'jsonwebtoken';

const JWT_SECRET = 'jwt_secret_key';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
};
