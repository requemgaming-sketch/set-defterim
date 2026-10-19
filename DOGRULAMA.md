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

## 19 Ekim 2026 güncellemesi
- Gym kaynak bileşeni, repository'si ve önceki migration değiştirilmedi.
- Veritabanında güncelleme öncesi ve sonrası 4 workout kaydı; tüm satırların sıralı içerik özeti aynı.
- Yeni journal_entries tablosu için kendi kayıtlarını ekleme/okuma/güncelleme, eski revision reddi ve farklı kullanıcıya okuma/güncelleme engeli transaction içinde doğrulandı ve rollback edildi.
- İki yeni test: tarih/süre/alan doğrulama ve arşiv/günlük/tarih sınırlarını ayıran öğrenme istatistikleri. Toplam 7 test geçti.
- Demo arayüzünde kariyer ve İngilizce kaydı, sonraki adım, tekrar listesi, günlük hedef, düzenleme ve arşivde koruma doğrulandı. Test kayıtları gerçek hesaba eklenmedi.
