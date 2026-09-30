"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useAnimationControls, useInView, type LegacyAnimationControls as AnimationControls } from "motion/react";
import { BLUR_ENTRANCE, EASE_UI, cn, useBelowLg, useResolvedReducedMotion, withTempo } from "./rs-motion";

type IconDef = { d: string; vb: string };
type Owner = { color: string; initial: string; name: string };
type Card = { amount: string; company: string; date: string; days: string; note?: string; owner?: Owner };
type Column = { cards: Card[]; count: string; dotColor: string; faded?: boolean; title: string };
type Geo = { ARC_Y: number; CARD_H: number; ENTRANCE_Y: number; LIFT_Y: number; STACK_SHIFT: number; TRAVEL_DEMO_X: number; TRAVEL_PROPOSAL_X: number; TRAVEL_SLOT_Y: number };

const EASE = EASE_UI,
  TRAVEL_EASE: [number, number, number, number] = [0.45, 0, 0.2, 1],
  INK = "#101112",
  INK_SOFT = "rgba(0,0,0,0.63)",
  INK_MUTED = "rgba(0,0,0,0.5)",
  HAIRLINE = "rgba(0,0,0,0.06)",
  COLUMN_BG = "rgba(255,255,255,0.8)",
  CARDS_MASK: CSSProperties = {
    maskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)",
    WebkitMaskImage: "linear-gradient(to bottom, #000 82%, transparent 100%)",
  },
  ICON_CALENDAR: IconDef = {
    d: "M9 0C9.27614 0 9.5 0.223858 9.5 0.5V1.00586C9.75259 1.0107 9.97896 1.0195 10.1826 1.03613C10.6304 1.07272 11.0127 1.14901 11.3623 1.32715C11.9265 1.61472 12.3853 2.07347 12.6729 2.6377C12.851 2.98732 12.9273 3.36958 12.9639 3.81738C13 4.25934 13 4.80822 13 5.5V7.5C13 8.19178 13 8.74066 12.9639 9.18262C12.9273 9.63042 12.851 10.0127 12.6729 10.3623C12.3853 10.9265 11.9265 11.3853 11.3623 11.6729C11.0127 11.851 10.6304 11.9273 10.1826 11.9639C9.74066 12 9.19178 12 8.5 12H4.5C3.80822 12 3.25934 12 2.81738 11.9639C2.36958 11.9273 1.98732 11.851 1.6377 11.6729C1.07347 11.3853 0.614723 10.9265 0.327148 10.3623C0.149006 10.0127 0.0727196 9.63042 0.0361328 9.18262C2.78778e-05 8.74066 0 8.19178 0 7.5V5.5C0 4.80822 2.78778e-05 4.25934 0.0361328 3.81738C0.0727196 3.36958 0.149006 2.98732 0.327148 2.6377C0.614723 2.07347 1.07347 1.61472 1.6377 1.32715C1.98732 1.14901 2.36958 1.07272 2.81738 1.03613C3.02104 1.0195 3.24741 1.0107 3.5 1.00586V0.5C3.5 0.223858 3.72386 0 4 0C4.27614 0 4.5 0.223858 4.5 0.5V1H8.5V0.5C8.5 0.223858 8.72386 0 9 0ZM4.5 2.5C4.5 2.77614 4.27614 3 4 3C3.72386 3 3.5 2.77614 3.5 2.5V2.00586C3.27163 2.01028 3.07402 2.01788 2.89844 2.03223C2.51264 2.06377 2.27691 2.12345 2.0918 2.21777C1.71554 2.40951 1.40951 2.71554 1.21777 3.0918C1.12345 3.27691 1.06377 3.51264 1.03223 3.89844C1.00022 4.29023 1 4.79168 1 5.5V7.5C1 8.20832 1.00022 8.70977 1.03223 9.10156C1.06377 9.48736 1.12345 9.72309 1.21777 9.9082C1.40951 10.2845 1.71554 10.5905 2.0918 10.7822C2.27691 10.8765 2.51264 10.9362 2.89844 10.9678C3.29023 10.9998 3.79168 11 4.5 11H8.5C9.20832 11 9.70977 10.9998 10.1016 10.9678C10.4874 10.9362 10.7231 10.8765 10.9082 10.7822C11.2845 10.5905 11.5905 10.2845 11.7822 9.9082C11.8765 9.72309 11.9362 9.48736 11.9678 9.10156C11.9998 8.70977 12 8.20832 12 7.5V5.5C12 4.79168 11.9998 4.29023 11.9678 3.89844C11.9362 3.51264 11.8765 3.27691 11.7822 3.0918C11.5905 2.71554 11.2845 2.40951 10.9082 2.21777C10.7231 2.12345 10.4874 2.06377 10.1016 2.03223C9.92598 2.01788 9.72837 2.01028 9.5 2.00586V2.5C9.5 2.77614 9.27614 3 9 3C8.72386 3 8.5 2.77614 8.5 2.5V2H4.5V2.5ZM10 4C10.2761 4.00006 10.5 4.2239 10.5 4.5C10.5 4.77611 10.2761 4.99994 10 5H3C2.72386 5 2.5 4.77614 2.5 4.5C2.50001 4.22387 2.72386 4 3 4H10Z",
    vb: "0 0 13 12",
  },
  ICON_TASK: IconDef = {
    d: "M9.00098 0C10.6576 0.000263856 12.001 1.34331 12.001 3V9C12.001 10.6567 10.6576 11.9997 9.00098 12H3.00098C1.34412 12 0 10.6569 0 9V3C1.28853e-07 1.34315 1.34412 0 3.00098 0H9.00098ZM3.00098 1C1.89641 1 1.00098 1.89543 1.00098 3V9C1.00098 10.1046 1.89641 11 3.00098 11H9.00098C10.1053 10.9997 11.001 10.1044 11.001 9V3C11.001 1.89559 10.1053 1.00026 9.00098 1H3.00098ZM8.375 3.6709C8.55688 3.46337 8.87236 3.44227 9.08008 3.62402C9.28749 3.80584 9.30847 4.1214 9.12695 4.3291L6.33105 7.52441C5.75975 8.17733 4.75518 8.21096 4.1416 7.59766L2.89746 6.35352C2.7022 6.15825 2.7022 5.84175 2.89746 5.64648C3.09274 5.45147 3.40931 5.4513 3.60449 5.64648L4.84863 6.89062C5.05313 7.09484 5.38772 7.08365 5.57812 6.86621L8.375 3.6709Z",
    vb: "0 0 12.001 12",
  },
  ICON_CLOCK: IconDef = {
    d: "M5.5 0C8.53757 0 11 2.46243 11 5.5C11 8.53757 8.53757 11 5.5 11C2.46243 11 0 8.53757 0 5.5C0 2.46243 2.46243 0 5.5 0ZM5.5 1C3.01472 1 1 3.01472 1 5.5C1 7.98528 3.01472 10 5.5 10C7.98528 10 10 7.98528 10 5.5C10 3.01472 7.98528 1 5.5 1ZM5.5 2.5C5.77611 2.50003 6 2.72388 6 3V4.76953C5.99981 5.44899 5.44899 5.99982 4.76953 6H3C2.7239 5.99999 2.50005 5.77609 2.5 5.5C2.50001 5.22386 2.72386 5 3 5H4.76953C4.89671 4.99982 4.99981 4.8967 5 4.76953V3C5 2.72386 5.22386 2.5 5.5 2.5Z",
    vb: "0 0 11 11",
  },
  ICON_CHAT: IconDef = {
    d: "M6.75 1.29242e-06C7.32562 1.5359e-05 7.78272 0.000161979 8.15235 0.0253919C8.52631 0.0509378 8.84773 0.103946 9.14844 0.228517C9.88334 0.533021 10.467 1.11761 10.7715 1.85254C10.896 2.15323 10.9491 2.47468 10.9746 2.84863C10.9899 3.07272 10.9946 3.32885 10.9971 3.62402C12.1525 4.03115 12.9518 5.10432 12.998 6.33985C13.0002 6.39787 13 6.46176 13 6.56152V10.0107C13 10.4859 13.0005 10.8773 12.9727 11.1816C12.9452 11.4809 12.8846 11.787 12.6963 12.0361C12.4318 12.3858 12.0275 12.6026 11.5898 12.6289C11.278 12.6475 10.9899 12.528 10.7256 12.3848C10.4568 12.2391 10.131 12.0216 9.73535 11.7578L9.62598 11.6846C9.46232 11.5755 9.4286 11.5556 9.39746 11.542C9.36158 11.5263 9.3237 11.5147 9.28516 11.5078C9.25165 11.5018 9.21276 11.5 9.01563 11.5H5.5C4.08445 11.5 2.90052 10.5191 2.58496 9.2002C2.47343 9.26966 2.37074 9.33257 2.27442 9.38477C2.01009 9.528 1.72203 9.64753 1.41016 9.62891C0.972626 9.60265 0.568231 9.38662 0.303713 9.03711C0.115269 8.78799 0.0547967 8.48195 0.0273454 8.18262C-0.000548325 7.87815 1.51313e-06 7.48631 1.6013e-06 7.01074V4.5C1.56567e-06 3.80824 2.58666e-05 3.25933 0.0361344 2.81738C0.0727235 2.36959 0.149008 1.98731 0.32715 1.6377C0.614731 1.0735 1.07349 0.61471 1.6377 0.32715C1.98732 0.149016 2.36958 0.072711 2.81738 0.0361341C3.25933 3.59539e-05 3.80823 -1.56449e-05 4.5 1.29242e-06H6.75ZM10.998 4.71875C10.9965 5.08175 10.9926 5.38919 10.9746 5.65235C10.9491 6.02643 10.8961 6.34766 10.7715 6.64844C10.467 7.38341 9.8834 7.96797 9.14844 8.27246C8.84762 8.39707 8.52551 8.45007 8.15137 8.47559C7.78186 8.50076 7.32529 8.50002 6.75 8.5H3.98438C3.78717 8.5 3.74836 8.50184 3.71485 8.50781C3.67626 8.5147 3.63846 8.52631 3.60254 8.54199C3.58242 8.55079 3.56142 8.5623 3.50488 8.59863C3.55625 9.65741 4.4285 10.5 5.5 10.5H9.01563C9.17844 10.5 9.32038 10.4984 9.46094 10.5234C9.57646 10.5441 9.68931 10.5781 9.79688 10.625C9.92771 10.6821 10.0452 10.7623 10.1807 10.8525L10.29 10.9258C10.7022 11.2005 10.9832 11.3872 11.2022 11.5059C11.4252 11.6267 11.5072 11.6322 11.5303 11.6309C11.6759 11.622 11.8103 11.5498 11.8984 11.4336C11.9125 11.4149 11.9534 11.3432 11.9766 11.0908C11.9993 10.8429 12 10.5059 12 10.0107V6.56152C12 6.45391 12.0003 6.41274 11.999 6.37793C11.9729 5.67895 11.5855 5.0569 10.998 4.71875ZM4.5 1C3.79172 0.999984 3.29023 1.00023 2.89844 1.03223C2.51266 1.06376 2.27691 1.12346 2.0918 1.21777C1.71556 1.4095 1.40952 1.71557 1.21778 2.0918C1.12346 2.2769 1.06377 2.51269 1.03223 2.89844C1.00022 3.29022 1 3.79174 1 4.5V7.01074C1 7.50605 1.00074 7.84286 1.02344 8.09082C1.04661 8.34374 1.08759 8.4151 1.10156 8.4336C1.18967 8.54989 1.32409 8.62203 1.46973 8.63086C1.49282 8.63224 1.57542 8.62693 1.79883 8.50586C2.01771 8.3872 2.29796 8.20045 2.70996 7.92578L2.81934 7.85254C2.95482 7.76222 3.07225 7.68311 3.20313 7.62598C3.31097 7.57893 3.42421 7.54408 3.54004 7.52344C3.68045 7.49847 3.82175 7.5 3.98438 7.5H6.75C7.33922 7.50002 7.75631 7.49989 8.08399 7.47754C8.40708 7.45549 8.60701 7.41434 8.76563 7.34863C9.25563 7.14565 9.64467 6.75563 9.84766 6.26563C9.91333 6.10701 9.95549 5.90708 9.97754 5.58399C9.99988 5.25632 10 4.83914 10 4.25C10 3.66085 9.9999 3.24366 9.97754 2.91602C9.95548 2.59301 9.91335 2.39297 9.84766 2.23438C9.64465 1.7446 9.25544 1.35529 8.76563 1.15235C8.607 1.08663 8.40715 1.04452 8.08399 1.02246C7.7563 1.0001 7.33929 1.00002 6.75 1H4.5Z",
    vb: "0 0 13 12.6308",
  },
  ICON_DOLLAR: IconDef = {
    d: "M6.5 0C10.0899 0 13 2.91015 13 6.5C13 10.0899 10.0899 13 6.5 13C2.91015 13 0 10.0899 0 6.5C0 2.91015 2.91015 0 6.5 0ZM6.5 1C3.46243 1 1 3.46243 1 6.5C1 9.53757 3.46243 12 6.5 12C9.53757 12 12 9.53757 12 6.5C12 3.46243 9.53757 1 6.5 1ZM6.5 2.59277C6.7761 2.59285 7 2.81669 7 3.09277V3.54004C7.19446 3.56997 7.38523 3.6162 7.56543 3.68164C7.98736 3.8349 8.40148 4.10673 8.63281 4.53711C8.76335 4.7803 8.67186 5.08317 8.42871 5.21387C8.18564 5.34436 7.88276 5.25361 7.75195 5.01074C7.67564 4.86878 7.5055 4.7242 7.22461 4.62207C6.94833 4.52171 6.61078 4.48029 6.28418 4.50879C5.95403 4.53764 5.67604 4.63412 5.49512 4.76562C5.32859 4.88678 5.25 5.02854 5.25 5.21191C5.25 5.351 5.28366 5.42426 5.31641 5.46973C5.35321 5.52067 5.41954 5.5777 5.54297 5.63379C5.81335 5.75666 6.19761 5.81074 6.69434 5.87988C7.14187 5.94218 7.6987 6.01879 8.1377 6.23828C8.36901 6.35397 8.59189 6.52081 8.75488 6.76562C8.91995 7.01362 9 7.30684 9 7.63574C8.99996 8.23207 8.69289 8.69289 8.27344 8.99609C7.91192 9.2574 7.45962 9.40988 7 9.46973V9.90723C7 10.1834 6.77614 10.4072 6.5 10.4072C6.22391 10.4072 6 10.1833 6 9.90723V9.45508C5.20769 9.33086 4.41791 8.92977 4.04688 8.13281C3.93036 7.88248 4.03874 7.58529 4.28906 7.46875C4.53939 7.35223 4.83658 7.46062 4.95312 7.71094C5.20129 8.24398 5.93417 8.55473 6.74219 8.49219C7.12823 8.46225 7.4634 8.34752 7.6875 8.18555C7.90075 8.03141 7.99996 7.84993 8 7.63574C8 7.47323 7.9628 7.37933 7.92285 7.31934C7.88077 7.25614 7.81065 7.19294 7.69043 7.13281C7.42645 7.00082 7.04544 6.93927 6.55566 6.87109C6.11495 6.80975 5.56153 6.74152 5.12891 6.54492C4.90077 6.44125 4.67414 6.28865 4.50586 6.05566C4.33361 5.81718 4.25 5.53183 4.25 5.21191C4.25 4.65855 4.52471 4.23408 4.90723 3.95605C5.22232 3.72703 5.61048 3.5945 6 3.53613V3.09277C6.00007 2.81677 6.22405 2.59293 6.5 2.59277Z",
    vb: "0 0 13 13",
  },
  ICON_DEAL: IconDef = {
    d: "M9.2002 0C10.213 5.36856e-05 11.1813 0.41565 11.8926 1.14941C12.6033 1.88267 13 2.87389 13 3.9043C12.9999 5.54247 11.9508 6.75532 11.0557 7.66016L11.0547 7.65918L7.91992 10.8945C7.13769 11.7015 5.86231 11.7015 5.08008 10.8945L1.94141 7.65625V7.65527C1.03785 6.75345 5.16547e-05 5.54436 0 3.9043C0 2.87389 0.396732 1.88267 1.10742 1.14941C1.81873 0.41565 2.78695 5.32947e-05 3.7998 0C4.37955 0 4.90311 0.085397 5.41309 0.314453C5.79173 0.484575 6.1459 0.725904 6.5 1.04297C6.8541 0.725905 7.20827 0.484575 7.58691 0.314453C8.09689 0.0853974 8.62045 0 9.2002 0ZM3.7998 1C3.06237 1.00005 2.35153 1.30177 1.8252 1.84473C1.2983 2.38826 1 3.12913 1 3.9043C1.00005 4.957 1.58059 5.81925 2.3252 6.61621L2.65332 6.9541L2.65918 6.95996L5.79883 10.1992C6.18805 10.6002 6.81195 10.6002 7.20117 10.1992L7.60156 9.78516L6.73828 8.89551C6.54609 8.69725 6.55176 8.38068 6.75 8.18848C6.94827 7.99627 7.26483 8.00095 7.45703 8.19922L8.29785 9.06641L9.40234 7.92773L8.53906 7.03711C8.3472 6.83881 8.35263 6.52217 8.55078 6.33008C8.74908 6.13822 9.06572 6.14364 9.25781 6.3418L10.0986 7.20898L10.3408 6.95996L10.3447 6.95703C10.6345 6.66412 10.9097 6.36493 11.1504 6.05469L9.69824 4.70996L9.69727 4.70801C9.47712 4.50194 9.19283 4.38965 8.90137 4.38965C8.60999 4.38971 8.32654 4.502 8.10645 4.70801L6.86621 5.88184L6.8623 5.88574C6.14323 6.55078 5.04647 6.528 4.36328 5.82324V5.82227C4.19629 5.65071 4.06439 5.44802 3.97461 5.22559C3.88449 5.0023 3.83791 4.76345 3.83789 4.52246C3.83789 4.2815 3.88453 4.04261 3.97461 3.81934C4.06454 3.59652 4.19589 3.39245 4.36328 3.2207L5.78809 1.75C5.51014 1.50704 5.25595 1.33982 5.00391 1.22656C4.653 1.0689 4.27592 1 3.7998 1ZM9.2002 1C8.72408 1 8.347 1.0689 7.99609 1.22656C7.64147 1.38592 7.28145 1.65057 6.85938 2.08594C6.85476 2.09069 6.84853 2.09408 6.84375 2.09863L5.08203 3.91699L5.08008 3.91895C5.00439 3.99655 4.9432 4.0897 4.90137 4.19336C4.85951 4.29715 4.83789 4.40917 4.83789 4.52246C4.83791 4.63577 4.85947 4.74776 4.90137 4.85156C4.94323 4.95526 5.00434 5.04835 5.08008 5.12598L5.08203 5.12793C5.38284 5.43777 5.85786 5.45165 6.18262 5.15137L7.4209 3.97949L7.42285 3.97754C7.82526 3.60091 8.35221 3.38971 8.90137 3.38965C9.45004 3.38965 9.9766 3.60062 10.3789 3.97656L11.6934 5.19434C11.885 4.79312 12 4.36709 12 3.9043C12 3.12913 11.7017 2.38826 11.1748 1.84473C10.6485 1.30177 9.93763 1.00005 9.2002 1Z",
    vb: "0 0 13 11.4997",
  },
  ICON_DOC: IconDef = {
    d: "M6.00586 2.13756e-05C6.34892 2.13502e-05 6.60216 -0.00277745 6.8457 0.0556854C7.04966 0.104676 7.24497 0.185352 7.42383 0.294943C7.63728 0.425792 7.81417 0.607158 8.05664 0.849631L10.1504 2.94338C10.3929 3.18585 10.5742 3.36278 10.7051 3.57619C10.8147 3.75502 10.8953 3.95039 10.9443 4.15432C11.0028 4.39783 11 4.65118 11 4.99416V8.50002C11 9.1917 11 9.74072 10.9639 10.1826C10.9273 10.6304 10.8509 11.0127 10.6729 11.3623C10.3853 11.9265 9.92649 12.3853 9.3623 12.6729C9.01269 12.851 8.63041 12.9273 8.18262 12.9639C7.74066 13 7.19178 13 6.5 13H4.5C3.80821 13 3.25933 13 2.81738 12.9639C2.36959 12.9273 1.98732 12.851 1.6377 12.6729C1.07352 12.3853 0.614705 11.9265 0.327148 11.3623C0.149089 11.0128 0.0727218 10.6304 0.0361329 10.1826C4.00574e-05 9.74046 3.45392e-06 9.19031 5.69679e-08 8.49807V4.50197C-3.36292e-06 3.80974 3.09509e-05 3.25957 0.0361329 2.8174C0.0727306 2.36963 0.149062 1.98723 0.327148 1.63772C0.614727 1.07357 1.07353 0.614715 1.6377 0.32717C1.9873 0.149058 2.36962 0.0727382 2.81738 0.0361542C3.25933 5.11879e-05 3.80823 2.13756e-05 4.5 2.13756e-05H6.00586ZM4.5 1.00002C3.7917 1.00002 3.29023 1.00024 2.89844 1.03225C2.51269 1.06378 2.2769 1.1235 2.0918 1.21779C1.7156 1.4095 1.40951 1.71564 1.21777 2.09182C1.12347 2.27691 1.06377 2.5133 1.03223 2.89944C1.00025 3.29142 0.999997 3.79346 1 4.50197V8.49807C1 9.20657 1.00026 9.70861 1.03223 10.1006C1.06376 10.4868 1.1235 10.7231 1.21777 10.9082C1.40949 11.2845 1.71559 11.5905 2.0918 11.7822C2.2769 11.8766 2.51267 11.9363 2.89844 11.9678C3.29023 11.9998 3.79171 12 4.5 12H6.5C7.20831 12 7.70977 11.9998 8.10156 11.9678C8.48735 11.9363 8.72309 11.8766 8.9082 11.7822C9.28442 11.5905 9.59051 11.2844 9.78223 10.9082C9.8765 10.7231 9.93624 10.4873 9.96777 10.1016C9.99977 9.70982 10 9.20822 10 8.50002V4.99416C10 4.60364 9.99707 4.4894 9.97266 4.38772C9.94815 4.28579 9.90731 4.18804 9.85254 4.09865C9.7979 4.0096 9.71928 3.92633 9.44336 3.65041L7.34961 1.55666C7.07362 1.28068 6.99047 1.20212 6.90137 1.14748C6.81195 1.0927 6.71427 1.05186 6.6123 1.02737C6.51061 1.00296 6.39649 1.00002 6.00586 1.00002H4.5ZM6.5 2.00002C6.77609 2.00002 6.99991 2.22396 7 2.50002V3.50002C7 3.77616 7.22386 4.00002 7.5 4.00002H8.5C8.77609 4.00002 8.99991 4.22396 9 4.50002C9 4.77616 8.77614 5.00002 8.5 5.00002H7.5C6.67157 5.00002 6 4.32845 6 3.50002V2.50002C6.00009 2.22396 6.22391 2.00002 6.5 2.00002Z",
    vb: "0 0 11 13",
  },
  ICON_USER: IconDef = {
    d: "M6.38867 7C8.38295 7 9.99987 8.61708 10 10.6113C9.99988 11.3782 9.37822 11.9999 8.61133 12H1.38867C0.621782 11.9999 0.00011723 11.3782 0 10.6113C0.000131955 8.61708 1.61705 7 3.61133 7H6.38867ZM3.61133 8C2.16933 8 1.00013 9.16936 1 10.6113C1.00012 10.8259 1.17407 10.9999 1.38867 11H8.61133C8.82593 10.9999 8.99988 10.8259 9 10.6113C8.99987 9.16936 7.83067 8 6.38867 8H3.61133ZM5.10059 0C6.61931 6.59696e-05 7.85059 1.23126 7.85059 2.75C7.85059 4.26874 6.61931 5.49993 5.10059 5.5C3.5818 5.5 2.35059 4.26878 2.35059 2.75C2.35059 1.23122 3.5818 0 5.10059 0ZM5.10059 1C4.13409 1 3.35059 1.7835 3.35059 2.75C3.35059 3.7165 4.13409 4.5 5.10059 4.5C6.06703 4.49993 6.85059 3.71646 6.85059 2.75C6.85059 1.78354 6.06703 1.00007 5.10059 1Z",
    vb: "0 0 10 12",
  },
  ICON_PLUS: IconDef = {
    d: "M7 2.5C7.27614 2.5 7.5 2.72386 7.5 3V6.5H11C11.2761 6.5 11.5 6.72386 11.5 7C11.5 7.27614 11.2761 7.5 11 7.5H7.5V11C7.5 11.2761 7.27614 11.5 7 11.5C6.72386 11.5 6.5 11.2761 6.5 11V7.5H3C2.72386 7.5 2.5 7.27614 2.5 7C2.5 6.72386 2.72386 6.5 3 6.5H6.5V3C6.5 2.72386 6.72386 2.5 7 2.5Z",
    vb: "0 0 14 14",
  },
  ICON_NOTE: IconDef = {
    d: "M8.5 0C9.19178 0 9.74066 2.78582e-05 10.1826 0.0361328C10.6304 0.0727196 11.0127 0.149006 11.3623 0.327148C11.9265 0.614723 12.3853 1.07347 12.6729 1.6377C12.851 1.98732 12.9273 2.36958 12.9639 2.81738C13 3.25934 13 3.80822 13 4.5V6.5C13 7.19178 13 7.74066 12.9639 8.18262C12.9273 8.63042 12.851 9.01268 12.6729 9.3623C12.3853 9.92653 11.9265 10.3853 11.3623 10.6729C11.0127 10.851 10.6304 10.9273 10.1826 10.9639C9.74066 11 9.19178 11 8.5 11H4.5C3.80822 11 3.25934 11 2.81738 10.9639C2.36958 10.9273 1.98732 10.851 1.6377 10.6729C1.07347 10.3853 0.614723 9.92653 0.327148 9.3623C0.149006 9.01268 0.0727196 8.63042 0.0361328 8.18262C2.78972e-05 7.74066 0 7.19178 0 6.5V4.5C0 3.80822 2.78804e-05 3.25934 0.0361328 2.81738C0.0727196 2.36958 0.149006 1.98732 0.327148 1.6377C0.614723 1.07347 1.07347 0.614723 1.6377 0.327148C1.98732 0.149006 2.36958 0.0727196 2.81738 0.0361328C3.25934 2.78804e-05 3.80822 0 4.5 0H8.5ZM4.5 1C3.79168 1 3.29023 1.00022 2.89844 1.03223C2.51264 1.06377 2.27691 1.12345 2.0918 1.21777C1.71554 1.40951 1.40951 1.71554 1.21777 2.0918C1.12345 2.27691 1.06377 2.51264 1.03223 2.89844C1.00022 3.29023 1 3.79168 1 4.5V6.5C1 7.20832 1.00022 7.70977 1.03223 8.10156C1.06377 8.48736 1.12345 8.72309 1.21777 8.9082C1.40951 9.28446 1.71554 9.59049 2.0918 9.78223C2.27691 9.87655 2.51264 9.93623 2.89844 9.96777C3.29023 9.99978 3.79168 10 4.5 10H8.5C9.20832 10 9.70977 9.99978 10.1016 9.96777C10.4874 9.93623 10.7231 9.87655 10.9082 9.78223C11.2845 9.59049 11.5905 9.28446 11.7822 8.9082C11.8765 8.72309 11.9362 8.48736 11.9678 8.10156C11.9998 7.70977 12 7.20832 12 6.5V4.5C12 3.79168 11.9998 3.29023 11.9678 2.89844C11.9362 2.51264 11.8765 2.27691 11.7822 2.0918C11.5905 1.71554 11.2845 1.40951 10.9082 1.21777C10.7231 1.12345 10.4874 1.06377 10.1016 1.03223C9.70977 1.00022 9.20832 1 8.5 1H4.5ZM4.5 2.5C4.70445 2.5 4.88794 2.62462 4.96387 2.81445L6.96387 7.81445C7.06642 8.07084 6.94194 8.36131 6.68555 8.46387C6.42916 8.56642 6.13869 8.44194 6.03613 8.18555L5.55957 6.99414C5.53995 6.99648 5.52025 7 5.5 7H3.5C3.47941 7 3.45939 6.99656 3.43945 6.99414L2.96387 8.18555C2.86131 8.44194 2.57084 8.56642 2.31445 8.46387C2.05806 8.36131 1.93358 8.07084 2.03613 7.81445L4.03613 2.81445L4.06934 2.74609C4.15822 2.59524 4.3212 2.5 4.5 2.5ZM10.5 6C10.7761 6 11 6.22386 11 6.5C11 6.77614 10.7761 7 10.5 7H8.5C8.22386 7 8 6.77614 8 6.5C8 6.22386 8.22386 6 8.5 6H10.5ZM3.83789 6H5.16211L4.5 4.34473L3.83789 6ZM10.5 4C10.7761 4 11 4.22386 11 4.5C11 4.77614 10.7761 5 10.5 5H8.5C8.22386 5 8 4.77614 8 4.5C8 4.22386 8.22386 4 8.5 4H10.5Z",
    vb: "0 0 13 11",
  };
