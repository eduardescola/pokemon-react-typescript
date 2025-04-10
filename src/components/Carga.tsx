import React, { useEffect, useState } from "react";
import "./Carga.css";

const Carga: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Después de 3 segundos, cambiamos el estado a false
    }, 3000); // 3 segundos de espera para garantizar que la animación dure al menos ese tiempo

    return () => clearTimeout(timer); // Limpiamos el timer cuando el componente se desmonte
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="pokeball-spinner"></div>
      </div>
    );
  }

  return null;
};

export default Carga;
