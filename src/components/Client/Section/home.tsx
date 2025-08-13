
import HeroSection from './HeroSection'
import ServicesSection from './ServicesSection';
import ProductsSection from '../productSection/ProductsSection';
import BestSaleProduct from '../productSection/bestSaleProduct'
import Footer from './Footer'
import LookBookSection from './LookBookSection'
import NewsSection from './NewsSection'


function Home() {


    return (
        <>
            <div className=" bg-white">
                <HeroSection />
                <ServicesSection />
                <ProductsSection />
                <BestSaleProduct />
                <LookBookSection />
                <NewsSection />
                <Footer />
            </div >
        </>
    )
}

export default Home