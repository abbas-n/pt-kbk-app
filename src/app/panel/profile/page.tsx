'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Divider, Chip, Button, Switch, FormControlLabel } from '@mui/material';
import { FetchApi } from '../../../../utils/Helper';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { SvgIconComponent } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import SnackbarComp from '../../components/SnackbarComp';
import { useTheme } from '../../../contexts/ThemeContext';

interface UserInfo {
  ID: string;
  melli_code: string;
  name: string;
  mobile: string;
  status: string;
  date_created: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { mode, toggleTheme } = useTheme();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [snackbarMSG, setSnackbarMSG] = useState('');
  const [safirStatus, setSafirStatus] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    try {
      const res = await FetchApi('/tpAuth/getUserProfileData', 'GET', true);
      if (res.status === 200) {
        setUserInfo(res.data.data);
        setSafirStatus(res.data.safirStatusRS || null);
      } else {
        throw new Error(res.data?.message || 'Failed to fetch user info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات کاربر');
      setSnackbarMSG(err instanceof Error ? err.message : 'خطا در دریافت اطلاعات کاربر');
      setErrorSBOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0000-00-00') return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR');
  };

  const InfoRow = ({ icon: Icon, label, value, customValue }: {
    icon: SvgIconComponent,
    label: string,
    value: string | null,
    customValue?: React.ReactNode
  }) => (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      py: 1.25,
      px: 1,
      borderRadius: 1,
      transition: 'background-color 0.2s ease',
    }}>
      <Box sx={{
        bgcolor: 'rgba(25, 118, 210, 0.08)',
        p: 0.75,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 40,
        height: 40
      }}>
        <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
          {label}
        </Typography>
        {customValue || (
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.9rem' }}>
            {value || 'ثبت نشده'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 3, overflow: 'auto' }}>
      <Box sx={{ px: 2, maxWidth: 600, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: (theme) => `1px solid ${theme.palette.divider}`
          }}
        >
          {/* Header Section */}
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 3,
            pb: 2.5,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`
          }}>
            <AccountCircleIcon sx={{ color: 'primary.main', fontSize: 56, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: '1.25rem' }}>
              {userInfo?.name || 'کاربر'}
            </Typography>
            <Chip
              icon={userInfo?.status === 'Active' ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
              label={userInfo?.status === 'Active' ? 'حساب فعال' : 'حساب غیرفعال'}
              color={userInfo?.status === 'Active' ? 'success' : 'error'}
              size="small"
              sx={{
                height: 26,
                fontSize: '0.75rem',
                px: 1,
                '& .MuiChip-icon': {
                  color: 'inherit',
                  ml: 0.75,
                  mr: 0.25
                },
                '& .MuiChip-label': {
                  pl: 0.5
                }
              }}
            />
          </Box>

          {/* Loading/Error/Content */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          ) : userInfo ? (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                اطلاعات حساب
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <InfoRow icon={PersonIcon} label="نام" value={userInfo.name} />
                <InfoRow icon={BadgeIcon} label="کد سفیر" value={userInfo.ID} />
                <InfoRow icon={PhoneIcon} label="شماره موبایل" value={userInfo.mobile} />
                <InfoRow icon={BadgeIcon} label="کد ملی" value={userInfo.melli_code} />
                <InfoRow
                  icon={CalendarTodayIcon}
                  label="تاریخ ثبت نام"
                  value={formatDate(userInfo.date_created)}
                />
              </Box>
            </Box>
          ) : null}

          {/* Safir Status */}
          {safirStatus && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              bgcolor: 'action.hover'
            }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                وضعیت سفیر: <strong>{safirStatus}</strong>
              </Typography>
            </Box>
          )}

          {/* Theme Toggle Section */}
          <Box
            onClick={toggleTheme}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              mb: 2,
              borderRadius: 2,
              bgcolor: 'action.hover',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              '&:hover': {
                bgcolor: 'action.selected',
                transform: 'translateY(-1px)',
                boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                bgcolor: 'primary.main',
                p: 1,
                borderRadius: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 44
              }}>
                {mode === 'dark' ? (
                  <DarkModeIcon sx={{ color: 'white', fontSize: 22 }} />
                ) : (
                  <LightModeIcon sx={{ color: 'white', fontSize: 22 }} />
                )}
              </Box>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem' }}>
                  {mode === 'dark' ? 'تم تاریک' : 'تم روشن'}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  برای تغییر تم کلیک کنید
                </Typography>
              </Box>
            </Box>
            <Switch
              checked={mode === 'dark'}
              onChange={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              onClick={(e) => e.stopPropagation()}
              color="primary"
            />
          </Box>

          {/* Logout Button */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              py: 1.25,
              borderColor: 'error.main',
              color: 'error.main',
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              '& .MuiButton-startIcon': {
                marginRight: 0,
                marginLeft: 0.5
              },
              '&:hover': {
                borderColor: 'error.dark',
                bgcolor: 'error.light',
                color: 'error.dark',
              },
            }}
          >
            خروج از حساب کاربری
          </Button>
        </Paper>
      </Box>

      <SnackbarComp
        succesSBOpen={false}
        errorSBOpen={errorSBOpen}
        snackbarMSG={snackbarMSG}
        onClose={() => {
          setErrorSBOpen(false);
        }}
      />
    </Box>
  );
}