function Icon({ className: e, icon: a, style: s }: { className?: string; icon: IconDef; style?: CSSProperties }) {
  return (
    <svg
      viewBox={a.vb}
      fill="currentColor"
      aria-hidden="true"
      className={cn("block shrink-0", e)}
      style={s}
    >
      <path d={a.d} />
    </svg>
  );
}
const COLUMNS: Column[] = [
  {
    cards: [
      {
        amount: "$20,800",
        company: "Lumio AI",
        date: "Sep 30, 2026",
        days: "12d",
        note: "Set Next step...",
        owner: {
          color: "#9b69ff",
          initial: "A",
          name: "Amelia Carter",
        },
      },
      {
        amount: "$36,400",
        company: "Verda Labs",
        date: "Sep 10, 2026",
        days: "15d",
        note: "Scheduling demo",
        owner: {
          color: "#ff5454",
          initial: "G",
          name: "George Hall",
        },
      },
    ],
    count: "2",
    dotColor: "#f97514",
    title: "Discovery",
  },
  {
    cards: [
      {
        amount: "$54,000",
        company: "Cortexa",
        date: "Aug 28, 2026",
        days: "7d",
        note: "Demo went well, sending fo...",
        owner: {
          color: "#00d17e",
          initial: "T",
          name: "Theo Marshall",
        },
      },
    ],
    count: "1",
    dotColor: "#266df0",
    title: "Demo",
  },
  {
    cards: [
      {
        amount: "$31,200",
        company: "Driftwave",
        date: "Jul 31, 2026",
        days: "22d",
        note: "Proposal sent, in procurem...",
        owner: {
          color: "#266df0",
          initial: "N",
          name: "Nathan Cole",
        },
      },
      {
        amount: "$62,500",
        company: "Synthred",
        date: "Aug 12, 2026",
        days: "25d",
        note: "Security review underway",
        owner: {
          color: "#9b69ff",
          initial: "I",
          name: "Isla Harrington",
        },
      },
      {
        amount: "$11,000",
        company: "Pinevox",
        date: "Jul 20, 2026",
        days: "9d",
        owner: {
          color: "#eb5faa",
          initial: "R",
          name: "Rachel Adams",
        },
      },
    ],
    count: "3",
    dotColor: "#9b69ff",
    title: "Proposal",
  },
  {
    cards: [
      {
        amount: "$78,000",
        company: "Northpeak",
        date: "Jun 30, 2026",
        days: "31d",
        note: "Verbal yes, drafting contract",
        owner: {
          color: "#f97514",
          initial: "S",
          name: "Samuel",
        },
      },
      {
        amount: "$26,400",
        company: "Westwind",
        date: "Jul 8, 2026",
        days: "18d",
        note: "Finalizing terms",
        owner: {
          color: "#9b69ff",
          initial: "P",
          name: "Paul",
        },
      },
    ],
    count: "2",
    dotColor: "#00d17e",
    faded: true,
    title: "Negotiation",
  },
];
function TextRow({ children: e, icon: a, muted: s }: { children: ReactNode; icon: IconDef; muted?: boolean }) {
  return (
    <div className="flex h-[16px] w-[114px] items-center gap-[5px] lg:h-[32px] lg:w-[228px] lg:gap-[10px]">
      <Icon
        icon={a}
        className="size-[7px] lg:size-[14px]"
        style={{
          color: INK_MUTED,
        }}
      />
      <div
        className="min-w-px flex-1 truncate font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
        style={{
          color: s ? INK_MUTED : INK,
        }}
      >
        {e}
      </div>
    </div>
  );
}
function AmountRow({ amount: e }: { amount: string }) {
  return (
    <div className="flex h-[16px] w-[114px] items-center gap-[5px] lg:h-[32px] lg:w-[228px] lg:gap-[10px]">
      <Icon
        icon={ICON_DOLLAR}
        className="size-[7px] lg:size-[14px]"
        style={{
          color: INK_MUTED,
        }}
      />
      <div className="flex min-w-px flex-1 items-center gap-[3px] lg:gap-[6px]">
        <span
          className="font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
          style={{
            color: INK_SOFT,
          }}
        >
          {"USD"}
        </span>
        <span
          className="truncate font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
          style={{
            color: INK,
          }}
        >
          {e}
        </span>
      </div>
    </div>
  );
}
function OwnerRow({ owner: e }: { owner: Owner }) {
  return (
    <div className="flex h-[16px] w-[114px] items-center gap-[5px] lg:h-[32px] lg:w-[228px] lg:gap-[10px]">
      <Icon
        icon={ICON_USER}
        className="size-[7px] lg:size-[14px]"
        style={{
          color: INK_MUTED,
        }}
      />
      <div className="flex min-w-px flex-1 items-center gap-[2.5px] lg:gap-[5px]">
        <span
          className="flex size-[8px] shrink-0 items-center justify-center rounded-full border font-medium text-[4px] text-white-100 uppercase leading-none lg:size-[16px] lg:text-[8px]"
          style={{
            backgroundColor: e.color,
            borderColor: HAIRLINE,
          }}
        >
          {e.initial}
        </span>
        <span
          className="truncate font-medium text-[7px] leading-[10px] tracking-[-0.07px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
          style={{
            color: INK,
          }}
        >
          {e.name}
        </span>
      </div>
    </div>
  );
}
function ToolButton({ icon: e }: { icon: IconDef }) {
  return (
    <div className="flex h-[14px] min-w-[14px] items-center justify-center rounded-[4px] px-[3.5px] lg:h-[28px] lg:min-w-[28px] lg:rounded-[8px] lg:px-[7px]">
      <Icon
        icon={e}
        className="size-[7px] lg:size-[14px]"
        style={{
          color: INK_SOFT,
        }}
      />
    </div>
  );
}
function DealCard({ card: e }: { card: Card }) {
  return (
    <div
      className="flex w-[124px] flex-col items-start rounded-[6px] border bg-white-100 pt-[3px] lg:w-[248px] lg:rounded-[12px] lg:pt-[6px]"
      style={{
        borderColor: HAIRLINE,
      }}
    >
      <div className="flex flex-col items-start pr-[4px] pl-[6px] lg:pr-[8px] lg:pl-[12px]">
        <div className="flex h-[16px] w-[114px] items-center gap-[5px] lg:h-[32px] lg:w-[228px] lg:gap-[10px]">
          <Icon
            icon={ICON_DEAL}
            className="size-[7px] lg:size-[14px]"
            style={{
              color: INK_MUTED,
            }}
          />
          <span
            className="min-w-px flex-1 truncate font-medium text-[7px] leading-[10px] tracking-[-0.07px] underline lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.14px]"
            style={{
              color: INK,
              textDecorationColor: "#a2a4a7",
            }}
          >
            {e.company}
          </span>
        </div>
        <TextRow icon={ICON_CALENDAR}>{e.date}</TextRow>
        <AmountRow amount={e.amount} />
        {e.owner ? (
          <OwnerRow owner={e.owner} />
        ) : (
          <TextRow icon={ICON_USER} muted={true}>
            {"Set owner..."}
          </TextRow>
        )}
        <TextRow icon={ICON_NOTE} muted={true}>
          {e.note ?? "Add note..."}
        </TextRow>
      </div>
      <div className="flex h-[20px] w-full items-center justify-between px-[3px] lg:h-[40px] lg:px-[6px]">
        <div className="flex items-center gap-[2px] lg:gap-[4px]">
          <ToolButton icon={ICON_DOC} />
          <ToolButton icon={ICON_TASK} />
          <ToolButton icon={ICON_CHAT} />
        </div>
        <div className="flex h-[14px] items-center gap-[1px] rounded-[3px] px-[3px] lg:h-[28px] lg:gap-[2px] lg:rounded-[6px] lg:px-[6px]">
          <Icon
            icon={ICON_CLOCK}
            className="size-[6px] lg:size-[12px]"
            style={{
              color: INK_MUTED,
            }}
          />
          <span
            className="font-medium text-[6px] leading-[8px] lg:text-[12px] lg:leading-[16px]"
            style={{
              color: INK_MUTED,
            }}
          >
            {e.days}
          </span>
        </div>
      </div>
    </div>
  );
}
function ColumnHeader({ column: e }: { column: Column }) {
  return (
    <div className="flex h-[18px] w-[124px] shrink-0 items-center gap-[3px] self-center px-[4px] lg:h-[36px] lg:w-[248px] lg:gap-[6px] lg:px-[8px]">
      <div className="flex min-w-px flex-1 items-center gap-[4px] lg:gap-[8px]">
        <span
          className="size-[6px] shrink-0 rounded-full lg:size-[12px]"
          style={{
            backgroundColor: e.dotColor,
          }}
        />
        <span
          className="font-semibold text-[7px] leading-[10px] tracking-[-0.14px] lg:text-[14px] lg:leading-[20px] lg:tracking-[-0.28px]"
          style={{
            color: INK,
          }}
        >
          {e.title}
        </span>
        <span
          className="flex h-[8px] min-w-[8px] items-center justify-center rounded-[2.5px] border px-[1.5px] font-medium text-[5.5px] leading-[8px] lg:h-[16px] lg:min-w-[16px] lg:rounded-[5px] lg:px-[3px] lg:text-[11px] lg:leading-[16px]"
          style={{
            backgroundColor: "rgba(0,0,0,0.04)",
            borderColor: HAIRLINE,
            color: INK_SOFT,
          }}
        >
          {e.count}
        </span>
      </div>
      <div className="flex size-[10px] items-center justify-center rounded-[3px] lg:size-[20px] lg:rounded-[6px]">
        <Icon
          icon={ICON_PLUS}
          className="size-[7px] lg:size-[14px]"
          style={{
            color: INK_SOFT,
          }}
        />
      </div>
    </div>
  );
}
function BoardColumn({ column: e, index: s }: { column: Column; index: number }) {
  const r = useResolvedReducedMotion(),
    n = useBelowLg();
  return (
    <motion.div
      className="flex h-[291px] w-[136px] shrink-0 flex-col overflow-hidden rounded-t-[6px] px-[4px] pt-[4px] lg:h-[582px] lg:w-[272px] lg:rounded-t-[12px] lg:px-[8px] lg:pt-[8px]"
      style={{
        backgroundColor: COLUMN_BG,
      }}
      initial={
        !r && {
          filter: `blur(${BLUR_ENTRANCE}px)`,
          opacity: 0,
          y: n ? 7 : 14,
        }
      }
      whileInView={
        r
          ? undefined
          : {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        amount: 0.3,
        once: true,
      }}
      transition={{
        delay: r ? 0 : withTempo(0.08 * s),
        duration: withTempo(0.7),
        ease: EASE,
      }}
    >
      <ColumnHeader column={e} />
      <div
        className="flex min-h-0 flex-1 flex-col items-center gap-[4px] px-[1px] pt-[4px] lg:gap-[8px] lg:px-[2px] lg:pt-[8px]"
        style={CARDS_MASK}
      >
        {e.cards.map((e, l) => (
          <motion.div
            key={e.company}
            initial={
              !r && {
                opacity: 0,
                y: n ? 5 : 10,
              }
            }
            whileInView={
              r
                ? undefined
                : {
                    opacity: 1,
                    y: 0,
                  }
            }
            viewport={{
              amount: 0.3,
              once: true,
            }}
            transition={{
              delay: r ? 0 : withTempo(0.08 * s + 0.12 + 0.07 * l),
              duration: withTempo(0.5),
              ease: EASE,
            }}
          >
            <DealCard card={e} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
const MOVING_CARD = COLUMNS[1].cards[0],
  DEMO_COLUMN = COLUMNS[1],
  PROPOSAL_COLUMN = COLUMNS[2],
  RISING_CARD = PROPOSAL_COLUMN.cards[2],
  PROPOSAL_STACK = PROPOSAL_COLUMN.cards.slice(0, 2);
function ProposalColumn({ count: e, index: s, stackControls: r }: { count: string; index: number; stackControls: AnimationControls }) {
  const n = useResolvedReducedMotion(),
    l = useBelowLg();
  return (
    <motion.div
      className="flex h-[291px] w-[136px] shrink-0 flex-col overflow-hidden rounded-t-[6px] px-[4px] pt-[4px] lg:h-[582px] lg:w-[272px] lg:rounded-t-[12px] lg:px-[8px] lg:pt-[8px]"
      style={{
        backgroundColor: COLUMN_BG,
      }}
      initial={
        !n && {
          filter: `blur(${BLUR_ENTRANCE}px)`,
          opacity: 0,
          y: l ? 7 : 14,
        }
      }
      whileInView={
        n
          ? undefined
          : {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
            }
      }
      viewport={{
        amount: 0.3,
        once: true,
      }}
      transition={{
        delay: n ? 0 : withTempo(0.08 * s),
        duration: withTempo(0.7),
        ease: EASE,
      }}
    >
      <ColumnHeader
        column={{
          ...PROPOSAL_COLUMN,
          count: e,
        }}
      />
      <div
        className="flex min-h-0 flex-1 flex-col items-center gap-[4px] px-[1px] pt-[4px] lg:gap-[8px] lg:px-[2px] lg:pt-[8px]"
        style={CARDS_MASK}
      >
        <motion.div
          className="flex flex-col items-center gap-[4px] lg:gap-[8px]"
          initial={{
            y: 0,
          }}
          animate={r}
        >
          {PROPOSAL_STACK.map((e, r) => (
            <motion.div
              key={e.company}
              initial={
                !n && {
                  opacity: 0,
                  y: l ? 5 : 10,
                }
              }
              whileInView={
                n
                  ? undefined
                  : {
                      opacity: 1,
                      y: 0,
                    }
              }
              viewport={{
                amount: 0.3,
                once: true,
              }}
              transition={{
                delay: n ? 0 : withTempo(0.08 * s + 0.12 + 0.07 * r),
                duration: withTempo(0.5),
                ease: EASE,
              }}
            >
              <DealCard card={e} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
function MovingCard({ cardControls: e, flatShadow: s, geo: r, glowControls: i }: { cardControls: AnimationControls; flatShadow: string; geo: Geo; glowControls: AnimationControls }) {
  return (
    <motion.div
      className="absolute top-0 left-0 w-[124px] rounded-[6px] lg:w-[248px] lg:rounded-[12px]"
      style={{
        transformOrigin: "50% 50%",
      }}
      initial={{
        boxShadow: s,
        opacity: 0,
        rotate: 0,
        scale: 1,
        x: r.TRAVEL_DEMO_X,
        y: r.TRAVEL_SLOT_Y + r.ENTRANCE_Y,
      }}
      animate={e}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[7px] rounded-[11px] [filter:blur(4px)] lg:-inset-[14px] lg:rounded-[22px] lg:[filter:blur(8px)]"
        style={{
          background:
            "radial-gradient(62% 62% at 50% 50%, rgba(38,109,240,0.5) 0%, rgba(38,109,240,0) 72%)",
          transformOrigin: "50% 50%",
        }}
        initial={{
          opacity: 0,
        }}
        animate={i}
      />
      <div className="relative">
        <DealCard card={MOVING_CARD} />
      </div>
    </motion.div>
  );
}
function RisingCard({ controls: e, geo: s }: { controls: AnimationControls; geo: Geo }) {
  return (
    <motion.div
      className="absolute top-0 left-0 w-[124px] lg:w-[248px]"
      initial={{
        opacity: 0,
        x: s.TRAVEL_DEMO_X,
        y: s.TRAVEL_SLOT_Y + s.STACK_SHIFT + s.ENTRANCE_Y,
      }}
      animate={e}
    >
      <DealCard card={RISING_CARD} />
    </motion.div>
  );
}
function AnimatedBoard() {
  const e = useRef<HTMLDivElement>(null),
    a = useInView(e, {
      amount: 0.3,
      once: true,
    }),
    s = useBelowLg(),
    n: Geo = s
      ? {
          ARC_Y: 49,
          CARD_H: 103,
          ENTRANCE_Y: 5,
          LIFT_Y: 56,
          STACK_SHIFT: 107,
          TRAVEL_DEMO_X: 179,
          TRAVEL_PROPOSAL_X: 323,
          TRAVEL_SLOT_Y: 62,
        }
      : {
          ARC_Y: 98,
          CARD_H: 206,
          ENTRANCE_Y: 10,
          LIFT_Y: 112,
          STACK_SHIFT: 214,
          TRAVEL_DEMO_X: 358,
          TRAVEL_PROPOSAL_X: 646,
          TRAVEL_SLOT_Y: 124,
        },
    {
      ARC_Y: l,
      LIFT_Y: o,
      STACK_SHIFT: d,
      TRAVEL_DEMO_X: x,
      TRAVEL_PROPOSAL_X: p,
      TRAVEL_SLOT_Y: u,
    } = n,
    { FLAT_SHADOW: g, LIFT_SHADOW: h } = s
      ? {
          FLAT_SHADOW:
            "0 9px 20px -8px rgba(16,17,18,0), 0 2.5px 7px -3px rgba(16,17,18,0)",
          LIFT_SHADOW:
            "0 9px 20px -8px rgba(16,17,18,0.18), 0 2.5px 7px -3px rgba(16,17,18,0.10)",
        }
      : {
          FLAT_SHADOW:
            "0 18px 40px -16px rgba(16,17,18,0), 0 5px 14px -6px rgba(16,17,18,0)",
          LIFT_SHADOW:
            "0 18px 40px -16px rgba(16,17,18,0.18), 0 5px 14px -6px rgba(16,17,18,0.10)",
        },
    m = n.TRAVEL_SLOT_Y + n.STACK_SHIFT,
    C = useAnimationControls(),
    f = useAnimationControls(),
    y = useAnimationControls(),
    b = useAnimationControls(),
    [A, w] = useState(false);
  return (
    useEffect(() => {
      if (!a) return;
      let e = true,
        t = () =>
          f.start({
            opacity: 0,
            scale: 1,
            transition: {
              duration: 0.5,
              ease: "easeOut",
            },
          }),
        s = async (e: number, a: number, s: number, r: number, n: number) => {
          const d = withTempo(1.7);
          (f.start({
            opacity: [0.42, 0.72, 0.42],
            scale: [1, 1.05, 1],
            transition: {
              duration: 1.6,
              ease: "easeInOut",
              repeat: Infinity,
            },
          }),
            y.start({
              transition: {
                delay: 0.18 * d,
                duration: 0.62 * d,
                ease: TRAVEL_EASE,
              },
              y: s,
            }),
            b.start({
              transition: {
                delay: 0.14 * d,
                duration: 0.52 * d,
                ease: TRAVEL_EASE,
              },
              y: n,
            }));
          const c = setTimeout(t, 1e3 * d * 0.78),
            x = C.start({
              rotate: [0, r, r, r, 0],
              scale: [1, 1.05, 1.05, 1.05, 1],
              transition: {
                duration: d,
                ease: "easeInOut",
                times: [0, 0.18, 0.5, 0.82, 1],
              },
              y: [u, o, l, o, u],
            }),
            p = C.start({
              boxShadow: [g, h, h, g],
              transition: {
                duration: d,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1],
              },
            }),
            m = C.start({
              transition: {
                delay: 0.16 * d,
                duration: 0.66 * d,
                ease: "easeInOut",
              },
              x: [e, a],
            });
          (await Promise.all([x, p, m]), clearTimeout(c));
        };
      return (
        (async () => {
          let t: number;
          (C.set({
            x: x,
          }),
            b.set({
              x: x,
            }),
            C.start({
              opacity: 1,
              transition: {
                delay: withTempo(0.2),
                duration: withTempo(0.5),
                ease: EASE,
              },
              y: u,
            }),
            b.start({
              opacity: 1,
              transition: {
                delay: withTempo(0.27),
                duration: withTempo(0.5),
                ease: EASE,
              },
              y: m,
            }),
            await ((t = withTempo(1400)),
            new Promise<void>((e) => setTimeout(e, t))),
            !e || (await s(x, p, d, -4, u), e && w(true)));
        })(),
        () => {
          ((e = false), C.stop(), f.stop(), y.stop(), b.stop());
        }
      );
    }, [a, C, f, y, b, l, o, d, x, p, u, m, g, h]),
    (
      <div
        ref={e}
        aria-hidden="true"
        className="absolute inset-0 h-[327px] w-[522px] overflow-hidden lg:h-[654px] lg:w-[1044px]"
        style={{
          maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, #000 88%, transparent 100%)",
        }}
      >
        <div className="absolute top-[36px] left-[29px] flex items-start gap-[8px] lg:top-[72px] lg:left-[58px] lg:gap-[16px]">
          <BoardColumn column={COLUMNS[0]} index={0} />
          <BoardColumn
            column={{
              ...DEMO_COLUMN,
              cards: [],
              count: A ? "1" : "2",
            }}
            index={1}
          />
          <ProposalColumn count={A ? "3" : "2"} index={2} stackControls={y} />
          <BoardColumn column={COLUMNS[3]} index={3} />
        </div>
        <RisingCard controls={b} geo={n} />
        <MovingCard cardControls={C} flatShadow={g} geo={n} glowControls={f} />
      </div>
    )
  );
}
function StaticBoard() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 h-[327px] w-[522px] overflow-hidden lg:h-[654px] lg:w-[1044px]"
      style={{
        maskImage: "linear-gradient(to right, #000 88%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, #000 88%, transparent 100%)",
      }}
    >
      <div className="absolute top-[36px] left-[29px] flex items-start gap-[8px] lg:top-[72px] lg:left-[58px] lg:gap-[16px]">
        {COLUMNS.map((e, a) => (
          <BoardColumn key={e.title} column={e} index={a} />
        ))}
      </div>
    </div>
  );
}
export function SalesBoard() {
  return useResolvedReducedMotion() ? <StaticBoard /> : <AnimatedBoard />;
}
