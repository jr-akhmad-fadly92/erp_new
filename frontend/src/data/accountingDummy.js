export const DUMMY_ACCOUNTING_JOURNALS = [
  {
    id: 1,
    journalNumber: 'JU-2026-0001',
    journalDate: '2026-05-03',
    description: 'Penjualan tunai',
    debitAccount: 'Kas',
    debitAmount: 15000000,
    creditAccount: 'Penjualan',
    creditAmount: 15000000,
    reference: 'INV-SLS-001',
    status: 'posted',
  },
  {
    id: 2,
    journalNumber: 'JU-2026-0002',
    journalDate: '2026-05-05',
    description: 'Pembelian barang dagangan',
    debitAccount: 'Persediaan Barang',
    debitAmount: 8500000,
    creditAccount: 'Kas',
    creditAmount: 8500000,
    reference: 'PO-PUR-001',
    status: 'posted',
  },
  {
    id: 3,
    journalNumber: 'JU-2026-0003',
    journalDate: '2026-05-07',
    description: 'Biaya operasional',
    debitAccount: 'Beban Operasional',
    debitAmount: 3750000,
    creditAccount: 'Kas',
    creditAmount: 3750000,
    reference: 'EXP-OPS-001',
    status: 'posted',
  },
  {
    id: 4,
    journalNumber: 'JU-2026-0004',
    journalDate: '2026-05-10',
    description: 'Penerimaan piutang',
    debitAccount: 'Kas',
    debitAmount: 5000000,
    creditAccount: 'Piutang Usaha',
    creditAmount: 5000000,
    reference: 'CVR-001',
    status: 'posted',
  },
]

export const DUMMY_CHART_OF_ACCOUNTS = [
  { code: '1001', name: 'Kas', type: 'aset', balance: 82500000, status: 'aktif' },
  { code: '1002', name: 'Piutang Usaha', type: 'aset', balance: 35000000, status: 'aktif' },
  { code: '1003', name: 'Persediaan Barang', type: 'aset', balance: 125000000, status: 'aktif' },
  { code: '1004', name: 'Peralatan', type: 'aset', balance: 450000000, status: 'aktif' },
  { code: '2001', name: 'Hutang Usaha', type: 'liabilitas', balance: 28000000, status: 'aktif' },
  { code: '2002', name: 'Hutang Pajak', type: 'liabilitas', balance: 12000000, status: 'aktif' },
  { code: '3001', name: 'Modal Saham', type: 'ekuitas', balance: 500000000, status: 'aktif' },
  { code: '4001', name: 'Penjualan', type: 'pendapatan', balance: -228000000, status: 'aktif' },
  { code: '5001', name: 'Harga Pokok Penjualan', type: 'beban', balance: 91200000, status: 'aktif' },
  { code: '5002', name: 'Beban Operasional', type: 'beban', balance: 45800000, status: 'aktif' },
]

export const DUMMY_BALANCE_SHEET = {
  period: '2026-05-31',
  aset: {
    lancar: [
      { name: 'Kas', amount: 82500000 },
      { name: 'Piutang Usaha', amount: 35000000 },
      { name: 'Persediaan', amount: 125000000 },
    ],
    tetap: [
      { name: 'Peralatan', amount: 450000000 },
    ],
  },
  liabilitas: {
    lancar: [
      { name: 'Hutang Usaha', amount: 28000000 },
      { name: 'Hutang Pajak', amount: 12000000 },
    ],
  },
  ekuitas: [
    { name: 'Modal Saham', amount: 500000000 },
    { name: 'Laba Ditahan', amount: 137500000 },
  ],
}

export const DUMMY_INCOME_STATEMENT = {
  period: '2026-05-31',
  pendapatan: [
    { name: 'Penjualan', amount: 228000000 },
  ],
  hargaPokok: [
    { name: 'COGS', amount: -91200000 },
  ],
  beban: [
    { name: 'Beban Operasional', amount: -45800000 },
  ],
}

export const DUMMY_FINANCIAL_STATEMENT_MONTHLY = [
  {
    month: '2026-01',
    revenue: 180000000,
    cogs: 72000000,
    grossProfit: 108000000,
    operatingExpense: 42000000,
    netIncome: 66000000,
    totalAsset: 625000000,
    totalLiability: 65000000,
    totalEquity: 560000000,
  },
  {
    month: '2026-02',
    revenue: 205000000,
    cogs: 82000000,
    grossProfit: 123000000,
    operatingExpense: 48000000,
    netIncome: 75000000,
    totalAsset: 645000000,
    totalLiability: 68000000,
    totalEquity: 577000000,
  },
  {
    month: '2026-03',
    revenue: 198000000,
    cogs: 79200000,
    grossProfit: 118800000,
    operatingExpense: 46000000,
    netIncome: 72800000,
    totalAsset: 637500000,
    totalLiability: 67000000,
    totalEquity: 570500000,
  },
  {
    month: '2026-04',
    revenue: 242000000,
    cogs: 96800000,
    grossProfit: 145200000,
    operatingExpense: 54000000,
    netIncome: 91200000,
    totalAsset: 672500000,
    totalLiability: 70000000,
    totalEquity: 602500000,
  },
  {
    month: '2026-05',
    revenue: 228000000,
    cogs: 91200000,
    grossProfit: 136800000,
    operatingExpense: 45800000,
    netIncome: 91000000,
    totalAsset: 665000000,
    totalLiability: 70000000,
    totalEquity: 595000000,
  },
]
