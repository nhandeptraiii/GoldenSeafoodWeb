import { useRef, useState } from 'react'
import { Alert } from '@mui/material'
import { useSelector } from 'react-redux'
import { submitContactInquiry } from '../../services/inquiry.service'
import { uploadAttachment } from '../../services/upload.service'
import styles from './ContactPage.module.scss'

const speciesOptions = ['Alaska Pollock / Cod', 'Snow / Dungeness Crab', 'Scallops', 'Cold-water Sweet Shrimp (Ama Ebi)', 'Other Seafood']
const initialForm = { full_name: '', job_title: '', company_name: '', country: '', email: '', whatsapp_number: '', message: '', interested_species: [], attachment_url: '', destination_port: '' }
const copy = {
  vi: { heroEyebrow: 'Golden Seafood · Việt Nam', heroTitle: 'Kết nối với đội ngũ cung ứng của chúng tôi', heroText: 'Dù bạn cần quy cách sản phẩm gia công theo yêu cầu hay giải pháp container hỗn hợp linh hoạt, đội ngũ xuất khẩu của chúng tôi luôn sẵn sàng hỗ trợ.', directEyebrow: 'Kênh liên hệ trực tiếp', directTitle: 'Đúng người hỗ trợ, đúng nhu cầu.', directText: 'Kết nối trực tiếp với bộ phận phù hợp để nhận hỗ trợ nhanh chóng và chính xác.', general: 'Yêu cầu chung & thu mua', generalText: 'Dành cho câu hỏi chung, yêu cầu hồ sơ năng lực hoặc hợp tác nhà máy.', hours: 'Thứ 2 – Thứ 6 · 07:30 – 17:00 GMT+7', sales: 'Đội ngũ xuất khẩu & dự án OEM', salesText: 'Hỗ trợ khách hàng quốc tế, báo giá, tùy chỉnh quy cách sản phẩm và dự án gia công xuất khẩu.', whatsapp: 'Chat WhatsApp ngay', wechat: 'Chat trên WeChat', copied: 'Đã sao chép số WeChat: 0989 284 284', formEyebrow: 'Yêu cầu B2B', formTitle: 'Bắt đầu dự án của bạn hôm nay', formText: 'Chia sẻ yêu cầu. Đội ngũ sẽ phản hồi với đề xuất chi tiết trong vòng 24 giờ làm việc.', fullName: 'Họ và tên', jobTitle: 'Chức vụ', company: 'Tên công ty', country: 'Quốc gia', corporateEmail: 'Email doanh nghiệp', whatsappNumber: 'Số WhatsApp', interested: 'Mặt hàng quan tâm', message: 'Nội dung tin nhắn / Quy cách yêu cầu', upload: 'Đính kèm Spec Sheet / Artwork', uploadHint: 'PDF, XLS, XLSX · Tối đa 10 MB', choose: 'Chọn tệp', send: 'Gửi yêu cầu', sending: 'Đang gửi...', success: 'Cảm ơn bạn đã liên hệ Golden Seafood. Đội ngũ đã nhận được yêu cầu và sẽ phản hồi báo giá chi tiết trong vòng 24 giờ.', officeEyebrow: 'Văn phòng đại diện', officeTitle: 'Văn phòng chính tại Cần Thơ', address: '360, đường Trần Hưng Đạo, Phường Phú Lợi, Thành phố Cần Thơ', mapTitle: 'Bản đồ văn phòng Golden Seafood' },
  en: { heroEyebrow: 'Golden Seafood · Vietnam', heroTitle: 'Get in Touch with Our Sourcing Team', heroText: 'Whether you require tailored product specifications or flexible mixed-container solutions, our global export team is ready to assist.', directEyebrow: 'Direct channels', directTitle: 'The right contact for every requirement.', directText: 'Connect directly with the relevant department for fast, accurate support.', general: 'General & Purchase Inquiries', generalText: 'For general inquiries, company profile requests, or factory collaboration.', hours: 'Mon – Fri · 07:30 – 17:00 GMT+7', sales: 'Sales & OEM Re-processing Solutions', salesText: 'Dedicated support for international buyers, price quotes, specification customization, and re-export projects.', whatsapp: 'Chat on WhatsApp Now', wechat: 'Chat on WeChat', copied: 'WeChat number copied: 0989 284 284', formEyebrow: 'B2B Inquiry', formTitle: 'Start Your Project Today', formText: 'Share your brief with us. Our team will respond with a detailed proposal within 24 working hours.', fullName: 'Full Name', jobTitle: 'Job Title', company: 'Company Name', country: 'Country', corporateEmail: 'Corporate Email', whatsappNumber: 'WhatsApp Number', interested: 'Interested Species', message: 'Your Message / Specifications', upload: 'Upload Spec Sheet / Artwork', uploadHint: 'PDF, XLS, XLSX · Maximum 10 MB', choose: 'Choose File', send: 'Send Inquiry', sending: 'Sending...', success: 'Thank you for contacting Golden Seafood. Our team has received your request and will get back to you with a detailed quote within 24 hours.', officeEyebrow: 'Office location', officeTitle: 'Our Head Office in Can Tho', address: '360, Tran Hung Dao Street, Phu Loi Ward, Can Tho City, Vietnam', mapTitle: 'Golden Seafood Head Office map' },
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
  const onSubmit = async (event) => {
    event.preventDefault(); setSubmitting(true); setResult({ type: '', message: '' })
    try {
      const attachmentUrl = file ? await uploadAttachment(file) : ''
      await submitContactInquiry({ ...form, attachment_url: attachmentUrl })
      setResult({ type: 'success', message: text.success }); setForm(initialForm); setFile(null); if (fileRef.current) fileRef.current.value = ''
    } catch (error) { setResult({ type: 'error', message: error.message }) } finally { setSubmitting(false) }
  }

  const vi = lang === 'vi'
  const field = (name, label, required = false, type = 'text') => <div className="form-field"><label htmlFor={`contact-${name}`}>{label}</label><input id={`contact-${name}`} name={name} type={type} required={required} value={form[name]} onChange={onFieldChange} /></div>
  return <section className="section-pad tinted">
    <div className="container">
      <div className="section-head center">
        <div className="eyebrow" style={{ justifyContent: 'center' }}>{vi ? 'Form Gửi Yêu Cầu Báo Giá' : 'B2B Inquiry Form'}</div>
        <h2>{vi ? 'Khởi Động Dự Án Của Bạn Ngay Hôm Nay' : 'Start Your Project Today'}</h2>
      </div>
      <div className={styles.referenceForm}>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            {field('full_name', text.fullName, true)}
            {field('job_title', text.jobTitle)}
            {field('company_name', text.company, true)}
            {field('country', text.country, true)}
            {field('email', text.corporateEmail, true, 'email')}
            {field('whatsapp_number', text.whatsappNumber, false, 'tel')}
            <div className="form-field full"><label>{text.interested}</label><div className="check-row">{speciesOptions.map((species) => <label key={species}><input type="checkbox" checked={form.interested_species.includes(species)} onChange={() => onSpeciesChange(species)} />{species === 'Other Seafood' && vi ? 'Mặt hàng khác' : species}</label>)}</div></div>
            <div className="form-field full"><label htmlFor="contact-port">{vi ? 'Cảng Đích Đến' : 'Target Destination Port'}</label><input id="contact-port" name="destination_port" value={form.destination_port} onChange={onFieldChange} /></div>
            <div className="form-field full"><label htmlFor="contact-message">{vi ? 'Nội Dung Tin Nhắn / Quy Cách Yêu Cầu' : 'Your Message / Specifications'}</label><textarea id="contact-message" rows="4" name="message" value={form.message} onChange={onFieldChange} /></div>
            <div className="form-field full"><label>{vi ? 'Đính Kèm File Quy Cách / Thiết Kế' : 'Upload Spec Sheet / Artwork'}</label><label className="file-drop"><input ref={fileRef} type="file" accept=".pdf,.xls,.xlsx" style={{ display: 'none' }} onChange={(event) => setFile(event.target.files?.[0] || null)} /><i className="bi bi-cloud-arrow-up" style={{ fontSize: '1.4rem', display: 'block', marginBottom: 6 }} />{file?.name || (vi ? 'Nhấn để chọn tệp' : 'Click to choose a file')}</label></div>
          </div>
          <button type="submit" className="btn btn-gold btn-block" style={{ marginTop: 22 }} disabled={submitting}>{submitting ? text.sending : (vi ? 'Gửi Yêu Cầu Báo Giá' : 'Send Inquiry')}</button>
          <p className="form-note" style={{ textAlign: 'center' }}>{vi ? 'Bạn sẽ nhận được email xác nhận tự động và báo giá chi tiết trong vòng 24 giờ.' : 'You will receive an automatic confirmation email, and a detailed quote within 24 hours.'}</p>
          {result.message ? <Alert severity={result.type}>{result.message}</Alert> : null}
        </form>
      </div>
    </div>
  </section>
}
