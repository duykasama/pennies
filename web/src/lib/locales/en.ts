const en = {
  appName: 'Pennies',
  appTagline: 'Manage your daily expenses',
  pageTitle: 'Pennies — Daily Expense Tracker',

  nav: {
    language: 'EN',
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    addExpense: '+ Add Expense',
  },

  bottomNav: {
    home: 'Home',
    expenses: 'Expenses',
  },

  dashboard: {
    recentExpenses: 'Recent Expenses',
    recent: 'Recent',
    viewAll: 'View all →',
    today: 'Today',
    thisWeek: 'This week',
    thisMonth: 'This month',
    vsLastWeek: '↓ 12% vs last week',
    vsLastWeekShort: '↓ 12% vs last',
    onTrack: 'On track',
    expenses: 'expenses',
  },

  expenses: {
    title: 'Expenses',
    filterAll: 'All',
    sortBy: 'Sort by:',
    sortDate: 'Date',
    sortAmount: 'Amount',
    emptyTitle: 'No expenses yet',
    emptyMessage: 'Track your first expense today.',
    noExpensesInFilter: 'No expenses in this filter.',
  },

  addExpense: {
    title: 'Add Expense',
    back: '← Back',
    amount: 'Amount (₫)',
    amountPlaceholder: '0',
    amountError: 'Please enter a valid amount greater than 0',
    description: 'Description',
    descriptionPlaceholder: 'e.g. Lunch at pho place',
    descriptionError: 'Please enter a description',
    category: 'Category',
    date: 'Date',
    note: 'Note (optional)',
    notePlaceholder: 'Any extra details...',
    cancel: 'Cancel',
    submit: 'Add Expense',
  },

  dates: {
    today: 'Today',
    yesterday: 'Yesterday',
  },

  theme: {
    label: 'Theme',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
  },

  categories: {
    food: { label: 'Food', long: 'Food & Drink' },
    transport: { label: 'Transport', long: 'Transport' },
    shopping: { label: 'Shopping', long: 'Shopping' },
    fun: { label: 'Fun', long: 'Entertainment' },
    health: { label: 'Health', long: 'Health' },
    util: { label: 'Utilities', long: 'Utilities' },
    housing: { label: 'Housing', long: 'Housing' },
    other: { label: 'Other', long: 'Other' },
  },
}

export default en
export type Translations = typeof en
