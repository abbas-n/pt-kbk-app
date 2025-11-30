import { Box, Paper, Typography, Grid } from '@mui/material';
import { ReactNode } from 'react';

interface ShipmentInfoFieldProps {
  label: string;
  value: string;
  icon: ReactNode;
  iconBgColor: string;
  xs?: number;
  sm?: number;
}

export default function ShipmentInfoField({
  label,
  value,
  icon,
  iconBgColor,
  xs = 12,
  sm = 6,
}: ShipmentInfoFieldProps) {
  return (
    <Grid xs={xs} sm={sm} sx={{ mb: 0.5 }}>
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mx: 0.25,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 1.5,
            bgcolor: iconBgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
            {label}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 600, 
              mt: 0.25,
              ...(label === 'تماس گیرنده' && { dir: 'ltr', textAlign: 'right' })
            }}
          >
            {value}
          </Typography>
        </Box>
      </Paper>
    </Grid>
  );
}

