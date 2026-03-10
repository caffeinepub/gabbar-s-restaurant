import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { IMAGES } from "../assets/images";
import { OrnamentDivider } from "./HeroSection";

interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
  span?: "tall" | "wide" | "normal";
}

const galleryImages: GalleryImage[] = [
  {
    src: IMAGES.galleryInterior1,
    alt: "Gabbar's restaurant interior",
    caption: "The Royal Dining Hall",
    span: "tall",
  },
  {
    src: IMAGES.galleryBiryani,
    alt: "Dum Biryani — Gabbar's signature",
    caption: "Signature Dum Biryani",
    span: "normal",
  },
  {
    src: IMAGES.galleryStarters,
    alt: "Starters spread at Gabbar's",
    caption: "The Kebab Spread",
    span: "normal",
  },
  {
    src: IMAGES.galleryDining,
    alt: "Gabbar's dining area",
    caption: "An Evening at Gabbar's",
    span: "wide",
  },
  {
    src: IMAGES.galleryMakhani,
    alt: "Butter Chicken Makhani",
    caption: "Murgh Makhani — The Classic",
    span: "normal",
  },
  {
    src: IMAGES.galleryTandoor,
    alt: "Live tandoor at Gabbar's",
    caption: "From Our Clay Tandoor",
    span: "tall",
  },
  {
    src: IMAGES.seekhKebab,
    alt: "Seekh Kebab on skewers",
    caption: "Seekh Kebab — Chef's Pick",
    span: "normal",
  },
  {
    src: IMAGES.chickenBiryani,
    alt: "Dum Biryani in handi",
    caption: "Handi Dum Biryani",
    span: "normal",
  },
  {
    src: IMAGES.butterChicken,
    alt: "Butter chicken closeup",
    caption: "Butter Chicken",
    span: "normal",
  },
  {
    src: IMAGES.dalMakhani,
    alt: "Dal Makhani in serving bowl",
    caption: "Dal Makhani Overnight",
    span: "normal",
  },
];

/* ─── Lightbox ─────────────────────────────────────────────── */
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const current = images[index];

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      data-ocid="gallery.lightbox.modal"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/95 backdrop-blur-md"
      onClick={onClose}
    >
      {/* Close */}
      <button
        type="button"
        data-ocid="gallery.lightbox.close_button"
        onClick={onClose}
        className="absolute top-5 right-5 z-10 p-2 text-cream-text/60 hover:text-ivory hover:bg-saffron/10 rounded-full transition-all"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 font-body text-xs tracking-widest text-cream-text/50 uppercase">
        {index + 1} / {images.length}
      </div>

      {/* Image */}
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative max-w-5xl w-full mx-10 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[75vh] w-full object-contain rounded-sm shadow-2xl shadow-charcoal"
          draggable={false}
        />
        <p className="mt-4 font-body text-sm text-cream-text/70 tracking-wide text-center">
          {current.caption}
        </p>
      </motion.div>

      {/* Prev */}
      <button
        type="button"
        data-ocid="gallery.prev.button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal-mid/80 hover:bg-saffron/20 border border-saffron/20 hover:border-saffron/50 text-cream-text hover:text-saffron rounded-full transition-all"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Next */}
      <button
        type="button"
        data-ocid="gallery.next.button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-charcoal-mid/80 hover:bg-saffron/20 border border-saffron/20 hover:border-saffron/50 text-cream-text hover:text-saffron rounded-full transition-all"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg px-4 py-1">
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={(e) => {
              e.stopPropagation(); /* handled by parent */
            }}
            className={`w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
              i === index
                ? "border-saffron scale-110"
                : "border-transparent opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Gallery Item ─────────────────────────────────────────── */
function GalleryItem({
  image,
  index,
  onClick,
}: {
  image: GalleryImage;
  index: number;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      data-ocid={`gallery.item.${index + 1}`}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-sm border border-saffron/10 hover:border-saffron/40 transition-all duration-300 hover:shadow-2xl hover:shadow-saffron/10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron ${
        image.span === "tall"
          ? "row-span-2"
          : image.span === "wide"
            ? "col-span-2"
            : ""
      }`}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        style={{ minHeight: image.span === "tall" ? "360px" : "180px" }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-4">
        <ZoomIn
          size={24}
          className="text-saffron mb-2 -translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
        />
        <p className="font-body text-xs tracking-widest uppercase text-cream-text/90 px-2 text-center">
          {image.caption}
        </p>
      </div>
    </motion.button>
  );
}

/* ─── Main Section ─────────────────────────────────────────── */
export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const prevImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i - 1 + galleryImages.length) % galleryImages.length,
    );
  }, []);

  const nextImage = useCallback(() => {
    setLightboxIndex((i) =>
      i === null ? null : (i + 1) % galleryImages.length,
    );
  }, []);

  return (
    <section
      id="gallery"
      data-ocid="gallery.section"
      className="relative bg-charcoal py-24 px-4 sm:px-6 lg:px-8"
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <span className="font-body text-xs tracking-[0.3em] uppercase text-saffron/70 mb-3 block">
            — A Glimpse Inside —
          </span>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory font-bold mb-6">
            Our Gallery
          </h2>
          <div className="max-w-lg mx-auto">
            <OrnamentDivider light />
          </div>
          <p className="font-body text-cream-text/70 mt-6 max-w-2xl mx-auto text-base leading-relaxed">
            Immerse yourself in the aromas, colours, and warmth of Gabbar's —
            where every dish tells a story and every visit becomes a memory.
          </p>
        </motion.div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 auto-rows-[180px]">
          {galleryImages.map((img, i) => (
            <GalleryItem
              key={img.src}
              image={img}
              index={i}
              onClick={() => openLightbox(i)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={galleryImages}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>

      {/* Bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />
    </section>
  );
}
