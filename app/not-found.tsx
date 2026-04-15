// app/not-found.js
export default function NotFound() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>404 - الصفحة غير موجودة</h1>
      <p>عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
      <a href="/">العودة إلى الرئيسية</a>
    </div>
  );
}
