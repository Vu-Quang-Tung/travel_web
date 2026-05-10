/* Trang danh muc tour public */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";
import LoadingState from "../components/common/LoadingState";
import ErrorState from "../components/common/ErrorState";
import { getCategories } from "../services/categories.service";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const categoryData = await getCategories();
        setCategories(categoryData);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <main>
      <PageHero
        eyebrow="Loại tour"
        title="Tìm một kiểu hành trình hợp với cách bạn muốn nghỉ ngơi."
        description="Từ nghỉ dưỡng nhẹ nhàng đến những chuyến đi có nhiều trải nghiệm hơn, mỗi nhóm tour đều có một tính cách riêng."
      />

      <section className="section">
        <div className="container">
          {errorMessage ? (
            <ErrorState message={errorMessage} />
          ) : loading ? (
            <LoadingState message="Đang tải loại tour..." />
          ) : (
            <div className="card-grid">
              {categories.map((category) => (
                <article key={category.id} className="card detail-card">
                  <p className="card-meta">{category.slug}</p>
                  <h3>{category.name}</h3>
                  <p>{category.description || "Đang cập nhật mô tả cho nhóm tour này."}</p>
                  <Link className="button button--ghost button--small" to={`/tours?category=${category.slug}`}>
                    Xem tour
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default CategoriesPage;
