'use client';

import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkTokenValidation } from '../../../utils/Helper';

interface NavbarProps {
  title?: string;
  showLogout?: boolean;
}

export default function Navbar({ title, showLogout = false }: NavbarProps) {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const isValid = await checkTokenValidation();
      if (!isValid) {
        localStorage.clear();
        router.push('/login');
      }
    };

    validateToken();
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        backgroundColor: 'background.paper',
        color: 'text.primary',
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 1, sm: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {title && (
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              {title}
            </Typography>
          )}
        </Box>

        <Box sx={{ 
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <Image
            src="/kbkNLC.png"
            alt="لوگو سامانه"
            width={50}
            height={50}
            priority
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {showLogout && (
            <IconButton
              onClick={handleLogout}
              sx={{
                color: 'primary.main',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.08)'
                }
              }}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
} 