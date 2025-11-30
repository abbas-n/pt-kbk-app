'use client';

import { useEffect, useState } from 'react';
import { Box, Container, CircularProgress, Alert, Typography } from '@mui/material';
import { FetchApi } from '../../../utils/Helper';
import Navbar from '../components/Navbar';
import Image from 'next/image';

export default function PanelPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    try {
      const res = await FetchApi('/tpAuth/getUserProfileData', 'POST', true, JSON.stringify({}));
      if (res.status === 200) {
        setLoading(false);
      } else {
        throw new Error('Failed to fetch user info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <>
      <Navbar title="" showLogout={false} />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center',
            minHeight: '60vh',
            gap: 3
          }}>
            <Image
              src="/kbkNLC.png"
              alt="لوگو سامانه سفیران"
              width={200}
              height={200}
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain'
              }}
            />
            <Typography 
              variant="h4" 
              component="h1"
              sx={{
                fontFamily: 'var(--font-vazirmatn)',
                fontWeight: 600,
                color: 'primary.main',
                textAlign: 'center',
                letterSpacing: '0.5px',
                lineHeight: 1.5,
                textShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              سامانه سفیران کالارسان
            </Typography>
          </Box>
        )}
      </Container>
    </>
  );
} 