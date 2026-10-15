# Maydon.uz — futbol maydonlarini onlayn band qilish

React + Tailwind CSS. Server KERAK EMAS: ma'lumotlar brauzer localStorage'da saqlanadi (Ctrl+R qilganda o'chmaydi).

    npm install
    npm run dev

## Demo hisoblar (parol: demo123)
- 900000001 — Buyurtma beruvchi 1
- 900000003 — Buyurtma beruvchi 2
- 900000002 — Qabul qiluvchi

## RASMLAR — public/img papkasi
- public/img/fields/field-1.jpg ... field-50.jpg — maydon rasmlari (shu nomda almashtiring)
- public/img/bg-login.jpg — kirish sahifasi foni
- public/img/bg-hero.jpg — yuqoridagi katta banner foni
- public/img/default.jpg — rasm topilmasa chiqadigan rasm
Maydon nomi, manzili va narxi: src/data/fields.js (saqlangach sahifani yangilang)

## Eslatma
Ma'lumotlar bitta brauzer ichida umumiy (bir nechta oyna/tab ishlaydi). Boshqa telefon/kompyuter bilan ulashish uchun server kerak.
50 ta tayyor maydonning buyurtmalari barcha qabul qiluvchilarda ko'rinadi; o'zi qo'shgan maydon buyurtmalari faqat o'zida.

## Rasmlarni tez almashtirish
1. Rasmlaringizni `my-images` papkasiga tashlang (jpg, png, webp).
2. Terminalda: `npm run rasm`
3. Sahifani yangilang. 50 tadan kam rasm bo'lsa, takrorlanadi.
