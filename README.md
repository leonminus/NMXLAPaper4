# PointPillars Interactive Explorer

Web **PointPillars: Fast Encoders for Object Detection from Point Clouds**, 

## Chạy ứng dụng

Yêu cầu Node.js 20.19+ hoặc 22.12+ (khuyến nghị Node 24).

```sh
npm install
npm run dev
```
Nếu bị lỗi,Mở PowerShell với quyền Administrator (Nhấn chuột phải vào biểu tượng PowerShell -> chọn Run as administrator).

Gõ lệnh sau rồi nhấn Enter:

```sh
powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
Mở http://127.0.0.1:5173. Nếu PowerShell chặn `npm.ps1`, dùng `npm.cmd` thay `npm`.

```sh
npm run build
npm run preview
npm test
```

Build bao gồm kiểm tra TypeScript. Các gói, icon và tài nguyên được bundle cục bộ; sau khi cài dependencies, chạy demo không cần Internet. Liên kết bài báo chỉ cần mạng nếu người xem mở nó.

## Thao tác

- Kéo chuột trái: xoay; cuộn: zoom; chuột phải: dịch.
- Nhấp một điểm: chọn điểm và pillar chứa nó. Ở bước 3 có thêm danh sách điểm thật trong pillar.
- Phím ← / →: chuyển bước; R: đặt lại camera. Nút toàn màn hình dùng Fullscreen API, Escape thoát.
- Chuyển bước tự đặt góc nhìn thích hợp; sau đó có thể tự xoay.
- Đổi cảnh, cạnh ô hoặc chế độ dữ liệu sẽ xóa selection cũ.
- Thanh bên có thể cuộn trên màn hình thấp. Khuyến nghị 1366×768 trở lên

## Phạm vi khoa học và mô phỏng

- Ba cảnh tổng hợp có seed cố định, điểm chủ yếu trên mái/bề mặt hướng về cảm biến, mật độ giảm ở xa. Đây là cảnh giáo dục, không phải bộ mô phỏng vật lý LiDAR hay KITTI thật.
- Cảnh 3 giảm điểm và loại một phần điểm ô tô phía sau vật cản. Hộp tổng hợp là **hộp tham chiếu của cảnh tổng hợp**, không phải dự đoán.
- Lưới pillar chỉ phân vùng x–y, lọc vùng chiều cao nhưng không chia tầng z. Bản so sánh voxel vẽ thêm lát cắt z tại các cột lân cận để giữ cảnh dễ đọc.
- Demo dùng mặc định cạnh ô 0,32 m, P tối đa 6.000, N tối đa 32. Có thể chọn 0,16 / 0,24 / 0,32 / 0,48 m. Bài báo mục 4.2 dùng mặc định 0,16 m, P tối đa 12.000, N tối đa 100.
- Trung bình tọa độ được tính trên toàn bộ điểm thật trong ô trước khi lấy mẫu. Dư P/N dùng lấy mẫu có seed cố định. Hàng padding được biểu diễn ngầm bằng 0 và loại khỏi phép gộp; không tạo điểm ở gốc. Khi ReLU không âm, max trên các điểm thật và zero padding cho cùng kết quả.
- Mã hóa đủ 64 kênh bằng phép Linear với trọng số cố định theo seed, BatchNorm với tham số cố định minh họa và ReLU. Đây **không phải trọng số đã huấn luyện hoặc đặc trưng thật**. Ma trận phóng to 4 điểm × 8 kênh (2 điểm trên màn hình thấp); pooling dùng tất cả điểm thật được giữ lại, không chỉ các hàng đang phóng to.
- Scatter thực thi trên các vector mô phỏng. Ô rỗng giữ 0. Màu heatmap được chuẩn hóa theo max của kênh đang xem.
- Backbone là sơ đồ kiến trúc Car (stride đầu S=2, C=64), không chạy CNN. Detection head chưa chạy. Không có AP, confidence hoặc FPS được tạo giả.
- Không tích hợp checkpoint, huấn luyện hoặc suy luận thật. Chức năng import cho phép xem kết quả được tính sẵn bên ngoài, độc lập với cảnh tổng hợp.
- Trục dữ liệu là x/y mặt đất, z hướng lên. Renderer chuyển sang hệ Three.js bằng `(x,z,-y)`. Góc theta quay ngược chiều kim đồng hồ từ +x trong mặt phẳng x–y.

## Định dạng import

Ở bước 6 chọn **Kết quả mô hình → Nạp kết quả JSON**. File chứa cả point cloud và hộp dự đoán tương ứng. Ví dụ cấu trúc dưới đây là định dạng, không chứa dự đoán:

```json
{
  "schemaVersion": 1,
  "metadata": {
    "model": "Tên mô hình đã chạy bên ngoài",
    "checkpoint": "Mã hoặc đường dẫn checkpoint",
    "sample": "Mã mẫu point cloud"
  },
  "points": [
    { "x": 0.0, "y": 0.0, "z": 0.0, "r": 0.5 }
  ],
  "predictions": []
}
```

Mỗi phần tử `predictions` nếu có phải gồm:

| Trường | Ý nghĩa |
|---|---|
| `id` | Chuỗi duy nhất, tùy chọn; bỏ trống sẽ sinh mã chỉ mục |
| `label` | `Car`, `Pedestrian` hoặc `Cyclist` |
| `x`, `y`, `z` | Tâm hộp, mét, cùng hệ tọa độ với point cloud |
| `w`, `l`, `h` | Chiều rộng theo y cục bộ, chiều dài theo x cục bộ, chiều cao, mét, dương |
| `theta` | Góc hướng quanh +z, radian, tính từ +x |
| `confidence` | Tùy chọn, số thực trong [0,1]; chỉ cung cấp điểm số thật từ mô hình |

`metadata` tùy chọn; nếu có sẽ hiển thị nguyên giá trị. JSON chỉ được kiểm tra định dạng, không xác minh nguồn gốc hay độ chính xác của suy luận. Trình xem không tự sinh confidence khi trường này vắng mặt. Chế độ mô hình không hiển thị hộp hay điểm của cảnh tổng hợp.

Giới hạn an toàn bộ nhớ: 30 MB, 1–100.000 điểm, tối đa 500 hộp, tọa độ ±10.000 m, tối đa 4 triệu ô ở cạnh 0,16 m. r và confidence trong [0,1], số hữu hạn; file sai báo lỗi rõ ràng và giữ dữ liệu hợp lệ trước đó.

## Cấu trúc mã nguồn

```text
src/core/synthetic.ts   Sinh ba cảnh tổng hợp
src/core/pillars.ts     Gom điểm và lấy mẫu pillar
src/core/features.ts    Vector 9 chiều và độ lệch
src/core/encoder.ts     Linear/BN/ReLU cố định, max pooling
src/core/scatter.ts     Scatter kênh về pseudo-image
src/core/import.ts      Kiểm tra JSON dự đoán
src/components/        Renderer Three.js và sơ đồ mạng
src/App.tsx            Trạng thái và điều khiển tương tác
tests/core.test.ts     Kiểm thử phép tính và schema
scripts/acceptance.mjs Kiểm thử trình duyệt, chụp ảnh nghiệm thu
output/acceptance/     Ảnh PNG, chú thích, kết quả kiểm tra
```

Point cloud dùng BufferGeometry, cột dùng một LineSegments, pseudo-image dùng InstancedMesh. React memo hóa dữ liệu, gom pillar, encoding và scatter; chỉ encoding toàn cảnh ở bước 5. Geometry được giải phóng khi unmount qua React Three Fiber; geometry tự tạo được dispose tường minh.

## Ảnh và kiểm tra nghiệm thu

Chạy server ở terminal thứ nhất; ở terminal thứ hai:

```sh
npm run acceptance
```

Script dùng Playwright với Chrome cài trên Windows; có thể đặt biến `CHROME_PATH` trỏ tới executable Chromium/Chrome khác. Ảnh chụp trực tiếp từ ứng dụng đang chạy, không dựng lại bằng đồ họa. Kết quả và mô tả nằm trong `output/acceptance/`. Xem `CAPTIONS.md` để chọn ảnh và chú thích cho báo cáo.

## Nguồn

- [Bài báo PointPillars, arXiv:1812.05784](https://arxiv.org/abs/1812.05784), mục 2.1 (pillar/encoding), 2.2 (backbone), 3.1 (64 kênh), 4.2 (cấu hình).
- [React Three Fiber: Events](https://r3f.docs.pmnd.rs/api/events) và [Vite: Build](https://vite.dev/guide/build) cho triển khai và kiểm tra ứng dụng.
