export type LibraryBookStatus = "reading" | "read";

export interface LibraryBook {
  title: string;
  author: string;
  cover: string;
  source: string;
  status: LibraryBookStatus;
  edition?: string;
  coverFallbacks?: string[];
}

/**
 * Books in the library.
 *
 * `status: "reading"` controls which books appear first on the homepage.
 * The homepage shows the four books currently being read, followed by the
 * first book from the rest of the collection. The full Library page shows all
 * books in this list.
 *
 * Cover images use stable public catalogue/publisher image endpoints where
 * available. Malayalam titles use Malayalam-edition covers.
 */
export const library: LibraryBook[] = [
  {
    title: "A Woman Burnt",
    author: "Imayam",
    cover: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9789392099823/a-woman-burnt-9789392099823_hr.jpg",
    coverFallbacks: ["https://books.google.com/books/content?id=WvPREAAAQBAJ&printsec=frontcover&img=1&zoom=2&source=gbs_api"],
    source: "https://www.simonandschuster.co.in/books/A-Woman-Burnt/Imayam/9789392099816",
    status: "reading",
    edition: "Simon & Schuster India",
  },
  {
    title: "The Bandit Queens",
    author: "Parini Shroff",
    cover: "https://images.squarespace-cdn.com/content/v1/6893f6be8f54521d24bed60f/946717a9-a9d6-4abd-87be-7d10cb63ce56/9780593498972.jpg",
    coverFallbacks: ["https://covers.openlibrary.org/b/isbn/9780593498972-L.jpg"],
    source: "https://books.google.com/books/about/The_Bandit_Queens.html?id=yJ2OEAAAQBAJ",
    status: "reading",
    edition: "Ballantine Books",
  },
  {
    title: "Do We Care?",
    author: "K. Sujatha Rao",
    cover: "https://india.oup.com/covers/pdp/9780190125318",
    coverFallbacks: ["https://books.google.com/books/content?id=F3AEMQAACAAJ&printsec=frontcover&img=1&zoom=2&source=gbs_api", "https://covers.openlibrary.org/b/isbn/9780190125318-L.jpg"],
    source: "https://india.oup.com/product/do-we-care-oip-9780190125318",
    status: "reading",
    edition: "Oxford University Press",
  },
  {
    title: "Naked Statistics",
    author: "Charles Wheelan",
    cover: "https://books.google.co.in/books/publisher/content?id=QFqNEAAAQBAJ&img=1&imgtk=AFLRE73pf63k_ikFIfo--6Fq3yZM000_uU4cEABWBDOuqgwpffxKDiZ-nLFhdefAftExrb_lQB16lK0pV4tLfplhh5AoUc6CbPArIvu5Xe3WnarpSN16H9c_GQhP6275754hyIQaH6os&printsec=frontcover&zoom=1",
    coverFallbacks: ["https://covers.openlibrary.org/b/isbn/9780393347777-L.jpg"],
    source: "https://books.google.com/books/about/Naked_Statistics.html?id=QFqNEAAAQBAJ",
    status: "reading",
    edition: "W. W. Norton & Company",
  },
  {
    title: "Ghachar Ghochar",
    author: "Vivek Shanbhag",
    cover: "https://images1.penguinrandomhouse.com/cover/9780143111689",
    source: "https://www.penguinrandomhouse.com/books/539201/ghachar-ghochar-by-vivek-shanbhag/",
    status: "read",
    edition: "Penguin Books",
  },
  {
    title: "Good Material",
    author: "Dolly Alderton",
    cover: "https://images2.penguinrandomhouse.com/cover/9780593686959",
    source: "https://www.penguinrandomhouse.com/books/739897/good-material-a-read-with-jenna-pick-by-dolly-alderton/",
    status: "read",
    edition: "Vintage",
  },
  {
    title: "Teen Couple Have Fun Outdoors",
    author: "Aravind Jayan",
    cover: "https://books.google.com/books/content?id=GgZQEAAAQBAJ&printsec=frontcover&img=1&zoom=2&source=gbs_api",
    source: "https://books.google.com/books/about/Teen_Couple_Have_Fun_Outdoors.html?id=GgZQEAAAQBAJ",
    status: "read",
    edition: "Serpent's Tail",
  },
  {
    title: "Under One Roof",
    author: "Ali Hazelwood",
    cover: "https://images2.penguinrandomhouse.com/cover/9780593437810",
    source: "https://www.penguinrandomhouse.com/books/688518/under-one-roof-by-ali-hazelwood/",
    status: "read",
    edition: "Berkley",
  },
  {
    title: "ഒരു ദേശത്തിന്റെ കഥ",
    author: "എസ്. കെ. പൊറ്റെക്കാട്ട്",
    cover: "https://bf1af2.akinoncloudcdn.com/products/2024/12/09/220133/0b04d9a5-8912-4b76-9e58-738386645dca_size3840_cropCenter.jpg",
    source: "https://www.booklove.co.in/product-page/oru-desathinte-katha",
    status: "read",
    edition: "DC Books · Malayalam edition",
  },
  {
    title: "ആടുജീവിതം",
    author: "ബെന്യാമിൻ",
    cover: "https://bookplus.co.in/wp-content/uploads/2026/02/4d9e0b4d-03c5-40d9-aec0-bd057fa9c4f9.jpeg",
    source: "https://bookplus.co.in/books/aadu-jeevitham/",
    status: "read",
    edition: "DC Books · Malayalam edition",
  },
  {
    title: "ഖബർ",
    author: "കെ. ആർ. മീര",
    cover: "https://covers.openlibrary.org/b/isbn/9789353909079-L.jpg",
    source: "https://www.mbibooks.com/product/qubar/",
    status: "read",
    edition: "DC Books · Malayalam edition",
  },
];
