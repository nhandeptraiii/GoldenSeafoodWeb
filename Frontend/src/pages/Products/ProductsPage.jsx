import { useEffect, useMemo, useState } from 'react'
import { Alert, Checkbox, Drawer, Pagination, Skeleton } from '@mui/material'
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { useSelector } from 'react-redux'
import { ProductCard } from '../../components/ProductCard'
import { getCategories } from '../../services/category.service'
import { getProducts } from '../../services/product.service'
import styles from './ProductsPage.module.scss'

const pageSize = 9
const copy = {
  vi: { eyebrow: 'Danh mục thủy sản', title: 'Sản phẩm xuất khẩu từ Việt Nam', subtitle: 'Khám phá nguồn hàng được lựa chọn kỹ lưỡng từ các nhà máy đạt chuẩn và đội ngũ QC chuyên trách.', search: 'Tìm theo tên sản phẩm...', filter: 'Bộ lọc sản phẩm', categories: 'Danh mục', all: 'Tất cả sản phẩm', type: 'Trạng thái sản phẩm', results: 'sản phẩm', clear: 'Xóa bộ lọc', empty: 'Không tìm thấy sản phẩm phù hợp.', close: 'Đóng bộ lọc' },
  en: { eyebrow: 'Seafood catalog', title: 'Export-ready products from Vietnam', subtitle: 'Explore carefully sourced seafood from certified plants, supported by dedicated quality control.', search: 'Search products...', filter: 'Product filters', categories: 'Categories', all: 'All products', type: 'Product type', results: 'products', clear: 'Clear filters', empty: 'No matching products found.', close: 'Close filters' },
}
const typeOptions = [
  { value: 'raw', vi: 'Tươi sống', en: 'Raw' },
  { value: 'cooked', vi: 'Hấp / Chín', en: 'Cooked' },
  { value: 'value_added', vi: 'Tẩm bột / Gia công sâu', en: 'Value-added / Breaded' },
]

function FilterPanel({ lang, text, categories, categoryId, setCategoryId, types, toggleType, clearFilters, onClose }) {
  return <aside className={styles.filterPanel}>
    <div className={styles.filterHeading}><span>{text.filter}</span>{onClose ? <button onClick={onClose} aria-label={text.close}><CloseRoundedIcon /></button> : null}</div>
    <div className={styles.filterGroup}><p>{text.categories}</p>
      <button className={!categoryId ? styles.activeCategory : ''} onClick={() => setCategoryId('')}><span>{text.all}</span></button>
      {categories.map((category) => <button key={category.id} className={String(categoryId) === String(category.id) ? styles.activeCategory : ''} onClick={() => setCategoryId(category.id)}><span>{lang === 'vi' ? category.name_vi : category.name_en}</span><small>{category.productCount ?? 0}</small></button>)}
    </div>
    <div className={styles.filterGroup}><p>{text.type}</p>{typeOptions.map((item) => <label className={styles.checkRow} key={item.value}><Checkbox size="small" checked={types.includes(item.value)} onChange={() => toggleType(item.value)} /><span>{lang === 'vi' ? item.vi : item.en}</span></label>)}</div>
    {(categoryId || types.length) ? <button className={styles.clearButton} onClick={clearFilters}>{text.clear}</button> : null}
  </aside>
}

export function ProductsPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [types, setTypes] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [mobileFilters, setMobileFilters] = useState(false)

  useEffect(() => { Promise.all([getCategories(), getProducts({ limit: 50 })]).then(([categoryData, productData]) => { setCategories(categoryData); setProducts(productData.products || []) }).catch((err) => setError(err.message)).finally(() => setLoading(false)) }, [])
  const filtered = useMemo(() => products.filter((product) => {
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || [product.name_en, product.name_vi, product.short_desc_en, product.short_desc_vi].some((value) => value?.toLocaleLowerCase().includes(query))
    const matchesCategory = !categoryId || String(product.category?.id || product.category_id) === String(categoryId)
    const matchesType = !types.length || types.includes(product.product_type)
    return matchesSearch && matchesCategory && matchesType
  }), [products, search, categoryId, types])
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const visibleProducts = filtered.slice((page - 1) * pageSize, page * pageSize)
  const selectCategory = (value) => { setCategoryId(value); setPage(1); setMobileFilters(false) }
  const toggleType = (value) => { setTypes((current) => current.includes(value) ? current.filter((type) => type !== value) : [...current, value]); setPage(1) }
  const clearFilters = () => { setCategoryId(''); setTypes([]); setPage(1) }
  const panelProps = { lang, text, categories, categoryId, setCategoryId: selectCategory, types, toggleType, clearFilters }

  return <main className={styles.page}>
    <section className={styles.intro}><div><p>{text.eyebrow}</p><h1>{text.title}</h1><span>{text.subtitle}</span></div></section>
    <div className={styles.layout}>
      <div className={styles.desktopFilter}><FilterPanel {...panelProps} /></div>
      <section className={styles.catalog}>
        <div className={styles.toolbar}>
          <div className={styles.search}><SearchRoundedIcon /><input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder={text.search} aria-label={text.search} /></div>
          <button className={styles.mobileFilterButton} onClick={() => setMobileFilters(true)}><FilterListRoundedIcon />{text.filter}{categoryId || types.length ? <b>{types.length + (categoryId ? 1 : 0)}</b> : null}</button>
          <p><strong>{filtered.length}</strong> {text.results}</p>
        </div>
        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? <div className={styles.grid}>{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} variant="rectangular" className={styles.skeleton} />)}</div> : null}
        {!loading && visibleProducts.length ? <div className={styles.grid}>{visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div> : null}
        {!loading && !visibleProducts.length && !error ? <div className={styles.empty}>{text.empty}</div> : null}
        {pages > 1 ? <Pagination page={page} count={pages} onChange={(_, value) => { setPage(value); window.scrollTo({ top: 260, behavior: 'smooth' }) }} color="primary" className={styles.pagination} /> : null}
      </section>
    </div>
    <Drawer anchor="left" open={mobileFilters} onClose={() => setMobileFilters(false)}><FilterPanel {...panelProps} onClose={() => setMobileFilters(false)} /></Drawer>
  </main>
}
