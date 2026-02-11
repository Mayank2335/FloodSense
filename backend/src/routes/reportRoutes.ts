import express from 'express';
import { getReports, createReport, updateReportStatus } from '../controllers/reportController';

const router = express.Router();

router.get('/', getReports);
router.post('/', createReport);
router.put('/:id', updateReportStatus);

export default router;
