-- Seed hospitals data for Bangladesh
-- Run this AFTER 001_initial_schema.sql

INSERT INTO hospitals (name, district, address, lat, lng, phone, emergency_phone, has_blood_bank, is_24hr, ambulance_numbers) VALUES

-- ====== DHAKA ======
(
  'Dhaka Medical College Hospital',
  'Dhaka',
  'Bakshibazar, Dhaka-1000',
  23.7267, 90.3880,
  '02-55165088',
  '02-55165001',
  true, true,
  ARRAY['01769-000001', '01769-000002']
),
(
  'Sir Salimullah Medical College & Mitford Hospital',
  'Dhaka',
  'Mitford Road, Islampur, Dhaka-1100',
  23.7177, 90.3979,
  '02-7314025',
  '02-7314026',
  true, true,
  ARRAY['01769-000010']
),
(
  'Bangabandhu Sheikh Mujib Medical University',
  'Dhaka',
  'Shahbag, Dhaka-1000',
  23.7347, 90.3960,
  '02-55165500',
  '02-55165501',
  true, true,
  ARRAY['01769-000020', '01769-000021']
),
(
  'BIRDEM General Hospital',
  'Dhaka',
  '122 Kazi Nazrul Islam Avenue, Shahbag, Dhaka-1000',
  23.7400, 90.3940,
  '02-58615000',
  '02-58615001',
  true, true,
  ARRAY['01969-104104']
),
(
  'National Heart Foundation Hospital & Research Institute',
  'Dhaka',
  'Plot 7/2, Section 2, Mirpur, Dhaka-1216',
  23.8016, 90.3596,
  '02-58053301',
  '02-58053300',
  true, true,
  ARRAY['01819-000030']
),
(
  'National Institute of Cardiovascular Diseases',
  'Dhaka',
  'Sher-E-Bangla Nagar, Dhaka-1207',
  23.7747, 90.3643,
  '02-9112641',
  '02-9112642',
  true, true,
  ARRAY['01769-000040']
),
(
  'Square Hospital Ltd',
  'Dhaka',
  '18/F Bir Uttam Qazi Nuruzzaman Sarak, West Panthapath, Dhaka-1205',
  23.7515, 90.3784,
  '02-8159457',
  '10616',
  true, true,
  ARRAY['01713-000050', '01713-000051']
),
(
  'United Hospital Limited',
  'Dhaka',
  'Plot 15, Road 71, Gulshan, Dhaka-1212',
  23.7817, 90.4247,
  '02-8836000',
  '10666',
  true, true,
  ARRAY['01755-000060', '01755-000061']
),
(
  'Labaid Specialized Hospital',
  'Dhaka',
  '6 Green Road, Dhanmondi, Dhaka-1205',
  23.7505, 90.3776,
  '02-9675501',
  '10606',
  true, true,
  ARRAY['01713-000070']
),
(
  'Popular Medical College & Hospital',
  'Dhaka',
  'House 19, Road 2, Dhanmondi, Dhaka-1205',
  23.7490, 90.3740,
  '02-9640050',
  '02-9640051',
  true, true,
  ARRAY['01713-000080']
),
(
  'Anwer Khan Modern Medical College Hospital',
  'Dhaka',
  'House 16, Road 8, Dhanmondi, Dhaka-1205',
  23.7480, 90.3750,
  '02-9665060',
  NULL,
  true, false,
  ARRAY[]::TEXT[]
),

-- ====== GAZIPUR ======
(
  'Shaheed Tajuddin Ahmad Medical College Hospital',
  'Gazipur',
  'Gazipur Sadar, Gazipur-1700',
  23.9999, 90.4203,
  '02-9291701',
  '02-9291702',
  true, true,
  ARRAY['01769-000090']
),

-- ====== NARAYANGANJ ======
(
  '300-Bed General Hospital Narayanganj',
  'Narayanganj',
  'Narayanganj Sadar, Narayanganj-1400',
  23.6238, 90.4990,
  '02-7642201',
  NULL,
  true, false,
  ARRAY['01769-000100']
),

-- ====== CHITTAGONG ======
(
  'Chittagong Medical College Hospital',
  'Chittagong',
  'K B Fazlul Kader Road, Chittagong-4203',
  22.3607, 91.8357,
  '031-619666',
  '031-619667',
  true, true,
  ARRAY['01769-000110', '01769-000111']
),
(
  'Chittagong General Hospital',
  'Chittagong',
  'Anderkilla, Chittagong-4000',
  22.3350, 91.8330,
  '031-626611',
  NULL,
  true, false,
  ARRAY['01819-000120']
),
(
  'Chevron Clinical Laboratory & Hospital',
  'Chittagong',
  '5 Zakir Hossain Road, Khulshi, Chittagong-4225',
  22.3638, 91.8143,
  '031-2555555',
  '10616',
  true, true,
  ARRAY['01713-000130']
),

