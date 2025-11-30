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
  Chip,
  Grid,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Navbar from '../../components/Navbar';
import { FetchApi } from '../../../../utils/Helper';
import SnackbarComp from '../../components/SnackbarComp';
import ShipmentInfoField from '@/app/components/find-shipment/ShipmentInfoField';

interface ActiveShipment {
  ID?: string;
  shipment_code?: string;
  bill_num?: string;
  shipment_status_id?: string | number;
  status_title?: string;
  receiver_realname?: string;
  receiver_tel?: string;
  receiver_address?: string;
  originKargo?: string;
  targetKargo?: string;
  pay_by?: string;
  final_price?: string | number;
  // Numeric keys from API (0-9)
  [key: string]: any;
}

export default function ActiveShipmentsPage() {
  const [shipments, setShipments] = useState<ActiveShipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [snackbarMSG, setSnackbarMSG] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const fetchActiveShipments = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res = await FetchApi('/tpShipment/getActiveShipments', 'POST', true, JSON.stringify({}));

      if (res.status === 200) {
        // Map the data to ensure we use the correct field names
        const mappedShipments = (res.data.shipments || []).map((shipment: any) => ({
          ID: shipment.ID || shipment['0'],
          shipment_code: shipment.shipment_code || shipment['1'],
          bill_num: shipment.bill_num || shipment['2'],
          shipment_status_id: shipment.shipment_status_id || shipment['3'],
          status_title: shipment.status_title,
          receiver_realname: shipment.receiver_realname || shipment['4'],
          receiver_tel: shipment.receiver_tel || shipment['5'],
          receiver_address: shipment.receiver_address,
          originKargo: shipment.originKargo || shipment['6'],
          targetKargo: shipment.targetKargo || shipment['7'],
          pay_by: shipment.pay_by || shipment['8'],
          final_price: shipment.final_price || shipment['9'],
        }));
        setShipments(mappedShipments);
      } else {
        setError(res.data?.message || 'خطا در دریافت بارنامه‌ها');
        setSnackbarMSG(res.data?.message || 'خطا در دریافت بارنامه‌ها');
        setErrorSBOpen(true);
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
      setSnackbarMSG('خطا در ارتباط با سرور');
      setErrorSBOpen(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActiveShipments();
  }, []);

  const handleRefresh = () => {
    fetchActiveShipments(true);
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

  const getStatusBadge = (statusTitle?: string, statusId?: string | number) => {
    if (statusTitle) {
      const statusNum = typeof statusId === 'string' ? parseInt(statusId) : statusId;
      let color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' = 'default';

      if (statusNum === 25) {
        color = 'warning';
      } else if (statusNum === 21) {
        color = 'info';
      }

      return (
        <Chip
          label={statusTitle}
          color={color}
          size="small"
          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
        />
      );
    }

    const statusNum = typeof statusId === 'string' ? parseInt(statusId) : statusId;
    if (statusNum === 25) {
      return <Chip label="وضعیت: 25" color="warning" size="small" sx={{ fontWeight: 'bold' }} />;
    } else if (statusNum === 21) {
      return <Chip label="وضعیت: 21" color="info" size="small" sx={{ fontWeight: 'bold' }} />;
    }
    return statusId ? <Chip label={`وضعیت: ${statusNum || statusId}`} size="small" /> : null;
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar showLogout={false} />
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Paper
          elevation={3}
          sx={{
            p: 1.5,
            mb: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'primary.main', fontSize: '0.95rem' }}>
            بارنامه‌های فعال ({filteredShipments.length > 0 && searchQuery.trim() ? filteredShipments.length : shipments.length})
          </Typography>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing || loading}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              width: 36,
              height: 36,
              '&:hover': {
                bgcolor: 'primary.dark',
              },
            }}
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : shipments.length === 0 ? (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
            }}
          >
            <LocalShippingIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              بارنامه فعالی وجود ندارد
            </Typography>
            <Typography variant="body2" color="text.secondary">
              در حال حاضر هیچ بارنامه فعالی به شما ارجاع نشده است
            </Typography>
          </Paper>
        ) : (
          <Box>
            {shipments.length > 0 && (
              <Paper
                elevation={0}
                sx={{
                  mb: 2.5,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.paper',
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

            {filteredShipments.length === 0 && searchQuery.trim() ? (
              <Paper
                elevation={1}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
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
                const isExpanded = expandedCards.has(shipment.ID || '');
                return (
                  <Card
                    key={shipment.ID}
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      boxShadow: (theme) => theme.palette.mode === 'dark' 
                        ? '0 4px 16px rgba(0,0,0,0.3)' 
                        : '0 4px 16px rgba(0,0,0,0.12)',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        width: '100%',
                        height: '4px',
                        bgcolor: 'primary.main',
                      },
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pb: isExpanded ? '16px !important' : '16px !important' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'start',
                          mb: isExpanded ? 2 : 0,
                          pb: isExpanded ? 2 : 0,
                          borderBottom: isExpanded ? '2px solid' : 'none',
                          borderColor: 'divider',
                          cursor: 'pointer',
                        }}
                        onClick={() => toggleCard(shipment.ID || '')}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Box
                            sx={{
                              p: 1.5,
                              borderRadius: 2,
                              bgcolor: 'primary.main',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <LocalShippingIcon sx={{ color: 'white', fontSize: 28 }} />
                          </Box>
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                              کد بارنامه
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                              {shipment.shipment_code || 'بدون کد'}
                            </Typography>
                            {shipment.bill_num && isExpanded && (
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                شماره بارنامه ورودی: {shipment.bill_num}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getStatusBadge(shipment.status_title, shipment.shipment_status_id)}
                          {isExpanded ? (
                            <ExpandLessIcon sx={{ color: 'text.secondary', ml: 1 }} />
                          ) : (
                            <ExpandMoreIcon sx={{ color: 'text.secondary', ml: 1 }} />
                          )}
                        </Box>
                      </Box>

                      {isExpanded && (
                        <Grid container sx={{ mb: 1 }}>
                          {shipment.receiver_realname && (
                            <ShipmentInfoField
                              label="گیرنده"
                              value={shipment.receiver_realname}
                              icon={<PersonIcon sx={{ color: 'white', fontSize: 20 }} />}
                              iconBgColor="primary.main"
                            />
                          )}

                          {shipment.receiver_tel && (
                            <ShipmentInfoField
                              label="تماس گیرنده"
                              value={shipment.receiver_tel}
                              icon={<PhoneIcon sx={{ color: 'white', fontSize: 20 }} />}
                              iconBgColor="success.main"
                            />
                          )}

                          {shipment.originKargo && (
                            <ShipmentInfoField
                              label="مبدا"
                              value={shipment.originKargo}
                              icon={<LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />}
                              iconBgColor="info.main"
                            />
                          )}

                          {shipment.targetKargo && (
                            <ShipmentInfoField
                              label="مقصد"
                              value={shipment.targetKargo}
                              icon={<LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />}
                              iconBgColor="warning.main"
                            />
                          )}

                          {shipment.receiver_address && (
                            <ShipmentInfoField
                              label="آدرس گیرنده"
                              value={shipment.receiver_address}
                              icon={<HomeIcon sx={{ color: 'white', fontSize: 20 }} />}
                              iconBgColor="secondary.main"
                              xs={12}
                              sm={12}
                            />
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

