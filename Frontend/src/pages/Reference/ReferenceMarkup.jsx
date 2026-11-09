import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ReferenceMarkup.module.scss'

// Trusted, checked-in presentation markup only; never pass API or user HTML here.
export function ReferenceMarkup({ html, onBasket, onLanguage }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    ref.current?.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })
  }, [html])
  const click = (event) => {
    const target = event.target.closest('a, button, .accordion-head, .nav-overlay')
    if (!target) return
    if (target.matches('[data-lang-btn]')) onLanguage?.(target.dataset.langBtn)
    if (target.matches('[data-open-basket]')) onBasket?.()
    if (target.matches('.burger, .nav-close, .nav-overlay')) {
      const open = target.matches('.burger')
      target.setAttribute('aria-expanded', String(open))
      document.querySelector('.main-nav')?.classList.toggle('open', open)
      document.querySelector('.nav-overlay')?.classList.toggle('open', open)
    }
    if (target.matches('.top')) window.scrollTo({ top: 0, behavior: 'smooth' })
    if (target.matches('.accordion-head')) target.closest('.accordion-item')?.classList.toggle('open')
    if (target.querySelector('.bi-wechat')) {
      event.preventDefault()
      navigator.clipboard?.writeText('0989284284')
    }
    const href = target.getAttribute('href')
    if (href?.startsWith('/') && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.button === 0) {
      event.preventDefault()
      navigate(href)
    }
  }
  return <div ref={ref} className={styles.markup} onClick={click} dangerouslySetInnerHTML={{ __html: html }} />
}
