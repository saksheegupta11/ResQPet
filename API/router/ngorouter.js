import express from 'express';
// import '../model/connection.js';
const router=express.Router();

//to link controlller on router
import *as ngoController from '../controller/ngocontroller.js';
router.post("/save",ngoController.save);
router.get("/fetch",ngoController.fetch);   //to search
router.patch("/update",ngoController.update);   //to update
router.delete("/delete",ngoController.deleteNgo);   //to delete
router.post("/login",ngoController.login);   //to login
router.post("/forgot-password", ngoController.forgotPassword);
router.post("/verify-otp", ngoController.verifyOtp);
router.post("/reset-password", ngoController.resetPassword);
export default router;