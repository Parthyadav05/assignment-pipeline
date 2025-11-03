import mongoose from 'mongoose';
import Contact from '../models/Contact';
import ProcessingLog from '../models/ProcessingLog';
import { validatePhoneNumber, normalizePhoneNumber } from '../utils/validation';
import { ProcessingResult } from '../types';
import { Logger } from '../utils/logger';

export class ContactService {
  async processBulkContacts(phoneNumbers: string[]): Promise<ProcessingResult> {
    const valid: string[] = [];
    const invalid: string[] = [];
    const duplicates: string[] = [];

    const normalizedNumbers = new Set<string>();

    for (const phoneNumber of phoneNumbers) {
      const normalized = normalizePhoneNumber(phoneNumber);

      if (!validatePhoneNumber(normalized)) {
        invalid.push(phoneNumber);
        continue;
      }

      if (normalizedNumbers.has(normalized)) {
        duplicates.push(phoneNumber);
        continue;
      }

      normalizedNumbers.add(normalized);
      valid.push(normalized);
    }

    const existingContacts = await Contact.find({
      phoneNumber: { $in: valid },
    }).lean();

    const existingNumbers = new Set(existingContacts.map((c) => c.phoneNumber));

    const newValidNumbers = valid.filter((num) => {
      if (existingNumbers.has(num)) {
        duplicates.push(num);
        return false;
      }
      return true;
    });

    return {
      valid: newValidNumbers,
      invalid,
      duplicates,
    };
  }

  async saveContactsWithTransaction(result: ProcessingResult): Promise<void> {
    const isReplicaSet = await this.checkReplicaSetSupport();

    if (isReplicaSet) {
      await this.saveWithTransactions(result);
    } else {
      Logger.warn('MongoDB replica set not detected. Using atomic operations without transactions.');
      await this.saveWithAtomicOperations(result);
    }
  }

  private async checkReplicaSetSupport(): Promise<boolean> {
    try {
      const admin = mongoose.connection.db?.admin();
      if (!admin) return false;

      const status = await admin.serverStatus();
      return status.repl !== undefined;
    } catch (error) {
      return false;
    }
  }

  private async saveWithTransactions(result: ProcessingResult): Promise<void> {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        if (result.valid.length > 0) {
          const contactDocs = result.valid.map((phoneNumber) => ({
            phoneNumber,
          }));
          await Contact.insertMany(contactDocs, { session });

          const validLogs = result.valid.map((phoneNumber) => ({
            phoneNumber,
            status: 'valid' as const,
          }));
          await ProcessingLog.insertMany(validLogs, { session });
        }

        if (result.invalid.length > 0) {
          const invalidLogs = result.invalid.map((phoneNumber) => ({
            phoneNumber,
            status: 'invalid' as const,
          }));
          await ProcessingLog.insertMany(invalidLogs, { session });
        }

        if (result.duplicates.length > 0) {
          const duplicateLogs = result.duplicates.map((phoneNumber) => ({
            phoneNumber,
            status: 'duplicate' as const,
          }));
          await ProcessingLog.insertMany(duplicateLogs, { session });
        }
      });

      Logger.info('Transaction completed successfully', {
        valid: result.valid.length,
        invalid: result.invalid.length,
        duplicates: result.duplicates.length,
      });
    } catch (error) {
      Logger.error('Transaction failed', error);
      throw error;
    } finally {
      await session.endSession();
    }
  }

  private async saveWithAtomicOperations(result: ProcessingResult): Promise<void> {
    try {
      if (result.valid.length > 0) {
        const contactDocs = result.valid.map((phoneNumber) => ({
          phoneNumber,
        }));
        await Contact.insertMany(contactDocs, { ordered: false });

        const validLogs = result.valid.map((phoneNumber) => ({
          phoneNumber,
          status: 'valid' as const,
        }));
        await ProcessingLog.insertMany(validLogs, { ordered: false });
      }

      if (result.invalid.length > 0) {
        const invalidLogs = result.invalid.map((phoneNumber) => ({
          phoneNumber,
          status: 'invalid' as const,
        }));
        await ProcessingLog.insertMany(invalidLogs, { ordered: false });
      }

      if (result.duplicates.length > 0) {
        const duplicateLogs = result.duplicates.map((phoneNumber) => ({
          phoneNumber,
          status: 'duplicate' as const,
        }));
        await ProcessingLog.insertMany(duplicateLogs, { ordered: false });
      }

      Logger.info('Atomic operations completed successfully', {
        valid: result.valid.length,
        invalid: result.invalid.length,
        duplicates: result.duplicates.length,
      });
    } catch (error) {
      Logger.error('Atomic operations failed', error);
      throw error;
    }
  }

  async getStats() {
    const totalContacts = await Contact.countDocuments();

    const validCount = await ProcessingLog.countDocuments({ status: 'valid' });
    const invalidCount = await ProcessingLog.countDocuments({ status: 'invalid' });
    const duplicateCount = await ProcessingLog.countDocuments({ status: 'duplicate' });

    return {
      totalContacts,
      validContacts: validCount,
      invalidAttempts: invalidCount,
      duplicateAttempts: duplicateCount,
    };
  }
}
