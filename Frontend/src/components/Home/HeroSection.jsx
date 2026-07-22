import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import banner from '../../assets/banner3.png'
import { CTAButton } from '../CTAButton'
import styles from './HeroSection.module.scss'

const copy = {
  vi: {
    eyebrow: 'Golden Seafood · Việt Nam',
    title: 'Đối tác Cung ứng Chiến lược Thủy sản Cao cấp từ Việt Nam.',
    text: 'Tối ưu hóa chuỗi cung ứng của bạn với hệ thống nhà máy đạt chuẩn, quy trình kiểm soát chất lượng nghiêm ngặt và giải pháp đóng container hỗn hợp linh hoạt.',
    contact: 'Liên hệ chúng tôi', catalog: 'Tải Catalog',
    imageAlt: 'Chế biến thủy sản xuất khẩu cao cấp tại Việt Nam',
    badge: 'Kiểm soát chất lượng từ nguồn đến cảng đích',
  },
  en: {
    eyebrow: 'Golden Seafood · Vietnam',
    title: 'Your Trusted Sourcing Partner for Premium Vietnamese Seafood.',
    text: 'Streamlining your supply chain with certified processing plants, rigorous quality control, and flexible mixed-container solutions.',
    contact: 'Contact Us', catalog: 'Download Catalog',
    imageAlt: 'Premium export seafood processing in Vietnam',
    badge: 'Quality controlled from source to destination',
  },
}

export function HeroSection() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  return (
    <header className={styles.hero}>
      <div className={styles.shape} aria-hidden="true" />
      <div className={styles.inner}>
        <motion.div className={styles.content} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <p className={styles.eyebrow}>{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p className={styles.lead}>{text.text}</p>
          <nav className={styles.actions} aria-label={text.contact}>
            <CTAButton to="/contact" variant="secondary">{text.contact}</CTAButton>
            <CTAButton to="/products" variant="outline">{text.catalog}</CTAButton>
          </nav>
        </motion.div>
        <motion.div className={styles.visual} initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .75, delay: .12 }}>
          <div className={styles.imageFrame}><img src={banner} alt={text.imageAlt} fetchPriority="high" /></div>
          <div className={styles.badge}><span>01</span>{text.badge}</div>
        </motion.div>
      </div>
    </header>
  )
}
