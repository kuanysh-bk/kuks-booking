import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./SupplierDashboard.css";

const SupplierDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("items");
  const [supplier, setSupplier] = useState(null);
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", supplier_type: "" });
  const [success, setSuccess] = useState("");
  const { supplierId: supplierIdParam } = useParams(); // from URL only if superuser
  const [supplierId, setSupplierId] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isSuper = localStorage.getItem("isSuperuser") === "true";
    const storedId = localStorage.getItem("supplier_id");

    setIsSuperuser(isSuper);

    if (isSuper && supplierIdParam) {
      setSupplierId(supplierIdParam);
    } else if (storedId) {
      setSupplierId(storedId);
    } else {
      navigate("/admin/login");
    }
  }, [supplierIdParam]);

  useEffect(() => {
    fetch(`https://booking-backend-tjmn.onrender.com/api/super/suppliers/${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setSupplier(data);
        setForm(data);
      })
      .catch(error => {
        console.error("Failed to fetch supplier data:", error);
      });

    if (supplier) {
      if (supplier.supplier_type === "cars") {
        fetch(`https://booking-backend-tjmn.onrender.com/api/admin/cars?supplier_id=${supplierId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(setItems);
      } else if (supplier.supplier_type === "excursion") {
        fetch(`https://booking-backend-tjmn.onrender.com/api/admin/excursions?operator_id=${supplierId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then(res => res.json())
        .then(setItems);
      }
    }

    fetch(`https://booking-backend-tjmn.onrender.com/api/admin/bookings?supplier_id=${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Failed to fetch bookings: ${res.statusText}`);
        }
        return res.json();
      })
      .then(setOrders)
      .catch(error => console.error("Error fetching bookings:", error));
    
  }, [supplierId, supplier]);

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
      setSuccess(t("suppliers.ProfileUpdated", "Профиль успешно обновлен"));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="supplier-dashboard">
      <h2>{t("suppliers.ManagePage")} {supplier?.name}</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab("items")} className={activeTab === "items" ? "active" : ""}>
          {t("suppliers.ItemsTab")}
        </button>
        <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>
          {t("suppliers.OrdersTab")}
        </button>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>
          {t("suppliers.EditProfileTab")}
        </button>
      </div>

      {activeTab === "items" && (
        <div>
          <button className="add-btn">{t("suppliers.AddButton")}</button>
          <table className="data-table">
            <thead>
              <tr>
                {supplier?.supplier_type === "cars" ? (
                  <>
                    <th>{t("suppliers.ItemID")}</th>
                    <th>{t("suppliers.CarBrand")}</th>
                    <th>{t("suppliers.CarModel")}</th>
                    <th>{t("suppliers.CarColor")}</th>
                    <th>{t("suppliers.CarPricePerDay")}</th>
                    <th>{t("suppliers.CarYear")}</th>
                    <th>{t("suppliers.CarMileage")}</th>
                    <th>{t("suppliers.Actions")}</th>
                  </>
                ) : supplier?.supplier_type === "excursion" ? (
                  <>
                    <th>{t("suppliers.ItemID")}</th>
                    <th>{t("suppliers.ExcursionTitle")}</th>
                    <th>{t("suppliers.ExcursionPrice")}</th>
                    <th>{t("suppliers.ExcursionLocation")}</th>
                    <th>{t("suppliers.Actions")}</th>
                  </>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  {supplier?.supplier_type === "cars" ? (
                    <>
                      <td>{item.id}</td>
                      <td>{item.brand}</td>
                      <td>{item.model}</td>
                      <td>{item.color}</td>
                      <td>{item.price_per_day}</td>
                      <td>{item.year}</td>
                      <td>{item.mileage}</td>
                      <td>
                        <button className="edit-btn">{t("suppliers.EditButton")}</button>
                        <button className="delete-btn">{t("suppliers.DeleteButton")}</button>
                      </td>
                    </>
                  ) : supplier?.supplier_type === "excursion" ? (
                    <>
                      <td>{item.id}</td>
                      <td>{item.title}</td>
                      <td>{item.price}</td>
                      <td>{item.location_en}</td>
                      <td>
                        <button className="edit-btn">{t("suppliers.EditButton")}</button>
                        <button className="delete-btn">{t("suppliers.DeleteButton")}</button>
                      </td>
                    </>
                  ) : null}
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
              <th>{t("suppliers.OrderID")}</th>
              <th>{t("suppliers.BookingID")}</th>
              <th>{t("suppliers.ContactMethod")}</th>
              <th>{t("suppliers.Language")}</th>
              <th>{t("suppliers.PeopleCount")}</th>
              <th>{t("suppliers.Date")}</th>
              <th>{t("suppliers.TotalPrice")}</th>
              <th>{t("suppliers.PickupLocation")}</th>
              {supplier?.supplier_type === "cars" && <th>{t("suppliers.CarID")}</th>}
              <th>{t("suppliers.Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <>
                  <td>{o.id}</td>
                  <td>{o.booking_id}</td>
                  <td>{o.contact_method}</td>
                  <td>{o.language}</td>
                  <td>{o.people_count}</td>
                  <td>{o.date}</td>
                  <td>{o.total_price}</td>
                  <td>{o.pickup_location}</td>
                  {supplier?.supplier_type === "cars" && <td>{o.car_id}</td>}
                  <td>
                    <button className="edit-btn">{t("suppliers.EditButton")}</button>
                    <button className="delete-btn">{t("suppliers.DeleteButton")}</button>
                  </td>
                </>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {activeTab === "profile" && (
        <div className="edit-form">
          <input
            type="text"
            placeholder={t("suppliers.ProfileName")}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            type="email"
            placeholder={t("suppliers.ProfileEmail")}
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("suppliers.ProfilePhone")}
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("suppliers.ProfileType")}
            value={form.supplier_type}
            onChange={e => setForm({ ...form, supplier_type: e.target.value })}
          />
          <input
            type="text"
            placeholder={t("suppliers.ProfileAddress")}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <button onClick={handleProfileSave}>{t("suppliers.SaveButton")}</button>
          {success && <p className="success-message">{success}</p>}
        </div>
      )}
    {isSuperuser && supplierIdParam && (
        <button className="back-button" onClick={() => navigate("/admin/super/dashboard")}>
          {t("common.back")}
        </button>
      )}
    </div>
  );
};

export default SupplierDashboard;