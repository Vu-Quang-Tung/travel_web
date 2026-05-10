/* Trang danh sach tour va bo loc hien thi */
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import TourList from "../components/tours/TourList";
import { getTours } from "../services/tours.service";

function ToursPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [keyword, setKeyword] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    async function loadTours() {
      try {
        const data = await getTours();
        setTours(data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setCategoryFilter(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const currentCategory = searchParams.get("category") || "all";
    if (categoryFilter === currentCategory) {
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    if (categoryFilter === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryFilter);
    }

    setSearchParams(nextParams, { replace: true });
  }, [categoryFilter, searchParams, setSearchParams]);

  const destinationOptions = useMemo(() => {
    const names = [...new Set(tours.map((tour) => tour.destination_name).filter(Boolean))];
    return names.sort((left, right) => left.localeCompare(right));
  }, [tours]);

  const categoryOptions = useMemo(() => {
    const names = [...new Set(tours.map((tour) => tour.category_name).filter(Boolean))];
    return names.sort((left, right) => left.localeCompare(right));
  }, [tours]);

  const filteredTours = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    const nextTours = tours.filter((tour) => {
      const haystack = [tour.title, tour.summary, tour.destination_name].join(" ").toLowerCase();
      const matchesKeyword = normalizedKeyword ? haystack.includes(normalizedKeyword) : true;
      const matchesDestination = destinationFilter === "all" ? true : tour.destination_name === destinationFilter;
      const matchesCategory = categoryFilter === "all" ? true : tour.category_name === categoryFilter;
      const matchesFeatured =
        featuredFilter === "all"
          ? true
          : featuredFilter === "featured"
            ? Number(tour.featured) === 1
            : Number(tour.featured) === 0;

      return matchesKeyword && matchesDestination && matchesCategory && matchesFeatured;
    });

    nextTours.sort((left, right) => {
      if (sortBy === "price-asc") {
        return Number(left.base_price || 0) - Number(right.base_price || 0);
      }

      if (sortBy === "duration-asc") {
        return Number(left.duration_days || 0) - Number(right.duration_days || 0);
      }

      if (sortBy === "departure-soon") {
        return String(left.nearest_departure_date || "").localeCompare(String(right.nearest_departure_date || ""));
      }

      return Number(right.featured || 0) - Number(left.featured || 0) || Number(right.id || 0) - Number(left.id || 0);
    });

    return nextTours;
  }, [categoryFilter, destinationFilter, featuredFilter, keyword, sortBy, tours]);

  return (
    <main>
      <PageHero
        eyebrow="Danh sách tour"
        title="Chọn một hành trình phù hợp với cách bạn muốn nghỉ ngơi"
        description="Từ nghỉ dưỡng nhẹ nhàng đến những chuyến đi giảm nhịp, mỗi tour đều có lịch khởi hành rõ ràng và thông tin để bạn so sánh nhanh."
      />

      <section className="section">
        <div className="container">
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState />
          ) : (
            <>
              <div className="filter-shell">
                <div className="filter-shell__copy">
                  <p className="section-kicker">Tìm nhanh tour phù hợp</p>
                  <h3>Lọc theo điểm đến, giá và nhu cầu nghỉ ngơi</h3>
                  <p>{filteredTours.length} hành trình đang sẵn sàng để bạn cân nhắc.</p>
                </div>

                <div className="filter-bar">
                  <label>
                    Tìm tour
                    <input
                      placeholder="Nhập tên tour, điểm đến..."
                      value={keyword}
                      onChange={(event) => setKeyword(event.target.value)}
                    />
                  </label>

                  <label>
                    Nhóm tour
                    <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
                      <option value="all">Tất cả loại tour</option>
                      {categoryOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Điểm đến
                    <select value={destinationFilter} onChange={(event) => setDestinationFilter(event.target.value)}>
                      <option value="all">Tất cả điểm đến</option>
                      {destinationOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    Dạng tour
                    <select value={featuredFilter} onChange={(event) => setFeaturedFilter(event.target.value)}>
                      <option value="all">Tất cả</option>
                      <option value="featured">Tour nổi bật</option>
                      <option value="regular">Tour thường</option>
                    </select>
                  </label>

                  <label>
                    Sắp xếp
                    <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option value="recommended">Gợi ý trước</option>
                      <option value="price-asc">Giá tăng dần</option>
                      <option value="duration-asc">Thời gian ngắn trước</option>
                      <option value="departure-soon">Khởi hành sớm nhất</option>
                    </select>
                  </label>
                </div>
              </div>

              <TourList tours={filteredTours} />
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ToursPage;
