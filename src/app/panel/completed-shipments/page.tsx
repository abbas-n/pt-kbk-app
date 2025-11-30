'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFnsJalali } from '@mui/x-date-pickers/AdapterDateFnsJalali';
import { format } from 'date-fns-jalali';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HomeIcon from '@mui/icons-material/Home';
import Navbar from '../../components/Navbar';
import { FetchApi, thousandDivider } from '../../../../utils/Helper';
import SnackbarComp from '../../components/SnackbarComp';

interface CompletedShipment {
  ID: string;
  shipment_code: string;
  bill_num: string;
  shipment_status_id: string;
  receiver_realname: string;
  receiver_tel: string;
  receiver_address?: string;
  originKargo: string;
  targetKargo: string;
  pay_by: string;
  final_price: string;
  peyk_wage: string;
  insert_time?: string;
}

// Get yesterday's date
const getYesterday = (): Date => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  return yesterday;
};

// Convert timestamp or date string to Jalali date string
const formatTimestampToJalali = (timestamp: string | undefined): string | null => {
  if (!timestamp) return null;
  try {
    // اگر timestamp به صورت رشته عددی است (مثل "1234567890")
    if (/^\d+$/.test(timestamp.trim())) {
      const timestampNum = parseInt(timestamp);
      // اگر عدد کوچکتر از یک میلیون است، احتمالاً به ثانیه است
      if (timestampNum < 10000000000) {
        const date = new Date(timestampNum * 1000); // تبدیل ثانیه به میلی‌ثانیه
        return format(date, 'yyyy/MM/dd HH:mm');
      } else {
        // اگر بزرگتر است، احتمالاً به میلی‌ثانیه است
        const date = new Date(timestampNum);
        return format(date, 'yyyy/MM/dd HH:mm');
      }
    } else {
      // اگر به صورت تاریخ میلادی است (مثل "2025-11-06 09:37:31")
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return null;
      }
      return format(date, 'yyyy/MM/dd HH:mm');
    }
  } catch (err) {
    return null;
  }
};

