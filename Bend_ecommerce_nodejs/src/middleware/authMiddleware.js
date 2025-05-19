const jwt = require('jsonwebtoken');

const authenticateSeller = (req, res, next) => {
  try {

    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      

      if (decoded.role !== 'seller') {
        return res.status(403).json({ message: 'Access denied, not a seller' });
      }


      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }

  
};

const authenticateBuyer = (req, res, next) => {
  try {
 
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      

      if (decoded.role !== 'buyer') {
        return res.status(403).json({ message: 'Access denied, not a seller' });
      }


      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const authenticateToken = (req, res, next) => {
  try {

    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      
      req.user = decoded;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
module.exports = { authenticateSeller,authenticateBuyer,authenticateToken };

