'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Divider, Chip, Button } from '@mui/material';
import { FetchApi } from '../../../../utils/Helper';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { SvgIconComponent } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import SnackbarComp from '../../components/SnackbarComp';

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
      py: 1,
      px: 1.5,
      borderRadius: 1.5,
      transition: 'all 0.2s ease',
      '&:hover': {
        bgcolor: 'rgba(25, 118, 210, 0.04)',
      }
    }}>
      <Box sx={{
        bgcolor: 'rgba(25, 118, 210, 0.1)',
        p: 0.75,
        borderRadius: 1.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 36,
        height: 36
      }}>
        <Icon sx={{ color: 'primary.main', fontSize: 18 }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.25, fontSize: '0.75rem' }}>
          {label}
        </Typography>
        {customValue || (
          <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
            {value || 'ثبت نشده'}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', bgcolor: '#fafafa', py: 1, overflow: 'auto' }}>
      <Box sx={{ px: 2, maxWidth: 700, mx: 'auto' }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 1.5,
            gap: 0.75
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 0.5
            }}>
              <AccountCircleIcon sx={{ color: 'primary.main', fontSize: 24 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                {userInfo?.name || 'کاربر'}
              </Typography>
            </Box>
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

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={28} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 1.5, borderRadius: 1.5 }}>
              {error}
            </Alert>
          ) : userInfo ? (
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.875rem', px: 1.5 }}>
                اطلاعات حساب
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
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

          {safirStatus && (
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 1.5,
              py: 1,
              borderRadius: 1,
              bgcolor: 'rgba(0, 0, 0, 0.02)'
            }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                وضعیت سفیر: {safirStatus}
              </Typography>
            </Box>
          )}

          <Button
            variant="outlined"
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              mt: 1.5,
              py: 1,
              borderColor: 'error.main',
              color: 'error.main',
              borderRadius: 1.5,
              textTransform: 'none',
              fontSize: '0.9rem',
              gap: 1,
              '& .MuiButton-startIcon': {
                marginRight: 0,
                marginLeft: 0.5
              },
              '&:hover': {
                borderColor: 'error.dark',
                bgcolor: 'rgba(211, 47, 47, 0.04)',
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

