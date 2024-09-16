const { faker } = require('@faker-js/faker/locale/el');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const path = require('path');

dotenv.config({ path: path.normalize(`${__dirname}/../config.env`) });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
const password = 'a1234567890!';

const seedUsers = async () => {
    await mongoose.connect(DB)

    await User.create({
        role: 'auditService',
        name: 'Ελεγκτική Αρχή',
        phone: faker.phone.number(),
        email: faker.internet.email(),
        password: password,
        passwordConfirm: password
    });

    let publicService;
    for (let i = 0; i < 5; i++) {
        publicService = await User.create({
            role: 'publicService',
            name: faker.company.name(),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            password: password,
            passwordConfirm: password
        });

        for (let i = 0; i < 5; i++) {
            await User.create({
                role: 'employee',
                service: publicService._id,
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                fatherName: faker.person.fullName({ sex: 'male' }),
                motherName: faker.person.fullName({ sex: 'female' }),
                dateOfBirth: faker.date.birthdate(),
                placeOfBirth: faker.location.city(),
                address: {
                    city: faker.location.city(),
                    address: faker.location.streetAddress(),
                    postalCode: faker.location.zipCode()
                },
                idNumber: faker.helpers.fromRegExp(/[A-Z]{2}[0-9]{6}/),
                vatNumber: faker.string.numeric(9),
                phone: faker.phone.number(),
                email: faker.internet.email(),
                password: password,
                passwordConfirm: password
            });
        }
    }

    await mongoose.disconnect();
}

seedUsers().then(() => {
    console.log("User seeding completed");
    process.exit(0);
}).catch(error => {
    console.error("Error seeding users:", error);
    process.exit(1);
});