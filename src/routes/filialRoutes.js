const express =require('express');
const FilialController = require('../controllers/filial.controller');


const router=express.Router();

router.get('/AllFiliales',FilialController.AllFiliales);
router.get('/circuits',FilialController.AllCircuits);

module.exports=router;  