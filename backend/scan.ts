import { Router, Request, Response } from 'express';

const router = Router();

interface ScanPayload {
  barcode: string;
  timestamp: string;
  driverId: string;
}

router.post('/', (req: Request, res: Response) => {
  const { barcode, timestamp, driverId } = req.body as ScanPayload;

  // 1. Validation simple des champs requis
  if (!barcode || !timestamp || !driverId) {
    return res.status(400).json({ error: 'Missing required fields: barcode, timestamp, driverId' });
  }

  // 2. Log des données reçues (simulation de traitement)
  console.log(`[Scan API] Received scan:`, { barcode, timestamp, driverId });

  // 3. Réponse de succès
  res.status(200).json({
    status: 'received',
    barcode: barcode,
  });
});

export default router;