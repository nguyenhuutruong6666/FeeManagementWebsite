import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // ==================== UNITS ====================
  const units = await Promise.all([
    prisma.unit.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: 'Trường Đại học Sư phạm Hà Nội' } }),
    prisma.unit.upsert({ where: { id: 2 }, update: {}, create: { id: 2, title: 'Khoa CNTT' } }),
    prisma.unit.upsert({ where: { id: 3 }, update: {}, create: { id: 3, title: 'Khoa Toán - Tin' } }),
    prisma.unit.upsert({ where: { id: 4 }, update: {}, create: { id: 4, title: 'Khoa Ngữ Văn' } }),
    prisma.unit.upsert({ where: { id: 5 }, update: {}, create: { id: 5, title: 'Chi đoàn K72E1' } }),
    prisma.unit.upsert({ where: { id: 6 }, update: {}, create: { id: 6, title: 'Chi đoàn K72E2' } }),
    prisma.unit.upsert({ where: { id: 7 }, update: {}, create: { id: 7, title: 'Chi đoàn K72E3' } }),
    prisma.unit.upsert({ where: { id: 8 }, update: {}, create: { id: 8, title: 'Chi đoàn K72E4' } }),
    prisma.unit.upsert({ where: { id: 9 }, update: {}, create: { id: 9, title: 'Chi đoàn K72A1' } }),
    prisma.unit.upsert({ where: { id: 10 }, update: {}, create: { id: 10, title: 'Chi đoàn K72A2' } }),
    prisma.unit.upsert({ where: { id: 11 }, update: {}, create: { id: 11, title: 'Chi đoàn K72A3' } }),
    prisma.unit.upsert({ where: { id: 12 }, update: {}, create: { id: 12, title: 'Chi đoàn K72A4' } }),
    prisma.unit.upsert({ where: { id: 13 }, update: {}, create: { id: 13, title: 'Chi đoàn K72B1' } }),
    prisma.unit.upsert({ where: { id: 14 }, update: {}, create: { id: 14, title: 'Chi đoàn K72B2' } }),
    prisma.unit.upsert({ where: { id: 15 }, update: {}, create: { id: 15, title: 'Chi đoàn K72B3' } }),
    prisma.unit.upsert({ where: { id: 16 }, update: {}, create: { id: 16, title: 'Chi đoàn K72B4' } }),
  ]);
  console.log(`✅ Đã tạo ${units.length} units`);

  // ==================== BRANDS ====================
  await Promise.all([
    prisma.brand.upsert({ where: { id: 1 }, update: {}, create: { id: 1, title: 'Trường' } }),
    prisma.brand.upsert({ where: { id: 2 }, update: {}, create: { id: 2, title: 'Khoa' } }),
    prisma.brand.upsert({ where: { id: 3 }, update: {}, create: { id: 3, title: 'Chi đoàn' } }),
  ]);
  console.log('✅ Đã tạo 3 brands');

  // ==================== UNIT_BRAND ====================
  const unitBrandData = [
    { id: 1, brandId: 1, unitId: 1, parentUnitId: null },
    { id: 2, brandId: 2, unitId: 2, parentUnitId: 1 },
    { id: 3, brandId: 2, unitId: 3, parentUnitId: 1 },
    { id: 4, brandId: 2, unitId: 4, parentUnitId: 1 },
    { id: 5, brandId: 3, unitId: 5, parentUnitId: 2 },
    { id: 6, brandId: 3, unitId: 6, parentUnitId: 2 },
    { id: 7, brandId: 3, unitId: 7, parentUnitId: 2 },
    { id: 8, brandId: 3, unitId: 8, parentUnitId: 2 },
    { id: 9, brandId: 3, unitId: 9, parentUnitId: 4 },
    { id: 10, brandId: 3, unitId: 10, parentUnitId: 4 },
    { id: 11, brandId: 3, unitId: 11, parentUnitId: 4 },
    { id: 12, brandId: 3, unitId: 12, parentUnitId: 4 },
    { id: 13, brandId: 3, unitId: 13, parentUnitId: 3 },
    { id: 14, brandId: 3, unitId: 14, parentUnitId: 3 },
    { id: 15, brandId: 3, unitId: 15, parentUnitId: 3 },
    { id: 16, brandId: 3, unitId: 16, parentUnitId: 3 },
  ];
  for (const ub of unitBrandData) {
    await prisma.unitBrand.upsert({ where: { id: ub.id }, update: {}, create: ub });
  }
  console.log('✅ Đã tạo 16 unit_brands');

  // ==================== USERS ====================
  const hashedPassword = await bcrypt.hash('123456', 10);
  const usersData = [
    { userId: 1, userName: 'admin', fullName: 'Administrator', gender: 1, identifyCard: '100000001', email: 'admin@gmail.com', password: hashedPassword, birthDate: new Date('1975-06-06'), joinDate: new Date('2000-06-06'), roleName: 'Quản trị viên', isAdmin: 1, unitId: 1 },
    { userId: 2, userName: 'bchtruong1', fullName: 'BCH Truong 1', gender: 0, identifyCard: '100000002', email: 'bchtruong1@doan.org', password: hashedPassword, birthDate: new Date('1979-02-14'), joinDate: new Date('2001-01-05'), roleName: 'BCH Trường', isAdmin: 0, unitId: 1 },
    { userId: 3, userName: 'bchtruong2', fullName: 'BCH Truong 2', gender: 1, identifyCard: '100000003', email: 'bchtruong2@doan.org', password: hashedPassword, birthDate: new Date('1980-03-20'), joinDate: new Date('2002-01-05'), roleName: 'BCH Trường', isAdmin: 0, unitId: 1 },
    { userId: 6, userName: 'kcntt_01', fullName: 'Truong Khoa CNTT 1', gender: 0, identifyCard: '100000006', email: 'kcntt01@hnue.edu.vn', password: hashedPassword, birthDate: new Date('1978-05-12'), joinDate: new Date('2010-03-02'), roleName: 'BCH Khoa', isAdmin: 0, unitId: 2 },
    { userId: 7, userName: 'kcntt_02', fullName: 'Truong Khoa CNTT 2', gender: 1, identifyCard: '100000007', email: 'kcntt02@hnue.edu.vn', password: hashedPassword, birthDate: new Date('1982-07-15'), joinDate: new Date('2011-03-02'), roleName: 'BCH Khoa', isAdmin: 0, unitId: 2 },
    { userId: 10, userName: 'ktoannt_01', fullName: 'Truong Khoa Toan Tin 1', gender: 0, identifyCard: '100000010', email: 'ktoannt01@hnue.edu.vn', password: hashedPassword, birthDate: new Date('1980-08-25'), joinDate: new Date('2012-03-02'), roleName: 'BCH Khoa', isAdmin: 0, unitId: 3 },
    { userId: 14, userName: 'knguvan_01', fullName: 'Truong Khoa Ngu Van 1', gender: 1, identifyCard: '100000014', email: 'knguvan01@hnue.edu.vn', password: hashedPassword, birthDate: new Date('1981-11-10'), joinDate: new Date('2013-03-02'), roleName: 'BCH Khoa', isAdmin: 0, unitId: 4 },
    { userId: 18, userName: 'bch_cd_k72e1_1', fullName: 'BCH CD K72E1 - 1', gender: 0, identifyCard: '100000018', email: 'bchk72e1_1@doan.org', password: hashedPassword, birthDate: new Date('1990-02-02'), joinDate: new Date('2015-05-10'), roleName: 'BCH Chi đoàn', isAdmin: 0, unitId: 5 },
    { userId: 19, userName: 'bch_cd_k72e2_1', fullName: 'BCH CD K72E2 - 1', gender: 1, identifyCard: '100000019', email: 'bchk72e2_1@doan.org', password: hashedPassword, birthDate: new Date('1991-03-15'), joinDate: new Date('2016-05-10'), roleName: 'BCH Chi đoàn', isAdmin: 0, unitId: 6 },
    { userId: 62, userName: 'sv_k72e1_01', fullName: 'Nguyen Van E1', gender: 1, identifyCard: '100000062', email: 'stu725105179@hnue.edu.vn', password: hashedPassword, birthDate: new Date('2000-01-10'), joinDate: new Date('2019-09-01'), roleName: 'Đoàn viên', isAdmin: 0, unitId: 5 },
    { userId: 63, userName: 'sv_k72e1_02', fullName: 'Tran Thi E1', gender: 0, identifyCard: '100000063', email: 'stu725105180@hnue.edu.vn', password: hashedPassword, birthDate: new Date('2001-05-20'), joinDate: new Date('2019-09-01'), roleName: 'Đoàn viên', isAdmin: 0, unitId: 5 },
    { userId: 64, userName: 'sv_k72e1_03', fullName: 'Le Van Tuan E1', gender: 1, identifyCard: '100000064', email: 'stu725105181@hnue.edu.vn', password: hashedPassword, birthDate: new Date('2001-07-12'), joinDate: new Date('2019-09-01'), roleName: 'Đoàn viên', isAdmin: 0, unitId: 5 },
    { userId: 70, userName: 'sv_k72e2_01', fullName: 'Pham Thi E2', gender: 0, identifyCard: '100000070', email: 'stu725105187@hnue.edu.vn', password: hashedPassword, birthDate: new Date('2000-09-23'), joinDate: new Date('2019-09-01'), roleName: 'Đoàn viên', isAdmin: 0, unitId: 6 },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({ where: { userId: u.userId }, update: { password: u.password }, create: u });
  }
  console.log(`✅ Đã tạo ${usersData.length} users`);

  // ==================== FEE POLICY ====================
  await prisma.feePolicy.upsert({
    where: { id: 13 },
    update: {},
    create: {
      id: 13,
      policyName: 'Chính sách đoàn phí năm 2025',
      cycle: 'Tháng',
      dueDate: new Date('2025-12-15'),
      standardAmount: 10000,
      status: 'Active',
      rulesJson: JSON.stringify({ 'BCH Trường': 5000, 'BCH Khoa': 3000, 'BCH Chi đoàn': 2000 }),
      createdBy: 1,
    },
  });
  console.log('✅ Đã tạo fee_policy');

  // ==================== FEE OBLIGATION ====================
  await prisma.feeObligation.upsert({
    where: { id: 965 },
    update: {},
    create: {
      id: 965, userId: 2, policyId: 13, periodLabel: 'test',
      amount: 5000, dueDate: new Date('2025-12-15'), status: 'Đã nộp', referenceCode: 'DV-100000002-test',
    },
  });
  await prisma.feeObligation.upsert({
    where: { id: 969 },
    update: {},
    create: {
      id: 969, userId: 6, policyId: 13, periodLabel: 'test',
      amount: 7000, dueDate: new Date('2025-12-15'), status: 'Đã nộp', referenceCode: 'DV-100000006-test',
    },
  });
  console.log('✅ Đã tạo fee_obligations mẫu');

  // ==================== ACTIVITY PROPOSAL ====================
  await prisma.activityProposal.upsert({
    where: { id: 19 },
    update: {},
    create: {
      id: 19,
      title: 'Thiện nguyện',
      content: 'Mua áo tặng trẻ em nghèo',
      estimatedBudget: 10000,
      expectedDate: new Date('2025-12-20'),
      proposerId: 18,
      unitId: 5,
      status: 'Đã phê duyệt',
      approvedBy: 6,
      approvedAt: new Date('2025-12-07'),
      approvedBudget: 10000,
      approvalComment: 'Đồng ý',
      advancePayment: 'Chi',
    },
  });
  console.log('✅ Đã tạo activity_proposal mẫu');

  // ==================== FEE CASHBOOK ====================
  await prisma.feeCashbook.upsert({
    where: { id: 60 },
    update: {},
    create: {
      id: 60,
      unitId: 5,
      transactionType: 'Thu',
      transactionCategory: 'Đoàn phí',
      transactionDate: new Date('2025-12-07'),
      amount: 11600,
      description: 'Thu đoàn phí cộng dồn các kỳ - đơn vị 5',
      recordedBy: 18,
    },
  });
  console.log('✅ Đã tạo fee_cashbook mẫu');

  // ==================== FEE SUMMARY ====================
  await prisma.feeSummary.upsert({
    where: { id: 5 },
    update: {},
    create: {
      id: 5,
      unitId: 5,
      totalMembers: 9,
      paidMembers: 6,
      unpaidMembers: 3,
      totalActivities: 1,
      approvedActivities: 1,
      activeActivities: 0,
      totalIncome: 11600,
      totalExpense: 10000,
      year: 2025,
    },
  });
  console.log('✅ Đã tạo fee_summary mẫu');

  console.log('\n🎉 Seed hoàn thành! Tài khoản mặc định: admin / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
