import { useRef, useState } from 'react'
import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined'
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded'
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import image from '../../assets/Contact/image.png'
import { submitContactInquiry } from '../../services/inquiry.service'
import { uploadAttachment } from '../../services/upload.service'
import styles from './ContactPage.module.scss'

const speciesOptions = ['Alaska Pollock / Cod', 'Snow / Dungeness Crab', 'Scallops', 'Cold-water Sweet Shrimp (Ama Ebi)', 'Other Seafood']
const initialForm = { full_name: '', job_title: '', company_name: '', country: '', email: '', whatsapp_number: '', message: '', interested_species: [], attachment_url: '' }
const copy = {
  vi: {
    heroEyebrow: 'Golden Seafood · Việt Nam', heroTitle: 'Kết Nối Với Đội Ngũ Cung Ứng Của Chúng Tôi', heroText: 'Cho dù bạn cần các quy cách sản phẩm gia công theo yêu cầu hay giải pháp container hỗn hợp linh hoạt, đội ngũ xuất khẩu toàn cầu của chúng tôi luôn sẵn sàng hỗ trợ.',
    directEyebrow: 'Kênh liên hệ trực tiếp', directTitle: 'Tìm đúng người, giải quyết đúng nhu cầu.', directText: 'Kết nối trực tiếp với bộ phận phù hợp để nhận hỗ trợ nhanh chóng và chính xác.',
    general: 'Yêu cầu Chung & Thu mua', generalText: 'Dành cho các câu hỏi chung, yêu cầu hồ sơ năng lực (Profile), hoặc hợp tác nhà máy.', hours: 'Thứ 2 – Thứ 6 · 08:30 – 17:30 GMT+7',
    sales: 'Đội ngũ Xuất khẩu & Dự án OEM', salesText: 'Hỗ trợ chuyên trách cho khách hàng quốc tế, báo giá, tùy chỉnh quy cách sản phẩm và các dự án gia công xuất khẩu.', whatsapp: 'Chat WhatsApp ngay', wechat: 'Chat trên WeChat', copied: 'Đã sao chép số WeChat: 0989 284 284',
    formEyebrow: 'B2B Inquiry', formTitle: 'Khởi Động Dự Án Của Bạn Ngay Hôm Nay', formText: 'Chia sẻ yêu cầu của bạn. Đội ngũ chúng tôi sẽ phản hồi với đề xuất chi tiết trong vòng 24 giờ làm việc.',
    fullName: 'Họ và tên', jobTitle: 'Chức vụ', company: 'Tên công ty', country: 'Quốc gia', corporateEmail: 'Email doanh nghiệp', whatsappNumber: 'Số WhatsApp', interested: 'Mặt hàng quan tâm', message: 'Nội dung tin nhắn / Quy cách yêu cầu', upload: 'Đính kèm Spec Sheet / Artwork', uploadHint: 'PDF, XLS, XLSX · Tối đa 10 MB', choose: 'Chọn tệp', send: 'Gửi yêu cầu', sending: 'Đang gửi...', success: 'Cảm ơn bạn đã liên hệ Golden Seafood. Chúng tôi đã nhận được yêu cầu và sẽ phản hồi báo giá chi tiết trong vòng 24 giờ.',
    officeEyebrow: 'Văn phòng đại diện', officeTitle: 'Văn phòng chính tại Cần Thơ', address: '360, đường Trần Hưng Đạo, Phường Phú Lợi, Thành Phố Cần Thơ', mapTitle: 'Bản đồ Văn phòng Golden Seafood',
  },
  en: {
    heroEyebrow: 'Golden Seafood · Vietnam', heroTitle: 'Get in Touch with Our Sourcing Team', heroText: 'Whether you require tailored product specifications or flexible mixed-container solutions, our global export team is online to assist you.',
    directEyebrow: 'Direct channels', directTitle: 'The right contact for every requirement.', directText: 'Connect directly with the relevant department for fast, accurate support.',
    general: 'General & Purchase Inquiries', generalText: 'For general inquiries, company profile requests, or factory collaboration.', hours: 'Mon – Fri · 08:30 – 17:30 GMT+7',
    sales: 'Sales & OEM Re-processing Solutions', salesText: 'Dedicated support for international buyers, price quotes, specification customization, and re-export projects.', whatsapp: 'Chat on WhatsApp Now', wechat: 'Chat on WeChat', copied: 'WeChat number copied: 0989 284 284',
    formEyebrow: 'B2B Inquiry', formTitle: 'Start Your Project Today', formText: 'Share your brief with us. Our team will respond with a detailed proposal within 24 working hours.',
    fullName: 'Full Name', jobTitle: 'Job Title', company: 'Company Name', country: 'Country', corporateEmail: 'Corporate Email', whatsappNumber: 'WhatsApp Number', interested: 'Interested Species', message: 'Your Message / Specifications', upload: 'Upload Spec Sheet / Artwork', uploadHint: 'PDF, XLS, XLSX · Maximum 10 MB', choose: 'Choose File', send: 'Send Inquiry', sending: 'Sending...', success: 'Thank you for contacting Golden Seafood. Our team has received your spec sheet and will get back to you with a detailed quote within 24 hours.',
    officeEyebrow: 'Office location', officeTitle: 'Our Head Office in Can Tho', address: '360, Tran Hung Dao Street, Phu Loi Ward, Can Tho City, Vietnam', mapTitle: 'Golden Seafood Head Office map',
  },
}

