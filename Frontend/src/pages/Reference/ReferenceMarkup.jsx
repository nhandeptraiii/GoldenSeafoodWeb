import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ReferenceMarkup.module.scss'

// Trusted, checked-in presentation markup only; never pass API or user HTML here.
export function ReferenceMarkup({ html, onBasket, onLanguage }) {
  const ref = useRef(null)
  const navigate = useNavigate()
  useEffect(() => {
    const root = ref.current
    root?.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear() })
    const observers = []
    const timers = []
    const reveal = root?.querySelectorAll('.reveal') || []
    if ('IntersectionObserver' in window) {
      document.documentElement.classList.add('js-reveal-ready')
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target) }
      }), { threshold: .1, rootMargin: '0px 0px -40px 0px' })
      reveal.forEach((el) => observer.observe(el))
      observers.push(observer)
      timers.push(setTimeout(() => reveal.forEach((el) => el.classList.add('in')), 2500))
      root?.querySelectorAll('.vchain').forEach((chain) => {
        const observer = new IntersectionObserver((entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return
          const steps = chain.querySelectorAll('.vstep')
          steps.forEach((step, index) => timers.push(setTimeout(() => {
            step.classList.add('active')
            const fill = chain.querySelector('.vchain-line-fill')
            if (fill) fill.style[window.innerWidth <= 980 ? 'height' : 'width'] = `${(index + 1) / steps.length * 100}%`
          }, (index + 1) * 380)))
          observer.disconnect()
        }, { threshold: .3 })
        observer.observe(chain)
        observers.push(observer)
      })
    } else reveal.forEach((el) => el.classList.add('in'))
    root?.querySelectorAll('.cert-track').forEach((track) => {
      if (!track.dataset.loopReady) { track.innerHTML += track.innerHTML; track.dataset.loopReady = 'true' }
    })
    return () => { observers.forEach((observer) => observer.disconnect()); timers.forEach(clearTimeout) }
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
    if (target.matches('.accordion-head')) {
      const item = target.closest('.accordion-item')
      const open = !item.classList.contains('open')
      item.parentElement.querySelectorAll('.accordion-item.open').forEach((other) => other.classList.remove('open'))
      item.classList.toggle('open', open)
      target.setAttribute('aria-expanded', String(open))
      if (open) setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    }
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
