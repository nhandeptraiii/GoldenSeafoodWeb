import { Badge, Fab } from '@mui/material'
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined'
import { useSelector } from 'react-redux'
import styles from './InquiryBasketFab.module.scss'

export function InquiryBasketFab({ onClick }) {
  const count = useSelector((state) => state.inquiry.items.length)

  return (
    <Fab color="primary" aria-label="inquiry-basket" className={styles.fab} onClick={onClick}>
      <Badge color="secondary" badgeContent={count} max={99}>
        <RequestQuoteOutlinedIcon />
      </Badge>
    </Fab>
  )
}
