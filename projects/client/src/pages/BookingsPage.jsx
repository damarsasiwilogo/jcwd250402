import React, { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import getBookingData from "../actions/getBookingData";
import BookingCards from "../components/bookings/BookingCards";
import { Navbar, Footer, Heading, Container } from "../components";

const BookingsPage = () => {
  const bookingData = getBookingData();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await bookingData;
      if (data) {
        setBookings(data);
      }
    };
    fetchData();
  }, []);

  if (bookings.length === 0) {
    return (
      <div>
        <header>
          <Navbar />
        </header>
        <EmptyState
          title="No bookings were found"
          subtitle="Looks like you haven't made any bookings yet."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-1">
        <div className="pb-20 pt-28">
          <Container>
            <Heading
              title="Bookings"
              subtitle="These are the properties that you have booked."
            />
            <div className="grid grid-cols-1 gap-8 pt-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ">
              {bookings.map((booking) => {
                return (
                  <BookingCards
                    key={booking.id}
                    bookingData={booking}
                    currentUser={booking.tenant}
                  />
                );
              })}
            </div>
          </Container>
        </div>
      </main>
    </div>
  );
};

export default BookingsPage;
