import Navbar from '@components/common/Navbar'
import Footer from '@components/common/Footer'
import Hero from '@components/sections/Hero'
import Projects from '@components/sections/Projects'
import Skills from '@components/sections/Skills'
import Contact from '@components/sections/Contact'

const Home = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default Home
