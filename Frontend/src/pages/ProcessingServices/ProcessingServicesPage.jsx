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
  vi: {
    heroEyebrow: 'Dịch vụ gia công chuyên biệt', heroTitle: 'Nâng tầm hải sản cao cấp thành sản phẩm sẵn sàng cho thị trường.', heroText: 'Giải pháp chế biến sâu, cấp đông và đóng gói retail-ready được phát triển riêng cho nhà nhập khẩu, nhà phân phối và chuỗi dịch vụ ẩm thực toàn cầu.', heroCta: 'Trao đổi yêu cầu gia công',
    speciesEyebrow: 'Năng lực chuyên môn', speciesTitle: 'Danh Mục Gia Công Chuyên Biệt', speciesText: 'Bốn nhóm sản phẩm biển lạnh được xử lý theo quy cách riêng, từ nguyên liệu đến bao bì xuất khẩu.', itemLabel: 'Mặt hàng', processing: 'Chế biến', freezing: 'Cấp đông & Đóng gói', quick: 'Quick Specifications',
    services: [
      { title: 'Chế biến sâu Cá thịt trắng biển sâu', enTitle: 'Whitefish Deep-Processing', species: 'Alaska Pollock (Cá Minh Thái) & Cod (Cá tuyết)', sections: ['Lấy xương và chế biến chuyên sâu thành dạng Phi lê (Fillets) và Thịt thăn (Loins) cao cấp.', 'Định hình dạng Đông Block chuẩn và Đông Block lót màng nilon giúp dễ tách lớp, dành cho nhà máy chế biến thứ cấp toàn cầu.'], specs: [['Fillet', 'Phi lê cá đã loại xương, tạo hình theo quy cách.'], ['Loin', 'Phần thịt thăn dày, đồng đều và có giá trị cao.'], ['Interleaved Block', 'Các lớp phi lê được ngăn bằng màng nilon để dễ tách.']] },
      { title: 'Gia công Cua cao cấp', enTitle: 'Premium Crab Processing', species: 'Snow Crab (Cua tuyết) & Dungeness Crab', sections: ['Tách bóc lấy thịt chuyên dụng, phân loại nghiêm ngặt thành Càng cua, Thịt chân và Thịt mình.', 'Đóng gói Combo Block và túi hút chân không lẻ (IVP), bảo vệ màu sắc và cấu trúc thịt nguyên vẹn.'], specs: [['Claws / Leg / Body Meat', 'Phân hạng riêng từng phần thịt theo giá trị và ứng dụng.'], ['Combo Block', 'Khối đông phối trộn các phần thịt theo tỷ lệ yêu cầu.'], ['IVP', 'Từng phần được hút chân không riêng để chống cháy lạnh.']] },
      { title: 'Gia công Sò điệp', enTitle: 'Scallop Processing', species: 'Scallops (Sò điệp)', sections: ['Tách vỏ, loại bỏ hoàn toàn nội tạng và trứng để thu hồi 100% cồi sò nguyên chất; cấp đông IQF và đóng túi lẻ.', 'Tùy chọn nửa vỏ chỉ loại bỏ nội tạng, giữ nguyên cồi và trứng để tạo quy cách trưng bày cao cấp.'], specs: [['Scallop Meat', 'Cồi sò tinh sạch, tách rời và cấp đông nhanh IQF.'], ['Half-Shell', 'Cồi và trứng được giữ nguyên trên một nửa vỏ.'], ['IQF', 'Cấp đông nhanh từng cá thể, dễ định lượng khi sử dụng.']] },
      { title: 'Giải pháp cao cấp cho Tôm ngọt nước lạnh', enTitle: 'Cold-water Sweet Shrimp (Ama Ebi)', species: 'Cold-water Sweet Shrimp / Ama Ebi', sections: ['Lột vỏ chừa đuôi (PTO), xếp khay nghệ thuật và hút chân không cho phân khúc Sashimi/Sushi cao cấp.', 'Lột hết vỏ, rút tim lưng (PD) và đóng túi lẻ linh hoạt cho nhiều ứng dụng ẩm thực.'], specs: [['PTO', 'Peeled Tail-on: lột vỏ và giữ lại phần đuôi.'], ['PD', 'Peeled & Deveined: lột hoàn toàn và rút chỉ lưng.'], ['Vacuum Tray', 'Khay định hình hút chân không, sẵn sàng trưng bày bán lẻ.']] },
    ],
    packageEyebrow: 'Retail-ready & industrial', packageTitle: 'Chuẩn Mực Bao Bì và Khả Năng Cấp Đông', packageText: 'Các giải pháp bao bì linh hoạt bảo vệ cấu trúc, màu sắc và chất lượng sản phẩm xuyên suốt chuỗi lạnh.', packages: [
      ['Standard & Interleaved Blocks', 'Đông khối chuẩn công nghiệp, có lót màng nilon chống dính giữa các lớp phi lê cá.'], ['Combo Blocks & Vacuum Bags', 'Ép khối phối trộn cho thịt cua hoặc đóng túi hút chân không lẻ chống cháy lạnh.'], ['Individual Bags · Túi lẻ', 'Đóng túi PE/PA định lượng theo yêu cầu cho cồi sò điệp và tôm ngọt PD.'], ['Vacuum & Skin-pack Trays', 'Đóng khay định hình cao cấp chuẩn ăn sống cho Tôm ngọt Ama Ebi PTO.'],
    ], finalTitle: 'Bạn có một quy cách riêng cần phát triển?', finalText: 'Chia sẻ thị trường mục tiêu, dạng sản phẩm và yêu cầu bao bì. Đội ngũ sourcing và QC của chúng tôi sẽ đề xuất cấu hình phù hợp.', finalCta: 'Liên hệ đội ngũ Processing',
  },
  en: {
    heroEyebrow: 'Specialized processing services', heroTitle: 'Transforming premium seafood into market-ready products.', heroText: 'Deep-processing, freezing and retail-ready packaging solutions tailored for global importers, distributors and food-service partners.', heroCta: 'Discuss your processing brief',
    speciesEyebrow: 'Specialist capabilities', speciesTitle: 'Exclusively Processed Species', speciesText: 'Four cold-water seafood groups, handled to custom specifications from raw material to export packaging.', itemLabel: 'Species', processing: 'Processing', freezing: 'Freezing & Packing', quick: 'Quick Specifications',
    services: [
      { title: 'Whitefish Deep-Processing', enTitle: 'Chế biến sâu Cá thịt trắng biển sâu', species: 'Alaska Pollock & Cod', sections: ['Custom de-boning and advanced processing into premium Fillets and Loins.', 'Standard Fish Blocks and Interleaved Block Frozen with film layers for easy separation, designed for global secondary processors.'], specs: [['Fillet', 'Deboned fish portion trimmed to a custom specification.'], ['Loin', 'A thick, consistent and premium cut of whitefish.'], ['Interleaved Block', 'Fillet layers separated by film for quick, clean handling.']] },
      { title: 'Premium Crab Processing', enTitle: 'Gia công Cua cao cấp', species: 'Snow Crab & Dungeness Crab', sections: ['Specialized meat extraction, meticulous grading and segmenting into Claws, Leg Meat and Body Meat.', 'Tailored Combo Blocks and individual Vacuum Bags (IVP) preserve color and structural integrity.'], specs: [['Claws / Leg / Body Meat', 'Each portion is graded for value and end application.'], ['Combo Block', 'Selected crab portions combined at a requested ratio.'], ['IVP', 'Individual vacuum packs protect against freezer burn.']] },
      { title: 'Scallop Processing', enTitle: 'Gia công Sò điệp', species: 'Scallops', sections: ['Precision shucking removes all viscera and roe for 100% pure Scallop Meat, IQF frozen in individual bags.', 'The Half-Shell option removes only viscera while keeping premium meat and roe intact for elegant food-service presentation.'], specs: [['Scallop Meat', 'Pure, separated adductor meat, individually quick frozen.'], ['Half-Shell', 'Premium meat and roe retained on one shell half.'], ['IQF', 'Individually quick frozen for convenient portion control.']] },
      { title: 'Cold-water Sweet Shrimp (Ama Ebi)', enTitle: 'Giải pháp cao cấp cho Tôm ngọt nước lạnh', species: 'Cold-water Sweet Shrimp / Ama Ebi', sections: ['Peeled Tail-on (PTO), elegantly arranged and frozen in Vacuum Trays for premium Sashimi and Sushi markets.', 'Peeled and Deveined (PD), packed in individual pouches for versatile culinary applications.'], specs: [['PTO', 'Peeled Tail-on, retaining the tail for elegant presentation.'], ['PD', 'Fully peeled and deveined for ready-to-use convenience.'], ['Vacuum Tray', 'A retail-ready formed tray sealed for premium display.']] },
    ],
    packageEyebrow: 'Retail-ready & industrial', packageTitle: 'Export Packaging Capabilities', packageText: 'Flexible packaging formats protect structure, color and quality throughout the cold chain.', packages: [
      ['Standard & Interleaved Blocks', 'Industrial blocks with film layers between fish fillets for clean separation.'], ['Combo Blocks & Vacuum Bags', 'Combined crab-meat blocks or individual vacuum bags to prevent freezer burn.'], ['Individual Bags', 'Custom-weight PE/PA bags for scallop meat and PD sweet shrimp.'], ['Vacuum & Skin-pack Trays', 'Premium raw-ready trays designed for Ama Ebi PTO presentation.'],
    ], finalTitle: 'Have a custom specification to develop?', finalText: 'Share your target market, product format and packaging brief. Our sourcing and QC team will propose the right configuration.', finalCta: 'Contact our Processing Team',
  },
}

const capabilityIcons = [AcUnitRoundedIcon, Inventory2OutlinedIcon, VerifiedOutlinedIcon, PublicOutlinedIcon]

export function ProcessingServicesPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  return <main className={styles.page}>
    <header className={styles.hero}><div className={styles.heroInner}><p>{text.heroEyebrow}</p><h1>{text.heroTitle}</h1><span>{text.heroText}</span><Link to="/contact">{text.heroCta}<ArrowForwardRoundedIcon /></Link></div></header>
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
