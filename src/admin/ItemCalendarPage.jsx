import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import 'react-datepicker/dist/react-datepicker.css';
import '../pages/ExcursionDatePage.css';
import BackButton from '../components/BackButton';
import ru from 'date-fns/locale/ru';
import en from 'date-fns/locale/en-US';

const ItemCalendarPage = () => {
  const { type, itemId } = useParams();
  const { t, i18n } = useTranslation();
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [date, setDate] = useState(null);
  const [range, setRange] = useState([null, null]);
  const [success, setSuccess] = useState('');
  const [reservations, setReservations] = useState([]);
  const [itemName, setItemName] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    registerLocale('ru', ru);
    registerLocale('en', en);
  }, []);

  const loadReservations = () => {
    const endpoint = type === 'car' ? 'car-reservations' : 'excursion-reservations';
    fetch(`https://booking-backend-tjmn.onrender.com/${endpoint}?${type}_id=${itemId}`)
      .then(res => res.json())
      .then(data => {
        setReservations(data);
        let dates;
        if (type === 'car') {
          dates = [];
          data.forEach(d => {
            const start = new Date(d.start_date);
            const end = new Date(d.end_date);
            for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
              dates.push(new Date(dt.getTime()));
            }
          });
        } else {
          dates = data.map(d => {
            const [y, m, d2] = (d.date || d).split('-');
            return new Date(+y, +m - 1, +d2);
          });
        }
        setUnavailableDates(dates);
      })
      .catch(err => console.error('Failed to load reservations', err));
  };

  useEffect(() => {
    loadReservations();
    const itemEndpoint = type === 'car' ? 'cars' : 'excursions';
    fetch(`https://booking-backend-tjmn.onrender.com/${itemEndpoint}/${itemId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(data => {
        const name = type === 'car' ? `${data.brand} ${data.model}` : data.title;
        setItemName(name);
        const supplierField = type === 'car' ? data.supplier_id : data.operator_id;
        const mySupplier = localStorage.getItem('supplier_id');
        const isSuper = localStorage.getItem('isSuperuser') === 'true';
        if (!isSuper && String(supplierField) !== String(mySupplier)) {
          navigate('/admin/dashboard');
        }
      })
      .catch(err => console.error('Failed to load item', err));
  }, [type, itemId, navigate]);

  const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const handleSave = async () => {
    const endpoint = type === 'car' ? 'car-reservations' : 'excursion-reservations';
    const payload =
      type === 'car'
        ? { car_id: parseInt(itemId, 10), start_date: format(range[0]), end_date: format(range[1]) }
        : { excursion_id: parseInt(itemId, 10), date: format(date) };

    const res = await fetch(`https://booking-backend-tjmn.onrender.com/api/admin/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setSuccess(t('suppliers.ReservationSaved'));
      setTimeout(() => setSuccess(''), 3000);
      setShowCalendar(false);
      setDate(null);
      setRange([null, null]);
      loadReservations();
    } else {
      alert('Error');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    const endpoint = type === 'car' ? 'car-reservations' : 'excursion-reservations';
    const res = await fetch(
      `https://booking-backend-tjmn.onrender.com/api/admin/${endpoint}/${deleteId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }
    );
    if (res.ok) {
      setSuccess(t('common.deleted'));
      setTimeout(() => setSuccess(''), 3000);
    }
    setDeleteId(null);
    loadReservations();
  };

  const [start, end] = range;
  return (
    <div className="date-page-wrapper">
      <h2 className="date-page-title">{t('suppliers.ReserveDates')}</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>{t('suppliers.ItemID')}</th>
            <th>{t('suppliers.Name')}</th>
            <th>{type === 'car' ? t('suppliers.Period') : t('suppliers.Date')}</th>
            <th>{t('suppliers.Actions')}</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(r => (
            <tr key={r.id}>
              <td>{itemId}</td>
              <td>{itemName}</td>
              <td>
                {type === 'car'
                  ? `${r.start_date} - ${r.end_date}`
                  : r.date}
              </td>
              <td>
                <button className="delete-btn" onClick={() => setDeleteId(r.id)}>
                  {t('suppliers.DeleteButton')}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{t('common.confirm_delete')}</h3>
            <p>{t('common.confirm_question')}</p>
            <div className="modal-actions">
              <button onClick={confirmDelete}>{t('common.confirm')}</button>
              <button onClick={() => setDeleteId(null)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showCalendar && (
        <div className="datepicker-container">
          {type === 'car' ? (
            <DatePicker
              selected={start}
              onChange={setRange}
              startDate={start}
              endDate={end}
              minDate={new Date()}
              excludeDates={unavailableDates}
              selectsRange
              inline
              calendarClassName="custom-calendar"
              dateFormat="yyyy-MM-dd"
              locale={i18n.language === 'ru' ? 'ru' : 'en'}
            />
          ) : (
            <DatePicker
              selected={date}
              onChange={d => setDate(d)}
              minDate={new Date()}
              excludeDates={unavailableDates}
              inline
              calendarClassName="custom-calendar"
              dateFormat="yyyy-MM-dd"
              locale={i18n.language === 'ru' ? 'ru' : 'en'}
            />
          )}
        </div>
      )}

      {success && <p className="success-message">{success}</p>}

      <div className="action-buttons">
        {showCalendar && (
          <button
            onClick={handleSave}
            className="continue-button"
            disabled={type === 'car' ? !start || !end : !date}
          >
            {t('common.save')}
          </button>
        )}
        <button
          onClick={() => {
            if (showCalendar) {
              setShowCalendar(false);
              setDate(null);
              setRange([null, null]);
            } else {
              setShowCalendar(true);
            }
          }}
          className="continue-button"
        >
          {showCalendar ? t('common.cancel') : t('suppliers.AddButton')}
        </button>
      </div>

      <BackButton />
    </div>
  );
};

export default ItemCalendarPage;