-- ====== COMILLA ======
(
  'Comilla Medical College Hospital',
  'Comilla',
  'Comilla Sadar, Comilla-3500',
  23.4607, 91.1809,
  '081-72507',
  '081-72508',
  true, true,
  ARRAY['01769-000140']
),

-- ====== COX''S BAZAR ======
(
  'Cox''s Bazar District Hospital',
  'Cox''s Bazar',
  'Hospital Road, Cox''s Bazar Sadar-4700',
  21.4272, 92.0058,
  '0341-62433',
  NULL,
  true, false,
  ARRAY['01769-000150']
),

-- ====== BRAHMANBARIA ======
(
  '250-Bed General Hospital Brahmanbaria',
  'Brahmanbaria',
  'Brahmanbaria Sadar, Brahmanbaria-3400',
  23.9608, 91.1115,
  '0851-52620',
  NULL,
  false, false,
  ARRAY['01769-000160']
),

-- ====== SYLHET ======
(
  'MAG Osmani Medical College Hospital',
  'Sylhet',
  'Sylhet Sadar, Sylhet-3100',
  24.8978, 91.8691,
  '0821-710754',
  '0821-710755',
  true, true,
  ARRAY['01769-000170', '01769-000171']
),
(
  'Mount Adeuri Hospital Sylhet',
  'Sylhet',
  'Zinda Bazar, Sylhet-3100',
  24.8945, 91.8668,
  '0821-723700',
  '10616',
  true, true,
  ARRAY['01713-000180']
),

-- ====== SUNAMGANJ ======
(
  '250-Bed General Hospital Sunamganj',
  'Sunamganj',
  'Sunamganj Sadar, Sunamganj-3000',
  25.0658, 91.3990,
  '0871-62090',
  NULL,
  false, false,
  ARRAY['01769-000190']
),

-- ====== HABIGANJ ======
(
  'Habiganj District Hospital',
  'Habiganj',
  'Habiganj Sadar, Habiganj-3300',
  24.3745, 91.4147,
  '0831-52121',
  NULL,
  false, false,
  ARRAY['01769-000200']
),

-- ====== MOULVIBAZAR ======
(
  'Moulvibazar District Hospital',
  'Moulvibazar',
  'Moulvibazar Sadar, Moulvibazar-3200',
  24.4827, 91.7774,
  '0861-52030',
  NULL,
  true, false,
  ARRAY['01769-000210']
),

-- ====== RAJSHAHI ======
(
  'Rajshahi Medical College Hospital',
  'Rajshahi',
  'Laxmipur, Rajshahi-6000',
  24.3745, 88.6042,
  '0721-772150',
  '0721-772151',
  true, true,
  ARRAY['01769-000220', '01769-000221']
),
(
  'Rajshahi Shishu Hospital',
  'Rajshahi',
  'Rajshahi Sadar, Rajshahi-6000',
  24.3620, 88.6010,
  '0721-771515',
  NULL,
  false, true,
  ARRAY['01769-000230']
),

-- ====== BOGURA ======
(
  'Shaheed Ziaur Rahman Medical College Hospital',
  'Bogura',
  'Bogura Sadar, Bogura-5800',
  24.8510, 89.3711,
  '051-68424',
  '051-68425',
  true, true,
  ARRAY['01769-000240']
),

-- ====== DINAJPUR ======
(
  'Dinajpur Medical College Hospital',
  'Dinajpur',
  'Keraniganj, Dinajpur-5200',
  25.6279, 88.6338,
  '0531-64003',
  '0531-64004',
  true, true,
  ARRAY['01769-000250']
),

-- ====== RANGPUR ======
(
  'Rangpur Medical College Hospital',
  'Rangpur',
  'Rangpur Sadar, Rangpur-5400',
  25.7439, 89.2752,
  '0521-66600',
  '0521-66601',
  true, true,
  ARRAY['01769-000260', '01769-000261']
),

