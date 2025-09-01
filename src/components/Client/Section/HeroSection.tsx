
import banner from '../../../assets/anh/slider.webp';

const HeroSection = () => {
  return (
    <div className="relative mt-[7rem] overflow-hidden bg-gradient-to-r from-orange-200 via-orange-300 to-orange-400">
      <img
        src={banner}
        alt=""
        className="w-full h-auto object-cover md:h-[400px] lg:h-[970px]"
      />
    </div>
  );
};

export default HeroSection;