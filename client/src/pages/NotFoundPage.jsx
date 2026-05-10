/* Trang 404 khi URL khong khop route nao */
import { Link } from "react-router-dom";
import PageHero from "../components/common/PageHero";

function NotFoundPage() {
  return (
    <main>
      <PageHero
        eyebrow="404"
        title="Không tìm thấy trang"
        description="Có thể đường dẫn này không còn tồn tại hoặc bạn đã đi lạc khỏi hành trình."
      />
      <section className="section center-box">
        <Link className="button button--primary" to="/">
          Về lại trang chủ
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
