/* Trang gioi thieu thuong hieu va gia tri dich vu */
import PageHero from "../components/common/PageHero";

function AboutPage() {
  return (
    <main>
      <PageHero
        eyebrow="Giới thiệu"
        title="Những chuyến đi được chọn để giữ cảm giác thư giãn và dễ chịu."
        description="Travel Web hướng đến những hành trình nhẹ nhàng, rõ lịch trình và dễ chọn cho nhóm bạn, cặp đôi hay gia đình nhỏ."
      />

      <section className="section">
        <div className="container info-grid">
          <article className="card detail-card">
            <p className="section-kicker">Cách chọn tour</p>
            <h3>Mỗi hành trình đều ưu tiên sự rõ ràng.</h3>
            <p>
              Từ thời gian khởi hành, chi phí dự kiến đến các điểm dừng chân trong lịch trình, thông tin đều được
              trình bày gọn gàng để bạn dễ đưa ra quyết định.
            </p>
          </article>

          <article className="card detail-card">
            <p className="section-kicker">Trải nghiệm</p>
            <h3>Không cần quá nhiều, chỉ cần đúng những gì cần thiết.</h3>
            <p>
              Trang web này tập trung vào những nội dung người xem quan tâm nhất: điểm đến, lịch trình, lịch khởi
              hành và cách đặt chỗ đơn giản.
            </p>
          </article>

          <article className="card detail-card">
            <p className="section-kicker">Phong cách</p>
            <h3>Nhẹ, sạch và hướng đến cảm giác nghỉ dưỡng.</h3>
            <p>
              Hình ảnh, nội dung và bố cục được giữ ở mức vừa đủ để trang web trông như một nơi tìm cảm hứng cho
              kỳ nghỉ, không bị ồn ào hay quá tải thông tin.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default AboutPage;
