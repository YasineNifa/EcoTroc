const NotificationBanner = () => (
  <div className="bg-red-100 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
    <div>
      <h2 className="font-bold">Mise à jour de nos Termes et conditions</h2>
      <p className="text-sm">
        Nous mettons à jour nos Termes et conditions. Pour continuer à utiliser
        EcoTroc, vous devez les lire et les accepter d'ici le 8 septembre 2025.
      </p>
    </div>
    <a
      href="#"
      className="bg-teal-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-teal-700 transition-colors whitespace-nowrap"
    >
      Lire les Termes et conditions
    </a>
  </div>
);

export default NotificationBanner;
