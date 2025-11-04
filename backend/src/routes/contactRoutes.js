const { Router } = require('express');
const { bulkUploadContacts, getStats } = require('../controllers/contactController');

const router = Router();

router.post('/bulk', bulkUploadContacts);
router.get('/stats', getStats);

module.exports = router;
