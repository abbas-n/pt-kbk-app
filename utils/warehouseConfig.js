// پیکربندی موقعیت انبارها
// مختصات جغرافیایی 3 انبار (latitude, longitude)
// id ها باید با value های انتخابی در صفحه لاگین مطابقت داشته باشند
export const WAREHOUSES = [
  {
    id: '1',  // بیهقی
    name: 'بیهقی',
    latitude: 35.7387427,
    longitude: 51.4168465,
  },
  {
    id: '7',  // غرب
    name: 'غرب',
    latitude: 35.7024738,
    longitude: 51.3317596,
  },
  {
    id: '281',  // جنوب
    name: 'جنوب',
    latitude: 35.6481154,
    longitude: 51.4184398,
  },
];

// حداکثر فاصله مجاز از انبار (به کیلومتر)
// 500 متر = 0.5 کیلومتر
export const MAX_DISTANCE_KM = 0.5;

