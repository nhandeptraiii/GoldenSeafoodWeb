import { useRef } from 'react'
import { useSelector } from 'react-redux'
import ThermostatRoundedIcon from '@mui/icons-material/ThermostatRounded'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import banner from '../../assets/GoldenSeafoodNew/img/quality-hero.jpg'
import haccp from '../../assets/Quality/Logo/HACCP.png'
import brc from '../../assets/Quality/Logo/BRC.png'
import ifs from '../../assets/Quality/Logo/IFS.png'
import iso from '../../assets/Quality/Logo/ISO 22000.png'
import asc from '../../assets/Quality/Logo/ASC.png'
import bap from '../../assets/Quality/Logo/BAP.png'
import halal from '../../assets/Quality/Logo/HALAL.png'
import qc1 from '../../assets/Quality/QC/image1.png'
import qc2 from '../../assets/Quality/QC/image2.png'
import qc3 from '../../assets/Quality/QC/image3.png'
import qc4 from '../../assets/Quality/QC/image4.png'
import styles from './QualityPage.module.scss'

const certificates = [
  { name: 'HACCP', image: haccp }, { name: 'BRC', image: brc }, { name: 'IFS', image: ifs },
  { name: 'ISO 22000', image: iso }, { name: 'ASC', image: asc }, { name: 'BAP', image: bap }, { name: 'HALAL', image: halal },
]
const stepImages = [qc1, qc2, qc3, qc4]
const stepIcons = [ThermostatRoundedIcon, FactCheckOutlinedIcon, ScienceOutlinedIcon, AcUnitRoundedIcon]
const copy = {
  vi: { heroEyebrow: 'Golden Seafood · Đảm bảo chất lượng', heroTitle: 'Kiểm soát chất lượng tuyệt đối', heroText: 'Loại bỏ rủi ro cung ứng tại Việt Nam. Đội ngũ giám sát độc lập cam kết từng container đáp ứng nghiêm ngặt các tiêu chuẩn chất lượng và an toàn quốc tế.', certEyebrow: 'Chứng nhận quốc tế', certTitle: 'Tuân thủ từ nguồn cung', certText: 'Chúng tôi thẩm định và chỉ nhập hàng từ các nhà máy chế biến có đầy đủ chứng chỉ an toàn thực phẩm và phát triển bền vững quốc tế:', pipelineEyebrow: 'Quy trình QC Golden', pipelineTitle: 'Quy trình kiểm soát chất lượng 4 bước', pipelineText: 'Mỗi lô hàng được theo dõi trực tiếp qua bốn điểm kiểm soát độc lập, từ nguyên liệu đầu vào đến khi niêm phong container.', step: 'Bước', steps: [['Kiểm tra nguyên liệu đầu vào', 'Đội ngũ QC kiểm tra độ tươi, độ đồng đều kích cỡ và nhiệt độ nguyên liệu tại nhà máy trước khi đưa vào dây chuyền chế biến.'], ['Giám sát quá trình chế biến', 'Giám sát liên tục tiêu chuẩn vệ sinh và quy cách để bảo đảm sản phẩm được xử lý chính xác theo đơn đặt hàng.'], ['Đánh giá cảm quan & kiểm nghiệm', 'Kiểm tra sau cấp đông về cấu trúc, màu sắc và tỷ lệ mạ băng. Mẫu ngẫu nhiên được gửi đến phòng lab độc lập để phân tích kháng sinh và vi sinh.'], ['Giám sát xếp hàng & chuỗi lạnh', 'Giám sát quá trình xếp container, xác nhận nhiệt độ duy trì ở -18°C hoặc theo yêu cầu, ghi nhận số kẹp chì trước khi xuất hàng.']] },
  en: { heroEyebrow: 'Golden Seafood · Quality Assurance', heroTitle: 'Uncompromised Quality Assurance', heroText: 'Eliminating your sourcing risks in Vietnam. Our independent on-site inspectors ensure every container meets international quality and safety standards.', certEyebrow: 'International certification', certTitle: 'Compliance from the source', certText: 'We audit and only source from processing plants fully certified by global food safety and sustainability authorities:', pipelineEyebrow: 'The Golden QC Pipeline', pipelineTitle: 'Our 4-Step Quality Control Process', pipelineText: 'Every shipment is monitored through four independent control points, from raw-material intake to final container sealing.', step: 'Step', steps: [['Raw Material Auditing', 'Our QC team inspects freshness, size uniformity, and temperature at the factory before processing begins.'], ['In-line Processing Supervision', 'Continuous monitoring of hygiene standards and specifications ensures every product is handled precisely as ordered.'], ['Sensory & Lab Testing', 'Post-freezing checks cover texture, color and glazing. Random samples go to independent labs for antibiotic and microbiological analyses.'], ['Loading & Cold-Chain Verification', 'We monitor container loading, verify temperature remains at -18°C or the required level, and record seal numbers before dispatch.']] },
}

export function QualityPage() {
  const lang = useSelector((state) => state.language.current)
  const logoViewportRef = useRef(null)
  const text = copy[lang]
  const scrollLogos = (direction) => logoViewportRef.current?.scrollBy({ left: direction * 420, behavior: 'smooth' })
  return <main className={styles.page}>
    <header className={styles.hero} style={{ '--hero-image': `url(${banner})` }}><div className={styles.heroContent}><p>{text.heroEyebrow}</p><h1>{text.heroTitle}</h1><span>{text.heroText}</span></div><div className={styles.scrollMark} aria-hidden="true"><i /></div></header>

    <section className={styles.certifications}><div className={styles.certIntro}><p>{text.certEyebrow}</p><h2>{text.certTitle}</h2><span>{text.certText}</span></div>
      <div className={styles.logoSlider}><button type="button" onClick={() => scrollLogos(-1)} aria-label={lang === 'vi' ? 'Xem chứng chỉ trước' : 'Previous certificates'}><ChevronLeftRoundedIcon /></button><div ref={logoViewportRef} className={styles.logoViewport} aria-label={text.certTitle}><div className={styles.logoTrack}>{certificates.map((certificate) => <div className={styles.logoItem} key={certificate.name}><img src={certificate.image} alt={certificate.name} loading="lazy" /><span>{certificate.name}</span></div>)}</div></div><button type="button" onClick={() => scrollLogos(1)} aria-label={lang === 'vi' ? 'Xem chứng chỉ tiếp theo' : 'Next certificates'}><ChevronRightRoundedIcon /></button></div>
    </section>

    <section className={styles.pipeline}><div className={styles.container}><div className={styles.sectionHeading}><p>{text.pipelineEyebrow}</p><h2>{text.pipelineTitle}</h2><span>{text.pipelineText}</span></div>
      <div className={styles.stepGrid}>{text.steps.map(([title, description], index) => { const Icon = stepIcons[index]; return <article className={styles.stepCard} key={title}>
        <div className={styles.stepImage}><img src={stepImages[index]} alt={title} loading="lazy" decoding="async" /><span><Icon /></span></div>
        <div className={styles.stepBody}><small>{text.step} 0{index + 1}</small><h3>{title}</h3><p>{description}</p></div>
      </article> })}</div>
    </div></section>
  </main>
}
