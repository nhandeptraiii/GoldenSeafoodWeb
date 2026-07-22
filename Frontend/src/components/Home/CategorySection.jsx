import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { getCategories } from '../../services/category.service'
import { SectionTitle } from '../SectionTitle'
import { CategoryCard } from './CategoryCard'
import styles from './CategorySection.module.scss'

const copy = {
  vi: { eyebrow: 'Sản phẩm của chúng tôi', title: 'Danh Mục Sản Phẩm Cốt Lõi', subtitle: 'Nguồn thủy hải sản chất lượng cao, đầy đủ chứng chỉ, được kiểm tra nghiêm ngặt nhằm đáp ứng mọi tiêu chuẩn thị trường của bạn.', details: 'Xem chi tiết', empty: 'Chưa có danh mục sản phẩm để hiển thị.', error: 'Không thể tải danh mục lúc này. Vui lòng thử lại sau.' },
  en: { eyebrow: 'Our products', title: 'Our Core Categories', subtitle: 'High-quality, certified seafood carefully sourced and strictly inspected to meet your market demands.', details: 'View Details', empty: 'There are no product categories to display yet.', error: 'Categories could not be loaded. Please try again later.' },
}

function gridClass(count) { if (count <= 4) return styles.compact; if (count <= 6) return styles.threeColumns; return styles.fourColumns }

export function CategorySection() {
  const lang = useSelector((state) => state.language.current)
  const [categories, setCategories] = useState([])
  const [status, setStatus] = useState('loading')
  const text = copy[lang]
  useEffect(() => {
    let active = true
    const load = async () => { try { const data = await getCategories(); if (active) { setCategories(data); setStatus('success') } } catch { if (active) setStatus('error') } }
    load(); return () => { active = false }
  }, [])
  return (
    <section className={styles.section} aria-labelledby="categories-title"><div className={styles.inner}>
      <SectionTitle id="categories-title" eyebrow={text.eyebrow} title={text.title} subtitle={text.subtitle} align="center" />
      {status === 'loading' ? <div className={styles.skeletonGrid} aria-label="Loading categories">{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} variant="rectangular" className={styles.skeleton} />)}</div> : null}
      {status === 'error' ? <div className={styles.state}><ErrorOutlineRoundedIcon /><p>{text.error}</p></div> : null}
      {status === 'success' && !categories.length ? <div className={styles.state}><Inventory2OutlinedIcon /><p>{text.empty}</p></div> : null}
      {status === 'success' && categories.length ? <motion.div className={`${styles.grid} ${gridClass(categories.length)}`} initial="hidden" whileInView="visible" viewport={{ once: true, amount: .12 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: .07 } } }}>
        {categories.map((category) => <motion.div key={category.id} variants={{ hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: .42 } } }}><CategoryCard category={category} lang={lang} labels={text} /></motion.div>)}
      </motion.div> : null}
    </div></section>
  )
}
