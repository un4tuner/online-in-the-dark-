import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import type { Multer } from 'multer';

const router = express.Router();

const imagesStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../Images')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const uploadImages = multer({ 
  storage: imagesStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Only JPG and PNG files are allowed'));
  }
});

router.post('/upload', uploadImages.single('file'), (req: Request & { file?: Multer.File }, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filename: req.file.filename, originalname: req.file.originalname });
});

router.get('/list', (req, res) => {
  const dir = path.join(__dirname, '../../Images');
  fs.readdir(dir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Failed to list images' });
    res.json({ files });
  });
});

router.delete('/delete/:filename', (req, res) => {
  const filename = req.params.filename;
  const dir = path.join(__dirname, '../../Images');
  const filePath = path.join(dir, filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete image' });
    // Remove from ledger
    const ledgerPath = path.resolve(__dirname, '../../Data/uploaded-images.json');
    try {
      if (fs.existsSync(ledgerPath)) {
        let ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'));
        ledger = ledger.filter((entry) => entry.filename !== filename);
        fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
      }
    } catch (e) {
      // Ignore ledger errors for now
    }
    res.json({ success: true });
  });
});

router.post('/ledger', (req, res) => {
  const { filename, originalname, uploadedAt } = req.body;
  if (!filename || !uploadedAt) return res.status(400).json({ error: 'Missing required fields' });
  const ledgerPath = path.resolve(__dirname, '../../Data/uploaded-images.json');
  let ledger = [];
  try {
    if (fs.existsSync(ledgerPath)) {
      ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'));
    }
  } catch (e) {
    return res.status(500).json({ error: 'Failed to read ledger' });
  }
  ledger.push({ filename, originalname, uploadedAt });
  try {
    fs.writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to write ledger' });
  }
});

router.get('/ledger', (req, res) => {
  const ledgerPath = path.resolve(__dirname, '../../Data/uploaded-images.json');
  try {
    if (fs.existsSync(ledgerPath)) {
      const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf-8'));
      res.json(ledger);
    } else {
      res.json([]);
    }
  } catch (e) {
    res.status(500).json({ error: 'Failed to read ledger' });
  }
});

export default router; 