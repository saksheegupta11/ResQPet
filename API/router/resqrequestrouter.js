import express from 'express';
const router=express.Router();
import *as rescueController from '../controller/rescuecontroller.js';
router.post("/save",rescueController.save);
router.get("/fetch",rescueController.fetch); //to read or fetch data
router.delete("/delete",rescueController.remove); //to delete data
router.patch("/update",rescueController.update);
export default router;