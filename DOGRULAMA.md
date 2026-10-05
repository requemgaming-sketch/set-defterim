# Doğrulama notları

- React + Vite bağımsız kaynak paketi: TypeScript kontrolü ve production build başarılı.
- 5 hesaplama/doğrulama testi geçti: tamamlanan setler, ondalık kg, hareket karşılaştırması, yıl sınırında hafta başlangıcı ve geçersiz set/tarih reddi.
- Gerçek Supabase hesabıyla giriş ve boş geçmişi okuma başarılı.
- Anonim REST okuması: 401 / 42501 (erişim reddedildi).
- Gerçek veritabanında transaction içinde: kendi kaydını ekleme/okuma/güncelleme başarılı, eski revision ile güncelleme engellendi, başka kullanıcı kimliğiyle okuma ve güncelleme engellendi. Test transaction'ı rollback edildi.
- Demo arayüzünde 62,5 kg × 10 tekrarlı iki set: 1.250 kg hacim ve grafik kaydı doğrulandı.
- 390×844 görünümde (iPhone 12 genişliği): yatay sayfa taşması yok; set alanları ve işaretleme erişilebilir. Gerçek iPhone Safari cihaz testi henüz yapılmadı.
- WebMCP geçmiş okuma: doğru şema, geçerli boş istek, geçersiz parametre reddi doğrulandı.
- PWA manifesti, ikonlar ve sürümlenmiş service worker üretildi. Tam çevrimdışı kullanım yok; kalıcı kayıt ve geçmişi yüklemek için internet gerekir.

Gerçek kullanıcının egzersiz geçmişine test/dummy antrenman eklenmedi.
