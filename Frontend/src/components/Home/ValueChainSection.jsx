import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useSelector } from 'react-redux'
import step1 from '../../assets/Home/Step1.png'
import step2 from '../../assets/Home/Step2.png'
import step3 from '../../assets/Home/Step3.png'
import step4 from '../../assets/Home/Step4.png'
import step5 from '../../assets/Home/Step5.png'
import certificateImage from '../../assets/GoldenSeafoodNew/img/certs/haccp.png'
import { SectionTitle } from '../SectionTitle'
import { StepCard } from './StepCard'
import styles from './ValueChainSection.module.scss'

const images = [step1, step2, step3, step4, step5]
const copy = {
  vi: { eyebrow: 'Cách chúng tôi làm việc', title: 'Mô hình hoạt động: Chuỗi giá trị đối tác chiến lược', subtitle: 'Năm bước được kiểm soát chặt chẽ, kết nối nguồn nguyên liệu Việt Nam với thị trường toàn cầu.', steps: [
    ['Chọn lọc nguồn nguyên liệu', 'Chọn vùng nuôi trồng bền vững và đội tàu đánh bắt tự nhiên đạt tiêu chuẩn môi trường nghiêm ngặt.'],
    ['Nhà máy liên kết đạt chuẩn', 'Chế biến tại hệ thống nhà máy đối tác hiện đại, đạt chứng nhận HACCP, BRC, IFS, ASC và BAP.'],
    ['Giám sát chất lượng chuyên trách', 'Đội ngũ Golden QC trực tiếp giám sát sản xuất, đánh giá cảm quan và kiểm nghiệm phòng lab.'],
    ['Đóng gói và gom hàng', 'Đóng gói thương hiệu riêng OEM và phối trộn container hỗn hợp để tối ưu chi phí.'],
    ['Giao hàng toàn cầu', 'Hoàn thiện chứng từ xuất khẩu và vận tải, bảo đảm lô hàng đến cảng đích an toàn.'],
  ] },
  en: { eyebrow: 'How we work', title: 'How We Work: Our Strategic Partner Model', subtitle: 'Five carefully controlled steps connect Vietnam’s seafood resources to markets worldwide.', steps: [
    ['Sourcing & Raw Materials', 'We select sustainable farms and wild-catch vessels that meet strict environmental standards.'],
    ['Certified Processing Plants', 'Partner facilities use advanced technology and hold HACCP, BRC, IFS, ASC and BAP certifications.'],
    ['Dedicated Golden QC', 'Our on-site QC team performs sensory evaluations and lab analyses for full specification compliance.'],
    ['Custom Packaging & Consolidation', 'OEM/private-label packaging and mixed-container solutions consolidate items to optimize costs.'],
    ['Global Logistics & Delivery', 'Complete export documentation and seamless freight handling deliver your seafood safely worldwide.'],
  ] },
}

export function ValueChainSection() {
  const lang = useSelector((state) => state.language.current)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: .25 })
  const [activeCount, setActiveCount] = useState(0)
  const text = copy[lang]
  useEffect(() => { if (!inView) return undefined; const timers = text.steps.map((_, index) => window.setTimeout(() => setActiveCount(index + 1), index * 260 + 150)); return () => timers.forEach(window.clearTimeout) }, [inView, text.steps])
  const steps = text.steps.map(([title, description], index) => ({ title, description, image: images[index] }))
  return (
    <section className={`${styles.section} value-chain-section`} aria-labelledby="value-chain-title" ref={ref}><div className={styles.inner}>
      <SectionTitle id="value-chain-title" eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} align="center" />
      <div className={`${styles.timeline} ${inView ? styles.animate : ''}`}><div className={styles.line} aria-hidden="true"><span /></div>{steps.map((step, index) => <StepCard key={step.title} step={step} index={index} active={index < activeCount} />)}</div>
    </div><div className={styles.certificates} aria-label="International certifications">{['HALAL', 'HACCP', 'BRC', 'IFS', 'ISO 22000', 'ASC', 'BAP', 'HALAL'].map((label, index) => <span key={`${label}-${index}`}><img src={certificateImage} alt="" />{label}</span>)}</div><div className={styles.cta}><div><strong>{lang === 'vi' ? 'Bạn cần nguồn cung linh hoạt?' : 'Need flexible sourcing?'}</strong><p>{lang === 'vi' ? 'Chúng tôi chuyên phối trộn container hỗn hợp (tôm, cá, mực) nhằm tối ưu chi phí vận chuyển và tồn kho.' : 'We consolidate mixed containers of shrimp, fish and squid to optimize freight and inventory costs.'}</p></div><a href="/contact">{lang === 'vi' ? 'Liên hệ đội ngũ Sourcing' : 'Contact our sourcing team'}</a></div></section>
  )
}

