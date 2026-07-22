import { Button } from '@mui/material'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Link } from 'react-router-dom'
import styles from './CTAButton.module.scss'

export function CTAButton({ children, to, variant = 'primary', icon = true }) {
  return (
    <Button
      component={Link}
      to={to}
      className={`${styles.button} ${styles[variant]}`}
      endIcon={icon ? <ArrowForwardRoundedIcon /> : undefined}
    >
      {children}
    </Button>
  )
}
