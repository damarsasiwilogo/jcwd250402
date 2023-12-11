import { useState, useEffect } from "react";
import { Navbar, Footer } from "../components";
import EmptyState from "../components/EmptyState";
import { getListings, ListingCard } from "../components/propertyListings";
import { Skeleton, Card } from "@mantine/core";
import Container from "../components/Container";

export default function Home() {
  document.title = "Nginapp - Elevate your rental experience";
  const [propertyListings, setPropertyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const listings = await getListings();
        setPropertyListings(listings);
        if (listings.response === 200) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (propertyListings.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <header>
          <Navbar />
        </header>

        <main className="flex-1">
          <div className="pb-20 pt-28">
            <Container>
              <EmptyState
                title="No listings found"
                description="We couldn't find any listings. Please try again later."
              />
            </Container>
          </div>
        </main>

        <footer>
          <Footer />
        </footer>
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
            <div className="grid grid-cols-1 gap-8 pt-24 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ">
              <Skeleton visible={loading}>
                {propertyListings.map((listing) => (
                  <ListingCard key={listing.id} data={listing} />
                ))}
              </Skeleton>
            </div>
          </Container>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}
