import { Request, Response } from 'express';
import Report from '../models/Report';

// Get all reports (Admin only)
export const getReports = async (req: Request, res: Response) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
};

// Create a new report (Public)
export const createReport = async (req: Request, res: Response) => {
  const { reporterName, location, description } = req.body;
  try {
    const newReport = new Report({ reporterName, location, description });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    res.status(500).json({ message: 'Error creating report' });
  }
};

// Update report status (Admin only)
export const updateReportStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const report = await Report.findByIdAndUpdate(id, { status }, { new: true });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: 'Error updating report' });
  }
};
