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
    logout: 'Đăng xuất',
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
    vsLastWeek: 'so với tuần trước',
    vsLastWeekShort: 'tuần trước',
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

  editExpense: {
    title: 'Sửa chi tiêu',
    cancel: 'Hủy',
    delete: 'Xóa',
    update: 'Cập nhật',
    amountError: 'Số tiền phải lớn hơn 0',
    descriptionError: 'Vui lòng nhập mô tả ngắn',
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

  auth: {
    createAccount: 'Tạo tài khoản',
    createSub: 'Bắt đầu theo dõi chi tiêu hằng ngày. Miễn phí, song ngữ.',
    signIn: 'Chào mừng trở lại',
    signInSub: 'Đăng nhập để tiếp tục theo dõi chi tiêu.',
    checkEmail: 'Kiểm tra email',
    checkEmailSub: 'Chúng tôi đã gửi đường link xác nhận đến',
    clickToConfirm: 'Nhấp vào đó để xác nhận tài khoản.',
    verified: 'Xong rồi!',
    verifiedSub: 'Email đã được xác minh. Hãy ghi lại khoản chi tiêu đầu tiên.',
    twoFactor: 'Xác minh danh tính',
    twoFactorSub: 'Nhập mã 6 chữ số chúng tôi đã gửi đến',
    verifyCode: 'Mã xác minh',
    fullName: 'Họ và tên',
    email: 'Email',
    password: 'Mật khẩu',
    forgot: 'Quên?',
    createAccountBtn: 'Tạo tài khoản',
    signInBtn: 'Đăng nhập',
    signUpWithGoogle: 'Đăng ký bằng Google',
    signInWithGoogle: 'Đăng nhập bằng Google',
    openMailApp: 'Mở ứng dụng mail',
    resend: 'Không nhận được? Gửi lại',
    resendCode: 'Gửi lại',
    useDifferentEmail: 'Dùng email khác',
    goToPennies: 'Vào Pennies →',
    verify: 'Xác minh',
    verifyAndSignIn: 'Xác minh và đăng nhập',
    codesExpire: 'Mã hết hạn sau 10 phút',
    didntGetCode: 'Không nhận được mã?',
    alreadyHaveAccount: 'Đã có tài khoản?',
    newHere: 'Chưa có tài khoản?',
    namePlaceholder: 'Nguyễn Văn A',
    emailPlaceholder: 'ban@example.com',
    passwordPlaceholder: 'Ít nhất 8 ký tự',
    tagline: 'Ghi lại từng đồng, chỉ hai thao tác.',
    taglineSub:
      'Ứng dụng theo dõi chi tiêu song ngữ, giao diện dịu nhẹ, ưu tiên VND.',
    copyright: '© 2026 Pennies',
    welcomeAboard: 'Chào mừng bạn',
    useDifferentMethod: '← Dùng phương thức đăng nhập khác',
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
