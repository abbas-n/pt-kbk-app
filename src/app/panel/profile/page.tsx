'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Divider, Chip, Button, Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
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
import LockIcon from '@mui/icons-material/Lock';
import { SvgIconComponent } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import SnackbarComp from '../../components/SnackbarComp';
import { useTheme } from '../../../contexts/ThemeContext';
import Navbar from '../../components/Navbar';

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
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [successSBOpen, setSuccessSBOpen] = useState(false);

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

  const handleOpenChangePasswordDialog = () => {
    setChangePasswordDialogOpen(true);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const handleCloseChangePasswordDialog = () => {
    setChangePasswordDialogOpen(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  const validatePassword = () => {
    if (newPassword.length < 6) {
      setPasswordError('رمز عبور باید حداقل 6 کاراکتر باشد');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('رمز عبور و تکرار آن باید یکسان باشند');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) {
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await FetchApi('/tpShipment/changePassword', 'POST', true, JSON.stringify({
        newPassword: newPassword
      }));

      if (res.status === 200) {
        setSuccessSBOpen(true);
        setSnackbarMSG('رمز عبور با موفقیت تغییر یافت');
        handleCloseChangePasswordDialog();
      } else {
        setPasswordError(res.data?.message || 'خطا در تغییر رمز عبور');
        setSnackbarMSG(res.data?.message || 'خطا در تغییر رمز عبور');
        setErrorSBOpen(true);
      }
    } catch (err) {
      setPasswordError('خطا در تغییر رمز عبور');
      setSnackbarMSG('خطا در تغییر رمز عبور');
      setErrorSBOpen(true);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === '0000-00-00') return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString('fa-IR');
  };

  const InfoCard = ({ icon: Icon, label, value, customValue }: {
    icon: SvgIconComponent,
    label: string,
    value: string | null,
    customValue?: React.ReactNode
  }) => (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        height: '100%',
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)'}`
        }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.08)',
          p: 1,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 44,
          height: 44
        }}>
          <Icon sx={{ color: 'primary.main', fontSize: 22 }} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75, fontSize: '0.75rem', fontWeight: 500 }}>
            {label}
          </Typography>
          {customValue || (
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.95rem', wordBreak: 'break-word' }}>
              {value || 'ثبت نشده'}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Navbar />

      <Box sx={{ maxWidth: 900, mx: 'auto', pb: { xs: 4, sm: 6 }, px: { xs: 1, sm: 2 } }}>
        {/* Header Section (without Avatar) */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, sm: 4 },
            mt: 2,
            mb: 3,
            borderRadius: 3,
            bgcolor: 'background.paper',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            background: (theme) => 
              theme.palette.mode === 'dark' 
                ? `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.paper} 100%)`
                : `linear-gradient(135deg, rgba(25, 118, 210, 0.02) 0%, ${theme.palette.background.paper} 100%)`
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.75rem' },
              }}
            >
              {userInfo?.name || 'کاربر'}
            </Typography>
            {userInfo && (
              <Chip
                icon={
                  userInfo.status === 'Active' ? (
                    <CheckCircleIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <CancelIcon sx={{ fontSize: 18 }} />
                  )
                }
                label={userInfo.status === 'Active' ? 'حساب فعال' : 'حساب غیرفعال'}
                color={userInfo.status === 'Active' ? 'success' : 'error'}
                sx={{
                  height: 32,
                  fontSize: '0.875rem',
                  px: 1.5,
                  fontWeight: 600,
                  '& .MuiChip-icon': {
                    color: 'inherit',
                    ml: 0.75,
                    mr: 0.25,
                  },
                }}
              />
            )}
          </Box>
        </Paper>

        {/* Loading/Error State */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        ) : userInfo ? (
          <>
            {/* User Information Grid */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, fontSize: '1.1rem', px: { xs: 1, sm: 0 } }}>
                اطلاعات حساب کاربری
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoCard icon={PersonIcon} label="نام" value={userInfo.name} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoCard icon={BadgeIcon} label="کد سفیر" value={userInfo.ID} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoCard icon={PhoneIcon} label="شماره موبایل" value={userInfo.mobile} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoCard icon={BadgeIcon} label="کد ملی" value={userInfo.melli_code} />
                </Grid>
                <Grid item xs={12}>
                  <InfoCard
                    icon={CalendarTodayIcon}
                    label="تاریخ ثبت نام"
                    value={formatDate(userInfo.date_created)}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Settings Section */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: (theme) => `1px solid ${theme.palette.divider}`,
                mb: 3
              }}
            >
              <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, fontSize: '1.1rem' }}>
                تنظیمات
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Change Password */}
                <Paper
                  elevation={0}
                  onClick={handleOpenChangePasswordDialog}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: 'action.selected',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                      p: 1.25,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48
                    }}>
                      <LockIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem', mb: 0.25 }}>
                        تغییر رمز عبور
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        برای تغییر رمز عبور کلیک کنید
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                {/* Theme Toggle */}
                <Paper
                  elevation={0}
                  onClick={toggleTheme}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: (theme) => `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      bgcolor: 'action.selected',
                      transform: 'translateY(-2px)',
                      boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)',
                      p: 1.25,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48
                    }}>
                      {mode === 'dark' ? (
                        <DarkModeIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                      ) : (
                        <LightModeIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '1rem', mb: 0.25 }}>
                        {mode === 'dark' ? 'تم تاریک' : 'تم روشن'}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
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
                    size="medium"
                  />
                </Paper>
              </Box>
            </Paper>

            {/* Logout Button */}
            <Button
              variant="outlined"
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                py: 1.5,
                borderColor: 'error.main',
                color: 'error.main',
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '& .MuiButton-startIcon': {
                  marginRight: 0,
                  marginLeft: 0.5
                },
                '&:hover': {
                  borderColor: 'error.dark',
                  bgcolor: 'error.light',
                  color: 'error.dark',
                  transform: 'translateY(-1px)',
                  boxShadow: (theme) => `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.3)' : 'rgba(211, 47, 47, 0.2)'}`
                },
              }}
            >
              خروج از حساب کاربری
            </Button>
          </>
        ) : null}
      </Box>

      {/* Change Password Dialog */}
      <Dialog
        open={changePasswordDialogOpen}
        onClose={handleCloseChangePasswordDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            direction: 'rtl'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', pb: 1 }}>
          تغییر رمز عبور
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="رمز عبور جدید"
              type="password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (passwordError) {
                  // اگر هر دو فیلد پر شده‌اند، اعتبارسنجی کن
                  if (e.target.value.length > 0 && confirmPassword.length > 0) {
                    if (e.target.value !== confirmPassword) {
                      setPasswordError('رمز عبور و تکرار آن باید یکسان باشند');
                    } else if (e.target.value.length < 6) {
                      setPasswordError('رمز عبور باید حداقل 6 کاراکتر باشد');
                    } else {
                      setPasswordError('');
                    }
                  } else {
                    setPasswordError('');
                  }
                }
              }}
              fullWidth
              error={!!passwordError && newPassword.length > 0}
              helperText={passwordError && newPassword.length > 0 ? passwordError : 'حداقل 6 کاراکتر'}
            />
            <TextField
              label="تکرار رمز عبور"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (passwordError) {
                  // اگر هر دو فیلد پر شده‌اند، اعتبارسنجی کن
                  if (newPassword.length > 0 && e.target.value.length > 0) {
                    if (newPassword !== e.target.value) {
                      setPasswordError('رمز عبور و تکرار آن باید یکسان باشند');
                    } else if (newPassword.length < 6) {
                      setPasswordError('رمز عبور باید حداقل 6 کاراکتر باشد');
                    } else {
                      setPasswordError('');
                    }
                  } else {
                    setPasswordError('');
                  }
                }
              }}
              fullWidth
              error={!!passwordError && confirmPassword.length > 0}
              helperText={passwordError && confirmPassword.length > 0 ? passwordError : ''}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, direction: 'rtl' }}>
          <Button
            onClick={handleCloseChangePasswordDialog}
            disabled={isChangingPassword}
            sx={{ textTransform: 'none' }}
          >
            انصراف
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={isChangingPassword || !newPassword || !confirmPassword}
            sx={{ textTransform: 'none' }}
          >
            {isChangingPassword ? (
              <>
                <CircularProgress size={16} sx={{ ml: 1 }} />
                در حال تغییر...
              </>
            ) : (
              'ثبت'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <SnackbarComp
        succesSBOpen={successSBOpen}
        errorSBOpen={errorSBOpen}
        snackbarMSG={snackbarMSG}
        onClose={() => {
          setErrorSBOpen(false);
          setSuccessSBOpen(false);
        }}
      />
    </Box>
  );
}

