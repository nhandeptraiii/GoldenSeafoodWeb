import { ReferenceMarkup } from './ReferenceMarkup'
import { CategorySection } from '../../components/Home/CategorySection'
const templates = import.meta.glob('./templates/*.html', { query: '?raw', import: 'default', eager: true })
export function ReferencePage({ page, children }) {
  const html = templates[`./templates/${page}.html`] || ''
  if (page === 'index') {
    const [before, after] = html.split('<!-- REACT_CATEGORIES -->')
    return <><ReferenceMarkup html={before} /><CategorySection /><ReferenceMarkup html={after || ''} /></>
  }
  const [before, after] = html.split('<!-- REACT_FORM -->')
  return <><ReferenceMarkup html={before} />{children}{after && <ReferenceMarkup html={after} />}</>
}
