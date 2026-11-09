import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined'
import image1 from '../../assets/Processing/image1.png'
import image2 from '../../assets/Processing/image2.png'
import image3 from '../../assets/Processing/image3.png'
import image4 from '../../assets/Processing/image4.png'
import processing1 from '../../assets/Processing/processing1.png'
import processing2 from '../../assets/Processing/processing2.png'
import processing3 from '../../assets/Processing/processing3.png'
import processing4 from '../../assets/Processing/processing4.png'
import styles from './ProcessingServicesPage.module.scss'

const serviceImages = [image1, image2, image3, image4]
const packagingImages = [processing1, processing2, processing3, processing4]
const copy = {
  vi: { heroEyebrow: 'Dịch vụ gia công chuyên biệt', heroTitle: 'Nâng tầm hải sản cao cấp thành sản phẩm sẵn sàng cho thị trường.', heroText: 'Giải pháp chế biến sâu, cấp đông và đóng gói bán lẻ dành riêng cho nhà nhập khẩu, nhà phân phối và chuỗi dịch vụ ẩm thực toàn cầu.', heroCta: 'Trao đổi yêu cầu gia công', speciesEyebrow: 'Năng lực chuyên môn', speciesTitle: 'Danh mục gia công chuyên biệt', speciesText: 'Bốn nhóm sản phẩm biển lạnh được xử lý theo quy cách riêng, từ nguyên liệu đến bao bì xuất khẩu.', itemLabel: 'Mặt hàng', processing: 'Chế biến', freezing: 'Cấp đông & đóng gói', quick: 'Thông số nhanh',
    services: [
      { title: 'Chế biến sâu cá thịt trắng', enTitle: 'Whitefish Deep-Processing', species: 'Alaska Pollock (cá minh thái) & cá tuyết', sections: ['Lấy xương và chế biến chuyên sâu thành phi lê và thịt thăn cao cấp.', 'Định hình dạng đông block chuẩn và block có lớp màng nilon giúp dễ tách lớp.'], specs: [['Fillet', 'Phi lê cá đã loại xương, tạo hình theo quy cách.'], ['Loin', 'Phần thịt thăn dày, đồng đều và có giá trị cao.'], ['Interleaved Block', 'Các lớp phi lê được ngăn bằng màng nilon để dễ tách.']] },
      { title: 'Gia công cua cao cấp', enTitle: 'Premium Crab Processing', species: 'Cua tuyết & cua Dungeness', sections: ['Tách lấy thịt, phân loại thành càng cua, thịt chân và thịt mình.', 'Đóng gói combo block và túi hút chân không riêng lẻ, bảo vệ màu sắc và cấu trúc thịt.'], specs: [['Thịt càng / chân / mình', 'Phân hạng theo giá trị và ứng dụng.'], ['Combo Block', 'Khối đông phối trộn các phần thịt theo tỷ lệ yêu cầu.'], ['IVP', 'Từng phần được hút chân không để chống cháy lạnh.']] },
      { title: 'Gia công sò điệp', enTitle: 'Scallop Processing', species: 'Sò điệp', sections: ['Tách vỏ, loại bỏ nội tạng và trứng để thu hồi cồi sò nguyên chất; cấp đông IQF và đóng túi lẻ.', 'Tùy chọn nửa vỏ giữ nguyên cồi và trứng để tạo quy cách trưng bày cao cấp.'], specs: [['Cồi sò', 'Cồi sò tinh sạch, tách rời và cấp đông nhanh IQF.'], ['Nửa vỏ', 'Cồi và trứng được giữ trên một nửa vỏ.'], ['IQF', 'Cấp đông nhanh từng cá thể, dễ định lượng khi sử dụng.']] },
      { title: 'Tôm ngọt nước lạnh cao cấp', enTitle: 'Cold-water Sweet Shrimp (Ama Ebi)', species: 'Tôm ngọt nước lạnh / Ama Ebi', sections: ['Lột vỏ chừa đuôi (PTO), xếp khay và hút chân không cho phân khúc sashimi/sushi cao cấp.', 'Lột hết vỏ, rút chỉ lưng (PD) và đóng túi lẻ linh hoạt.'], specs: [['PTO', 'Lột vỏ và giữ lại phần đuôi.'], ['PD', 'Lột hoàn toàn và rút chỉ lưng.'], ['Khay hút chân không', 'Khay định hình, sẵn sàng trưng bày bán lẻ.']] },
    ],
    packageEyebrow: 'Bán lẻ & công nghiệp', packageTitle: 'Tiêu chuẩn bao bì và năng lực cấp đông', packageText: 'Bao bì linh hoạt bảo vệ cấu trúc, màu sắc và chất lượng sản phẩm xuyên suốt chuỗi lạnh.', packages: [['Block tiêu chuẩn & có lớp ngăn', 'Đông khối công nghiệp, có màng nilon ngăn giữa các lớp phi lê cá.'], ['Combo block & túi hút chân không', 'Ép khối phối trộn cho thịt cua hoặc đóng túi riêng để chống cháy lạnh.'], ['Túi đóng gói riêng', 'Đóng túi PE/PA theo yêu cầu cho cồi sò điệp và tôm ngọt PD.'], ['Khay hút chân không & skin-pack', 'Khay định hình cao cấp phù hợp trưng bày tôm ngọt Ama Ebi PTO.']], finalTitle: 'Bạn có quy cách riêng cần phát triển?', finalText: 'Chia sẻ thị trường mục tiêu, dạng sản phẩm và yêu cầu bao bì. Đội ngũ của chúng tôi sẽ đề xuất cấu hình phù hợp.', finalCta: 'Liên hệ đội ngũ gia công',
  },
  en: {
    heroEyebrow: 'Specialized processing services', heroTitle: 'Transforming premium seafood into market-ready products.', heroText: 'Deep-processing, freezing and retail-ready packaging solutions tailored for global importers, distributors and food-service partners.', heroCta: 'Discuss your processing brief', speciesEyebrow: 'Specialist capabilities', speciesTitle: 'Exclusively Processed Species', speciesText: 'Four cold-water seafood groups, handled to custom specifications from raw material to export packaging.', itemLabel: 'Species', processing: 'Processing', freezing: 'Freezing & Packing', quick: 'Quick Specifications',
    services: [
      { title: 'Whitefish Deep-Processing', enTitle: 'Whitefish Deep-Processing', species: 'Alaska Pollock & Cod', sections: ['Custom de-boning and processing into premium fillets and loins.', 'Standard and interleaved fish blocks for secondary processors.'], specs: [['Fillet', 'Deboned fish portion trimmed to a custom specification.'], ['Loin', 'A thick, consistent and premium cut of whitefish.'], ['Interleaved Block', 'Fillet layers separated by film for easy handling.']] },
      { title: 'Premium Crab Processing', enTitle: 'Premium Crab Processing', species: 'Snow Crab & Dungeness Crab', sections: ['Specialized meat extraction and grading into claws, leg meat and body meat.', 'Combo blocks and individual vacuum bags preserve color and structure.'], specs: [['Claws / Leg / Body Meat', 'Each portion is graded for value and end application.'], ['Combo Block', 'Selected crab portions combined at a requested ratio.'], ['IVP', 'Individual vacuum packs protect against freezer burn.']] },
      { title: 'Scallop Processing', enTitle: 'Scallop Processing', species: 'Scallops', sections: ['Precision shucking yields pure scallop meat, IQF frozen in individual bags.', 'The half-shell option retains premium meat and roe for elegant presentation.'], specs: [['Scallop Meat', 'Pure, separated adductor meat, individually quick frozen.'], ['Half-Shell', 'Premium meat and roe retained on one shell half.'], ['IQF', 'Individually quick frozen for convenient portion control.']] },
      { title: 'Cold-water Sweet Shrimp (Ama Ebi)', enTitle: 'Cold-water Sweet Shrimp (Ama Ebi)', species: 'Cold-water Sweet Shrimp / Ama Ebi', sections: ['Peeled tail-on, arranged in vacuum trays for premium sashimi and sushi markets.', 'Peeled and deveined, packed in individual pouches for versatile culinary use.'], specs: [['PTO', 'Peeled tail-on, retaining the tail for presentation.'], ['PD', 'Fully peeled and deveined for convenience.'], ['Vacuum Tray', 'A retail-ready formed tray sealed for premium display.']] },
    ], packageEyebrow: 'Retail-ready & industrial', packageTitle: 'Export Packaging Capabilities', packageText: 'Flexible packaging protects product quality throughout the cold chain.', packages: [['Standard & Interleaved Blocks', 'Industrial blocks with film layers between fish fillets.'], ['Combo Blocks & Vacuum Bags', 'Combined crab-meat blocks or individual vacuum bags.'], ['Individual Bags', 'Custom-weight PE/PA bags for scallops and PD sweet shrimp.'], ['Vacuum & Skin-pack Trays', 'Premium trays designed for Ama Ebi PTO presentation.']], finalTitle: 'Have a custom specification to develop?', finalText: 'Share your target market, product format and packaging brief. Our sourcing and QC team will propose the right configuration.', finalCta: 'Contact our Processing Team',
  },
}

