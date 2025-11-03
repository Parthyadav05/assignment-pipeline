import { Request, Response } from 'express';
import { ContactService } from '../services/contactService';
import { BulkUploadRequest, BulkUploadResponse, StatsResponse } from '../types';
import { Logger } from '../utils/logger';

const contactService = new ContactService();

export const bulkUploadContacts = async (
  req: Request<{}, {}, BulkUploadRequest>,
  res: Response<BulkUploadResponse>
): Promise<void> => {
  try {
    const { phoneNumbers } = req.body;

    if (!phoneNumbers || !Array.isArray(phoneNumbers)) {
      res.status(400).json({
        success: false,
        message: 'phoneNumbers must be an array',
        stats: {
          total: 0,
          valid: 0,
          invalid: 0,
          duplicates: 0,
        },
      });
      return;
    }

    if (phoneNumbers.length === 0) {
      res.status(400).json({
        success: false,
        message: 'phoneNumbers array cannot be empty',
        stats: {
          total: 0,
          valid: 0,
          invalid: 0,
          duplicates: 0,
        },
      });
      return;
    }

    Logger.info('Processing bulk upload', { count: phoneNumbers.length });

    const result = await contactService.processBulkContacts(phoneNumbers);

    await contactService.saveContactsWithTransaction(result);

    const stats = {
      total: phoneNumbers.length,
      valid: result.valid.length,
      invalid: result.invalid.length,
      duplicates: result.duplicates.length,
    };

    Logger.info('Bulk upload completed', stats);

    res.status(200).json({
      success: true,
      message: 'Contacts processed successfully',
      stats,
    });
  } catch (error) {
    Logger.error('Error in bulk upload', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      stats: {
        total: 0,
        valid: 0,
        invalid: 0,
        duplicates: 0,
      },
    });
  }
};

export const getStats = async (
  req: Request,
  res: Response<StatsResponse>
): Promise<void> => {
  try {
    Logger.info('Fetching stats');

    const stats = await contactService.getStats();

    res.status(200).json(stats);
  } catch (error) {
    Logger.error('Error fetching stats', error);
    res.status(500).json({
      totalContacts: 0,
      validContacts: 0,
      invalidAttempts: 0,
      duplicateAttempts: 0,
    });
  }
};
