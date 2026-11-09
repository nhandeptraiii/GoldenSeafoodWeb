import { useState } from 'react'
import { Link } from 'react-router-dom'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import SetMealOutlinedIcon from '@mui/icons-material/SetMealOutlined'
import styles from './CategoryCard.module.scss'
import shrimpImage from '../../assets/GoldenSeafoodNew/img/product-shrimp.jpg'
import cephalopodImage from '../../assets/GoldenSeafoodNew/img/products/octopus-whole.jpg'
import marineFishImage from '../../assets/GoldenSeafoodNew/img/product-tuna.jpg'
import freshwaterFishImage from '../../assets/GoldenSeafoodNew/img/products/pangasius-portion.jpg'
import crabImage from '../../assets/GoldenSeafoodNew/img/product-crab.jpg'
import frogImage from '../../assets/GoldenSeafoodNew/img/products/frog-classic.jpg'
import shellfishImage from '../../assets/GoldenSeafoodNew/img/products/scallop-meat.jpg'
import processingImage from '../../assets/GoldenSeafoodNew/img/processing-hero-line.jpg'


const categoryImageRules = [
  { image: shrimpImage, terms: ['shrimp', 'prawn', 'tôm'] },
  { image: cephalopodImage, terms: ['squid', 'octopus', 'cuttlefish', 'cephalopod', 'mực', 'bạch tuộc'] },
  { image: crabImage, terms: ['crab', 'cua', 'ghẹ'] },
  { image: marineFishImage, terms: ['marine', 'sea fish', 'tuna', 'cá biển', 'cá ngừ'] },
  { image: freshwaterFishImage, terms: ['freshwater', 'pangasius', 'tra fish', 'cá nước ngọt', 'cá tra'] },
  { image: frogImage, terms: ['frog', 'ếch'] },
  { image: shellfishImage, terms: ['shellfish', 'scallop', 'clam', 'mollusc', 'nhuyễn thể', 'sò', 'nghêu'] },
  { image: processingImage, terms: ['processing', 'oem', 'gia công'] },
]

export function CategoryCard({ category, lang, labels }) {
  const [iconFailed, setIconFailed] = useState(false)
  const name = (lang === 'vi' ? category.name_vi : category.name_en) || category.name_en || category.name_vi || labels.details
  const categoryText = `${category.slug || ''} ${category.name_en || ''} ${category.name_vi || ''}`.toLocaleLowerCase()
  const matchedImage = categoryImageRules.find(({ terms }) => terms.some((term) => categoryText.includes(term)))?.image
  const coverImage = category.image_url || category.icon_url || matchedImage || shellfishImage
  const descriptions = lang === 'vi' ? {
    shrimp: 'Tôm thẻ chân trắng — tẩm bột, tôm trái vải, tôm popcorn, tôm viên.',
    cephalopod: 'Nguyên con làm sạch, cắt khoanh, cắt hoa, bạch tuộc, xiên que.',
    marine: 'Cá ngừ, cá thu, cá dứa — thịt thân, phi lê, cắt lát, cắt khối.',
    freshwater: 'Cá tra (Basa) & cá điêu hồng — phi lê, block công nghiệp.',
    crab: 'Cua nguyên con, thịt chân cua tuyết, càng cua — chín sẵn, ăn liền.',
    frog: 'Ếch nguyên con & đùi ếch đông lạnh — nuôi ao, có hàng quanh năm.',
    shellfish: 'Sò điệp (nguyên cồi/nửa vỏ), nghêu trắng/lụa.',
    processing: 'Cua, tôm nước lạnh, cá thịt trắng & sò điệp — theo quy cách riêng.',
  } : {
    shrimp: 'Vannamei shrimp — breaded, lychee, popcorn and shrimp balls.',
    cephalopod: 'Cleaned whole, rings, flower cut, octopus and skewers.',
    marine: 'Tuna, mackerel and mahi — loins, fillets, portions and cubes.',
    freshwater: 'Pangasius and tilapia — fillets and industrial blocks.',
    crab: 'Whole crab, snow crab leg meat and ready-to-eat crab claws.',
    frog: 'Whole and leg frog products, farm-raised and available year-round.',
    shellfish: 'Scallop meat and half shell, white and surf clams.',
    processing: 'Crab, cold-water shrimp, whitefish and scallops to your specs.',
  }
  const descriptionKey = categoryImageRules.find(({ terms }) => terms.some((term) => categoryText.includes(term)))
  const descriptionType = descriptionKey?.terms[0]
  const description = descriptions[descriptionType === 'shrimp' ? 'shrimp' : descriptionType === 'squid' ? 'cephalopod' : descriptionType === 'crab' ? 'crab' : descriptionType === 'marine' ? 'marine' : descriptionType === 'freshwater' ? 'freshwater' : descriptionType === 'frog' ? 'frog' : descriptionType === 'shellfish' ? 'shellfish' : descriptionType ? 'processing' : '']
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap}>{coverImage && !iconFailed ? <img src={coverImage} alt="" loading="lazy" onError={() => setIconFailed(true)} /> : <SetMealOutlinedIcon aria-hidden="true" />}</div>
      <h3>{name}</h3>
      {description ? <p className={styles.description}>{description}</p> : null}
      <Link to="/products" className={styles.link} aria-label={`${labels.details}: ${name}`}>{labels.details}<ArrowForwardRoundedIcon /></Link>
    </article>
  )
}


