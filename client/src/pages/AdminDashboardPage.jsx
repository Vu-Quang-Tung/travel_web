/* Dashboard admin de quan ly tour, diem den, danh muc, review va thanh toan */
import { useCallback, useEffect, useState } from "react";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { useAuth } from "../context/auth-context";
import {
  confirmAdminPayment,
  createAdminCategory,
  createAdminDestination,
  createAdminImage,
  createAdminItinerary,
  createAdminSchedule,
  createAdminTour,
  deleteAdminCategory,
  deleteAdminDestination,
  deleteAdminImage,
  deleteAdminReview,
  deleteAdminSchedule,
  deleteAdminTour,
  deleteAdminItinerary,
  failAdminPayment,
  getAdminCategories,
  getAdminDestinations,
  getAdminPayments,
  getAdminReviews,
  getAdminTourById,
  getAdminTours,
  hideAdminReview,
  publishAdminReview,
  updateAdminCategory,
  updateAdminDestination,
  updateAdminImage,
  updateAdminItinerary,
  updateAdminSchedule,
  updateAdminTour,
} from "../services/admin.service";
import { formatCurrency } from "../services/api";

function AdminDashboardPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [payments, setPayments] = useState([]);
  const [categoryForm, setCategoryForm] = useState({ name: "", slug: "", description: "" });
  const [destinationForm, setDestinationForm] = useState({
    name: "",
    slug: "",
    country: "",
    city: "",
    short_description: "",
    hero_image_url: "",
    best_season: "",
  });
  const [tourForm, setTourForm] = useState({
    title: "",
    slug: "",
    summary: "",
    category_id: "",
    destination_id: "",
    duration_days: 1,
    duration_nights: 0,
    meeting_point: "",
    max_guests: 10,
    difficulty_level: "Moderate",
    status: "draft",
    featured: 0,
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryEditForm, setCategoryEditForm] = useState({ name: "", slug: "", description: "" });
  const [editingDestination, setEditingDestination] = useState(null);
  const [destinationEditForm, setDestinationEditForm] = useState({
    name: "",
    slug: "",
    country: "",
    city: "",
    short_description: "",
    hero_image_url: "",
    best_season: "",
  });
  const [editingTour, setEditingTour] = useState(null);
  const [tourEditForm, setTourEditForm] = useState({
    title: "",
    slug: "",
    summary: "",
    category_id: "",
    destination_id: "",
    duration_days: 1,
    duration_nights: 0,
    meeting_point: "",
    max_guests: 10,
    difficulty_level: "Moderate",
    status: "draft",
    featured: 0,
  });
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [selectedTourDetails, setSelectedTourDetails] = useState(null);
  const [scheduleForm, setScheduleForm] = useState({
    code: "",
    departure_date: "",
    return_date: "",
    booking_deadline: "",
    seats_total: 0,
    seats_available: 0,
    base_price: 0,
    child_price: 0,
    currency: "VND",
    status: "open",
  });
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [itineraryForm, setItineraryForm] = useState({
    day_number: 1,
    title: "",
    description: "",
    meals: "",
    accommodation: "",
    transport: "",
  });
  const [editingItinerary, setEditingItinerary] = useState(null);
  const [imageForm, setImageForm] = useState({
    image_url: "",
    alt_text: "",
    is_cover: 0,
    sort_order: 0,
  });
  const [editingImage, setEditingImage] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const [categoryData, destinationData, tourData, reviewData, paymentData] = await Promise.all([
        getAdminCategories(token),
        getAdminDestinations(token),
        getAdminTours(token),
        getAdminReviews(token),
        getAdminPayments(token),
      ]);

      setCategories(categoryData);
      setDestinations(destinationData);
      setTours(tourData);
      setReviews(reviewData);
      setPayments(paymentData);

      if (selectedTourId) {
        try {
          const tour = await getAdminTourById(token, selectedTourId);
          setSelectedTourDetails(tour);
        } catch {
          // ignore details refresh errors; main dashboard still loads
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedTourId, token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    async function loadTourDetails() {
      if (!selectedTourId) {
        setSelectedTourDetails(null);
        return;
      }

      try {
        const tour = await getAdminTourById(token, selectedTourId);
        setSelectedTourDetails(tour);
      } catch (error) {
        setErrorMessage(error.message);
      }
    }

    loadTourDetails();
  }, [selectedTourId, token]);

  async function handleAction(action, successMessage) {
    setErrorMessage("");
    setMessage("");

    try {
      await action();
      setMessage(successMessage);
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateCategory(event) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminCategory(token, categoryForm);
      setCategoryForm({ name: "", slug: "", description: "" });
      setMessage("Category created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateDestination(event) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminDestination(token, destinationForm);
      setDestinationForm({
        name: "",
        slug: "",
        country: "",
        city: "",
        short_description: "",
        hero_image_url: "",
        best_season: "",
      });
      setMessage("Destination created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateTour(event) {
    event.preventDefault();
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminTour(token, {
        ...tourForm,
        category_id: Number(tourForm.category_id),
        destination_id: Number(tourForm.destination_id),
        duration_days: Number(tourForm.duration_days),
        duration_nights: Number(tourForm.duration_nights),
        max_guests: Number(tourForm.max_guests),
        featured: Number(tourForm.featured),
      });
      setTourForm((current) => ({
        ...current,
        title: "",
        slug: "",
        summary: "",
        category_id: "",
        destination_id: "",
        duration_days: 1,
        duration_nights: 0,
        meeting_point: "",
        max_guests: 10,
        difficulty_level: "Moderate",
        status: "draft",
        featured: 0,
      }));
      setMessage("Tour created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditCategory(category) {
    setEditingCategory(category.id);
    setCategoryEditForm({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateCategory(event) {
    event.preventDefault();
    if (!editingCategory) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminCategory(token, editingCategory, categoryEditForm);
      setEditingCategory(null);
      setCategoryEditForm({ name: "", slug: "", description: "" });
      setMessage("Category updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteCategoryItem(id) {
    setErrorMessage("");
    setMessage("");
    try {
      await deleteAdminCategory(token, id);
      setMessage("Category deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditDestination(destination) {
    setEditingDestination(destination.id);
    setDestinationEditForm({
      name: destination.name,
      slug: destination.slug,
      country: destination.country || "",
      city: destination.city || "",
      short_description: destination.short_description || "",
      hero_image_url: destination.hero_image_url || "",
      best_season: destination.best_season || "",
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateDestination(event) {
    event.preventDefault();
    if (!editingDestination) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminDestination(token, editingDestination, destinationEditForm);
      setEditingDestination(null);
      setDestinationEditForm({
        name: "",
        slug: "",
        country: "",
        city: "",
        short_description: "",
        hero_image_url: "",
        best_season: "",
      });
      setMessage("Destination updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteDestinationItem(id) {
    setErrorMessage("");
    setMessage("");
    try {
      await deleteAdminDestination(token, id);
      setMessage("Destination deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditTour(tour) {
    setEditingTour(tour.id);
    setTourEditForm({
      title: tour.title,
      slug: tour.slug,
      summary: tour.summary || "",
      category_id: tour.category_id || "",
      destination_id: tour.destination_id || "",
      duration_days: tour.duration_days || 1,
      duration_nights: tour.duration_nights || 0,
      meeting_point: tour.meeting_point || "",
      max_guests: tour.max_guests || 10,
      difficulty_level: tour.difficulty_level || "Moderate",
      status: tour.status || "draft",
      featured: tour.featured || 0,
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateTour(event) {
    event.preventDefault();
    if (!editingTour) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminTour(token, editingTour, {
        ...tourEditForm,
        category_id: Number(tourEditForm.category_id),
        destination_id: Number(tourEditForm.destination_id),
        duration_days: Number(tourEditForm.duration_days),
        duration_nights: Number(tourEditForm.duration_nights),
        max_guests: Number(tourEditForm.max_guests),
        featured: Number(tourEditForm.featured),
      });
      setEditingTour(null);
      setTourEditForm({
        title: "",
        slug: "",
        summary: "",
        category_id: "",
        destination_id: "",
        duration_days: 1,
        duration_nights: 0,
        meeting_point: "",
        max_guests: 10,
        difficulty_level: "Moderate",
        status: "draft",
        featured: 0,
      });
      setMessage("Tour updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteTourItem(id) {
    setErrorMessage("");
    setMessage("");
    try {
      await deleteAdminTour(token, id);
      setMessage("Tour deleted successfully.");
      if (selectedTourId === id) {
        setSelectedTourId(null);
        setSelectedTourDetails(null);
      }
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleSelectTourDetails(id) {
    setSelectedTourId(id);
    setMessage("");
    setErrorMessage("");
  }

  async function handleCreateSchedule(event) {
    event.preventDefault();
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminSchedule(token, selectedTourId, {
        ...scheduleForm,
        seats_total: Number(scheduleForm.seats_total),
        seats_available: Number(scheduleForm.seats_available),
        base_price: Number(scheduleForm.base_price),
        child_price: Number(scheduleForm.child_price),
      });
      setScheduleForm({
        code: "",
        departure_date: "",
        return_date: "",
        booking_deadline: "",
        seats_total: 0,
        seats_available: 0,
        base_price: 0,
        child_price: 0,
        currency: "VND",
        status: "open",
      });
      setMessage("Schedule created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditSchedule(schedule) {
    setEditingSchedule(schedule.id);
    setScheduleForm({
      code: schedule.code,
      departure_date: schedule.departure_date,
      return_date: schedule.return_date,
      booking_deadline: schedule.booking_deadline,
      seats_total: schedule.seats_total,
      seats_available: schedule.seats_available,
      base_price: schedule.base_price,
      child_price: schedule.child_price,
      currency: schedule.currency,
      status: schedule.status,
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateSchedule(event) {
    event.preventDefault();
    if (!selectedTourId || !editingSchedule) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminSchedule(token, selectedTourId, editingSchedule, {
        ...scheduleForm,
        seats_total: Number(scheduleForm.seats_total),
        seats_available: Number(scheduleForm.seats_available),
        base_price: Number(scheduleForm.base_price),
        child_price: Number(scheduleForm.child_price),
      });
      setEditingSchedule(null);
      setScheduleForm({
        code: "",
        departure_date: "",
        return_date: "",
        booking_deadline: "",
        seats_total: 0,
        seats_available: 0,
        base_price: 0,
        child_price: 0,
        currency: "VND",
        status: "open",
      });
      setMessage("Schedule updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteSchedule(id) {
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await deleteAdminSchedule(token, selectedTourId, id);
      setMessage("Schedule deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateItinerary(event) {
    event.preventDefault();
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminItinerary(token, selectedTourId, itineraryForm);
      setItineraryForm({
        day_number: 1,
        title: "",
        description: "",
        meals: "",
        accommodation: "",
        transport: "",
      });
      setMessage("Itinerary created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditItinerary(item) {
    setEditingItinerary(item.id);
    setItineraryForm({
      day_number: item.day_number,
      title: item.title || "",
      description: item.description || "",
      meals: item.meals || "",
      accommodation: item.accommodation || "",
      transport: item.transport || "",
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateItinerary(event) {
    event.preventDefault();
    if (!selectedTourId || !editingItinerary) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminItinerary(token, selectedTourId, editingItinerary, {
        ...itineraryForm,
        day_number: Number(itineraryForm.day_number),
      });
      setEditingItinerary(null);
      setItineraryForm({
        day_number: 1,
        title: "",
        description: "",
        meals: "",
        accommodation: "",
        transport: "",
      });
      setMessage("Itinerary updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteItinerary(id) {
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await deleteAdminItinerary(token, selectedTourId, id);
      setMessage("Itinerary deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateImage(event) {
    event.preventDefault();
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await createAdminImage(token, selectedTourId, {
        ...imageForm,
        is_cover: Number(imageForm.is_cover),
        sort_order: Number(imageForm.sort_order),
      });
      setImageForm({
        image_url: "",
        alt_text: "",
        is_cover: 0,
        sort_order: 0,
      });
      setMessage("Image created successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleStartEditImage(image) {
    setEditingImage(image.id);
    setImageForm({
      image_url: image.image_url || "",
      alt_text: image.alt_text || "",
      is_cover: image.is_cover || 0,
      sort_order: image.sort_order || 0,
    });
    setMessage("");
    setErrorMessage("");
  }

  async function handleUpdateImage(event) {
    event.preventDefault();
    if (!selectedTourId || !editingImage) return;
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminImage(token, selectedTourId, editingImage, {
        ...imageForm,
        is_cover: Number(imageForm.is_cover),
        sort_order: Number(imageForm.sort_order),
      });
      setEditingImage(null);
      setImageForm({
        image_url: "",
        alt_text: "",
        is_cover: 0,
        sort_order: 0,
      });
      setMessage("Image updated successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteImage(id) {
    if (!selectedTourId) return;
    setErrorMessage("");
    setMessage("");

    try {
      await deleteAdminImage(token, selectedTourId, id);
      setMessage("Image deleted successfully.");
      await loadDashboard();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="Admin"
        title="Bảng điều khiển quản trị"
        description="Theo dõi tour, điểm đến, review và các khoản thanh toán đang chờ xử lý."
      />

      <section className="section">
        <div className="container">
          {errorMessage ? <ErrorState message={errorMessage} /> : null}
          {message ? <div className="message-box">{message}</div> : null}

          {loading ? (
            <LoadingState message="Đang tải dữ liệu admin..." />
          ) : (
            <div className="admin-grid">
              <article className="card detail-card">
                <p className="card-meta">Tổng quan</p>
                <h3>Dữ liệu hiện có</h3>
                <div className="info-list">
                  <div><span>Loại tour</span><strong>{categories.length}</strong></div>
                  <div><span>Điểm đến</span><strong>{destinations.length}</strong></div>
                  <div><span>Tour</span><strong>{tours.length}</strong></div>
                  <div><span>Review</span><strong>{reviews.length}</strong></div>
                  <div><span>Thanh toán</span><strong>{payments.length}</strong></div>
                </div>
              </article>

              <article className="card detail-card">
                <p className="card-meta">Tour</p>
                <h3>Danh sách tour</h3>
                <div className="data-list">
                  {tours.map((tour) => (
                    <div key={tour.id} className="data-row data-row--compact">
                      <div>
                        <strong>{tour.title}</strong>
                        <p>{tour.category_name} - {tour.destination_name}</p>
                      </div>
                      <div className="inline-actions inline-actions--stack">
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleStartEditTour(tour)}
                        >
                          Sửa
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleDeleteTourItem(tour.id)}
                        >
                          Xóa
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleSelectTourDetails(tour.id)}
                        >
                          Quản lý chi tiết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingTour ? (
                  <form className="form-grid" onSubmit={handleUpdateTour}>
                    <h4>Chỉnh sửa tour</h4>
                    <label>
                      Tiêu đề
                      <input
                        value={tourEditForm.title}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, title: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Slug
                      <input
                        value={tourEditForm.slug}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, slug: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Tóm tắt
                      <input
                        value={tourEditForm.summary}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, summary: event.target.value }))}
                      />
                    </label>
                    <label>
                      Category
                      <select
                        value={tourEditForm.category_id}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, category_id: event.target.value }))}
                        required
                      >
                        <option value="">Chọn category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Destination
                      <select
                        value={tourEditForm.destination_id}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, destination_id: event.target.value }))}
                        required
                      >
                        <option value="">Chọn destination</option>
                        {destinations.map((destination) => (
                          <option key={destination.id} value={destination.id}>
                            {destination.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Thời gian (ngày)
                      <input
                        type="number"
                        min="1"
                        value={tourEditForm.duration_days}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, duration_days: event.target.value }))}
                      />
                    </label>
                    <label>
                      Thời gian (đêm)
                      <input
                        type="number"
                        min="0"
                        value={tourEditForm.duration_nights}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, duration_nights: event.target.value }))}
                      />
                    </label>
                    <label>
                      Điểm họp
                      <input
                        value={tourEditForm.meeting_point}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, meeting_point: event.target.value }))}
                      />
                    </label>
                    <label>
                      Số khách tối đa
                      <input
                        type="number"
                        min="1"
                        value={tourEditForm.max_guests}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, max_guests: event.target.value }))}
                      />
                    </label>
                    <label>
                      Mức độ
                      <input
                        value={tourEditForm.difficulty_level}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, difficulty_level: event.target.value }))}
                      />
                    </label>
                    <label>
                      Trạng thái
                      <select
                        value={tourEditForm.status}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, status: event.target.value }))}
                      >
                        <option value="draft">draft</option>
                        <option value="published">published</option>
                      </select>
                    </label>
                    <label>
                      Nổi bật
                      <select
                        value={tourEditForm.featured}
                        onChange={(event) => setTourEditForm((current) => ({ ...current, featured: event.target.value }))}
                      >
                        <option value={0}>Không</option>
                        <option value={1}>Có</option>
                      </select>
                    </label>
                    <div className="form-row">
                      <button className="button button--primary button--small" type="submit">
                        Lưu tour
                      </button>
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        onClick={() => setEditingTour(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>

              <article className="card detail-card">
                <p className="card-meta">Điểm đến</p>
                <h3>Danh sách điểm đến</h3>
                <div className="data-list">
                  {destinations.map((destination) => (
                    <div key={destination.id} className="data-row data-row--compact">
                      <div>
                        <strong>{destination.name}</strong>
                        <p>{destination.city}, {destination.country}</p>
                      </div>
                      <div className="inline-actions inline-actions--stack">
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleStartEditDestination(destination)}
                        >
                          Sửa
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleDeleteDestinationItem(destination.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingDestination ? (
                  <form className="form-grid" onSubmit={handleUpdateDestination}>
                    <h4>Chỉnh sửa điểm đến</h4>
                    <label>
                      Tên điểm đến
                      <input
                        value={destinationEditForm.name}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, name: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Slug
                      <input
                        value={destinationEditForm.slug}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, slug: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Quốc gia
                      <input
                        value={destinationEditForm.country}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, country: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Thành phố
                      <input
                        value={destinationEditForm.city}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, city: event.target.value }))}
                      />
                    </label>
                    <label>
                      Mô tả ngắn
                      <input
                        value={destinationEditForm.short_description}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, short_description: event.target.value }))}
                      />
                    </label>
                    <label>
                      Ảnh hiển thị
                      <input
                        value={destinationEditForm.hero_image_url}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, hero_image_url: event.target.value }))}
                      />
                    </label>
                    <label>
                      Mùa đẹp nhất
                      <input
                        value={destinationEditForm.best_season}
                        onChange={(event) => setDestinationEditForm((current) => ({ ...current, best_season: event.target.value }))}
                      />
                    </label>
                    <div className="form-row">
                      <button className="button button--primary button--small" type="submit">
                        Lưu điểm đến
                      </button>
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        onClick={() => setEditingDestination(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>

              <article className="card detail-card">
                <p className="card-meta">Loại tour</p>
                <h3>Danh sách loại tour</h3>
                <div className="data-list">
                  {categories.map((category) => (
                    <div key={category.id} className="data-row data-row--compact">
                      <div>
                        <strong>{category.name}</strong>
                        <p>{category.slug}</p>
                      </div>
                      <div className="inline-actions inline-actions--stack">
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleStartEditCategory(category)}
                        >
                          Sửa
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleDeleteCategoryItem(category.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {editingCategory ? (
                  <form className="form-grid" onSubmit={handleUpdateCategory}>
                    <h4>Chỉnh sửa category</h4>
                    <label>
                      Tên category
                      <input
                        value={categoryEditForm.name}
                        onChange={(event) => setCategoryEditForm((current) => ({ ...current, name: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Slug
                      <input
                        value={categoryEditForm.slug}
                        onChange={(event) => setCategoryEditForm((current) => ({ ...current, slug: event.target.value }))}
                        required
                      />
                    </label>
                    <label>
                      Mô tả
                      <input
                        value={categoryEditForm.description}
                        onChange={(event) => setCategoryEditForm((current) => ({ ...current, description: event.target.value }))}
                      />
                    </label>
                    <div className="form-row">
                      <button className="button button--primary button--small" type="submit">
                        Lưu category
                      </button>
                      <button
                        type="button"
                        className="button button--ghost button--small"
                        onClick={() => setEditingCategory(null)}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : null}
              </article>

              <article className="card detail-card">
                <p className="card-meta">Tạo mới</p>
                <h3>Tạo category</h3>
                <form className="form-grid" onSubmit={handleCreateCategory}>
                  <label>
                    Tên category
                    <input
                      value={categoryForm.name}
                      onChange={(event) => setCategoryForm((current) => ({ ...current, name: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Slug
                    <input
                      value={categoryForm.slug}
                      onChange={(event) => setCategoryForm((current) => ({ ...current, slug: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Mô tả
                    <input
                      value={categoryForm.description}
                      onChange={(event) => setCategoryForm((current) => ({ ...current, description: event.target.value }))}
                    />
                  </label>
                  <button className="button button--primary button--small" type="submit">
                    Tạo category
                  </button>
                </form>
              </article>

              <article className="card detail-card">
                <p className="card-meta">Tạo mới</p>
                <h3>Tạo điểm đến</h3>
                <form className="form-grid" onSubmit={handleCreateDestination}>
                  <label>
                    Tên điểm đến
                    <input
                      value={destinationForm.name}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, name: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Slug
                    <input
                      value={destinationForm.slug}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, slug: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Quốc gia
                    <input
                      value={destinationForm.country}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, country: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Thành phố
                    <input
                      value={destinationForm.city}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, city: event.target.value }))}
                    />
                  </label>
                  <label>
                    Mô tả ngắn
                    <input
                      value={destinationForm.short_description}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, short_description: event.target.value }))}
                    />
                  </label>
                  <label>
                    Ảnh hiển thị
                    <input
                      value={destinationForm.hero_image_url}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, hero_image_url: event.target.value }))}
                    />
                  </label>
                  <label>
                    Mùa đẹp nhất
                    <input
                      value={destinationForm.best_season}
                      onChange={(event) => setDestinationForm((current) => ({ ...current, best_season: event.target.value }))}
                    />
                  </label>
                  <button className="button button--primary button--small" type="submit">
                    Tạo điểm đến
                  </button>
                </form>
              </article>

              <article className="card detail-card">
                <p className="card-meta">Tạo mới</p>
                <h3>Tạo tour</h3>
                <form className="form-grid" onSubmit={handleCreateTour}>
                  <label>
                    Tiêu đề
                    <input
                      value={tourForm.title}
                      onChange={(event) => setTourForm((current) => ({ ...current, title: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Slug
                    <input
                      value={tourForm.slug}
                      onChange={(event) => setTourForm((current) => ({ ...current, slug: event.target.value }))}
                      required
                    />
                  </label>
                  <label>
                    Tóm tắt
                    <input
                      value={tourForm.summary}
                      onChange={(event) => setTourForm((current) => ({ ...current, summary: event.target.value }))}
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={tourForm.category_id}
                      onChange={(event) => setTourForm((current) => ({ ...current, category_id: event.target.value }))}
                      required
                    >
                      <option value="">Chọn category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Destination
                    <select
                      value={tourForm.destination_id}
                      onChange={(event) => setTourForm((current) => ({ ...current, destination_id: event.target.value }))}
                      required
                    >
                      <option value="">Chọn destination</option>
                      {destinations.map((destination) => (
                        <option key={destination.id} value={destination.id}>
                          {destination.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Thời gian (ngày)
                    <input
                      type="number"
                      min="1"
                      value={tourForm.duration_days}
                      onChange={(event) => setTourForm((current) => ({ ...current, duration_days: event.target.value }))}
                    />
                  </label>
                  <label>
                    Thời gian (đêm)
                    <input
                      type="number"
                      min="0"
                      value={tourForm.duration_nights}
                      onChange={(event) => setTourForm((current) => ({ ...current, duration_nights: event.target.value }))}
                    />
                  </label>
                  <label>
                    Điểm họp
                    <input
                      value={tourForm.meeting_point}
                      onChange={(event) => setTourForm((current) => ({ ...current, meeting_point: event.target.value }))}
                    />
                  </label>
                  <label>
                    Số khách tối đa
                    <input
                      type="number"
                      min="1"
                      value={tourForm.max_guests}
                      onChange={(event) => setTourForm((current) => ({ ...current, max_guests: event.target.value }))}
                    />
                  </label>
                  <label>
                    Mức độ
                    <input
                      value={tourForm.difficulty_level}
                      onChange={(event) => setTourForm((current) => ({ ...current, difficulty_level: event.target.value }))}
                    />
                  </label>
                  <label>
                    Trạng thái
                    <select
                      value={tourForm.status}
                      onChange={(event) => setTourForm((current) => ({ ...current, status: event.target.value }))}
                    >
                      <option value="draft">draft</option>
                      <option value="published">published</option>
                    </select>
                  </label>
                  <label>
                    Nổi bật
                    <select
                      value={tourForm.featured}
                      onChange={(event) => setTourForm((current) => ({ ...current, featured: event.target.value }))}
                    >
                      <option value={0}>Không</option>
                      <option value={1}>Có</option>
                    </select>
                  </label>
                  <button className="button button--primary button--small" type="submit">
                    Tạo tour
                  </button>
                </form>
              </article>

              <article className="card detail-card">
                <p className="card-meta">Quản lý tour</p>
                <h3>Schedule / Itinerary / Image</h3>
                <div className="form-grid">
                  <label>
                    Chọn tour để quản lý
                    <select value={selectedTourId || ""} onChange={(event) => handleSelectTourDetails(Number(event.target.value))}>
                      <option value="">Chọn tour</option>
                      {tours.map((tour) => (
                        <option key={tour.id} value={tour.id}>
                          {tour.title}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {selectedTourDetails ? (
                  <div className="admin-subsection">
                    <h4>{selectedTourDetails.title}</h4>

                    <section>
                      <h5>Lịch khởi hành</h5>
                      <div className="data-list">
                        {(selectedTourDetails.scheduleRows || []).map((schedule) => (
                          <div key={schedule.id} className="data-row data-row--compact">
                            <div>
                              <strong>{schedule.code}</strong>
                              <p>{schedule.departure_date} → {schedule.return_date}</p>
                              <p>Giá: {formatCurrency(schedule.base_price)} / Trẻ em: {formatCurrency(schedule.child_price)}</p>
                            </div>
                            <div className="inline-actions inline-actions--stack">
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleStartEditSchedule(schedule)}
                              >
                                Sửa
                              </button>
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleDeleteSchedule(schedule.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form className="form-grid" onSubmit={editingSchedule ? handleUpdateSchedule : handleCreateSchedule}>
                        <h6>{editingSchedule ? "Chỉnh sửa schedule" : "Thêm schedule mới"}</h6>
                        <label>
                          Mã
                          <input
                            value={scheduleForm.code}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, code: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Ngày khởi hành
                          <input
                            type="date"
                            value={scheduleForm.departure_date}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, departure_date: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Ngày về
                          <input
                            type="date"
                            value={scheduleForm.return_date}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, return_date: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Hạn chót book
                          <input
                            type="date"
                            value={scheduleForm.booking_deadline}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, booking_deadline: event.target.value }))}
                          />
                        </label>
                        <label>
                          Tổng ghế
                          <input
                            type="number"
                            min="1"
                            value={scheduleForm.seats_total}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, seats_total: event.target.value }))}
                          />
                        </label>
                        <label>
                          Ghế còn lại
                          <input
                            type="number"
                            min="0"
                            value={scheduleForm.seats_available}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, seats_available: event.target.value }))}
                          />
                        </label>
                        <label>
                          Giá người lớn
                          <input
                            type="number"
                            min="0"
                            value={scheduleForm.base_price}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, base_price: event.target.value }))}
                          />
                        </label>
                        <label>
                          Giá trẻ em
                          <input
                            type="number"
                            min="0"
                            value={scheduleForm.child_price}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, child_price: event.target.value }))}
                          />
                        </label>
                        <label>
                          Trạng thái
                          <select
                            value={scheduleForm.status}
                            onChange={(event) => setScheduleForm((current) => ({ ...current, status: event.target.value }))}
                          >
                            <option value="open">open</option>
                            <option value="closed">closed</option>
                          </select>
                        </label>
                        <button className="button button--primary button--small" type="submit">
                          {editingSchedule ? "Cập nhật schedule" : "Thêm schedule"}
                        </button>
                      </form>
                    </section>

                    <section>
                      <h5>Lịch trình</h5>
                      <div className="data-list">
                        {(selectedTourDetails.itineraryRows || []).map((item) => (
                          <div key={item.id} className="data-row data-row--compact">
                            <div>
                              <strong>Ngày {item.day_number}: {item.title}</strong>
                              <p>{item.description}</p>
                            </div>
                            <div className="inline-actions inline-actions--stack">
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleStartEditItinerary(item)}
                              >
                                Sửa
                              </button>
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleDeleteItinerary(item.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form className="form-grid" onSubmit={editingItinerary ? handleUpdateItinerary : handleCreateItinerary}>
                        <h6>{editingItinerary ? "Chỉnh sửa itinerary" : "Thêm itinerary mới"}</h6>
                        <label>
                          Ngày
                          <input
                            type="number"
                            min="1"
                            value={itineraryForm.day_number}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, day_number: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Tiêu đề
                          <input
                            value={itineraryForm.title}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, title: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Mô tả
                          <textarea
                            rows="3"
                            value={itineraryForm.description}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, description: event.target.value }))}
                          />
                        </label>
                        <label>
                          Bữa ăn
                          <input
                            value={itineraryForm.meals}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, meals: event.target.value }))}
                          />
                        </label>
                        <label>
                          Chỗ ở
                          <input
                            value={itineraryForm.accommodation}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, accommodation: event.target.value }))}
                          />
                        </label>
                        <label>
                          Phương tiện
                          <input
                            value={itineraryForm.transport}
                            onChange={(event) => setItineraryForm((current) => ({ ...current, transport: event.target.value }))}
                          />
                        </label>
                        <button className="button button--primary button--small" type="submit">
                          {editingItinerary ? "Cập nhật itinerary" : "Thêm itinerary"}
                        </button>
                      </form>
                    </section>

                    <section>
                      <h5>Hình ảnh tour</h5>
                      <div className="data-list">
                        {(selectedTourDetails.imageRows || []).map((image) => (
                          <div key={image.id} className="data-row data-row--compact">
                            <div>
                              <strong>{image.alt_text || "Ảnh tour"}</strong>
                              <p>{image.image_url}</p>
                            </div>
                            <div className="inline-actions inline-actions--stack">
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleStartEditImage(image)}
                              >
                                Sửa
                              </button>
                              <button
                                className="button button--ghost button--small"
                                onClick={() => handleDeleteImage(image.id)}
                              >
                                Xóa
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <form className="form-grid" onSubmit={editingImage ? handleUpdateImage : handleCreateImage}>
                        <h6>{editingImage ? "Chỉnh sửa ảnh" : "Thêm ảnh mới"}</h6>
                        <label>
                          URL ảnh
                          <input
                            value={imageForm.image_url}
                            onChange={(event) => setImageForm((current) => ({ ...current, image_url: event.target.value }))}
                            required
                          />
                        </label>
                        <label>
                          Alt text
                          <input
                            value={imageForm.alt_text}
                            onChange={(event) => setImageForm((current) => ({ ...current, alt_text: event.target.value }))}
                          />
                        </label>
                        <label>
                          Cover
                          <select
                            value={imageForm.is_cover}
                            onChange={(event) => setImageForm((current) => ({ ...current, is_cover: event.target.value }))}
                          >
                            <option value={0}>Không</option>
                            <option value={1}>Có</option>
                          </select>
                        </label>
                        <label>
                          Thứ tự
                          <input
                            type="number"
                            min="0"
                            value={imageForm.sort_order}
                            onChange={(event) => setImageForm((current) => ({ ...current, sort_order: event.target.value }))}
                          />
                        </label>
                        <button className="button button--primary button--small" type="submit">
                          {editingImage ? "Cập nhật ảnh" : "Thêm ảnh"}
                        </button>
                      </form>
                    </section>
                  </div>
                ) : null}
              </article>

              <article className="card detail-card">
                <p className="card-meta">Review</p>
                <h3>Review chờ quản lý</h3>
                <div className="data-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="data-row">
                      <div>
                        <strong>{review.title || "Không có tiêu đề"}</strong>
                        <p>{review.content}</p>
                      </div>
                      <div className="inline-actions inline-actions--stack">
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleAction(() => publishAdminReview(token, review.id), "Đã hiện review.")}
                        >
                          Hiện
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleAction(() => hideAdminReview(token, review.id), "Đã ẩn review.")}
                        >
                          Ẩn
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleAction(() => deleteAdminReview(token, review.id), "Đã xóa review.")}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="card detail-card">
                <p className="card-meta">Thanh toán</p>
                <h3>Giao dịch gần đây</h3>
                <div className="data-list">
                  {payments.map((payment) => (
                    <div key={payment.id} className="data-row">
                      <div>
                        <strong>{payment.booking_code}</strong>
                        <p>{payment.full_name}</p>
                        <p>{formatCurrency(payment.amount)}</p>
                      </div>
                      <div className="inline-actions inline-actions--stack">
                        <span>{payment.status}</span>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleAction(() => confirmAdminPayment(token, payment.id), "Đã xác nhận thanh toán.")}
                        >
                          Xác nhận
                        </button>
                        <button
                          className="button button--ghost button--small"
                          onClick={() => handleAction(() => failAdminPayment(token, payment.id), "Đã đánh dấu thanh toán thất bại.")}
                        >
                          Thất bại
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default AdminDashboardPage;
