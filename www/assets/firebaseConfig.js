define(['https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js', 'https://www.gstatic.com/firebasejs/9.10.0/firebase-database.js'], function (firebaseApp, firebaseDatabase) {
  const firebaseConfig = {
      apiKey: "AIzaSyAwDHB78P8dIcTNEaCx1AtqMfuF5qrK8KU",
      authDomain: "muds-3f20c.firebaseapp.com",
      databaseURL: "https://muds-3f20c-default-rtdb.firebaseio.com",
      projectId: "muds-3f20c",
      storageBucket: "muds-3f20c.appspot.com",
      messagingSenderId: "274850716057",
      appId: "1:274850716057:web:d46e39586bd47ce08fdb08",
      measurementId: "G-4DK42BK0L4"
  };

  const app = firebaseApp.initializeApp(firebaseConfig);
  const db = firebaseDatabase.getDatabase(app);

  return { db };
});
