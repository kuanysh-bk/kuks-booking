import React, { useState } from "react";
import BottomNav from "./BottomNav";

const translations = {
  ru: {
    title: "Экскурсии в ОАЭ",
    back: "← Назад к списку",
    selectDate: "Выберите дату",
    name: "Имя",
    phone: "Телефон",
    book: "Забронировать",
    more: "Подробнее",
    sent: "Бронирование отправлено!",
    priceLabel: "Стоимость:",
  },
  en: {
    title: "Excursions in UAE",
    back: "← Back to list",
    selectDate: "Select a date",
    name: "Name",
    phone: "Phone",
    book: "Book now",
    more: "More info",
    sent: "Booking sent!",
    priceLabel: "Price:",
  },
};

const excursions = [
  {
    id: 1,
    title: {
      ru: "Дубай Сафари",
      en: "Dubai Safari",
    },
    description: {
      ru: "Экскурсия по пустыне с ужином, шоу, катанием на верблюдах и сэндбордингом.",
      en: "Desert safari with dinner, camel ride and sandboarding.",
    },
    price: "150 AED",
    image: "/images/safari.jpg",
  },
  {
    id: 2,
    title: {
      ru: "Прогулка по Марине",
      en: "Marina Cruise",
    },
    description: {
      ru: "Круиз по каналу Дубай Марина с ужином и музыкой.",
      en: "Cruise in Dubai Marina with dinner and music.",
    },
    price: "200 AED",
    image: "/images/marina.jpg",
  },
];

export default function App() {
  const [lang, setLang] = useState("ru");
  const t = translations[lang];
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleSubmit = () => {
    const payload = {
      excursion: selected.title[lang],
      ...form,
    };
    console.log("Booking:", payload);
    alert(t.sent);
  };

  return (
    <>
      <div className="p-4 max-w-5xl mx-auto pb-20">
        <div className="flex justify-between mb-4">
          <h1 className="text-3xl font-bold">{t.title}</h1>
          <div>
            <button onClick={() => setLang("ru")} className={`mr-2 ${lang === "ru" ? "font-bold" : ""}`}>RU</button>
            <button onClick={() => setLang("en")} className={`${lang === "en" ? "font-bold" : ""}`}>EN</button>
          </div>
        </div>

        {selected ? (
          <div className="max-w-xl">
            <button onClick={() => setSelected(null)} className="mb-4 text-blue-600">{t.back}</button>
            <img src={selected.image} alt={selected.title[lang]} className="rounded-xl mb-4" />
            <h2 className="text-2xl font-bold">{selected.title[lang]}</h2>
            <p className="mb-2">{selected.description[lang]}</p>
            <p className="font-semibold mb-4">{t.priceLabel} {selected.price}</p>

            <div className="mb-2">
              <label>{t.name}</label>
              <input type="text" className="w-full border p-2 rounded" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="mb-4">
              <label>{t.phone}</label>
              <input type="tel" className="w-full border p-2 rounded" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <button onClick={handleSubmit} className="bg-blue-600 text-white w-full py-2 rounded">{t.book}</button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {excursions.map((e) => (
              <div key={e.id} onClick={() => setSelected(e)} className="cursor-pointer bg-white rounded-xl shadow">
                <img src={e.image} alt={e.title[lang]} className="w-full h-48 object-cover rounded-t-xl" />
                <div className="p-4">
                  <h2 className="font-semibold text-lg">{e.title[lang]}</h2>
                  <p className="text-sm text-gray-600">{e.description[lang]}</p>
                  <p className="font-bold mt-2">{e.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </>
  );
}