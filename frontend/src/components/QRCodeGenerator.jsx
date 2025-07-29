import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  TextField,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { ArrowBack, Download, QrCode } from '@mui/icons-material';
import QRCode from 'qrcode.react';

const QRCodeGenerator = () => {
  const navigate = useNavigate();
  const [tableNumbers, setTableNumbers] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [message, setMessage] = useState('');

  const generateQRCodes = () => {
    if (!tableNumbers.trim()) {
      setMessage('Please enter table numbers');
      return;
    }

    const numbers = tableNumbers
      .split(',')
      .map(num => num.trim())
      .filter(num => num && !isNaN(num))
      .map(num => parseInt(num));

    if (numbers.length === 0) {
      setMessage('Please enter valid table numbers');
      return;
    }

    const codes = numbers.map(tableNum => ({
      tableNumber: tableNum,
      menuUrl: `${window.location.origin}/menu/${tableNum}`,
      statusUrl: `${window.location.origin}/status/${tableNum}`
    }));

    setGeneratedCodes(codes);
    setMessage(`Generated ${codes.length} QR codes successfully!`);
  };

  const downloadQRCode = (tableNumber, url, type) => {
    const canvas = document.getElementById(`qr-${tableNumber}-${type}`);
    if (canvas) {
      const link = document.createElement('a');
      link.download = `table-${tableNumber}-${type}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const downloadAllQRCodes = () => {
    generatedCodes.forEach(code => {
      setTimeout(() => {
        downloadQRCode(code.tableNumber, code.menuUrl, 'menu');
      }, 100);
      setTimeout(() => {
        downloadQRCode(code.tableNumber, code.statusUrl, 'status');
      }, 200);
    });
    setMessage('Downloading all QR codes...');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin/dashboard')}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1">
          <QrCode sx={{ mr: 1, verticalAlign: 'middle' }} />
          QR Code Generator
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generate QR Codes for Tables
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Enter table numbers separated by commas (e.g., 1,2,3,4,5)
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          <TextField
            label="Table Numbers"
            value={tableNumbers}
            onChange={(e) => setTableNumbers(e.target.value)}
            placeholder="1,2,3,4,5"
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            onClick={generateQRCodes}
            startIcon={<QrCode />}
          >
            Generate QR Codes
          </Button>
        </Box>
      </Paper>

      {generatedCodes.length > 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Generated QR Codes ({generatedCodes.length} tables)
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={downloadAllQRCodes}
            >
              Download All
            </Button>
          </Box>

          <Grid container spacing={3}>
            {generatedCodes.map((code) => (
              <Grid item xs={12} sm={6} md={4} key={code.tableNumber}>
                <Card>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Table {code.tableNumber}
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Menu QR Code
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <QRCode
                          id={`qr-${code.tableNumber}-menu`}
                          value={code.menuUrl}
                          size={120}
                          level="M"
                        />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => downloadQRCode(code.tableNumber, code.menuUrl, 'menu')}
                      >
                        Download Menu QR
                      </Button>
                    </Box>

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Status QR Code
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                        <QRCode
                          id={`qr-${code.tableNumber}-status`}
                          value={code.statusUrl}
                          size={120}
                          level="M"
                        />
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={() => downloadQRCode(code.tableNumber, code.statusUrl, 'status')}
                      >
                        Download Status QR
                      </Button>
                    </Box>

                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                      <Typography variant="caption" display="block">
                        Menu URL: {code.menuUrl}
                      </Typography>
                      <Typography variant="caption" display="block">
                        Status URL: {code.statusUrl}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={!!message}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
      >
        <Alert severity="info" onClose={() => setMessage('')}>
          {message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default QRCodeGenerator; 