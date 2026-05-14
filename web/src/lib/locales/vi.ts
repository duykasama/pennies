import type { Translations } from './en'

const vi: Translations = {
  appName: 'Pennies',
  appTagline: 'Quản lý chi tiêu hằng ngày',
  pageTitle: 'Pennies — Theo Dõi Chi Tiêu Hằng Ngày',

  nav: {
    language: 'VI',
    dashboard: 'Tổng quan',
    expenses: 'Chi tiêu',
    addExpense: '+ Thêm chi tiêu',
  },

  bottomNav: {
    home: 'Trang chủ',
    expenses: 'Chi tiêu',
  },

  dashboard: {
    recentExpenses: 'Chi tiêu gần đây',
    recent: 'Gần đây',
    viewAll: 'Xem tất cả →',
    today: 'Hôm nay',
    thisWeek: 'Tuần này',
    thisMonth: 'Tháng này',
    vsLastWeek: '↓ 12% so tuần trước',
    vsLastWeekShort: '↓ 12% tuần trước',
    onTrack: 'Ổn định',
    expenses: 'chi tiêu',
  },

  expenses: {
    title: 'Chi tiêu',
    filterAll: 'Tất cả',
    sortBy: 'Sắp xếp:',
    sortDate: 'Ngày',
    sortAmount: 'Số tiền',
    emptyTitle: 'Chưa có chi tiêu',
    emptyMessage: 'Bắt đầu theo dõi chi tiêu của bạn ngay hôm nay.',
    noExpensesInFilter: 'Không có chi tiêu trong bộ lọc này.',
  },

  addExpense: {
    title: 'Thêm chi tiêu',
    back: '← Quay lại',
    amount: 'Số tiền (₫)',
    amountPlaceholder: '0',
    amountError: 'Vui lòng nhập số tiền hợp lệ lớn hơn 0',
    description: 'Mô tả',
    descriptionPlaceholder: 'VD: Ăn trưa tại quán phở',
    descriptionError: 'Vui lòng nhập mô tả',
    category: 'Danh mục',
    date: 'Ngày',
    note: 'Ghi chú (tùy chọn)',
    notePlaceholder: 'Thêm chi tiết...',
    cancel: 'Hủy',
    submit: 'Thêm chi tiêu',
  },

  dates: {
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
  },

  theme: {
    label: 'Giao diện',
    light: 'Sáng',
    dark: 'Tối',
    system: 'Hệ thống',
  },

  categories: {
    food: { label: 'Ăn uống', long: 'Ăn uống' },
    transport: { label: 'Di chuyển', long: 'Di chuyển' },
    shopping: { label: 'Mua sắm', long: 'Mua sắm' },
    fun: { label: 'Giải trí', long: 'Giải trí' },
    health: { label: 'Sức khỏe', long: 'Sức khỏe' },
    util: { label: 'Tiện ích', long: 'Tiện ích' },
    housing: { label: 'Nhà ở', long: 'Nhà ở' },
    other: { label: 'Khác', long: 'Khác' },
  },
}

export default vi
