import { Box, Typography } from '@mui/material'
import styles from './SectionTitle.module.scss'

export function SectionTitle({ id, eyebrow, title, subtitle, align = 'left' }) {
  return (
    <Box className={`${styles.header} ${styles[align] || ''}`}>
      {eyebrow ? (
        <Typography variant="overline" className={styles.eyebrow}>
          {eyebrow}
        </Typography>
      ) : null}
      <Typography id={id} component="h2" variant="h4" className={styles.title}>
        {title}
      </Typography>
      {subtitle ? (
        <Typography variant="body1" color="text.secondary" className={styles.subtitle}>
          {subtitle}
        </Typography>
      ) : null}
    </Box>
  )
}
