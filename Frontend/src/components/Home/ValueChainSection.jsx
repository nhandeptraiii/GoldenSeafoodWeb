import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useSelector } from 'react-redux'
import step1 from '../../assets/Home/Step1.png'
import step2 from '../../assets/Home/Step2.png'
import step3 from '../../assets/Home/Step3.png'
import step4 from '../../assets/Home/Step4.png'
import step5 from '../../assets/Home/Step5.png'
import { SectionTitle } from '../SectionTitle'
import { StepCard } from './StepCard'
import styles from './ValueChainSection.module.scss'

const images = [step1, step2, step3, step4, step5]
const copy = {
  vi: { eyebrow: 'Cách chúng tôi làm việc', title: 'Mô Hình Hoạt Động: Chuỗi Giá Trị Đối Tác Chiến Lược', subtitle: 'Năm bước được kiểm soát chặt chẽ, kết nối nguồn nguyên liệu Việt Nam với thị trường toàn cầu.', steps: [
    ['Chọn lọc Nguồn nguyên liệu', 'Chọn lọc vùng nuôi trồng bền vững và đội tàu đánh bắt tự nhiên đạt tiêu chuẩn nghiêm ngặt về môi trường.'],
    ['Nhà máy liên kết Đạt chuẩn', 'Chế biến tại hệ thống nhà máy đối tác hiện đại, sở hữu chứng chỉ HACCP, BRC, IFS, ASC và BAP.'],
    ['Giám sát Chất lượng Chuyên trách', 'Đội ngũ Golden QC trực tiếp giám sát sản xuất, đánh giá cảm quan và kiểm nghiệm phòng Lab.'],
    ['Đóng gói & Gom hàng', 'Đóng gói thương hiệu riêng OEM và phối trộn container hỗn hợp để tối ưu chi phí.'],
    ['Giao hàng Toàn cầu', 'Hoàn thiện chứng từ xuất khẩu và vận tải, bảo đảm lô hàng đến cảng đích an toàn.'],
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
    <section className={styles.section} aria-labelledby="value-chain-title" ref={ref}><div className={styles.inner}>
      <SectionTitle id="value-chain-title" eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} align="center" />
      <div className={`${styles.timeline} ${inView ? styles.animate : ''}`}><div className={styles.line} aria-hidden="true"><span /></div>{steps.map((step, index) => <StepCard key={step.title} step={step} index={index} active={index < activeCount} />)}</div>
    </div></section>
  )
}
