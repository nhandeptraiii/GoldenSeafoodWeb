import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../redux/slices/languageSlice'
import { InquiryBasketFab } from '../components/InquiryBasketFab'
import { InquiryBasketDrawer } from '../components/InquiryBasketDrawer'
import logo from '../assets/logo.png'
import styles from './MainLayout.module.scss'

const navItems = [
  { to: '/', vi: 'Trang chủ', en: 'Home' },
  { to: '/products', vi: 'Sản phẩm', en: 'Products' },
  { to: '/processing-services', vi: 'Gia công', en: 'Processing' },
  { to: '/quality', vi: 'Chất lượng', en: 'Quality' },
  { to: '/contact', vi: 'Liên hệ', en: 'Contact' },
]

const pageTitles = {
  vi: {
    home: 'Trang chủ', products: 'Sản phẩm', productDetail: 'Chi tiết sản phẩm',
    processing: 'Dịch vụ gia công', quality: 'Kiểm soát chất lượng', contact: 'Liên hệ',
  },
  en: {
    home: 'Home', products: 'Products', productDetail: 'Product Details',
    processing: 'Processing Services', quality: 'Quality Assurance', contact: 'Contact Us',
  },
}

function getPageKey(pathname) {
  if (pathname === '/') return 'home'
  if (pathname === '/products') return 'products'
  if (pathname.startsWith('/products/')) return 'productDetail'
  if (pathname === '/processing-services') return 'processing'
  if (pathname === '/quality') return 'quality'
  if (pathname === '/contact') return 'contact'
  return 'home'
}

export function MainLayout() {
  const lang = useSelector((state) => state.language.current)
  const location = useLocation()
  const dispatch = useDispatch()
  const [isBasketOpen, setIsBasketOpen] = useState(false)

  useEffect(() => {
    const pageName = pageTitles[lang][getPageKey(location.pathname)]
    document.title = `${pageName} | Golden Seafood`
    document.documentElement.lang = lang
  }, [lang, location.pathname])

  return (
    <Box className={styles.layoutRoot}>
      <AppBar position="sticky" color="inherit" elevation={0} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <NavLink to="/" className={styles.brand}>
            <img src={logo} alt="Golden Seafood" className={styles.logo} />
            <span>GOLDEN<br />SEAFOOD</span>
          </NavLink>
          <Box className={styles.navList}>
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>
                {lang === 'vi' ? item.vi : item.en}
              </NavLink>
            ))}
          </Box>
          <Button variant="outlined" size="small" color="inherit" onClick={() => dispatch(toggleLanguage())}>
            {lang === 'vi' ? 'VI / EN' : 'EN / VI'}
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" className={styles.mainContent}><Outlet /></Box>
      <Box component="footer" className={styles.footer}>
        <Container maxWidth="lg">
          <Box className={styles.footerGrid}>
            <Box>
              <Typography className={styles.footerBrand}>GOLDEN SEAFOOD</Typography>
              <Typography variant="body2" className={styles.footerCopy}>
                {lang === 'vi' ? 'Đối tác cung ứng thủy sản đáng tin cậy từ Việt Nam.' : 'A dependable seafood sourcing partner from Vietnam.'}
              </Typography>
            </Box>
            <Typography variant="body2" className={styles.footerCopy}>© {new Date().getFullYear()} Golden Seafood Co., Ltd.</Typography>
          </Box>
        </Container>
      </Box>
      <InquiryBasketFab onClick={() => setIsBasketOpen(true)} />
      <InquiryBasketDrawer open={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
    </Box>
  )
}
