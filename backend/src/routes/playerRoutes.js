const express = require('express');
const router = express.Router();
const authGuard = require('../middleware/authGuard');
const {
  getProfile,
  acceptQuest,
  useItem,
  completeQuest
} = require('../controllers/playerController');

router.use(authGuard);

router.get('/profile', getProfile);

router.post('/accept-quest/:questId', acceptQuest);

router.post('/complete-quest/:questId', completeQuest);
router.post('/use-item/:itemId', useItem);


module.exports = router;