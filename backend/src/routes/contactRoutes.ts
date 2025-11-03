import { Router } from 'express';
import { bulkUploadContacts, getStats } from '../controllers/contactController';

const router = Router();

router.post('/bulk', bulkUploadContacts);
router.get('/stats', getStats);

export default router;
