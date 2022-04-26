

// @route   POST routes/api/bus
// @desc    Create Bus
// @access  Private
router.post('/', [auth,
    [
        check('busNumber', 'Bus Number is required').not().isEmpty().isNumeric(),
        check('startCity', 'Start city is required').not() .isEmpty (),
        check('destination', 'Destination is required').not().isEmpty (),
        check('totalSeats', 'Total Seats is required').not().isEmpty().isNumeric(),
        check('availableSeats', 'Available Seats is required').not().isEmpty().isNumeric(),
        check('pricePerSeat', 'Price Per Seats is required').not().isEmpty().isNumeric(),
        check('departureDate', 'Departure Date is required').not().isEmpty().isDate(),
        check('departureTime', 'Departure Time is required').not().isEmpty().isTime(),
        check('duration', 'Duration is required').not().isEmpty().isNumeric(),
    ]
],
async (req, res) => {      
    // set errors. It extracts the validation error from req and makes them available in a errors obj.
    const errors = validationResult(req);  

    // if any of the required info is missing it will be a bad request
    if (!errors.isEmpty()) {    
    //which is 400 and array is a method here to send the errors back as an array
        return res.status(400).json({errors: errors.array() }); 
    }

    //pulling from req.body
    const { busNumber, startCity, destination, totalSeats, availableSeats, pricePerSeats, departureDate, departureTime, duration } = req.body;  

    try {
    // see if user exists
    // to select data from collections in MongoDB findOne method is used.It makes the user to wait util the returns the result of the promise
        let bus= await Bus.findOne({ busNumber }); 

        if (bus) {
            return res.status (400).json({errors: [ { msg: 'Bus already exists'}]});
        }
    
        bus = new Bus({  
            busNumber, 
            startCity, 
            destination, 
            totalSeats, 
            availableSeats, 
            pricePerSeats, 
            departureDate, 
            departureTime, 
            duration
        })
        catch (err){
            console.error(err.message);
            res.status(500).send('Server error');
        }
      }
      )
    };