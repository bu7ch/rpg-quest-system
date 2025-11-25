const express = require('express');
const { getAvailableQuests, createQuest } = require('../controllers/QuestController');
const authGuard = require('../middleware/authGuard');
const router = express.Router();

router.get('/available', getAvailableQuests);

router.post('/', authGuard,createQuest);

module.exports = router;