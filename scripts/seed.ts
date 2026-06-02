import { createClient } from '@supabase/supabase-js'
import { addDays, subDays, format } from 'date-fns'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

const FAKE_DONORS = [
  { name: 'Arif Rahman', phone: '+8801711234561', blood_group: 'A+', district: 'Dhaka', donations: 15 },
  { name: 'Fatema Khatun', phone: '+8801811234562', blood_group: 'B+', district: 'Chittagong', donations: 8 },
  { name: 'Karim Uddin', phone: '+8801911234563', blood_group: 'O+', district: 'Sylhet', donations: 27 },
  { name: 'Nasrin Akter', phone: '+8801711234564', blood_group: 'AB+', district: 'Rajshahi', donations: 3 },
  { name: 'Rafiqul Islam', phone: '+8801811234565', blood_group: 'A-', district: 'Khulna', donations: 12 },
  { name: 'Sultana Begum', phone: '+8801911234566', blood_group: 'B-', district: 'Barisal', donations: 5 },
  { name: 'Jahangir Alam', phone: '+8801711234567', blood_group: 'O-', district: 'Dhaka', donations: 51 },
  { name: 'Roksana Parvin', phone: '+8801811234568', blood_group: 'AB-', district: 'Rangpur', donations: 2 },
  { name: 'Monir Hossain', phone: '+8801911234569', blood_group: 'A+', district: 'Mymensingh', donations: 9 },
  { name: 'Shireen Akter', phone: '+8801711234570', blood_group: 'B+', district: 'Dhaka', donations: 4 },
  { name: 'Tajul Islam', phone: '+8801811234571', blood_group: 'O+', district: 'Chittagong', donations: 18 },
  { name: 'Habiba Sultana', phone: '+8801911234572', blood_group: 'A+', district: 'Sylhet', donations: 7 },
  { name: 'Shafiqur Rahman', phone: '+8801711234573', blood_group: 'B+', district: 'Dhaka', donations: 31 },
  { name: 'Lovely Khanam', phone: '+8801811234574', blood_group: 'AB+', district: 'Rajshahi', donations: 1 },
  { name: 'Minhajul Islam', phone: '+8801911234575', blood_group: 'O+', district: 'Khulna', donations: 14 },
  { name: 'Sadia Afrin', phone: '+8801711234576', blood_group: 'A-', district: 'Dhaka', donations: 6 },
  { name: 'Nayeem Hossain', phone: '+8801811234577', blood_group: 'B-', district: 'Chittagong', donations: 22 },
  { name: 'Tania Islam', phone: '+8801911234578', blood_group: 'O-', district: 'Barisal', donations: 3 },
  { name: 'Asif Iqbal', phone: '+8801711234579', blood_group: 'A+', district: 'Dhaka', donations: 11 },
  { name: 'Mim Akter', phone: '+8801811234580', blood_group: 'B+', district: 'Sylhet', donations: 0 },
  { name: 'Ripon Kumar', phone: '+8801911234581', blood_group: 'AB+', district: 'Mymensingh', donations: 16 },
  { name: 'Farida Yasmin', phone: '+8801711234582', blood_group: 'O+', district: 'Rangpur', donations: 5 },
  { name: 'Shahidul Haque', phone: '+8801811234583', blood_group: 'A+', district: 'Dhaka', donations: 44 },
  { name: 'Nargis Begum', phone: '+8801911234584', blood_group: 'B+', district: 'Chittagong', donations: 8 },
  { name: 'Mizanur Rahman', phone: '+8801711234585', blood_group: 'O-', district: 'Khulna', donations: 2 },
  { name: 'Ayesha Siddiqua', phone: '+8801811234586', blood_group: 'AB-', district: 'Dhaka', donations: 19 },
  { name: 'Rubel Hossain', phone: '+8801911234587', blood_group: 'A+', district: 'Rajshahi', donations: 7 },
  { name: 'Sabina Akter', phone: '+8801711234588', blood_group: 'B+', district: 'Barisal', donations: 13 },
  { name: 'Anisur Rahman', phone: '+8801811234589', blood_group: 'O+', district: 'Sylhet', donations: 25 },
  { name: 'Taslima Begum', phone: '+8801911234590', blood_group: 'A-', district: 'Dhaka', donations: 4 },
  // Extra donors for visible directory
  { name: 'Imran Hossain', phone: '+8801711234591', blood_group: 'O+', district: 'Dhaka', donations: 6 },
  { name: 'Sumaiya Islam', phone: '+8801811234592', blood_group: 'A+', district: 'Dhaka', donations: 3 },
  { name: 'Raihan Ahmed', phone: '+8801711234593', blood_group: 'B+', district: 'Chittagong', donations: 10 },
  { name: 'Nusrat Jahan', phone: '+8801811234594', blood_group: 'AB+', district: 'Sylhet', donations: 2 },
  { name: 'Fahim Chowdhury', phone: '+8801711234595', blood_group: 'O-', district: 'Dhaka', donations: 5 },
  { name: 'Morshed Ali', phone: '+8801811234596', blood_group: 'A-', district: 'Rajshahi', donations: 8 },
  { name: 'Rima Begum', phone: '+8801711234597', blood_group: 'B-', district: 'Khulna', donations: 1 },
  { name: 'Zakir Hossain', phone: '+8801811234598', blood_group: 'O+', district: 'Barisal', donations: 9 },
  { name: 'Meherun Nessa', phone: '+8801711234599', blood_group: 'A+', district: 'Rangpur', donations: 4 },
  { name: 'Tanvir Ahmed', phone: '+8801811234600', blood_group: 'AB-', district: 'Mymensingh', donations: 7 },
]

