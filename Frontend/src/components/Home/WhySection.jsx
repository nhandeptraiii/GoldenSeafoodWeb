import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import banner from '../../assets/banner3.png'
import { CTAButton } from '../CTAButton'
import styles from './WhySection.module.scss'

const copy = {
  vi: {
    eyebrow: 'Tại sao chọn Thủy sản Vàng?', title: 'Đại diện chiến lược của bạn tại Việt Nam.',
    text: 'Chúng tôi không chỉ là một công ty xuất khẩu thông thường; chúng tôi là đại diện chiến lược của bạn ngay tại thủ phủ nguyên liệu Việt Nam. Hợp tác sâu rộng với mạng lưới nhà máy chế biến hiện đại đạt chuẩn quốc tế (HACCP, BRC, IFS), chúng tôi kết nối năng lực sản xuất nội địa với tiêu chuẩn toàn cầu. Đội ngũ QC chuyên trách giám sát trực tiếp từng lô hàng tại nhà máy, đảm bảo sản phẩm đến tay bạn luôn hoàn hảo.',
    action: 'Tìm hiểu năng lực', imageAlt: 'Quy trình kiểm soát chất lượng thủy sản',
    points: ['Nhà máy đạt chuẩn HACCP, BRC, IFS', 'QC chuyên trách tại nhà máy', 'Chuỗi cung ứng minh bạch, linh hoạt'],
  },
  en: {
    eyebrow: 'Why Golden Seafood?', title: 'Your strategic boots on the ground in Vietnam.',
    text: 'We are not just an export company; we are your strategic boots on the ground in Vietnam. Partnering with a network of modern, certified processing facilities (HACCP, BRC, IFS), we bridge the gap between local production and global standards. Our dedicated QC team monitors every batch directly at the factories, ensuring that what you order is exactly what you receive.',
    action: 'Explore our capabilities', imageAlt: 'Seafood quality control process',
    points: ['HACCP, BRC & IFS certified plants', 'Dedicated on-site quality control', 'Transparent, flexible supply chain'],
  },
}
const icons = [HandshakeOutlinedIcon, VerifiedOutlinedIcon, PublicOutlinedIcon]

export function WhySection() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  return (
    <section className={styles.section} aria-labelledby="why-title">
      <div className={styles.inner}>
        <motion.div className={styles.visual} initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .6 }}>
          <img src={banner} alt={text.imageAlt} loading="lazy" /><div className={styles.imageAccent} aria-hidden="true" />
        </motion.div>
        <motion.div className={styles.content} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .6 }}>
          <p className={styles.eyebrow}>{text.eyebrow}</p><h2 id="why-title">{text.title}</h2>
          <p className={styles.description}>{text.text}</p>
          <div className={styles.points}>{text.points.map((point, index) => { const Icon = icons[index]; return <div className={styles.point} key={point}><Icon /><span>{point}</span></div> })}</div>
          <CTAButton to="/quality" variant="outline">{text.action}</CTAButton>
        </motion.div>
      </div>
    </section>
  )
}
