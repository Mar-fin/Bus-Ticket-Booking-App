const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

//User Models
const User = require('../../models/User');

// @route   POST routes/api/user
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('gender', 'Gender is required').not().isEmpty(),
    check('phone', 'Please enter a valid Phone number')
      .not()
      .isEmpty()
      .isNumeric(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, gender, phone } = req.body;

    try {
      //See if User exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // //Get users gravatar
      // const avatar = gravatar.url(email, {
      //   s: '200',
      //   r: 'pg',
      //   d: 'mm',
      // });

      user = new User({
        name,
        email,
        // avatar,
        password,
        gender,
        phone,
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      //Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route     POST api/user/login
// @desc      User login
// @access    Public
router.post(
  '/login',
  [
      check('email', 'Please include a valid email').isEmail(),
      check('password','Password is required').exists()
],
async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
  // see if user exists
      let user= await User.findOne({ email});

      if (!user) {
          return res
          .status (400)
          .json({errors: [ { msg: 'Invalid Credentials'}]});
      }

  const isMatch = await bcrypt.compare (password, user.password);

  if(!isMatch) {
      return res
          .status (400)
          .json({errors: [ { msg: 'Invalid Credentials'}]});
  }

  const payload = {
      user: {
          id: user.id
      }
  };

  jwt.sign(
      payload,
      config.get('jwtSecret'),
      { expiresIn: 360000 },
      (err, token)=> {
          if(err) throw err;
          res.json({ token });
      }
      );
  } catch (err){
      console.error(err.message);
      res.status(500).send('Server error');
  }
}
);

// @route     GET api/user/viewProfile
// @desc      View the profile
// @access    Public
router.get('/viewProfile', auth, async (req, res) => {
  try {
      // findById method is used to find a single document by use its _id field.
      const user = await User.findById(req.user.id).select('-password'); // we dont need password
      res.json(user);
  } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

module.exports = router;