-- ====== KHULNA ======
(
  'Khulna Medical College Hospital',
  'Khulna',
  'MKR Road, Khulna-9100',
  22.8456, 89.5403,
  '041-731006',
  '041-731007',
  true, true,
  ARRAY['01769-000270', '01769-000271']
),
(
  'Khulna General Hospital',
  'Khulna',
  'Khulna Sadar, Khulna-9000',
  22.8340, 89.5500,
  '041-720122',
  NULL,
  true, false,
  ARRAY['01769-000280']
),

-- ====== JESSORE ======
(
  'Jessore Medical College Hospital',
  'Jessore',
  'Jessore Sadar, Jessore-7400',
  23.1664, 89.2080,
  '0421-68600',
  '0421-68601',
  true, true,
  ARRAY['01769-000290']
),

-- ====== KUSHTIA ======
(
  'Kushtia Medical College Hospital',
  'Kushtia',
  'Kushtia Sadar, Kushtia-7000',
  23.9014, 89.1201,
  '071-72201',
  NULL,
  true, false,
  ARRAY['01769-000300']
),

-- ====== BARISAL ======
(
  'Sher-e-Bangla Medical College Hospital',
  'Barisal',
  'Barisal Sadar, Barisal-8200',
  22.7010, 90.3535,
  '0431-62626',
  '0431-62627',
  true, true,
  ARRAY['01769-000310', '01769-000311']
),
(
  'Barisal General Hospital',
  'Barisal',
  'Sadarghat Road, Barisal-8000',
  22.7020, 90.3700,
  '0431-62141',
  NULL,
  true, false,
  ARRAY['01769-000320']
),

-- ====== PATUAKHALI ======
(
  'Patuakhali Medical College Hospital',
  'Patuakhali',
  'Patuakhali Sadar, Patuakhali-8600',
  22.3591, 90.3282,
  '0441-62541',
  NULL,
  true, false,
  ARRAY['01769-000330']
),

-- ====== MYMENSINGH ======
(
  'Mymensingh Medical College Hospital',
  'Mymensingh',
  'Mymensingh Sadar, Mymensingh-2200',
  24.7471, 90.4203,
  '091-66000',
  '091-66001',
  true, true,
  ARRAY['01769-000340', '01769-000341']
),
(
  'Mymensingh General Hospital',
  'Mymensingh',
  'Mymensingh Sadar, Mymensingh-2200',
  24.7460, 90.4190,
  '091-65100',
  NULL,
  true, false,
  ARRAY['01769-000350']
),

-- ====== JAMALPUR ======
(
  'Jamalpur General Hospital',
  'Jamalpur',
  'Jamalpur Sadar, Jamalpur-2000',
  24.9374, 89.9430,
  '0981-62101',
  NULL,
  false, false,
  ARRAY['01769-000360']
),

-- ====== NETROKONA ======
(
  'Netrokona District Hospital',
  'Netrokona',
  'Netrokona Sadar, Netrokona-2400',
  24.8710, 90.7278,
  '0951-62021',
  NULL,
  false, false,
  ARRAY['01769-000370']
),

-- ====== FARIDPUR ======
(
  'Faridpur Medical College Hospital',
  'Faridpur',
  'Faridpur Sadar, Faridpur-7800',
  23.6070, 89.8360,
  '0631-63601',
  '0631-63602',
  true, true,
  ARRAY['01769-000380']
),

-- ====== NORSINGDI (NARSINGDI) ======
(
  'Narsingdi District Hospital',
  'Narsingdi',
  'Narsingdi Sadar, Narsingdi-1600',
  23.9233, 90.7149,
  '02-9461201',
  NULL,
  true, false,
  ARRAY['01769-000390']
),

-- ====== PABNA ======
(
  'Pabna Medical College Hospital',
  'Pabna',
  'Pabna Sadar, Pabna-6600',
  24.0064, 89.2372,
  '0731-65601',
  NULL,
  true, false,
  ARRAY['01769-000400']
),

-- ====== SIRAJGANJ ======
(
  'Sirajganj General Hospital',
  'Sirajganj',
  'Sirajganj Sadar, Sirajganj-6700',
  24.4532, 89.7006,
  '0751-62021',
  NULL,
  true, false,
  ARRAY['01769-000410']
),

-- ====== NOAKHALI ======
(
  'Noakhali Medical College Hospital',
  'Noakhali',
  'Maijdee Court, Noakhali-3800',
  22.8696, 91.0994,
  '0321-61930',
  '0321-61931',
  true, true,
  ARRAY['01769-000420']
),

-- ====== FENI ======
(
  'Feni District Hospital',
  'Feni',
  'Feni Sadar, Feni-3900',
  23.0153, 91.3973,
  '0331-62021',
  NULL,
  true, false,
  ARRAY['01769-000430']
),

