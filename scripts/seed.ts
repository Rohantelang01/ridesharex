
require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('../models/User');
const { Vehicle } = require('../models/Vehicle');
const { Wallet } = require('../models/Wallet');
const { Booking } = require('../models/Booking');
const { Notification: NotificationModel } = require('../models/Notification');
const { PlannedTrip } = require('../models/PlannedTrip');
const { Review } = require('../models/Review');
const { Trip } = require('../models/Trip');
const connectToDB = require('../lib/db').default;

// --- Sample Data for Randomization ---
const firstNames = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan', 'Krishna', 'Ishaan'];
const lastNames = ['Patil', 'Kulkarni', 'Deshmukh', 'Joshi', 'Gaikwad', 'Chavan', 'More', 'Jadhav', 'Shinde', 'Pawar'];

// --- Chandrapur Specific Data ---
const chandrapurAddresses = [
  {
    "addressLine1": "Ward No. 5, Main Road",
    "village": "Warora",
    "tehsil": "Warora",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442907",
    "coordinates": {
      "lat": 20.2286,
      "lng": 78.9995
    }
  },
  {
    "addressLine1": "Anandwan Ashram Road",
    "village": "Anandwan",
    "tehsil": "Warora",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442914",
    "coordinates": {
      "lat": 20.2054,
      "lng": 78.9752
    }
  },
  {
    "addressLine1": "Main Bazaar Road",
    "village": "Bhadrawati",
    "tehsil": "Bhadrawati",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442902",
    "coordinates": {
      "lat": 20.1032,
      "lng": 79.1308
    }
  },
  {
    "addressLine1": "Railway Station Road",
    "village": "Majri",
    "tehsil": "Bhadrawati",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442503",
    "coordinates": {
      "lat": 20.1187,
      "lng": 79.1604
    }
  },
  {
    "addressLine1": "Main Market Road",
    "village": "Ballarpur",
    "tehsil": "Ballarpur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442701",
    "coordinates": {
      "lat": 19.8398,
      "lng": 79.3554
    }
  },
  {
    "addressLine1": "Ghugus Colliery Road",
    "village": "Ghugus",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442505",
    "coordinates": {
      "lat": 19.7533,
      "lng": 79.3667
    }
  },
  {
    "addressLine1": "Tukum Ward No. 2",
    "village": "Tukum",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9478,
      "lng": 79.2976
    }
  },
  {
    "addressLine1": "Durgapur Main Road",
    "village": "Durgapur",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442404",
    "coordinates": {
      "lat": 19.9523,
      "lng": 79.2851
    }
  },
  {
    "addressLine1": "Padmapur Village Road",
    "village": "Padmapur",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9356,
      "lng": 79.3142
    }
  },
  {
    "addressLine1": "Chandur Gram Panchayat",
    "village": "Chandur",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442908",
    "coordinates": {
      "lat": 20.0021,
      "lng": 79.3654
    }
  },
  {
    "addressLine1": "Pathanpara Main Street",
    "village": "Pathanpara",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9645,
      "lng": 79.3189
    }
  },
  {
    "addressLine1": "Babhulgaon School Road",
    "village": "Babhulgaon",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.8987,
      "lng": 79.3023
    }
  },
  {
    "addressLine1": "Kosambi Temple Road",
    "village": "Kosambi",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442406",
    "coordinates": {
      "lat": 19.8812,
      "lng": 79.2845
    }
  },
  {
    "addressLine1": "Gangaikheda Village Center",
    "village": "Gangaikheda",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 20.0143,
      "lng": 79.3017
    }
  },
  {
    "addressLine1": "Mendha Main Road",
    "village": "Mendha",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9689,
      "lng": 79.2814
    }
  },
  {
    "addressLine1": "Saikheda Bus Stand",
    "village": "Saikheda",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9301,
      "lng": 79.3356
    }
  },
  {
    "addressLine1": "Chakora Market Road",
    "village": "Chakora",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9476,
      "lng": 79.2689
    }
  },
  {
    "addressLine1": "Tippa Village Road",
    "village": "Tippa",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 20.0012,
      "lng": 79.3198
    }
  },
  {
    "addressLine1": "Lakhani Main Street",
    "village": "Lakhani",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9145,
      "lng": 79.3176
    }
  },
  {
    "addressLine1": "Sohagpur Post Office Road",
    "village": "Sohagpur",
    "tehsil": "Chandrapur",
    "district": "Chandrapur",
    "state": "Maharashtra",
    "pincode": "442401",
    "coordinates": {
      "lat": 19.9814,
      "lng": 79.3342
    }
  }
];

