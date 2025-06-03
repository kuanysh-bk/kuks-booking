import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SupplierDashboard = () => {
  const { t } = useTranslation();
  const { supplierId } = useParams();
  const [activeTab, setActiveTab] = useState("items");
  const [supplier, setSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", supplier_type: "" });
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/api/super/suppliers/${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        setSupplier(data);
        setForm(data);
      });

    fetch(`https://booking-backend-tjmn.onrender.com/api/super/items/${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setItems);

    fetch(`https://booking-backend-tjmn.onrender.com/api/super/bookings/${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setOrders);
  }, [supplierId]);

  const handleProfileSave = async () => {
    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/super/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSuccess("Профиль успешно обновлён");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="supplier-dashboard">
      <h2>Панель управления {supplier?.name}</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab("items")} className={activeTab === "items" ? "active" : ""}>Items</button>
        <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>Заказы</button>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>Редактировать профиль</button>
      </div>

      {activeTab === "items" && (
        <div>
          <button className="add-btn">Добавить</button>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Тип</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.title || item.name}</td>
                  <td>{item.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "orders" && (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата</th>
              <th>Язык</th>
              <th>Сумма</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.booking_date}</td>
                <td>{o.language}</td>
                <td>{o.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "profile" && (
        <div className="edit-form">
          <input type="text" placeholder="Имя" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input type="text" placeholder="Телефон" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input type="text" placeholder="Тип" value={form.supplier_type} onChange={e => setForm({ ...form, supplier_type: e.target.value })} />
          <input type="text" placeholder="Адрес" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <button onClick={handleProfileSave}>Сохранить</button>
          {success && <p className="success-message">{success}</p>}
        </div>
      )}
    </div>
  );
};

export default SupplierDashboard;