'use client';

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useRouter, usePathname } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { 
      title: 'جستجوی بارنامه', 
      path: '/panel/find-shipment',
      icon: <SearchIcon />,
    },
    { 
      title: 'بارنامه‌های فعال', 
      path: '/panel/active-shipments',
      icon: <LocalShippingIcon />,
    },
    { 
      title: 'گزارش ترخیص‌ها', 
      path: '/panel/completed-shipments',
      icon: <AssessmentIcon />,
    },
    { 
      title: 'پروفایل', 
      path: '/panel/profile',
      icon: <PersonIcon />,
    }
  ];

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '600px',
        zIndex: 1000,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        fontFamily: 'var(--font-vazirmatn)',
        backgroundColor: 'background.paper',
      }} 
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={pathname}
        onChange={(event, newValue) => {
          router.push(newValue);
        }}
        sx={{
          fontFamily: 'var(--font-vazirmatn)',
          '& .MuiBottomNavigationAction-root': {
            fontFamily: 'var(--font-vazirmatn)',
            minWidth: 'auto',
            padding: '6px 8px',
          },
          '& .MuiBottomNavigationAction-label': {
            fontFamily: 'var(--font-vazirmatn)',
            fontSize: '0.65rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
            lineHeight: 1.2,
            marginTop: '4px',
            '&.Mui-selected': {
              fontSize: '0.7rem',
              fontWeight: 600
            }
          },
          '& .MuiBottomNavigationAction-icon': {
            fontSize: '1.4rem',
            marginBottom: '2px',
          }
        }}
      >
        {menuItems.map((item) => (
          <BottomNavigationAction
            key={item.path}
            label={item.title}
            value={item.path}
            icon={item.icon}
            sx={{
              fontFamily: 'var(--font-vazirmatn)',
              '&.Mui-selected': {
                color: 'primary.main',
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
} 