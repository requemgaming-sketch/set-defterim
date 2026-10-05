# Set Defterim

Kişisel antrenman günlüğü. React + Vite arayüzü, Supabase Auth + Postgres kalıcı veritabanı.

## Kullanım
- Antrenman gününü seç veya kendin yaz. Hareket adını yazıp Ekle'ye bas.
- Her set için kg ve tekrar gir, yaptığın setin kutusunu işaretle. Grafikleri yalnızca tamamlanan setler besler.
- Değişiklikler yaklaşık bir saniye sonra otomatik kaydedilir. “Buluta kaydedildi” görünmeden kaydın tamamlandığını varsayma.
- İnternet kesilirse açık antrenmanın taslağı bu cihazda saklanır; bağlantı geldiğinde Kaydet/Tekrar dene ile buluta gönderilir. Bu taslak bulut geçmişinin yerine geçmez.
- Geçmişten antrenman açabilir, düzenleyebilir, bugüne kopyalayabilir ve JSON yedeğini indirebilirsin.
- iPhone: Safari > Paylaş > Ana Ekrana Ekle. İlk açılış, geçmişi yükleme ve senkronizasyon için internet gerekir.

## Bağımsız çalıştırma
Node.js 24:

    npm ci
    npm run dev
    npm test
    npm run build
    npm run preview

Sunucu tarafında Sites API'si, Sites veritabanı veya ChatGPT girişine bağımlılık yoktur. Sites hostingi özel yayın sınırı koyabilir; başka hostta yalnızca Supabase girişi kalır.

public/config.json dosyası yalnızca Supabase proje URL'sini ve public/publishable anahtarını içerir. Bunlar gizli değildir. İsteğe bağlı .env.example içindeki VITE_ değişkenleriyle derleme sırasında değiştirebilirsin. service_role, sb_secret veya veritabanı parolası hiçbir zaman tarayıcıya/depoya konmaz.

## Veritabanı ve güvenlik
supabase/migrations/202610050001_workouts.sql, boş bir Supabase projesinde bir kez çalıştırılır. Mevcut projemizde uygulanmıştır; aynı veritabanına tekrar çalıştırma.

- Her satır auth.users hesabına bağlıdır.
- RLS select/insert/update/delete işlemlerini auth.uid() ile sınırlar.
- Anonim kullanıcı tablolara erişemez.
- Güncelleme revision kontrolü ile eşzamanlı düzenlemelerde sessiz veri kaybını engeller.
- Client verileri Zod ile doğrular; veritabanı temel belge, kimlik, boyut ve revision kısıtlarını uygular.
- Tarayıcı depolaması yalnızca Supabase oturumunu ve kaydedilmemiş cihaz taslağını tutar. Asıl geçmiş Postgres'tedir.

## Hosting taşıma
Aynı public/config.json ve aynı Supabase projesi korunursa veri taşımak gerekmez.
1. Kaynak kodunu GitHub reposuna yükle.
2. GitHub Pages iş akışı .github/workflows/pages.yml içinde hazırdır; repo Settings > Pages > Source: GitHub Actions seç. Vercel için hazır vercel.json kullanılır.
3. Supabase Authentication > URL Configuration bölümünde yeni tam uygulama adresini Site URL olarak ayarla; onay/şifre yenileme akışları için izinli Redirect URLs listesine yeni adresi ekle.
4. Yeni adreste aynı uygulama hesabıyla giriş yap. Supabase oturumunu yeni domainde yeniden açmak gerekir; antrenmanlar değişmez.

Uygulama tek sayfalıdır, sunucu route fallback gerektirmez. Vite base='./', göreli varlık URL'leri, göreli manifest start_url ve service worker scope'u /repo/ alt yolunda çalışmayı destekler. Dağıtım çıktısı dist/ klasörüdür.

## Ücretsiz plan sınırları
Uygulama ücretli API kullanmaz. Supabase Free kotası ve düşük aktivitede duraklatma koşulları geçerlidir. Sites kullanımının mevcut ChatGPT planına dahil olması, ChatGPT aboneliğinden bağımsız ücretsiz hosting anlamına gelmez. Kaynak kodu ücretsiz hostlara taşınabilir. JSON dışa aktarımı anlık yedektir, otomatik zamanlanmış veritabanı yedeği değildir.

## Demo
?demo=1 ile bellek içi örnek veriler açılır. Gerçek veritabanını değiştirmez, yenilemede sıfırlanır ve ekranda Demo etiketi gösterilir.
