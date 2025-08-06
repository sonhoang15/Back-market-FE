
import Header from './Section/Header'
import HeroSection from './Section/HeroSection'
import ServicesSection from './Section/ServicesSection';
import ProductsSection from './productSection/ProductsSection';
import BestSaleProduct from './productSection/bestSaleProduct'
import Footer from './Section/Footer'
import LookBookSection from './Section/LookBookSection'
import NewsSection from './Section/NewsSection'


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