export default function CompletedShipmentsPage() {
  const [shipments, setShipments] = useState<CompletedShipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromDate, setFromDate] = useState<Date | null>(getYesterday());
  const [toDate, setToDate] = useState<Date | null>(new Date());
  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [snackbarMSG, setSnackbarMSG] = useState('');
  const [searchBoxOpen, setSearchBoxOpen] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompletedShipments = async () => {
    if (!fromDate || !toDate) {
      setError('لطفاً تاریخ شروع و پایان را انتخاب کنید');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const body = {
        fromDate: format(fromDate, 'yyyy-MM-dd'),
        toDate: format(toDate, 'yyyy-MM-dd'),
      };

      const res = await FetchApi('/tpShipment/getCompletedShipments', 'POST', true, JSON.stringify(body));

      if (res.status === 200) {
        const shipmentsData = res.data.shipments || [];
        if (shipmentsData.length === 0) {
          // پاک کردن نتایج قبلی
          setShipments([]);
          setSnackbarMSG('در بازه زمانی انتخاب شده نتیجه‌ای یافت نشد');
          setErrorSBOpen(true);
        } else {
          setShipments(shipmentsData);
          // بستن باکس جستجو وقتی نتایج لود می‌شود
          setSearchBoxOpen(false);
        }
      } else if (res.status === 404) {
        // پاک کردن نتایج قبلی وقتی 404 می‌آید
        setShipments([]);
        setError(null);
        setSnackbarMSG('در بازه زمانی انتخاب شده نتیجه‌ای یافت نشد');
        setErrorSBOpen(true);
      } else {
        // پاک کردن نتایج قبلی در صورت خطای دیگر
        setShipments([]);
        setError(res.data?.message || 'خطا در دریافت گزارش');
        setSnackbarMSG(res.data?.message || 'خطا در دریافت گزارش');
        setErrorSBOpen(true);
      }
    } catch (err) {
      // پاک کردن نتایج قبلی در صورت خطا
      setShipments([]);
      setError('خطا در ارتباط با سرور');
      setSnackbarMSG('خطا در ارتباط با سرور');
      setErrorSBOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-load on mount with default dates
    if (fromDate && toDate) {
      fetchCompletedShipments();
    }
  }, []);

  const handleSearch = () => {
    fetchCompletedShipments();
  };

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Filter shipments based on search query
  const filteredShipments = shipments.filter((shipment) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const shipmentCode = (shipment.shipment_code || '').toLowerCase();
    const billNum = (shipment.bill_num || '').toLowerCase();
    const receiverName = (shipment.receiver_realname || '').toLowerCase();
    return (
      shipmentCode.includes(query) ||
      billNum.includes(query) ||
      receiverName.includes(query)
    );
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <Navbar showLogout={false} />
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'white',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: searchBoxOpen ? 2 : 0,
              cursor: 'pointer',
            }}
            onClick={() => setSearchBoxOpen(!searchBoxOpen)}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.95rem' }}
            >
              فیلتر تاریخ
            </Typography>
            {searchBoxOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </Box>

          {searchBoxOpen && (
            <>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  mb: 2,
                }}
              >
                <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DatePicker
                      label="از تاریخ"
                      value={fromDate}
                      onChange={(newValue: Date | null) => setFromDate(newValue)}
                      format="yyyy/MM/dd"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              padding: '0 4px',
                              borderRadius: '4px'
                            }
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>

                <Box sx={{ flex: '1 1 240px', minWidth: 0 }}>
                  <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                    <DatePicker
                      label="تا تاریخ"
                      value={toDate}
                      onChange={(newValue: Date | null) => setToDate(newValue)}
                      format="yyyy/MM/dd"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          sx: {
                            '& .MuiInputLabel-root': {
                              backgroundColor: 'white',
                              padding: '0 4px',
                              borderRadius: '4px'
                            }
                          }
                        }
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<SearchIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSearch();
                  }}
                  disabled={loading || !fromDate || !toDate}
                  sx={{
                    px: 3,
                    py: 1,
                    minWidth: 180,
                    fontSize: '0.9rem',
                    borderRadius: 2,
                    gap: 1,
                    '& .MuiButton-startIcon': {
                      mr: 0.5,
                    },
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'جستجو'}
                </Button>
              </Box>
            </>
          )}
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : shipments.length === 0 && !error ? (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'white',
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              نتیجه‌ای یافت نشد
            </Typography>
            <Typography variant="body2" color="text.secondary">
              در بازه زمانی انتخاب شده ترخیصی ثبت نشده است
            </Typography>
          </Paper>
        ) : (
          <Box>
            {(() => {
              const totalPeykWage = filteredShipments.reduce((sum, shipment) => {
                return sum + (parseInt(shipment.peyk_wage) || 0);
              }, 0);
              
              return (
                <>
                  {filteredShipments.length > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 2.5,
                        p: 2.5,
                        borderRadius: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            p: 1.2,
                            borderRadius: 2,
                            bgcolor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <LocalShippingIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5 }}>
                            تعداد کل بارنامه‌ها
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {filteredShipments.length} بارنامه
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            p: 1.2,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                          }}
                        >
                          <AccountBalanceWalletIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', mb: 0.5, color: 'text.secondary' }}>
                            مجموع سهم پیک
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {thousandDivider(totalPeykWage)} تومان
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  )}

                  {shipments.length > 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 2.5,
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'white',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <TextField
                        fullWidth
                        placeholder="جستجو بر اساس شماره بارنامه یا نام گیرنده..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'text.secondary' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': {
                              borderColor: 'primary.main',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'primary.main',
                            },
                          },
                        }}
                      />
                    </Paper>
                  )}
                </>
              );
            })()}
            {filteredShipments.length === 0 && searchQuery.trim() ? (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'white',
                }}
              >
                <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  نتیجه‌ای یافت نشد
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  با جستجوی "{searchQuery}" نتیجه‌ای پیدا نشد
                </Typography>
              </Paper>
            ) : filteredShipments.length > 0 && (
              filteredShipments.map((shipment) => {
              const isExpanded = expandedCards.has(shipment.ID);
              return (
                <Card
                  key={shipment.ID}
                  sx={{
                    mb: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      bgcolor: 'primary.main',
                    },
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pb: isExpanded ? '16px !important' : '16px !important' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: isExpanded ? 1 : 0,
                        cursor: 'pointer',
                        pb: isExpanded ? 1 : 0,
                        borderBottom: isExpanded ? '2px solid' : 'none',
                        borderColor: 'divider',
                      }}
                      onClick={() => toggleCard(shipment.ID)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                          sx={{
                            p: 1.2,
                            borderRadius: 2,
                            bgcolor: 'primary.light',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <LocalShippingIcon sx={{ color: 'white', fontSize: 24 }} />
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5, fontSize: '0.75rem' }}>
                            شماره بارنامه
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {shipment.shipment_code || 'بدون کد'}
                          </Typography>
                        </Box>
                      </Box>
                      {isExpanded ? <ExpandLessIcon sx={{ color: 'text.secondary' }} /> : <ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
                    </Box>

                    {isExpanded && (
                      <Grid container  >
                        {shipment.bill_num && (
                          <Grid xs={12}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'info.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <LocalShippingIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  شماره بارنامه ورودی
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.bill_num}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.receiver_realname && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'primary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  گیرنده
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.receiver_realname}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.receiver_tel && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'success.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <PersonIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  تلفن گیرنده
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25, dir: 'ltr', textAlign: 'right' }}>
                                  {shipment.receiver_tel}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.originKargo && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'error.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  مبدا
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.originKargo}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.targetKargo && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'warning.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  مقصد
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.targetKargo}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.pay_by && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'secondary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <AttachMoneyIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  پرداخت کننده
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.pay_by === 'Sender' ? 'پیش کرایه' : shipment.pay_by === 'Receiver' ? 'پس کرایه' : shipment.pay_by}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.insert_time && (
                          <Grid xs={12} sm={6}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'info.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <CalendarTodayIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  زمان ترخیص
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {formatTimestampToJalali(shipment.insert_time) || 'نامشخص'}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.receiver_address && (
                          <Grid xs={12}>
                            <Paper
                              elevation={0}
                              sx={{
                                p: 1,
                                mb: 0.5,
                                bgcolor: '#f8f9fa',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                borderRadius: 2,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  bgcolor: '#e9ecef',
                                  transform: 'translateX(4px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1,
                                  borderRadius: 1.5,
                                  bgcolor: 'secondary.main',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <HomeIcon sx={{ color: 'white', fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                  آدرس گیرنده
                                </Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.25 }}>
                                  {shipment.receiver_address}
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}

                        {shipment.peyk_wage && (
                          <Grid xs={12}>
                            <Paper
                              elevation={0}
                              sx={{
                                mt: 0.5,
                                p: 1,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: 2,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                                  transform: 'translateY(-2px)',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  p: 1.2,
                                  borderRadius: 1.5,
                                  bgcolor: 'rgba(255, 255, 255, 0.25)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backdropFilter: 'blur(10px)',
                                }}
                              >
                                <AccountBalanceWalletIcon sx={{ color: 'white', fontSize: 24 }} />
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" sx={{ display: 'block', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                                  سهم پیک
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mt: 0.5 }}>
                                  {thousandDivider(parseInt(shipment.peyk_wage) || 0)} تومان
                                </Typography>
                              </Box>
                            </Paper>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </CardContent>
                </Card>
              );
              })
            )}
          </Box>
        )}
      </Container>

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

