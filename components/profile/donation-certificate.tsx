import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { format } from 'date-fns'

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    padding: 60,
  },
  border: {
    border: '3px solid #C0392B',
    padding: 30,
    height: '100%',
    position: 'relative',
  },
  innerBorder: {
    border: '1px solid #E74C3C',
    padding: 20,
    height: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#C0392B',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: '#666',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  divider: {
    borderTop: '1px solid #C0392B',
    marginVertical: 20,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 6,
  },
  titleSub: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  certifyText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginBottom: 10,
  },
  donorName: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#C0392B',
    textAlign: 'center',
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 1.8,
  },
  highlight: {
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  bloodGroupBadge: {
    backgroundColor: '#FEE2E2',
    padding: '6 16',
    borderRadius: 20,
    alignSelf: 'center',
    marginVertical: 10,
  },
  bloodGroupText: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: '#C0392B',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginTop: 20,
    marginBottom: 30,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 9,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#1a1a1a',
  },
  footer: {
    borderTop: '1px solid #eee',
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  footerLeft: {
    fontSize: 9,
    color: '#888',
  },
  certNumber: {
    fontSize: 9,
    color: '#888',
    fontFamily: 'Helvetica-Bold',
  },
})

interface CertificateProps {
  donorName: string
  bloodGroup: string
  donatedAt: string
  hospitalName: string
  district: string
  certificateNumber: string
}

export function DonationCertificate({ donorName, bloodGroup, donatedAt, hospitalName, district, certificateNumber }: CertificateProps) {
  const dateStr = format(new Date(donatedAt), 'dd MMMM yyyy')

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.border}>
          <View style={styles.innerBorder}>
            <View style={styles.header}>
              <Text style={styles.logo}>RedCircle</Text>
              <Text style={styles.subtitle}>Blood Donation Network · Bangladesh</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.title}>Certificate of Appreciation</Text>
            <Text style={styles.titleSub}>Blood Donation Certificate</Text>

            <Text style={styles.certifyText}>This is to certify that</Text>
            <Text style={styles.donorName}>{donorName}</Text>
            <Text style={styles.certifyText}>has generously donated blood of type</Text>

            <View style={styles.bloodGroupBadge}>
              <Text style={styles.bloodGroupText}>{bloodGroup}</Text>
            </View>

            <Text style={styles.bodyText}>
              Your selfless act of donating blood has the potential to{'\n'}
              <Text style={styles.highlight}>save up to 3 lives</Text>. Thank you for being a hero.
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{dateStr}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>{hospitalName}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>District</Text>
                <Text style={styles.detailValue}>{district}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <View>
                <Text style={styles.footerLeft}>RedCircle Blood Donation Network</Text>
                <Text style={styles.footerLeft}>redcircle.app · Connecting lives across Bangladesh</Text>
              </View>
              <Text style={styles.certNumber}>Certificate No: {certificateNumber}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}
