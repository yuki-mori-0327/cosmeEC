import { motion, useInView } from "motion/react";
import { useRef, useState, useEffect, createContext, useContext } from "react";
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Heart,
  Star,
  ArrowRight,
  Plus,
  ChevronRight,
  Grid3x3,
  LayoutList,
  ChevronDown,
  Minus,
  Trash2,
} from "lucide-react";

type Page = "home" | "collections" | "skin-ritual" | "color-drama" | "fragrance" | "brand-story" | "new-arrivals" | "gift-sets" | "faq" | "shipping" | "returns" | "contact" | "about" | "sustainability" | "careers" | "press" | "privacy";

type CartItem = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  img: string;
  qty: number;
};

type WishItem = {
  id: number;
  name: string;
  subtitle: string;
  price: string;
  img: string;
  category: string;
};

const NavCtx = createContext<{
  page: Page;
  setPage: (p: Page) => void;
  initialCategory: string;
  setInitialCategory: (c: string) => void;
  cart: CartItem[];
  addToCart: (product: Omit<CartItem, "qty">) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, delta: number) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  wishlist: WishItem[];
  toggleWish: (product: WishItem) => void;
  wishOpen: boolean;
  setWishOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
}>({
  page: "home",
  setPage: () => {},
  initialCategory: "すべて",
  setInitialCategory: () => {},
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  cartOpen: false,
  setCartOpen: () => {},
  wishlist: [],
  toggleWish: () => {},
  wishOpen: false,
  setWishOpen: () => {},
  searchOpen: false,
  setSearchOpen: () => {},
});

const PRODUCTS = [
  {
    id: 1,
    name: "ルミナス セラム",
    subtitle: "光輝くエッセンス",
    price: "¥12,800",
    category: "スキンケア",
    rating: 4.9,
    reviews: 238,
    badge: "ベストセラー",
    img: "https://images.unsplash.com/photo-1764694071462-db50e50a3925?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 2,
    name: "ヴェルヴェット ルージュ",
    subtitle: "リッチモイストリップ",
    price: "¥4,500",
    category: "リップ",
    rating: 4.8,
    reviews: 412,
    badge: "新作",
    img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 3,
    name: "グロウ プライマー",
    subtitle: "完璧な仕上がりのベース",
    price: "¥8,200",
    category: "ベースメイク",
    rating: 4.7,
    reviews: 156,
    badge: null,
    img: "https://images.unsplash.com/photo-1777840347880-747242e0db00?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 4,
    name: "アイパレット「夕暮れ」",
    subtitle: "14色のドラマティックカラー",
    price: "¥9,800",
    category: "アイメイク",
    rating: 4.9,
    reviews: 321,
    badge: "限定",
    img: "https://images.unsplash.com/photo-1526045405698-cf8b8acc4aaf?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 5,
    name: "ローズ ミスト トナー",
    subtitle: "うるおいチャージミスト",
    price: "¥6,300",
    category: "スキンケア",
    rating: 4.6,
    reviews: 89,
    badge: null,
    img: "https://images.unsplash.com/photo-1767379462135-1b4eac978a95?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 6,
    name: "シルク ファンデーション",
    subtitle: "第二の肌、自然なカバー",
    price: "¥11,500",
    category: "ベースメイク",
    rating: 4.8,
    reviews: 274,
    badge: "人気",
    img: "https://images.unsplash.com/photo-1706067003003-f5d8d518c00b?w=600&h=700&fit=crop&auto=format",
  },
];

const MARQUEE_ITEMS = [
  "FREE SHIPPING ON ¥10,000+",
  "LUXURY BEAUTY",
  "CLEAN FORMULAS",
  "CRUELTY FREE",
  "VEGAN",
  "SUSTAINABLE PACKAGING",
];

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scrolled;
}

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= Math.floor(rating) ? "fill-[#c9a84c] text-[#c9a84c]" : "text-white/20"}
        />
      ))}
    </div>
  );
}

function Nav() {
  const scrolled = useScrolled();
  const [open, setOpen] = useState(false);
  const { page, setPage, setInitialCategory, cart, setCartOpen, wishlist, setWishOpen, setSearchOpen } = useContext(NavCtx);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const NAV_ITEMS: { label: string; category: string }[] = [
    { label: "スキンケア", category: "スキンケア" },
    { label: "メイクアップ", category: "メイクアップ" },
    { label: "フレグランス", category: "フレグランス" },
    { label: "コレクション", category: "すべて" },
  ];

  const handleNav = (category: string) => {
    setInitialCategory(category);
    setPage("collections");
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(12,8,16,0.92)"
            : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.12)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setOpen(true)}
              className="md:hidden text-foreground/70 hover:text-primary transition-colors"
            >
              <Menu size={20} />
            </button>
            <nav className="hidden md:flex gap-7 text-xs tracking-[0.18em] uppercase">
              {NAV_ITEMS.map(({ label, category }) => (
                <a
                  key={label}
                  href="#"
                  onClick={(e) => { e.preventDefault(); handleNav(category); }}
                  className="text-foreground/60 hover:text-primary transition-colors duration-300 cursor-pointer"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <button
            onClick={() => setPage("home")}
            className="absolute left-1/2 -translate-x-1/2 font-['Cormorant_Garamond'] text-xl tracking-[0.25em] text-foreground font-medium"
          >
            LUMIÈRE
          </button>

          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen(true)} className="text-foreground/60 hover:text-primary transition-colors">
              <Search size={18} />
            </button>
            <button onClick={() => setWishOpen(true)} className="relative text-foreground/60 hover:text-primary transition-colors">
              <Heart size={18} className={wishlist.length > 0 ? "fill-accent text-accent" : ""} />
              {wishlist.length > 0 && (
                <motion.span
                  key={wishlist.length}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                >
                  {wishlist.length}
                </motion.span>
              )}
            </button>
            <button onClick={() => setCartOpen(true)} className="relative text-foreground/60 hover:text-primary transition-colors">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-accent text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-medium"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.nav
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 200 }}
            className="relative w-72 h-full bg-card flex flex-col p-8 gap-6"
          >
            <button
              onClick={() => setOpen(false)}
              className="self-end text-foreground/40 hover:text-primary"
            >
              <X size={20} />
            </button>
            <div className="font-['Cormorant_Garamond'] text-2xl tracking-widest mb-4">LUMIÈRE</div>
            {[
              { label: "スキンケア", category: "スキンケア" },
              { label: "メイクアップ", category: "メイクアップ" },
              { label: "フレグランス", category: "フレグランス" },
              { label: "コレクション", category: "すべて" },
              { label: "新作", category: "すべて" },
              { label: "セール", category: "すべて" },
            ].map(({ label, category }) => (
              <a
                key={label}
                href="#"
                onClick={(e) => { e.preventDefault(); setOpen(false); handleNav(category); }}
                className="text-foreground/70 hover:text-primary transition-colors text-sm tracking-widest uppercase border-b border-border pb-4 cursor-pointer"
              >
                {label}
              </a>
            ))}
          </motion.nav>
        </motion.div>
      )}
    </>
  );
}

function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="overflow-hidden py-3 border-y border-border/40 bg-secondary/30">
      <div className="marquee-track flex gap-12 whitespace-nowrap">
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground flex items-center gap-12"
          >
            {item}
            <span className="text-primary/40">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  const { setPage } = useContext(NavCtx);
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background gradient orbs */}
      <div
        className="orb-1 absolute w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none"
        style={{ background: "#c9a84c", top: "-10%", right: "-5%" }}
      />
      <div
        className="orb-2 absolute w-[400px] h-[400px] rounded-full blur-[110px] pointer-events-none"
        style={{ background: "#a07828", bottom: "10%", left: "10%" }}
      />
      <div
        className="absolute w-[250px] h-[250px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{ background: "#f5e09a", top: "40%", left: "30%" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6"
            >
              2024 New Collection
            </motion.p>

            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-foreground"
              >
                美しさは
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-2">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="font-['Cormorant_Garamond'] italic text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] gold-shimmer"
              >
                あなたの中に
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="font-['Cormorant_Garamond'] text-5xl md:text-7xl lg:text-8xl font-medium leading-[0.95] text-foreground"
              >
                宿っている
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-10 font-['Jost'] font-light"
            >
              自然由来の成分と最先端のサイエンスが融合した、
              あなたの内側から輝きを引き出すラグジュアリービューティー。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.05 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={() => setPage("collections")}
                className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:shadow-[0_0_40px_rgba(201,168,76,0.4)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  コレクションを見る
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="absolute inset-0 bg-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
              </button>
              <button
                onClick={() => setPage("new-arrivals")}
                className="px-8 py-4 border border-border text-foreground/70 hover:text-primary hover:border-primary/40 text-xs tracking-[0.2em] uppercase transition-all duration-300"
              >
                新作を見る
              </button>
            </motion.div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center"
          >
            <div className="float-anim relative">
              <div
                className="absolute inset-0 rounded-[2px] blur-[60px] opacity-30"
                style={{ background: "linear-gradient(135deg, #c9a84c, #f5e09a)" }}
              />
              <img
                src="https://images.unsplash.com/photo-1600634999623-864991678406?w=560&h=700&fit=crop&auto=format"
                alt="Luxury perfume bottle"
                className="relative w-full max-w-sm object-cover"
                style={{ aspectRatio: "4/5" }}
              />
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="absolute bottom-12 -left-4 md:-left-12 bg-card/90 backdrop-blur-md border border-border/60 p-4 max-w-[160px]"
            >
              <p className="text-[9px] tracking-widest uppercase text-muted-foreground mb-1">今月の人気 No.1</p>
              <p className="font-['Cormorant_Garamond'] text-sm text-foreground">ルミナス セラム</p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={4.9} />
                <span className="text-[10px] text-muted-foreground">4.9</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="absolute top-16 -right-4 md:-right-8 bg-primary/10 backdrop-blur-md border border-primary/20 px-4 py-3"
            >
              <p className="text-[9px] tracking-widest uppercase text-primary">Cruelty Free</p>
              <p className="text-[9px] tracking-widest uppercase text-primary/60">Vegan · Clean</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground">スクロール</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary/60 to-transparent scroll-line" />
      </motion.div>
    </section>
  );
}

