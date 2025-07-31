
import banner from '../../assets/anh/slider.webp';

const HeroSection = () => {
  return (
    <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400">
      <img src={banner} alt="" />
    </div>
  );
};

export default HeroSection;