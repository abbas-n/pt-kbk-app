'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Avatar,
  Backdrop,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';
import { FetchApi } from '../../../utils/Helper';
import { useRouter } from 'next/navigation';
import SnackbarComp from '../components/SnackbarComp';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    kargoId: ''
  });
  const [succesSnackbarOpen, setSuccesSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [snackbarMSG, setSnackbarMSG] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await FetchApi('/tpAuth/tplogin', 'POST', false, JSON.stringify(formData));
      if (res.status == 200) {
        setIsLoading(false);
        localStorage.setItem('utoken', res.data.accessToken);
        localStorage.setItem('uID', res.data.user.id);
        localStorage.setItem('uName', res.data.user.name);
        localStorage.setItem('uMobile', res.data.user.mobile);
        localStorage.setItem('uNationalCode', res.data.user.nationalCode);
        localStorage.setItem('uKargoId', formData.kargoId);
        router.push("/panel/find-shipment");
      } else {
        setIsLoading(false);
        setSnackbarMSG(res.data.message);
        setErrorSnackbarOpen(true); 
      }
    } catch {
      setIsLoading(false);
      setErrorSnackbarOpen(true);
      setSnackbarMSG("خطایی نامشخص رخ داده است");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <>
      <Backdrop
        sx={{ color: 'common.white', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              backgroundColor: 'background.paper',
              mx: 'auto',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  backgroundColor: 'transparent',
                }}
              >
                <Image
                  src="/kbkNLC.png"
                  alt="لوگو سامانه"
                  width={120}
                  height={95}
                  priority
                />
              </Avatar>
              <Typography variant="h4" component="h1" align="center" gutterBottom sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
                سامانه سفیران ترخیص کالارسان
              </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="نام کاربری"
                name="username"
                value={formData.username}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ mb: 2 }}
                dir="ltr"
                inputProps={{
                  style: { textAlign: 'left' }
                }}
              />
              <TextField
                fullWidth
                label="رمز عبور"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                sx={{ mb: 2 }}
                dir="ltr"
                inputProps={{
                  style: { textAlign: 'left' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl fullWidth sx={{ mb: 3 }} required>
                <InputLabel>پورت</InputLabel>
                <Select
                  name="kargoId"
                  value={formData.kargoId}
                  onChange={handleChange}
                  label="پورت"
                >
                  <MenuItem value="1">بیهقی</MenuItem>
                  <MenuItem value="7">غرب</MenuItem>
                  <MenuItem value="281">جنوب</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontSize: '1.1rem',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    boxShadow: '0 6px 8px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                ورود به سامانه
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
      <SnackbarComp
        succesSBOpen={succesSnackbarOpen}
        errorSBOpen={errorSnackbarOpen}
        snackbarMSG={snackbarMSG}
        onClose={() => {
          setSuccesSnackbarOpen(false);
          setErrorSnackbarOpen(false);
        }}
      />
    </>
  );
} 