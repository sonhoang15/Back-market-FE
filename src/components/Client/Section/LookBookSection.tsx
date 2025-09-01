import anh1 from '../../../assets/anh/234.jpg'
import anh2 from '../../../assets/anh/235.jpg'
import anh3 from '../../../assets/anh/236.jpg'
import anh4 from '../../../assets/anh/237.jpg'


const LookBookSection = () => {
  const collections = [
    {
      title: "FREEDOM | SUMMER '23 COLLECTION",
      image: anh1
    },
    {
      title: "ENJOY YOURSELF | NEW LOOKBOOK 2023",
      image: anh2
    },
    {
      title: "FROSTY | WINTER 2022 COLLECTION",
      image: anh3
    },
    {
      title: "SPECIAL XMAS | HOLIDAY COLLECTION 2022",
      image: anh4
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">LOOK BOOK</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {collections.map((collection, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
              </div>
              <h3 className="text-sm font-semibold text-gray-800 group-hover:text-green-500 transition-colors duration-300">
                {collection.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LookBookSection;