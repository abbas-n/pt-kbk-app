import { WAREHOUSES, MAX_DISTANCE_KM } from './warehouseConfig';

/**
 * محاسبه فاصله بین دو نقطه جغرافیایی با استفاده از فرمول Haversine
 * @param {number} lat1 - عرض جغرافیایی نقطه اول
 * @param {number} lon1 - طول جغرافیایی نقطه اول
 * @param {number} lat2 - عرض جغرافیایی نقطه دوم
 * @param {number} lon2 - طول جغرافیایی نقطه دوم
 * @returns {number} فاصله به کیلومتر
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // شعاع زمین به کیلومتر
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

/**
 * تبدیل درجه به رادیان
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * دریافت موقعیت کاربر از مرورگر
 * @returns {Promise<{latitude: number, longitude: number}>}
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'خطا در دریافت موقعیت';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'دسترسی به موقعیت رد شد. لطفاً دسترسی را در تنظیمات مرورگر فعال کنید';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'اطلاعات موقعیت در دسترس نیست';
            break;
          case error.TIMEOUT:
            errorMessage = 'زمان دریافت موقعیت به پایان رسید';
            break;
        }
        reject(new Error(errorMessage));
      },
      options
    );
  });
}

/**
 * بررسی اینکه آیا کاربر در محدوده انبار انتخابی قرار دارد
 * @param {number} userLat - عرض جغرافیایی کاربر
 * @param {number} userLon - طول جغرافیایی کاربر
 * @param {string} selectedWarehouseId - شناسه انبار انتخابی کاربر (از localStorage)
 * @returns {{isInRange: boolean, warehouse: object|null, distance: number|null}}
 */
export function checkUserInWarehouseRange(userLat, userLon, selectedWarehouseId) {
  // پیدا کردن انبار انتخابی
  const selectedWarehouse = WAREHOUSES.find(w => w.id === selectedWarehouseId);
  
  if (!selectedWarehouse) {
    return {
      isInRange: false,
      warehouse: null,
      distance: null,
    };
  }

  // محاسبه فاصله تا انبار انتخابی
  const distance = calculateDistance(
    userLat,
    userLon,
    selectedWarehouse.latitude,
    selectedWarehouse.longitude
  );

  const isInRange = distance <= MAX_DISTANCE_KM;

  return {
    isInRange,
    warehouse: selectedWarehouse,
    distance: distance,
  };
}

/**
 * بررسی موقعیت کاربر و محدوده انبار انتخابی
 * @param {string} selectedWarehouseId - شناسه انبار انتخابی کاربر (از localStorage)
 * @returns {Promise<{isInRange: boolean, warehouse: object|null, distance: number|null, userLocation: object|null}>}
 */
export async function validateUserLocation(selectedWarehouseId) {
  try {
    if (!selectedWarehouseId) {
      throw new Error('انبار انتخابی یافت نشد. لطفاً دوباره وارد شوید');
    }

    const userLocation = await getUserLocation();
    const checkResult = checkUserInWarehouseRange(
      userLocation.latitude,
      userLocation.longitude,
      selectedWarehouseId
    );

    return {
      ...checkResult,
      userLocation,
    };
  } catch (error) {
    throw error;
  }
}

