- semua views harus ada navbar
- buat route ('/') -> views landing page (button login dan button register)
    - login
        - pindah ke view login ('/login')
        - cek email, password, dan status = verifed (pake findOne)
        - kalo gagal redirect ke view login
        - kalo sukses, pindah ke view homepage
    - register
        - pindah ke view register ('/register')
        - email harus unique
        - jika sukses register, pake mvp nodemailer untuk ngirim kode verifikasi, pindah ke view login
- buat route ('/home') -> views homepage
    - button profile -> kalo profile belum ada pake insert, kalo udah ada pake update (coba aja dulu :) )
    - button beranda ke route ('/user/:id') untuk melihat post sendiri dan bisa delete 
    - button add post muncul bisa post kalo profile sudah ada (post -> include user -> include profile) + tag
    - nampilin semua post + nomor urutan + caption + gambar + tag
    - button likes di setiap post
    - button logout ke route ('/')
    - search berdasarkan tag (tampilkan button nama tag)
    - search berdasarkan caption atau user (coba pake operator or di dalam where)