const vehicleMakes = ['Maruti Suzuki', 'Hyundai', 'Tata', 'Mahindra', 'Kia', 'Toyota', 'Honda', 'Bajaj', 'Hero', 'Royal Enfield'];
const carModels = ['Swift', 'Creta', 'Nexon', 'XUV700', 'Seltos', 'Innova', 'City'];
const bikeModels = ['Splendor', 'Activa', 'Pulsar', 'Classic 350', 'Apache'];
const vehicleTypes = ['car', 'bike', 'auto'];
const reviewComments = [
    "Great ride, very smooth.",
    "The driver was very professional and friendly.",
    "Vehicle was clean and well-maintained.",
    "Punctual and efficient service.",
    "A pleasant journey, would recommend.",
    "Could have been better, the AC wasn't working properly.",
    "The driver was a bit late.",
    "Decent ride for the price.",
    "Very safe and responsible driver.",
    "Excellent service, will use again."
];

// --- Helper Functions ---
const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const generatePhone = () => `9${String(Math.floor(100000000 + Math.random() * 900000000))}`;
const generateLicense = () => `MH${Math.floor(10 + Math.random() * 90)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${new Date().getFullYear()}${Math.floor(1000000 + Math.random() * 9000000)}`;
const generatePlateNumber = (i: number, j: number) => `MH${i < 10 ? '0' + i : i} ${String.fromCharCode(65 + j)}${String.fromCharCode(65 + i)} ${Math.floor(1000 + Math.random() * 9000)}`;
const getRandomLocation = () => {
    const randomAddress = getRandomItem(chandrapurAddresses);
    return {
        address: `${randomAddress.village}, Maharashtra`,
        coordinates: randomAddress.coordinates
    };
};


