'use client';

import { useState, useEffect } from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../../components/Navbar';
import { FetchApi } from '../../../../utils/Helper';
import { validateUserLocation } from '../../../../utils/locationUtils';
import SnackbarComp from '../../components/SnackbarComp';
import SearchForm from '../../components/find-shipment/SearchForm';
import ResultsHeader from '../../components/find-shipment/ResultsHeader';
import ShipmentCard from '../../components/find-shipment/ShipmentCard';
import EmptyState from '../../components/find-shipment/EmptyState';

interface Shipment {
  ID: string;
  shipment_code?: string;
  bill_num?: string;
  receiver_realname?: string;
  receiver_tel?: string;
  origin_kargo?: string;
  destination_kargo?: string;
  final_price?: string;
  shipment_status_id?: string;
  status_title?: string;
  // For backward compatibility and display
  id?: string;
  shipmentCode?: string;
  shipmentEnteredCode?: string;
  receiverName?: string;
  receiverPhone?: string;
  origin?: string;
  destination?: string;
  price?: number;
  status?: number;
  statusTitle?: string;
}

export default function FindShipmentPage() {
  const [formData, setFormData] = useState({
    kargoId: '',
    shipmentCode: '',
    shipmentEnteredCode: '',
    receiverName: '',
    receiverPhone: '',
  });

  useEffect(() => {
    // بارگذاری پورت ذخیره شده از localStorage
    const savedKargoId = localStorage.getItem('uKargoId');
    if (savedKargoId) {
      setFormData(prev => ({
        ...prev,
        kargoId: savedKargoId
      }));
    }
  }, []);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Shipment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successSBOpen, setSuccessSBOpen] = useState(false);
  const [errorSBOpen, setErrorSBOpen] = useState(false);
  const [snackbarMSG, setSnackbarMSG] = useState('');
  const [referringId, setReferringId] = useState<string | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.kargoId) {
      setError('لطفاً پورت را انتخاب کنید');
      return false;
    }
    const hasOptionalField = formData.shipmentCode ||
      formData.shipmentEnteredCode ||
      formData.receiverName ||
      formData.receiverPhone;
    if (!hasOptionalField) {
      setError('لطفاً حداقل یکی از فیلدهای جستجو را پر کنید');
      return false;
    }
    return true;
  };

  const handleSearch = async () => {
    setError(null);
    setResults([]);

    if (!validateForm()) {
      return;
    }

    // دریافت انبار انتخابی کاربر از localStorage
    const selectedWarehouseId = localStorage.getItem('uKargoId');
    
    if (!selectedWarehouseId) {
      setError('انبار انتخابی یافت نشد. لطفاً دوباره وارد شوید');
      setSnackbarMSG('انبار انتخابی یافت نشد. لطفاً دوباره وارد شوید');
      setErrorSBOpen(true);
      return;
    }

    setLoading(true);
    try {
      // بررسی موقعیت کاربر قبل از جستجو
      const locationCheck = await validateUserLocation(selectedWarehouseId);
      
      if (!locationCheck.isInRange) {
        const warehouse = locationCheck.warehouse as { name: string } | null;
        const warehouseName = warehouse?.name || 'انبار انتخابی';
        const distanceText = locationCheck.distance 
          ? `فاصله شما از ${warehouseName}: ${(locationCheck.distance * 1000).toFixed(0)} متر`
          : '';
        setError(`شما در محدوده ${warehouseName} قرار ندارید. برای جستجوی بارنامه باید در فاصله حداکثر 500 متری انبار باشید. ${distanceText}`);
        setSnackbarMSG(`شما در محدوده ${warehouseName} قرار ندارید. برای جستجوی بارنامه باید در فاصله حداکثر 500 متری انبار باشید. ${distanceText}`);
        setErrorSBOpen(true);
        setLoading(false);
        return;
      }

      const body = {
        kargoId: formData.kargoId,
        ...(formData.shipmentCode && { shipmentCode: formData.shipmentCode }),
        ...(formData.shipmentEnteredCode && { shipmentEnteredCode: formData.shipmentEnteredCode }),
        ...(formData.receiverName && { receiverName: formData.receiverName }),
        ...(formData.receiverPhone && { receiverPhone: formData.receiverPhone }),
      };

      const res = await FetchApi('/tpShipment/findShipment', 'POST', true, JSON.stringify(body));

      if (res.status === 200) {
        const shipments = res.data.shipment || [];
        // Map API response to display format
        const mappedShipments = shipments.map((shipment: any) => ({
          ...shipment,
          id: shipment.ID || shipment.id,
          shipmentCode: shipment.shipment_code || shipment.shipmentCode,
          receiverName: shipment.receiver_realname || shipment.receiverName,
          receiverPhone: shipment.receiver_tel || shipment.receiverPhone,
          origin: shipment.origin_kargo || shipment.origin,
          destination: shipment.destination_kargo || shipment.destination,
          price: shipment.final_price ? parseFloat(shipment.final_price) : shipment.price,
          status: shipment.shipment_status_id ? parseInt(shipment.shipment_status_id) : shipment.status,
          statusTitle: shipment.status_title || shipment.statusTitle,
        }));
        setResults(mappedShipments);
        // بستن بخش جستجو بعد از پیدا شدن نتایج
        if (mappedShipments.length > 0) {
          setSearchExpanded(false);
        }
        if (mappedShipments.length === 0) {
          setSnackbarMSG('نتیجه‌ای یافت نشد');
          setErrorSBOpen(true);
        }
      } else {
        setError(res.data?.message || 'خطا در جستجو');
        setSnackbarMSG(res.data?.message || 'خطا در جستجو');
        setErrorSBOpen(true);
      }
    } catch (err: any) {
      // اگر خطا مربوط به موقعیت باشد، پیام مناسب نمایش داده می‌شود
      if (err.message && err.message.includes('موقعیت')) {
        setError(err.message);
        setSnackbarMSG(err.message);
      } else {
        setError('خطا در ارتباط با سرور');
        setSnackbarMSG('خطا در ارتباط با سرور');
      }
      setErrorSBOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefer = async (shipmentId: string, address?: string) => {
    setReferringId(shipmentId);
    try {
      const body: { shipmentId: string; address?: string } = { shipmentId };
      if (address) {
        body.address = address;
      }

      const res = await FetchApi('/tpShipment/referShipment', 'POST', true, JSON.stringify(body));

      if (res.status === 200) {
        setSnackbarMSG(res.data?.message || 'بارنامه با موفقیت به شما ارجاع شد');
        setSuccessSBOpen(true);
        setResults(prev => prev.filter(s => (s.id || s.ID) !== shipmentId));
      } else {
        setSnackbarMSG(res.data?.message || 'خطا در ارجاع بارنامه');
        setErrorSBOpen(true);
      }
    } catch (err) {
      setSnackbarMSG('خطا در ارتباط با سرور');
      setErrorSBOpen(true);
    } finally {
      setReferringId(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Navbar title="" showLogout={false} />
      <Container maxWidth="md" sx={{ py: 3 }}>
        <SearchForm
          formData={formData}
          loading={loading}
          error={error}
          expanded={searchExpanded}
          onFormDataChange={handleChange}
          onSearch={handleSearch}
          onToggleExpanded={() => setSearchExpanded(!searchExpanded)}
        />

        {results.length > 0 && (
          <Box>
            <ResultsHeader count={results.length} />
            {results.map((shipment) => (
              <ShipmentCard
                key={shipment.id || shipment.ID}
                shipment={shipment}
                referringId={referringId}
                onRefer={handleRefer}
              />
            ))}
          </Box>
        )}

        {results.length === 0 && !loading && !error && (
          <EmptyState onOpenSearch={() => setSearchExpanded(true)} />
        )}
      </Container>

      <SnackbarComp
        succesSBOpen={successSBOpen}
        errorSBOpen={errorSBOpen}
        snackbarMSG={snackbarMSG}
        onClose={() => {
          setSuccessSBOpen(false);
          setErrorSBOpen(false);
        }}
      />
    </Box>
  );
}
