const { faker } = require('@faker-js/faker/locale/el');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Form = require('../models/formModel');
const path = require('path');
const axios = require('./../utils/axios');

dotenv.config({ path: path.normalize(`${__dirname}/../config.env`) });
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

const seedForms = async () => {
    await mongoose.connect(DB)

    const response = await axios.get(`${process.env.USER_SERVICE_URL}?role=employee`);

    const employees = response.data.data.users;

    const file = {
        name: 'sample.pdf',
        uri: 'public/files/sample.pdf'
    };

    for (let i = 0; i < employees.length - 1; i++) {
        for (let j = 0; j < 10; j++) {
            const status = faker.helpers.arrayElement(['pending', 'approved', 'rejected', 'completed']);
            const employee = employees[i];

            const form = await Form.create({
                user: employee._id,
                userName: `${employee.firstName} ${employee.lastName}`,
                email: employee.email,
                service: employee.service._id,
                serviceName: employee.service.name,
                status: status,
                year: 2020 + Math.floor(j / 2),
                semester: j % 2 === 0 ? 1 : 2,
                mainIncome: {
                    role: faker.lorem.word(),
                    carrier: faker.lorem.word(),
                    carrierCode: faker.string.uuid(),
                    income: [
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                    ]
                },
                extraIncome: [
                    {
                        role: faker.lorem.word(),
                        carrier: faker.lorem.word(),
                        carrierCode: faker.string.uuid(),
                        income: [
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        ],
                        file
                    },
                    {
                        role: faker.lorem.word(),
                        carrier: faker.lorem.word(),
                        carrierCode: faker.string.uuid(),
                        income: [
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                        ],
                        file
                    }
                ],
            });

            if (status === 'completed') {
                await Form.create({
                    user: employee._id,
                    parent: form._id,
                    userName: `${employee.firstName} ${employee.lastName}`,
                    email: employee.email,
                    service: employee.service._id,
                    serviceName: employee.service.name,
                    status: 'pending',
                    year: 2020 + Math.floor(j / 2),
                    semester: j % 2 === 0 ? 1 : 2,
                    mainIncome: {
                        role: faker.lorem.word(),
                        carrier: faker.lorem.word(),
                        carrierCode: faker.string.uuid(),
                        income: [
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                            { gross: faker.commerce.price(), net: faker.commerce.price() ,file },
                        ]
                    },
                    extraIncome: [
                        {
                            role: faker.lorem.word(),
                            carrier: faker.lorem.word(),
                            carrierCode: faker.string.uuid(),
                            income: [
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            ],
                            file
                        },
                        {
                            role: faker.lorem.word(),
                            carrier: faker.lorem.word(),
                            carrierCode: faker.string.uuid(),
                            income: [
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                                { gross: faker.commerce.price(), net: faker.commerce.price(), file },
                            ],
                            file
                        }
                    ],
                });
            }
        }

    }

    await mongoose.disconnect();
}

seedForms().then(() => {
    console.log("Form seeding completed");
    process.exit(0);
}).catch(error => {
    console.error("Error seeding forms:", error);
    process.exit(1);
});