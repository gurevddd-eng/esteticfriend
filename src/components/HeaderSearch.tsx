"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { IconSearch } from "@/components/icons";
import { formatPrice } from "@/lib/format";

type SearchProduct = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  imageUrl: string | null;
  price: number | null;
  categoryName: string | null;
};

type SearchCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  products: SearchProduct[];
};

function SearchProductRow({
  product,
  onNavigate,
  onClose,
}: {
  product: SearchProduct;
  onNavigate?: () => void;
  onClose: () => void;
}) {
  const priceLabel = formatPrice(product.price);

  return (
    <li role="option">
      <Link
        href={`/product/${product.slug}`}
        className="site-header__search-item"
        onClick={() => {
          onClose();
          onNavigate?.();
        }}
      >
        <span className="site-header__search-thumb">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt=""
              width={44}
              height={44}
              className="object-contain"
            />
          ) : (
            <span className="site-header__search-thumb-empty" />
          )}
        </span>
        <span className="site-header__search-copy">
          {product.categoryName ? (
            <span className="site-header__search-category">{product.categoryName}</span>
          ) : null}
          <span className="site-header__search-name">{product.name}</span>
          <span className="site-header__search-desc">{product.shortDesc}</span>
        </span>
        <span className="site-header__search-price">{priceLabel ?? "По запросу"}</span>
      </Link>
    </li>
  );
}

export function HeaderSearch({
  className,
  inputId,
  onNavigate,
}: {
  className?: string;
  inputId?: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const fallbackId = useId();
  const fieldId = inputId ?? fallbackId;
  const listboxId = `${fieldId}-results`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const hasResults = categories.length > 0 || products.length > 0;

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setCategories([]);
      setProducts([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=8`);
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as {
          categories: SearchCategory[];
          products: SearchProduct[];
        };
        setCategories(data.categories);
        setProducts(data.products);
        setOpen(true);
      } catch {
        setCategories([]);
        setProducts([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  function goToSearchPage(value = query) {
    const trimmed = value.trim();
    if (!trimmed) return;
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    goToSearchPage();
  }

  return (
    <div
      ref={wrapRef}
      className={`site-header__search${className ? ` ${className}` : ""}`}
    >
      <form className="site-header__search-form" role="search" onSubmit={onSubmit}>
        <label htmlFor={fieldId} className="sr-only">
          Поиск по каталогу
        </label>
        <IconSearch size={16} className="site-header__search-icon" />
        <input
          id={fieldId}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          spellCheck={false}
          className="site-header__search-input"
          placeholder="Поиск"
          value={query}
          role="combobox"
          aria-expanded={open && hasResults}
          aria-controls={listboxId}
          aria-autocomplete="list"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => {
            if (hasResults) setOpen(true);
          }}
        />
        {loading ? <span className="site-header__search-status">...</span> : null}
      </form>

      {open && query.trim().length >= 2 ? (
        <div className="site-header__search-panel">
          {hasResults ? (
            <ul id={listboxId} className="site-header__search-list" role="listbox">
              {categories.map((category) => (
                <li key={category.id} className="site-header__search-group">
                  <Link
                    href={`/catalog/${category.slug}`}
                    className="site-header__search-group-head"
                    onClick={() => {
                      setOpen(false);
                      onNavigate?.();
                    }}
                  >
                    <span className="site-header__search-group-title">{category.name}</span>
                    <span className="site-header__search-group-meta">
                      {category.products.length
                        ? `${category.products.length} ${category.products.length === 1 ? "аппарат" : category.products.length < 5 ? "аппарата" : "аппаратов"}`
                        : "Категория"}
                      <span aria-hidden>→</span>
                    </span>
                  </Link>
                  {category.products.length ? (
                    <ul className="site-header__search-sublist">
                      {category.products.map((product) => (
                        <SearchProductRow
                          key={product.id}
                          product={product}
                          onNavigate={onNavigate}
                          onClose={() => setOpen(false)}
                        />
                      ))}
                    </ul>
                  ) : (
                    <p className="site-header__search-group-empty">
                      В этой категории пока нет аппаратов
                    </p>
                  )}
                </li>
              ))}

              {products.length ? (
                <li className="site-header__search-group">
                  {categories.length ? (
                    <div className="site-header__search-group-head site-header__search-group-head--static">
                      <span className="site-header__search-group-title">Аппараты</span>
                    </div>
                  ) : null}
                  <ul className="site-header__search-sublist">
                    {products.map((product) => (
                      <SearchProductRow
                        key={product.id}
                        product={product}
                        onNavigate={onNavigate}
                        onClose={() => setOpen(false)}
                      />
                    ))}
                  </ul>
                </li>
              ) : null}
            </ul>
          ) : (
            <p className="site-header__search-empty">Ничего не найдено</p>
          )}

          <button
            type="button"
            className="site-header__search-all"
            onClick={() => goToSearchPage()}
          >
            Все результаты по запросу «{query.trim()}»
            <span aria-hidden>→</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