function getDonorLevel(count: number) {
  if (count >= 50) return 'hero'
  if (count >= 25) return 'gold'
  if (count >= 10) return 'silver'
  if (count >= 3) return 'bronze'
  return 'new'
}

const HOSPITALS = [
  // Dhaka
  { name: 'Dhaka Medical College Hospital', district: 'Dhaka', address: 'Zahir Raihan Rd, Dhaka 1000', lat: 23.7222, lng: 90.3961, phone: '02-55165088', emergency_phone: '02-55165001', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01911-919999'] },
  { name: 'Bangabandhu Sheikh Mujib Medical University', district: 'Dhaka', address: 'Shahbag, Dhaka 1000', lat: 23.7289, lng: 90.3984, phone: '02-55165300', emergency_phone: '02-55165300', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01811-919999'] },
  { name: 'National Institute of Cardiovascular Diseases', district: 'Dhaka', address: 'Sher-e-Bangla Nagar, Dhaka 1207', lat: 23.7734, lng: 90.3683, phone: '02-9111525', emergency_phone: '02-9111525', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  { name: 'Sir Salimullah Medical College Hospital', district: 'Dhaka', address: 'Mitford, Dhaka 1100', lat: 23.7189, lng: 90.4061, phone: '02-7340200', emergency_phone: '02-7340200', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Dhaka Shishu (Children) Hospital', district: 'Dhaka', address: 'Sher-e-Bangla Nagar, Dhaka 1207', lat: 23.7702, lng: 90.3724, phone: '02-9123701', emergency_phone: '02-9123701', has_blood_bank: false, is_24hr: true, ambulance_numbers: [] },
  { name: 'Square Hospital', district: 'Dhaka', address: '18/F Bir Uttam Qazi Nuruzzaman Sarak, Dhaka 1205', lat: 23.7571, lng: 90.3715, phone: '02-8159457', emergency_phone: '02-8159457', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01766-660000'] },
  { name: 'United Hospital', district: 'Dhaka', address: 'Plot 15, Road 71, Gulshan 2, Dhaka 1212', lat: 23.7950, lng: 90.4134, phone: '02-8836444', emergency_phone: '02-8836000', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01710-016111'] },
  { name: 'Evercare Hospital Dhaka', district: 'Dhaka', address: 'Plot 81, Block E, Bashundhara R/A, Dhaka 1229', lat: 23.8129, lng: 90.4389, phone: '02-9861000', emergency_phone: '02-9861000', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01713-003300'] },
  { name: 'Labaid Specialized Hospital', district: 'Dhaka', address: 'House 1, Road 4, Dhanmondi, Dhaka 1205', lat: 23.7474, lng: 90.3751, phone: '02-9669101', emergency_phone: '02-9669000', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  { name: 'Popular Medical Centre', district: 'Dhaka', address: 'House 16, Road 2, Dhanmondi, Dhaka 1205', lat: 23.7521, lng: 90.3759, phone: '02-9676090', emergency_phone: '02-9676090', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Holy Family Red Crescent Medical College Hospital', district: 'Dhaka', address: 'Eskaton Garden, Dhaka 1000', lat: 23.7389, lng: 90.3924, phone: '02-9330954', emergency_phone: '02-9330954', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01730-336699'] },
  { name: 'National Heart Foundation Hospital', district: 'Dhaka', address: 'Mirpur, Dhaka 1216', lat: 23.8043, lng: 90.3613, phone: '02-9005183', emergency_phone: '02-9005183', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  { name: 'Kurmitola General Hospital', district: 'Dhaka', address: 'Cantonment, Dhaka 1206', lat: 23.8228, lng: 90.4000, phone: '02-8870051', emergency_phone: '02-8870051', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  { name: 'Mugda Medical College Hospital', district: 'Dhaka', address: 'Mugda, Dhaka 1214', lat: 23.7363, lng: 90.4310, phone: '02-7273038', emergency_phone: '02-7273038', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Anwer Khan Modern Medical College Hospital', district: 'Dhaka', address: 'Dhanmondi, Dhaka 1205', lat: 23.7444, lng: 90.3691, phone: '02-9676002', emergency_phone: '02-9676002', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  // Chittagong
  { name: 'Chittagong Medical College Hospital', district: 'Chittagong', address: 'Hospital Rd, Chittagong 4000', lat: 22.3586, lng: 91.7975, phone: '031-616891', emergency_phone: '031-616891', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01817-919999'] },
  { name: 'Chittagong General Hospital', district: 'Chittagong', address: 'Pahartali, Chittagong 4202', lat: 22.3831, lng: 91.8020, phone: '031-752561', emergency_phone: '031-752561', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Evercare Hospital Chattogram', district: 'Chittagong', address: 'Nasirabad, Chittagong 4000', lat: 22.3710, lng: 91.8290, phone: '031-2558800', emergency_phone: '031-2558800', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01713-003301'] },
  // Sylhet
  { name: 'Sylhet MAG Osmani Medical College Hospital', district: 'Sylhet', address: 'Osmani Medical College Rd, Sylhet 3100', lat: 24.8980, lng: 91.8688, phone: '0821-713900', emergency_phone: '0821-713900', has_blood_bank: true, is_24hr: true, ambulance_numbers: ['01717-919999'] },
  { name: 'Sylhet Women Medical College Hospital', district: 'Sylhet', address: 'Kumarpara, Sylhet 3100', lat: 24.8912, lng: 91.8656, phone: '0821-721490', emergency_phone: null, has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  // Rajshahi
  { name: 'Rajshahi Medical College Hospital', district: 'Rajshahi', address: 'Rajshahi 6000', lat: 24.3745, lng: 88.6042, phone: '0721-772150', emergency_phone: '0721-772150', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  { name: 'Rajshahi Combined Military Hospital', district: 'Rajshahi', address: 'Rajshahi Cantonment, Rajshahi', lat: 24.3815, lng: 88.6189, phone: '0721-750011', emergency_phone: '0721-750011', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  // Khulna
  { name: 'Khulna Medical College Hospital', district: 'Khulna', address: 'Khulna 9000', lat: 22.8456, lng: 89.5403, phone: '041-720921', emergency_phone: '041-720921', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Khulna General Hospital', district: 'Khulna', address: 'Khan A Sabur Rd, Khulna 9100', lat: 22.8333, lng: 89.5500, phone: '041-761120', emergency_phone: '041-761120', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  // Barisal
  { name: 'Sher-E-Bangla Medical College Hospital', district: 'Barisal', address: 'Barisal 8200', lat: 22.7010, lng: 90.3535, phone: '0431-67680', emergency_phone: '0431-67680', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  // Rangpur
  { name: 'Rangpur Medical College Hospital', district: 'Rangpur', address: 'Rangpur 5400', lat: 25.7493, lng: 89.2752, phone: '0521-66290', emergency_phone: '0521-66290', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Rangpur Combined Military Hospital', district: 'Rangpur', address: 'Cantonment, Rangpur', lat: 25.7550, lng: 89.2600, phone: '0521-65120', emergency_phone: '0521-65120', has_blood_bank: true, is_24hr: true, ambulance_numbers: [] },
  // Mymensingh
  { name: 'Mymensingh Medical College Hospital', district: 'Mymensingh', address: 'Mymensingh 2200', lat: 24.7538, lng: 90.4073, phone: '091-67490', emergency_phone: '091-67490', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  // Other districts
  { name: "Cox's Bazar District Hospital", district: "Cox's Bazar", address: "Cox's Bazar 4700", lat: 21.4272, lng: 92.0058, phone: '0341-63440', emergency_phone: '0341-63440', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Comilla Medical College Hospital', district: 'Comilla', address: 'Comilla 3500', lat: 23.4614, lng: 91.1786, phone: '081-68600', emergency_phone: '081-68600', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Bogura Shaheed Ziaur Rahman Medical College Hospital', district: 'Bogura', address: 'Bogura 5800', lat: 24.8543, lng: 89.3719, phone: '051-66890', emergency_phone: '051-66890', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Jessore Medical College Hospital', district: 'Jessore', address: 'Jessore 7400', lat: 23.1664, lng: 89.2039, phone: '0421-68200', emergency_phone: '0421-68200', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Dinajpur Medical College Hospital', district: 'Dinajpur', address: 'Dinajpur 5200', lat: 25.6243, lng: 88.6354, phone: '0531-65200', emergency_phone: '0531-65200', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Narayanganj 100-Bed Hospital', district: 'Narayanganj', address: 'Narayanganj 1400', lat: 23.6239, lng: 90.4996, phone: '02-7641020', emergency_phone: '02-7641020', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Pabna Mental Hospital', district: 'Pabna', address: 'Pabna 6600', lat: 24.0056, lng: 89.2400, phone: '0731-66200', emergency_phone: null, has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Tangail General Hospital', district: 'Tangail', address: 'Tangail 1900', lat: 24.2513, lng: 89.9167, phone: '0921-55222', emergency_phone: '0921-55222', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Faridpur Medical College Hospital', district: 'Faridpur', address: 'Faridpur 7800', lat: 23.6070, lng: 89.8442, phone: '0631-64760', emergency_phone: '0631-64760', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Noakhali General Hospital', district: 'Noakhali', address: 'Noakhali 3800', lat: 22.8696, lng: 91.0992, phone: '0321-61622', emergency_phone: '0321-61622', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Gazipur Shaheed Tajuddin Ahmad Medical College', district: 'Gazipur', address: 'Gazipur 1700', lat: 23.9999, lng: 90.4203, phone: '02-9253870', emergency_phone: '02-9253870', has_blood_bank: true, is_24hr: false, ambulance_numbers: [] },
  { name: 'Brahmanbaria District Hospital', district: 'Brahmanbaria', address: 'Brahmanbaria 3400', lat: 23.9571, lng: 91.1115, phone: '0851-62501', emergency_phone: '0851-62501', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Lakshmipur District Hospital', district: 'Lakshmipur', address: 'Lakshmipur 3700', lat: 22.9400, lng: 90.8411, phone: '0381-62095', emergency_phone: '0381-62095', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Sirajganj District Hospital', district: 'Sirajganj', address: 'Sirajganj 6700', lat: 24.4535, lng: 89.7076, phone: '0751-62350', emergency_phone: '0751-62350', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Jamalpur District Hospital', district: 'Jamalpur', address: 'Jamalpur 2000', lat: 24.8974, lng: 89.9404, phone: '0981-62050', emergency_phone: '0981-62050', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Narsingdi District Hospital', district: 'Narsingdi', address: 'Narsingdi 1600', lat: 23.9234, lng: 90.7150, phone: '02-9942240', emergency_phone: '02-9942240', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
  { name: 'Kishoreganj General Hospital', district: 'Kishoreganj', address: 'Kishoreganj 2300', lat: 24.4449, lng: 90.7766, phone: '0941-61670', emergency_phone: '0941-61670', has_blood_bank: false, is_24hr: false, ambulance_numbers: [] },
]

async function seed() {
  console.log('🌱 Starting seed...')

  // Clear existing data (optional — comment out to preserve)
  // await supabase.from('donor_badges').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  // await supabase.from('donations').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  // await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  // Seed hospitals
  console.log('🏥 Seeding hospitals...')
  // Delete existing hospital seeds to avoid duplicates
  const { error: delHospErr } = await supabase.from('hospitals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  const { error: hospitalError } = await supabase.from('hospitals').insert(HOSPITALS)
  if (hospitalError) console.error('Hospital seed error:', hospitalError)
  else console.log(`✅ Inserted ${HOSPITALS.length} hospitals`)

  // Create donor profiles using service role (bypasses auth requirement)
  console.log('👤 Seeding donor profiles...')

  const profileInserts = []
  const donationInserts = []

  for (const donor of FAKE_DONORS) {
    const userId = crypto.randomUUID()
    const level = getDonorLevel(donor.donations)
    const isAvailable = donor.donations === 0 || Math.random() > 0.3

    profileInserts.push({
      id: userId,
      full_name: donor.name,
      phone: donor.phone,
      email: `${donor.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      blood_group: donor.blood_group,
      nid_verified: true,
      is_available: isAvailable,
      privacy_mode: Math.random() > 0.8,
      donor_level: level,
      total_donations: donor.donations,
      district: donor.district,
    })

    for (let i = 0; i < donor.donations; i++) {
      const donatedAt = subDays(new Date(), (i + 1) * 95 + Math.floor(Math.random() * 20))
      donationInserts.push({
        donor_id: userId,
        donated_at: donatedAt.toISOString(),
        hospital_name: ['Dhaka Medical College Hospital', 'Square Hospital', 'Chittagong Medical College Hospital', 'Sylhet MAG Osmani Medical College Hospital'][Math.floor(Math.random() * 4)],
        location_text: donor.district,
        district: donor.district,
        cooldown_ends_at: addDays(donatedAt, 90).toISOString(),
      })
    }
  }

  const { error: profileError } = await supabase.from('profiles').insert(profileInserts)
  if (profileError) console.error('Profile seed error:', profileError)
  else console.log(`✅ Inserted ${profileInserts.length} donor profiles`)

  if (donationInserts.length > 0) {
    // Insert in batches of 100
    for (let i = 0; i < donationInserts.length; i += 100) {
      const batch = donationInserts.slice(i, i + 100)
      const { error } = await supabase.from('donations').insert(batch)
      if (error) console.error('Donation batch error:', error)
    }
    console.log(`✅ Inserted ${donationInserts.length} donations`)
  }

  // Seed blood requests
  console.log('🩸 Seeding blood requests...')
  const profileIds = profileInserts.map(p => p.id)

  const requests = [
    { patient_name: 'Rahim Uddin', blood_group_needed: 'AB+', units_needed: 2, hospital_name: 'Dhaka Medical College Hospital', district: 'Dhaka', location_text: 'Dhaka Medical College Hospital, Ward 5', urgency: 'critical', contact_phone: '+8801711111111', message: 'Patient needs blood urgently for surgery' },
    { patient_name: 'Karim Shah', blood_group_needed: 'O-', units_needed: 1, hospital_name: 'Chittagong Medical College Hospital', district: 'Chittagong', location_text: 'Emergency ward, ground floor', urgency: 'urgent', contact_phone: '+8801711111112', message: 'Post-accident blood loss' },
    { patient_name: 'Amina Begum', blood_group_needed: 'B+', units_needed: 3, hospital_name: 'Square Hospital', district: 'Dhaka', location_text: 'Blood bank, Square Hospital Dhaka', urgency: 'normal', contact_phone: '+8801711111113', message: 'Thalassemia patient needs regular transfusion' },
    { patient_name: 'Selim Ahmed', blood_group_needed: 'A+', units_needed: 1, hospital_name: 'Sylhet MAG Osmani Medical College', district: 'Sylhet', location_text: 'Sylhet MAG Osmani, Surgery ward', urgency: 'urgent', contact_phone: '+8801711111114', message: null },
    { patient_name: 'Rokeya Khatun', blood_group_needed: 'O+', units_needed: 2, hospital_name: 'Rajshahi Medical College Hospital', district: 'Rajshahi', location_text: 'Rajshahi MC Hospital, 2nd floor', urgency: 'normal', contact_phone: '+8801711111115', message: 'Bypass surgery scheduled' },
    { patient_name: 'Jamal Hossain', blood_group_needed: 'A-', units_needed: 1, hospital_name: 'Khulna Medical College Hospital', district: 'Khulna', location_text: 'Delivery ward, Khulna Medical', urgency: 'critical', contact_phone: '+8801711111116', message: 'Emergency delivery complication' },
    { patient_name: 'Laila Begum', blood_group_needed: 'B-', units_needed: 2, hospital_name: 'Bangabandhu Sheikh Mujib Medical University', district: 'Dhaka', location_text: 'BSMMU, Oncology dept, Shahbag', urgency: 'urgent', contact_phone: '+8801711111117', message: 'Cancer patient on chemotherapy' },
    { patient_name: 'Noman Ali', blood_group_needed: 'AB-', units_needed: 1, hospital_name: 'United Hospital', district: 'Dhaka', location_text: 'United Hospital, Gulshan 2', urgency: 'normal', contact_phone: '+8801711111118', message: null },
    { patient_name: 'Sharmin Akter', blood_group_needed: 'O+', units_needed: 4, hospital_name: 'Rangpur Medical College Hospital', district: 'Rangpur', location_text: 'ICU, Rangpur Medical College', urgency: 'critical', contact_phone: '+8801711111119', message: 'Severe accident injuries, ICU' },
    { patient_name: 'Farhan Kabir', blood_group_needed: 'A+', units_needed: 1, hospital_name: 'Evercare Hospital Dhaka', district: 'Dhaka', location_text: 'Evercare Hospital, Bashundhara', urgency: 'normal', contact_phone: '+8801711111120', message: 'Pre-planned surgery next week' },
  ]

  const requestInserts = requests.map((r, i) => ({
    ...r,
    requester_id: profileIds[i % profileIds.length],
    expires_at: addDays(new Date(), 7).toISOString(),
  }))

  const { error: requestError } = await supabase.from('blood_requests').insert(requestInserts)
  if (requestError) console.error('Request seed error:', requestError)
  else console.log(`✅ Inserted ${requestInserts.length} blood requests`)

  // Seed campaigns
  console.log('📢 Seeding campaigns...')
  const campaigns = [
    {
      organizer_id: profileIds[0],
      title: 'Dhaka Blood Drive — Eid Special',
      description: 'Join us for a special blood donation drive during Eid season. Every unit donated goes directly to patients in Dhaka Medical College Hospital.',
      blood_groups_needed: ['A+', 'B+', 'O+', 'AB+'],
      venue_name: 'Dhaka University TSC',
      venue_address: 'TSC, Dhaka University, Dhaka 1000',
      district: 'Dhaka',
      event_date: format(addDays(new Date(), 14), 'yyyy-MM-dd'),
      event_time: '09:00',
      status: 'active',
      volunteers_needed: 50,
    },
    {
      organizer_id: profileIds[2],
      title: 'Sylhet Valley Blood Camp',
      description: 'Annual blood donation camp organized by Sylhet Youth Club. All blood groups needed urgently.',
      blood_groups_needed: ['O-', 'AB-', 'B-'],
      venue_name: 'Sylhet City Corporation Auditorium',
      venue_address: 'City Corporation Building, Sylhet',
      district: 'Sylhet',
      event_date: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      event_time: '10:00',
      status: 'active',
      volunteers_needed: 30,
    },
    {
      organizer_id: profileIds[5],
      title: 'Chittagong Port City Blood Drive',
      description: 'Supporting Chittagong Medical College Hospital with a mega blood donation camp.',
      blood_groups_needed: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      venue_name: 'Chittagong Shilpakala Academy',
      venue_address: 'M M Ali Road, Chittagong',
      district: 'Chittagong',
      event_date: format(addDays(new Date(), 21), 'yyyy-MM-dd'),
      event_time: '08:00',
      status: 'active',
      volunteers_needed: 80,
    },
    {
      organizer_id: profileIds[8],
      title: 'Rajshahi University Campus Donation Day',
      description: 'Faculty and students of Rajshahi University unite to save lives through blood donation.',
      blood_groups_needed: ['A+', 'B+', 'O+'],
      venue_name: 'Rajshahi University Campus Ground',
      venue_address: 'Motihar, Rajshahi 6205',
      district: 'Rajshahi',
      event_date: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
      event_time: '09:30',
      status: 'active',
      volunteers_needed: 40,
    },
    {
      organizer_id: profileIds[12],
      title: 'Khulna Corporate Blood Drive',
      description: 'Major corporates in Khulna coming together for a lifesaving blood donation event.',
      blood_groups_needed: ['AB+', 'O-', 'A-'],
      venue_name: 'Khulna Chamber of Commerce',
      venue_address: 'KDA, Khulna 9000',
      district: 'Khulna',
      event_date: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
      event_time: '11:00',
      status: 'active',
      volunteers_needed: 25,
    },
  ]

  const { error: campaignError } = await supabase.from('campaigns').insert(campaigns)
  if (campaignError) console.error('Campaign seed error:', campaignError)
  else console.log(`✅ Inserted ${campaigns.length} campaigns`)

  // Award badges
  console.log('🏅 Awarding badges...')
  const badgeInserts = []
  for (const p of profileInserts) {
    if (p.total_donations >= 1) badgeInserts.push({ donor_id: p.id, badge_type: 'first_drop' })
    if (p.total_donations >= 3) badgeInserts.push({ donor_id: p.id, badge_type: 'bronze_heart' })
    if (p.total_donations >= 10) badgeInserts.push({ donor_id: p.id, badge_type: 'silver_vein' })
    if (p.total_donations >= 25) badgeInserts.push({ donor_id: p.id, badge_type: 'gold_pulse' })
    if (p.total_donations >= 50) badgeInserts.push({ donor_id: p.id, badge_type: 'hero_status' })
  }
  if (badgeInserts.length > 0) {
    const { error: badgeError } = await supabase.from('donor_badges').insert(badgeInserts)
    if (badgeError) console.error('Badge seed error:', badgeError)
    else console.log(`✅ Awarded ${badgeInserts.length} badges`)
  }

  console.log('\n🎉 Seed complete!')
  console.log(`   ${profileInserts.length} donors | ${HOSPITALS.length} hospitals | ${requestInserts.length} requests | ${campaigns.length} campaigns`)
}

seed().catch(console.error)