function Collections() {
  const { setPage } = useContext(NavCtx);
  const collections: { title: string; subtitle: string; desc: string; img: string; tag: string; col: string; page: Page }[] = [
    {
      title: "スキンリチュアル",
      subtitle: "毎日の儀式",
      desc: "肌本来の美しさを引き出す、上質なスキンケアライン",
      img: "https://images.unsplash.com/photo-1782034493928-d8410275cfcd?w=700&h=900&fit=crop&auto=format",
      tag: "SKINCARE",
      col: "col-span-1 md:row-span-2",
      page: "skin-ritual",
    },
    {
      title: "カラードラマ",
      subtitle: "色彩の魔法",
      desc: "大胆で繊細な発色が、あなたの個性を際立たせる",
      img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=700&h=400&fit=crop&auto=format",
      tag: "MAKEUP",
      col: "col-span-1",
      page: "color-drama",
    },
    {
      title: "センシュアル フレグランス",
      subtitle: "香りの物語",
      desc: "記憶に刻まれる、唯一無二の香りを纏う",
      img: "https://images.unsplash.com/photo-1591375462469-62f189694738?w=700&h=400&fit=crop&auto=format",
      tag: "FRAGRANCE",
      col: "col-span-1",
      page: "fragrance",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <FadeUp className="mb-12">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Collections</p>
        <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-foreground">
          厳選された
          <span className="italic text-primary"> コレクション</span>
        </h2>
      </FadeUp>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collections.map((c, i) => (
          <FadeUp key={c.title} delay={i * 0.15} className={c.col}>
            <div onClick={() => setPage(c.page)} className="group relative overflow-hidden cursor-pointer h-full min-h-[280px] md:min-h-[320px]">
              <img
                src={c.img}
                alt={c.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <p className="text-[9px] tracking-[0.4em] uppercase text-primary/80 mb-2">{c.tag}</p>
                <h3 className="font-['Cormorant_Garamond'] text-2xl text-white mb-1">{c.title}</h3>
                <p className="text-xs text-white/60 font-['Jost'] font-light mb-4">{c.desc}</p>
                <button
                  onClick={() => setPage(c.page)}
                  className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-primary hover:gap-3 transition-all duration-300"
                >
                  詳しく見る <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: (typeof PRODUCTS)[0]; index: number }) {
  const [added, setAdded] = useState(false);
  const { addToCart, wishlist, toggleWish } = useContext(NavCtx);
  const liked = wishlist.some((i) => i.id === product.id);

  const handleAdd = () => {
    addToCart({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <FadeUp delay={index * 0.08}>
      <div className="group relative flex flex-col">
        <div className="relative overflow-hidden bg-card aspect-[3/4] mb-4">
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          {product.badge && (
            <span className="absolute top-3 left-3 bg-accent text-white text-[9px] tracking-[0.2em] uppercase px-2.5 py-1">
              {product.badge}
            </span>
          )}
          <button
            onClick={() => toggleWish({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img, category: product.category })}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-colors"
          >
            <Heart
              size={14}
              className={liked ? "fill-accent text-accent" : "text-white/70"}
            />
          </button>
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out p-4">
            <button
              onClick={handleAdd}
              className="w-full py-3 bg-primary text-primary-foreground text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 hover:bg-accent transition-colors duration-300"
            >
              {added ? (
                "カートに追加済み ✓"
              ) : (
                <>
                  <Plus size={12} /> カートに追加
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
            {product.category}
          </p>
          <h3 className="font-['Cormorant_Garamond'] text-base text-foreground mb-0.5">{product.name}</h3>
          <p className="text-xs text-muted-foreground font-light mb-2">{product.subtitle}</p>
          <div className="flex items-center justify-between">
            <span className="text-primary font-medium text-sm">{product.price}</span>
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.rating} />
              <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
            </div>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}

function NewArrivals() {
  const { setPage, setInitialCategory } = useContext(NavCtx);
  const [activeFilter, setActiveFilter] = useState("すべて");
  const filters = ["すべて", "スキンケア", "ベースメイク", "リップ", "アイメイク"];

  const filtered =
    activeFilter === "すべて"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <section className="py-24 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-6">
        <FadeUp className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">New Arrivals</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-foreground">
              新着アイテム
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-x-6 gap-y-10">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <FadeUp className="text-center mt-14">
          <button
            onClick={() => { setInitialCategory("すべて"); setPage("collections"); }}
            className="group inline-flex items-center gap-3 border border-border/40 hover:border-primary/50 px-10 py-4 text-xs tracking-[0.25em] uppercase text-foreground/70 hover:text-primary transition-all duration-300"
          >
            すべての商品を見る
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

function BrandStory() {
  const { setPage } = useContext(NavCtx);
  return (
    <section className="relative overflow-hidden py-32">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #d4967a 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <FadeUp className="relative">
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?w=600&h=700&fit=crop&auto=format"
              alt="Luxury cream product"
              className="w-full object-cover"
              style={{ aspectRatio: "5/6" }}
            />
          </div>
          <div
            className="absolute -bottom-6 -right-6 w-48 h-48 border border-primary/20 pointer-events-none"
            style={{ zIndex: -1 }}
          />
          <motion.div
            className="absolute -top-6 -left-6 w-32 h-32"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path
                id="circle-text"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                fill="none"
              />
              <text className="fill-primary/50" style={{ fontSize: "10px", letterSpacing: "3px" }}>
                <textPath href="#circle-text">LUMIÈRE · BEAUTY · LUXURY · CLEAN ·</textPath>
              </text>
            </svg>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Our Story</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-foreground leading-tight mb-6">
            自然と科学の
            <br />
            <span className="italic text-primary">完璧な調和</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-loose font-['Jost'] font-light mb-6">
            LUMIÈREは、フランスのプロヴァンスで生まれたラグジュアリービューティーブランドです。
            自然由来の成分にこだわり、肌に優しく、地球にも優しい製品作りを続けています。
          </p>
          <p className="text-muted-foreground text-sm leading-loose font-['Jost'] font-light mb-10">
            すべての製品はクルエルティフリーで、ヴィーガン認定済み。
            持続可能な農業から採取された成分を使用し、100%リサイクル可能なパッケージにこだわっています。
          </p>
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { num: "15+", label: "年の研究" },
              { num: "98%", label: "天然成分" },
              { num: "50+", label: "国で販売" },
            ].map((stat) => (
              <div key={stat.label} className="border-l border-primary/30 pl-4">
                <p className="font-['Cormorant_Garamond'] text-2xl text-primary">{stat.num}</p>
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setPage("brand-story")}
            className="group flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-primary hover:gap-4 transition-all duration-300"
          >
            ブランドストーリーを読む <ArrowRight size={14} />
          </button>
        </FadeUp>
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="relative overflow-hidden py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(245,224,154,0.05) 50%, rgba(160,120,40,0.10) 100%)",
        }}
      />
      <div className="absolute inset-0 border-y border-primary/10" />

      <FadeUp className="relative max-w-2xl mx-auto px-6 text-center">
        <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Newsletter</p>
        <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-foreground mb-4">
          美しさの<span className="italic text-primary">秘密</span>を受け取る
        </h2>
        <p className="text-muted-foreground text-sm font-['Jost'] font-light mb-8">
          新作情報、限定オファー、ビューティーtipsをいち早くお届けします。
          登録で初回購入10%OFF。
        </p>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-4 px-8 border border-primary/40 text-primary text-sm tracking-widest"
          >
            ご登録ありがとうございます ✦
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="メールアドレスを入力"
              className="flex-1 bg-muted/40 border border-border/60 px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/50 transition-colors font-['Jost'] font-light"
            />
            <button
              type="submit"
              className="group relative overflow-hidden px-8 py-4 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase whitespace-nowrap hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] transition-shadow"
            >
              <span className="relative z-10">登録する</span>
              <span className="absolute inset-0 bg-accent translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out" />
            </button>
          </form>
        )}
      </FadeUp>
    </section>
  );
}

function Footer() {
  const { setPage, setInitialCategory } = useContext(NavCtx);

  const handleShoppingLink = (label: string) => {
    const map: Record<string, { page: Page; category: string }> = {
      "スキンケア":   { page: "collections", category: "スキンケア" },
      "メイクアップ": { page: "collections", category: "メイクアップ" },
      "フレグランス": { page: "collections", category: "フレグランス" },
      "ギフトセット": { page: "gift-sets", category: "すべて" },
    };
    const dest = map[label];
    if (dest) { setInitialCategory(dest.category); setPage(dest.page); }
  };
  return (
    <footer className="border-t border-border/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="font-['Cormorant_Garamond'] text-2xl tracking-[0.3em] text-foreground mb-4">
              LUMIÈRE
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed max-w-[200px]">
              自然と科学の調和から生まれた、ラグジュアリービューティー。
            </p>
          </div>
          {[
            {
              title: "ショッピング",
              links: ["スキンケア", "メイクアップ", "フレグランス", "ギフトセット"],
              shopping: true,
            },
            {
              title: "サポート",
              links: ["よくある質問", "配送について", "返品・交換", "お問い合わせ"],
              shopping: false,
              support: true,
            },
            {
              title: "ブランド",
              links: ["私たちについて", "サステナビリティ", "採用情報", "プレス"],
              shopping: false,
              brand: true,
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/80 mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      onClick={
                        col.shopping ? (e) => { e.preventDefault(); handleShoppingLink(link); }
                        : (col as any).support && link === "よくある質問" ? (e) => { e.preventDefault(); setPage("faq"); }
                        : (col as any).support && link === "配送について" ? (e) => { e.preventDefault(); setPage("shipping"); }
                        : (col as any).support && link === "返品・交換" ? (e) => { e.preventDefault(); setPage("returns"); }
                        : (col as any).support && link === "お問い合わせ" ? (e) => { e.preventDefault(); setPage("contact"); }
                        : (col as any).brand && link === "私たちについて" ? (e) => { e.preventDefault(); setPage("about"); }
                        : (col as any).brand && link === "サステナビリティ" ? (e) => { e.preventDefault(); setPage("sustainability"); }
                        : (col as any).brand && link === "採用情報" ? (e) => { e.preventDefault(); setPage("careers"); }
                        : (col as any).brand && link === "プレス" ? (e) => { e.preventDefault(); setPage("press"); }
                        : undefined
                      }
                      className="text-xs text-muted-foreground hover:text-primary transition-colors font-['Jost'] font-light"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-muted-foreground tracking-widest">
            © 2024 LUMIÈRE BEAUTY. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            {["プライバシーポリシー", "利用規約", "特定商取引法"].map((item) => (
              <a
                key={item}
                href="#"
                onClick={item === "プライバシーポリシー" ? (e) => { e.preventDefault(); setPage("privacy"); } : undefined}
                className="text-[10px] text-muted-foreground hover:text-primary transition-colors tracking-wider"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

const ALL_COLLECTION_PRODUCTS = [
  ...PRODUCTS,
  {
    id: 7,
    name: "パールグロウ マスク",
    subtitle: "真珠の輝きパックマスク",
    price: "¥7,800",
    category: "スキンケア",
    rating: 4.7,
    reviews: 143,
    badge: "新作",
    img: "https://images.unsplash.com/photo-1670201203129-65c022f0ed8e?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 8,
    name: "ゴールド アイライナー",
    subtitle: "24K ゴールドリキッドライン",
    price: "¥3,800",
    category: "アイメイク",
    rating: 4.6,
    reviews: 198,
    badge: "限定",
    img: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 9,
    name: "ノワール パフューム",
    subtitle: "オードパルファム 50ml",
    price: "¥18,000",
    category: "フレグランス",
    rating: 4.9,
    reviews: 87,
    badge: "ベストセラー",
    img: "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 10,
    name: "サテン リップライナー",
    subtitle: "なめらかなリップライン",
    price: "¥2,900",
    category: "リップ",
    rating: 4.5,
    reviews: 312,
    badge: null,
    img: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 11,
    name: "クリスタル ハイライター",
    subtitle: "立体感を生む光のハイライト",
    price: "¥5,600",
    category: "ベースメイク",
    rating: 4.8,
    reviews: 224,
    badge: "人気",
    img: "https://images.unsplash.com/photo-1706067003003-f5d8d518c00b?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: 12,
    name: "ローズ オイル セラム",
    subtitle: "バラオイル濃縮美容液",
    price: "¥14,500",
    category: "スキンケア",
    rating: 4.9,
    reviews: 176,
    badge: null,
    img: "https://images.unsplash.com/photo-1767379462135-1b4eac978a95?w=600&h=700&fit=crop&auto=format",
  },
];

const SORT_OPTIONS = ["おすすめ順", "新着順", "価格が低い順", "価格が高い順", "レビュー評価順"];
const CATEGORIES = ["すべて", "スキンケア", "メイクアップ", "ベースメイク", "リップ", "アイメイク", "フレグランス"];
const MAKEUP_CATS = ["ベースメイク", "リップ", "アイメイク"];

function CollectionsPage() {
  const { setPage, initialCategory, addToCart } = useContext(NavCtx);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("おすすめ順");
  const [showSort, setShowSort] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const filtered = ALL_COLLECTION_PRODUCTS.filter((p) =>
    activeCategory === "すべて" ? true
    : activeCategory === "メイクアップ" ? MAKEUP_CATS.includes(p.category)
    : p.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/[¥,]/g, ""));
    const priceB = parseInt(b.price.replace(/[¥,]/g, ""));
    if (sortBy === "価格が低い順") return priceA - priceB;
    if (sortBy === "価格が高い順") return priceB - priceA;
    if (sortBy === "レビュー評価順") return b.rating - a.rating;
    if (sortBy === "新着順") return b.id - a.id;
    return 0;
  });

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Page Hero */}
      <div className="relative overflow-hidden py-20 border-b border-border/30">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 60px)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none"
          style={{ background: "#c9a84c", opacity: 0.08 }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <button
            onClick={() => setPage("home")}
            className="relative z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            ← ホームに戻る
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Collections</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-4">
              すべての<span className="italic gold-shimmer">コレクション</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light max-w-lg">
              自然と科学の融合から生まれた、厳選されたラグジュアリービューティーアイテム。
              あなたの美しさを引き出す、最高品質のコスメをご覧ください。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            <span className="text-[10px] tracking-widest text-muted-foreground">{sorted.length}件</span>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 border border-border/40 px-4 py-2 text-[10px] tracking-widest uppercase text-muted-foreground hover:border-primary/40 hover:text-primary transition-all"
              >
                {sortBy} <ChevronDown size={11} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1 bg-card border border-border/60 z-20 min-w-[160px]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => { setSortBy(opt); setShowSort(false); }}
                      className={`w-full text-left px-4 py-3 text-[10px] tracking-widest uppercase hover:bg-primary/10 hover:text-primary transition-colors ${sortBy === opt ? "text-primary" : "text-muted-foreground"}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* View toggle */}
            <div className="flex border border-border/40">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <Grid3x3 size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
            {sorted.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border/30">
            {sorted.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="flex gap-6 py-6 group"
              >
                <div className="relative w-24 h-28 flex-shrink-0 overflow-hidden bg-card">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-1 left-1 bg-accent text-white text-[8px] tracking-widest uppercase px-1.5 py-0.5">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-1">{product.category}</p>
                  <h3 className="font-['Cormorant_Garamond'] text-xl text-foreground mb-0.5">{product.name}</h3>
                  <p className="text-xs text-muted-foreground font-['Jost'] font-light mb-3">{product.subtitle}</p>
                  <div className="flex items-center gap-3">
                    <StarRating rating={product.rating} />
                    <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-center gap-3">
                  <span className="text-primary font-medium text-lg font-['Cormorant_Garamond']">{product.price}</span>
                  <button
                    onClick={() => addToCart({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img })}
                    className="px-5 py-2 bg-primary text-primary-foreground text-[10px] tracking-widest uppercase hover:bg-accent transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={11} /> カートへ
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {sorted.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-muted-foreground text-sm tracking-widest">該当する商品がありません</p>
          </div>
        )}
      </div>
    </div>
  );
}

const COLLECTION_DETAILS = {
  "skin-ritual": {
    title: "スキンリチュアル",
    subtitle: "SKIN RITUAL",
    tagline: "毎日の儀式で、肌を変える",
    desc: "自然由来の最高級成分を厳選し、科学的に処方されたLUMIÈREのスキンケアライン。あなたの肌が本来持つ再生力を最大限に引き出し、光輝く素肌へと導きます。毎朝・毎夜のルーティンを、特別な美容儀式に変えましょう。",
    heroImg: "https://images.unsplash.com/photo-1777840347880-747242e0db00?w=1200&h=700&fit=crop&auto=format",
    accentColor: "#c9a84c",
    features: ["ヴィーガン認定", "皮膚科テスト済", "パラベンフリー", "100%天然香料"],
    products: [1, 3, 5, 7, 9, 12].map((id) =>
      [...PRODUCTS, ...([
        { id: 7, name: "パールグロウ マスク", subtitle: "真珠の輝きパックマスク", price: "¥7,800", category: "スキンケア", rating: 4.7, reviews: 143, badge: "新作", img: "https://images.unsplash.com/photo-1670201203129-65c022f0ed8e?w=600&h=700&fit=crop&auto=format" },
        { id: 9, name: "ノワール パフューム", subtitle: "オードパルファム 50ml", price: "¥18,000", category: "フレグランス", rating: 4.9, reviews: 87, badge: "ベストセラー", img: "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?w=600&h=700&fit=crop&auto=format" },
        { id: 12, name: "ローズ オイル セラム", subtitle: "バラオイル濃縮美容液", price: "¥14,500", category: "スキンケア", rating: 4.9, reviews: 176, badge: null, img: "https://images.unsplash.com/photo-1767379462135-1b4eac978a95?w=600&h=700&fit=crop&auto=format" },
      ])].find((p) => p.id === id)
    ).filter(Boolean),
    steps: [
      { step: "01", name: "クレンジング", desc: "やさしく汚れを落とし、毛穴を清潔に" },
      { step: "02", name: "トナー", desc: "肌のpHバランスを整え、次のケアを吸収しやすく" },
      { step: "03", name: "セラム", desc: "高濃度の美容成分を肌の奥深くに届ける" },
      { step: "04", name: "モイスチャライザー", desc: "うるおいをしっかり閉じ込め、バリア機能を強化" },
    ],
  },
  "color-drama": {
    title: "カラードラマ",
    subtitle: "COLOR DRAMA",
    tagline: "色彩で、あなただけの物語を描く",
    desc: "大胆にして繊細、華やかにして上品。LUMIÈREのメイクアップコレクションは、あなたの内側にある創造性を解き放ちます。一瞬で気分を変える発色、長時間続く美しさ、そして肌に優しいクリーンな処方。色は、最もパーソナルな表現手段です。",
    heroImg: "https://images.unsplash.com/photo-1526045405698-cf8b8acc4aaf?w=1200&h=700&fit=crop&auto=format",
    accentColor: "#b5446e",
    features: ["高発色処方", "12時間持続", "クルエルティフリー", "ヴィーガン認定"],
    products: [2, 4, 6, 8, 10, 11].map((id) =>
      [...PRODUCTS, ...([
        { id: 8, name: "ゴールド アイライナー", subtitle: "24K ゴールドリキッドライン", price: "¥3,800", category: "アイメイク", rating: 4.6, reviews: 198, badge: "限定", img: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=600&h=700&fit=crop&auto=format" },
        { id: 10, name: "サテン リップライナー", subtitle: "なめらかなリップライン", price: "¥2,900", category: "リップ", rating: 4.5, reviews: 312, badge: null, img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&h=700&fit=crop&auto=format" },
        { id: 11, name: "クリスタル ハイライター", subtitle: "立体感を生む光のハイライト", price: "¥5,600", category: "ベースメイク", rating: 4.8, reviews: 224, badge: "人気", img: "https://images.unsplash.com/photo-1706067003003-f5d8d518c00b?w=600&h=700&fit=crop&auto=format" },
      ])].find((p) => p.id === id)
    ).filter(Boolean),
    steps: [
      { step: "01", name: "ベース", desc: "シルクのような肌なじみのプライマーで土台を整える" },
      { step: "02", name: "ファンデーション", desc: "第二の肌のように自然にカバー" },
      { step: "03", name: "アイメイク", desc: "目元に深みと輝きを加えて表情を引き立てる" },
      { step: "04", name: "リップ", desc: "仕上げは唇に鮮やかな色と艶をプラス" },
    ],
  },
  "fragrance": {
    title: "センシュアル フレグランス",
    subtitle: "SENSUAL FRAGRANCE",
    tagline: "香りは、魂の言葉",
    desc: "グラースの花畑、東洋のスパイス、深海の塩気——世界中から集めた希少な原料が織りなす、LUMIÈREのフレグランスコレクション。香りは記憶と感情に直接語りかけます。あなたの存在感を、目には見えない香りで表現してください。",
    heroImg: "https://images.unsplash.com/photo-1591375462469-62f189694738?w=1200&h=700&fit=crop&auto=format",
    accentColor: "#7a5aaa",
    features: ["グラース産花原料", "アルコールフリーオプション", "持続時間8〜12h", "ガラス製ボトル"],
    products: [9, 1, 5, 12].map((id) =>
      [...PRODUCTS, ...([
        { id: 9, name: "ノワール パフューム", subtitle: "オードパルファム 50ml", price: "¥18,000", category: "フレグランス", rating: 4.9, reviews: 87, badge: "ベストセラー", img: "https://images.unsplash.com/photo-1774682060997-f8959850a7d4?w=600&h=700&fit=crop&auto=format" },
        { id: 12, name: "ローズ オイル セラム", subtitle: "バラオイル濃縮美容液", price: "¥14,500", category: "スキンケア", rating: 4.9, reviews: 176, badge: null, img: "https://images.unsplash.com/photo-1767379462135-1b4eac978a95?w=600&h=700&fit=crop&auto=format" },
      ])].find((p) => p.id === id)
    ).filter(Boolean),
    steps: [
      { step: "01", name: "トップノート", desc: "最初の10〜15分に感じる軽やかな印象" },
      { step: "02", name: "ミドルノート", desc: "香りの核心、30分〜数時間持続する本体" },
      { step: "03", name: "ベースノート", desc: "時間とともに深まる、最も長持ちする香り" },
      { step: "04", name: "アプリケーション", desc: "手首・首筋・耳の後ろに軽く一プッシュ" },
    ],
  },
} as const;

function CollectionDetailPage({ collectionKey }: { collectionKey: "skin-ritual" | "color-drama" | "fragrance" }) {
  const { setPage, addToCart } = useContext(NavCtx);
  const data = COLLECTION_DETAILS[collectionKey];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img
          src={data.heroImg}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/20" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top right, ${data.accentColor}22, transparent 60%)` }}
        />

        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={() => setPage("home")}
              className="relative z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-white/50 hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase mb-3" style={{ color: data.accentColor }}>
              {data.subtitle}
            </p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-white font-medium mb-4 leading-tight">
              {data.title}
            </h1>
            <p className="font-['Cormorant_Garamond'] italic text-xl text-white/60">{data.tagline}</p>
          </motion.div>
        </div>
      </div>

      {/* About */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
          <FadeUp>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose">{data.desc}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              {data.features.map((f) => (
                <span
                  key={f}
                  className="text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 border"
                  style={{ borderColor: `${data.accentColor}40`, color: data.accentColor }}
                >
                  {f}
                </span>
              ))}
            </div>
          </FadeUp>

          {/* Steps */}
          <FadeUp delay={0.15}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-6">HOW TO USE</p>
            <div className="space-y-5">
              {data.steps.map((s) => (
                <div key={s.step} className="flex gap-5 items-start border-b border-border/20 pb-5">
                  <span className="font-['Cormorant_Garamond'] text-3xl leading-none" style={{ color: data.accentColor }}>
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm text-foreground font-medium tracking-wider mb-1">{s.name}</p>
                    <p className="text-xs text-muted-foreground font-['Jost'] font-light">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>

        {/* Products */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">ラインナップ</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-foreground mb-10">
            <span className="italic" style={{ color: data.accentColor }}>{data.title}</span> の商品
          </h2>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {(data.products as any[]).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PrivacyPage() {
  const { setPage } = useContext(NavCtx);

  const sections = [
    {
      title: "1. 収集する情報",
      body: "当社は、お客様がサービスをご利用いただく際に以下の情報を収集することがあります。氏名・メールアドレス・住所・電話番号などの個人識別情報、注文履歴・購入履歴・ウィッシュリストなどのトランザクション情報、IPアドレス・ブラウザの種類・アクセス日時などの技術情報、Cookie・ウェブビーコンを通じた閲覧行動情報。",
    },
    {
      title: "2. 情報の利用目的",
      body: "収集した個人情報は、以下の目的のためにのみ使用します。ご注文の処理・配送・アフターサポートの提供、新商品・キャンペーン・お得な情報のご案内（同意いただいた場合のみ）、サービスの品質向上および不正利用防止、法令上の義務の履行。お客様の同意なく目的外に利用することはありません。",
    },
    {
      title: "3. 第三者への提供",
      body: "当社は、以下の場合を除き、お客様の個人情報を第三者に提供・開示しません。お客様の事前の同意がある場合、配送業者・決済代行会社など業務委託先への必要な範囲での提供（守秘義務契約を締結）、法令に基づく開示要求があった場合、人の生命・身体・財産の保護のために必要な場合。",
    },
    {
      title: "4. Cookieの使用",
      body: "当社のウェブサイトはCookieを使用しています。Cookieは、お客様のブラウザに保存される小さなテキストファイルで、サービスの利便性向上・利用状況の分析・パーソナライズされた広告配信のために使用します。ブラウザの設定からCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。",
    },
    {
      title: "5. 情報の保管・セキュリティ",
      body: "お客様の個人情報は、SSL暗号化通信による安全な環境で保管します。当社は適切な技術的・組織的措置を講じて不正アクセス・漏洩・改ざんを防止します。個人情報の保存期間は利用目的の達成に必要な期間とし、不要となった情報は安全に廃棄します。",
    },
    {
      title: "6. お客様の権利",
      body: "お客様は、ご自身の個人情報について以下の権利を有しています。開示・訂正・削除の請求、利用停止・第三者提供停止の請求、メールマガジン等の受信停止。これらのご要望はカスタマーサポートまでお申し付けください。本人確認のうえ、速やかに対応いたします。",
    },
    {
      title: "7. 未成年者のプライバシー",
      body: "当社のサービスは16歳未満の方を対象としていません。16歳未満の方から意図せず個人情報を収集した場合、保護者からのご連絡をいただき次第、速やかに削除いたします。",
    },
    {
      title: "8. ポリシーの変更",
      body: "本プライバシーポリシーは、法令の改正やサービス内容の変更に伴い更新されることがあります。重要な変更がある場合は、ウェブサイト上でのお知らせまたはメールにてご連絡します。最終更新日：2024年1月1日",
    },
    {
      title: "9. お問い合わせ",
      body: "個人情報の取り扱いに関するご質問・ご要望は、下記の個人情報保護管理者までご連絡ください。LUMIÈRE BEAUTY 株式会社 個人情報保護管理者 / privacy@lumiere-beauty.jp / 〒150-0001 東京都渋谷区神宮前5-XX-XX LUMIÈREビル3F",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-20 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 30%, rgba(201,168,76,0.06) 0%, transparent 55%)" }} />
        <div className="max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Legal</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl text-foreground font-medium mb-4">
              プライバシー<span className="italic gold-shimmer">ポリシー</span>
            </h1>
            <p className="text-xs text-muted-foreground font-['Jost'] font-light">最終更新日：2024年1月1日</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <FadeUp>
          <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose mb-12 border-l-2 border-primary/40 pl-5">
            LUMIÈRE BEAUTY 株式会社（以下「当社」）は、お客様の個人情報の保護を最重要事項と位置付けています。本プライバシーポリシーは、当社がどのように個人情報を収集・利用・保護するかについてご説明するものです。
          </p>
        </FadeUp>

        <div className="space-y-10">
          {sections.map((s, i) => (
            <FadeUp key={s.title}>
              <div className="border-b border-border/20 pb-10">
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-foreground mb-4">{s.title}</h2>
                <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose">{s.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp className="mt-14">
          <div className="border border-border/40 p-8 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-5">
              ご不明な点がございましたら、お気軽にお問い合わせください。
            </p>
            <button
              onClick={() => setPage("contact")}
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
            >
              お問い合わせ
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function PressPage() {
  const { setPage } = useContext(NavCtx);

  const coverage = [
    { outlet: "VOGUE JAPAN", date: "2025年11月", title: "クリーンビューティーの新星——LUMIÈREが変える日本のコスメ市場", category: "特集" },
    { outlet: "WWD BEAUTY", date: "2025年9月", title: "サステナブルラグジュアリーを体現するブランド10選", category: "掲載" },
    { outlet: "ELLE JAPON", date: "2025年7月", title: "今季注目のスキンケアルーティン：LUMIÈRE ルミナスセラムを徹底レビュー", category: "レビュー" },
    { outlet: "Harper's BAZAAR", date: "2025年5月", title: "2025年ビューティーアワード受賞——ベストセラム部門", category: "受賞" },
    { outlet: "The New York Times", date: "2025年3月", title: "Japanese Clean Beauty Brands Making Waves Globally", category: "掲載" },
    { outlet: "COSME TOKYO", date: "2025年1月", title: "ヴィーガンコスメアワード 2025 グランプリ受賞", category: "受賞" },
  ];

  const assets = [
    { label: "ブランドロゴ（SVG / PNG）", size: "2.4 MB" },
    { label: "プロダクトビジュアル集", size: "48 MB" },
    { label: "ブランドガイドライン", size: "5.1 MB" },
    { label: "創業者プロフィール写真", size: "12 MB" },
    { label: "会社概要・ファクトシート", size: "0.8 MB" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-28 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 40%, rgba(201,168,76,0.08) 0%, transparent 55%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Press & Media</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              プレス<span className="italic gold-shimmer">ルーム</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              取材・掲載に関するお問い合わせ、プレスキットのご請求はこちらから。
              LUMIÈREのブランドストーリーを世界に届けるパートナーをお待ちしています。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-20">
        {/* メディア掲載実績 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-8">In The Press</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-8">メディア掲載実績</h2>
          <div className="space-y-0 border-t border-border/30">
            {coverage.map((item) => (
              <div key={item.title} className="border-b border-border/30 py-5 grid md:grid-cols-4 gap-3 items-center group">
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] tracking-[0.15em] uppercase px-2 py-1 border ${
                    item.category === "受賞"
                      ? "border-primary/50 text-primary bg-primary/10"
                      : "border-border/40 text-muted-foreground"
                  }`}>{item.category}</span>
                </div>
                <p className="text-sm text-foreground font-['Cormorant_Garamond'] text-lg md:col-span-2 group-hover:text-primary transition-colors leading-snug">{item.title}</p>
                <div className="text-right">
                  <p className="text-[10px] tracking-[0.2em] text-muted-foreground font-['Jost'] font-light">{item.outlet}</p>
                  <p className="text-[10px] text-muted-foreground/60 font-['Jost'] font-light">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* プレスキット */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-8">Press Kit</p>
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-4">プレスキット</h2>
              <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose mb-6">
                ロゴ・製品ビジュアル・ブランドガイドラインなどのアセットを含む公式プレスキットをご用意しています。ご利用の際は事前にご連絡ください。
              </p>
              <button
                onClick={() => setPage("contact")}
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
              >
                プレスキットを請求する
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="space-y-2">
              {assets.map((a) => (
                <div key={a.label} className="flex items-center justify-between border border-border/30 px-5 py-3 hover:border-primary/40 transition-colors">
                  <span className="text-xs text-foreground font-['Jost'] font-light">{a.label}</span>
                  <span className="text-[10px] text-muted-foreground font-['Jost'] font-light">{a.size}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* プレス問い合わせ */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Press Inquiries</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">取材・掲載のご依頼</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-2">
              press@lumiere-beauty.jp
            </p>
            <p className="text-xs text-muted-foreground font-['Jost'] font-light mb-7">
              平日10:00〜18:00 · 通常2営業日以内にご返信いたします
            </p>
            <button
              onClick={() => setPage("contact")}
              className="group inline-flex items-center gap-3 border border-primary text-primary px-10 py-3 text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              お問い合わせフォームへ
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function CareersPage() {
  const { setPage } = useContext(NavCtx);
  const [openJob, setOpenJob] = useState<string | null>(null);

  const jobs = [
    {
      id: "j1",
      dept: "プロダクト",
      title: "シニア処方開発研究員",
      type: "正社員",
      location: "東京 / ハイブリッド",
      body: "スキンケア・メイクアップ製品の処方開発をリードするポジションです。植物由来成分の研究から製品化まで、クリーンビューティーの最前線で活躍していただきます。化学・薬学・生化学系の修士以上、処方開発経験5年以上を歓迎します。",
    },
    {
      id: "j2",
      dept: "マーケティング",
      title: "ブランドマネージャー",
      type: "正社員",
      location: "東京 / リモート可",
      body: "LUMIÈREのブランド戦略の立案・実行を担うポジションです。国内外のマーケティングチームと連携し、ブランドの世界観を一貫して発信していただきます。ラグジュアリー・コスメティクス業界での経験を歓迎します。",
    },
    {
      id: "j3",
      dept: "テクノロジー",
      title: "フロントエンドエンジニア",
      type: "正社員 / 業務委託",
      location: "フルリモート",
      body: "ECプラットフォームおよびブランドサイトの開発をお任せします。React / TypeScript を用いた高品質なUI実装が得意な方を歓迎します。デザインへの感度が高く、アニメーションやマイクロインタラクションに興味がある方は特に歓迎です。",
    },
    {
      id: "j4",
      dept: "サプライチェーン",
      title: "サステナビリティ推進担当",
      type: "正社員",
      location: "東京",
      body: "パッケージ・製造・物流にわたるサプライチェーン全体のサステナビリティ施策を推進するポジションです。取引先との交渉・認証取得・進捗レポートの作成をお任せします。環境・CSR領域での実務経験をお持ちの方を歓迎します。",
    },
    {
      id: "j5",
      dept: "カスタマーサクセス",
      title: "ビューティーアドバイザー（オンライン）",
      type: "パートタイム / 業務委託",
      location: "フルリモート",
      body: "オンラインチャット・SNSを通じてお客様の肌悩みに寄り添い、最適な製品をご提案するポジションです。美容師・エステティシャン・皮膚科クリニック経験者を歓迎します。週20時間〜応相談。",
    },
  ];

  const depts = ["すべて", ...Array.from(new Set(jobs.map((j) => j.dept)))];
  const [activeDept, setActiveDept] = useState("すべて");
  const filtered = activeDept === "すべて" ? jobs : jobs.filter((j) => j.dept === activeDept);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-28 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Careers</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              採用<span className="italic gold-shimmer">情報</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              美しさと革新を追求するLUMIÈREで、あなたのキャリアを築きませんか。
              多様なバックグラウンドを持つチームが、世界水準のコスメブランドを一緒に創っています。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {/* 働く環境 */}
        <FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "🌿", title: "フレキシブルワーク", desc: "フルリモート・ハイブリッド・フレックスタイム制。ライフスタイルに合わせた働き方を選べます。" },
              { icon: "✦", title: "成長支援", desc: "年間¥150,000の学習支援制度。外部研修・カンファレンス・資格取得を会社が全額サポート。" },
              { icon: "◇", title: "ウェルネス特典", desc: "全製品の社員割引（50%OFF）、月1回のウェルネスデー、カウンセリングサポート制度あり。" },
            ].map((b) => (
              <div key={b.title} className="border border-border/40 p-7" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)" }}>
                <p className="text-2xl mb-4 font-['Cormorant_Garamond'] text-primary">{b.icon}</p>
                <p className="text-sm text-foreground font-['Jost'] mb-2">{b.title}</p>
                <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 求人一覧 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Open Positions</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-8">募集中のポジション</h2>

          {/* 部門フィルター */}
          <div className="flex flex-wrap gap-2 mb-8">
            {depts.map((d) => (
              <button
                key={d}
                onClick={() => setActiveDept(d)}
                className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                  activeDept === d
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-0 border-t border-border/30">
            {filtered.map((job) => {
              const isOpen = openJob === job.id;
              return (
                <div key={job.id} className="border-b border-border/30">
                  <button
                    onClick={() => setOpenJob(isOpen ? null : job.id)}
                    className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-[10px] tracking-[0.2em] uppercase text-primary bg-primary/10 px-2 py-1 flex-shrink-0">{job.dept}</span>
                      <div>
                        <p className="text-sm text-foreground font-['Jost'] group-hover:text-primary transition-colors">{job.title}</p>
                        <p className="text-[10px] text-muted-foreground font-['Jost'] font-light mt-1">{job.type} · {job.location}</p>
                      </div>
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.25 }} className="flex-shrink-0 text-primary text-lg leading-none">
                      +
                    </motion.span>
                  </button>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pl-4 border-l-2 border-primary/30 space-y-4">
                        <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-loose">{job.body}</p>
                        <button
                          onClick={() => setPage("contact")}
                          className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-[10px] tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
                        >
                          応募する
                          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Don't see your role?</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">自分のロールが見つからない？</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              ポジションがなくても、あなたの情熱と経験を聞かせてください。<br />オープンアプリケーションを随時受け付けています。
            </p>
            <button
              onClick={() => setPage("contact")}
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
            >
              オープン応募をする
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function SustainabilityPage() {
  const { setPage } = useContext(NavCtx);
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "55vh" }}>
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600&h=900&fit=crop&auto=format"
          alt="sustainability"
          className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.2) 0%, rgba(8,8,8,0.9) 100%)" }} />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-4xl mx-auto px-6 pb-20 pt-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
            <button onClick={() => setPage("home")} className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8">
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Sustainability</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-foreground font-light leading-tight mb-6">
              地球と、<span className="italic gold-shimmer">共に。</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              美しくあることと、地球に優しくあることは、両立できると信じています。
              LUMIÈREのすべての決断は、未来の世代への責任とともにあります。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        {/* コミットメント数値 */}
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { num: "100%", label: "再生可能エネルギー", note: "製造工程全体" },
              { num: "0", label: "有害化学物質", note: "処方に一切不使用" },
              { num: "80%", label: "再生素材パッケージ", note: "2026年目標達成済" },
              { num: "CO₂", label: "全配送オフセット済", note: "2022年より実施" },
            ].map((s) => (
              <div key={s.label} className="border border-border/40 p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)" }}>
                <p className="font-['Cormorant_Garamond'] text-4xl text-primary mb-1">{s.num}</p>
                <p className="text-xs text-foreground font-['Jost'] mb-1">{s.label}</p>
                <p className="text-[10px] text-muted-foreground font-['Jost'] font-light">{s.note}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 3つの柱 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-10">Our Pillars</p>
          <div className="space-y-12">
            {[
              {
                num: "01",
                title: "クリーン処方",
                img: "photo-1556228453-efd6c1ff04f6",
                body: "1,300以上の有害成分をブラックリスト化。パラベン・シリコン・鉱物油・合成香料を使用せず、植物由来の活性成分だけで最大限の効果を引き出します。全製品はEWGグリーン認定を取得しています。",
              },
              {
                num: "02",
                title: "サステナブル パッケージ",
                img: "photo-1607082348824-0a96f2a4b9da",
                body: "外箱はFSC認定の再生紙、ガラス容器は回収・再充填プログラムに対応。プラスチック使用量を2020年比で60%削減しました。2027年までに全パッケージのゼロウェイスト化を目標としています。",
              },
              {
                num: "03",
                title: "カーボンニュートラル",
                img: "photo-1473341304170-971dccb5ac1e",
                body: "製造・輸送・廃棄にわたるサプライチェーン全体のカーボンフットプリントを計測し、認定プロジェクトへの投資で全量オフセット。2030年までにネットゼロを実現します。",
              },
            ].map((p) => (
              <div key={p.num} className="grid md:grid-cols-2 gap-10 items-center">
                <div className={p.num === "02" ? "md:order-2" : ""}>
                  <div className="flex items-start gap-4 mb-5">
                    <span className="font-['Cormorant_Garamond'] text-5xl text-primary/25 leading-none flex-shrink-0">{p.num}</span>
                    <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground leading-snug pt-2">{p.title}</h2>
                  </div>
                  <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose">{p.body}</p>
                </div>
                <div className={`relative aspect-[4/3] overflow-hidden ${p.num === "02" ? "md:order-1" : ""}`}>
                  <img
                    src={`https://images.unsplash.com/${p.img}?w=800&h=600&fit=crop&auto=format`}
                    alt={p.title}
                    className="w-full h-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 pointer-events-none border border-border/30" />
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 認証・パートナー */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-8">Certifications</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-8">認証・パートナーシップ</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "Leaping Bunny クルエルティフリー認定",
              "COSMOS Organic 認定",
              "EWG グリーン認定",
              "FSC 認定パッケージ",
              "1% for the Planet 加盟",
              "B Corp 認定取得中",
            ].map((cert) => (
              <div key={cert} className="border border-border/30 px-5 py-4 flex items-center gap-3">
                <span className="text-primary text-xs flex-shrink-0">✓</span>
                <span className="text-xs text-muted-foreground font-['Jost'] font-light leading-snug">{cert}</span>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Join Us</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">一緒に未来を作りましょう</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              容器の回収プログラムへの参加、エコ梱包の選択など、あなたの選択が地球を変えます。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button onClick={() => setPage("about")} className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300">
                私たちについて
              </button>
              <button onClick={() => setPage("collections")} className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300">
                コレクションを見る
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function AboutPage() {
  const { setPage } = useContext(NavCtx);
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: "60vh" }}>
        <img
          src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1600&h=900&fit=crop&auto=format"
          alt="brand"
          className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none"
        />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.85) 100%)" }} />
        <div className="relative z-10 flex flex-col justify-end h-full max-w-4xl mx-auto px-6 pb-20 pt-32">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Our Story</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-foreground font-light leading-tight mb-6">
              私たちに<span className="italic gold-shimmer">ついて</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              美しさとは、外側にあるものではなく、内側から滲み出るものだと私たちは信じています。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-24">
        {/* ミッション */}
        <FadeUp>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-5">Mission</p>
              <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground mb-6 leading-snug">
                美しさを、すべての人へ。
              </h2>
              <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose">
                LUMIÈREは2018年、パリにインスパイアされた東京のラボで誕生しました。創業者の想いはひとつ——すべての人が自分らしい美しさを表現できる世界を作ること。科学と芸術の境界を越えた処方で、使うたびに肌が喜ぶ体験を届けています。
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop&auto=format"
                alt="mission"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.15) 0%, transparent 60%)" }} />
            </div>
          </div>
        </FadeUp>

        {/* 数字で見るLUMIÈRE */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-10 text-center">By The Numbers</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: "2018", label: "創業年" },
              { num: "48+", label: "取り扱いアイテム" },
              { num: "100%", label: "ヴィーガン認定" },
              { num: "12ヵ国", label: "展開予定地域" },
            ].map((stat) => (
              <div key={stat.label} className="border border-border/40 p-6 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)" }}>
                <p className="font-['Cormorant_Garamond'] text-4xl text-primary mb-2">{stat.num}</p>
                <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 価値観 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-10">Our Values</p>
          <div className="space-y-0 border-t border-border/30">
            {[
              { title: "クリーン ビューティー", body: "有害成分ゼロ。すべての製品において皮膚科医テスト済みの安全な処方を使用しています。" },
              { title: "サステナビリティ", body: "リサイクル可能なパッケージ、CO2オフセット配送、環境負荷の少ない製造プロセスへの継続的な投資。" },
              { title: "インクルーシビティ", body: "すべての肌色、肌質に対応したシェードレンジと処方。美しさに「普通」はありません。" },
              { title: "科学への敬意", body: "最先端の皮膚科学研究に基づく処方。効果を数値で証明することにこだわっています。" },
            ].map((v) => (
              <div key={v.title} className="border-b border-border/30 py-6 grid md:grid-cols-3 gap-4">
                <p className="text-sm text-primary font-['Cormorant_Garamond'] text-xl">{v.title}</p>
                <p className="md:col-span-2 text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* チーム */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Founders</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground mb-10">創業者について</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { name: "中村 光", role: "CEO & Co-Founder", img: "photo-1573497019940-1c28c88b4f3e", bio: "パリ・ロレアル研究所での10年を経て帰国。「日本の美意識を世界に」を掲げてLUMIÈREを共同創業。" },
              { name: "田中 彩華", role: "Chief Formulation Officer", img: "photo-1580489944761-15a19d654956", bio: "東京大学薬学部卒。クリーンビューティーの処方開発に特化した研究者。100以上の特許を保有。" },
            ].map((f) => (
              <div key={f.name} className="flex gap-5">
                <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-full border border-border/40">
                  <img src={`https://images.unsplash.com/${f.img}?w=160&h=160&fit=crop&auto=format`} alt={f.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-foreground font-['Jost'] text-sm mb-0.5">{f.name}</p>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-primary mb-3">{f.role}</p>
                  <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{f.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Explore</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">LUMIÈREの世界へ</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              私たちのコレクションで、あなただけの美しさを見つけてください。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPage("brand-story")}
                className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                ブランドストーリーを読む
              </button>
              <button
                onClick={() => setPage("collections")}
                className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
              >
                コレクションを見る
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function ContactPage() {
  const { setPage } = useContext(NavCtx);
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputClass = "w-full bg-muted border border-border/40 text-foreground text-sm font-['Jost'] font-light px-4 py-3 focus:outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground";

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 80%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Contact Us</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              お<span className="italic gold-shimmer">問い合わせ</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              ご質問・ご要望・ご意見など、お気軽にお送りください。
              平日10:00〜18:00（土日祝を除く）に担当者よりご返信いたします。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-12">
          {/* サイドパネル */}
          <FadeUp className="space-y-8">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Response Time</p>
              <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">
                通常、1〜2営業日以内にご返信いたします。お急ぎの場合はお電話にてご連絡ください。
              </p>
            </div>
            <div className="border-t border-border/30 pt-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Quick Links</p>
              <ul className="space-y-3">
                {[
                  { label: "よくある質問", page: "faq" as Page },
                  { label: "配送について", page: "shipping" as Page },
                  { label: "返品・交換", page: "returns" as Page },
                ].map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => setPage(l.page)}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors font-['Jost'] font-light flex items-center gap-2"
                    >
                      <span className="text-primary/40">→</span>{l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border/30 pt-6">
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Business Hours</p>
              <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">
                平日 10:00〜18:00<br />
                土日祝・年末年始を除く
              </p>
            </div>
          </FadeUp>

          {/* フォーム */}
          <FadeUp className="md:col-span-2">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="border border-primary/30 p-12 text-center"
                style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, transparent 100%)" }}
              >
                <p className="font-['Cormorant_Garamond'] text-5xl text-primary mb-4">✓</p>
                <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">送信が完了しました</h2>
                <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose mb-8">
                  お問い合わせありがとうございます。<br />
                  1〜2営業日以内にご返信いたします。
                </p>
                <button
                  onClick={() => { setForm({ name: "", email: "", category: "", message: "" }); setSubmitted(false); }}
                  className="text-xs tracking-[0.2em] uppercase text-primary hover:text-accent transition-colors"
                >
                  別のお問い合わせをする
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">お名前 *</label>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="山田 花子"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">メールアドレス *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">お問い合わせ種別 *</label>
                  <select
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputClass + " appearance-none cursor-pointer"}
                  >
                    <option value="" disabled>選択してください</option>
                    {["ご注文について", "配送について", "返品・交換について", "商品・成分について", "その他"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">お問い合わせ内容 *</label>
                  <textarea
                    required
                    rows={6}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="ご質問・ご要望をご記入ください"
                    className={inputClass + " resize-none"}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground font-['Jost'] font-light">
                  * 必須項目。送信いただいた個人情報は、お問い合わせ対応のみに使用いたします。
                </p>
                <button
                  type="submit"
                  className="group w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground py-4 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
                >
                  送信する
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

function ReturnsPage() {
  const { setPage } = useContext(NavCtx);
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 30%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Returns & Exchanges</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              返品・<span className="italic gold-shimmer">交換</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              お客様にご満足いただけない場合は、お気軽にご連絡ください。
              LUMIÈREは、すべてのお客様に最高の体験をお届けすることをお約束します。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {/* ポリシー概要カード */}
        <FadeUp>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: "14", unit: "日以内", label: "返品受付期間", note: "商品到着後14日以内" },
              { icon: "0", unit: "円", label: "交換送料", note: "初期不良・当社都合の場合" },
              { icon: "24", unit: "h", label: "サポート応答", note: "平日10:00〜18:00対応" },
            ].map((item) => (
              <div key={item.label} className="border border-border/40 p-7 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)" }}>
                <p className="font-['Cormorant_Garamond'] text-5xl text-primary mb-1">
                  {item.icon}<span className="text-2xl">{item.unit}</span>
                </p>
                <p className="text-xs text-foreground font-['Jost'] mb-1">{item.label}</p>
                <p className="text-[10px] text-muted-foreground font-['Jost'] font-light">{item.note}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 返品条件 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Conditions</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-6">返品・交換の条件</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-primary/20 p-6" style={{ background: "rgba(201,168,76,0.03)" }}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-4">対応可能</p>
              <ul className="space-y-3">
                {[
                  "商品到着後14日以内のご連絡",
                  "未開封・未使用の商品",
                  "配送中の破損・初期不良",
                  "お届け商品の相違",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-primary text-xs mt-0.5">✓</span>
                    <span className="text-xs text-foreground font-['Jost'] font-light leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-border/30 p-6">
              <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-4">対応不可</p>
              <ul className="space-y-3">
                {[
                  "開封済み・使用済みの商品",
                  "商品到着後15日以降のご連絡",
                  "お客様都合による返品の送料",
                  "ギフトセットの一部のみの返品",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="text-muted-foreground text-xs mt-0.5">×</span>
                    <span className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </FadeUp>

        {/* 手続きの流れ */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Process</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-8">お手続きの流れ</h2>
          <div className="relative pl-6 border-l border-border/30 space-y-8">
            {[
              { step: "01", title: "カスタマーサポートへご連絡", desc: "お問い合わせフォームまたはメールにて、注文番号・商品名・返品理由をお知らせください。破損の場合は写真も添付してください。" },
              { step: "02", title: "返品承認メールの受信", desc: "通常1〜2営業日以内に返品承認メールと返送先住所をお送りします。承認前の返送はお受けできかねます。" },
              { step: "03", title: "商品の返送", desc: "元のパッケージに梱包の上、承認メール記載の住所にお送りください。お客様都合の場合、送料はお客様負担となります。" },
              { step: "04", title: "返金・交換の処理", desc: "商品到着確認後、返金は3〜5営業日以内にご登録のお支払い方法へ。交換は在庫確認後、新品を発送いたします。" },
            ].map((s) => (
              <div key={s.step} className="flex gap-5">
                <span className="font-['Cormorant_Garamond'] text-4xl text-primary/30 leading-none flex-shrink-0">{s.step}</span>
                <div>
                  <p className="text-sm text-foreground font-['Jost'] mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Contact Us</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">返品・交換のご依頼</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              まずはカスタマーサポートまでご連絡ください。迅速に対応いたします。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPage("faq")}
                className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                よくある質問を見る
              </button>
              <button onClick={() => setPage("contact")} className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300">
                お問い合わせフォームへ
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

function ShippingPage() {
  const { setPage } = useContext(NavCtx);
  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 60%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Shipping</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              配送に<span className="italic gold-shimmer">ついて</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              LUMIÈREのすべての商品は、丁寧にパッケージしてお届けいたします。
              大切なご注文が安全に届くよう、配送品質にこだわっています。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14 space-y-14">
        {/* 送料 */}
        <FadeUp>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "¥10,000以上のご購入", fee: "送料無料", note: "国内全域・離島含む" },
              { label: "¥10,000未満のご購入", fee: "¥660（税込）", note: "全国一律" },
              { label: "翌日配送（速達）", fee: "+¥330（税込）", note: "お届け日時指定対応" },
              { label: "ギフトラッピング", fee: "無料", note: "メッセージカード付き" },
            ].map((item) => (
              <div key={item.label} className="border border-border/40 p-7" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 100%)" }}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground mb-2">{item.note}</p>
                <p className="text-sm text-foreground font-['Jost'] mb-3">{item.label}</p>
                <p className="font-['Cormorant_Garamond'] text-3xl text-primary">{item.fee}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 配送スケジュール */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Delivery Schedule</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-8">配送スケジュール</h2>
          <div className="relative pl-6 border-l border-border/30 space-y-8">
            {[
              { step: "01", title: "ご注文確定", desc: "お支払い完了後、すぐに受付確認メールが届きます。" },
              { step: "02", title: "商品の検品・梱包", desc: "専任スタッフが品質チェックを行い、シグネチャーボックスに丁寧に梱包します。通常1〜2営業日で発送準備が整います。" },
              { step: "03", title: "発送・追跡番号のご案内", desc: "発送完了後、追跡番号をメールでお知らせします。ヤマト運輸または佐川急便でのお届けとなります。" },
              { step: "04", title: "お届け", desc: "発送後、通常1〜2日（離島・一部地域は2〜3日）でお届けします。不在時は再配達を承ります。" },
            ].map((s) => (
              <div key={s.step} className="flex gap-5">
                <span className="font-['Cormorant_Garamond'] text-4xl text-primary/30 leading-none flex-shrink-0">{s.step}</span>
                <div>
                  <p className="text-sm text-foreground font-['Jost'] mb-1">{s.title}</p>
                  <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* 対応地域・注意事項 */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-6">Notes</p>
          <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-6">ご注意事項</h2>
          <div className="space-y-4">
            {[
              "現在、配送は日本国内のみ対応しています。海外発送は準備中です。",
              "離島・一部山間部は配達に追加日数がかかる場合があります。",
              "天候・交通状況により配達が遅れる場合があります。",
              "年末年始・大型連休中は発送が通常より遅れる場合があります。",
              "複数商品のご注文は、まとめて1回で発送いたします。",
            ].map((note, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary mt-0.5 flex-shrink-0">—</span>
                <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* CTA */}
        <FadeUp>
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Need Help?</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">ご不明な点はございますか？</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              配送に関するご質問は、カスタマーサポートまでお気軽にお問い合わせください。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setPage("faq")}
                className="group inline-flex items-center gap-3 border border-primary text-primary px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                よくある質問を見る
              </button>
              <button onClick={() => setPage("contact")} className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-8 py-3 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300">
                お問い合わせ
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

const FAQ_DATA = [
  {
    category: "ご注文について",
    items: [
      { q: "注文後のキャンセルはできますか？", a: "ご注文確定後2時間以内であれば、マイページまたはお問い合わせフォームよりキャンセルが可能です。発送準備に入った後はキャンセルできかねますのでご了承ください。" },
      { q: "注文確認メールが届きません", a: "ご注文後、自動的に確認メールをお送りしています。迷惑メールフォルダもご確認ください。それでも届かない場合はカスタマーサポートまでご連絡ください。" },
      { q: "ギフトラッピングは対応していますか？", a: "はい、全商品・全ギフトセットに無料のシグネチャーギフトラッピングをご用意しています。注文時に「ギフトラッピングを希望する」をご選択ください。メッセージカード（200文字まで）も無料でお入れできます。" },
      { q: "領収書の発行はできますか？", a: "マイページの「注文履歴」より領収書のPDFをダウンロードいただけます。宛名の変更が必要な場合はカスタマーサポートまでお申し付けください。" },
    ],
  },
  {
    category: "配送について",
    items: [
      { q: "送料はいくらですか？", a: "¥10,000以上のご購入で送料無料です。¥10,000未満の場合は全国一律¥660（税込）となります。翌日配送（ゆうパック速達）をご希望の場合は追加¥330がかかります。" },
      { q: "海外への配送は対応していますか？", a: "現在、日本国内のみの配送となっております。海外への発送は準備中です。グローバルサイトのオープンをお待ちください。" },
      { q: "配送日数はどのくらいかかりますか？", a: "ご注文確定後、通常2〜3営業日以内に発送いたします。お届けまでの日数は地域によって異なりますが、発送後1〜3日でのお届けとなります。" },
      { q: "配送状況を確認できますか？", a: "発送完了後、追跡番号をメールでお知らせします。ヤマト運輸または佐川急便の追跡サービスよりリアルタイムで配送状況をご確認いただけます。" },
    ],
  },
  {
    category: "商品・成分について",
    items: [
      { q: "全製品はヴィーガン・クルエルティフリーですか？", a: "はい、LUMIÈREの全製品はヴィーガン認定・クルエルティフリー認定を取得しています。動物由来成分は一切使用せず、動物実験も行っていません。" },
      { q: "敏感肌でも使用できますか？", a: "全製品において皮膚科医によるパッチテストを実施しています。ただし、肌質には個人差があります。初めてご使用の際はパッチテストを行い、異常を感じた場合は使用を中止してください。" },
      { q: "成分表示はどこで確認できますか？", a: "各商品ページの「成分表示」タブよりご確認いただけます。また、パッケージにも全成分を記載しています。特定成分についてのご質問はカスタマーサポートまでお気軽にどうぞ。" },
      { q: "製品の使用期限はありますか？", a: "未開封の状態で製造から3年、開封後は商品により異なりますが6〜12ヶ月を目安にお使いください。各商品に開封後使用期限マーク（PAOマーク）を記載しています。" },
    ],
  },
  {
    category: "返品・交換について",
    items: [
      { q: "返品・交換のポリシーを教えてください", a: "商品到着後14日以内であれば、未開封・未使用の商品に限り返品・交換を承ります。返送料はお客様のご負担となります。なお、ギフトセットは一部のみの返品はお受けできません。" },
      { q: "届いた商品が破損していた場合は？", a: "配送中の破損・初期不良の場合は、商品到着後7日以内にカスタマーサポートまでご連絡ください。写真をお送りいただければ、送料無料で新品と交換いたします。" },
      { q: "肌に合わなかった場合の返品はできますか？", a: "一度でもご使用いただいた商品の返品はお受けしておりません。ただし、当社の品質基準を満たしていないと判断した場合は個別対応いたします。ご購入前にサンプルのご利用をお勧めします。" },
    ],
  },
];

function FAQPage() {
  const { setPage } = useContext(NavCtx);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("すべて");

  const categories = ["すべて", ...FAQ_DATA.map((d) => d.category)];
  const filtered = activeCategory === "すべて" ? FAQ_DATA : FAQ_DATA.filter((d) => d.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 border-b border-border/30">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.07) 0%, transparent 55%)" }} />
        <div className="max-w-4xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="relative z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">FAQ</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-5">
              よくある<span className="italic gold-shimmer">ご質問</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl">
              ご不明な点がございましたら、下記をご確認ください。
              解決しない場合はカスタマーサポートまでお気軽にご連絡ください。
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/40 text-muted-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-10">
          {filtered.map((section) => (
            <FadeUp key={section.category}>
              <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-5">{section.category}</p>
              <div className="space-y-0 border-t border-border/30">
                {section.items.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openItem === key;
                  return (
                    <div key={key} className="border-b border-border/30">
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
                      >
                        <span className="text-sm text-foreground font-['Jost'] group-hover:text-primary transition-colors">{item.q}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 45 : 0 }}
                          transition={{ duration: 0.25 }}
                          className="flex-shrink-0 text-primary text-lg leading-none"
                        >
                          +
                        </motion.span>
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
                          className="overflow-hidden"
                        >
                          <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose pb-5 pl-0 border-l-2 border-primary/30 pl-4">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Contact CTA */}
        <FadeUp className="mt-16">
          <div className="border border-border/40 p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.05) 0%, transparent 100%)" }}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Still need help?</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground mb-3">お気軽にご連絡ください</h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light mb-7">
              平日10:00〜18:00（土日祝を除く）にカスタマーサポートが対応いたします。
            </p>
            <button onClick={() => setPage("contact")} className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300">
              お問い合わせフォームへ
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

const GIFT_SETS = [
  {
    id: "g1",
    name: "スキンリチュアル プレミアムセット",
    subtitle: "毎日の儀式を特別に",
    desc: "ルミナスセラム・ローズミストトナー・パールグロウマスクの3点セット。スキンケアの完全なルーティンをギフトに。",
    price: "¥28,000",
    originalPrice: "¥34,400",
    items: ["ルミナス セラム", "ローズ ミスト トナー", "パールグロウ マスク"],
    img: "https://images.unsplash.com/photo-1765963449601-02d96e3dcfcb?w=700&h=800&fit=crop&auto=format",
    badge: "人気No.1",
    tag: "SKINCARE",
  },
  {
    id: "g2",
    name: "カラードラマ ホリデーセット",
    subtitle: "色彩の魔法をプレゼントに",
    desc: "アイパレット「夕暮れ」・ヴェルヴェットルージュ・ゴールドアイライナーの華やかなメイクアップセット。",
    price: "¥19,800",
    originalPrice: "¥24,100",
    items: ["アイパレット「夕暮れ」", "ヴェルヴェット ルージュ", "ゴールド アイライナー"],
    img: "https://images.unsplash.com/photo-1676570092589-a6c09ecbb373?w=700&h=800&fit=crop&auto=format",
    badge: "限定",
    tag: "MAKEUP",
  },
  {
    id: "g3",
    name: "ノワール フレグランスセット",
    subtitle: "香りで記憶に刻む",
    desc: "ノワールパフューム・ローズオイルセラムのラグジュアリーな組み合わせ。特別な方への贈り物に。",
    price: "¥24,500",
    originalPrice: "¥32,500",
    items: ["ノワール パフューム", "ローズ オイル セラム"],
    img: "https://images.unsplash.com/photo-1759563874660-e51f23908127?w=700&h=800&fit=crop&auto=format",
    badge: "新作",
    tag: "FRAGRANCE",
  },
  {
    id: "g4",
    name: "LUMIÈRE ベストセラーセット",
    subtitle: "ブランドの真髄を一箱に",
    desc: "最も愛されるアイテム5点を厳選。初めてLUMIÈREを贈る方にも、コレクターにも喜ばれる究極のセット。",
    price: "¥45,000",
    originalPrice: "¥58,800",
    items: ["ルミナス セラム", "シルク ファンデーション", "アイパレット「夕暮れ」", "ノワール パフューム", "ローズ オイル セラム"],
    img: "https://images.unsplash.com/photo-1759563876829-47c081a2afd9?w=700&h=800&fit=crop&auto=format",
    badge: "ベストセラー",
    tag: "SPECIAL",
  },
  {
    id: "g5",
    name: "ミニチュア ディスカバリーセット",
    subtitle: "LUMIÈREの世界を体験",
    desc: "人気商品のミニサイズ6点入り。ブランド初体験の方や旅行のお供にも最適。",
    price: "¥12,000",
    originalPrice: "¥15,800",
    items: ["各カテゴリーより厳選6点"],
    img: "https://images.unsplash.com/photo-1765887986673-953fccf56464?w=700&h=800&fit=crop&auto=format",
    badge: null,
    tag: "TRIAL",
  },
  {
    id: "g6",
    name: "ホワイトボックス ブライダルセット",
    subtitle: "特別な日のために",
    desc: "ウェディングやアニバーサリーに贈る上質なスキンケア＆メイクセット。白いシグネチャーボックス入り。",
    price: "¥38,000",
    originalPrice: "¥48,600",
    items: ["グロウ プライマー", "シルク ファンデーション", "ヴェルヴェット ルージュ", "ルミナス セラム"],
    img: "https://images.unsplash.com/photo-1759563871375-d5b140f6646e?w=700&h=800&fit=crop&auto=format",
    badge: "限定",
    tag: "BRIDAL",
  },
];

function GiftSetsPage() {
  const { setPage, addToCart } = useContext(NavCtx);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.12) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 80%, rgba(160,120,40,0.08) 0%, transparent 50%)" }} />
        <div className="max-w-7xl mx-auto px-6 py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="relative z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-10"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Gift Sets</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div>
                <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-foreground font-medium leading-tight mb-5">
                  贈る喜び、<br /><span className="italic gold-shimmer">受け取る幸せ</span>
                </h1>
                <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-md">
                  大切な人へ、自分自身へ。LUMIÈREのギフトセットは、
                  特別なシグネチャーボックスに入れてお届けします。
                  無料のギフトラッピング・メッセージカード付き。
                </p>
              </div>
              <div className="flex flex-wrap gap-4 md:justify-end">
                {[
                  { icon: "✦", label: "無料ギフトラッピング" },
                  { icon: "◇", label: "メッセージカード無料" },
                  { icon: "○", label: "翌日配送対応" },
                ].map((f) => (
                  <div key={f.label} className="border border-border/40 px-4 py-3 flex items-center gap-2">
                    <span className="text-primary text-xs">{f.icon}</span>
                    <span className="text-[10px] tracking-widest uppercase text-muted-foreground">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        {/* Divider */}
        <div className="border-b border-border/30" />
      </div>

      {/* Gift sets grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {GIFT_SETS.map((set, i) => (
            <FadeUp key={set.id} delay={i * 0.07}>
              <div
                className={`group flex flex-col border transition-all duration-500 cursor-pointer ${selected === set.id ? "border-primary/50" : "border-border/30 hover:border-primary/30"}`}
                onClick={() => setSelected(selected === set.id ? null : set.id)}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3] bg-card">
                  <img
                    src={set.img}
                    alt={set.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {set.badge && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[9px] tracking-[0.25em] uppercase px-2.5 py-1">
                      {set.badge}
                    </span>
                  )}
                  <span className="absolute top-3 right-3 text-[9px] tracking-[0.3em] uppercase text-white/60 border border-white/20 px-2 py-1">
                    {set.tag}
                  </span>
                </div>

                {/* Info */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-['Cormorant_Garamond'] text-xl text-foreground mb-1">{set.name}</h3>
                  <p className="font-['Cormorant_Garamond'] italic text-sm text-primary mb-3">{set.subtitle}</p>
                  <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed mb-4">{set.desc}</p>

                  {/* Contents */}
                  <div className="mb-5">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">セット内容</p>
                    <ul className="space-y-1">
                      {set.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="text-primary/50 text-[8px]">◆</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-['Cormorant_Garamond'] text-2xl text-primary">{set.price}</span>
                      <span className="text-xs text-muted-foreground line-through">{set.originalPrice}</span>
                      <span className="text-[9px] tracking-widest text-accent uppercase">
                        {Math.round((1 - parseInt(set.price.replace(/[¥,]/g, "")) / parseInt(set.originalPrice.replace(/[¥,]/g, ""))) * 100)}% OFF
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({ id: parseInt(set.id.replace("g", "")) + 100, name: set.name, subtitle: set.subtitle, price: set.price, img: set.img });
                      }}
                      className="w-full py-3 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
                    >
                      カートに追加
                    </button>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Customization CTA */}
        <FadeUp className="mt-20">
          <div
            className="relative overflow-hidden border border-border/40 p-12 text-center"
            style={{ background: "linear-gradient(135deg, rgba(201,168,76,0.06) 0%, rgba(160,120,40,0.04) 100%)" }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #c9a84c 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-3">Custom Order</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl md:text-4xl text-foreground mb-4">
              オリジナル<span className="italic text-primary">カスタムギフト</span>
            </h2>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light max-w-lg mx-auto mb-8">
              お好みの商品を選んでオリジナルギフトセットを作成できます。
              予算・テーマ・受け取る方の肌質に合わせてスタイリストがご提案します。
            </p>
            <button className="group inline-flex items-center gap-3 border border-primary/50 px-10 py-4 text-xs tracking-[0.25em] uppercase text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              カスタムオーダーを相談する
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

const NEW_ARRIVALS_PRODUCTS = ALL_COLLECTION_PRODUCTS.filter((p) =>
  ["新作", "限定"].includes(p.badge ?? "")
).concat(ALL_COLLECTION_PRODUCTS.filter((p) => !["新作", "限定"].includes(p.badge ?? "")).slice(0, 4));

function NewArrivalsPage() {
  const { setPage, addToCart, wishlist, toggleWish } = useContext(NavCtx);
  const [activeFilter, setActiveFilter] = useState("すべて");
  const filters = ["すべて", "スキンケア", "ベースメイク", "リップ", "アイメイク", "フレグランス"];

  const filtered = activeFilter === "すべて"
    ? NEW_ARRIVALS_PRODUCTS
    : NEW_ARRIVALS_PRODUCTS.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-24 border-b border-border/30">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.09) 0%, transparent 55%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 80px)" }}
        />
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.75, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="relative z-10 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-3">New Arrivals</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-6xl text-foreground font-medium mb-4">
              今季の<span className="italic gold-shimmer">新作アイテム</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light max-w-lg">
              季節を纏う、生まれたての美しさ。LUMIÈREが贈る最新コレクションをいち早くご覧ください。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Featured new item */}
      <div className="max-w-7xl mx-auto px-6 py-16 border-b border-border/20">
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-8">今月の注目新作</p>
        </FadeUp>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <FadeUp className="relative overflow-hidden aspect-[4/5] bg-card">
            <img
              src="https://images.unsplash.com/photo-1764694071462-db50e50a3925?w=700&h=900&fit=crop&auto=format"
              alt="注目新作"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">
              NEW
            </span>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[9px] tracking-[0.3em] uppercase text-muted-foreground mb-2">スキンケア</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground mb-3">パールグロウ マスク</h2>
            <p className="font-['Cormorant_Garamond'] italic text-lg text-primary mb-5">真珠の輝きパックマスク</p>
            <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose mb-8">
              希少な淡水真珠エキスと深海コラーゲンを配合した、次世代のシートマスク。
              わずか15分で肌に光沢と弾力を与え、翌朝のメイクのりを格段に向上させます。
              週2〜3回の使用で、肌本来の輝きを引き出します。
            </p>
            <div className="flex items-center gap-6 mb-8">
              <span className="font-['Cormorant_Garamond'] text-3xl text-primary">¥7,800</span>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={12} className="fill-[#c9a84c] text-[#c9a84c]" />
                ))}
                <span className="text-[10px] text-muted-foreground ml-2">(143件)</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => addToCart({ id: 7, name: "パールグロウ マスク", subtitle: "真珠の輝きパックマスク", price: "¥7,800", img: "https://images.unsplash.com/photo-1670201203129-65c022f0ed8e?w=600&h=700&fit=crop&auto=format" })}
                className="flex-1 py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors"
              >
                カートに追加
              </button>
              <button
                onClick={() => toggleWish({ id: 7, name: "パールグロウ マスク", subtitle: "真珠の輝きパックマスク", price: "¥7,800", img: "https://images.unsplash.com/photo-1670201203129-65c022f0ed8e?w=600&h=700&fit=crop&auto=format", category: "スキンケア" })}
                className={`w-14 border flex items-center justify-center transition-colors ${wishlist.some(i => i.id === 7) ? "border-primary/40 text-primary" : "border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40"}`}
              >
                <Heart size={16} className={wishlist.some(i => i.id === 7) ? "fill-primary" : ""} />
              </button>
            </div>
          </FadeUp>
        </div>
      </div>

      {/* All new items */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <FadeUp>
            <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-1">ラインナップ</p>
            <h2 className="font-['Cormorant_Garamond'] text-3xl text-foreground">新作一覧</h2>
          </FadeUp>
          <div className="flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-[10px] tracking-widest uppercase transition-all duration-300 border ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
          {filtered.map((product, i) => (
            <ProductCard key={product.id} product={product as any} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandStoryPage() {
  const { setPage } = useContext(NavCtx);

  const milestones = [
    { year: "2008", title: "プロヴァンスで誕生", desc: "南フランスのグラースで、調香師のソフィー・ルブランが小さな工房を開く。最初の香水「Lumière No.1」が地元の愛好家に瞬く間に広まった。" },
    { year: "2012", title: "スキンケアラインの誕生", desc: "プロヴァンスの野生ラベンダーとローズヒップを原料に、初のスキンケアコレクション「スキンリチュアル」を発表。植物学者との共同研究が始まる。" },
    { year: "2016", title: "ヴィーガン認定取得", desc: "全製品においてクルエルティフリー・ヴィーガン認定を世界に先駆けて取得。サステナブルパッケージングへの移行も同年に完了。" },
    { year: "2019", title: "アジア市場へ進出", desc: "東京・ソウル・上海に旗艦店をオープン。アジアの薬草学とLUMIÈREのフレンチビューティーが融合した限定コレクションが話題に。" },
    { year: "2022", title: "再生農業パートナーシップ", desc: "農家と直接契約を結び、再生農業で育てた原料のみを使用する「ファームトゥフェイス」プログラムを始動。カーボンネガティブを達成。" },
    { year: "2024", title: "次の16年へ", desc: "世界50カ国以上で愛されるブランドへと成長。初心であるプロヴァンスの小さな工房の精神を守りながら、美しさの未来を切り開く。" },
  ];

  const values = [
    { title: "Clean Beauty", desc: "有害な化学物質は一切使用しません。すべての成分を開示し、あなたが何を肌に塗るのかを常に知ることができます。", icon: "✦" },
    { title: "Sustainability", desc: "パッケージは100%リサイクル可能または生分解性。工場は再生可能エネルギーで稼働し、廃水はゼロです。", icon: "◈" },
    { title: "Transparency", desc: "サプライチェーンから店頭まで、すべての工程を公開。あなたが信頼できるブランドであり続けることが使命です。", icon: "◇" },
    { title: "Community", desc: "売上の1%を世界中の女性起業家支援プログラムに寄付。美しさは、社会をより良くする力を持っています。", icon: "○" },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Hero */}
      <div className="relative overflow-hidden py-28 border-b border-border/30">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(201,168,76,0.08) 0%, transparent 60%)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #c9a84c 0px, #c9a84c 1px, transparent 1px, transparent 40px)" }}
        />
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22,1,0.36,1] }}>
            <button
              onClick={() => setPage("home")}
              className="relative z-10 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-primary transition-colors mb-10"
            >
              ← ホームに戻る
            </button>
            <p className="text-[10px] tracking-[0.5em] uppercase text-primary mb-4">Our Story</p>
            <h1 className="font-['Cormorant_Garamond'] text-5xl md:text-7xl text-foreground font-medium leading-tight mb-6">
              美しさを通じて、<br />
              <span className="italic gold-shimmer">世界をより良く</span>
            </h1>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose max-w-xl mx-auto">
              2008年、南フランスのプロヴァンスで生まれたLUMIÈREは、
              自然と科学の調和という一つの信念から始まりました。
            </p>
          </motion.div>
        </div>
      </div>

      {/* Founder */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-28">
          <FadeUp className="relative">
            <img
              src="https://images.unsplash.com/photo-1763503839418-2b45c3d7a3c3?w=600&h=700&fit=crop&auto=format"
              alt="Founder"
              className="w-full object-cover"
              style={{ aspectRatio: "4/5" }}
            />
            <div className="absolute -bottom-4 -right-4 border border-primary/20 w-full h-full pointer-events-none" style={{ zIndex: -1 }} />
          </FadeUp>
          <FadeUp delay={0.15}>
            <p className="text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Founder's Message</p>
            <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground leading-tight mb-6">
              「美しさとは、<br />
              <span className="italic text-primary">自分を愛すること</span>から始まる」
            </h2>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose mb-4">
              私がLUMIÈREを創設したのは、化粧品業界への疑問からでした。なぜ私たちは、肌に何を塗っているのか知らなければならないのでしょうか。なぜ美しくなるために地球を傷つけなければならないのでしょうか。
            </p>
            <p className="text-muted-foreground text-sm font-['Jost'] font-light leading-loose mb-8">
              プロヴァンスの野原で育った私は、自然の力を信じています。ラベンダーの一滴、バラの花びら一枚に、科学では測れない魔法が宿っています。LUMIÈREはその魔法を、すべての人に届けるために存在します。
            </p>
            <div className="border-l-2 border-primary/40 pl-6">
              <p className="font-['Cormorant_Garamond'] italic text-xl text-foreground">Sophie Leblanc</p>
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mt-1">Founder & Creative Director</p>
            </div>
          </FadeUp>
        </div>

        {/* Stats */}
        <FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/30 border border-border/30 mb-28">
            {[
              { num: "2008", label: "創業年" },
              { num: "98%", label: "天然成分使用率" },
              { num: "50+", label: "販売国数" },
              { num: "0", label: "カーボン排出量" },
            ].map((s) => (
              <div key={s.label} className="bg-background px-8 py-10 text-center">
                <p className="font-['Cormorant_Garamond'] text-4xl md:text-5xl text-primary mb-2">{s.num}</p>
                <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Timeline */}
        <FadeUp className="mb-28">
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">History</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground mb-14">
            LUMIÈREの<span className="italic text-primary">歩み</span>
          </h2>
          <div className="relative">
            <div className="absolute left-[60px] md:left-1/2 top-0 bottom-0 w-px bg-border/40" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.05 }}
                  className={`relative flex gap-8 md:gap-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`hidden md:block w-1/2 ${i % 2 === 0 ? "pr-16 text-right" : "pl-16"}`}>
                    <p className="font-['Cormorant_Garamond'] text-5xl text-primary/20">{m.year}</p>
                    {i % 2 !== 0 && (
                      <>
                        <p className="font-['Cormorant_Garamond'] text-xl text-foreground mb-2">{m.title}</p>
                        <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{m.desc}</p>
                      </>
                    )}
                    {i % 2 === 0 && (
                      <>
                        <p className="font-['Cormorant_Garamond'] text-xl text-foreground mb-2">{m.title}</p>
                        <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{m.desc}</p>
                      </>
                    )}
                  </div>
                  {/* Dot */}
                  <div className="absolute left-[52px] md:left-1/2 top-2 w-4 h-4 -translate-x-1/2 border-2 border-primary bg-background rounded-full" />
                  {/* Mobile */}
                  <div className="pl-20 md:hidden">
                    <p className="font-['Cormorant_Garamond'] text-3xl text-primary/30 mb-1">{m.year}</p>
                    <p className="font-['Cormorant_Garamond'] text-lg text-foreground mb-1">{m.title}</p>
                    <p className="text-xs text-muted-foreground font-['Jost'] font-light leading-relaxed">{m.desc}</p>
                  </div>
                  <div className="hidden md:block w-1/2" />
                </motion.div>
              ))}
            </div>
          </div>
        </FadeUp>

        {/* Values */}
        <FadeUp>
          <p className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground mb-2">Our Values</p>
          <h2 className="font-['Cormorant_Garamond'] text-4xl text-foreground mb-10">
            私たちが<span className="italic text-primary">大切にすること</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <FadeUp key={v.title} delay={i * 0.1}>
                <div className="border border-border/30 p-8 hover:border-primary/30 transition-colors duration-500 group">
                  <p className="text-primary text-2xl mb-4">{v.icon}</p>
                  <h3 className="font-['Cormorant_Garamond'] text-2xl text-foreground mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground font-['Jost'] font-light leading-loose">{v.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </FadeUp>
      </div>
    </div>
  );
}

const SEARCH_TAGS: Record<number, string[]> = {
  1: ["セラム", "美容液", "スキンケア", "ルミナス", "輝き", "保湿"],
  2: ["リップ", "口紅", "ヴェルヴェット", "ルージュ", "唇", "メイク"],
  3: ["プライマー", "ベース", "下地", "ファンデ", "グロウ", "化粧下地"],
  4: ["アイシャドウ", "パレット", "アイメイク", "夕暮れ", "目", "カラー"],
  5: ["トナー", "化粧水", "ミスト", "ローズ", "保湿", "うるおい"],
  6: ["ファンデーション", "リキッド", "ベースメイク", "カバー", "肌"],
  7: ["マスク", "パック", "フェイスマスク", "パール", "真珠", "スキンケア"],
  8: ["アイライナー", "アイライン", "ゴールド", "目元", "アイメイク"],
  9: ["香水", "パフューム", "フレグランス", "ノワール", "香り"],
  10: ["リップライナー", "リップ", "口紅", "サテン", "唇"],
  11: ["ハイライター", "ハイライト", "輝き", "シマー", "クリスタル"],
  12: ["セラム", "美容液", "ローズ", "バラ", "オイル", "スキンケア"],
};

function SearchModal() {
  const { searchOpen, setSearchOpen, addToCart, wishlist, toggleWish } = useContext(NavCtx);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 80);
    else setQuery("");
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  const results = query.trim().length === 0 ? [] : ALL_COLLECTION_PRODUCTS.filter((p) => {
    const q = query.toLowerCase();
    const tags = SEARCH_TAGS[p.id] ?? [];
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      tags.some((t) => t.includes(q))
    );
  });

  const POPULAR = ["セラム", "リップ", "アイシャドウ", "香水", "ファンデーション", "マスク"];

  if (!searchOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex flex-col">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSearchOpen(false)} />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 bg-card border-b border-border/40 shadow-2xl"
      >
        {/* Search input */}
        <div className="max-w-3xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 border-b border-border/50 pb-5">
            <Search size={18} className="text-primary flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="商品名、カテゴリー、キーワードで検索..."
              className="flex-1 bg-transparent text-foreground text-lg placeholder:text-muted-foreground/40 focus:outline-none font-['Jost'] font-light"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-primary transition-colors">
                <X size={16} />
              </button>
            )}
            <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-primary transition-colors ml-2">
              <X size={20} />
            </button>
          </div>

          {/* Popular tags */}
          {!query && (
            <div className="pt-4">
              <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-3">人気のキーワード</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-3 py-1.5 border border-border/40 text-[10px] tracking-widest text-muted-foreground hover:border-primary/50 hover:text-primary transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {query && (
            <div className="pt-4 max-h-[60vh] overflow-y-auto">
              {results.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted-foreground">「{query}」に一致する商品が見つかりませんでした</p>
                  <p className="text-[10px] text-muted-foreground/50 mt-2 tracking-wider">別のキーワードをお試しください</p>
                </div>
              ) : (
                <>
                  <p className="text-[9px] tracking-[0.35em] uppercase text-muted-foreground mb-4">
                    {results.length}件の検索結果
                  </p>
                  <div className="space-y-3 pb-2">
                    {results.map((product, i) => {
                      const liked = wishlist.some((w) => w.id === product.id);
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex gap-4 p-3 hover:bg-muted/30 transition-colors group"
                        >
                          <div className="w-16 h-20 flex-shrink-0 overflow-hidden bg-muted">
                            <img src={`${product.img.split("?")[0]}?w=120&h=150&fit=crop&auto=format`} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground">{product.category}</p>
                            <p className="font-['Cormorant_Garamond'] text-base text-foreground mt-0.5">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground font-light">{product.subtitle}</p>
                            <p className="text-primary text-sm font-['Cormorant_Garamond'] mt-1">{product.price}</p>
                          </div>
                          <div className="flex flex-col items-end justify-between py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleWish({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img, category: product.category })}
                              className={liked ? "text-primary" : "text-muted-foreground hover:text-primary transition-colors"}
                            >
                              <Heart size={14} className={liked ? "fill-primary" : ""} />
                            </button>
                            <button
                              onClick={() => { addToCart({ id: product.id, name: product.name, subtitle: product.subtitle, price: product.price, img: product.img }); setSearchOpen(false); }}
                              className="text-[9px] tracking-widest uppercase bg-primary text-primary-foreground px-3 py-1.5 hover:bg-accent transition-colors"
                            >
                              カートへ
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function WishlistDrawer() {
  const { wishlist, toggleWish, wishOpen, setWishOpen, addToCart, setCartOpen } = useContext(NavCtx);

  const handleMoveToCart = (item: WishItem) => {
    addToCart({ id: item.id, name: item.name, subtitle: item.subtitle, price: item.price, img: item.img });
    toggleWish(item);
    setWishOpen(false);
    setCartOpen(true);
  };

  return (
    <>
      {wishOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setWishOpen(false)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="relative w-full max-w-md bg-card flex flex-col h-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-foreground">お気に入り</h2>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
                  {wishlist.length} 点
                </p>
              </div>
              <button onClick={() => setWishOpen(false)} className="text-muted-foreground hover:text-primary transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <Heart size={40} className="text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground tracking-widest">お気に入りはまだありません</p>
                </div>
              ) : (
                wishlist.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 border-b border-border/20 pb-4"
                  >
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-muted">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="text-[9px] tracking-[0.25em] uppercase text-muted-foreground mb-0.5">{item.category}</p>
                        <p className="font-['Cormorant_Garamond'] text-base text-foreground leading-tight">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                        <p className="text-primary text-sm font-['Cormorant_Garamond'] mt-1">{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleMoveToCart(item)}
                          className="flex-1 py-2 bg-primary text-primary-foreground text-[9px] tracking-[0.2em] uppercase hover:bg-accent transition-colors"
                        >
                          カートに追加
                        </button>
                        <button
                          onClick={() => toggleWish(item)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {wishlist.length > 0 && (
              <div className="px-6 py-5 border-t border-border/40 space-y-3">
                <button
                  onClick={() => {
                    wishlist.forEach((item) => addToCart({ id: item.id, name: item.name, subtitle: item.subtitle, price: item.price, img: item.img }));
                    setWishOpen(false);
                    setCartOpen(true);
                  }}
                  className="w-full py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300"
                >
                  すべてカートに追加
                </button>
                <button
                  onClick={() => setWishOpen(false)}
                  className="w-full py-3 border border-border/40 text-muted-foreground text-xs tracking-[0.2em] uppercase hover:border-primary/40 hover:text-primary transition-colors"
                >
                  買い物を続ける
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, updateQty } = useContext(NavCtx);
  const total = cart.reduce((sum, i) => {
    const n = parseInt(i.price.replace(/[¥,]/g, ""));
    return sum + n * i.qty;
  }, 0);

  return (
    <>
      {cartOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            className="relative w-full max-w-md bg-card flex flex-col h-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
              <div>
                <h2 className="font-['Cormorant_Garamond'] text-2xl text-foreground">ショッピングカート</h2>
                <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mt-0.5">
                  {cart.reduce((s, i) => s + i.qty, 0)} 点
                </p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={40} className="text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground tracking-widest">カートは空です</p>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }}
                    className="flex gap-4"
                  >
                    <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-muted">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div>
                        <p className="font-['Cormorant_Garamond'] text-base text-foreground leading-tight">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{item.subtitle}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-border/40">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="w-6 text-center text-xs text-foreground">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-primary text-sm font-['Cormorant_Garamond']">{item.price}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground/40 hover:text-destructive transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-5 border-t border-border/40 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">小計</span>
                  <span className="font-['Cormorant_Garamond'] text-xl text-foreground">
                    ¥{total.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">配送料・税は購入手続き時に計算されます</p>
                <button className="w-full py-4 bg-primary text-primary-foreground text-xs tracking-[0.25em] uppercase hover:bg-accent transition-colors duration-300">
                  購入手続きへ進む
                </button>
                <button
                  onClick={() => setCartOpen(false)}
                  className="w-full py-3 border border-border/40 text-muted-foreground text-xs tracking-[0.2em] uppercase hover:border-primary/40 hover:text-primary transition-colors"
                >
                  買い物を続ける
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [initialCategory, setInitialCategory] = useState("すべて");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishItem[]>([]);
  const [wishOpen, setWishOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleWish = (product: WishItem) => {
    setWishlist((prev) =>
      prev.find((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [...prev, product]
    );
  };

  const addToCart = (product: Omit<CartItem, "qty">) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.flatMap((i) => {
        if (i.id !== id) return [i];
        const next = i.qty + delta;
        return next <= 0 ? [] : [{ ...i, qty: next }];
      })
    );
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  return (
    <NavCtx.Provider value={{ page, setPage, initialCategory, setInitialCategory, cart, addToCart, removeFromCart, updateQty, cartOpen, setCartOpen, wishlist, toggleWish, wishOpen, setWishOpen, searchOpen, setSearchOpen }}>
      <>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: marquee 24s linear infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        .float-anim {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.22; transform: scale(1.08); }
        }
        .orb-1 { animation: orbPulse 8s ease-in-out infinite; }
        .orb-2 { animation: orbPulse 10s ease-in-out infinite 2s; }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .scroll-line {
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes goldShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, #c9a84c 0%, #f5e09a 40%, #c9a84c 60%, #a07828 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: goldShimmer 4s linear infinite;
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); }
        body { font-family: 'Jost', sans-serif; }
      `}</style>

      <SearchModal />
      <WishlistDrawer />
      <CartDrawer />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
        <Nav />
        {page === "home" ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Hero />
            <MarqueeStrip />
            <Collections />
            <NewArrivals />
            <BrandStory />
            <Newsletter />
            <Footer />
          </motion.div>
        ) : page === "collections" ? (
          <motion.div
            key="collections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CollectionsPage />
          </motion.div>
        ) : page === "gift-sets" ? (
          <motion.div key="gift-sets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            <GiftSetsPage />
          </motion.div>
        ) : page === "new-arrivals" ? (
          <motion.div
            key="new-arrivals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <NewArrivalsPage />
          </motion.div>
        ) : page === "brand-story" ? (
          <motion.div
            key="brand-story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <BrandStoryPage />
          </motion.div>
        ) : page === "faq" ? (
          <motion.div
            key="faq"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <FAQPage />
          </motion.div>
        ) : page === "shipping" ? (
          <motion.div
            key="shipping"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ShippingPage />
          </motion.div>
        ) : page === "returns" ? (
          <motion.div
            key="returns"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ReturnsPage />
          </motion.div>
        ) : page === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <ContactPage />
          </motion.div>
        ) : page === "about" ? (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <AboutPage />
          </motion.div>
        ) : page === "sustainability" ? (
          <motion.div
            key="sustainability"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <SustainabilityPage />
          </motion.div>
        ) : page === "careers" ? (
          <motion.div
            key="careers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CareersPage />
          </motion.div>
        ) : page === "press" ? (
          <motion.div
            key="press"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PressPage />
          </motion.div>
        ) : page === "privacy" ? (
          <motion.div
            key="privacy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PrivacyPage />
          </motion.div>
        ) : (
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <CollectionDetailPage collectionKey={page as "skin-ritual" | "color-drama" | "fragrance"} />
          </motion.div>
        )}
      </div>
      </>
    </NavCtx.Provider>
  );
}
