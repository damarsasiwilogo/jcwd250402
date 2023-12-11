import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Navbar, Footer } from "../";
import { toast } from "sonner";
import useLoginModal from "../hooks/useLoginModal";
import { getPropertyData, ListingReservation } from "./";
import { PropertyHeader, PropertyDetail } from "./property";
import { Loader } from "@mantine/core";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import Container from "../Container";
import * as Yup from "yup";
import { Formik, Form, useFormik } from "formik";
import getBookedDates from "../../actions/getBookedDates";
import { format, addDays } from "date-fns";
import { useSelector } from "react-redux";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

const ListingPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const loginModal = useLoginModal();
  const [totalPrice, setTotalPrice] = useState(0);
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [guestCount, setGuestCount] = useState(0);
  const [bookedDates, setBookedDates] = useState([]);

  const validationSchema = Yup.object().shape({
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
    guestCount: Yup.number().required("Guest count is required"),
  });

  const disabledDates = useMemo(() => {
    return bookedDates.map((dateString) => new Date(dateString));
  }, [bookedDates]);

  const formik = useFormik({
    initialValues: {
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      guestCount: guestCount,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onCreateReservation();
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyData = await getPropertyData(id);
        if (!propertyData) {
          toast.error("Property not found");
        }
        setProperty(propertyData);
        setTotalPrice(propertyData.price);
      } catch (error) {
        toast.error(error.response.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const dates = await getBookedDates(id);
        setBookedDates(dates.bookedDates);
      } catch (error) {
        console.error("Error fetching booked dates:", error);
      }
    };

    fetchBookedDates();
  }, [id]);

  const onCreateReservation = useCallback(async () => {
    if (!localStorage.getItem("token") && !localStorage.getItem("isLoggedIn")) {
      loginModal.onOpen();
      return;
    }

    setLoading(true);

    const requestData = {
      startDate: dateRange.startDate.toISOString(),
      endDate: dateRange.endDate.toISOString(),
      guestCount: guestCount,
      totalPrice: totalPrice,
      tenantId: property.Owner.id,
      propertyId: property.id,
    };

    try {
      const response = await api.post("/booking/new", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      const { data } = response;
      toast.success(data.message);
      setDateRange(initialDateRange);
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [
    totalPrice,
    dateRange,
    guestCount,
    property?.id,
    loginModal,
    property?.Owner?.id,
  ]);

  useEffect(() => {
    if (
      dateRange.startDate &&
      dateRange.endDate &&
      property &&
      property.price
    ) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount) {
        setTotalPrice(dayCount * property.price);
      } else {
        setTotalPrice(property.price);
      }
    }
  }, [dateRange, property]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  if (!property) {
    toast.error("Property not found");
    return (
      <div className="flex items-center justify-center h-screen">
        <h1>Property not found</h1>
      </div>
    );
  }
  return (
    <main>
      <Navbar />
      <div className="pb-20 pt-28">
        <Container>
          <div className="flex flex-col gap-6">
            <PropertyHeader
              name={property.name}
              coverImage={property.coverImage}
              propertyImages={property.propertyImages}
              city={property.categories.city}
              province={property.categories.province}
              country={property.categories.country}
              id={property.id}
            />
            <div className="grid grid-cols-1 mt-6 md:grid-cols-7 md:gap-10">
              <PropertyDetail
                tenantName={property.Owner.fullname}
                tenantImg={property.Owner.profilePicture}
                tenantVerified={property.Owner.isVerified}
                tenantMemberSince={property.Owner.memberSince}
                category={property.categories}
                propertyType={property.categories.propertyType}
                propertyAmenity={property.propertyAmenities}
                description={property.description}
                roomCount={property.bedroomCount}
                bedCount={property.bedCount}
                guestCount={property.maxGuestCount}
                bathroomCount={property.bathroomCount}
                latitude={property.categories.latitude}
                longitude={property.categories.longitude}
              />
              <div className="order-last mb-10 md:order-last md:col-span-3">
                <Formik>
                  <Form>
                    <ListingReservation
                      price={property.price}
                      totalPrice={totalPrice}
                      onChangeDate={(value) => setDateRange(value)}
                      dateRange={dateRange}
                      onSubmit={onCreateReservation}
                      disabled={loading}
                      maxGuests={property.maxGuestCount}
                      disabledDates={disabledDates}
                      guestCount={guestCount}
                      setGuestCount={setGuestCount}
                    />
                    {formik.touched.startDate && formik.errors.startDate ? (
                      <div className="text-sm text-red-600">
                        {formik.errors.startDate}
                      </div>
                    ) : null}
                    {formik.touched.endDate && formik.errors.endDate ? (
                      <div className="text-sm text-red-600">
                        {formik.errors.endDate}
                      </div>
                    ) : null}
                    {formik.touched.guestCount && formik.errors.guestCount ? (
                      <div className="text-sm text-red-600">
                        {formik.errors.guestCount}
                      </div>
                    ) : null}
                  </Form>
                </Formik>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </main>
  );
};

export default ListingPage;
