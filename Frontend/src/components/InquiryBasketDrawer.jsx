import { useState } from 'react'
import { Alert, Drawer } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import { useDispatch, useSelector } from 'react-redux'
import { clearInquiryItems, removeInquiryItem } from '../redux/slices/inquirySlice'
import { submitBasketInquiry } from '../services/inquiry.service'
import styles from './InquiryBasketDrawer.module.scss'

const defaultForm = { full_name: '', company_name: '', email: '', country: '', whatsapp_number: '', destination_port: '', message: '', special_requirements: '' }
const copy = {
  vi: { title: 'Danh sách báo giá', subtitle: 'Gửi yêu cầu cho nhiều sản phẩm trong một lần.', empty: 'Chưa có sản phẩm trong danh sách.', remove: 'Xóa', name: 'Họ và tên', company: 'Tên công ty', country: 'Quốc gia', whatsapp: 'Số WhatsApp', port: 'Cảng đích đến', message: 'Lời nhắn', requirements: 'Yêu cầu quy cách riêng', send: 'Gửi yêu cầu báo giá', sending: 'Đang gửi...', success: 'Yêu cầu đã được gửi. Mã của bạn:', chat: 'Chat trực tiếp qua WhatsApp để nhận báo giá nhanh', close: 'Đóng' },
  en: { title: 'Inquiry Basket', subtitle: 'Send one consolidated request for multiple products.', empty: 'No products in your inquiry list yet.', remove: 'Remove', name: 'Full Name', company: 'Company Name', country: 'Country', whatsapp: 'WhatsApp Number', port: 'Target Destination Port', message: 'Message', requirements: 'Special Requirements', send: 'Send Inquiry', sending: 'Sending...', success: 'Your inquiry has been submitted. Reference:', chat: 'Chat directly via WhatsApp for instant quote', close: 'Close' },
}

export function InquiryBasketDrawer({ open, onClose }) {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language.current)
  const items = useSelector((state) => state.inquiry.items)
  const [form, setForm] = useState(defaultForm)
  const [successCode, setSuccessCode] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const text = copy[lang]
  const onChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const onSubmit = async (event) => { event.preventDefault(); if (!items.length) return; setSubmitting(true); setError(''); try { const response = await submitBasketInquiry({ ...form, items }); setSuccessCode(response?.data?.inquiry_code || ''); dispatch(clearInquiryItems()); setForm(defaultForm) } catch (err) { setError(err.message) } finally { setSubmitting(false) } }
  const whatsappUrl = `https://wa.me/84945950099?text=${encodeURIComponent(`Hi Golden Seafood, I have just submitted inquiry ${successCode}. Please provide a quick quote.`)}`

  return <Drawer anchor="right" open={open} onClose={onClose}><aside className={styles.drawer}>
    <header><div><h2>{text.title}</h2><p>{text.subtitle}</p></div><button onClick={onClose} aria-label={text.close}><CloseRoundedIcon /></button></header>
    {items.length ? <div className={styles.items}>{items.map((item) => <article key={item.product_id}>{item.thumbnail_url ? <img src={item.thumbnail_url} alt="" /> : null}<div><strong>{item.product_name}</strong><small>Qty: {item.quantity}</small></div><button onClick={() => dispatch(removeInquiryItem(item.product_id))} aria-label={`${text.remove} ${item.product_name}`}><DeleteOutlineRoundedIcon /></button></article>)}</div> : <div className={styles.empty}>{text.empty}</div>}
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.twoColumns}><label>{text.name}<input required name="full_name" value={form.full_name} onChange={onChange} /></label><label>{text.company}<input required name="company_name" value={form.company_name} onChange={onChange} /></label></div>
      <div className={styles.twoColumns}><label>Email<input required type="email" name="email" value={form.email} onChange={onChange} /></label><label>{text.whatsapp}<input name="whatsapp_number" value={form.whatsapp_number} onChange={onChange} /></label></div>
      <div className={styles.twoColumns}><label>{text.country}<input required name="country" value={form.country} onChange={onChange} /></label><label>{text.port}<input name="destination_port" value={form.destination_port} onChange={onChange} /></label></div>
      <label>{text.message}<textarea rows="3" name="message" value={form.message} onChange={onChange} /></label>
      <label>{text.requirements}<textarea rows="3" name="special_requirements" value={form.special_requirements} onChange={onChange} /></label>
      <button className={styles.submit} disabled={!items.length || submitting} type="submit"><SendRoundedIcon />{submitting ? text.sending : text.send}</button>
    </form>
    {successCode ? <Alert severity="success" className={styles.success}>{text.success} <strong>{successCode}</strong><a href={whatsappUrl} target="_blank" rel="noreferrer"><WhatsAppIcon />{text.chat}</a></Alert> : null}
    {error ? <Alert severity="error" className={styles.alert}>{error}</Alert> : null}
  </aside></Drawer>
}
