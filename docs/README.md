# Hưởng ứng Ngày Văn hóa Việt Nam 24/11/2026

Sản phẩm truyền thông của **lớp 12A01 – Trường THPT Trần Phú**.
Slogan: *Giữ hồn cốt Việt – Viết tiếp tương lai*.

## Cấu trúc

```
docs/
├── index.html        Trang chủ
├── ban-sac.html      Bản sắc văn hóa Việt Nam
├── giu-gin.html      Vì sao cần giữ gìn bản sắc
├── y-nghia.html      Ý nghĩa Ngày Văn hóa Việt Nam 24/11
├── hanh-dong.html    Người trẻ cần làm gì
├── thong-diep.html   Slogan – Thông điệp
├── style.css         Giao diện (responsive: điện thoại → tivi)
├── script.js         Menu, hiệu ứng, xem ảnh phóng to, đếm ngày
├── media/            Ảnh
└── tools/nen-anh.py  Script nén ảnh (không bắt buộc)
```

## Đưa lên GitHub Pages

1. Tạo repository mới trên GitHub, upload toàn bộ nội dung dự án (thư mục `docs` ở ngoài cùng).
2. Vào **Settings → Pages**.
3. Ở mục **Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, thư mục = `/docs`, bấm **Save**.
4. Chờ 1–2 phút, web có địa chỉ dạng `https://<tên-github>.github.io/<tên-repo>/`.

## Chạy thử trên máy

Mở file `docs/index.html` bằng trình duyệt (Chrome, Edge, Safari...). Cần có mạng để tải font chữ; nếu không có mạng web vẫn chạy bình thường với font dự phòng.

## Thêm / đổi ảnh

Bỏ ảnh vào `docs/media/`, rồi trong HTML thêm:

```html
<figure style="--r:1.5"><img src="media/ten-anh.png" width="1500" height="1000" alt="Mô tả ảnh" loading="lazy" decoding="async"></figure>
```

`--r` là tỉ lệ rộng ÷ cao của ảnh (ví dụ ảnh 1500×1000 thì `--r:1.5`). Đặt đúng giá trị này thì ảnh luôn hiển thị đủ, không bị cắt hay méo.
