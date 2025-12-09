import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Drawer,
  TextField,
  IconButton,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StatusBadge from './StatusBadge';
import ShipmentInfoField from './ShipmentInfoField';
import { thousandDivider } from '../../../../utils/Helper';

interface Shipment {
  ID?: string;
  id?: string;
  shipmentCode?: string;
  shipmentEnteredCode?: string;
  receiverName?: string;
  receiverPhone?: string;
  origin?: string;
  destination?: string;
  status?: number | string;
  statusTitle?: string;
  pay_by?: string;
  price?: number;
}

interface ShipmentCardProps {
  shipment: Shipment;
  referringId: string | null;
  onRefer: (shipmentId: string, address?: string) => void;
}

export default function ShipmentCard({ shipment, referringId, onRefer }: ShipmentCardProps) {
  const shipmentId = shipment.id || shipment.ID || '';
  const normalizedStatus = shipment.status !== undefined ? Number(shipment.status) : undefined;
  const canRefer = normalizedStatus === 16;
  const showDetailedInfo = normalizedStatus === 16;
  const isReferring = referringId === shipmentId;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);

  const handleReferClick = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setAddress('');
    setAddressError(false);
  };

  const handleConfirmRefer = () => {
    if (!address.trim()) {
      setAddressError(true);
      return;
    }
    setAddressError(false);
    onRefer(shipmentId, address.trim());
    handleDrawerClose();
  };

  return (
    <Card
      sx={{
        mb: 3,
        borderRadius: 2,
        boxShadow: (theme) => theme.palette.mode === 'dark' 
          ? '0 4px 16px rgba(0,0,0,0.3)' 
          : '0 4px 16px rgba(0,0,0,0.12)',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
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
          boxShadow: (theme) => theme.palette.mode === 'dark' 
            ? '0 8px 24px rgba(0,0,0,0.4)' 
            : '0 8px 24px rgba(0,0,0,0.18)',
          transform: 'translateY(-4px)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, pb: '0px !important' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            mb: 1,
            pb: 2,
            borderBottom: '2px solid',
            borderColor: 'divider',
          }}
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
                {shipment.shipmentCode || shipment.shipmentEnteredCode || 'بدون کد'}
              </Typography>
            </Box>
          </Box>
          <StatusBadge statusTitle={shipment.statusTitle} status={shipment.status} />
        </Box>

        {showDetailedInfo && (
          <Grid container sx={{ mb: 2.5 }}>
            {shipment.receiverName && (
              <ShipmentInfoField
                label="گیرنده"
                value={shipment.receiverName}
                icon={<PersonIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor="primary.main"
              />
            )}

            {shipment.receiverPhone && (
              <ShipmentInfoField
                label="تماس گیرنده"
                value={shipment.receiverPhone}
                icon={<PhoneIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor="success.main"
              />
            )}

            {shipment.origin && (
              <ShipmentInfoField
                label="مبدا"
                value={shipment.origin}
                icon={<LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor="info.main"
              />
            )}

            {shipment.destination && (
              <ShipmentInfoField
                label="مقصد"
                value={shipment.destination}
                icon={<LocationOnIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor="warning.main"
              />
            )}

            {shipment.pay_by && (
              <ShipmentInfoField
                label="نوع پرداخت"
                value={shipment.pay_by === 'Sender' ? 'پیش کرایه' : 'پس کرایه'}
                icon={<AttachMoneyIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor={shipment.pay_by === 'Sender' ? 'success.main' : 'error.main'}
              />
            )}

            {shipment.pay_by === 'Receiver' && shipment.price !== undefined && shipment.price !== null && (
              <ShipmentInfoField
                label="مبلغ"
                value={`${thousandDivider(Math.round(shipment.price))} تومان`}
                icon={<AttachMoneyIcon sx={{ color: 'white', fontSize: 20 }} />}
                iconBgColor="error.main"
              />
            )}
          </Grid>
        )}
      </CardContent>
      {canRefer && (
        <CardActions sx={{ p: { xs: 2, sm: 3 }, pt: 0 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleReferClick}
            disabled={isReferring}
            size="large"
            sx={{
              py: 1.5,
              bgcolor: 'success.main',
              fontWeight: 700,
              borderRadius: 2,
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              '&:hover': {
                bgcolor: 'success.dark',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.5)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'none',
            }}
          >
            {isReferring ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                در حال ارجاع...
              </>
            ) : (
              <>
                <CheckCircleIcon sx={{ fontSize: 22 }} />
                ارجاع به من
              </>
            )}
          </Button>
        </CardActions>
      )}

      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ p: 3, pb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              وارد کردن آدرس گیرنده
            </Typography>
            <IconButton onClick={handleDrawerClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="آدرس گیرنده"
            placeholder="لطفاً آدرس کامل گیرنده را وارد کنید"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              setAddressError(false);
            }}
            error={addressError}
            helperText={addressError ? 'لطفاً آدرس گیرنده را وارد کنید' : ''}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
            autoFocus
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleConfirmRefer}
            disabled={isReferring}
            size="large"
            sx={{
              py: 1.5,
              bgcolor: 'success.main',
              fontWeight: 700,
              borderRadius: 2,
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(46, 125, 50, 0.4)',
              '&:hover': {
                bgcolor: 'success.dark',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.5)',
              },
              textTransform: 'none',
            }}
          >
            {isReferring ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                در حال ارجاع...
              </>
            ) : (
              <>
                <CheckCircleIcon sx={{ fontSize: 22, ml: 1 }} />
                تایید و ارجاع
              </>
            )}
          </Button>
        </Box>
      </Drawer>
    </Card>
  );
}

