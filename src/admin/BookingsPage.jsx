import React, { useEffect, useState } from 'react';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch('/api/admin/bookings', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => res.json())
      .then(setBookings);
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Мои брони</h2>
      <div className="space-y-3">
        {bookings.map(booking => (
          <div key={booking.id} className="border p-3 rounded shadow">
            <p><strong>ID брони:</strong> {booking.id}</p>
            <p><strong>Дата экскурсии:</strong> {booking.tour_date}</p>
            <p><strong>Метод связи:</strong> {booking.contact_method}</p>
            <p><strong>Язык:</strong> {booking.language}</p>
            <p><strong>Людей:</strong> {booking.total_people}</p>
            <p><strong>Сумма:</strong> {booking.total_price} AED</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsPage;