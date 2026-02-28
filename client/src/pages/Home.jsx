import Hero from '../components/Hero'
import NewArrivals from '../components/NewArrivals'
import FeaturedCollection from '../components/FeaturedCollection'
import About from '../components/About'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <main className="bg-[#050505] pt-[70px] sm:pt-[76px]">
        <Hero />
        <NewArrivals />
        <FeaturedCollection />
        <About />
      </main>
      <Footer />
    </>
  )
}

export default Home