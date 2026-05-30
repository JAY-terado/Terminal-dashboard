'use client';

import { Swiper, SwiperSlide, Pagination } from '@core/ui/carousel/carousel';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import { motion } from 'motion/react';
import 'swiper/css';
import 'swiper/css/pagination';

const images = [
  {
    src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Modern Architecture',
    description: 'Experience the pinnacle of luxury living in our expertly curated properties.',
  },
  {
    src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Grand Estates',
    description: 'Discover your dream home in our exclusive collection of luxury mansions.',
  },
  {
    src: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    title: 'Elegant Interiors',
    description: 'Details that define sophistication and comfort for your premium lifestyle.',
  },
];

export default function AuthCarousel() {
  return (
    <div className="relative mx-auto aspect-[4/3.37] w-full max-w-[400px] xl:max-w-[500px] 2xl:max-w-[680px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-gray-900/10">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{
          clickable: true,
          bulletClass: 'swiper-pagination-dot',
          bulletActiveClass: 'swiper-pagination-dot-active',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop={true}
        className="h-full w-full login-carousel group"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={img.src}
                alt={img.title}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              
              <div className="absolute bottom-16 left-10 right-10 z-10 text-white text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-2xl font-bold mb-2 text-white">{img.title}</h3>
                  <p className="text-sm text-gray-200 leading-relaxed max-w-[85%]">
                    {img.description}
                  </p>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .login-carousel .swiper-pagination {
          bottom: 30px !important;
          left: 40px !important;
          width: auto !important;
          display: flex;
          gap: 8px;
          z-index: 20;
        }
        .swiper-pagination-dot {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-pagination-dot-active {
          width: 24px;
          background-color: #fff;
        }
      `}</style>
    </div>
  );
}
