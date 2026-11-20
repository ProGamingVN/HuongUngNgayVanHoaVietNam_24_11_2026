"""
Nén ảnh trong thư mục docs/media cho web nhẹ hơn.

- Giữ nguyên tên file và định dạng PNG, nên không cần sửa code HTML.
- Giữ nguyên tỉ lệ ảnh, chỉ thu nhỏ cạnh dài tối đa MAX_SIDE px.
- Tự sao lưu ảnh gốc vào thư mục "media_goc" (nằm ngoài docs, không bị đưa lên GitHub).

Cách chạy (trong CMD):
    pip install pillow
    cd C:\\Users\\hdtua\\Downloads\\NgayVanHoaVietNam\\docs\\tools
    python nen-anh.py
"""
import os
import shutil
from PIL import Image

MAX_SIDE = 1600

HERE = os.path.dirname(os.path.abspath(__file__))
MEDIA = os.path.abspath(os.path.join(HERE, "..", "media"))
BACKUP = os.path.abspath(os.path.join(HERE, "..", "..", "media_goc"))

if not os.path.isdir(MEDIA):
    raise SystemExit("Không tìm thấy thư mục media: " + MEDIA)

if not os.path.isdir(BACKUP):
    shutil.copytree(MEDIA, BACKUP)
    print("Đã sao lưu ảnh gốc vào:", BACKUP)

before = after = 0
for name in sorted(os.listdir(MEDIA)):
    if not name.lower().endswith((".png", ".jpg", ".jpeg")):
        continue
    path = os.path.join(MEDIA, name)
    size_before = os.path.getsize(path)
    before += size_before

    img = Image.open(path)
    img.load()
    img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)  # chỉ thu nhỏ, không phóng to

    if name.lower().endswith(".png"):
        img.save(path, "PNG", optimize=True)
    else:
        img.convert("RGB").save(path, "JPEG", quality=85, optimize=True)

    size_after = os.path.getsize(path)
    # Nếu bản nén lại nặng hơn bản gốc thì khôi phục bản gốc
    if size_after >= size_before:
        shutil.copy2(os.path.join(BACKUP, name), path)
        size_after = size_before
    after += size_after
    print("%-16s %6.0f KB -> %6.0f KB" % (name, size_before / 1024, size_after / 1024))

print("\nTổng: %.1f MB -> %.1f MB" % (before / 1048576, after / 1048576))