// --- Main Seeding Function ---
const seedDatabase = async () => {
    console.log('Connecting to database...');
    await connectToDB();
    console.log('Database connected.');

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Wallet.deleteMany({});
    await Booking.deleteMany({});
    await NotificationModel.deleteMany({});
    await PlannedTrip.deleteMany({});
    await Review.deleteMany({});
    await Trip.deleteMany({});
    console.log('Previous data cleared.');

    console.log('Seeding new data...');
    const users = [];

    for (let i = 0; i < 20; i++) {
        const firstName = getRandomItem(firstNames);
        const lastName = getRandomItem(lastNames);

        // 1. Create User
        const roles = ['passenger'];
        if (Math.random() > 0.4) roles.push('driver');
        if (Math.random() > 0.6) roles.push('owner');

        const user = new User({
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}_${lastName.toLowerCase()}${i}@demo.com`,
            phone: generatePhone(),
            age: Math.floor(Math.random() * 30) + 20,
            gender: Math.random() > 0.5 ? 'male' : 'female',
            roles: [...new Set(roles)],
            password: 'password123',
            permanentAddress: chandrapurAddresses[i], // Assign a unique address from the list
            verification: { isAadhaarVerified: true, isPanVerified: true },
        });

        // 2. Add Driver Info if applicable
        if (user.roles.includes('driver')) {
            user.driverInfo = {
                licenseNumber: generateLicense(),
                hourlyRate: Math.floor(Math.random() * 150) + 100,
                vehicleTypes: [getRandomItem(vehicleTypes)],
                 status: 'AVAILABLE',
            };
        }
        
        const createdUser = await user.save();

        // 3. Add Owner Info & Vehicles if applicable
        if (createdUser.roles.includes('owner')) {
            const vehicleIds = [];
            const numVehicles = Math.random() > 0.7 ? 2 : 1;
            for (let j = 0; j < numVehicles; j++) {
                const vehicleType = getRandomItem(['car', 'bike']);
                const newVehicle = new Vehicle({
                    owner: createdUser._id,
                    make: getRandomItem(vehicleMakes),
                    vehicleModel: vehicleType === 'car' ? getRandomItem(carModels) : getRandomItem(bikeModels),
                    year: new Date().getFullYear() - Math.floor(Math.random() * 10),
                    color: getRandomItem(['White', 'Black', 'Silver', 'Red', 'Blue']),
                    plateNumber: generatePlateNumber(i, j),
                    vehicleType: vehicleType,
                    seatingCapacity: vehicleType === 'car' ? 5 : 2,
                    rcDocument: 'https://example.com/rc.pdf',
                    insurance: 'https://example.com/insurance.pdf',
                    perKmRate: vehicleType === 'car' ? (Math.floor(Math.random() * 8) + 10) : (Math.floor(Math.random() * 5) + 5),
                    isAvailable: true,
                });
                const savedVehicle = await newVehicle.save();
                vehicleIds.push(savedVehicle._id);
            }
             createdUser.ownerInfo = { vehicles: vehicleIds };
             await createdUser.save();
        }

        // 4. Create Wallet for the user
        const wallet = new Wallet({
            user: createdUser._id,
            generatedBalance: Math.floor(Math.random() * 2000),
            addedBalance: Math.floor(Math.random() * 5000),
        });
        await wallet.save();
        
        createdUser.wallet = wallet._id;
        await createdUser.save();
        
        users.push(createdUser);
        console.log(`Created user ${i + 1}: ${createdUser.name} with address in ${createdUser.permanentAddress.village}`);
    }

    // 5. Create Bookings, Trips, Reviews, etc.
    for (const user of users) {
        if (user.roles.includes('passenger')) {
            const numBookings = Math.floor(Math.random() * 3);
            for (let k = 0; k < numBookings; k++) {
                const driver = getRandomItem(users.filter(u => u.roles.includes('driver')));
                const owner = getRandomItem(users.filter(u => u.roles.includes('owner')));
                
                if (!driver || !owner) continue; // Skip if no driver or owner is available

                const estimatedFare = Math.floor(Math.random() * 500) + 100;
                const booking = new Booking({
                    passenger: user._id,
                    driver: driver._id,
                    owner: owner._id,
                    bookingType: Math.random() > 0.5 ? 'INSTANT' : 'SCHEDULED',
                    status: getRandomItem(['COMPLETED', 'CANCELLED', 'REQUESTED']),
                    pickup: getRandomLocation(),
                    dropoff: getRandomLocation(),
                    fare: { estimatedFare: estimatedFare },
                });

                const savedBooking = await booking.save();

                // Create a Trip for the Booking
                const trip = new Trip({
                    bookingId: savedBooking._id,
                });
                await trip.save();

                // Create a Review for the Booking
                const review = new Review({
                    bookingId: savedBooking._id,
                    reviewerId: user._id,
                    revieweeId: driver._id,
                    rating: Math.floor(Math.random() * 5) + 1,
                    comment: getRandomItem(reviewComments),
                    reviewType: 'passenger_to_driver',
                });
                await review.save();

                // Create a Notification
                const notification = new NotificationModel({
                    userId: driver._id,
                    type: 'booking_request',
                    title: 'New Booking Request',
                    message: `You have a new booking request from ${user.name}`,
                    relatedBookingId: savedBooking._id,
                });
                await notification.save();
            }
        }
    }
    
    // 6. Create Planned Trips
    for (const user of users) {
        if (user.roles.includes('owner') && user.ownerInfo && user.ownerInfo.vehicles.length > 0) {
            const numPlannedTrips = Math.floor(Math.random() * 2);
            for (let l = 0; l < numPlannedTrips; l++) {
                const plannedTrip = new PlannedTrip({
                    ownerId: user._id,
                    vehicleId: user.ownerInfo.vehicles[0],
                    title: `Trip to ${getRandomItem(chandrapurAddresses).village}`,
                    route: {
                        pickup: getRandomLocation(),
                        dropoff: getRandomLocation(),
                    },
                    scheduledDateTime: new Date(new Date().getTime() + Math.random() * 10 * 24 * 60 * 60 * 1000), // Within next 10 days
                    seatsAvailable: 4,
                    farePerSeat: Math.floor(Math.random() * 300) + 50,
                });
                await plannedTrip.save();
            }
        }
    }


    console.log(`
Successfully seeded ${users.length} users with unique Chandrapur addresses.`);
};

seedDatabase()
    .then(() => {
        console.log('Database seeding complete. Closing connection.');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('An error occurred during database seeding:');
        console.error(err);
        mongoose.connection.close();
    });
