import argostranslate.package

# به‌روزرسانی لیست پکیج‌ها
print("Updating package index...")
argostranslate.package.update_package_index()

# دریافت پکیج‌های موجود
available_packages = argostranslate.package.get_available_packages()
print(f"Found {len(available_packages)} packages")

# پیدا کردن پکیج فارسی به انگلیسی
package_to_install = next(
    filter(
        lambda x: x.from_code == "fa" and x.to_code == "en",
        available_packages
    ),
    None
)

if package_to_install:
    print(f"Downloading {package_to_install.from_code} -> {package_to_install.to_code}...")
    argostranslate.package.install_from_path(package_to_install.download())
    print("✅ Model downloaded successfully.")
else:
    print("❌ Persian -> English package not found.")