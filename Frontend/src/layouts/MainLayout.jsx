import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleLanguage } from '../redux/slices/languageSlice'
import { InquiryBasketFab } from '../components/InquiryBasketFab'
import { InquiryBasketDrawer } from '../components/InquiryBasketDrawer'
import logo from '../assets/logo.png'
import styles from './MainLayout.module.scss'

const navItems = [{ to: '/', vi: 'Trang chủ', en: 'Home' },{ to: '/products', vi: 'Sản phẩm', en: 'Products' },{ to: '/processing-services', vi: 'Gia công', en: 'Processing' },{ to: '/quality', vi: 'Chất lượng', en: 'Quality' },{ to: '/contact', vi: 'Liên hệ', en: 'Contact' }]
const pageTitles = { vi: { home: 'Trang chủ', products: 'Sản phẩm', productDetail: 'Chi tiết sản phẩm', processing: 'Dịch vụ gia công', quality: 'Kiểm soát chất lượng', contact: 'Liên hệ' }, en: { home: 'Home', products: 'Products', productDetail: 'Product Details', processing: 'Processing Services', quality: 'Quality Assurance', contact: 'Contact Us' } }
function getPageKey(pathname) { if (pathname === '/') return 'home'; if (pathname === '/products') return 'products'; if (pathname.startsWith('/products/')) return 'productDetail'; if (pathname === '/processing-services') return 'processing'; if (pathname === '/quality') return 'quality'; if (pathname === '/contact') return 'contact'; return 'home' }

export function MainLayout() {
  const lang = useSelector((state) => state.language.current)
  const location = useLocation()
  const dispatch = useDispatch()
  const [isBasketOpen, setIsBasketOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  useEffect(() => { document.title = `${pageTitles[lang][getPageKey(location.pathname)]} | Golden Seafood`; document.documentElement.lang = lang }, [lang, location.pathname])
  return <Box className={styles.layoutRoot}>
    <AppBar position="sticky" color="inherit" elevation={0} className={styles.appBar}><Toolbar className={styles.toolbar}>
      <NavLink to="/" className={styles.brand} onClick={() => setIsMobileMenuOpen(false)}><img src={logo} alt="Golden Seafood" className={styles.logo} /><span>GOLDEN<br />SEAFOOD</span></NavLink>
      <Box component="nav" id="customer-navigation" className={`${styles.navList} ${isMobileMenuOpen ? styles.navListOpen : ''}`}>{navItems.map((item) => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setIsMobileMenuOpen(false)} className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}>{lang === 'vi' ? item.vi : item.en}</NavLink>)}</Box>
      <Box className={styles.headerActions}><Button className={styles.languageButton} variant="outlined" size="small" color="inherit" onClick={() => dispatch(toggleLanguage())}>{lang === 'vi' ? 'VI / EN' : 'EN / VI'}</Button><button type="button" className={styles.menuButton} aria-label={isMobileMenuOpen ? (lang === 'vi' ? 'Đóng menu' : 'Close menu') : (lang === 'vi' ? 'Mở menu' : 'Open menu')} aria-expanded={isMobileMenuOpen} aria-controls="customer-navigation" onClick={() => setIsMobileMenuOpen((open) => !open)}>{isMobileMenuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}</button></Box>
    </Toolbar></AppBar>
    <Box component="main" className={styles.mainContent}><Outlet /></Box>
    <Box component="footer" className={styles.footer}><Container maxWidth="lg" className={styles.footerContainer}><Box className={styles.footerGrid}>
      <Box className={styles.footerAbout}><NavLink to="/" className={styles.footerLogo}><img src={logo} alt="Golden Seafood" /><span>GOLDEN<br />SEAFOOD</span></NavLink><Typography className={styles.footerDescription}>{lang === 'vi' ? 'Đối tác cung ứng chiến lược thủy sản cao cấp từ Việt Nam, kết nối nguồn hàng đạt chuẩn với thị trường toàn cầu.' : 'Your strategic sourcing partner for premium Vietnamese seafood, connecting certified supply with markets worldwide.'}</Typography></Box>
      <Box className={styles.footerColumn}><Typography component="h2">{lang === 'vi' ? 'Liên kết nhanh' : 'Quick links'}</Typography><nav>{navItems.map((item) => <NavLink key={item.to} to={item.to}>{lang === 'vi' ? item.vi : item.en}</NavLink>)}</nav></Box>
      <Box className={styles.footerColumn}><Typography component="h2">{lang === 'vi' ? 'Thông tin liên hệ' : 'Contact information'}</Typography><div className={styles.footerContacts}><a href="tel:+84981977981"><PhoneOutlinedIcon /><span>+84 981 977 981</span></a><a href="mailto:info@goldenseafood.com.vn"><MailOutlineRoundedIcon /><span>info@goldenseafood.com.vn</span></a><a href="https://wa.me/84945950099" target="_blank" rel="noreferrer"><WhatsAppIcon /><span>+84 945 950 099</span></a><div><LocationOnOutlinedIcon /><span>{lang === 'vi' ? '360 Trần Hưng Đạo, P. Phú Lợi, TP. Cần Thơ' : '360 Tran Hung Dao, Phu Loi Ward, Can Tho City'}</span></div></div></Box>
    </Box><Box className={styles.footerBottom}><Typography>© {new Date().getFullYear()} Golden Seafood Co., Ltd. {lang === 'vi' ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</Typography><Typography>{lang === 'vi' ? 'Trang web được tạo bởi' : 'Website created by'} <strong>Viettel</strong></Typography></Box></Container></Box>
    <InquiryBasketFab onClick={() => setIsBasketOpen(true)} /><InquiryBasketDrawer open={isBasketOpen} onClose={() => setIsBasketOpen(false)} />
  </Box>
}
