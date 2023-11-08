const express = require('express')
const router = express.Router()
const {item} = require('../models')
const ItemService = require('../services/item')

const itemService = new ItemService(item)

router.get('/', async (req, res)=>{
    const item = await itemService.get()
    res.status(200).json(item)
})
module.exports = router