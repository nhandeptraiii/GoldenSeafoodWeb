import { HeroSection } from '../../components/Home/HeroSection'
import { WhySection } from '../../components/Home/WhySection'
import { CategorySection } from '../../components/Home/CategorySection'
import { ValueChainSection } from '../../components/Home/ValueChainSection'
import styles from './HomePage.module.scss'

export function HomePage() {
  return (
    <div className={styles.home}>
      <HeroSection />
      <WhySection />
      <CategorySection />
      <ValueChainSection />
    </div>
  )
}
