import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import ngoSchemaModel from './model/ngomodel.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ResQPet";

async function seedAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB...");

        const adminEmail = "admin@resqpet.com";
        const password = "adminPassword123";

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const existingAdmin = await ngoSchemaModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin exists, updating password...");
            await ngoSchemaModel.updateOne({ email: adminEmail }, { password: hashedPassword });
            console.log("✅ Admin password updated!");
            process.exit(0);
        }

        // Find max ID
        const lastNgo = await ngoSchemaModel.find().sort({ _id: -1 }).limit(1);
        const nextId = (lastNgo.length === 0) ? 1 : lastNgo[0]._id + 1;

        const adminData = {
            _id: nextId,
            name: "System Admin",
            email: adminEmail,
            password: hashedPassword,
            mobile: "9999999999",
            address: "Admin Office",
            city: "Indore",
            pincode: "452001",
            role: "admin",
            status: 1, 
            info: "System Generated Admin"
        };

        await ngoSchemaModel.create(adminData);
        console.log("✅ Admin user created successfully!");
        console.log("Email: " + adminEmail);
        console.log("Password: adminPassword123");
        
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
}

seedAdmin();
