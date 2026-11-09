import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import banner from '../../assets/GoldenSeafoodNew/img/team-partners.jpg'
import { CTAButton } from '../CTAButton'
import styles from './WhySection.module.scss'

const copy = {
  vi: { eyebrow: 'Vì sao chọn chúng tôi', title: 'Đại diện chiến lược của bạn ngay tại thủ phủ nguyên liệu Việt Nam.', text: 'Chúng tôi không chỉ là một công ty xuất khẩu thông thường; chúng tôi là đại diện chiến lược của bạn ngay tại thủ phủ nguyên liệu Việt Nam. Hợp tác sâu rộng với mạng lưới nhà máy chế biến hiện đại đạt chuẩn quốc tế (HACCP, BRC, IFS), chúng tôi kết nối năng lực sản xuất nội địa với tiêu chuẩn toàn cầu. Đội ngũ QC chuyên trách giám sát trực tiếp từng lô hàng tại nhà máy, đảm bảo sản phẩm đến tay bạn luôn hoàn hảo.', action: 'Tìm hiểu năng lực', imageAlt: 'Đội ngũ Golden Seafood làm việc cùng đối tác quốc tế', points: ['Mạng lưới đạt chuẩn — Chỉ hợp tác nhà máy có đầy đủ chứng chỉ HACCP, BRC, IFS, ASC, BAP.', 'Giám sát QC tại nhà máy — Đội ngũ QC trực tiếp tại xưởng cho từng đơn hàng.', 'Nguồn nguyên liệu bền vững — Nuôi trồng & đánh bắt có trách nhiệm, bảo vệ hệ sinh thái Đồng bằng sông Cửu Long.'] },
  en: { eyebrow: 'Why Golden Seafood?', title: 'Your strategic boots on the ground in Vietnam.', text: 'We are your strategic sourcing partner in Vietnam. Our network of modern, certified processing facilities bridges local production and global standards. A dedicated QC team monitors every batch at the factory to ensure each order meets your requirements.', action: 'Explore our capabilities', imageAlt: 'Seafood quality control process', points: ['HACCP, BRC & IFS certified plants', 'Dedicated on-site quality control', 'Transparent, flexible supply chain'] },
}

const icons = [HandshakeOutlinedIcon, VerifiedOutlinedIcon, PublicOutlinedIcon]

export function WhySection() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  return (
    <section className={`${styles.section} why-section`} aria-labelledby="why-title">
      <div className={styles.inner}>
        <motion.div className={styles.visual} initial={{ opacity: 0, x: -28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: .6 }}>
          <img src={banner} alt={text.imageAlt} loading="lazy" /><div className={styles.tag}><i className="bi bi-patch-check-fill" /><span>{lang === 'vi' ? 'Đội ngũ Thủy Sản Vàng làm việc cùng đối tác quốc tế' : 'Our leadership team at Golden Seafood HQ'}</span></div><div className={styles.imageAccent} aria-hidden="true" />
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

