const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
// const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

//User Models
const Admin = require('../../models/Admin');
// const Bus = require('../models/Bus');
// const Booking = require('../models/Booking');

// @route   POST routes/api/user
// @desc    Register user
// @access  Public
router.post(
  '/',
  [
    check('companyName', 'Company Name is required').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('phone', 'Please enter a valid Phone number')
      .not()
      .isEmpty()
      .isNumeric(),
    check('officeAddress', 'Office Address is required').not().isEmpty(),
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

    const { companyName, email, phone, officeAddress, password } = req.body;

    try {
      //See if Admin exists
      let admin = await Admin.findOne({ email });

      if (admin) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Admin already exists' }] });
      }

      // //Get users gravatar
      // const avatar = gravatar.url(email, {
      //   s: '200',
      //   r: 'pg',
      //   d: 'mm',
      // });

      admin = new Admin({
        companyName,
        email,
        phone,
        officeAddress,
        password
      });

      //Encrypt password
      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(password, salt);

      await admin.save();

      //Return jsonwebtoken
      const payload = {
        admin: {
          id: admin.id,
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

module.exports = router;
