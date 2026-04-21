import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Bắt đầu seed dữ liệu...');

  // ---------------------------------------------------------
  // 1. BẢNG UNIT
  // ---------------------------------------------------------
  const unitsData = [
    { id: 1, title: 'Trường Đại học Sư phạm Hà Nội' },
    { id: 2, title: 'Khoa CNTT' },
    { id: 3, title: 'Khoa Toán - Tin' },
    { id: 4, title: 'Khoa Ngữ Văn' },
    { id: 5, title: 'Chi đoàn K72E1' },
    { id: 6, title: 'Chi đoàn K72E2' },
    { id: 7, title: 'Chi đoàn K72E3' },
    { id: 8, title: 'Chi đoàn K72E4' },
    { id: 9, title: 'Chi đoàn K72A1' },
    { id: 10, title: 'Chi đoàn K72A2' },
    { id: 11, title: 'Chi đoàn K72A3' },
    { id: 12, title: 'Chi đoàn K72A4' },
    { id: 13, title: 'Chi đoàn K72B1' },
    { id: 14, title: 'Chi đoàn K72B2' },
    { id: 15, title: 'Chi đoàn K72B3' },
    { id: 16, title: 'Chi đoàn K72B4' }
  ];

  for (const u of unitsData) {
    await prisma.unit.upsert({ where: { id: u.id }, update: {}, create: u });
  }
  console.log(`✅ Đã tạo ${unitsData.length} units`);

  // ---------------------------------------------------------
  // 2. BẢNG BRAND
  // ---------------------------------------------------------
  const brandsData = [
    { id: 1, title: 'Trường' },
    { id: 2, title: 'Khoa' },
    { id: 3, title: 'Chi đoàn' }
  ];

  for (const b of brandsData) {
    await prisma.brand.upsert({ where: { id: b.id }, update: {}, create: b });
  }
  console.log(`✅ Đã tạo ${brandsData.length} brands`);

  // ---------------------------------------------------------
  // 3. BẢNG UNIT_BRAND
  // ---------------------------------------------------------
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
    { id: 16, brandId: 3, unitId: 16, parentUnitId: 3 }
  ];

  for (const ub of unitBrandData) {
    await prisma.unitBrand.upsert({ where: { id: ub.id }, update: {}, create: ub });
  }
  console.log(`✅ Đã tạo ${unitBrandData.length} unit_brands`);

  // ---------------------------------------------------------
  // 4. BẢNG USERS
  // ---------------------------------------------------------
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Mảng dữ liệu được map chuẩn từ câu lệnh SQL thô
  const usersRawArray = [
    [1, 'admin', 'Administrator', 1, '100000001', 'admin@gmail.com', '1975-06-06', '2000-06-06', 'Quản trị viên', 1, 1],
    [2, 'bchtruong1', 'BCH Truong 1', 0, '100000002', 'bchtruong1@doan.org', '1979-02-14', '2001-01-05', 'BCH Trường', 0, 1],
    [3, 'bchtruong2', 'BCH Truong 2', 1, '100000003', 'bchtruong2@doan.org', '1980-08-20', '2002-03-10', 'BCH Trường', 0, 1],
    [4, 'bchtruong3', 'BCH Truong 3', 0, '100000004', 'bchtruong3@doan.org', '1982-11-11', '2003-05-15', 'BCH Trường', 0, 1],
    [5, 'bchtruong4', 'BCH Truong 4', 1, '100000005', 'bchtruong4@doan.org', '1976-04-04', '1999-09-01', 'BCH Trường', 0, 1],
    [6, 'kcntt_01', 'Truong Khoa CNTT 1', 0, '100000006', 'kcntt01@hnue.edu.vn', '1978-05-12', '2010-03-02', 'BCH Khoa', 0, 2],
    [7, 'kcntt_02', 'Truong Khoa CNTT 2', 0, '100000007', 'kcntt02@hnue.edu.vn', '1981-09-09', '2011-04-10', 'BCH Khoa', 0, 2],
    [8, 'kcntt_03', 'Truong Khoa CNTT 3', 1, '100000008', 'kcntt03@hnue.edu.vn', '1975-12-12', '2009-07-20', 'BCH Khoa', 0, 2],
    [9, 'kcntt_04', 'Truong Khoa CNTT 4', 0, '100000009', 'kcntt04@hnue.edu.vn', '1983-03-03', '2012-02-28', 'BCH Khoa', 0, 2],
    [10, 'ktoantin_01', 'Truong Khoa Toan-Tin 1', 1, '100000010', 'ktoantin01@hnue.edu.vn', '1979-06-06', '2008-09-01', 'BCH Khoa', 0, 3],
    [11, 'ktoantin_02', 'Truong Khoa Toan-Tin 2', 0, '100000011', 'ktoantin02@hnue.edu.vn', '1980-10-10', '2009-10-10', 'BCH Khoa', 0, 3],
    [12, 'ktoantin_03', 'Truong Khoa Toan-Tin 3', 1, '100000012', 'ktoantin03@hnue.edu.vn', '1976-01-05', '2007-05-05', 'BCH Khoa', 0, 3],
    [13, 'ktoantin_04', 'Truong Khoa Toan-Tin 4', 0, '100000013', 'ktoantin04@hnue.edu.vn', '1984-12-12', '2013-11-11', 'BCH Khoa', 0, 3],
    [14, 'knguvan_01', 'Truong Khoa Ngu Van 1', 0, '100000014', 'knguvan01@hnue.edu.vn', '1982-07-07', '2006-08-08', 'BCH Khoa', 0, 4],
    [15, 'knguvan_02', 'Truong Khoa Ngu Van 2', 1, '100000015', 'knguvan02@hnue.edu.vn', '1977-09-09', '2005-04-04', 'BCH Khoa', 0, 4],
    [16, 'knguvan_03', 'Truong Khoa Ngu Van 3', 0, '100000016', 'knguvan03@hnue.edu.vn', '1985-01-20', '2014-01-20', 'BCH Khoa', 0, 4],
    [17, 'knguvan_04', 'Truong Khoa Ngu Van 4', 1, '100000017', 'knguvan04@hnue.edu.vn', '1974-02-02', '2003-03-03', 'BCH Khoa', 0, 4],
    [18, 'bch_cd_k72e1_1', 'BCH CD K72E1 - 1', 0, '100000018', 'bchk72e1_1@doan.org', '1990-02-02', '2015-05-10', 'BCH Chi đoàn', 0, 5],
    [19, 'bch_cd_k72e1_2', 'BCH CD K72E1 - 2', 1, '100000019', 'nguyenhuutruong6666@gmail.com', '1991-03-03', '2016-06-11', 'BCH Chi đoàn', 0, 5],
    [20, 'bch_cd_k72e1_3', 'BCH CD K72E1 - 3', 0, '100000020', 'bchk72e1_3@doan.org', '1992-04-04', '2017-07-12', 'BCH Chi đoàn', 0, 5],
    [21, 'bch_cd_k72e1_4', 'BCH CD K72E1 - 4', 1, '100000021', 'bchk72e1_4@doan.org', '1989-05-05', '2014-08-13', 'BCH Chi đoàn', 0, 5],
    [22, 'bch_cd_k72e2_1', 'BCH CD K72E2 - 1', 1, '100000022', 'bchk72e2_1@doan.org', '1990-06-06', '2015-09-14', 'BCH Chi đoàn', 0, 6],
    [23, 'bch_cd_k72e2_2', 'BCH CD K72E2 - 2', 0, '100000023', 'bchk72e2_2@doan.org', '1991-07-07', '2016-10-15', 'BCH Chi đoàn', 0, 6],
    [24, 'bch_cd_k72e2_3', 'BCH CD K72E2 - 3', 1, '100000024', 'bchk72e2_3@doan.org', '1992-08-08', '2017-11-16', 'BCH Chi đoàn', 0, 6],
    [25, 'bch_cd_k72e2_4', 'BCH CD K72E2 - 4', 0, '100000025', 'bchk72e2_4@doan.org', '1988-09-09', '2014-12-17', 'BCH Chi đoàn', 0, 6],
    [26, 'bch_cd_k72e3_1', 'BCH CD K72E3 - 1', 0, '100000026', 'bchk72e3_1@doan.org', '1990-10-10', '2015-01-18', 'BCH Chi đoàn', 0, 7],
    [27, 'bch_cd_k72e3_2', 'BCH CD K72E3 - 2', 1, '100000027', 'bchk72e3_2@doan.org', '1991-11-11', '2016-02-19', 'BCH Chi đoàn', 0, 7],
    [28, 'bch_cd_k72e3_3', 'BCH CD K72E3 - 3', 0, '100000028', 'bchk72e3_3@doan.org', '1992-12-12', '2017-03-20', 'BCH Chi đoàn', 0, 7],
    [29, 'bch_cd_k72e3_4', 'BCH CD K72E3 - 4', 1, '100000029', 'bchk72e3_4@doan.org', '1989-01-01', '2014-04-21', 'BCH Chi đoàn', 0, 7],
    [30, 'bch_cd_k72e4_1', 'BCH CD K72E4 - 1', 1, '100000030', 'bchk72e4_1@doan.org', '1990-02-02', '2015-05-22', 'BCH Chi đoàn', 0, 8],
    [31, 'bch_cd_k72e4_2', 'BCH CD K72E4 - 2', 0, '100000031', 'bchk72e4_2@doan.org', '1991-03-03', '2016-06-23', 'BCH Chi đoàn', 0, 8],
    [32, 'bch_cd_k72e4_3', 'BCH CD K72E4 - 3', 1, '100000032', 'bchk72e4_3@doan.org', '1992-04-04', '2017-07-24', 'BCH Chi đoàn', 0, 8],
    [33, 'bch_cd_k72e4_4', 'BCH CD K72E4 - 4', 0, '100000033', 'bchk72e4_4@doan.org', '1989-05-05', '2014-08-25', 'BCH Chi đoàn', 0, 8],
    [34, 'bch_cd_k72a1_1', 'BCH CD K72A1 - 1', 0, '100000034', 'bchk72a1_1@doan.org', '1990-06-06', '2015-09-26', 'BCH Chi đoàn', 0, 9],
    [35, 'bch_cd_k72a1_2', 'BCH CD K72A1 - 2', 1, '100000035', 'bchk72a1_2@doan.org', '1991-07-07', '2016-10-27', 'BCH Chi đoàn', 0, 9],
    [36, 'bch_cd_k72a1_3', 'BCH CD K72A1 - 3', 0, '100000036', 'bchk72a1_3@doan.org', '1992-08-08', '2017-11-28', 'BCH Chi đoàn', 0, 9],
    [37, 'bch_cd_k72a1_4', 'BCH CD K72A1 - 4', 1, '100000037', 'bchk72a1_4@doan.org', '1988-09-09', '2014-12-29', 'BCH Chi đoàn', 0, 9],
    [38, 'bch_cd_k72a2_1', 'BCH CD K72A2 - 1', 1, '100000038', 'bchk72a2_1@doan.org', '1990-10-10', '2015-01-30', 'BCH Chi đoàn', 0, 10],
    [39, 'bch_cd_k72a2_2', 'BCH CD K72A2 - 2', 0, '100000039', 'bchk72a2_2@doan.org', '1991-11-11', '2016-02-29', 'BCH Chi đoàn', 0, 10],
    [40, 'bch_cd_k72a2_3', 'BCH CD K72A2 - 3', 1, '100000040', 'bchk72a2_3@doan.org', '1992-12-12', '2017-03-31', 'BCH Chi đoàn', 0, 10],
    [41, 'bch_cd_k72a2_4', 'BCH CD K72A2 - 4', 0, '100000041', 'bchk72a2_4@doan.org', '1989-01-01', '2014-04-01', 'BCH Chi đoàn', 0, 10],
    [42, 'bch_cd_k72a3_1', 'BCH CD K72A3 - 1', 0, '100000042', 'bchk72a3_1@doan.org', '1990-02-02', '2015-05-02', 'BCH Chi đoàn', 0, 11],
    [43, 'bch_cd_k72a3_2', 'BCH CD K72A3 - 2', 1, '100000043', 'bchk72a3_2@doan.org', '1991-03-03', '2016-06-03', 'BCH Chi đoàn', 0, 11],
    [44, 'bch_cd_k72a3_3', 'BCH CD K72A3 - 3', 0, '100000044', 'bchk72a3_3@doan.org', '1992-04-04', '2017-07-04', 'BCH Chi đoàn', 0, 11],
    [45, 'bch_cd_k72a3_4', 'BCH CD K72A3 - 4', 1, '100000045', 'bchk72a3_4@doan.org', '1989-05-05', '2014-08-05', 'BCH Chi đoàn', 0, 11],
    [46, 'bch_cd_k72a4_1', 'BCH CD K72A4 - 1', 1, '100000046', 'bchk72a4_1@doan.org', '1990-06-06', '2015-09-06', 'BCH Chi đoàn', 0, 12],
    [47, 'bch_cd_k72a4_2', 'BCH CD K72A4 - 2', 0, '100000047', 'bchk72a4_2@doan.org', '1991-07-07', '2016-10-06', 'BCH Chi đoàn', 0, 12],
    [48, 'bch_cd_k72a4_3', 'BCH CD K72A4 - 3', 1, '100000048', 'bchk72a4_3@doan.org', '1992-08-08', '2017-11-06', 'BCH Chi đoàn', 0, 12],
    [49, 'bch_cd_k72a4_4', 'BCH CD K72A4 - 4', 0, '100000049', 'bchk72a4_4@doan.org', '1988-09-09', '2014-12-06', 'BCH Chi đoàn', 0, 12],
    [50, 'bch_cd_k72b1_1', 'BCH CD K72B1 - 1', 0, '100000050', 'bchk72b1_1@doan.org', '1990-10-10', '2015-01-05', 'BCH Chi đoàn', 0, 13],
    [51, 'bch_cd_k72b1_2', 'BCH CD K72B1 - 2', 1, '100000051', 'bchk72b1_2@doan.org', '1991-11-11', '2016-02-06', 'BCH Chi đoàn', 0, 13],
    [52, 'bch_cd_k72b1_3', 'BCH CD K72B1 - 3', 0, '100000052', 'bchk72b1_3@doan.org', '1992-12-12', '2017-03-07', 'BCH Chi đoàn', 0, 13],
    [53, 'bch_cd_k72b1_4', 'BCH CD K72B1 - 4', 1, '100000053', 'bchk72b1_4@doan.org', '1989-01-01', '2014-04-08', 'BCH Chi đoàn', 0, 13],
    [54, 'bch_cd_k72b2_1', 'BCH CD K72B2 - 1', 1, '100000054', 'bchk72b2_1@doan.org', '1990-02-02', '2015-05-09', 'BCH Chi đoàn', 0, 14],
    [55, 'bch_cd_k72b2_2', 'BCH CD K72B2 - 2', 0, '100000055', 'bchk72b2_2@doan.org', '1991-03-03', '2016-06-10', 'BCH Chi đoàn', 0, 14],
    [56, 'bch_cd_k72b2_3', 'BCH CD K72B2 - 3', 1, '100000056', 'bchk72b2_3@doan.org', '1992-04-04', '2017-07-11', 'BCH Chi đoàn', 0, 14],
    [57, 'bch_cd_k72b2_4', 'BCH CD K72B2 - 4', 0, '100000057', 'bchk72b2_4@doan.org', '1989-05-05', '2014-08-12', 'BCH Chi đoàn', 0, 14],
    [58, 'bch_cd_k72b3_1', 'BCH CD K72B3 - 1', 0, '100000058', 'bchk72b3_1@doan.org', '1990-06-06', '2015-09-13', 'BCH Chi đoàn', 0, 15],
    [59, 'bch_cd_k72b3_2', 'BCH CD K72B3 - 2', 1, '100000059', 'bchk72b3_2@doan.org', '1991-07-07', '2016-10-14', 'BCH Chi đoàn', 0, 15],
    [60, 'bch_cd_k72b3_3', 'BCH CD K72B3 - 3', 0, '100000060', 'bchk72b3_3@doan.org', '1992-08-08', '2017-11-15', 'BCH Chi đoàn', 0, 15],
    [61, 'bch_cd_k72b3_4', 'BCH CD K72B3 - 4', 1, '100000061', 'bchk72b3_4@doan.org', '1989-09-09', '2014-12-16', 'BCH Chi đoàn', 0, 15],
    [62, 'sv_k72e1_01', 'Nguyen Van E1', 1, '100000062', 'stu725105179@hnue.edu.vn', '2000-01-10', '2019-09-01', 'Đoàn viên', 0, 5],
    [63, 'sv_k72e1_02', 'Tran Thi E2', 0, '100000063', 'sv_k72e1_02@hnue.edu.vn', '2000-02-11', '2019-09-02', 'Đoàn viên', 0, 5],
    [64, 'sv_k72e1_03', 'Le Van E3', 1, '100000064', 'sv_k72e1_03@hnue.edu.vn', '2000-03-12', '2019-09-03', 'Đoàn viên', 0, 5],
    [65, 'sv_k72e1_04', 'Pham Thi E4', 0, '100000065', 'sv_k72e1_04@hnue.edu.vn', '2000-04-13', '2019-09-04', 'Đoàn viên', 0, 5],
    [66, 'sv_k72e1_05', 'Hoang Van E5', 1, '100000066', 'sv_k72e1_05@hnue.edu.vn', '2000-05-14', '2019-09-05', 'Đoàn viên', 0, 5],
    [67, 'sv_k72e2_01', 'Nguyen Van F1', 1, '100000067', 'sv_k72e2_01@hnue.edu.vn', '2000-06-15', '2019-09-06', 'Đoàn viên', 0, 6],
    [68, 'sv_k72e2_02', 'Tran Thi F2', 0, '100000068', 'sv_k72e2_02@hnue.edu.vn', '2000-07-16', '2019-09-07', 'Đoàn viên', 0, 6],
    [69, 'sv_k72e2_03', 'Le Van F3', 1, '100000069', 'sv_k72e2_03@hnue.edu.vn', '2000-08-17', '2019-09-08', 'Đoàn viên', 0, 6],
    [70, 'sv_k72e2_04', 'Pham Thi F4', 0, '100000070', 'sv_k72e2_04@hnue.edu.vn', '2000-09-18', '2019-09-09', 'Đoàn viên', 0, 6],
    [71, 'sv_k72e2_05', 'Hoang Van F5', 1, '100000071', 'sv_k72e2_05@hnue.edu.vn', '2000-10-19', '2019-09-10', 'Đoàn viên', 0, 6],
    [72, 'sv_k72e3_01', 'Nguyen Van G1', 1, '100000072', 'sv_k72e3_01@hnue.edu.vn', '2000-11-20', '2019-09-11', 'Đoàn viên', 0, 7],
    [73, 'sv_k72e3_02', 'Tran Thi G2', 0, '100000073', 'sv_k72e3_02@hnue.edu.vn', '2000-12-21', '2019-09-12', 'Đoàn viên', 0, 7],
    [74, 'sv_k72e3_03', 'Le Van G3', 1, '100000074', 'sv_k72e3_03@hnue.edu.vn', '2001-01-22', '2020-02-01', 'Đoàn viên', 0, 7],
    [75, 'sv_k72e3_04', 'Pham Thi G4', 0, '100000075', 'sv_k72e3_04@hnue.edu.vn', '2001-02-23', '2020-02-02', 'Đoàn viên', 0, 7],
    [76, 'sv_k72e3_05', 'Hoang Van G5', 1, '100000076', 'sv_k72e3_05@hnue.edu.vn', '2001-03-24', '2020-02-03', 'Đoàn viên', 0, 7],
    [77, 'sv_k72e4_01', 'Nguyen Van H1', 1, '100000077', 'sv_k72e4_01@hnue.edu.vn', '2001-04-25', '2020-02-04', 'Đoàn viên', 0, 8],
    [78, 'sv_k72e4_02', 'Tran Thi H2', 0, '100000078', 'sv_k72e4_02@hnue.edu.vn', '2001-05-26', '2020-02-05', 'Đoàn viên', 0, 8],
    [79, 'sv_k72e4_03', 'Le Van H3', 1, '100000079', 'sv_k72e4_03@hnue.edu.vn', '2001-06-27', '2020-02-06', 'Đoàn viên', 0, 8],
    [80, 'sv_k72e4_04', 'Pham Thi H4', 0, '100000080', 'sv_k72e4_04@hnue.edu.vn', '2001-07-28', '2020-02-07', 'Đoàn viên', 0, 8],
    [81, 'sv_k72e4_05', 'Hoang Van H5', 1, '100000081', 'sv_k72e4_05@hnue.edu.vn', '2001-08-29', '2020-02-08', 'Đoàn viên', 0, 8],
    [82, 'sv_k72a1_01', 'Nguyen Van A1', 1, '100000082', 'sv_k72a1_01@hnue.edu.vn', '2001-09-30', '2020-03-01', 'Đoàn viên', 0, 9],
    [83, 'sv_k72a1_02', 'Tran Thi A2', 0, '100000083', 'sv_k72a1_02@hnue.edu.vn', '2001-10-01', '2020-03-02', 'Đoàn viên', 0, 9],
    [84, 'sv_k72a1_03', 'Le Van A3', 1, '100000084', 'sv_k72a1_03@hnue.edu.vn', '2001-11-02', '2020-03-03', 'Đoàn viên', 0, 9],
    [85, 'sv_k72a1_04', 'Pham Thi A4', 0, '100000085', 'sv_k72a1_04@hnue.edu.vn', '2001-12-03', '2020-03-04', 'Đoàn viên', 0, 9],
    [86, 'sv_k72a1_05', 'Hoang Van A5', 1, '100000086', 'sv_k72a1_05@hnue.edu.vn', '2002-01-04', '2020-03-05', 'Đoàn viên', 0, 9],
    [87, 'sv_k72a2_01', 'Nguyen Van B1', 1, '100000087', 'sv_k72a2_01@hnue.edu.vn', '2002-02-05', '2020-03-06', 'Đoàn viên', 0, 10],
    [88, 'sv_k72a2_02', 'Tran Thi B2', 0, '100000088', 'sv_k72a2_02@hnue.edu.vn', '2002-03-06', '2020-03-07', 'Đoàn viên', 0, 10],
    [89, 'sv_k72a2_03', 'Le Van B3', 1, '100000089', 'sv_k72a2_03@hnue.edu.vn', '2002-04-07', '2020-03-08', 'Đoàn viên', 0, 10],
    [90, 'sv_k72a2_04', 'Pham Thi B4', 0, '100000090', 'sv_k72a2_04@hnue.edu.vn', '2002-05-08', '2020-03-09', 'Đoàn viên', 0, 10],
    [91, 'sv_k72a2_05', 'Hoang Van B5', 1, '100000091', 'sv_k72a2_05@hnue.edu.vn', '2002-06-09', '2020-03-10', 'Đoàn viên', 0, 10],
    [92, 'sv_k72a3_01', 'Nguyen Van C1', 1, '100000092', 'sv_k72a3_01@hnue.edu.vn', '2002-07-10', '2020-03-11', 'Đoàn viên', 0, 11],
    [93, 'sv_k72a3_02', 'Tran Thi C2', 0, '100000093', 'sv_k72a3_02@hnue.edu.vn', '2002-08-11', '2020-03-12', 'Đoàn viên', 0, 11],
    [94, 'sv_k72a3_03', 'Le Van C3', 1, '100000094', 'sv_k72a3_03@hnue.edu.vn', '2002-09-12', '2020-03-13', 'Đoàn viên', 0, 11],
    [95, 'sv_k72a3_04', 'Pham Thi C4', 0, '100000095', 'sv_k72a3_04@hnue.edu.vn', '2002-10-13', '2020-03-14', 'Đoàn viên', 0, 11],
    [96, 'sv_k72a3_05', 'Hoang Van C5', 1, '100000096', 'sv_k72a3_05@hnue.edu.vn', '2002-11-14', '2020-03-15', 'Đoàn viên', 0, 11],
    [97, 'sv_k72a4_01', 'Nguyen Van D1', 1, '100000097', 'sv_k72a4_01@hnue.edu.vn', '2002-12-15', '2020-03-16', 'Đoàn viên', 0, 12],
    [98, 'sv_k72a4_02', 'Tran Thi D2', 0, '100000098', 'sv_k72a4_02@hnue.edu.vn', '2003-01-16', '2020-03-17', 'Đoàn viên', 0, 12],
    [99, 'sv_k72a4_03', 'Le Van D3', 1, '100000099', 'sv_k72a4_03@hnue.edu.vn', '2003-02-17', '2020-03-18', 'Đoàn viên', 0, 12],
    [100, 'sv_k72a4_04', 'Pham Thi D4', 0, '100000100', 'sv_k72a4_04@hnue.edu.vn', '2003-03-18', '2020-03-19', 'Đoàn viên', 0, 12],
    [101, 'sv_k72a4_05', 'Hoang Van D5', 1, '100000101', 'sv_k72a4_05@hnue.edu.vn', '2003-04-19', '2020-03-20', 'Đoàn viên', 0, 12],
    [102, 'sv_k72b1_01', 'Nguyen Van B1-1', 1, '100000102', 'sv_k72b1_01@hnue.edu.vn', '2001-05-20', '2019-10-01', 'Đoàn viên', 0, 13],
    [103, 'sv_k72b1_02', 'Tran Thi B1-2', 0, '100000103', 'sv_k72b1_02@hnue.edu.vn', '2001-06-21', '2019-10-02', 'Đoàn viên', 0, 13],
    [104, 'sv_k72b1_03', 'Le Van B1-3', 1, '100000104', 'sv_k72b1_03@hnue.edu.vn', '2001-07-22', '2019-10-03', 'Đoàn viên', 0, 13],
    [105, 'sv_k72b1_04', 'Pham Thi B1-4', 0, '100000105', 'sv_k72b1_04@hnue.edu.vn', '2001-08-23', '2019-10-04', 'Đoàn viên', 0, 13],
    [106, 'sv_k72b1_05', 'Hoang Van B1-5', 1, '100000106', 'sv_k72b1_05@hnue.edu.vn', '2001-09-24', '2019-10-05', 'Đoàn viên', 0, 13],
    [107, 'sv_k72b2_01', 'Nguyen Van B2-1', 1, '100000107', 'sv_k72b2_01@hnue.edu.vn', '2001-10-25', '2019-10-06', 'Đoàn viên', 0, 14],
    [108, 'sv_k72b2_02', 'Tran Thi B2-2', 0, '100000108', 'sv_k72b2_02@hnue.edu.vn', '2001-11-26', '2019-10-07', 'Đoàn viên', 0, 14],
    [109, 'sv_k72b2_03', 'Le Van B2-3', 1, '100000109', 'sv_k72b2_03@hnue.edu.vn', '2001-12-27', '2019-10-08', 'Đoàn viên', 0, 14],
    [110, 'sv_k72b2_04', 'Pham Thi B2-4', 0, '100000110', 'sv_k72b2_04@hnue.edu.vn', '2002-01-28', '2019-10-09', 'Đoàn viên', 0, 14],
    [111, 'sv_k72b2_05', 'Hoang Van B2-5', 1, '100000111', 'sv_k72b2_05@hnue.edu.vn', '2002-02-28', '2019-10-10', 'Đoàn viên', 0, 14],
    [112, 'sv_k72b3_01', 'Nguyen Van B3-1', 1, '100000112', 'sv_k72b3_01@hnue.edu.vn', '2002-03-29', '2019-10-11', 'Đoàn viên', 0, 15],
    [113, 'sv_k72b3_02', 'Tran Thi B3-2', 0, '100000113', 'sv_k72b3_02@hnue.edu.vn', '2002-04-30', '2019-10-12', 'Đoàn viên', 0, 15],
    [114, 'sv_k72b3_03', 'Le Van B3-3', 1, '100000114', 'sv_k72b3_03@hnue.edu.vn', '2002-05-31', '2019-10-13', 'Đoàn viên', 0, 15],
    [115, 'sv_k72b3_04', 'Pham Thi B3-4', 0, '100000115', 'sv_k72b3_04@hnue.edu.vn', '2002-06-01', '2019-10-14', 'Đoàn viên', 0, 15],
    [116, 'sv_k72b3_05', 'Hoang Van B3-5', 1, '100000116', 'sv_k72b3_05@hnue.edu.vn', '2002-07-02', '2019-10-15', 'Đoàn viên', 0, 15],
    [117, 'sv_k72b4_01', 'Nguyen Van B4-1', 1, '100000117', 'sv_k72b4_01@hnue.edu.vn', '2002-08-03', '2019-10-16', 'Đoàn viên', 0, 16],
    [118, 'sv_k72b4_02', 'Tran Thi B4-2', 0, '100000118', 'sv_k72b4_02@hnue.edu.vn', '2002-09-04', '2019-10-17', 'Đoàn viên', 0, 16],
    [119, 'sv_k72b4_03', 'Le Van B4-3', 1, '100000119', 'sv_k72b4_03@hnue.edu.vn', '2002-10-05', '2019-10-18', 'Đoàn viên', 0, 16],
    [120, 'sv_k72b4_04', 'Pham Thi B4-4', 0, '100000120', 'sv_k72b4_04@hnue.edu.vn', '2002-11-06', '2019-10-19', 'Đoàn viên', 0, 16],
    [121, 'sv_k72b4_05', 'Hoang Van B4-5', 1, '100000121', 'sv_k72b4_05@hnue.edu.vn', '2002-12-07', '2019-10-20', 'Đoàn viên', 0, 16],
    [124, 'test', 'Nguyễn Hữu Trường', 0, '725105179', 'texclostore@gmail.com', '2025-12-07', '2025-12-06', 'BCH Chi đoàn', 0, 16]
  ];

  for (const record of usersRawArray) {
    await prisma.user.upsert({
      where: { userId: record[0] },
      update: { password: hashedPassword },
      create: {
        userId: record[0],
        userName: record[1],
        fullName: record[2],
        gender: record[3],
        identifyCard: record[4],
        email: record[5],
        password: hashedPassword,
        birthDate: new Date(record[6]),
        joinDate: new Date(record[7]),
        roleName: record[8],
        isAdmin: record[9],
        unitId: record[10]
      }
    });
  }
  console.log(`✅ Đã tạo ${usersRawArray.length} users`);
}

main()
  .catch((e) => {
    console.error('❌ Lỗi seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });