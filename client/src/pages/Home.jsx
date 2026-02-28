import Hero from '../components/Hero'
import NewArrivals from '../components/NewArrivals'
import FeaturedCollection from '../components/FeaturedCollection'
import About from '../components/About'

function Home() {
  return (
    <main>
      <Hero />
      <NewArrivals />
      <FeaturedCollection />
      <About />
    </main>
  )
}

export default Home