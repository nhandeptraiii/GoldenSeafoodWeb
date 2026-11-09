import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setLanguage } from '../redux/slices/languageSlice'
import { InquiryBasketDrawer } from '../components/InquiryBasketDrawer'
import { ReferenceMarkup } from '../pages/Reference/ReferenceMarkup'
import header from '../pages/Reference/templates/header.html?raw'
import footer from '../pages/Reference/templates/footer.html?raw'
import '../assets/GoldenSeafoodNew/vendor/bootstrap-icons/bootstrap-icons.min.css'

export function MainLayout() {
  const lang = useSelector((state) => state.language.current)
  const count = useSelector((state) => state.inquiry.items?.length || 0)
  const dispatch = useDispatch()
  const { pathname } = useLocation()
  const [basketOpen, setBasketOpen] = useState(false)
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.classList.toggle('lang-vi', lang === 'vi')
    document.querySelectorAll('[data-lang-btn]').forEach((el) => el.classList.toggle('active', el.dataset.langBtn === lang))
    document.querySelectorAll('.main-nav a').forEach((el) => el.classList.toggle('active', el.getAttribute('href') === pathname))
    document.querySelector('.main-nav')?.classList.remove('open')
    document.querySelector('.nav-overlay')?.classList.remove('open')
    document.title = `${(document.querySelector(`h1 [data-lang="${lang}"]`) || document.querySelector('h1'))?.textContent.trim() || 'Golden Seafood'} | Golden Seafood`
    window.scrollTo({ top: 0 })
  }, [lang, pathname])
  useEffect(() => {
    const badge = document.querySelector('.badge-count')
    if (badge) badge.textContent = count
  }, [count])
  useEffect(() => {
    const scroll = () => {
      document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 20)
      document.querySelector('.float-btn.top')?.classList.toggle('show', window.scrollY > 500)
    }
    scroll()
    window.addEventListener('scroll', scroll, { passive: true })
    return () => window.removeEventListener('scroll', scroll)
  }, [])
  return <>
    <ReferenceMarkup html={header} onBasket={() => setBasketOpen(true)} onLanguage={(value) => dispatch(setLanguage(value))} />
    <Outlet />
    <ReferenceMarkup html={footer} />
    <InquiryBasketDrawer open={basketOpen} onClose={() => setBasketOpen(false)} />
  </>
}
