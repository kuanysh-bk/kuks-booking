import React, { useState } from "react";
import BottomNav from "./BottomNav";

const translations = {
  ru: {
    title: "Аренда авто в ОАЭ",
    selectDate: "Выберите дату",
    name: "Имя",
    phone: "Телефон",
    book: "Забронировать",
    priceLabel: "Стоимость:",
    sent: "Заявка отправлена!",
  },
  en: {
    title: "Car Rental in UAE",
    selectDate: "Select a date",
    name: "Name",
    phone: "Phone",
    book: "Book now",
    priceLabel: "Price:",
    sent: "Request sent!",
  },
};

const cars = [
  {
    id: 1,
    title: { ru: "Toyota Land Cruiser", en: "Toyota Land Cruiser" },
    description: {
      ru: "Комфортный внедорожник для путешествий по Эмиратам.",
      en: "Comfortable SUV for exploring the Emirates.",
    },
    price: "400 AED/день",
    image: "/images/landcruiser.jpg",
  },
  {
    id: 2,
    title: { ru: "Nissan Sunny", en: "Nissan Sunny" },
    description: {
      ru: "Экономичный седан для города.",
      en: "Economical city sedan.",
    },
    price: "150 AED/день",
    image: "/images/sunny.jpg",
  },
];

export default function CarRental() {
  const [lang, setLang] = useState("ru");
  const t = translations[lang];
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleSubmit = () => {
    const payload = {
      car: selected.title[lang],
      ...form,
    };
    console.log("Car booking:", payload);
    alert(t.sent);
  };

  return (
    <>
      <div className="max-w-screen-sm mx-auto px-4 pt-4 pb-24">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <div>
            <button onClick={() => setLang("ru")} className={`mr-2 ${lang === "ru" ? "font-bold" : "text-gray-500"}`}>RU</button>
            <button onClick={() => setLang("en")} className={`${lang === "en" ? "font-bold" : "text-gray-500"}`}>EN</button>
          </div>
        </div>

        {selected ? (
          <div>
            <button onClick={() => setSelected(null)} className="mb-4 text-blue-600">← {t.title}</button>
            <img src={selected.image} alt={selected.title[lang]} className="w-full h-[160px] object-cover rounded-xl mb-4" />
            <h2 className="text-xl font-bold mb-2">{selected.title[lang]}</h2>
            <p className="mb-2 text-gray-700">{selected.description[lang]}</p>
            <p className="font-semibold mb-4">{t.priceLabel} {selected.price}</p>

            <div className="mb-2">
              <label>{t.name}</label>
              <input type="text" className="w-full border p-3 rounded text-lg" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className="mb-4">
              <label>{t.phone}</label>
              <input type="tel" className="w-full border p-3 rounded text-lg" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <button onClick={handleSubmit} className="bg-blue-600 text-white w-full py-3 rounded text-lg">{t.book}</button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {cars.map((car) => (
              <div key={car.id} onClick={() => setSelected(car)} className="cursor-pointer bg-white rounded-xl shadow">
                <img src={car.image} alt={car.title[lang]} className="w-full h-[140px] object-cover rounded-t-xl" />
                <div className="p-4">
                  <h2 className="font-semibold text-lg mb-1">{car.title[lang]}</h2>
                  <p className="text-sm text-gray-600 mb-2">{car.description[lang]}</p>
                  <p className="font-bold">{car.price}</p>
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