const capabilityIcons = [AcUnitRoundedIcon, Inventory2OutlinedIcon, VerifiedOutlinedIcon, PublicOutlinedIcon]

export function ProcessingServicesPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  return <main className={styles.page}>
    <header className={`${styles.hero} sampleHero`}><div className={styles.heroInner}><p>{text.heroEyebrow}</p><h1>{text.heroTitle}</h1><span>{text.heroText}</span><Link to="/contact">{text.heroCta}<ArrowForwardRoundedIcon /></Link></div></header>
    <section className={styles.services}><div className={styles.container}><div className={styles.sectionHeading}><p>{text.speciesEyebrow}</p><h2>{text.speciesTitle}</h2><span>{text.speciesText}</span></div>
      <div className={styles.serviceList}>{text.services.map((service, index) => <article className={styles.serviceCard} key={service.title}>
        <div className={styles.serviceImage}><img src={serviceImages[index]} alt={service.title} loading="lazy" decoding="async" /><span>0{index + 1}</span></div>
        <div className={styles.serviceContent}><p className={styles.serviceIndex}>0{index + 1} / 04</p><h3>{service.title}</h3><p className={styles.altTitle}>{service.enTitle}</p><div className={styles.species}><small>{text.itemLabel}</small><strong>{service.species}</strong></div>
          <div className={styles.solution}><div><small>{text.processing}</small><p>{service.sections[0]}</p></div><div><small>{text.freezing}</small><p>{service.sections[1]}</p></div></div>
          <details className={styles.quickSpecs}><summary><span>{text.quick}</span><AddRoundedIcon /></summary><div>{service.specs.map(([term, definition]) => <p key={term}><strong>{term}</strong><span>{definition}</span></p>)}</div></details>
        </div>
      </article>)}</div>
    </div></section>
    <section className={styles.packaging}><div className={styles.container}><div className={`${styles.sectionHeading} ${styles.lightHeading}`}><p>{text.packageEyebrow}</p><h2>{text.packageTitle}</h2><span>{text.packageText}</span></div>
      <div className={styles.packageGrid}>{text.packages.map(([title, description], index) => { const Icon = capabilityIcons[index]; return <article key={title}><div className={styles.packageImage}><img src={packagingImages[index]} alt={title} loading="lazy" decoding="async" /></div><div className={styles.packageContent}><span><Icon /></span><small>0{index + 1}</small><h3>{title}</h3><p>{description}</p></div></article> })}</div>
    </div></section>
    <section className={styles.finalCta}><div><p>{text.finalTitle}</p><span>{text.finalText}</span></div><Link to="/contact">{text.finalCta}<ArrowForwardRoundedIcon /></Link></section>
  </main>
}
