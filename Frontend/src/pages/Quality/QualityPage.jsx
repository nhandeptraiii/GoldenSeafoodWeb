import { useSelector } from 'react-redux'
import ThermostatRoundedIcon from '@mui/icons-material/ThermostatRounded'
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined'
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import banner from '../../assets/Quality/banner.png'
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
  vi: {
    heroEyebrow: 'Golden Seafood · Quality Assurance',
    heroTitle: 'Kiểm Soát Chất Lượng Tuyệt Đối',
    heroText: 'Xóa bỏ mọi rủi ro cung ứng tại Việt Nam. Đội ngũ giám sát độc lập của chúng tôi cam kết từng container hàng đều đáp ứng nghiêm ngặt các tiêu chuẩn chất lượng và an toàn quốc tế.',
    certEyebrow: 'Chứng nhận quốc tế', certTitle: 'Tuân thủ từ nguồn cung',
    certText: 'Chúng tôi thẩm định và chỉ nhập hàng từ các nhà máy chế biến sở hữu đầy đủ chứng chỉ từ các tổ chức an toàn thực phẩm và phát triển bền vững toàn cầu:',
    pipelineEyebrow: 'The Golden QC Pipeline', pipelineTitle: 'Quy Trình Kiểm Soát Chất Lượng 4 Bước', pipelineText: 'Mỗi lô hàng được theo dõi trực tiếp qua bốn điểm kiểm soát độc lập, từ nguyên liệu đầu vào đến khi niêm phong container.',
    step: 'Bước',
    steps: [
      ['Kiểm tra Nguyên liệu đầu vào', 'Đội ngũ QC của chúng tôi kiểm tra độ tươi, độ đồng đều kích cỡ và nhiệt độ của nguyên liệu ngay tại cửa nhà máy trước khi đưa vào dây chuyền chế biến.'],
      ['Giám sát Quá trình Chế biến', 'Giám sát liên tục các tiêu chuẩn vệ sinh và quy cách nhằm đảm bảo sản phẩm được xử lý chính xác theo đơn đặt hàng.'],
      ['Đánh giá Cảm quan & Kiểm nghiệm', 'Kiểm tra nghiêm ngặt sau cấp đông về cấu trúc, màu sắc và tỷ lệ mạ băng chính xác. Mẫu ngẫu nhiên được gửi đến phòng Lab độc lập để phân tích kháng sinh và vi sinh.'],
      ['Giám sát Xếp hàng & Chuỗi lạnh', 'Chúng tôi trực tiếp giám sát quá trình xếp container, xác nhận nhiệt độ duy trì ở -18°C hoặc theo yêu cầu riêng, và ghi nhận số kẹp chì chính thức trước khi xuất hàng.'],
    ],
  },
  en: {
    heroEyebrow: 'Golden Seafood · Quality Assurance',
    heroTitle: 'Uncompromised Quality Assurance',
    heroText: 'Eliminating your sourcing risks in Vietnam. Our independent on-site inspectors guarantee that every container strictly meets your international quality and safety standards.',
    certEyebrow: 'International certification', certTitle: 'Compliance from the source',
    certText: 'We audit and only source from processing plants that are fully certified by global food safety and sustainability authorities:',
    pipelineEyebrow: 'The Golden QC Pipeline', pipelineTitle: 'Our 4-Step Quality Control Process', pipelineText: 'Every shipment is monitored through four independent control points, from raw-material intake to final container sealing.',
    step: 'Step',
    steps: [
      ['Raw Material Auditing', 'Our QC team inspects the freshness, size uniformity, and temperature of raw materials at the factory gates before processing begins.'],
      ['In-line Processing Supervision', 'Continuous monitoring of hygiene standards and specifications ensures that every product is handled precisely as ordered.'],
      ['Sensory & Lab Testing', 'Strict post-freezing checks cover texture, color and precise glazing. Random samples are regularly sent to independent labs for antibiotic and microbiological analyses.'],
      ['Loading & Cold-Chain Verification', 'We physically monitor container loading, verify that temperature remains at -18°C or the customer’s required level, and record official seal numbers before dispatch.'],
    ],
  },
}

export function QualityPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  const sliderItems = [...certificates, ...certificates]
  return <main className={styles.page}>
    <header className={styles.hero} style={{ '--hero-image': `url(${banner})` }}><div className={styles.heroContent}><p>{text.heroEyebrow}</p><h1>{text.heroTitle}</h1><span>{text.heroText}</span></div><div className={styles.scrollMark} aria-hidden="true"><i /></div></header>

    <section className={styles.certifications}><div className={styles.certIntro}><p>{text.certEyebrow}</p><h2>{text.certTitle}</h2><span>{text.certText}</span></div>
      <div className={styles.logoViewport} aria-label={text.certTitle}><div className={styles.logoTrack}>{sliderItems.map((certificate, index) => <div className={styles.logoItem} key={`${certificate.name}-${index}`} aria-hidden={index >= certificates.length}><img src={certificate.image} alt={index < certificates.length ? certificate.name : ''} loading="lazy" /><span>{certificate.name}</span></div>)}</div></div>
    </section>

    <section className={styles.pipeline}><div className={styles.container}><div className={styles.sectionHeading}><p>{text.pipelineEyebrow}</p><h2>{text.pipelineTitle}</h2><span>{text.pipelineText}</span></div>
      <div className={styles.stepGrid}>{text.steps.map(([title, description], index) => { const Icon = stepIcons[index]; return <article className={styles.stepCard} key={title}>
        <div className={styles.stepImage}><img src={stepImages[index]} alt={title} loading="lazy" decoding="async" /><span><Icon /></span></div>
        <div className={styles.stepBody}><small>{text.step} 0{index + 1}</small><h3>{title}</h3><p>{description}</p></div>
      </article> })}</div>
    </div></section>
  </main>
}
