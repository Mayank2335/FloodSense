import { Request, Response } from 'express';
import Alert from '../models/Alert';

// Get all alerts
export const getAlerts = async (req: Request, res: Response) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts' });
  }
};

// Create a new alert (Admin only)
export const createAlert = async (req: Request, res: Response) => {
  const { title, description, severity, location } = req.body;
  try {
    const newAlert = new Alert({ title, description, severity, location });
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert' });
  }
};

// Delete an alert (Admin only)
export const deleteAlert = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await Alert.findByIdAndDelete(id);
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert' });
  }
};
