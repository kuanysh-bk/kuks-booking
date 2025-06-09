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
  const { supplierId: supplierIdParam } = useParams();
  const [supplierId, setSupplierId] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newCar, setNewCar] = useState({
    brand: "",
    model: "",
    color: "",
    seats: "",
    price_per_day: "",
    car_type: "",
    transmission: "",
    has_air_conditioning: false,
    year: "",
    fuel_type: "",
    engine_capacity: "",
    mileage: "",
    drive_type: "",
    supplier_id: supplierId
  });

  const carTypes = ["sedan", "suv", "minivan", "coupe", "hatchback", "pickup"];
  const transmissions = ["automatic", "manual"];
  const fuelTypes = ["petrol", "gas", "electric", "hybrid"];
  const driveTypes = ["FWD", "RWD", "AWD"];
  const carColors = ["black", "white", "blue", "red", "silver", "gray"];
  const carYears = Array.from({ length: 2025 - 1950 + 1 }, (_, i) => 1950 + i);

  const handleSubmitCar = async () => {
    const requiredFields = [
      "brand", "model", "color", "seats", "price_per_day",
      "car_type", "transmission", "year", "fuel_type",
      "engine_capacity", "mileage", "drive_type"
    ];
  
    for (const field of requiredFields) {
      if (!newCar[field]) {
        alert(t("cars.validation_required"));
        return;
      }
    }
  
    const res = await fetch("https://booking-backend-tjmn.onrender.com/api/admin/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ ...newCar, supplier_id: supplierId })
    });
  
    if (res.ok) {
      setShowModal(false);
      setSuccess(t("cars.successfully_added"));
      setTimeout(() => setSuccess(""), 3000);
  
      // обновляем список
      fetch(`https://booking-backend-tjmn.onrender.com/api/admin/cars?supplier_id=${supplierId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
        .then(res => res.json())
        .then(setItems);
    } else {
      alert(t("cars.add_error"));
    }
  };
  

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
    if (!supplierId) return;

    fetch(`https://booking-backend-tjmn.onrender.com/api/suppliers/${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(data => {
        setSupplier(data);
        setForm(data);
      })
      .catch(error => console.error("Failed to fetch supplier data:", error));
  }, [supplierId]);

  useEffect(() => {
    if (!supplierId || !supplier) return;

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

    fetch(`https://booking-backend-tjmn.onrender.com/api/admin/bookings?supplier_id=${supplierId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => res.json())
      .then(setOrders)
      .catch(error => console.error("Error fetching bookings:", error));

  }, [supplierId, supplier]);

  const handleProfileSave = async () => {
    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(form)
    });
    if (res.ok) {
      setSuccess(t("suppliers.ProfileUpdated"));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return (
    <div className="supplier-dashboard">
      <h2>{t("suppliers.ManagePage")} {supplier?.name}</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab("items")} className={activeTab === "items" ? "active" : ""}>{t("suppliers.ItemsTab")}</button>
        <button onClick={() => setActiveTab("orders")} className={activeTab === "orders" ? "active" : ""}>{t("suppliers.OrdersTab")}</button>
        <button onClick={() => setActiveTab("profile")} className={activeTab === "profile" ? "active" : ""}>{t("suppliers.EditProfileTab")}</button>
      </div>

      {activeTab === "items" && (
        <div>
          <button className="add-btn" onClick={() => setShowModal(true)}>{t("suppliers.AddButton")}</button>
          {showModal && (
            <div className="modal-overlay">
              <div className="modal">
                <h3>{t("suppliers.AddNewCar")}</h3>
                <input placeholder={t("cars.brand")} value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} />
                <input placeholder={t("cars.model")} value={newCar.model} onChange={e => setNewCar({ ...newCar, model: e.target.value })} />
                <select value={newCar.color} onChange={e => setNewCar({ ...newCar, color: e.target.value })}>
                  <option value="">{t("cars.color")}</option>
                  {carColors.map(color => <option key={color} value={color}>{t(`cars.colors.${color}`)}</option>)}
                </select>
                <input placeholder={t("cars.seats")} type="number" value={newCar.seats} onChange={e => setNewCar({ ...newCar, seats: e.target.value })} />
                <input placeholder={t("cars.price_per_day")} type="number" value={newCar.price_per_day} onChange={e => setNewCar({ ...newCar, price_per_day: e.target.value })} />
                <select value={newCar.car_type} onChange={e => setNewCar({ ...newCar, car_type: e.target.value })}>
                  <option value="">{t("cars.car_type")}</option>
                  {carTypes.map(type => <option key={type} value={type}>{t(`cars.types.${type}`)}</option>)}
                </select>
                <select value={newCar.transmission} onChange={e => setNewCar({ ...newCar, transmission: e.target.value })}>
                  <option value="">{t("cars.transmission")}</option>
                  {transmissions.map(tr => <option key={tr} value={tr}>{t(`cars.transmissionTypes.${tr}`)}</option>)}
                </select>
                <select value={newCar.fuel_type} onChange={e => setNewCar({ ...newCar, fuel_type: e.target.value })}>
                  <option value="">{t("cars.fuelType")}</option>
                  {fuelTypes.map(f => <option key={f} value={f}>{t(`cars.fuel.${f}`)}</option>)}
                </select>
                <select value={newCar.drive_type} onChange={e => setNewCar({ ...newCar, drive_type: e.target.value })}>
                  <option value="">{t("cars.driveType")}</option>
                  {driveTypes.map(d => <option key={d} value={d}>{t(`cars.drive.${d.toLowerCase()}`)}</option>)}
                </select>
                <select value={newCar.year} onChange={e => setNewCar({ ...newCar, year: e.target.value })}>
                  <option value="">{t("cars.year")}</option>
                  {carYears.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <input placeholder={t("cars.engineCapacity")} type="number" value={newCar.engine_capacity} onChange={e => setNewCar({ ...newCar, engine_capacity: e.target.value })} />
                <input placeholder={t("cars.mileage")} type="number" value={newCar.mileage} onChange={e => setNewCar({ ...newCar, mileage: e.target.value })} />
                <div className="checkbox-row">
                  <label><input type="checkbox" checked={newCar.has_air_conditioning} onChange={e => setNewCar({ ...newCar, has_air_conditioning: e.target.checked })} /> {t("cars.ac")}</label>
                  <small>{t("cars.ac_hint")}</small>
                </div>
                <div className="modal-actions">
                  <button onClick={handleSubmitCar}>{t("common.submit")}</button>
                  <button onClick={() => setShowModal(false)}>{t("common.cancel")}</button>
                </div>
              </div>
            </div>
          )}
          
          <table className="data-table">
            <thead>
              <tr>
                {supplier?.supplier_type === "cars" ? (
                  <>
                    <th>{t("suppliers.ItemID")}</th>
                    <th>{t("cars.brand")}</th>
                    <th>{t("cars.model")}</th>
                    <th>{t("cars.color")}</th>
                    <th>{t("cars.price_per_day")}</th>
                    <th>{t("cars.year")}</th>
                    <th>{t("cars.mileage")}</th>
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
            placeholder={t("suppliers.ProfileAddress")}
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <button onClick={handleProfileSave}>{t("suppliers.SaveButton")}</button>
          {success && <p className="success-message">{success}</p>}
        </div>
      )}
    {isSuperuser && supplierIdParam && (
        <button className="back-btn" onClick={() => navigate("/admin/super/dashboard")}>
          {t("common.back")}
        </button>
      )}
    </div>
  );
};

export default SupplierDashboard;