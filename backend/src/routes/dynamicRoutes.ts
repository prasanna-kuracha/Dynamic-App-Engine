import { Router } from 'express';
import { DynamicController } from '../controllers/DynamicController';

const router = Router();

router.get('/config', DynamicController.getConfig);
router.get('/data/:modelName', DynamicController.getAll);
router.post('/data/:modelName', DynamicController.create);

export default router;
