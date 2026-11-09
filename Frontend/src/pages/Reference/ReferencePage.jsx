import { ReferenceMarkup } from './ReferenceMarkup'
const templates = import.meta.glob('./templates/*.html', { query: '?raw', import: 'default', eager: true })
export function ReferencePage({ page, children }) {
  const html = templates[`./templates/${page}.html`] || ''
  const [before, after] = html.split('<!-- REACT_FORM -->')
  return <><ReferenceMarkup html={before} />{children}{after && <ReferenceMarkup html={after} />}</>
}
