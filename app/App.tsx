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

type Page = "home" | "collections" | "skin-ritual" | "color-drama" | "fragrance";

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
    img: "https://images.unsplash.com/photo-1590156220728-bea5ba090f82?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1527632911563-ee5b6d53465b?w=600&h=700&fit=crop&auto=format",
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
  const { page, setPage, setInitialCategory, cart, setCartOpen, wishlist, setWishOpen } = useContext(NavCtx);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  const NAV_ITEMS: { label: string; category: string }[] = [
    { label: "スキンケア", category: "スキンケア" },
    { label: "メイクアップ", category: "すべて" },
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
            <button className="text-foreground/60 hover:text-primary transition-colors">
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
              { label: "メイクアップ", category: "すべて" },
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
              <button className="px-8 py-4 border border-border text-foreground/70 hover:text-primary hover:border-primary/40 text-xs tracking-[0.2em] uppercase transition-all duration-300">
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
            <div className="group relative overflow-hidden cursor-pointer h-full min-h-[280px] md:min-h-[320px]">
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
  return (
    <section className="relative overflow-hidden py-32">
      <div
        className="absolute inset-0 opacity-[0.04]"
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
          <button className="group flex items-center gap-3 text-xs tracking-[0.25em] uppercase text-primary hover:gap-4 transition-all duration-300">
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
            },
            {
              title: "サポート",
              links: ["よくある質問", "配送について", "返品・交換", "お問い合わせ"],
            },
            {
              title: "ブランド",
              links: ["私たちについて", "サステナビリティ", "採用情報", "プレス"],
            },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/80 mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
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
    img: "https://images.unsplash.com/photo-1739980296455-3f8d6051ca20?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1523634118614-82b2685ee3df?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1600634999623-864991678406?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1527632911563-ee5b6d53465b?w=600&h=700&fit=crop&auto=format",
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
    img: "https://images.unsplash.com/photo-1590156220728-bea5ba090f82?w=600&h=700&fit=crop&auto=format",
  },
];

const SORT_OPTIONS = ["おすすめ順", "新着順", "価格が低い順", "価格が高い順", "レビュー評価順"];
const CATEGORIES = ["すべて", "スキンケア", "ベースメイク", "リップ", "アイメイク", "フレグランス"];

function CollectionsPage() {
  const { setPage, initialCategory, addToCart } = useContext(NavCtx);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("おすすめ順");
  const [showSort, setShowSort] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);

  const filtered = ALL_COLLECTION_PRODUCTS.filter((p) =>
    activeCategory === "すべて" ? true : p.category === activeCategory
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
        { id: 7, name: "パールグロウ マスク", subtitle: "真珠の輝きパックマスク", price: "¥7,800", category: "スキンケア", rating: 4.7, reviews: 143, badge: "新作", img: "https://images.unsplash.com/photo-1739980296455-3f8d6051ca20?w=600&h=700&fit=crop&auto=format" },
        { id: 9, name: "ノワール パフューム", subtitle: "オードパルファム 50ml", price: "¥18,000", category: "フレグランス", rating: 4.9, reviews: 87, badge: "ベストセラー", img: "https://images.unsplash.com/photo-1600634999623-864991678406?w=600&h=700&fit=crop&auto=format" },
        { id: 12, name: "ローズ オイル セラム", subtitle: "バラオイル濃縮美容液", price: "¥14,500", category: "スキンケア", rating: 4.9, reviews: 176, badge: null, img: "https://images.unsplash.com/photo-1590156220728-bea5ba090f82?w=600&h=700&fit=crop&auto=format" },
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
        { id: 8, name: "ゴールド アイライナー", subtitle: "24K ゴールドリキッドライン", price: "¥3,800", category: "アイメイク", rating: 4.6, reviews: 198, badge: "限定", img: "https://images.unsplash.com/photo-1523634118614-82b2685ee3df?w=600&h=700&fit=crop&auto=format" },
        { id: 10, name: "サテン リップライナー", subtitle: "なめらかなリップライン", price: "¥2,900", category: "リップ", rating: 4.5, reviews: 312, badge: null, img: "https://images.unsplash.com/photo-1598452963314-b09f397a5c48?w=600&h=700&fit=crop&auto=format" },
        { id: 11, name: "クリスタル ハイライター", subtitle: "立体感を生む光のハイライト", price: "¥5,600", category: "ベースメイク", rating: 4.8, reviews: 224, badge: "人気", img: "https://images.unsplash.com/photo-1527632911563-ee5b6d53465b?w=600&h=700&fit=crop&auto=format" },
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
        { id: 9, name: "ノワール パフューム", subtitle: "オードパルファム 50ml", price: "¥18,000", category: "フレグランス", rating: 4.9, reviews: 87, badge: "ベストセラー", img: "https://images.unsplash.com/photo-1600634999623-864991678406?w=600&h=700&fit=crop&auto=format" },
        { id: 12, name: "ローズ オイル セラム", subtitle: "バラオイル濃縮美容液", price: "¥14,500", category: "スキンケア", rating: 4.9, reviews: 176, badge: null, img: "https://images.unsplash.com/photo-1590156220728-bea5ba090f82?w=600&h=700&fit=crop&auto=format" },
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
    <NavCtx.Provider value={{ page, setPage, initialCategory, setInitialCategory, cart, addToCart, removeFromCart, updateQty, cartOpen, setCartOpen, wishlist, toggleWish, wishOpen, setWishOpen }}>
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
