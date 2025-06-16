const express = require('express');
const router = express.Router();
const checklistController = require('../controllers/checklistController');

router.post('/save', checklistController.saveChecklist);
router.get('/all', checklistController.getAllChecklists);
router.get('/:username', checklistController.getChecklist);

module.exports = router;