-- ====== LAKSHMIPUR ======
(
  'Lakshmipur District Hospital',
  'Lakshmipur',
  'Lakshmipur Sadar, Lakshmipur-3700',
  22.9449, 90.8284,
  '0381-62021',
  NULL,
  false, false,
  ARRAY['01769-000440']
),

-- ====== CHANDPUR ======
(
  'Chandpur District Hospital',
  'Chandpur',
  'Chandpur Sadar, Chandpur-3600',
  23.2333, 90.6516,
  '0841-62021',
  NULL,
  true, false,
  ARRAY['01769-000450']
),

-- ====== TANGAIL ======
(
  'Tangail General Hospital',
  'Tangail',
  'Tangail Sadar, Tangail-1900',
  24.2513, 89.9167,
  '0921-62021',
  NULL,
  true, false,
  ARRAY['01769-000460']
),

-- ====== MANIKGANJ ======
(
  'Manikganj District Hospital',
  'Manikganj',
  'Manikganj Sadar, Manikganj-1800',
  23.8641, 90.0046,
  '0651-62021',
  NULL,
  false, false,
  ARRAY['01769-000470']
),

-- ====== GOPALGANJ ======
(
  'Gopalganj District Hospital',
  'Gopalganj',
  'Gopalganj Sadar, Gopalganj-8100',
  23.0057, 89.8261,
  '0668-62021',
  NULL,
  false, false,
  ARRAY['01769-000480']
),

-- ====== SATKHIRA ======
(
  'Satkhira Medical College Hospital',
  'Satkhira',
  'Satkhira Sadar, Satkhira-9400',
  22.7185, 89.0705,
  '0471-62601',
  NULL,
  true, false,
  ARRAY['01769-000490']
),

-- ====== BAGERHAT ======
(
  'Bagerhat District Hospital',
  'Bagerhat',
  'Bagerhat Sadar, Bagerhat-9300',
  22.6612, 89.7859,
  '0468-62021',
  NULL,
  false, false,
  ARRAY['01769-000500']
),

-- ====== THAKURGAON ======
(
  'Thakurgaon District Hospital',
  'Thakurgaon',
  'Thakurgaon Sadar, Thakurgaon-5100',
  26.0318, 88.4616,
  '0561-52021',
  NULL,
  true, false,
  ARRAY['01769-000510']
),

-- ====== NILPHAMARI ======
(
  'Nilphamari District Hospital',
  'Nilphamari',
  'Nilphamari Sadar, Nilphamari-5300',
  25.9311, 88.8560,
  '0551-62021',
  NULL,
  false, false,
  ARRAY['01769-000520']
),

-- ====== KURIGRAM ======
(
  'Kurigram District Hospital',
  'Kurigram',
  'Kurigram Sadar, Kurigram-5600',
  25.8059, 89.6368,
  '0594-61021',
  NULL,
  false, false,
  ARRAY['01769-000530']
),

-- ====== GAIBANDHA ======
(
  'Gaibandha District Hospital',
  'Gaibandha',
  'Gaibandha Sadar, Gaibandha-5700',
  25.3288, 89.5284,
  '0541-62021',
  NULL,
  false, false,
  ARRAY['01769-000540']
),

-- ====== LALMONIRHAT ======
(
  'Lalmonirhat District Hospital',
  'Lalmonirhat',
  'Lalmonirhat Sadar, Lalmonirhat-5500',
  25.9217, 89.4506,
  '0591-61021',
  NULL,
  false, false,
  ARRAY['01769-000550']
),

-- ====== RANGAMATI ======
(
  'Rangamati General Hospital',
  'Rangamati',
  'Rangamati Sadar, Rangamati-4500',
  22.6327, 92.2044,
  '0351-62021',
  NULL,
  true, false,
  ARRAY['01769-000560']
),

-- ====== KHAGRACHHARI ======
(
  'Khagrachhari District Hospital',
  'Khagrachhari',
  'Khagrachhari Sadar, Khagrachhari-4400',
  23.1193, 91.9847,
  '0371-61021',
  NULL,
  false, false,
  ARRAY['01769-000570']
),

-- ====== BANDARBAN ======
(
  'Bandarban District Hospital',
  'Bandarban',
  'Bandarban Sadar, Bandarban-4600',
  22.1953, 92.2184,
  '0361-62021',
  NULL,
  false, false,
  ARRAY['01769-000580']
);