export function ContactPage() {
  const lang = useSelector((state) => state.language.current)
  const text = copy[lang]
  const fileRef = useRef(null)
  const [form, setForm] = useState(initialForm)
  const [file, setFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState({ type: '', message: '' })
  const onFieldChange = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  const onSpeciesChange = (name) => setForm((current) => ({ ...current, interested_species: current.interested_species.includes(name) ? current.interested_species.filter((item) => item !== name) : [...current.interested_species, name] }))
  const copyWechat = async () => { await navigator.clipboard.writeText('0989284284'); toast.success(text.copied) }
  const onSubmit = async (event) => {
    event.preventDefault(); setSubmitting(true); setResult({ type: '', message: '' })
    try {
      const attachmentUrl = file ? await uploadAttachment(file) : ''
      await submitContactInquiry({ ...form, attachment_url: attachmentUrl })
      setResult({ type: 'success', message: text.success }); setForm(initialForm); setFile(null); if (fileRef.current) fileRef.current.value = ''
    } catch (error) { setResult({ type: 'error', message: error.message }) } finally { setSubmitting(false) }
  }

  return <main className={styles.page}>
    <header className={styles.hero} style={{ '--contact-image': `url(${image})` }}><div><p>{text.heroEyebrow}</p><h1>{text.heroTitle}</h1><span>{text.heroText}</span></div></header>

    <section className={styles.direct}><div className={styles.container}><div className={styles.heading}><p>{text.directEyebrow}</p><h2>{text.directTitle}</h2><span>{text.directText}</span></div>
      <div className={styles.channelGrid}>
        <article><span className={styles.channelIcon}><BusinessOutlinedIcon /></span><small>01 · GENERAL</small><h3>{text.general}</h3><p>{text.generalText}</p><div className={styles.contactLines}><a href="tel:+84981977981"><PhoneOutlinedIcon /><span><small>Hotline</small>+84 981 977 981</span></a><a href="mailto:info@goldenseafood.com.vn"><MailOutlineRoundedIcon /><span><small>Email</small>info@goldenseafood.com.vn</span></a><div><AccessTimeRoundedIcon /><span><small>{lang === 'vi' ? 'Giờ làm việc' : 'Business hours'}</small>{text.hours}</span></div></div></article>
        <article><span className={styles.channelIcon}><LanguageRoundedIcon /></span><small>02 · EXPORT / OEM</small><h3>{text.sales}</h3><p>{text.salesText}</p><div className={styles.quickActions}><a href="https://wa.me/84945950099" target="_blank" rel="noreferrer" className={styles.whatsapp}><WhatsAppIcon />{text.whatsapp}</a><button type="button" onClick={copyWechat}><ChatBubbleOutlineRoundedIcon />{text.wechat}</button></div><div className={styles.salesEmails}><a href="mailto:binh@goldenseafood.com.vn">binh@goldenseafood.com.vn</a><a href="mailto:tram@goldenseafood.com.vn">tram@goldenseafood.com.vn</a></div></article>
      </div>
    </div></section>

    <section className={styles.inquiry}><div className={styles.formIntro}><p>{text.formEyebrow}</p><h2>{text.formTitle}</h2><span>{text.formText}</span></div>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formGrid}><label><span>{text.fullName} *</span><input required name="full_name" value={form.full_name} onChange={onFieldChange} /></label><label><span>{text.jobTitle}</span><input name="job_title" value={form.job_title} onChange={onFieldChange} placeholder="Purchasing Manager" /></label><label><span>{text.company} *</span><input required name="company_name" value={form.company_name} onChange={onFieldChange} /></label><label><span>{text.country} *</span><input required name="country" value={form.country} onChange={onFieldChange} /></label><label><span>{text.corporateEmail} *</span><input required type="email" name="email" value={form.email} onChange={onFieldChange} /></label><label><span>{text.whatsappNumber}</span><input name="whatsapp_number" value={form.whatsapp_number} onChange={onFieldChange} placeholder="+84 ..." /></label></div>
        <fieldset><legend>{text.interested}</legend><div className={styles.checkGrid}>{speciesOptions.map((species) => <label key={species}><input type="checkbox" checked={form.interested_species.includes(species)} onChange={() => onSpeciesChange(species)} /><span>{species}</span></label>)}</div></fieldset>
        <label className={styles.message}><span>{text.message}</span><textarea required rows="5" name="message" value={form.message} onChange={onFieldChange} /></label>
        <div className={styles.formFooter}><div className={styles.upload}><input ref={fileRef} type="file" accept=".pdf,.xls,.xlsx" onChange={(event) => setFile(event.target.files?.[0] || null)} id="contact-file" /><label htmlFor="contact-file"><UploadFileRoundedIcon /><span><strong>{file?.name || text.choose}</strong><small>{text.upload} · {text.uploadHint}</small></span></label></div><button className={styles.submit} disabled={submitting}><SendRoundedIcon />{submitting ? text.sending : text.send}</button></div>
        {result.message ? <Alert severity={result.type}>{result.message}</Alert> : null}
      </form>
    </section>

    <section className={styles.office}><div className={styles.officeInfo}><p>{text.officeEyebrow}</p><h2>{text.officeTitle}</h2><div><LocationOnOutlinedIcon /><span>{text.address}</span></div><a href="https://www.google.com/maps/search/?api=1&query=360+Tran+Hung+Dao+Phu+Loi+Can+Tho+Vietnam" target="_blank" rel="noreferrer">Google Maps</a></div><div className={styles.map}><iframe title={text.mapTitle} loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=360%20Tran%20Hung%20Dao%20Phu%20Loi%20Can%20Tho%20Vietnam&output=embed" /></div></section>
  </main>
}
